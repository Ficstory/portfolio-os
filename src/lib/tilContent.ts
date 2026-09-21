import { existsSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

import type {
  AcademyJourney,
  TILCategoryMeta,
  TILEntry,
  TILResource,
} from "../types/til";

export type TILSourceStatus = "draft" | "published";

export type TILSourceEntry = TILEntry & {
  status: TILSourceStatus;
  sourcePath: string;
};

export type TILContentConfig = {
  categories: TILCategoryMeta[];
  journey: AcademyJourney;
};

export type TILContentBundle = TILContentConfig & {
  entries: TILEntry[];
};

const SECTION_KEYS = {
  "오늘 배운 것": "learned",
  "직접 시도한 것": "tried",
  "막혔던 지점": "blocked",
  "새롭게 이해한 것": "insights",
  "다음 액션": "nextActions",
  "관련 역량": "skills",
  "관련 자료": "resources",
} as const;

const REQUIRED_SECTIONS = Object.keys(SECTION_KEYS);
const TONES = new Set(["lavender", "green", "blue", "amber", "rose"]);
const RESOURCE_TYPES = new Set(["project", "document", "github", "til"]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const KST_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KST_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1000;

function failure(sourcePath: string, message: string): Error {
  return new Error(`${sourcePath}: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(
  value: unknown,
  field: string,
  sourcePath: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw failure(sourcePath, `${field} must be a non-empty string`);
  }

  return value.trim();
}

function parseBoolean(value: string, field: string, sourcePath: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw failure(sourcePath, `${field} must be true or false`);
}

function validateLearningDate(value: string, sourcePath: string) {
  if (!DATE_PATTERN.test(value)) {
    throw failure(sourcePath, `invalid date: ${value}`);
  }

  const milliseconds = Date.parse(`${value}T00:00:00Z`);
  if (
    Number.isNaN(milliseconds) ||
    new Date(milliseconds).toISOString().slice(0, 10) !== value
  ) {
    throw failure(sourcePath, `invalid date: ${value}`);
  }
}

function parseFrontmatter(markdown: string, sourcePath: string) {
  const normalized = markdown.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);

  if (!match) {
    throw failure(sourcePath, "must begin with a --- frontmatter block");
  }

  const metadata: Record<string, string> = {};

  for (const [index, line] of match[1].split("\n").entries()) {
    if (!line.trim()) continue;
    const separator = line.indexOf(":");
    if (separator < 1) {
      throw failure(sourcePath, `invalid frontmatter line ${index + 2}`);
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key in metadata) {
      throw failure(sourcePath, `duplicate frontmatter key: ${key}`);
    }
    metadata[key] = value;
  }

  const allowed = new Set([
    "id",
    "slug",
    "date",
    "createdAt",
    "updatedAt",
    "session",
    "category",
    "title",
    "summary",
    "status",
    "isDemo",
  ]);
  const unknown = Object.keys(metadata).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    throw failure(sourcePath, `unknown frontmatter key(s): ${unknown.join(", ")}`);
  }

  return { metadata, body: match[2] };
}

function parseSections(body: string, sourcePath: string) {
  const sections = new Map<string, string[]>();
  let activeHeading: string | null = null;

  for (const line of body.split("\n")) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      activeHeading = heading[1];
      if (!(activeHeading in SECTION_KEYS)) {
        throw failure(sourcePath, `unknown section: ${activeHeading}`);
      }
      if (sections.has(activeHeading)) {
        throw failure(sourcePath, `duplicate section: ${activeHeading}`);
      }
      sections.set(activeHeading, []);
      continue;
    }

    if (activeHeading && line.trim() && !line.trim().startsWith("<!--")) {
      sections.get(activeHeading)?.push(line.trim());
    }
  }

  const missing = REQUIRED_SECTIONS.filter((heading) => !sections.has(heading));
  if (missing.length > 0) {
    throw failure(sourcePath, `missing section(s): ${missing.join(", ")}`);
  }

  return sections;
}

function parseBullets(lines: string[], heading: string, sourcePath: string) {
  const values = lines.map((line) => {
    const bullet = line.match(/^-\s+(.+)$/);
    if (!bullet) {
      throw failure(sourcePath, `${heading} only accepts Markdown bullet items`);
    }
    return bullet[1].trim();
  });

  if (values.length === 0) {
    throw failure(sourcePath, `${heading} must contain at least one item`);
  }

  return values;
}

function parseActions(lines: string[], sourcePath: string) {
  const seen = new Set<string>();
  return parseBullets(lines, "다음 액션", sourcePath).map((line) => {
    const match = line.match(/^\[([ xX])\]\s+([a-z0-9-]+)\s+\|\s+(.+)$/);
    if (!match) {
      throw failure(
        sourcePath,
        "next action format must be: - [ ] action-id | action text",
      );
    }
    const [, checked, id, text] = match;
    if (seen.has(id)) {
      throw failure(sourcePath, `duplicate next action id: ${id}`);
    }
    seen.add(id);
    return {
      id,
      text: text.trim(),
      status: checked.toLowerCase() === "x" ? ("done" as const) : ("planned" as const),
    };
  });
}

function isValidHref(href: string) {
  if (href.startsWith("/")) return !href.startsWith("//");
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function parseResources(lines: string[], sourcePath: string): TILResource[] {
  const seen = new Set<string>();

  return lines
    .filter((line) => !/^<!--.*-->$/.test(line))
    .map((line) => {
      const bullet = line.match(/^-\s+(.+)$/);
      if (!bullet) {
        throw failure(sourcePath, "관련 자료 only accepts Markdown bullet items");
      }
      const parts = bullet[1].split("|").map((part) => part.trim());
      if (parts.length < 3 || parts.length > 4) {
        throw failure(
          sourcePath,
          "resource format must be: - type | resource-id | [title](href) | optional description",
        );
      }
      const [type, id, markdownLink, description] = parts;
      const link = markdownLink.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
      if (!RESOURCE_TYPES.has(type)) {
        throw failure(sourcePath, `invalid resource type: ${type}`);
      }
      if (!SLUG_PATTERN.test(id)) {
        throw failure(sourcePath, `invalid resource id: ${id}`);
      }
      if (seen.has(id)) {
        throw failure(sourcePath, `duplicate resource id: ${id}`);
      }
      if (!link || !isValidHref(link[2])) {
        throw failure(sourcePath, `invalid resource link: ${markdownLink}`);
      }
      seen.add(id);
      return {
        id,
        type: type as TILResource["type"],
        title: link[1].trim(),
        ...(description ? { description } : {}),
        href: link[2],
      };
    });
}

export function parseTILMarkdown(
  markdown: string,
  sourcePath = "<memory>",
): TILSourceEntry {
  const { metadata, body } = parseFrontmatter(markdown, sourcePath);
  const sections = parseSections(body, sourcePath);
  const id = requireString(metadata.id, "id", sourcePath);
  const slug = requireString(metadata.slug, "slug", sourcePath);
  const date = requireString(metadata.date, "date", sourcePath);
  const createdAt = requireString(metadata.createdAt, "createdAt", sourcePath);
  const updatedAt = requireString(metadata.updatedAt, "updatedAt", sourcePath);
  const category = requireString(metadata.category, "category", sourcePath);
  const status = requireString(metadata.status, "status", sourcePath);

  if (!SLUG_PATTERN.test(id)) throw failure(sourcePath, `invalid id: ${id}`);
  if (!SLUG_PATTERN.test(slug)) throw failure(sourcePath, `invalid slug: ${slug}`);
  validateLearningDate(date, sourcePath);
  const createdAtTime = parseKSTTimestamp(createdAt, "createdAt", sourcePath);
  const updatedAtTime = parseKSTTimestamp(updatedAt, "updatedAt", sourcePath);
  if (updatedAtTime < createdAtTime) {
    throw failure(sourcePath, "updatedAt must be greater than or equal to createdAt");
  }
  if (status !== "draft" && status !== "published") {
    throw failure(sourcePath, "status must be draft or published");
  }

  const entry: TILSourceEntry = {
    id,
    slug,
    date,
    createdAt,
    updatedAt,
    ...(metadata.session ? { session: metadata.session } : {}),
    category: category as TILEntry["category"],
    title: requireString(metadata.title, "title", sourcePath),
    summary: requireString(metadata.summary, "summary", sourcePath),
    status,
    isDemo: metadata.isDemo
      ? parseBoolean(metadata.isDemo, "isDemo", sourcePath)
      : false,
    learned: parseBullets(sections.get("오늘 배운 것") ?? [], "오늘 배운 것", sourcePath),
    tried: parseBullets(sections.get("직접 시도한 것") ?? [], "직접 시도한 것", sourcePath),
    blocked: parseBullets(sections.get("막혔던 지점") ?? [], "막혔던 지점", sourcePath),
    insights: parseBullets(sections.get("새롭게 이해한 것") ?? [], "새롭게 이해한 것", sourcePath),
    nextActions: parseActions(sections.get("다음 액션") ?? [], sourcePath),
    skills: parseBullets(sections.get("관련 역량") ?? [], "관련 역량", sourcePath),
    resources: parseResources(sections.get("관련 자료") ?? [], sourcePath),
    sourcePath,
  };

  return entry;
}

export function readTILConfig(contentRoot: string): TILContentConfig {
  const configPath = path.join(contentRoot, "config.json");
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    throw failure(configPath, `cannot read valid JSON (${String(error)})`);
  }
  if (!isRecord(raw) || !Array.isArray(raw.categories) || !isRecord(raw.journey)) {
    throw failure(configPath, "must define categories[] and journey");
  }

  const categoryIds = new Set<string>();
  const categories = raw.categories.map((candidate, index) => {
    if (!isRecord(candidate)) {
      throw failure(configPath, `categories[${index}] must be an object`);
    }
    const id = requireString(candidate.id, `categories[${index}].id`, configPath);
    const label = requireString(candidate.label, `categories[${index}].label`, configPath);
    const tone = requireString(candidate.tone, `categories[${index}].tone`, configPath);
    if (!SLUG_PATTERN.test(id)) throw failure(configPath, `invalid category id: ${id}`);
    if (categoryIds.has(id)) throw failure(configPath, `duplicate category id: ${id}`);
    if (!TONES.has(tone)) throw failure(configPath, `invalid category tone: ${tone}`);
    categoryIds.add(id);
    return { id, label, tone } as TILCategoryMeta;
  });
  if (categories.length === 0) throw failure(configPath, "categories must not be empty");

  const progress = raw.journey.progress;
  let parsedProgress: AcademyJourney["progress"];
  if (progress !== undefined) {
    if (!isRecord(progress)) throw failure(configPath, "journey.progress must be an object");
    const current = progress.current;
    const total = progress.total;
    if (typeof current !== "number" || typeof total !== "number" || current < 0 || total <= 0 || current > total) {
      throw failure(configPath, "journey progress requires 0 <= current <= total and total > 0");
    }
    parsedProgress = {
      current,
      total,
      unitLabel: requireString(progress.unitLabel, "journey.progress.unitLabel", configPath),
    };
  }

  return {
    categories,
    journey: {
      label: requireString(raw.journey.label, "journey.label", configPath),
      status: requireString(raw.journey.status, "journey.status", configPath),
      ...(parsedProgress ? { progress: parsedProgress } : {}),
    },
  };
}

function markdownFiles(directory: string) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(directory, entry.name))
    .toSorted();
}

function readEntries(directory: string, expectedStatus: TILSourceStatus) {
  return markdownFiles(directory).map((sourcePath) => {
    const entry = parseTILMarkdown(readFileSync(sourcePath, "utf8"), sourcePath);
    if (entry.status !== expectedStatus) {
      throw failure(sourcePath, `status must be ${expectedStatus} in this directory`);
    }
    if (path.basename(sourcePath) !== `${entry.slug}.md`) {
      throw failure(sourcePath, `filename must match slug (${entry.slug}.md)`);
    }
    return entry;
  });
}

function relatedTILSlug(resource: TILResource) {
  if (resource.type !== "til") return null;
  try {
    const url = new URL(resource.href, "https://portfolio.local");
    return url.searchParams.get("entry");
  } catch {
    return null;
  }
}

function validateEntries(entries: TILSourceEntry[], config: TILContentConfig) {
  const ids = new Map<string, string>();
  const slugs = new Map<string, string>();
  const entriesBySlug = new Map<string, TILSourceEntry>();
  const categoryIds = new Set(config.categories.map((category) => category.id));

  for (const entry of entries) {
    const duplicateId = ids.get(entry.id);
    if (duplicateId) throw failure(entry.sourcePath, `duplicate id ${entry.id} (also in ${duplicateId})`);
    const duplicateSlug = slugs.get(entry.slug);
    if (duplicateSlug) throw failure(entry.sourcePath, `duplicate slug ${entry.slug} (also in ${duplicateSlug})`);
    if (!categoryIds.has(entry.category)) {
      throw failure(entry.sourcePath, `unknown category: ${entry.category}`);
    }
    ids.set(entry.id, entry.sourcePath);
    slugs.set(entry.slug, entry.sourcePath);
    entriesBySlug.set(entry.slug, entry);
  }

  for (const entry of entries) {
    for (const resource of entry.resources) {
      const relatedSlug = relatedTILSlug(resource);
      if (resource.type === "til" && (!relatedSlug || !slugs.has(relatedSlug))) {
        throw failure(entry.sourcePath, `related TIL link does not resolve: ${resource.href}`);
      }
      if (
        entry.status === "published" &&
        relatedSlug &&
        entriesBySlug.get(relatedSlug)?.status !== "published"
      ) {
        throw failure(entry.sourcePath, `published entry links to a draft TIL: ${relatedSlug}`);
      }
    }
  }
}

export function validateTILContent(contentRoot: string) {
  const config = readTILConfig(contentRoot);
  const published = readEntries(path.join(contentRoot, "published"), "published");
  const drafts = readEntries(path.join(contentRoot, "drafts"), "draft");
  const entries = [...published, ...drafts];
  validateEntries(entries, config);
  return { ...config, published, drafts };
}

export function loadPublishedTILContent(
  projectRoot = process.cwd(),
): TILContentBundle {
  const contentRoot = path.join(projectRoot, "content", "til");
  const config = readTILConfig(contentRoot);
  const sourceEntries = readEntries(path.join(contentRoot, "published"), "published");
  validateEntries(sourceEntries, config);
  const entries = sourceEntries
    .map((sourceEntry) => {
      const { status, sourcePath, ...entry } = sourceEntry;
      void status;
      void sourcePath;
      return entry;
    })
    .toSorted((a, b) => b.date.localeCompare(a.date));
  return { ...config, entries };
}

function assertSafeSlug(slug: string) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Unsafe or invalid slug: ${slug}`);
  }
}

function parseKSTTimestamp(value: string, field: string, sourcePath: string) {
  if (!KST_TIMESTAMP_PATTERN.test(value)) {
    throw failure(
      sourcePath,
      `${field} must be an ISO-8601 KST timestamp ending in +09:00`,
    );
  }
  const milliseconds = Date.parse(value);
  if (Number.isNaN(milliseconds)) {
    throw failure(sourcePath, `${field} is not a valid timestamp: ${value}`);
  }
  const normalized = new Date(milliseconds + KST_OFFSET_MILLISECONDS)
    .toISOString()
    .replace(".000Z", "+09:00");
  if (normalized !== value) {
    throw failure(sourcePath, `${field} is not a valid timestamp: ${value}`);
  }
  return milliseconds;
}

export function formatKSTTimestamp(date = new Date()) {
  return new Date(date.getTime() + KST_OFFSET_MILLISECONDS)
    .toISOString()
    .replace(/\.\d{3}Z$/, "+09:00");
}

function replaceLifecycleMetadata(
  markdown: string,
  from: TILSourceStatus,
  to: TILSourceStatus,
  updatedAt: string,
) {
  const pattern = new RegExp(`(^|\\n)status: ${from}(?=\\n)`);
  if (!pattern.test(markdown)) throw new Error(`Expected status: ${from}`);
  if (!/(^|\n)updatedAt: .+(?=\n)/.test(markdown)) {
    throw new Error("Expected updatedAt frontmatter");
  }
  return markdown
    .replace(pattern, `$1status: ${to}`)
    .replace(/(^|\n)updatedAt: .+(?=\n)/, `$1updatedAt: ${updatedAt}`);
}

function lifecycleTimestamp(entry: TILSourceEntry, now: Date, operation: string) {
  const updatedAt = formatKSTTimestamp(now);
  if (Date.parse(updatedAt) < Date.parse(entry.updatedAt)) {
    throw new Error(
      `${operation} timestamp cannot precede the existing updatedAt (${entry.updatedAt})`,
    );
  }
  return updatedAt;
}

export function publishTIL(contentRoot: string, slug: string, now = new Date()) {
  assertSafeSlug(slug);
  const source = path.join(contentRoot, "drafts", `${slug}.md`);
  const target = path.join(contentRoot, "published", `${slug}.md`);
  if (!existsSync(source)) throw new Error(`Draft not found: ${slug}`);
  if (existsSync(target)) throw new Error(`Published target already exists: ${slug}`);
  const entry = parseTILMarkdown(readFileSync(source, "utf8"), source);
  if (entry.slug !== slug || entry.status !== "draft") {
    throw failure(source, "slug/status does not match requested draft");
  }
  validateTILContent(contentRoot);
  const updated = replaceLifecycleMetadata(
    readFileSync(source, "utf8"),
    "draft",
    "published",
    lifecycleTimestamp(entry, now, "Publish"),
  );
  writeFileSync(source, updated, "utf8");
  renameSync(source, target);
  validateTILContent(contentRoot);
  return target;
}

export function unpublishTIL(contentRoot: string, slug: string, now = new Date()) {
  assertSafeSlug(slug);
  const source = path.join(contentRoot, "published", `${slug}.md`);
  const target = path.join(contentRoot, "drafts", `${slug}.md`);
  if (!existsSync(source)) throw new Error(`Published entry not found: ${slug}`);
  if (existsSync(target)) throw new Error(`Draft target already exists: ${slug}`);
  const entry = parseTILMarkdown(readFileSync(source, "utf8"), source);
  if (entry.slug !== slug || entry.status !== "published") {
    throw failure(source, "slug/status does not match requested published entry");
  }
  const archive = validateTILContent(contentRoot);
  const inboundPublished = archive.published
    .filter((candidate) => candidate.slug !== slug)
    .filter((candidate) =>
      candidate.resources.some((resource) => relatedTILSlug(resource) === slug),
    )
    .map((candidate) => candidate.slug);
  if (inboundPublished.length > 0) {
    throw new Error(
      `Cannot unpublish ${slug}; referenced by published entries: ${inboundPublished.join(", ")}`,
    );
  }
  const updated = replaceLifecycleMetadata(
    readFileSync(source, "utf8"),
    "published",
    "draft",
    lifecycleTimestamp(entry, now, "Unpublish"),
  );
  writeFileSync(source, updated, "utf8");
  renameSync(source, target);
  validateTILContent(contentRoot);
  return target;
}

export function deleteTIL(
  contentRoot: string,
  slug: string,
  scope: "drafts" | "published",
) {
  assertSafeSlug(slug);
  if (scope !== "drafts" && scope !== "published") {
    throw new Error("Delete scope must be drafts or published");
  }
  const target = path.join(contentRoot, scope, `${slug}.md`);
  if (!existsSync(target)) throw new Error(`Exact delete target not found: ${scope}/${slug}.md`);
  const { drafts, published } = validateTILContent(contentRoot);
  const targetEntry = [...drafts, ...published].find(
    (entry) => entry.sourcePath === target,
  );
  if (!targetEntry || targetEntry.slug !== slug) {
    throw new Error(`Delete target does not match slug: ${slug}`);
  }
  const inbound = [...drafts, ...published]
    .filter((entry) => entry.slug !== slug)
    .filter((entry) => entry.resources.some((resource) => relatedTILSlug(resource) === slug))
    .map((entry) => entry.slug);
  if (inbound.length > 0) {
    throw new Error(`Cannot delete ${slug}; referenced by: ${inbound.join(", ")}`);
  }
  unlinkSync(target);
  return target;
}

import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

import type {
  AcademyJourney,
  TILCategoryMeta,
  TILEntry,
  TILResource,
  TILBlock,
  TILReflectionKey,
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
  let inPrompt = false;

  for (const line of body.split("\n")) {
    if (inPrompt) {
      if (activeHeading) sections.get(activeHeading)?.push(line);
      if (line.trim() === "```") inPrompt = false;
      continue;
    }
    if (line.trim() === "```prompt") {
      if (!activeHeading || !Object.keys(SECTION_KEYS).slice(0, 4).includes(activeHeading)) {
        throw failure(sourcePath, "prompt must belong to a reflection section");
      }
      sections.get(activeHeading)?.push(line.trim());
      inPrompt = true;
      continue;
    }
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

  if (inPrompt) throw failure(sourcePath, "unclosed prompt fence");
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

function mediaFilename(src: string, slug: string, kind: "image" | "video", sourcePath: string) {
  const prefix = `/til/media/${slug}/`;
  const filename = src.startsWith(prefix) ? src.slice(prefix.length) : "";
  const pattern = kind === "image" ? /^[a-zA-Z0-9_-]+\.(png|jpe?g|webp|gif|avif)$/i : /^[a-zA-Z0-9_-]+\.(mp4|webm|ogv)$/i;
  if (!pattern.test(filename)) throw failure(sourcePath, `invalid ${kind} media URL; use ${prefix}filename with a supported extension`);
  return filename;
}

function parseReflection(lines: string[], heading: string, slug: string, sourcePath: string): TILBlock[] {
  const blocks: TILBlock[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === "```prompt") {
      const media = blocks.at(-1);
      if (!media || media.type === "paragraph") throw failure(sourcePath, "prompt requires a preceding media item");
      if (media.prompt !== undefined) throw failure(sourcePath, "duplicate prompt for media item");
      const promptLines: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== "```") {
        promptLines.push(lines[index]);
        index += 1;
      }
      if (index === lines.length) throw failure(sourcePath, "unclosed prompt fence");
      const prompt = promptLines.join("\n");
      if (!prompt.trim()) throw failure(sourcePath, "empty prompt is not allowed");
      media.prompt = prompt;
    } else {
      blocks.push(parseReflectionBlock(line, heading, slug, sourcePath));
    }
  }
  return blocks;
}

function parseReflectionBlock(line: string, heading: string, slug: string, sourcePath: string): TILBlock {
    const text = line.replace(/^-\s+/, "").trim();
    const mediaSyntax = /^(?:!\[|\[(?:video|youtube):)/.test(text);
    const media = mediaSyntax ? text.match(/^(!?)\[([^\]]+)\]\(([^\s)]+)\)(.*)$/) : null;
    if (!media) {
      if (mediaSyntax || /<\/?[a-z][^>]*>/i.test(text)) throw failure(sourcePath, `invalid media or raw HTML in ${heading}`);
      return { type: "paragraph", text };
    }
    const [, image, label, src, suffix] = media;
    const type = image ? "image" : label.startsWith("video: ") ? "video" : label.startsWith("youtube: ") ? "youtube" : null;
    if (!type) throw failure(sourcePath, "media link requires video: or youtube: title");
    const parts = suffix.split("|").map((part) => part.trim());
    const size = parts[1]?.match(/^([1-9]\d{0,4})x([1-9]\d{0,4})$/);
    if (parts[0] || !size || parts.length > (type === "video" ? 4 : 3)) throw failure(sourcePath, "media dimensions required: | WIDTHxHEIGHT | optional caption");
    const common = { src, width: Number(size[1]), height: Number(size[2]), ...(parts[2] ? { caption: parts[2] } : {}) };
    if (type === "image") {
      mediaFilename(src, slug, "image", sourcePath);
      return { type, alt: requireString(label, "image alt", sourcePath), ...common };
    }
    const title = requireString(label.slice(type.length + 2), "media title", sourcePath);
    if (type === "youtube") {
      if (!/^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/.test(src)) throw failure(sourcePath, "YouTube URL must be https://www.youtube.com/watch?v=VIDEO_ID (11 characters)");
      return { type, title, ...common };
    }
    mediaFilename(src, slug, "video", sourcePath);
    if (parts[3]) mediaFilename(parts[3], slug, "image", sourcePath);
    return { type, title, ...common, ...(parts[3] ? { poster: parts[3] } : {}) };
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

  const reflections = Object.fromEntries(Object.entries(SECTION_KEYS).slice(0, 4).map(([heading, key]) => [key, parseReflection(sections.get(heading) ?? [], heading, slug, sourcePath)])) as Record<TILReflectionKey, TILBlock[]>;
  const blocks = Object.fromEntries(Object.entries(reflections).filter(([, values]) => values.some((block) => block.type !== "paragraph")));
  const paragraphs = (key: TILReflectionKey) => reflections[key].flatMap((block) => block.type === "paragraph" ? [block.text] : []);
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
    learned: paragraphs("learned"),
    tried: paragraphs("tried"),
    blocked: paragraphs("blocked"),
    insights: paragraphs("insights"),
    ...(Object.keys(blocks).length ? { blocks } : {}),
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
  assertNoSymlinkAncestor(path.resolve(directory));
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => {
      if (entry.name.endsWith(".md") && entry.isSymbolicLink()) throw new Error(`Markdown symlinks are not supported: ${path.join(directory, entry.name)}`);
      return entry.isFile() && entry.name.endsWith(".md");
    })
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

function localMedia(entry: TILEntry) {
  return [...new Set(Object.values(entry.blocks ?? {}).flatMap((blocks) => blocks.flatMap((block) => {
    if (block.type === "image") return [block.src];
    if (block.type === "video") return [block.src, ...(block.poster ? [block.poster] : [])];
    return [];
  })))];
}

function assetPath(contentRoot: string, entry: TILSourceEntry, src: string) {
  const root = path.resolve(contentRoot, ...(entry.status === "draft" ? ["drafts", "media"] : ["media"]));
  const target = path.resolve(root, entry.slug, path.basename(src));
  if (!target.startsWith(root + path.sep)) throw failure(entry.sourcePath, "media path escapes source directory");
  if (!existsSync(target) || !lstatSync(target).isFile()) throw failure(entry.sourcePath, `missing media file: ${target}`);
  if (!realpathSync(target).startsWith(path.resolve(contentRoot) + path.sep) || realpathSync(target) !== target) throw failure(entry.sourcePath, `symlink media is not supported: ${target}`);
  return target;
}

function validateMedia(contentRoot: string, entries: TILSourceEntry[]) {
  for (const entry of entries) for (const src of localMedia(entry)) assetPath(contentRoot, entry, src);
}

function generatedMediaRoot(contentRoot: string) {
  // Custom content roots must retain the project/content/til convention.
  if (path.basename(contentRoot) !== "til" || path.basename(path.dirname(contentRoot)) !== "content") return null;
  return path.resolve(contentRoot, "..", "..", "public", "til", "media");
}

function assertNoSymlinkAncestor(target: string) {
  let existing = target;
  while (!existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) throw new Error(`Cannot resolve media parent: ${target}`);
    existing = parent;
  }
  if (realpathSync(existing) !== existing) throw new Error(`Media directory cannot use symlinks: ${target}`);
}

function removeGeneratedMedia(contentRoot: string, slug: string) {
  const root = generatedMediaRoot(contentRoot);
  if (!root) return;
  const target = path.resolve(root, slug);
  if (!target.startsWith(root + path.sep)) throw new Error("Generated media path escaped its root");
  assertNoSymlinkAncestor(root);
  rmSync(target, { recursive: true, force: true });
}

export function stageTILMedia(projectRoot = process.cwd()) {
  const contentRoot = path.resolve(projectRoot, "content", "til");
  const config = readTILConfig(contentRoot);
  const entries = readEntries(path.join(contentRoot, "published"), "published");
  validateEntries(entries, config);
  validateMedia(contentRoot, entries);
  const root = path.resolve(projectRoot, "public", "til", "media");
  const publicRoot = path.resolve(projectRoot, "public");
  if (!root.startsWith(publicRoot + path.sep)) throw new Error("Generated media directory escaped public root");
  assertNoSymlinkAncestor(root);
  rmSync(root, { recursive: true, force: true });
  for (const entry of entries) for (const src of localMedia(entry)) {
    const target = path.join(root, entry.slug, path.basename(src));
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(assetPath(contentRoot, entry, src), target);
  }
  return entries.reduce((count, entry) => count + localMedia(entry).length, 0);
}

function moveMedia(contentRoot: string, entry: TILSourceEntry, status: TILSourceStatus) {
  const moves = localMedia(entry).map((src) => {
    const source = assetPath(contentRoot, entry, src);
    const target = path.resolve(contentRoot, ...(status === "draft" ? ["drafts", "media"] : ["media"]), entry.slug, path.basename(src));
    if (existsSync(target)) throw failure(entry.sourcePath, `media target already exists; resolve it before changing publication: ${target}`);
    return { source, target };
  });
  for (const { target } of moves) {
    assertNoSymlinkAncestor(path.dirname(target));
    mkdirSync(path.dirname(target), { recursive: true });
    if (realpathSync(path.dirname(target)) !== path.dirname(target)) throw new Error("Media destination cannot be a symlink");
  }
  const moved: typeof moves = [];
  try {
    for (const move of moves) { renameSync(move.source, move.target); moved.push(move); }
  } catch (error) {
    for (const move of moved.reverse()) renameSync(move.target, move.source);
    throw error;
  }
}

export function validateTILContent(contentRoot: string) {
  const config = readTILConfig(contentRoot);
  const published = readEntries(path.join(contentRoot, "published"), "published");
  const drafts = readEntries(path.join(contentRoot, "drafts"), "draft");
  const entries = [...published, ...drafts];
  validateEntries(entries, config);
  validateMedia(contentRoot, entries);
  return { ...config, published, drafts };
}

export function loadPublishedTILContent(
  projectRoot = process.cwd(),
): TILContentBundle {
  const contentRoot = path.join(projectRoot, "content", "til");
  const config = readTILConfig(contentRoot);
  const sourceEntries = readEntries(path.join(contentRoot, "published"), "published");
  validateEntries(sourceEntries, config);
  validateMedia(contentRoot, sourceEntries);
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

function transitionTIL(contentRoot: string, entry: TILSourceEntry, target: string, status: TILSourceStatus, updated: string) {
  const source = entry.sourcePath;
  const original = readFileSync(source, "utf8");
  let mediaMoved = false;
  let markdownMoved = false;
  try {
    moveMedia(contentRoot, entry, status);
    mediaMoved = true;
    writeFileSync(source, updated, "utf8");
    renameSync(source, target);
    markdownMoved = true;
    validateTILContent(contentRoot);
    if (status === "draft") removeGeneratedMedia(contentRoot, entry.slug);
  } catch (error) {
    const rollbackErrors: unknown[] = [];
    try {
      if (markdownMoved) renameSync(target, source);
      writeFileSync(source, original, "utf8");
    } catch (rollbackError) { rollbackErrors.push(rollbackError); }
    try {
      if (mediaMoved) moveMedia(contentRoot, { ...entry, status }, entry.status);
    } catch (rollbackError) { rollbackErrors.push(rollbackError); }
    // A failed cleanup can have removed some generated files. Restore published references.
    if (entry.status === "published" && generatedMediaRoot(contentRoot)) {
      try { stageTILMedia(path.resolve(contentRoot, "..", "..")); }
      catch (rollbackError) { rollbackErrors.push(rollbackError); }
    }
    if (rollbackErrors.length) throw new AggregateError([error, ...rollbackErrors], `TIL transition failed and rollback needs attention: ${entry.slug}`);
    throw error;
  }
}

export function publishTIL(contentRoot: string, slug: string, now = new Date()) {
  assertSafeSlug(slug);
  const source = path.join(contentRoot, "drafts", `${slug}.md`);
  const target = path.join(contentRoot, "published", `${slug}.md`);
  assertNoSymlinkAncestor(path.resolve(source));
  assertNoSymlinkAncestor(path.resolve(target));
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
  const archive = validateTILContent(contentRoot);
  if (entry.resources.some((resource) => {
    const linked = relatedTILSlug(resource);
    return linked && linked !== slug && !archive.published.some((candidate) => candidate.slug === linked);
  })) throw new Error("Cannot publish an entry linking to a private draft; publish linked entries first");
  transitionTIL(contentRoot, entry, target, "published", updated);
  return target;
}

export function unpublishTIL(contentRoot: string, slug: string, now = new Date()) {
  assertSafeSlug(slug);
  const source = path.join(contentRoot, "published", `${slug}.md`);
  const target = path.join(contentRoot, "drafts", `${slug}.md`);
  assertNoSymlinkAncestor(path.resolve(source));
  assertNoSymlinkAncestor(path.resolve(target));
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
  transitionTIL(contentRoot, entry, target, "draft", updated);
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
  assertNoSymlinkAncestor(path.resolve(target));
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
  removeGeneratedMedia(contentRoot, slug);
  return target;
}

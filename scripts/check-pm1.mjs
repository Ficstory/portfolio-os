#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE_URL = "http://127.0.0.1:3001";
const DEFAULT_JSON_PATH = ".codex_tmp/pm1/checks.json";

function parseArguments(argv) {
  let baseUrl = DEFAULT_BASE_URL;
  let jsonPath = null;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--json") {
      const next = argv[index + 1];
      jsonPath = next && !next.startsWith("--") ? next : DEFAULT_JSON_PATH;
      if (jsonPath === next) index += 1;
    } else if (!argument.startsWith("--")) {
      baseUrl = argument;
    }
  }

  return { baseUrl: new URL(baseUrl), jsonPath };
}

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&(apos|quot|amp|lt|gt);/gi, (_, name) => ({ apos: "'", quot: '"', amp: "&", lt: "<", gt: ">" })[name.toLowerCase()]);
}

function textContent(html) {
  return decodeHtml(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
}

function collectTags(html, expression) {
  return [...html.matchAll(expression)].map((match) => match[0]);
}

function srcSetUrls(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
    .filter(Boolean);
}

function localResourceUrl(value, pageUrl, baseUrl) {
  try {
    const resolved = new URL(value, pageUrl);
    if (resolved.origin === baseUrl.origin) return resolved;
    const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
    const sameLocalServer = loopbackHosts.has(resolved.hostname)
      && loopbackHosts.has(baseUrl.hostname)
      && resolved.port === baseUrl.port
      && resolved.protocol === baseUrl.protocol;
    if (resolved.origin === "https://ficstory.dev" || sameLocalServer) {
      return new URL(`${resolved.pathname}${resolved.search}`, baseUrl);
    }
  } catch {
    // Invalid URLs are ignored and will be caught by the page-level assertions.
  }
  return null;
}

function contentTypeMatches(kind, contentType) {
  const normalized = contentType.toLowerCase();
  if (kind === "css") return normalized.includes("text/css");
  if (kind === "js") return /(?:javascript|ecmascript)/.test(normalized);
  if (kind === "font") return /(?:font|woff|opentype|octet-stream)/.test(normalized);
  if (kind === "og" || kind === "image") return normalized.startsWith("image/");
  if (kind === "evidence") return normalized.startsWith("text/plain");
  return false;
}

async function request(url, { followRedirects = 0, readBody = true, ...options } = {}) {
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
    ...options,
  });
  if (followRedirects > 0 && response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      const nextUrl = new URL(location, url);
      if (nextUrl.origin === new URL(url).origin) {
        return request(nextUrl, { followRedirects: followRedirects - 1, readBody, ...options });
      }
    }
  }
  return {
    response,
    body: !readBody || options.method === "HEAD" ? "" : await response.text(),
  };
}

async function main() {
  const { baseUrl, jsonPath } = parseArguments(process.argv.slice(2));
  const results = [];
  const failures = [];
  const check = (name, condition, detail = "") => {
    const result = { name, passed: Boolean(condition), detail };
    results.push(result);
    if (!result.passed) failures.push(result);
  };
  const pageUrl = new URL("/PM1/", baseUrl);

  try {
    const redirectUrl = new URL("/PM1?source=qa", baseUrl);
    const { response: redirect } = await request(redirectUrl);
    const redirectLocation = redirect.headers.get("location");
    const resolvedLocation = redirectLocation ? new URL(redirectLocation, redirectUrl) : null;
    check("uppercase trailing-slash redirect", redirect.status === 308 && resolvedLocation?.pathname === "/PM1/" && resolvedLocation?.search === "?source=qa", `status=${redirect.status} location=${redirectLocation ?? "missing"}`);

    const { response: page, body: html } = await request(pageUrl);
    check("PM1 page returns 200", page.status === 200, `status=${page.status}`);
    if (page.status === 200) {
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
      const descriptionTag = collectTags(html, /<meta\b[^>]*>/gi).find((tag) => attribute(tag, "name")?.toLowerCase() === "description");
      const canonicalTag = collectTags(html, /<link\b[^>]*>/gi).find((tag) => attribute(tag, "rel")?.toLowerCase().split(/\s+/).includes("canonical"));
      const headings = [...html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map((match) => textContent(match[1]));
      const ids = new Set(collectTags(html, /<[^>]+\bid\s*=\s*["'][^"']+["'][^>]*>/gi).map((tag) => attribute(tag, "id")));

      check("document title", textContent(title ?? "") === "이재호 | PM Portfolio", textContent(title ?? "missing"));
      check("document description", attribute(descriptionTag ?? "", "content") === "기획 문서 작성, 사용자 조사, 프론트엔드 QA 경험을 담은 이재호의 PM 포트폴리오입니다.", attribute(descriptionTag ?? "", "content") ?? "missing");
      check("canonical URL", attribute(canonicalTag ?? "", "href") === "https://ficstory.dev/PM1/", attribute(canonicalTag ?? "", "href") ?? "missing");
      check("intro heading", headings.includes("HI, I'M JAEHO"), headings.join(" | "));
      check("section ids", ["about", "capabilities", "projects", "contact"].every((id) => ids.has(id)), [...ids].join(", "));
      const missingProjects = ["애낌", "웃지마게임", "부산참여연대"].filter((name) => !textContent(html).includes(name));
      check("project names", missingProjects.length === 0, missingProjects.length ? `missing: ${missingProjects.join(", ")}` : "");
      check("no lockscreen", !/lock[-\s_]?screen/i.test(html));

      const resources = new Map();
      for (const tag of collectTags(html, /<link\b[^>]*>/gi)) {
        const href = attribute(tag, "href");
        const rel = attribute(tag, "rel")?.toLowerCase() ?? "";
        const as = attribute(tag, "as")?.toLowerCase();
        const resourceUrl = href ? localResourceUrl(href, pageUrl, baseUrl) : null;
        if (resourceUrl && (rel.includes("stylesheet") || as === "font")) resources.set(resourceUrl.href, as === "font" ? "font" : "css");
      }
      for (const tag of collectTags(html, /<script\b[^>]*>/gi)) {
        const src = attribute(tag, "src");
        const resourceUrl = src ? localResourceUrl(src, pageUrl, baseUrl) : null;
        if (resourceUrl) resources.set(resourceUrl.href, "js");
      }
      for (const tag of collectTags(html, /<img\b[^>]*>/gi)) {
        const src = attribute(tag, "src");
        const localUrl = src ? localResourceUrl(src, pageUrl, baseUrl) : null;
        if (localUrl) resources.set(localUrl.href, "image");
      }
      const responsiveCharacterUrls = new Set();
      for (const tag of collectTags(html, /<picture\b[\s\S]*?<\/picture>/gi)) {
        for (const source of collectTags(tag, /<source\b[^>]*>/gi)) {
          for (const src of srcSetUrls(attribute(source, "srcset"))) {
            const localUrl = localResourceUrl(src, pageUrl, baseUrl);
            if (!localUrl) continue;
            responsiveCharacterUrls.add(localUrl.pathname);
            resources.set(localUrl.href, "image");
          }
        }
      }
      check(
        "responsive character sources",
        ["/pm1/character/jaeho-640.webp", "/pm1/character/jaeho-1040.webp"].every((pathname) => responsiveCharacterUrls.has(pathname)),
        [...responsiveCharacterUrls].join(", ") || "missing",
      );

      const evidenceLinks = new Set();
      for (const tag of collectTags(html, /<a\b[^>]*>/gi)) {
        const href = attribute(tag, "href");
        const localUrl = href ? localResourceUrl(href, pageUrl, baseUrl) : null;
        if (!localUrl || !localUrl.pathname.startsWith("/pm/sources/")) continue;
        evidenceLinks.add(localUrl.pathname);
        resources.set(localUrl.href, "evidence");
      }
      check("same-origin evidence links are present", evidenceLinks.size > 0, [...evidenceLinks].join(", ") || "missing");

      const ogTag = collectTags(html, /<meta\b[^>]*>/gi).find((tag) => attribute(tag, "property")?.toLowerCase() === "og:image");
      const ogImage = attribute(ogTag ?? "", "content");
      const ogResourceUrl = ogImage ? localResourceUrl(ogImage, pageUrl, baseUrl) : null;
      check("Open Graph image is present", Boolean(ogResourceUrl), ogImage ?? "missing");
      if (ogResourceUrl) resources.set(ogResourceUrl.href, "og");

      for (const [url, kind] of [...resources]) {
        if (kind !== "css") continue;
        const { response: css, body } = await request(url, { followRedirects: 3 });
        if (css.ok) {
          for (const match of body.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/gi)) {
            const fontUrl = match[1];
            const resourceUrl = localResourceUrl(fontUrl, url, baseUrl);
            if (resourceUrl && /\.(?:woff2?|ttf|otf)(?:[?#].*)?$/i.test(fontUrl)) resources.set(resourceUrl.href, "font");
          }
        }
      }

      for (const [url, kind] of resources) {
        if (kind === "js" && /\/_next\/static\/chunks\/webpack/i.test(url)) continue;
        const { response } = await request(url, { followRedirects: 3, readBody: false });
        const contentType = response.headers.get("content-type") ?? "";
        check(`${kind} resource ${new URL(url).pathname}`, response.ok && contentTypeMatches(kind, contentType), `status=${response.status} type=${contentType || "missing"}`);
      }
    }

    const { response: missing } = await request(new URL("/pm1-assets-definitely-missing.png", baseUrl));
    check("missing PM1 asset is not 200", missing.status === 404, `status=${missing.status}`);
  } catch (error) {
    check("checker request completed", false, error instanceof Error ? error.message : String(error));
  }

  for (const route of ["/", "/pm/", "/resume/"]) {
    try {
      const { response, body } = await request(new URL(route, baseUrl));
      check(`${route} stays outside PM1`, response.status === 200 && !/pm1-portfolio/i.test(body), `status=${response.status}`);
    } catch (error) {
      check(`${route} stays outside PM1`, false, error instanceof Error ? error.message : String(error));
    }
  }

  const report = { baseUrl: baseUrl.href, passed: failures.length === 0, results };
  for (const result of results) console.log(`${result.passed ? "PASS" : "FAIL"} ${result.name}${result.detail ? ` — ${result.detail}` : ""}`);
  console.log(`${report.passed ? "PASS" : "FAIL"}: ${results.length - failures.length}/${results.length} checks passed`);

  if (jsonPath) {
    const outputPath = path.resolve(jsonPath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`JSON: ${outputPath}`);
  }

  process.exitCode = report.passed ? 0 : 1;
}

await main();

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Run against a production server: node scripts/check-pm-improved.mjs http://127.0.0.1:3211
const root = process.cwd();
const origin = new URL(process.argv[2] || "http://127.0.0.1:3211");
const hash = (data) => createHash("sha256").update(data).digest("hex");
const baseline = JSON.parse(await readFile(path.join(root, "docs/pm-improved/baseline.json"), "utf8"));
const manifest = await readFile(path.join(root, "docs/pm-improved/baseline-files.tsv"), "utf8");
assert.equal(hash(manifest), baseline.hashing.perFileRecordsSha256, "baseline manifest is intact");
const records = manifest.trim().split(/\r?\n/).map((line) => line.split("\t"));
for (const [file, expected] of records) {
  assert.equal(hash(await readFile(path.join(root, file))), expected, `protected original changed: ${file}`);
}

const slugs = ["smile-game", "aekkim", "busan-eumgil", "play-pick"];
const routes = ["/PM/", ...slugs.map((slug) => `/PM/${slug}/`)];
const originals = ["/pm/", ...slugs.map((slug) => `/pm/${slug}/`)];
const cache = new Map();
const targets = new Set();
const external = new Set();
async function read(route) {
  if (!cache.has(route)) cache.set(route, (async () => {
    const response = await fetch(new URL(route, origin));
    assert.equal(response.status, 200, `${route}: HTTP 200`);
    if (/text\/(html|plain)|application\/json/.test(response.headers.get("content-type") || "")) return response.text();
    await response.body?.cancel();
    return "";
  })());
  return cache.get(route);
}
for (const route of [...routes, ...originals, "/", "/resume/", "/PM1/"]) {
  const html = await read(route);
  if (routes.includes(route) || originals.includes(route)) {
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route}: one h1`);
    assert.ok(html.includes(`rel="canonical" href="https://ficstory.dev${route}"`), `${route}: canonical`);
    assert.ok(html.includes(`property="og:url" content="https://ficstory.dev${route}"`), `${route}: OG URL`);
    assert.ok(html.includes('content="noindex, nofollow"'), `${route}: existing robots policy`);
  }
  if (routes.includes(route)) {
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
    assert.ok(main.includes("MY ROLE") && main.includes("RESULT"), `${route}: role and result summary`);
    assert.ok(!/TODO|2026\.XX|v2 테스트|개선 실험/.test(main), `${route}: no editing placeholders`);
    const ids = [...main.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${route}: unique main IDs`);
    if (route !== "/PM/") {
      for (const section of ["problem", "evidence", "decision", "action", "collaboration", "result", "learning"]) {
        assert.ok(ids.includes(section), `${route}: ${section} section`);
      }
    } else {
      const articles = [...main.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
      assert.equal(articles.length, 4, "four project cards");
      for (const [, article] of articles) {
        assert.ok(article.indexOf("MY ROLE") >= 0 && article.indexOf("RESULT") > article.indexOf("MY ROLE"), "card role before result");
        if (article.includes("<figure")) assert.ok(article.indexOf("RESULT") < article.indexOf("<figure"), "card result before media");
      }
    }
    for (const match of main.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      assert.ok(!/^\/pm\/(?:$|#|(?:smile-game|aekkim|busan-eumgil|play-pick)\/(?:#|$))/.test(match[1]), `${route}: project navigation stays uppercase`);
      assert.ok(!match[1].startsWith("/pm/sources/"), `${route}: unpublished source material is not linked`);
    }
    const resourceUrls = [...html.matchAll(/<(?:a|img|video|source|link|script)\b[^>]*(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    resourceUrls.push(...[...html.matchAll(/<video\b[^>]*poster="([^"]+)"/g)].map((match) => match[1]));
    for (const raw of resourceUrls) {
      const url = new URL(raw.replaceAll("&amp;", "&"), new URL(route, origin));
      if (!url.protocol.startsWith("http")) continue;
      if (url.origin !== origin.origin) { external.add(url.href); continue; }
      const target = await read(url.pathname);
      if (url.hash) assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: anchor ${url.pathname}${url.hash}`);
      targets.add(url.pathname + url.hash);
    }
  }
}
const home = await read("/PM/");
assert.ok(home.includes("팀이 같은 기준으로 일하도록,"), "improved headline");
assert.ok((await read("/pm/")).includes("화면을 구현했습니다."), "original headline");
assert.ok(!(await read("/pm/")).includes("팀이 같은 기준으로 일하도록,"), "improved content does not leak to original");
const mainHome = home.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
const positions = slugs.map((slug) => mainHome.indexOf(`id="${slug}"`));
assert.ok(positions.every((position, i) => position >= 0 && (i === 0 || position > positions[i - 1])), "project order");

const redirectChecks = [];
for (const route of ["/PM", ...slugs.map((slug) => `/PM/${slug}`)]) {
  const response = await fetch(new URL(`${route}?from=case-check`, origin), { redirect: "manual" });
  assert.ok([307, 308].includes(response.status), `${route}: slash redirect`);
  const location = new URL(response.headers.get("location"), origin);
  assert.equal(location.pathname, `${route}/`, `${route}: case preserved`);
  assert.equal(location.searchParams.get("from"), "case-check", `${route}: query preserved`);
  redirectChecks.push({ route, status: response.status, location: location.pathname + location.search });
}
for (const route of ["/PM/unknown-project/", "/PM/SMILE-GAME/"]) {
  assert.equal((await fetch(new URL(route, origin))).status, 404, `${route}: unknown slug is 404`);
}
// Client-side App Router navigation needs the same rewrite as a direct HTML request.
for (const slug of slugs) {
  const response = await fetch(new URL(`/PM/${slug}/?_rsc=case-check`, origin), { headers: { RSC: "1" } });
  assert.equal(response.status, 200, `${slug}: RSC response`);
  assert.ok(response.headers.get("content-type")?.includes("text/x-component"), `${slug}: RSC content type`);
  assert.ok((await response.text()).includes("MY ROLE"), `${slug}: RSC renders improved case`);
}
const result = { result: "pass", checkedAt: new Date().toISOString(), origin: origin.origin,
  protectedFiles: records.length, pages: [...routes, ...originals, "/", "/resume/", "/PM1/"],
  localTargets: targets.size, redirectChecks, rscRequests: slugs.length,
  externalLinksNotFetched: [...external].sort() };
if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));

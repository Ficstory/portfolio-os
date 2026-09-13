import assert from "node:assert/strict";

// Start a production server first: npm run start -- --port 3210
const origin = process.argv[2] || "http://localhost:3210";
const pmRoutes = ["/pm/", "/pm/aekkim/", "/pm/busan-eumgil/", "/pm/smile-game/", "/pm/play-pick/"];
const routes = [...pmRoutes, "/", "/public-digital/", "/policy/", "/assembly/", "/resume/",
  "/projects/aekkim/", "/projects/busan-eumgil/", "/projects/smile-game/", "/projects/play-pick/"];
const cache = new Map();
const checks = new Set();
const external = new Set();
function read(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(new URL(path, origin)).then(async (response) => {
      assert.equal(response.status, 200, path + " should return 200");
      if (/^(text\/|application\/json)/.test(response.headers.get("content-type") || "")) return response.text();
      await response.body?.cancel();
      return "";
    }));
  }
  return cache.get(path);
}
for (const route of routes) {
  const html = await read(route);
  if (route !== "/") assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, route + ": one h1");
  if (pmRoutes.includes(route)) {
    assert.ok(html.includes("mailto:dlwo4367@gmail.com"), route + ": contact email");
    assert.ok(html.includes('href="https://ficstory.dev' + route + '"'), route + ": canonical URL");
  }
  const urls = [...html.matchAll(/<(?:a|img|video|source)\s[^>]*(?:href|src|poster)="([^"]+)"/g)]
    .map((match) => new URL(match[1].replaceAll("&amp;", "&"), new URL(route, origin)));
  // Poster and src can occur on the same video element.
  for (const match of html.matchAll(/<video\s[^>]*poster="([^"]+)"/g)) urls.push(new URL(match[1],origin));
  for (const url of urls) {
    assert.ok(!url.pathname.startsWith("/pm/sources/"), route + ": unpublished source excerpt must not be exposed as a reader link");
  }
  for (const url of urls) if (url.protocol.startsWith("http") && url.origin !== new URL(origin).origin) external.add(url.href);
  await Promise.all(urls.filter(url => url.origin === new URL(origin).origin).map(async (url) => {
    const target = await read(url.pathname);
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(target.includes('id="' + id + '"'), route + ": missing anchor " + url.pathname + url.hash);
    }
    checks.add(url.pathname + url.hash);
  }));
}
console.log(JSON.stringify({ result: "pass", pages: routes.length, localLinkAndImageTargets: checks.size, fetchedPaths: [...cache.keys()].sort(), externalLinks: [...external].sort() }, null, 2));

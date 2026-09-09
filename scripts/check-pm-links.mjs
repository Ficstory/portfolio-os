import assert from "node:assert/strict";

// Start the production server first: npm run start -- --port 3210
const origin = process.argv[2] || "http://localhost:3210";
const routes = ["/pm/", "/pm/aekkim/", "/pm/busan-eumgil/", "/pm/smile-game/", "/pm/play-pick/"];
const cache = new Map();
const checks = new Set();
function read(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(new URL(path, origin)).then(async (response) => {
      assert.equal(response.status, 200, `${path} should return 200`);
      return response.text();
    }));
  }
  return cache.get(path);
}
for (const route of routes) {
  const html = await read(route);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route}: one h1`);
  assert.ok(html.includes("mailto:dlwo4367@gmail.com"), `${route}: contact email`);
  assert.ok(html.includes(`href="https://ficstory.dev${route}"`), `${route}: canonical URL`);
  const urls = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/g), ...html.matchAll(/<img\s[^>]*src="([^"]+)"/g)]
    .map((match) => new URL(match[1].replaceAll("&amp;", "&"), new URL(route, origin)))
    .filter((url) => url.origin === new URL(origin).origin);
  await Promise.all(urls.map(async (url) => {
    const target = await read(url.pathname);
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(target.includes(`id="${id}"`), `${route}: missing anchor ${url.pathname}${url.hash}`);
    }
    checks.add(`${url.pathname}${url.hash}`);
  }));
}
for (const route of ["/", "/policy/", "/assembly/", "/public-digital/", "/projects/aekkim/"]) await read(route);
console.log(JSON.stringify({ result: "pass", pages: routes.length, localLinkAndImageTargets: checks.size, fetchedPaths: [...cache.keys()].sort() }, null, 2));

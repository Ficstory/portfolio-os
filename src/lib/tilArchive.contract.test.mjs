import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const root = path.resolve(__dirname, "../..");

function readSource(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function loadArchiveModule() {
  const source = readSource("src/lib/tilArchive.ts");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText;
  const cjsModule = { exports: {} };

  vm.runInNewContext(compiled, {
    exports: cjsModule.exports,
    module: cjsModule,
    require,
  });

  return cjsModule.exports;
}

const entries = [
  {
    id: "older",
    slug: "field-note",
    date: "2024-10-01",
    category: "field",
    title: "현장 관찰",
    summary: "고객의 작은 불편",
    learned: ["행동을 기록했다"],
    tried: [],
    blocked: [],
    insights: [],
    nextActions: [{ id: "a", text: "추가 관찰", status: "planned" }],
    skills: ["관찰"],
    resources: [],
  },
  {
    id: "newer",
    slug: "team-note",
    date: "2024-11-01",
    category: "team",
    title: "TEAM Feedback",
    summary: "합의 기준 정리",
    learned: ["근거가 중요하다"],
    tried: [],
    blocked: [],
    insights: [],
    nextActions: [{ id: "b", text: "결정 기록", status: "done" }],
    skills: ["협업"],
    resources: [],
  },
];

test("filters by category and Korean body text while preserving newest-first order", () => {
  const { filterTILEntries } = loadArchiveModule();

  assert.deepEqual(
    Array.from(filterTILEntries(entries, "all", ""), (entry) => entry.slug),
    ["team-note", "field-note"],
  );
  assert.deepEqual(
    Array.from(filterTILEntries(entries, "field", " 행동 "), (entry) => entry.slug),
    ["field-note"],
  );
});

test("search is case-insensitive and includes actions and skills", () => {
  const { filterTILEntries } = loadArchiveModule();

  assert.equal(filterTILEntries(entries, "all", "team").length, 1);
  assert.equal(filterTILEntries(entries, "all", "추가 관찰")[0].slug, "field-note");
  assert.equal(filterTILEntries(entries, "all", "협업")[0].slug, "team-note");
});

test("selection keeps a valid slug and returns null for list or missing entry", () => {
  const { resolveSelectedTILEntry } = loadArchiveModule();
  const sortedEntries = [...entries].reverse();

  assert.equal(resolveSelectedTILEntry(sortedEntries, "field-note").slug, "field-note");
  assert.equal(resolveSelectedTILEntry(sortedEntries, "missing"), null);
  assert.equal(resolveSelectedTILEntry(sortedEntries, null), null);
  assert.equal(resolveSelectedTILEntry([], "missing"), null);
});

test("media alt, captions, titles and ordered text are searchable", () => {
  const { filterTILEntries } = loadArchiveModule();
  const mediaEntry = { ...entries[0], blocks: { learned: [
    { type: "paragraph", text: "추가 본문" },
    { type: "image", src: "/til/media/field-note/photo.png", alt: "화면 구조", caption: "전후 비교", prompt: "수채화 풍경 원문", width: 800, height: 600 },
    { type: "video", src: "/til/media/field-note/demo.mp4", title: "실행 영상", width: 800, height: 600 },
  ] } };
  for (const query of ["추가 본문", "화면 구조", "전후 비교", "실행 영상", "수채화 풍경 원문"]) {
    assert.equal(filterTILEntries([mediaEntry], "all", query).length, 1);
  }
});

test("route, Markdown content, character asset, and Portfolio OS launchers stay connected", () => {
  const publishedDirectory = path.join(root, "content/til/published");
  const publishedSources = readFileSync(path.join(publishedDirectory, "learning-to-action.md"), "utf8");
  const pageSource = readSource("src/components/til/FutureDreamTilPage.tsx");
  const routeSource = readSource("src/app/til/future-dream/page.tsx");
  const layoutSource = readSource("src/app/til/future-dream/layout.tsx");
  const dockSource = readSource("src/components/desktop/Dock.tsx");
  const mobileSource = readSource("src/components/mobile/MobileHome.tsx");
  const nextConfigSource = readSource("next.config.ts");

  assert.match(publishedSources, /status: published/);
  assert.match(publishedSources, /createdAt: .*\+09:00/);
  assert.match(publishedSources, /updatedAt: .*\+09:00/);
  assert.equal(
    readFileSync(path.join(root, "content/til/config.json"), "utf8").includes("My Academy Journey"),
    true,
  );
  assert.match(pageSource, /\/til\/future-dream\/learning-character\.png/);
  assert.ok(readFileSync(path.join(root, "public/til/future-dream/learning-character.png")).length > 0);
  assert.match(pageSource, /onCompositionStart/);
  assert.match(pageSource, /router\[mode\]/);
  assert.match(routeSource, /loadPublishedTILContent/);
  assert.match(routeSource, /FutureDreamTilPage/);
  assert.match(layoutSource, /export const metadata/);
  assert.match(dockSource, /\/TIL\//);
  assert.match(mobileSource, /\/TIL\//);
  assert.match(nextConfigSource, /source: "\/TIL"/);
  assert.match(nextConfigSource, /destination: "\/til\/future-dream"/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseTILInlineLinks } from "./tilInlineLinks.ts";

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

function loadReaderModule() {
  const compiled = ts.transpileModule(readSource("src/components/til/TILReader.tsx"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const cjsModule = { exports: {} };
  const readerRequire = (id) => {
    if (id === "@/lib/tilArchive") return loadArchiveModule();
    if (id === "@/lib/tilInlineLinks") return { parseTILInlineLinks };
    if (id === "./til-reader.module.css") return { default: {} };
    if (id === "./TILMedia") return { TILMedia: () => null };
    if (id === "./StoreAnalysis") return { StoreAnalysis: () => null };
    if (id === "./JournalChart") return { JournalChart: ({ figure }) => createElement("figure", null, figure.title) };
    if (id === "./EvidenceSection") return loadEvidenceModule();
    if (id === "./tilNavigation") return { navigateToTILAnchor: () => {} };
    return require(id);
  };
  vm.runInNewContext(compiled, { exports: cjsModule.exports, module: cjsModule, require: readerRequire });
  return cjsModule.exports;
}

function loadEvidenceModule() {
  const compiled = ts.transpileModule(readSource("src/components/til/EvidenceSection.tsx"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const cjsModule = { exports: {} };
  const evidenceRequire = (id) => {
    if (id === "@/lib/tilInlineLinks") return { parseTILInlineLinks };
    if (id === "./evidence-section.module.css") return { __esModule: true, default: { decision: "decision", snapshot: "snapshot" } };
    if (id === "./TILMedia") return { TILMedia: ({ block }) => createElement("figure", null, createElement("img", { src: block.src, alt: block.alt })) };
    return require(id);
  };
  vm.runInNewContext(compiled, { exports: cjsModule.exports, module: cjsModule, require: evidenceRequire });
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

test("journal headings, narrative, media captions and prompts participate in archive search", () => {
  const { filterTILEntries } = loadArchiveModule();
  const journalEntry = { ...entries[0], learned: [], format: "journal", journal: [
    { blocks: [{ type: "paragraph", text: "처음 해본 시장조사" }] },
    { heading: "예상과 달랐던 방문 이유", blocks: [
      { type: "image", src: "/til/media/field-note/photo.png", alt: "매장 관찰", caption: "동선 비교", prompt: "메모를 요약한 원문", width: 800, height: 600 },
    ] },
  ] };
  for (const query of ["시장조사", "방문 이유", "매장 관찰", "동선 비교", "요약한 원문"]) {
    assert.equal(filterTILEntries([journalEntry], "all", query)[0]?.slug, "field-note");
  }
});

test("the reader renders journal prose without forced reflection headings and retains legacy sections", () => {
  const { TILReader } = loadReaderModule();
  const render = (entry) => renderToStaticMarkup(createElement(TILReader, {
    entry, categories: [], listHref: "/til/future-dream/", onSelect: () => {}, headingRef: { current: null },
  }));
  const journalEntry = { ...entries[0], learned: [], nextActions: [], skills: [], format: "journal", journal: [
    { blocks: [{ type: "paragraph", text: "먼저 직접 해봤다." }] },
  ] };
  const prose = render(journalEntry);
  assert.match(prose, /<p>먼저 직접 해봤다\.<\/p>/);
  assert.doesNotMatch(prose, /<h2|오늘 배운 것|직접 시도한 것|새롭게 이해한 것/);
  const headed = render({ ...journalEntry, journal: [
    ...journalEntry.journal,
    { heading: "예상과 달랐던 점", blocks: [{ type: "paragraph", text: "아직 이유는 모르겠다." }] },
  ] });
  assert.match(headed, /id="til-journal-1"[^>]*>예상과 달랐던 점<\/h2>/);
  assert.doesNotMatch(headed, /<span>02<\/span>/);
  assert.match(render(entries[0]), /오늘 배운 것/);
  const chart = render({ ...journalEntry,
    journal: [{ heading: "후기", blocks: [{ type: "paragraph", text: "사례 본문" }] }],
    visualizations: { type: "journal-figures", figures: [{ heading: "후기", title: "후기 건수" }] },
  });
  assert.match(chart, /<h2[^>]*>후기<\/h2><figure>후기 건수<\/figure><p>사례 본문<\/p>/);
  const linked = render({ ...journalEntry, journal: [{ blocks: [{ type: "paragraph", text: '출처: [배민](https://bcut.baemin.com/3529/). [위험](javascript:alert(1))' }] }] });
  assert.match(linked, /<a href="https:\/\/bcut\.baemin\.com\/3529\/">배민<\/a>/);
  assert.doesNotMatch(linked, /href="javascript:/);
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

test("evidence sections preserve accessible counts, journeys, comparisons and signed economics", () => {
  const { EvidenceSection } = loadEvidenceModule();
  const render = (lines, sectionIndex = 1) => renderToStaticMarkup(createElement(EvidenceSection, {
    sectionIndex, blocks: lines.map(text => ({ type: "paragraph", text })),
  }));
  const reactions = render([
    "### 구매 뒤의 반응", "| 반응 | 건수 | 근거 |", "| --- | --- | --- |",
    "| 긍정 | 25 | 맛있었다 |", "| 거부 | 7 | 버렸다 |", "| 재시도 | 5 | 김을 더했다 |", "| 보류 | 4 | 남겼다 |", "시식에서 확인한다.",
  ]);
  assert.equal((reactions.match(/<i><\/i>/g) ?? []).length, 41);
  assert.match(reactions, /25<span>건<\/span>/);
  assert.match(reactions, /<h3>구매 뒤의 반응<\/h3>/);
  assert.match(reactions, /<p class="decision">시식에서 확인한다\.<\/p>/);
  assert.doesNotMatch(reactions, /\| ---/);
  const journey = render(["| 고객여정 | 근거 |", "| --- | --- |", "| 매대에서 멈춤 | 지난 구매를 기억했다 |"]);
  assert.match(journey, /<ol[^>]*aria-label="고객여정 · 근거"/);
  assert.match(journey, /<strong>매대에서 멈춤<\/strong>/);
  const receipt = render(["| 손익 항목 | 금액 | 설명 |", "| --- | --- | --- |", "| 결제액 | 61,500원 | 5팩 판매 |", "| 비용 | −37,714원 | 제작 6팩 |", "| 공헌이익 | +16,771원 | 고정비 제외 |"]);
  assert.match(receipt, /<dl[^>]*aria-label="손익 항목 · 금액 · 설명"/);
  assert.match(receipt, /−37,714원/);
  assert.match(receipt, /data-total="true"><dt>공헌이익/);
  const comparison = render(["| 채널 | 수량 | 가격 |", "| --- | --- | --- |", "| 본매장 | 6점 | 13,980원 |"]);
  assert.match(comparison, /<th scope="col">채널<\/th>/);
  assert.match(comparison, /<th scope="row">본매장<\/th>/);
});

test("evidence snapshots pair an expandable native image with an ingredient key only in section three", () => {
  const { EvidenceSection } = loadEvidenceModule();
  const blocks = [
    { type: "image", src: "/til/media/example.webp", alt: "배합 시안", width: 1200, height: 400 },
    ...["| 속재료 | 배합 |", "| --- | --- |", "| 방어 | 90g |"].map(text => ({ type: "paragraph", text })),
    { type: "paragraph", text: "[출처](https://example.com/) [위험](javascript:alert(1))" },
  ];
  const markup = renderToStaticMarkup(createElement(EvidenceSection, { blocks, sectionIndex: 3 }));
  assert.match(markup, /class="snapshot" role="group" aria-label="배합 시안"/);
  assert.match(markup, /<dl[^>]*aria-label="속재료 · 배합"/);
  assert.equal((markup.match(/배합 시안/g) ?? []).length, 2);
  assert.match(markup, /href="https:\/\/example.com\/"/);
  assert.doesNotMatch(markup, /href="javascript:/);
  const otherSection = renderToStaticMarkup(createElement(EvidenceSection, { blocks, sectionIndex: 2 }));
  assert.doesNotMatch(otherSection, /class="snapshot"/);
  assert.match(otherSection, /<table/);
});

test("route, Markdown content, character asset, and Portfolio OS launchers stay connected", () => {
  const publishedDirectory = path.join(root, "content/til/published");
  const publishedSources = readFileSync(path.join(publishedDirectory, "reference-led-html-pdf-report.md"), "utf8");
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

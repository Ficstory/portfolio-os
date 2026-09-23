import assert from "node:assert/strict";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  deleteTIL,
  loadPublishedTILContent,
  parseTILMarkdown,
  stageTILMedia,
  publishTIL,
  unpublishTIL,
  validateTILContent,
} from "./tilContent.ts";

const CONFIG = {
  categories: [
    { id: "education", label: "교육", tone: "lavender" },
    { id: "team", label: "팀", tone: "blue" },
  ],
  journey: { label: "Journey", status: "Learning" },
};

function entryMarkdown({
  id = "til-2026-09-21",
  slug = "test-learning",
  category = "education",
  status = "draft",
  title = "테스트에서 배운 점",
  createdAt = "2026-09-21T10:00:00+09:00",
  updatedAt = createdAt,
  resources = "<!-- 없음 -->",
} = {}) {
  return `---
id: ${id}
slug: ${slug}
date: 2026-09-21
createdAt: ${createdAt}
updatedAt: ${updatedAt}
session: 테스트 세션
category: ${category}
title: ${title}
summary: 관찰을 다음 행동으로 연결했다.
status: ${status}
isDemo: false
---

## 오늘 배운 것

- 사실과 해석을 분리했다.

## 직접 시도한 것

- 작은 실험을 실행했다.

## 막혔던 지점

- 기준이 충분히 명확하지 않았다.

## 새롭게 이해한 것

- 기준을 먼저 합의해야 한다.

## 다음 액션

- [ ] action-1 | 다음 실험의 기준을 작성한다.

## 관련 역량

- 문제 정의

## 관련 자료

${resources}
`;
}

function createFixture() {
  const projectRoot = mkdtempSync(path.join(os.tmpdir(), "portfolio-til-test-"));
  const contentRoot = path.join(projectRoot, "content", "til");
  mkdirSync(path.join(contentRoot, "drafts"), { recursive: true });
  mkdirSync(path.join(contentRoot, "published"), { recursive: true });
  writeFileSync(
    path.join(contentRoot, "config.json"),
    `${JSON.stringify(CONFIG, null, 2)}\n`,
    "utf8",
  );
  return { projectRoot, contentRoot };
}

function writeEntry(contentRoot, scope, options) {
  const markdown = entryMarkdown(options);
  const filePath = path.join(contentRoot, scope, `${options?.slug ?? "test-learning"}.md`);
  writeFileSync(filePath, markdown, "utf8");
  return filePath;
}

function cleanup(projectRoot) {
  rmSync(projectRoot, { recursive: true, force: true });
}

const MEDIA_LINE = "- ![실험 결과](/til/media/test-learning/chart.png) | 1200x800 | 비교 캡션";

test("published store analysis preserves the supplied accounting totals", () => {
  const projectRoot = path.resolve(import.meta.dirname, "../..");
  const entry = loadPublishedTILContent(projectRoot).entries.find((candidate) => candidate.slug === "store-performance-xray");
  assert.ok(entry?.visualizations);
  const data = entry.visualizations;
  assert.equal(data.stores.reduce((total, store) => total + store.revenue, 0), 524_552_540);
  assert.equal(data.categories.find((category) => category.name === "가공식품").changes.reduce((total, change) => total + change, 0), 1_177_800);
  assert.ok(data.categories.every((category) => category.changes.reduce((total, change) => total + change, 0) > 0));
  assert.equal(data.weeks.length, 7);
  assert.equal(data.promotion.length, 3);
});

function mediaMarkdown(options = {}) {
  return entryMarkdown(options).replace("- 사실과 해석을 분리했다.", `- 시작 문단\n${MEDIA_LINE}\n- 마지막 문단`);
}

test("prompt fences preserve raw multiline content on the preceding media only", () => {
  const prompt = "  첫 줄 들여쓰기\n\n## 프롬프트 내부 제목\n<!-- 그대로 보존 -->\n<script>alert('text only')</script>\n  마지막 줄  ";
  for (const media of [MEDIA_LINE, "- [video: 과정](/til/media/test-learning/demo.mp4) | 800x600", "- [youtube: 과정](https://www.youtube.com/watch?v=abcdefghijk) | 800x600"]) {
    const markdown = mediaMarkdown().replace(MEDIA_LINE, `${media}\n\n\`\`\`prompt\n${prompt}\n\`\`\``);
    const entry = parseTILMarkdown(markdown);
    assert.equal(entry.blocks.learned[1].prompt, prompt);
    assert.deepEqual(entry.blocks.learned.map((block) => block.type), ["paragraph", entry.blocks.learned[1].type, "paragraph"]);
    assert.deepEqual(entry.learned, ["시작 문단", "마지막 문단"]);
    assert.equal(entry.tried[0], "작은 실험을 실행했다.");
  }
});

test("prompt fences reject duplicate, orphan, empty and unclosed prompts", () => {
  const fence = "```prompt\n프롬프트\n```";
  const duplicate = mediaMarkdown().replace(MEDIA_LINE, `${MEDIA_LINE}\n${fence}\n${fence}`);
  assert.throws(() => parseTILMarkdown(duplicate), /duplicate prompt/);
  assert.throws(() => parseTILMarkdown(mediaMarkdown().replace("- 시작 문단", `- 시작 문단\n${fence}`)), /preceding media/);
  assert.throws(() => parseTILMarkdown(mediaMarkdown().replace(MEDIA_LINE, `${MEDIA_LINE}\n\`\`\`prompt\n  \n\n\`\`\``)), /empty prompt/);
  assert.throws(() => parseTILMarkdown(mediaMarkdown().replace(MEDIA_LINE, `${MEDIA_LINE}\n\`\`\`prompt\n안 닫힘`)), /unclosed prompt/);
  assert.throws(() => parseTILMarkdown(entryMarkdown().replace("## 관련 역량", `${fence}\n## 관련 역량`)), /reflection section/);
});

test("ordered media preserves paragraphs and rejects unsafe sources and dimensions", () => {
  const entry = parseTILMarkdown(mediaMarkdown());
  assert.deepEqual(entry.blocks.learned.map((block) => block.type), ["paragraph", "image", "paragraph"]);
  assert.deepEqual(entry.learned, ["시작 문단", "마지막 문단"]);
  assert.equal(entry.blocks.learned[1].caption, "비교 캡션");
  for (const bad of ["javascript:alert", "/til/media/other/chart.png", "/til/media/test-learning/../chart.png", "https://example.com/chart.png"]) {
    assert.throws(() => parseTILMarkdown(mediaMarkdown().replace("/til/media/test-learning/chart.png", bad)), /media/);
  }
  assert.throws(() => parseTILMarkdown(mediaMarkdown().replace("1200x800", "0x800")), /dimensions/);
  const video = mediaMarkdown().replace(MEDIA_LINE, "- [youtube: 실험 영상](https://www.youtube.com/watch?v=abcdefghijk) | 1920x1080 | 영상 설명");
  assert.equal(parseTILMarkdown(video).blocks.learned[1].type, "youtube");
  assert.throws(() => parseTILMarkdown(video.replace("www.youtube.com", "evil.example")), /YouTube/);
  const linked = entryMarkdown().replace("- 사실과 해석을 분리했다.", "- [문서](https://example.com)에서 배웠다.");
  assert.deepEqual(parseTILMarkdown(linked).learned, ["[문서](https://example.com)에서 배웠다."]);
});

test("publication transitions roll back Markdown and media on filesystem failures", () => {
  for (const status of ["draft", "published"]) for (const operation of ["writeFileSync", "renameSync", ...(status === "published" ? ["rmSync"] : [])]) {
    const { projectRoot, contentRoot } = createFixture();
    const originalFunction = fs[operation];
    try {
      const folder = status === "draft" ? "drafts" : "published";
      const source = path.join(contentRoot, folder, "test-learning.md");
      const originalMarkdown = mediaMarkdown({ status });
      writeFileSync(source, originalMarkdown);
      const asset = path.join(contentRoot, ...(status === "draft" ? ["drafts", "media"] : ["media"]), "test-learning", "chart.png");
      mkdirSync(path.dirname(asset), { recursive: true });
      writeFileSync(asset, "image");
      stageTILMedia(projectRoot);
      let injected = false;
      fs[operation] = (...args) => {
        if (!injected && (operation === "rmSync" || String(args[0]) === source)) {
          injected = true;
          throw new Error(`injected ${operation} failure`);
        }
        return originalFunction(...args);
      };
      syncBuiltinESMExports();
      const action = status === "draft" ? publishTIL : unpublishTIL;
      assert.throws(() => action(contentRoot, "test-learning", new Date("2026-09-22T00:00:00Z")), /injected/);
      assert.equal(injected, true);
      assert.equal(readFileSync(source, "utf8"), originalMarkdown);
      assert.equal(readFileSync(asset, "utf8"), "image");
      assert.equal(validateTILContent(contentRoot)[folder].length, 1);
      if (status === "published") assert.equal(existsSync(path.join(projectRoot, "public", "til", "media", "test-learning", "chart.png")), true);
    } finally {
      fs[operation] = originalFunction;
      syncBuiltinESMExports();
      cleanup(projectRoot);
    }
  }
});

test("publication refuses a linked source directory without modifying external Markdown", () => {
  const { projectRoot, contentRoot } = createFixture();
  try {
    const external = path.join(projectRoot, "external-drafts");
    mkdirSync(external);
    const original = entryMarkdown();
    const source = path.join(external, "test-learning.md");
    writeFileSync(source, original);
    fs.rmdirSync(path.join(contentRoot, "drafts"));
    fs.symlinkSync(external, path.join(contentRoot, "drafts"), process.platform === "win32" ? "junction" : "dir");
    assert.throws(() => publishTIL(contentRoot, "test-learning"), /symlink/);
    assert.equal(readFileSync(source, "utf8"), original);
  } finally { cleanup(projectRoot); }
});

test("only referenced published assets are staged, lifecycle moves assets and removes generated copies", () => {
  const { projectRoot, contentRoot } = createFixture();
  try {
    const draft = path.join(contentRoot, "drafts", "test-learning.md");
    writeFileSync(draft, mediaMarkdown());
    const draftMedia = path.join(contentRoot, "drafts", "media", "test-learning");
    mkdirSync(draftMedia, { recursive: true });
    writeFileSync(path.join(draftMedia, "chart.png"), "public-image");
    writeFileSync(path.join(draftMedia, "private.png"), "private-image");
    const generated = path.join(projectRoot, "public", "til", "media", "test-learning", "chart.png");
    stageTILMedia(projectRoot);
    assert.equal(existsSync(generated), false);
    publishTIL(contentRoot, "test-learning", new Date("2026-09-22T00:00:00Z"));
    stageTILMedia(projectRoot);
    assert.equal(readFileSync(generated, "utf8"), "public-image");
    assert.equal(existsSync(path.join(path.dirname(generated), "private.png")), false);
    assert.equal(existsSync(path.join(draftMedia, "private.png")), true);
    const stale = path.join(path.dirname(generated), "stale.png");
    writeFileSync(stale, "stale");
    stageTILMedia(projectRoot);
    assert.equal(existsSync(stale), false);
    unpublishTIL(contentRoot, "test-learning", new Date("2026-09-22T01:00:00Z"));
    assert.equal(existsSync(generated), false);
    assert.equal(existsSync(path.join(draftMedia, "chart.png")), true);
    assert.equal(loadPublishedTILContent(projectRoot).entries.length, 0);
    publishTIL(contentRoot, "test-learning", new Date("2026-09-22T02:00:00Z"));
    stageTILMedia(projectRoot);
    deleteTIL(contentRoot, "test-learning", "published");
    assert.equal(existsSync(generated), false);
  } finally { cleanup(projectRoot); }
});

test("managed PDF resources reject unsafe paths and preserve other document links", () => {
  const document = (href) => entryMarkdown({ resources: `- document | report | [보고서](${href})` });
  assert.equal(parseTILMarkdown(document("/til/media/test-learning/final-report.pdf")).resources[0].type, "document");
  for (const href of [
    "/til/media/other/report.pdf",
    "/til/media/test-learning/../report.pdf",
    "/til/media/test-learning/nested/report.pdf",
    "/til/media/test-learning/%2e%2e/report.pdf",
    "/til/media/test-learning/report.pdf?download=1",
    "/til/media/test-learning/report.pdf#page=1",
    "/til/media/test-learning/report.png",
    "/til/media/test-learning/report\\other.pdf",
  ]) assert.throws(() => parseTILMarkdown(document(href)), /invalid document media URL/);
  for (const href of ["https://example.com/report.pdf", "/documents/report.pdf", "/about/"]) {
    assert.equal(parseTILMarkdown(document(href)).resources[0].href, href);
  }
});

test("PDF attachments stay private until published and follow the media lifecycle", () => {
  const { projectRoot, contentRoot } = createFixture();
  try {
    const resources = "- document | report | [보고서](/til/media/test-learning/report.pdf)";
    const draft = writeEntry(contentRoot, "drafts", { resources });
    assert.throws(() => validateTILContent(contentRoot), /missing media file/);
    assert.throws(() => publishTIL(contentRoot, "test-learning"), /missing media file/);
    assert.equal(existsSync(draft), true);
    const privateMedia = path.join(contentRoot, "drafts", "media", "test-learning");
    const publicMedia = path.join(contentRoot, "media", "test-learning", "report.pdf");
    const generated = path.join(projectRoot, "public", "til", "media", "test-learning", "report.pdf");
    mkdirSync(privateMedia, { recursive: true });
    writeFileSync(path.join(privateMedia, "report.pdf"), "%PDF-1.7\nreport");
    writeFileSync(path.join(privateMedia, "unused.pdf"), "private");
    assert.equal(validateTILContent(contentRoot).drafts.length, 1);
    assert.equal(stageTILMedia(projectRoot), 0);
    assert.equal(existsSync(generated), false);
    assert.equal(loadPublishedTILContent(projectRoot).entries.length, 0);
    publishTIL(contentRoot, "test-learning", new Date("2026-09-22T00:00:00Z"));
    assert.equal(existsSync(publicMedia), true);
    assert.equal(existsSync(path.join(privateMedia, "report.pdf")), false);
    assert.equal(stageTILMedia(projectRoot), 1);
    assert.equal(readFileSync(generated, "utf8"), "%PDF-1.7\nreport");
    assert.equal(existsSync(path.join(path.dirname(generated), "unused.pdf")), false);
    assert.equal(existsSync(path.join(privateMedia, "unused.pdf")), true);
    unpublishTIL(contentRoot, "test-learning", new Date("2026-09-22T01:00:00Z"));
    assert.equal(existsSync(publicMedia), false);
    assert.equal(existsSync(generated), false);
    assert.equal(readFileSync(path.join(privateMedia, "report.pdf"), "utf8"), "%PDF-1.7\nreport");
    assert.equal(loadPublishedTILContent(projectRoot).entries.length, 0);
  } finally { cleanup(projectRoot); }
});

test("missing media and publication destination collisions fail before changing the entry", () => {
  const { projectRoot, contentRoot } = createFixture();
  try {
    const draft = path.join(contentRoot, "drafts", "test-learning.md");
    writeFileSync(draft, mediaMarkdown());
    assert.throws(() => validateTILContent(contentRoot), /missing media file/);
    for (const folder of [path.join(contentRoot, "drafts", "media", "test-learning"), path.join(contentRoot, "media", "test-learning")]) {
      mkdirSync(folder, { recursive: true });
      writeFileSync(path.join(folder, "chart.png"), "image");
    }
    assert.throws(() => publishTIL(contentRoot, "test-learning", new Date("2026-09-22T00:00:00Z")), /media target already exists/);
    assert.match(readFileSync(draft, "utf8"), /status: draft/);
  } finally { cleanup(projectRoot); }
});

test("draft creation, in-place supplement, publish, correction, unpublish, and delete", () => {
  const { projectRoot, contentRoot } = createFixture();
  try {
    const draftPath = writeEntry(contentRoot, "drafts", {});
    assert.equal(validateTILContent(contentRoot).drafts.length, 1);

    const supplemented = readFileSync(draftPath, "utf8").replace(
      "- 사실과 해석을 분리했다.",
      "- 사실과 해석을 분리했다.\n- 사용자 관찰을 한 줄 보충했다.",
    );
    writeFileSync(draftPath, supplemented, "utf8");
    const afterSupplement = validateTILContent(contentRoot);
    assert.equal(afterSupplement.drafts.length, 1);
    assert.equal(afterSupplement.drafts[0].learned.length, 2);

    const publishedPath = publishTIL(
      contentRoot,
      "test-learning",
      new Date("2026-09-21T02:00:00Z"),
    );
    assert.equal(existsSync(draftPath), false);
    assert.equal(existsSync(publishedPath), true);
    assert.equal(loadPublishedTILContent(projectRoot).entries.length, 1);
    assert.match(
      readFileSync(publishedPath, "utf8"),
      /^updatedAt: 2026-09-21T11:00:00\+09:00$/m,
    );

    const corrected = readFileSync(publishedPath, "utf8").replace(
      "title: 테스트에서 배운 점",
      "title: 수정한 배움의 제목",
    ).replace(
      "updatedAt: 2026-09-21T11:00:00+09:00",
      "updatedAt: 2026-09-21T12:00:00+09:00",
    );
    writeFileSync(publishedPath, corrected, "utf8");
    const publicBundle = loadPublishedTILContent(projectRoot);
    assert.equal(publicBundle.entries.length, 1);
    assert.equal(publicBundle.entries[0].title, "수정한 배움의 제목");

    const restoredDraftPath = unpublishTIL(
      contentRoot,
      "test-learning",
      new Date("2026-09-21T04:00:00Z"),
    );
    assert.equal(loadPublishedTILContent(projectRoot).entries.length, 0);
    assert.equal(existsSync(restoredDraftPath), true);
    assert.match(
      readFileSync(restoredDraftPath, "utf8"),
      /^updatedAt: 2026-09-21T13:00:00\+09:00$/m,
    );

    deleteTIL(contentRoot, "test-learning", "drafts");
    assert.equal(existsSync(restoredDraftPath), false);
  } finally {
    cleanup(projectRoot);
  }
});

test("public loader excludes drafts from its data", () => {
  const { projectRoot, contentRoot } = createFixture();
  try {
    writeEntry(contentRoot, "published", {
      id: "public-id",
      slug: "public-note",
      status: "published",
      title: "공개 제목",
    });
    writeEntry(contentRoot, "drafts", {
      id: "private-id",
      slug: "private-note",
      title: "절대 노출하지 않을 초안 문구",
    });

    const serialized = JSON.stringify(loadPublishedTILContent(projectRoot));
    assert.match(serialized, /공개 제목/);
    assert.doesNotMatch(serialized, /절대 노출하지 않을 초안 문구|private-note/);
  } finally {
    cleanup(projectRoot);
  }
});

test("validation rejects malformed metadata, duplicates, categories, and links", async (t) => {
  await t.test("missing required metadata", () => {
    const { projectRoot, contentRoot } = createFixture();
    try {
      const filePath = writeEntry(contentRoot, "drafts", {});
      writeFileSync(
        filePath,
        readFileSync(filePath, "utf8").replace("title: 테스트에서 배운 점\n", ""),
        "utf8",
      );
      assert.throws(() => validateTILContent(contentRoot), /title must be a non-empty string/);
    } finally {
      cleanup(projectRoot);
    }
  });

  await t.test("invalid or out-of-order audit timestamps", () => {
    const { projectRoot, contentRoot } = createFixture();
    try {
      writeEntry(contentRoot, "drafts", {
        createdAt: "2026-09-21T10:00:00Z",
      });
      assert.throws(
        () => validateTILContent(contentRoot),
        /createdAt must be an ISO-8601 KST timestamp/,
      );

      writeEntry(contentRoot, "drafts", {
        createdAt: "2026-09-21T10:00:00+09:00",
        updatedAt: "2026-09-21T09:59:59+09:00",
      });
      assert.throws(
        () => validateTILContent(contentRoot),
        /updatedAt must be greater than or equal to createdAt/,
      );

      writeEntry(contentRoot, "drafts", {
        createdAt: "2026-02-30T10:00:00+09:00",
      });
      assert.throws(
        () => validateTILContent(contentRoot),
        /createdAt is not a valid timestamp/,
      );
    } finally {
      cleanup(projectRoot);
    }
  });

  await t.test("impossible learning date", () => {
    const { projectRoot, contentRoot } = createFixture();
    try {
      const filePath = writeEntry(contentRoot, "drafts", {});
      writeFileSync(
        filePath,
        readFileSync(filePath, "utf8").replace(
          "date: 2026-09-21",
          "date: 2026-02-30",
        ),
        "utf8",
      );
      assert.throws(
        () => validateTILContent(contentRoot),
        /invalid date: 2026-02-30/,
      );
    } finally {
      cleanup(projectRoot);
    }
  });

  await t.test("duplicate id and slug", () => {
    const { projectRoot, contentRoot } = createFixture();
    try {
      writeEntry(contentRoot, "drafts", { id: "same-id", slug: "first-note" });
      writeEntry(contentRoot, "published", {
        id: "same-id",
        slug: "second-note",
        status: "published",
      });
      assert.throws(() => validateTILContent(contentRoot), /duplicate id same-id/);

      writeEntry(contentRoot, "published", {
        id: "second-id",
        slug: "second-note",
        status: "published",
      });
      writeEntry(contentRoot, "published", {
        id: "other-id",
        slug: "first-note",
        status: "published",
      });
      assert.throws(() => validateTILContent(contentRoot), /duplicate slug first-note/);
    } finally {
      cleanup(projectRoot);
    }
  });

  await t.test("unknown category", () => {
    const { projectRoot, contentRoot } = createFixture();
    try {
      writeEntry(contentRoot, "drafts", { category: "unknown" });
      assert.throws(() => validateTILContent(contentRoot), /unknown category: unknown/);
    } finally {
      cleanup(projectRoot);
    }
  });

  await t.test("invalid and unresolved links", () => {
    const { projectRoot, contentRoot } = createFixture();
    try {
      writeEntry(contentRoot, "drafts", {
        resources: "- github | repo | [Repo](javascript:alert) | 잘못된 링크",
      });
      assert.throws(() => validateTILContent(contentRoot), /invalid resource link/);

      writeEntry(contentRoot, "drafts", {
        resources: "- til | related | [관련 기록](/til/future-dream/?entry=missing-note)",
      });
      assert.throws(() => validateTILContent(contentRoot), /related TIL link does not resolve/);
    } finally {
      cleanup(projectRoot);
    }
  });
});

test("delete refuses an exact target with inbound related-TIL references", () => {
  const { projectRoot, contentRoot } = createFixture();
  try {
    writeEntry(contentRoot, "drafts", { id: "target-id", slug: "target-note" });
    writeEntry(contentRoot, "drafts", {
      id: "referrer-id",
      slug: "referrer-note",
      resources: "- til | target-link | [대상 기록](/til/future-dream/?entry=target-note)",
    });
    assert.throws(
      () => deleteTIL(contentRoot, "target-note", "drafts"),
      /referenced by: referrer-note/,
    );
    assert.equal(existsSync(path.join(contentRoot, "drafts", "target-note.md")), true);
  } finally {
    cleanup(projectRoot);
  }
});

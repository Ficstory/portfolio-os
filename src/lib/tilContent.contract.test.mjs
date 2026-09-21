import assert from "node:assert/strict";
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

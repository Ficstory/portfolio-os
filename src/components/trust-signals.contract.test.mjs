import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

function readSource(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

const trustSurfaceSource = [
  "src/app/resume/page.tsx",
  "src/components/folders/ResumeWindow.tsx",
  "src/components/mobile/MobileSection.tsx",
  "src/components/folders/ContactWindow.tsx",
  "src/components/projects/ProjectMetaPanel.tsx",
  "src/components/folders/projects/ProjectActivityLog.tsx",
  "src/data/projects.ts",
].map(readSource).join("\n");

const navigationSource = readSource("src/data/navigation.ts");
const linksSource = readSource("src/data/links.ts");
const foldersSource = readSource("src/data/folders.ts");
const dockSource = readSource("src/components/desktop/Dock.tsx");
const windowManagerSource = readSource("src/components/desktop/WindowManager.tsx");

test("public trust surfaces do not expose unfinished or empty-state copy", () => {
  assert.doesNotMatch(
    trustSurfaceSource,
    /PDF 준비 중|업데이트 예정|등록된 외부 링크가 없습니다|등록된 미디어가 없습니다|현재 배포 URL은 재검증|1순위 사례로 사용할 수 있습니다|연결하는 것이 좋습니다/,
  );
});

test("contact surfaces only expose external link slots with concrete hrefs", () => {
  assert.match(navigationSource, /type: "github"/);
  assert.match(navigationSource, /type: "email"/);
  assert.doesNotMatch(navigationSource, /type: "blog"/);
  assert.match(linksSource, /email: "mailto:dlwo4367@gmail\.com"/);
  assert.doesNotMatch(linksSource, /email: "mailto:"/);
});

test("unfinished Portfolio AI is not exposed as a root navigation window", () => {
  const rootNavigationSource = [
    navigationSource,
    foldersSource,
    dockSource,
    windowManagerSource,
  ].join("\n");

  assert.doesNotMatch(rootNavigationSource, /ai-chat|AI Chat|Portfolio AI|ChatWindow/);
});

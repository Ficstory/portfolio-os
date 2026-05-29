import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

function readSource(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

const navigationSource = readSource("src/data/navigation.ts");
const foldersSource = readSource("src/data/folders.ts");
const portfolioTypesSource = readSource("src/types/portfolio.ts");
const dockSource = readSource("src/components/desktop/Dock.tsx");
const windowManagerSource = readSource("src/components/desktop/WindowManager.tsx");
const chatWindowPath = path.join(root, "src/components/folders/ChatWindow.tsx");

test("dock exposes every internal portfolio menu in the expected order", () => {
  assert.match(
    dockSource,
    /const dockFolderIds = \[\s*"about",\s*"projects",\s*"skills",\s*"ai-chat",\s*"resume",\s*"contact",\s*\] as const;/s,
  );
  assert.match(navigationSource, /id: "ai-chat"/);
  assert.match(navigationSource, /label: "AI Chat"/);
  assert.match(navigationSource, /iconName: "Bot"/);
  assert.match(foldersSource, /id: "ai-chat"/);
  assert.match(portfolioTypesSource, /"ai-chat"/);
});

test("dock uses pointer-x magnification without losing open indicators and external link", () => {
  assert.match(dockSource, /useMotionValue/);
  assert.match(dockSource, /useTransform/);
  assert.match(dockSource, /useSpring/);
  assert.match(dockSource, /useReducedMotion/);
  assert.match(dockSource, /restoreWindow/);
  assert.match(dockSource, /onPointerMove/);
  assert.match(dockSource, /onPointerLeave/);
  assert.match(dockSource, /Number\.POSITIVE_INFINITY/);
  assert.match(dockSource, /width: smoothSize/);
  assert.match(dockSource, /height: smoothSize/);
  assert.match(dockSource, /y: smoothY/);
  assert.match(dockSource, /isOpen \? \(/);
  assert.match(dockSource, /href=\{links\.github\}/);
  assert.match(dockSource, /focus-visible:outline/);
});

test("ai chat opens as an internal portfolio window with a placeholder chat UI", () => {
  assert.ok(existsSync(chatWindowPath), "ChatWindow component should exist");

  const chatWindowSource = readFileSync(chatWindowPath, "utf8");

  assert.match(windowManagerSource, /import \{ ChatWindow \}/);
  assert.match(windowManagerSource, /case "ai-chat":\s*return <ChatWindow \/>;/);
  assert.match(chatWindowSource, /textarea/);
  assert.match(chatWindowSource, /type="submit"/);
  assert.match(chatWindowSource, /currently preparing/);
  assert.match(chatWindowSource, /대표 프로젝트/);
  assert.match(chatWindowSource, /프론트엔드 기술/);
});

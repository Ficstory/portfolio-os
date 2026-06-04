import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("dock exposes every ready internal portfolio menu in the expected order", () => {
  assert.match(
    dockSource,
    /const dockFolderIds = \[\s*"about",\s*"career-tracks",\s*"projects",\s*"skills",\s*"resume",\s*"contact",\s*\] as const;/s,
  );
  assert.doesNotMatch(navigationSource, /id: "ai-chat"/);
  assert.doesNotMatch(navigationSource, /label: "AI Chat"/);
  assert.doesNotMatch(foldersSource, /id: "ai-chat"/);
  assert.doesNotMatch(portfolioTypesSource, /"ai-chat"/);
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

test("dock can render generated 3d icon assets before falling back to lucide icons", () => {
  assert.match(navigationSource, /dockIconSrc: "\/icons\/dock\/about\.webp"/);
  assert.match(navigationSource, /dockIconSrc: "\/icons\/dock\/projects\.webp"/);
  assert.match(navigationSource, /dockIconSrc: "\/icons\/dock\/skills\.webp"/);
  assert.match(navigationSource, /dockIconSrc: "\/icons\/dock\/resume\.webp"/);
  assert.match(navigationSource, /dockIconSrc: "\/icons\/dock\/contact\.webp"/);
  assert.match(dockSource, /item\.dockIconSrc \? \(/);
  assert.match(dockSource, /<DockIconImage src=\{item\.dockIconSrc\}/);
  assert.match(dockSource, /alt=""/);
  assert.match(dockSource, /dockIconSrc="\/icons\/dock\/git\.webp"/);
});

test("unfinished ai chat is not exposed as an internal portfolio window", () => {
  assert.doesNotMatch(windowManagerSource, /import \{ ChatWindow \}/);
  assert.doesNotMatch(windowManagerSource, /case "ai-chat"/);
  assert.doesNotMatch(dockSource, /"ai-chat"/);
});

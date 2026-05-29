import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

const appWindowSource = readFileSync(
  path.join(root, "src/components/desktop/AppWindow.tsx"),
  "utf8",
);
const windowManagerSource = readFileSync(
  path.join(root, "src/components/desktop/WindowManager.tsx"),
  "utf8",
);
const desktopStoreSource = readFileSync(
  path.join(root, "src/stores/desktopStore.ts"),
  "utf8",
);
const globalsSource = readFileSync(
  path.join(root, "src/app/globals.css"),
  "utf8",
);

test("window close control closes before titlebar drag or focus handlers can intercept it", () => {
  assert.match(appWindowSource, /handleClosePointerDown/);
  assert.match(appWindowSource, /event\.preventDefault\(\)/);
  assert.match(appWindowSource, /event\.stopPropagation\(\)/);
  assert.match(appWindowSource, /closeWindow\(id\)/);
  assert.match(appWindowSource, /onPointerDown=\{handleClosePointerDown\}/);
  assert.match(appWindowSource, /onClick=\{handleCloseClick\}/);
});

test("window surfaces are opaque enough that covered close buttons do not look clickable", () => {
  assert.match(appWindowSource, /window-surface/);
  assert.match(appWindowSource, /bg-\[var\(--color-surface-strong\)\]/);
  assert.match(globalsSource, /\.window-surface/);
  assert.doesNotMatch(appWindowSource, /bg-white\/42/);
});

test("desktop store separates minimize, restore, maximize, and resize lifecycle actions", () => {
  assert.match(desktopStoreSource, /isMinimized: boolean/);
  assert.match(desktopStoreSource, /isMaximized: boolean/);
  assert.match(desktopStoreSource, /restorePosition/);
  assert.match(desktopStoreSource, /restoreSize/);
  assert.match(desktopStoreSource, /toggleMinimize: \(id: WindowId\) => void/);
  assert.match(desktopStoreSource, /restoreWindow: \(id: WindowId\) => void/);
  assert.match(desktopStoreSource, /toggleMaximize: \(id: WindowId\) => void/);
  assert.match(desktopStoreSource, /resizeWindow: \(id: WindowId, size: WindowSize\) => void/);
});

test("app windows use motion, lifecycle controls, and pointer-captured bottom-right resizing", () => {
  assert.match(appWindowSource, /import \{ motion, useReducedMotion \} from "motion\/react"/);
  assert.match(appWindowSource, /<motion\.section/);
  assert.match(appWindowSource, /initial=\{/);
  assert.match(appWindowSource, /animate=\{/);
  assert.match(appWindowSource, /exit=\{/);
  assert.match(appWindowSource, /toggleMinimize/);
  assert.match(appWindowSource, /toggleMaximize/);
  assert.match(appWindowSource, /resizeWindow/);
  assert.match(appWindowSource, /requestAnimationFrame/);
  assert.match(appWindowSource, /setPointerCapture/);
  assert.match(appWindowSource, /releasePointerCapture/);
  assert.match(appWindowSource, /aria-label="Minimize window"/);
  assert.match(appWindowSource, /"Maximize window"/);
  assert.match(appWindowSource, /aria-label="Resize window"/);
});

test("window manager keeps minimized windows in state while animating their exit", () => {
  assert.match(windowManagerSource, /import \{ AnimatePresence \} from "motion\/react"/);
  assert.match(windowManagerSource, /<AnimatePresence/);
  assert.match(windowManagerSource, /windows\.filter\(\(window\) => !window\.isMinimized\)/);
});

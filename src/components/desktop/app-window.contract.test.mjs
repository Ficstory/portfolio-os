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
const desktopShellSource = readFileSync(
  path.join(root, "src/components/desktop/DesktopShell.tsx"),
  "utf8",
);
const desktopStoreSource = readFileSync(
  path.join(root, "src/stores/desktopStore.ts"),
  "utf8",
);
const foldersSource = readFileSync(
  path.join(root, "src/data/folders.ts"),
  "utf8",
);
const portfolioTypesSource = readFileSync(
  path.join(root, "src/types/portfolio.ts"),
  "utf8",
);
const globalsSource = readFileSync(
  path.join(root, "src/app/globals.css"),
  "utf8",
);
const maximizedWindowBoundsSource = desktopStoreSource.slice(
  desktopStoreSource.indexOf("function getMaximizedWindowBounds"),
  desktopStoreSource.indexOf("function getFilledWindowBounds"),
);
const resizeHandlesSource = appWindowSource.slice(
  appWindowSource.indexOf("const resizeHandles"),
  appWindowSource.indexOf("function getResizedFrame"),
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
  assert.match(desktopStoreSource, /isFilled: boolean/);
  assert.match(desktopStoreSource, /fillRestorePosition/);
  assert.match(desktopStoreSource, /fillRestoreSize/);
  assert.match(desktopStoreSource, /toggleMinimize: \(id: WindowId\) => void/);
  assert.match(desktopStoreSource, /restoreWindow: \(id: WindowId\) => void/);
  assert.match(desktopStoreSource, /toggleMaximize: \(id: WindowId\) => void/);
  assert.match(desktopStoreSource, /toggleFill: \(id: WindowId\) => void/);
  assert.match(desktopStoreSource, /resizeWindow: \(id: WindowId, size: WindowSize\) => void/);
  assert.match(desktopStoreSource, /resizeWindowFrame: \(id: WindowId, position: WindowPosition, size: WindowSize\) => void/);
});

test("maximized windows use a full-screen viewport bound above desktop chrome", () => {
  assert.doesNotMatch(maximizedWindowBoundsSource, /DOCK_RESERVED_HEIGHT/);
  assert.doesNotMatch(maximizedWindowBoundsSource, /MENUBAR_HEIGHT/);
  assert.match(maximizedWindowBoundsSource, /position:\s*\{\s*x:\s*0,\s*y:\s*0,\s*\}/s);
  assert.match(maximizedWindowBoundsSource, /const width = Math\.max\(\s*MIN_WINDOW_SIZE\.width,\s*viewport\.width,\s*\)/s);
  assert.match(maximizedWindowBoundsSource, /const height = Math\.max\(\s*MIN_WINDOW_SIZE\.height,\s*viewport\.height,\s*\)/s);
  assert.match(appWindowSource, /FULL_SCREEN_WINDOW_Z_INDEX/);
  assert.match(appWindowSource, /isMaximized \? FULL_SCREEN_WINDOW_Z_INDEX : zIndex/);
  assert.match(appWindowSource, /isMaximized && "rounded-none border-transparent shadow-none"/);
  assert.match(appWindowSource, /isMaximized \? null : resizeHandles\.map/);
});

test("titlebar double-click uses macOS fill without changing the full-screen traffic light", () => {
  assert.match(appWindowSource, /toggleFill/);
  assert.match(appWindowSource, /handleTitlebarDoubleClick/);
  assert.match(appWindowSource, /onDoubleClick=\{handleTitlebarDoubleClick\}/);
  assert.match(appWindowSource, /if \(isMaximized\)/);
  assert.match(appWindowSource, /toggleFill\(id\)/);
  assert.match(appWindowSource, /"Enter full screen"/);
  assert.match(appWindowSource, /onClick=\{handleMaximizeClick\}/);
});

test("filled windows use the visible desktop work area instead of full-screen bounds", () => {
  assert.match(desktopStoreSource, /const MENU_BAR_HEIGHT = 32/);
  assert.match(desktopStoreSource, /const DOCK_RESERVED_HEIGHT = 112/);
  assert.match(desktopStoreSource, /function getFilledWindowBounds/);
  assert.match(desktopStoreSource, /y:\s*MENU_BAR_HEIGHT \+ DESKTOP_EDGE_INSET/);
  assert.match(desktopStoreSource, /viewport\.height - MENU_BAR_HEIGHT - DOCK_RESERVED_HEIGHT - DESKTOP_EDGE_INSET \* 2/);
  assert.match(desktopStoreSource, /isFilled: true/);
  assert.match(desktopStoreSource, /isFilled: false/);
});

test("folder windows use viewport ratio presets with min and max clamps", () => {
  assert.match(portfolioTypesSource, /export type WindowSizePreset/);
  assert.match(portfolioTypesSource, /widthRatio: number/);
  assert.match(portfolioTypesSource, /heightRatio: number/);
  assert.match(portfolioTypesSource, /minWidth: number/);
  assert.match(desktopStoreSource, /function resolveWindowSizePreset/);
  assert.match(desktopStoreSource, /getDefaultWindowSize\(\s*id: WindowId,\s*position: WindowPosition,\s*\)/);
  assert.match(foldersSource, /widthRatio: 0\.78/);
  assert.match(foldersSource, /maxWidth: 1120/);
});

test("about window opens tall enough to avoid awkward first-view clipping", () => {
  const aboutWindowPreset = foldersSource.slice(
    foldersSource.indexOf('id: "about"'),
    foldersSource.indexOf('id: "career-tracks"'),
  );

  assert.match(aboutWindowPreset, /heightRatio: 0\.78/);
  assert.match(aboutWindowPreset, /minHeight: 620/);
  assert.match(aboutWindowPreset, /maxHeight: 700/);
});

test("desktop shell raises the window layer above menu bar and dock while full screen", () => {
  assert.match(desktopShellSource, /useDesktopStore/);
  assert.match(desktopShellSource, /hasMaximizedWindow/);
  assert.match(desktopShellSource, /window\.isMaximized && !window\.isMinimized/);
  assert.match(desktopShellSource, /hasMaximizedWindow \? "z-\[1100\]" : "z-\[800\]"/);
  assert.match(desktopShellSource, /z-\[1000\]/);
  assert.match(desktopShellSource, /z-\[900\]/);
});

test("desktop wallpaper overlay uses time-aware theme variables", () => {
  assert.match(desktopShellSource, /desktop-wallpaper-overlay/);
  assert.doesNotMatch(desktopShellSource, /rgba\(255,255,255,0\.28\)/);
  assert.match(globalsSource, /--desktop-overlay-highlight/);
  assert.match(globalsSource, /--desktop-overlay-depth/);
  assert.match(
    globalsSource,
    /\[data-time-theme="night"\]\[data-theme="light"\][\s\S]*--desktop-overlay-highlight:\s*rgba\(255,\s*255,\s*255,\s*0\.06\);/,
  );
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
  assert.match(appWindowSource, /"Enter full screen"/);
  assert.match(appWindowSource, /aria-label="Resize window"/);
});

test("app windows expose macOS-style edge and corner resize handles", () => {
  for (const direction of ["n", "e", "s", "w", "ne", "se", "sw", "nw"]) {
    assert.match(appWindowSource, new RegExp(`direction: "${direction}"`));
  }

  assert.match(appWindowSource, /resizeHandles\.map/);
  assert.match(appWindowSource, /handleResizePointerDown\(handle\.direction\)/);
  assert.match(appWindowSource, /cursor-ns-resize/);
  assert.match(appWindowSource, /cursor-ew-resize/);
  assert.match(appWindowSource, /cursor-nesw-resize/);
  assert.match(appWindowSource, /cursor-nwse-resize/);
  assert.match(appWindowSource, /isMaximized \? null : resizeHandles\.map/);
});

test("resize hit areas stay inside the clipped window surface", () => {
  assert.doesNotMatch(resizeHandlesSource, /translate-[xy]-1\/2/);
  assert.doesNotMatch(resizeHandlesSource, /-translate-[xy]-1\/2/);
  assert.match(resizeHandlesSource, /h-3/);
  assert.match(resizeHandlesSource, /w-3/);
  assert.match(resizeHandlesSource, /size-5/);
});

test("edge resizing can move the window origin while keeping the opposite edge anchored", () => {
  assert.match(appWindowSource, /type ResizeDirection/);
  assert.match(appWindowSource, /direction\.includes\("w"\)/);
  assert.match(appWindowSource, /direction\.includes\("n"\)/);
  assert.match(appWindowSource, /startPosition\.x \+ startSize\.width - width/);
  assert.match(appWindowSource, /startPosition\.y \+ startSize\.height - height/);
  assert.match(appWindowSource, /resizeWindowFrame\(id, pendingFrame\.position, pendingFrame\.size\)/);
});

test("window controls use macOS traffic-light styling", () => {
  assert.match(appWindowSource, /bg-\[#ff5f57\]/);
  assert.match(appWindowSource, /bg-\[#febc2e\]/);
  assert.match(appWindowSource, /bg-\[#28c840\]/);
  assert.match(appWindowSource, /rounded-full/);
  assert.doesNotMatch(appWindowSource, /rounded-md bg-\[#e98b74\]/);
});

test("window manager keeps minimized windows in state while animating their exit", () => {
  assert.match(windowManagerSource, /import \{ AnimatePresence \} from "motion\/react"/);
  assert.match(windowManagerSource, /<AnimatePresence/);
  assert.match(windowManagerSource, /windows\.filter\(\(window\) => !window\.isMinimized\)/);
});

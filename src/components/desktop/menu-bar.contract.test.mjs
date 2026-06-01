import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

const menuBarSource = readFileSync(
  path.join(root, "src/components/desktop/MenuBar.tsx"),
  "utf8",
);
const desktopStoreSource = readFileSync(
  path.join(root, "src/stores/desktopStore.ts"),
  "utf8",
);
const pageSource = readFileSync(
  path.join(root, "src/app/page.tsx"),
  "utf8",
);
const globalsSource = readFileSync(
  path.join(root, "src/app/globals.css"),
  "utf8",
);

test("menu bar floats over the wallpaper without the shared glass surface", () => {
  assert.match(menuBarSource, /menu-bar-surface/);
  assert.doesNotMatch(menuBarSource, /glass-surface/);
  assert.match(globalsSource, /\.menu-bar-surface/);
  assert.match(globalsSource, /background:\s*transparent;/);
  assert.match(globalsSource, /border:\s*0;/);
  assert.match(globalsSource, /backdrop-filter:\s*none;/);
});

test("menu bar uses time theme variables for readable wallpaper contrast", () => {
  assert.match(globalsSource, /--color-menu-bar-text/);
  assert.match(globalsSource, /--color-menu-bar-muted/);
  assert.match(globalsSource, /--menu-bar-text-shadow/);
  assert.match(globalsSource, /\[data-time-theme="day"\][\s\S]*--color-menu-bar-text:\s*#0f172a;/);
  assert.match(globalsSource, /\[data-time-theme="night"\][\s\S]*--color-menu-bar-text:\s*rgba\(248,\s*250,\s*252,\s*0\.96\);/);
});

test("menu bar brand icon returns the portfolio to the lock screen", () => {
  assert.match(menuBarSource, /const lock = useDesktopStore/);
  assert.match(menuBarSource, /aria-label="Lock screen"/);
  assert.match(menuBarSource, /onClick=\{lock\}/);
  assert.match(desktopStoreSource, /lock:\s*\(\)\s*=>\s*void/);
  assert.match(desktopStoreSource, /lock:\s*\(\)\s*=>\s*\{\s*set\(\{\s*hasUnlocked:\s*false\s*\}\);\s*\}/);
  assert.match(pageSource, /const isDesktopVisible = hasUnlocked \|\| isUnlocking;/);
  assert.match(pageSource, /\{!hasUnlocked \? \(/);
  assert.doesNotMatch(pageSource, /setIsUnlocked/);
});

test("menu bar exposes placeholder menu headings for later actions", () => {
  assert.match(menuBarSource, /"Format"/);
  assert.match(menuBarSource, /"Window"/);
  assert.match(menuBarSource, /"Help"/);
  assert.match(menuBarSource, /menuPlaceholderItems\.map/);
});

test("page resolves appearance mode separately from the wallpaper time theme", () => {
  assert.match(pageSource, /useThemeStore/);
  assert.match(pageSource, /resolveAppearanceMode/);
  assert.match(pageSource, /data-time-theme=\{timeOfDay\}/);
  assert.match(pageSource, /data-theme=\{resolvedTheme\}/);
  assert.doesNotMatch(pageSource, /data-theme=\{themeMode\}/);
});

test("page refreshes the time theme from a minute clock", () => {
  assert.match(pageSource, /useMinuteClock/);
  assert.doesNotMatch(
    pageSource,
    /getTimeOfDay\(new Date\(\)\.getHours\(\)\),\s*\[\]/,
  );
});

test("appearance menu replaces the old immediate theme toggle", () => {
  assert.match(menuBarSource, /aria-haspopup="menu"/);
  assert.match(menuBarSource, /aria-expanded=\{isAppearanceMenuOpen\}/);
  assert.match(menuBarSource, /role="menu"/);
  assert.match(menuBarSource, /role="menuitemradio"/);
  assert.match(menuBarSource, /aria-checked=\{isSelected\}/);
  assert.match(menuBarSource, /setAppearanceMode/);
  assert.match(menuBarSource, /"auto"/);
  assert.match(menuBarSource, /"light"/);
  assert.match(menuBarSource, /"dark"/);
  assert.match(menuBarSource, /Check/);
  assert.match(menuBarSource, /Escape/);
  assert.doesNotMatch(menuBarSource, /Theme toggle coming soon/);
});

test("light appearance is corrected on dark time-theme wallpapers", () => {
  assert.match(globalsSource, /\[data-time-theme="night"\]\[data-theme="light"\]/);
  assert.match(globalsSource, /\[data-time-theme="evening"\]\[data-theme="light"\]/);
  assert.match(globalsSource, /\[data-time-theme="dawn"\]\[data-theme="light"\]/);
  assert.match(globalsSource, /--shadow-window/);
  assert.match(globalsSource, /\.window-shadow[\s\S]*box-shadow:\s*var\(--shadow-window\);/);
});

test("menu bar opens a spotlight-style portfolio search from the utility area", () => {
  assert.match(menuBarSource, /Search/);
  assert.match(menuBarSource, /aria-label="Open portfolio search"/);
  assert.match(menuBarSource, /aria-label="Portfolio search"/);
  assert.match(menuBarSource, /placeholder="Search projects, skills, resume\.\.\."/);
  assert.match(menuBarSource, /searchButtonRef/);
  assert.match(menuBarSource, /searchInputRef/);
  assert.match(menuBarSource, /Escape/);
  assert.match(globalsSource, /\.search-palette-backdrop/);
  assert.match(globalsSource, /\.search-palette-surface/);
});

test("portfolio search indexes primary windows, projects, and skills", () => {
  assert.match(menuBarSource, /navigationItems/);
  assert.match(menuBarSource, /projects/);
  assert.match(menuBarSource, /skills/);
  assert.match(menuBarSource, /openWindow\(result\.windowId,\s*result\.windowTitle\)/);
  assert.match(menuBarSource, /`project-\$\{project\.slug\}`/);
  assert.match(menuBarSource, /const visibleSearchResults/);
  assert.match(menuBarSource, /searchText/);
  assert.match(menuBarSource, /No matching portfolio items/);
});

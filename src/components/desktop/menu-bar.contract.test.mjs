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

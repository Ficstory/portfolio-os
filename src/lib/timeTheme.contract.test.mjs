import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const root = path.resolve(__dirname, "../..");
const sourcePath = path.join(root, "src/lib/timeTheme.ts");

function loadTimeThemeModule() {
  const source = readFileSync(sourcePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
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

const {
  getThemeModeForTimeOfDay,
  getTimeOfDay,
  getWallpaperForTimeOfDay,
} = loadTimeThemeModule();

test("maps boundary hours to the expected time of day", () => {
  assert.equal(getTimeOfDay(4), "dawn");
  assert.equal(getTimeOfDay(8), "dawn");
  assert.equal(getTimeOfDay(9), "day");
  assert.equal(getTimeOfDay(16), "day");
  assert.equal(getTimeOfDay(17), "evening");
  assert.equal(getTimeOfDay(20), "evening");
  assert.equal(getTimeOfDay(21), "night");
  assert.equal(getTimeOfDay(3), "night");
});

test("returns the wallpaper path for each time of day", () => {
  assert.equal(getWallpaperForTimeOfDay("dawn"), "/images/wallpapers/dawn.png");
  assert.equal(getWallpaperForTimeOfDay("day"), "/images/wallpapers/day.png");
  assert.equal(
    getWallpaperForTimeOfDay("evening"),
    "/images/wallpapers/evening.png",
  );
  assert.equal(getWallpaperForTimeOfDay("night"), "/images/wallpapers/night.png");
});

test("uses light theme only during the day", () => {
  assert.equal(getThemeModeForTimeOfDay("day"), "light");
  assert.equal(getThemeModeForTimeOfDay("dawn"), "dark");
  assert.equal(getThemeModeForTimeOfDay("evening"), "dark");
  assert.equal(getThemeModeForTimeOfDay("night"), "dark");
});

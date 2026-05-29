import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

const lockScreenSource = readFileSync(
  path.join(root, "src/components/lock-screen/LockScreen.tsx"),
  "utf8",
);
const swipeUnlockControlSource = readFileSync(
  path.join(root, "src/components/lock-screen/SwipeUnlockControl.tsx"),
  "utf8",
);
const lockFeatureSource = `${lockScreenSource}\n${swipeUnlockControlSource}`;
const pageSource = readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
const desktopShellSource = readFileSync(
  path.join(root, "src/components/desktop/DesktopShell.tsx"),
  "utf8",
);

test("lock screen uses swipe unlock UI instead of the passcode panel", () => {
  assert.match(lockFeatureSource, /SWIPE UP TO UNLOCK PORTFOLIO/);
  assert.match(lockFeatureSource, /aria-label="Unlock portfolio"/);
  assert.match(lockFeatureSource, /ChevronUp/);
  assert.doesNotMatch(lockFeatureSource, /Passcode ready/);
  assert.doesNotMatch(lockFeatureSource, />\s*Unlock Portfolio\s*</);
  assert.doesNotMatch(lockFeatureSource, /ArrowRight/);
});

test("lock screen unlocks through enter, upward wheel, click, and upward pointer drag", () => {
  assert.match(lockFeatureSource, /event\.key === "Enter"/);
  assert.match(lockFeatureSource, /WheelEvent/);
  assert.match(lockFeatureSource, /deltaY < 0/);
  assert.match(lockFeatureSource, /SWIPE_UNLOCK_THRESHOLD/);
  assert.match(lockFeatureSource, /onPointerDown/);
  assert.match(lockFeatureSource, /onPointerUp/);
  assert.match(lockFeatureSource, /onClick=\{onUnlock\}/);
});

test("home keeps the shared wallpaper while lock dim fades and desktop is revealed", () => {
  assert.match(pageSource, /isUnlocked/);
  assert.match(pageSource, /isUnlocking/);
  assert.match(pageSource, /isBooting/);
  assert.match(pageSource, /BOOT_SEQUENCE_MS/);
  assert.match(pageSource, /getTimeOfDay/);
  assert.match(pageSource, /getWallpaperForTimeOfDay/);
  assert.match(pageSource, /getThemeModeForTimeOfDay/);
  assert.match(pageSource, /backgroundImage:\s*`url\(\$\{wallpaperUrl\}\)`/);
  assert.match(pageSource, /data-time-theme=\{timeOfDay\}/);
  assert.match(pageSource, /data-theme=\{themeMode\}/);
  assert.match(pageSource, /opacity:\s*`var\(--wallpaper-dim-\$\{dimState\}\)`/);
  assert.doesNotMatch(pageSource, /bg-\[url\('\/images\/lock-wallpaper\.png'\)\]/);
  assert.doesNotMatch(pageSource, /opacity-\[0\.45\]/);
  assert.doesNotMatch(pageSource, /opacity-\[0\.08\]/);
  assert.match(pageSource, /setTimeout/);
  assert.doesNotMatch(pageSource, /if \(hasUnlocked\)\s*\{\s*return <DesktopShell \/>/);
});

test("unlock flow shows a branded boot sequence before revealing the desktop", () => {
  assert.match(pageSource, /PortfolioBootScreen/);
  assert.match(pageSource, /aria-label="Portfolio boot sequence"/);
  assert.match(pageSource, /JH/);
  assert.match(pageSource, /Portfolio OS/);
  assert.match(pageSource, /animate-pulse/);
  assert.match(pageSource, /isDesktopVisible = isUnlocked/);
  assert.match(pageSource, /unlock\(\)/);
});

test("unlock flow reveals the desktop without auto-opening the about window", () => {
  assert.match(pageSource, /<DesktopShell isVisible=\{isDesktopVisible\} \/>/);
  assert.doesNotMatch(pageSource, /openWindow\("about"/);
  assert.doesNotMatch(pageSource, /windows\.some\(\(window\) => window\.id === "about"\)/);
});

test("desktop elements can fade in with staggered timing over the shared background", () => {
  assert.match(desktopShellSource, /isVisible/);
  assert.match(desktopShellSource, /delay-\[200ms\]/);
  assert.match(desktopShellSource, /delay-\[350ms\]/);
  assert.match(desktopShellSource, /delay-\[450ms\]/);
  assert.match(desktopShellSource, /Dock/);
  assert.match(desktopShellSource, /WindowManager/);
  assert.doesNotMatch(desktopShellSource, /DesktopIconGrid/);
  assert.doesNotMatch(desktopShellSource, /className="wallpaper/);
});

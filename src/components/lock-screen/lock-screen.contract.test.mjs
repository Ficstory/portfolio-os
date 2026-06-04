import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
const layoutSource = readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
const desktopShellSource = readFileSync(
  path.join(root, "src/components/desktop/DesktopShell.tsx"),
  "utf8",
);
const portfolioDesktopShellPath = path.join(
  root,
  "src/components/portfolio/PortfolioDesktopShell.tsx",
);
const portfolioDesktopShellSource = existsSync(portfolioDesktopShellPath)
  ? readFileSync(portfolioDesktopShellPath, "utf8")
  : "";

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
  assert.match(pageSource, /hasUnlocked/);
  assert.match(pageSource, /isUnlocking/);
  assert.match(pageSource, /getTimeOfDay/);
  assert.match(pageSource, /getWallpaperForTimeOfDay/);
  assert.match(pageSource, /resolveAppearanceMode/);
  assert.match(pageSource, /useThemeStore/);
  assert.match(pageSource, /backgroundImage:\s*`url\(\$\{wallpaperUrl\}\)`/);
  assert.match(pageSource, /data-time-theme=\{timeOfDay\}/);
  assert.match(pageSource, /data-theme=\{resolvedTheme\}/);
  assert.match(pageSource, /opacity:\s*`var\(--wallpaper-dim-\$\{dimState\}\)`/);
  assert.doesNotMatch(pageSource, /bg-\[url\('\/images\/lock-wallpaper\.png'\)\]/);
  assert.doesNotMatch(pageSource, /opacity-\[0\.45\]/);
  assert.doesNotMatch(pageSource, /opacity-\[0\.08\]/);
  assert.match(pageSource, /setTimeout/);
  assert.doesNotMatch(pageSource, /if \(hasUnlocked\)\s*\{\s*return <DesktopShell \/>/);
});

test("home owns the clock and passes the current time through lock and desktop surfaces", () => {
  assert.match(pageSource, /const now = useMinuteClock\(\);/);
  assert.match(
    pageSource,
    /<PortfolioDesktopShell isVisible=\{isDesktopVisible\} now=\{now\} resolvedTheme=\{resolvedTheme\} \/>/,
  );
  assert.match(
    pageSource,
    /<LockScreen isUnlocking=\{isUnlocking\} now=\{now\} onUnlock=\{startUnlock\} \/>/,
  );
  assert.match(lockScreenSource, /now: Date;/);
  assert.match(lockScreenSource, /export function LockScreen\(\{\s*isUnlocking,\s*now,\s*onUnlock,/);
  assert.doesNotMatch(lockScreenSource, /function useMinuteClock\(\)/);
  assert.match(desktopShellSource, /now: Date;/);
  assert.match(desktopShellSource, /<MenuBar now=\{now\} resolvedTheme=\{resolvedTheme\} \/>/);
  assert.match(portfolioDesktopShellSource, /<PortfolioTrackProvider trackId="default">/);
  assert.match(
    portfolioDesktopShellSource,
    /<DesktopShell isVisible=\{isVisible\} now=\{now\} resolvedTheme=\{resolvedTheme\} \/>/,
  );
});

test("home defers the desktop shell until unlock to keep the initial lock screen light", () => {
  assert.match(pageSource, /dynamic\(/);
  assert.match(
    pageSource,
    /import\("@\/components\/portfolio\/PortfolioDesktopShell"\)/,
  );
  assert.match(pageSource, /ssr:\s*false/);
  assert.doesNotMatch(
    pageSource,
    /import \{ DesktopShell \} from "@\/components\/desktop\/DesktopShell";/,
  );
  assert.doesNotMatch(
    pageSource,
    /import \{ PortfolioTrackProvider \} from "@\/components\/portfolio\/PortfolioTrackProvider";/,
  );
  assert.match(pageSource, /\{isDesktopVisible \? \(/);
  assert.match(
    pageSource,
    /<PortfolioDesktopShell isVisible=\{isDesktopVisible\} now=\{now\} resolvedTheme=\{resolvedTheme\} \/>/,
  );
});

test("lock screen time and wallpaper are corrected before full hydration", () => {
  assert.match(layoutSource, /syncInitialPortfolioClock/);
  assert.match(layoutSource, /data-live-clock="time"/);
  assert.match(layoutSource, /data-live-clock="date"/);
  assert.match(layoutSource, /data-portfolio-root/);
  assert.match(layoutSource, /data-wallpaper-layer/);
  assert.match(layoutSource, /\/images\/wallpapers\/day\.webp/);
  assert.doesNotMatch(layoutSource, /\/images\/wallpapers\/day\.png/);
  assert.match(pageSource, /data-portfolio-root/);
  assert.match(pageSource, /data-wallpaper-layer/);
  assert.match(lockScreenSource, /data-live-clock="time"/);
  assert.match(lockScreenSource, /data-live-clock="date"/);
});

test("unlock flow reveals the desktop without a boot or loading screen", () => {
  const unlockDurationMatch = pageSource.match(
    /const UNLOCK_ANIMATION_MS = (\d+);/,
  );
  assert.ok(unlockDurationMatch, "UNLOCK_ANIMATION_MS constant should exist");
  const unlockDuration = Number(unlockDurationMatch[1]);

  assert.ok(
    unlockDuration >= 500 && unlockDuration <= 600,
    `UNLOCK_ANIMATION_MS should be 500-600ms, received ${unlockDuration}ms`,
  );
  assert.doesNotMatch(pageSource, /PortfolioBootScreen/);
  assert.doesNotMatch(pageSource, /BOOT_SEQUENCE_MS/);
  assert.doesNotMatch(pageSource, /isBooting/);
  assert.doesNotMatch(pageSource, /bootTimerRef/);
  assert.doesNotMatch(pageSource, /aria-label="Portfolio boot sequence"/);
  assert.doesNotMatch(pageSource, /Portfolio OS/);
  assert.doesNotMatch(pageSource, /animate-pulse/);
  assert.match(pageSource, /isDesktopVisible = hasUnlocked \|\| isUnlocking/);
  assert.match(
    pageSource,
    /<PortfolioDesktopShell isVisible=\{isDesktopVisible\} now=\{now\} resolvedTheme=\{resolvedTheme\} \/>/,
  );
  assert.match(pageSource, /\{!hasUnlocked \? \(/);
  assert.match(pageSource, /setIsUnlocking\(true\)/);
  assert.match(pageSource, /unlock\(\)/);
  assert.match(pageSource, /setIsUnlocking\(false\)/);
  assert.doesNotMatch(pageSource, /setIsUnlocked/);
});

test("unlock flow reveals the desktop without auto-opening the about window", () => {
  assert.match(
    pageSource,
    /<PortfolioDesktopShell isVisible=\{isDesktopVisible\} now=\{now\} resolvedTheme=\{resolvedTheme\} \/>/,
  );
  assert.doesNotMatch(pageSource, /openWindow\("about"/);
  assert.doesNotMatch(pageSource, /windows\.some\(\(window\) => window\.id === "about"\)/);
});

test("desktop elements fade in quickly over the shared background", () => {
  assert.match(desktopShellSource, /isVisible/);
  assert.match(desktopShellSource, /delay-\[(?:\d+)ms\]/);
  assert.doesNotMatch(desktopShellSource, /delay-\[(?:2[0-9]{2}|[3-9][0-9]{2}|[1-9][0-9]{3,})ms\]/);
  assert.match(desktopShellSource, /Dock/);
  assert.match(desktopShellSource, /WindowManager/);
  assert.doesNotMatch(desktopShellSource, /DesktopIconGrid/);
  assert.doesNotMatch(desktopShellSource, /className="wallpaper/);
});

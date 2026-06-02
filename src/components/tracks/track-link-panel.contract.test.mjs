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

const trackLinkPanelPath = path.join(root, "src/components/tracks/TrackLinkPanel.tsx");
const typesSource = readSource("src/types/portfolio.ts");
const foldersSource = readSource("src/data/folders.ts");
const navigationSource = readSource("src/data/navigation.ts");
const dockSource = readSource("src/components/desktop/Dock.tsx");
const desktopIconGridSource = readSource("src/components/desktop/DesktopIconGrid.tsx");
const windowManagerSource = readSource("src/components/desktop/WindowManager.tsx");
const mobileHomeSource = readSource("src/components/mobile/MobileHome.tsx");
const mobileSectionSource = readSource("src/components/mobile/MobileSection.tsx");

test("root OS exposes Career Tracks as a first-class internal folder", () => {
  assert.match(typesSource, /"career-tracks"/);
  assert.match(foldersSource, /id: "career-tracks"/);
  assert.match(foldersSource, /title: "Career Tracks"/);
  assert.match(navigationSource, /id: "career-tracks"/);
  assert.match(navigationSource, /label: "Tracks"/);
  assert.match(navigationSource, /windowId: "career-tracks"/);
});

test("desktop and mobile surfaces can open the Career Tracks window", () => {
  assert.match(
    dockSource,
    /const dockFolderIds = \[\s*"about",\s*"career-tracks",\s*"projects",\s*"skills",\s*"ai-chat",\s*"resume",\s*"contact",\s*\] as const;/s,
  );
  assert.match(dockSource, /Route/);
  assert.match(desktopIconGridSource, /Route/);
  assert.match(mobileHomeSource, /Route/);
  assert.match(mobileSectionSource, /"career-tracks":/);
  assert.match(windowManagerSource, /import \{ TrackLinkPanel \}/);
  assert.match(windowManagerSource, /case "career-tracks":\s*return <TrackLinkPanel \/>;/);
});

test("TrackLinkPanel links to all direct-link portfolio tracks", () => {
  assert.ok(existsSync(trackLinkPanelPath), "TrackLinkPanel component should exist");

  const trackLinkPanelSource = readFileSync(trackLinkPanelPath, "utf8");

  assert.match(trackLinkPanelSource, /\/public-digital/);
  assert.match(trackLinkPanelSource, /\/pm/);
  assert.match(trackLinkPanelSource, /\/policy/);
  assert.match(trackLinkPanelSource, /\/assembly/);
  assert.match(trackLinkPanelSource, /공공·디지털 서비스기획/);
  assert.match(trackLinkPanelSource, /정책지원관/);
  assert.match(trackLinkPanelSource, /국회 보좌관/);
});

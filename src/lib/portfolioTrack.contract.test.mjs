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
const sourcePath = path.join(root, "src/lib/portfolioTrack.ts");

function loadPortfolioTrackModule() {
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

test("resolves the public default track as the root portfolio", () => {
  const { resolvePortfolioTrack } = loadPortfolioTrackModule();
  const track = resolvePortfolioTrack();

  assert.equal(track.id, "default");
  assert.equal(track.path, "/");
  assert.equal(track.noIndex, false);
  assert.match(track.profile.headline, /공공·사회 문제/);
  assert.equal(track.projectOrder[0], "busan-eumgil");
});

test("resolves the PM track with AEKKIM first and noindex enabled", () => {
  const { resolvePortfolioTrack } = loadPortfolioTrackModule();
  const track = resolvePortfolioTrack("pm");

  assert.equal(track.id, "pm");
  assert.equal(track.path, "/pm");
  assert.equal(track.noIndex, true);
  assert.match(track.profile.headline, /주니어 서비스 기획자/);
  assert.deepEqual(Array.from(track.projectOrder.slice(0, 2)), [
    "aekkim",
    "busan-eumgil",
  ]);
});

test("orders projects by track while keeping unlisted projects visible", () => {
  const { getTrackProjects } = loadPortfolioTrackModule();
  const projects = [
    { id: "smile-game", title: "웃지마게임" },
    { id: "aekkim", title: "AEKKIM" },
    { id: "extra", title: "Later Evidence" },
    { id: "busan-eumgil", title: "부산이음길" },
  ];

  assert.deepEqual(
    Array.from(getTrackProjects(projects, "pm"), (project) => project.id),
    ["aekkim", "busan-eumgil", "smile-game", "extra"],
  );
});

test("falls back to the default track for unknown track ids", () => {
  const { resolvePortfolioTrack } = loadPortfolioTrackModule();

  assert.equal(resolvePortfolioTrack("solutions").id, "default");
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const nodeRequire = createRequire(import.meta.url);
const moduleCache = new Map();

function resolveTsPath(specifier, parentPath) {
  if (specifier.startsWith("@/")) {
    return path.join(root, "src", `${specifier.slice(2)}.ts`);
  }

  if (specifier.startsWith(".")) {
    return path.resolve(path.dirname(parentPath), `${specifier}.ts`);
  }

  return null;
}

function loadTsModule(sourcePath) {
  if (moduleCache.has(sourcePath)) {
    return moduleCache.get(sourcePath).exports;
  }

  const source = readFileSync(sourcePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const cjsModule = { exports: {} };
  moduleCache.set(sourcePath, cjsModule);

  function localRequire(specifier) {
    const resolvedTsPath = resolveTsPath(specifier, sourcePath);

    if (resolvedTsPath) {
      return loadTsModule(resolvedTsPath);
    }

    return nodeRequire(specifier);
  }

  vm.runInNewContext(compiled, {
    exports: cjsModule.exports,
    module: cjsModule,
    require: localRequire,
  });

  return cjsModule.exports;
}

function loadTrackLandingModelModule() {
  return loadTsModule(path.join(root, "src/components/tracks/trackLandingModel.ts"));
}

test("selects the right first evidence for each direct-link track", () => {
  const { getTrackLandingModel } = loadTrackLandingModelModule();

  assert.equal(getTrackLandingModel("publicDigital").firstEvidenceId, "busan-eumgil");
  assert.equal(getTrackLandingModel("pm").firstEvidenceId, "aekkim");
  assert.equal(
    getTrackLandingModel("policy").firstEvidenceId,
    "participation-local-governance",
  );
  assert.equal(getTrackLandingModel("assembly").firstEvidenceId, "council-monitoring");
});

test("uses project cases first for service tracks and career cases first for document tracks", () => {
  const { getTrackLandingModel } = loadTrackLandingModelModule();

  const publicDigital = getTrackLandingModel("publicDigital");
  assert.equal(publicDigital.primaryCaseKind, "project");
  assert.equal(publicDigital.primaryProjectCardKind, "publicDigital");
  assert.equal(publicDigital.orderedProjects[0].id, "busan-eumgil");
  assert.equal(publicDigital.orderedCareerCases[0].id, "participation-local-governance");

  const pm = getTrackLandingModel("pm");
  assert.equal(pm.primaryCaseKind, "project");
  assert.equal(pm.primaryProjectCardKind, "pm");
  assert.equal(pm.orderedProjects[0].id, "aekkim");

  const policy = getTrackLandingModel("policy");
  assert.equal(policy.primaryCaseKind, "career");
  assert.equal(policy.primaryProjectCardKind, "standard");
  assert.equal(policy.orderedCareerCases[0].id, "participation-local-governance");
  assert.equal(policy.orderedProjects[0].id, "busan-eumgil");

  const assembly = getTrackLandingModel("assembly");
  assert.equal(assembly.primaryCaseKind, "career");
  assert.equal(assembly.orderedCareerCases[0].id, "council-monitoring");
});

test("exposes proof labels and caution notes for track pages", () => {
  const { getTrackLandingModel } = loadTrackLandingModelModule();

  for (const trackId of ["publicDigital", "pm", "policy", "assembly"]) {
    const model = getTrackLandingModel(trackId);

    assert.ok(model.proofFocus.length >= 3);
    assert.ok(model.cautionNotes.length >= 2);
    assert.ok(model.ctaLinks.some((link) => link.href === "/resume"));
    assert.ok(model.ctaLinks.some((link) => link.href === "mailto:dlwo4367@gmail.com"));
    assert.ok(model.caseSections.primary.title.length > 0);
    assert.ok(model.caseSections.primary.summary.length > 0);
    assert.ok(model.caseSections.secondary.title.length > 0);
    assert.ok(model.caseSections.secondary.summary.length > 0);
  }
});

test("uses track-specific section copy around the case cards", () => {
  const { getTrackLandingModel } = loadTrackLandingModelModule();

  const publicDigital = getTrackLandingModel("publicDigital");
  assert.equal(publicDigital.caseSections.primary.eyebrow, "Public Digital Case");
  assert.equal(publicDigital.caseSections.primary.title, "공공디지털 대표 프로젝트");
  assert.match(publicDigital.caseSections.secondary.title, /공공 문제정의/);

  const pm = getTrackLandingModel("pm");
  assert.equal(pm.caseSections.primary.eyebrow, "PM Case");
  assert.equal(pm.caseSections.primary.title, "PM 대표 프로젝트");
  assert.match(pm.caseSections.secondary.summary, /제품 총괄 경험이 아니라/);

  const policy = getTrackLandingModel("policy");
  assert.equal(policy.caseSections.primary.title, "정책지원관 경력 브리프");
  assert.match(policy.caseSections.primary.summary, /행정사무감사/);

  const assembly = getTrackLandingModel("assembly");
  assert.equal(assembly.caseSections.primary.eyebrow, "Assembly Evidence");
  assert.match(assembly.caseSections.primary.title, /국회 보좌/);
});

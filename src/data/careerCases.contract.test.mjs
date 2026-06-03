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
const sourcePath = path.join(root, "src/data/careerCases.ts");

function loadCareerCasesModule() {
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

test("defines the six public-sector career cases needed for policy tracks", () => {
  const { careerCases } = loadCareerCasesModule();

  assert.deepEqual(
    Array.from(careerCases, (careerCase) => careerCase.id),
    [
      "participation-local-governance",
      "council-monitoring",
      "admin-audit-agenda",
      "ordinance-budget-policy-analysis",
      "official-trip-analysis",
      "policy-writing-briefing",
    ],
  );
});

test("keeps every career case usable across portfolio tracks", () => {
  const { careerCases } = loadCareerCasesModule();
  const requiredTracks = ["publicDigital", "pm", "policy", "assembly"];

  for (const careerCase of careerCases) {
    assert.equal(typeof careerCase.title, "string");
    assert.ok(careerCase.title.length > 0);
    assert.ok(careerCase.summary.length > 0);
    assert.ok(careerCase.context.length > 0);
    assert.ok(careerCase.role.length > 0);
    assert.ok(careerCase.workHighlights.length >= 3);
    assert.ok(careerCase.outputs.length > 0);
    assert.ok(careerCase.evidence.length > 0);
    assert.ok(careerCase.caution.length > 0);

    for (const track of requiredTracks) {
      assert.ok(
        careerCase.relevance[track].length > 0,
        `${careerCase.id} is missing ${track} relevance`,
      );
    }
  }
});

test("uses conservative evidence labels instead of exposing internal file paths", () => {
  const { careerCases } = loadCareerCasesModule();
  const allowedEvidenceLevels = new Set(["strong", "medium", "needs-check"]);

  for (const careerCase of careerCases) {
    for (const evidence of careerCase.evidence) {
      assert.equal(allowedEvidenceLevels.has(evidence.level), true);
      assert.ok(evidence.publicLabel.length > 0);
      assert.ok(evidence.sourceNote.length > 0);
      assert.doesNotMatch(evidence.publicLabel, /새 폴더|_extracted_text|\.hwp|\.pdf|\.pptx/);
    }
  }
});

test("connects each career case to public evidence links", () => {
  const { careerCases } = loadCareerCasesModule();

  for (const careerCase of careerCases) {
    const linkedEvidence = careerCase.evidence.filter(
      (evidence) => typeof evidence.href === "string",
    );

    assert.ok(
      linkedEvidence.length > 0,
      `${careerCase.id} is missing public evidence link`,
    );

    for (const evidence of linkedEvidence) {
      assert.match(evidence.href, /^https:\/\//);
      assert.doesNotMatch(evidence.href, /localhost|127\.0\.0\.1|docs\//);
      assert.ok(evidence.publicLabel.length > 0);
      assert.equal(typeof evidence.linkLabel, "string");
      assert.ok(evidence.linkLabel.length > 0);
    }
  }
});

test("keeps risky metrics behind needs-check evidence", () => {
  const { careerCases } = loadCareerCasesModule();
  const metricPattern = /40건|435건|337건|85건|25회기|100명/;

  for (const careerCase of careerCases) {
    const publicText = [
      careerCase.title,
      careerCase.summary,
      careerCase.context,
      ...careerCase.workHighlights,
      ...careerCase.outputs,
    ].join(" ");

    assert.doesNotMatch(publicText, metricPattern);
  }

  const needsCheckEvidence = careerCases
    .flatMap((careerCase) => careerCase.evidence)
    .filter((evidence) => evidence.level === "needs-check");

  assert.ok(needsCheckEvidence.some((evidence) => metricPattern.test(evidence.sourceNote)));
});

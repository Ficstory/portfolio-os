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
const projectsPath = path.join(root, "src/data/projects.ts");
const typesPath = path.join(root, "src/types/portfolio.ts");

function loadProjectsModule() {
  const source = readFileSync(projectsPath, "utf8");
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

test("Project model supports structured evidence items", () => {
  const source = readFileSync(typesPath, "utf8");

  assert.match(source, /export type ProjectEvidence/);
  assert.match(source, /evidence: ProjectEvidence\[\]/);
  assert.match(source, /availability: "public" \| "internal"/);
});

test("portfolio projects expose enough evidence for detail pages", () => {
  const { projects } = loadProjectsModule();
  const primaryProjectIds = new Set(["busan-eumgil", "aekkim"]);

  for (const project of projects) {
    const minimumEvidence = primaryProjectIds.has(project.id) ? 3 : 2;

    assert.ok(
      project.evidence.length >= minimumEvidence,
      `${project.id} should have at least ${minimumEvidence} evidence items`,
    );

    for (const item of project.evidence) {
      assert.ok(item.label.trim(), `${project.id} evidence needs a label`);
      assert.ok(item.description.trim(), `${project.id} evidence needs a description`);
      assert.ok(item.category.trim(), `${project.id} evidence needs a category`);
      assert.ok(
        item.availability === "public" || item.availability === "internal",
        `${project.id} evidence availability must be explicit`,
      );
      assert.doesNotMatch(
        `${item.label}\n${item.description}`,
        /준비 중|업데이트 예정|연결하는 것이 좋습니다|등록된/,
      );
    }
  }
});

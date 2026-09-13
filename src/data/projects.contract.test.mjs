import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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

test("portfolio projects expose an authentic public demo without raw source excerpts", () => {
  const { projects } = loadProjectsModule();
  const expectedDemoByProject = new Map([
    ["busan-eumgil", "/pm/previews/busan.mp4"],
    ["aekkim", "/pm/previews/aekkim.mp4"],
    ["play-pick", "/pm/previews/play-pick.mp4"],
    ["smile-game", "/pm/previews/smile.mp4"],
  ]);

  for (const project of projects) {
    const expectedDemo = expectedDemoByProject.get(project.id);
    assert.ok(project.evidence.length >= 1, `${project.id} should expose public evidence`);
    assert.ok(
      project.evidence.some((item) => item.href === expectedDemo),
      `${project.id} should preserve its public demo`,
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
      if (item.href) {
        assert.doesNotMatch(item.href, /^\/pm\/sources\//);
        if (item.href.startsWith("/")) {
          assert.ok(
            existsSync(path.join(root, "public", item.href)),
            `${item.href} must exist as a public asset`,
          );
        }
      }
    }
  }
});

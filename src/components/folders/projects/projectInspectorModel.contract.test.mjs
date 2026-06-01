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
const root = path.resolve(__dirname, "../../../..");
const sourcePath = path.join(
  root,
  "src/components/folders/projects/projectInspectorModel.ts",
);

function loadProjectInspectorModel() {
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

const baseProject = {
  id: "portfolio-os",
  slug: "portfolio-os",
  title: "Portfolio OS",
  summary: "Desktop-like portfolio shell.",
  valueStatement: "Makes portfolio information easier to inspect.",
  problem: "Project information needs a compact browsing model.",
  role: ["Information architecture", "Frontend implementation"],
  stack: ["Next.js", "React", "TypeScript"],
  implementationHighlights: ["Built a windowed project explorer."],
  troubleshooting: ["Kept sample outcomes conservative."],
  result: ["Created reusable project content structure."],
  links: {},
  thumbnail: "",
  media: [],
  contentPath: "src/content/projects/project-01.mdx",
};

test("creates activity logs from portfolio project fields", () => {
  const { createProjectActivityLogs } = loadProjectInspectorModel();
  const logs = createProjectActivityLogs(baseProject);

  assert.deepEqual(
    Array.from(logs, (log) => `${log.code} ${log.method} ${log.path}`),
    [
      "200 GET /project/portfolio-os/context",
      "200 GET /project/portfolio-os/role",
      "200 GET /project/portfolio-os/stack",
      "201 POST /project/portfolio-os/implementation",
      "500 PATCH /project/portfolio-os/troubleshooting",
      "200 GET /project/portfolio-os/result",
      "204 GET /project/portfolio-os/links",
    ],
  );
});

test("marks links as 204 when no project links are documented", () => {
  const { createProjectActivityLogs, createProjectRules } =
    loadProjectInspectorModel();
  const logs = createProjectActivityLogs(baseProject);
  const rules = createProjectRules(baseProject);

  assert.equal(logs.at(-1)?.code, 204);
  assert.equal(rules.at(-1)?.statusLabel, "204 No links");
});

test("represents troubleshooting as a patch-style failure investigation", () => {
  const { createProjectActivityLogs, createProjectRules } =
    loadProjectInspectorModel();
  const logs = createProjectActivityLogs(baseProject);
  const rules = createProjectRules(baseProject);
  const troubleshootingLog = logs.find((log) => log.id === "troubleshooting");
  const troubleshootingRule = rules.find((rule) => rule.id === "troubleshooting");

  assert.equal(troubleshootingLog?.method, "PATCH");
  assert.equal(troubleshootingLog?.code, 500);
  assert.equal(troubleshootingRule?.method, "PATCH");
  assert.equal(troubleshootingRule?.statusLabel, "500 Investigated");
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

function readSource(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

const projectDetailSource = readSource("src/components/projects/ProjectDetail.tsx");

test("project detail pages render structured evidence separately from meta links", () => {
  assert.match(projectDetailSource, /id="project-evidence"/);
  assert.match(projectDetailSource, /title="증빙 자료"/);
  assert.match(projectDetailSource, /project\.evidence/);
  assert.match(projectDetailSource, /availability === "public"/);
  assert.match(projectDetailSource, /내부 산출물/);
});

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// Check the deployment manifests, not just the data rendered in the browser.
const buildRoot = path.resolve(".next");
const draftRoot = path.resolve("content/til/drafts");
assert(existsSync(path.join(buildRoot, "BUILD_ID")), "Run a successful build before checking TIL privacy");
let checked = 0;

function checkTraces(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name !== "cache" && entry.name !== "dev") checkTraces(path.join(directory, entry.name));
      continue;
    }
    if (!entry.name.endsWith(".nft.json")) continue;
    const trace = JSON.parse(readFileSync(path.join(directory, entry.name), "utf8"));
    for (const file of trace.files) {
      const relative = path.relative(draftRoot, path.resolve(directory, file));
      const isDraft = relative === "" || (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`));
      assert(!isDraft, `Private TIL source included in deployment trace: ${file}`);
    }
    checked++;
  }
}

checkTraces(buildRoot);
assert(checked > 0, "No deployment traces found; TIL privacy check did not run");
console.log(`TIL build privacy: ${checked} deployment traces checked; no draft files included.`);

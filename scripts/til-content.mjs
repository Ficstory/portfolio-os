import path from "node:path";
import process from "node:process";

import {
  deleteTIL,
  publishTIL,
  unpublishTIL,
  validateTILContent,
} from "../src/lib/tilContent.ts";

function usage() {
  return [
    "Usage:",
    "  node --experimental-strip-types scripts/til-content.mjs validate [--content-root PATH]",
    "  node --experimental-strip-types scripts/til-content.mjs publish SLUG [--content-root PATH]",
    "  node --experimental-strip-types scripts/til-content.mjs unpublish SLUG [--content-root PATH]",
    "  node --experimental-strip-types scripts/til-content.mjs delete SLUG --scope drafts|published [--content-root PATH]",
  ].join("\n");
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] ?? null;
}

const [, , command, slug] = process.argv;
const contentRoot = path.resolve(option("--content-root") ?? path.join(process.cwd(), "content", "til"));

try {
  if (command === "validate") {
    const result = validateTILContent(contentRoot);
    console.log(`TIL content valid: ${result.published.length} published, ${result.drafts.length} drafts`);
  } else if (command === "publish" && slug) {
    console.log(`Published ${slug}: ${publishTIL(contentRoot, slug)}`);
  } else if (command === "unpublish" && slug) {
    console.log(`Unpublished ${slug}: ${unpublishTIL(contentRoot, slug)}`);
  } else if (command === "delete" && slug) {
    const scope = option("--scope");
    if (scope !== "drafts" && scope !== "published") throw new Error(usage());
    console.log(`Deleted ${slug}: ${deleteTIL(contentRoot, slug, scope)}`);
  } else {
    throw new Error(usage());
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

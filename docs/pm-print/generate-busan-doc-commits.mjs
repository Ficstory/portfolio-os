import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const repo = process.argv[2] ?? resolve("C:/Users/ljh43/OneDrive/Desktop/workspace/SSAFY/프로젝트/4. 자율pjt/S14P31E102");
const output = process.argv[3] ?? resolve("docs/pm-print/busan-doc-commits.json");
const start = Date.parse("2026-04-01T00:00:00+09:00");
const end = Date.parse("2026-06-01T00:00:00+09:00");
const authors = new Set(["LeeJaeho", "이재호"]);
const git = (args) => execFileSync("git", ["-c", `safe.directory=${repo}`, ...args], { cwd: repo, encoding: "utf8" });
const hashes = [...new Set([...authors].flatMap((author) => git(["log", "--all", "--no-merges", "--format=%H", `--author=${author}`, "--", "Docs"]).trim().split(/\r?\n/).filter(Boolean)))];
const commits = [];
for (const hash of hashes) {
  const meta = git(["show", "-s", "--format=%H%x09%aI%x09%cI%x09%an%x09%cn%x09%s", hash]).trim().split("\t");
  const timestamp = Date.parse(meta[1]);
  if (timestamp < start || timestamp >= end || !authors.has(meta[3])) continue;
  const paths = git(["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", hash]).split("\0").filter((path) => path.startsWith("Docs/"));
  if (paths.length === 0) continue;
  commits.push({ hash: meta[0], authorTimestamp: meta[1], committerTimestamp: meta[2], author: meta[3], committer: meta[4], subject: meta.slice(5).join("\t"), paths });
}
const refs = git(["show-ref"]).trim().split(/\r?\n/).filter(Boolean);
const artifact = { generatedFrom: { repository: repo, origin: "https://lab.ssafy.com/s14-final/S14P31E102.git", head: git(["rev-parse", "HEAD"]).trim(), refs, command: "node docs/pm-print/generate-busan-doc-commits.mjs <repo> docs/pm-print/busan-doc-commits.json" }, scope: { startInclusive: "2026-04-01T00:00:00+09:00", endExclusive: "2026-06-01T00:00:00+09:00", authorsExact: [...authors], rootPathExact: "Docs/", noMerges: true, filtering: "For each --all --no-merges commit, exact author name and parsed author timestamp are checked; commits with at least one exact Docs/ path are retained." }, count: commits.length, authorCounts: Object.fromEntries([...authors].map((author) => [author, commits.filter((commit) => commit.author === author).length])), commits, notes: ["This is the root Docs/ count used in the print deck.", "A broader FE/docs and documentation-like path count mixes code, tests and handoff artifacts and is excluded from this claim."] };
mkdirSync(dirname(resolve(output)), { recursive: true });
writeFileSync(resolve(output), `${JSON.stringify(artifact, null, 2)}\n`);
console.log(`wrote ${resolve(output)} count=${commits.length}`);

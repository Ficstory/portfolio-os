import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const clockSource = readFileSync(
  path.join(root, "src/lib/useMinuteClock.ts"),
  "utf8",
);

test("minute clock polls quickly but only commits minute changes", () => {
  assert.match(clockSource, /function getMinuteStamp\(now: Date\)/);
  assert.match(clockSource, /setInterval\(syncNow,\s*1_000\)/);
  assert.match(clockSource, /nextMinuteStamp !== previousMinuteStamp/);
  assert.doesNotMatch(clockSource, /setInterval\(updateNow,\s*60_000\)/);
  assert.doesNotMatch(clockSource, /msToNextMinute/);
});

test("minute clock resyncs immediately when the page becomes active", () => {
  assert.match(clockSource, /document\.addEventListener\("visibilitychange", syncNow\)/);
  assert.match(clockSource, /window\.addEventListener\("focus", syncNow\)/);
  assert.match(clockSource, /window\.addEventListener\("pageshow", syncNow\)/);
});

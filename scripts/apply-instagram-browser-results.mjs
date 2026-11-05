import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(rootDir, "docs", "통계", "국회의원_인스타그램_일일성과_추적.xlsx");
const inputPath = process.argv[2];
const outputArg = process.argv.find((arg) => arg.startsWith("--output="));
const outputPath = outputArg ? outputArg.slice("--output=".length) : workbookPath;
if (!inputPath) throw new Error("수집 결과 JSON 경로를 인수로 전달해야 합니다.");

const input = JSON.parse(await fs.readFile(inputPath, "utf8"));
const results = Array.isArray(input.results) ? input.results : [];
if (results.length === 0) throw new Error("반영할 인스타그램 공개 프로필 결과가 없습니다.");

function toText(value) { return value == null ? "" : String(value).trim(); }
function dateKey(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "number" && Number.isFinite(value)) return new Date(Date.UTC(1899, 11, 30) + value * 86400000).toISOString().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(toText(value)) ? toText(value) : "";
}
function usedRows(sheet, rowNumber) {
  return (sheet.getUsedRange()?.values ?? []).slice(rowNumber - 1).filter((row) => row.some((value) => value != null && value !== ""));
}
function nextEmptyRow(sheet, startRow) {
  const rows = sheet.getUsedRange()?.values ?? [];
  for (let index = startRow - 1; index < rows.length; index += 1) {
    if ((rows[index] ?? []).every((value) => value == null || value === "")) return index + 1;
  }
  return Math.max(startRow, rows.length + 1);
}
function appendRows(sheet, startRow, rows) {
  if (rows.length === 0) return;
  const row = nextEmptyRow(sheet, startRow);
  sheet.getRangeByIndexes(row - 1, 0, rows.length, rows[0].length).values = rows;
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const accountSheet = workbook.worksheets.getItem("계정 목록");
const followerSheet = workbook.worksheets.getItem("팔로워 일별");
const contentSheet = workbook.worksheets.getItem("콘텐츠 기록");
const storySheet = workbook.worksheets.getItem("스토리 관측");
const summarySheet = workbook.worksheets.getItem("요약");
const accountRows = usedRows(accountSheet, 6).map((row, index) => ({ rowNumber: index + 6, handle: toText(row[3]) }));
const accountByHandle = new Map(accountRows.map((account) => [account.handle, account]));
const snapshotDate = new Date(`${input.dateKst}T00:00:00Z`);
const existingFollowerKeys = new Set(usedRows(followerSheet, 6).map((row) => `${dateKey(row[0])}::${toText(row[3])}`));
const existingStoryKeys = new Set(usedRows(storySheet, 6).map((row) => `${dateKey(row[0])}::${toText(row[3])}`));
const existingContentIds = new Set(usedRows(contentSheet, 6).map((row) => toText(row[5])).filter(Boolean));
const followerRows = [];
const storyRows = [];
const contentRows = [];
let accountsUpdated = 0;
let errors = 0;

for (const result of results) {
  const handle = toText(result.handle);
  const account = accountByHandle.get(handle);
  if (!account) continue;
  const status = toText(result.status) || "오류";
  const note = toText(result.note);
  const followers = Number.isFinite(result.followers) ? result.followers : null;
  const following = Number.isFinite(result.following) ? result.following : null;
  const activeStory = toText(result.activeStory) || "확인 불가";
  const contents = Array.isArray(result.contents) ? result.contents : [];
  const newContents = [];
  for (const content of contents) {
    const shortcode = toText(content.shortcode);
    if (!shortcode || existingContentIds.has(shortcode)) continue;
    existingContentIds.add(shortcode);
    newContents.push(content);
    contentRows.push([
      snapshotDate, null, "", toText(result.name), handle, shortcode, toText(content.kind) || "피드", "", null, null, null,
      toText(content.url), "공개 프로필 화면에서 최초 확인",
    ]);
  }
  const newFeeds = newContents.filter((content) => toText(content.kind) !== "릴스").length;
  const newReels = newContents.filter((content) => toText(content.kind) === "릴스").length;
  accountSheet.getRange(`E${account.rowNumber}:M${account.rowNumber}`).values = [[
    status, snapshotDate, followers, following, null, newFeeds, newReels, activeStory, note,
  ]];
  if (!existingFollowerKeys.has(`${input.dateKst}::${handle}`)) {
    followerRows.push([snapshotDate, input.timeKst, toText(result.name), handle, followers, following, toText(result.url), status, note]);
  }
  if (!existingStoryKeys.has(`${input.dateKst}::${handle}`)) {
    storyRows.push([snapshotDate, input.timeKst, toText(result.name), handle, activeStory, toText(result.url), activeStory === "확인 불가" ? "확인 불가" : status, note]);
  }
  accountsUpdated += 1;
  if (status !== "확인됨") errors += 1;
}

appendRows(followerSheet, 6, followerRows);
appendRows(storySheet, 6, storyRows);
appendRows(contentSheet, 6, contentRows);
summarySheet.getRange("I4").values = [["오늘 최초 기록 콘텐츠"]];
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, accountsUpdated, followerSnapshots: followerRows.length, newContents: contentRows.length, errors }));

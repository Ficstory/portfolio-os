import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultWorkbookPath = path.join(rootDir, "docs", "통계", "국회의원_인스타그램_일일성과_추적.xlsx");
const workbookPath = process.argv.find((arg) => arg.startsWith("--workbook="))?.slice(11) ?? defaultWorkbookPath;
const inputPath = process.argv[2];
if (!inputPath) throw new Error("수집 결과 JSON 경로를 첫 번째 인수로 전달해야 합니다.");

function toText(value) { return value == null ? "" : String(value).trim(); }
function dateKey(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "number" && Number.isFinite(value)) return new Date(Date.UTC(1899, 11, 30) + value * 86400000).toISOString().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(toText(value)) ? toText(value) : "";
}
function dateCell(key) { return /^\d{4}-\d{2}-\d{2}$/.test(key) ? new Date(`${key}T00:00:00Z`) : null; }
function usedRows(sheet, firstDataRow) { return (sheet.getUsedRange()?.values ?? []).slice(firstDataRow - 1).filter((row) => row.some((value) => value != null && value !== "")); }
function nextEmptyRow(sheet, startRow) {
  const rows = sheet.getUsedRange()?.values ?? [];
  for (let index = startRow - 1; index < rows.length; index += 1) if ((rows[index] ?? []).every((value) => value == null || value === "")) return index + 1;
  return Math.max(startRow, rows.length + 1);
}
function appendRows(sheet, startRow, rows) {
  if (rows.length === 0) return null;
  const row = nextEmptyRow(sheet, startRow);
  sheet.getRangeByIndexes(row - 1, 0, rows.length, rows[0].length).values = rows;
  return row;
}
function formatRows(sheet, startRow, rowCount, columnCount) {
  if (rowCount === 0) return;
  const range = sheet.getRangeByIndexes(startRow - 1, 0, rowCount, columnCount);
  range.format = { borders: { preset: "inside", style: "thin", color: "#D7E1EA" }, verticalAlignment: "center", wrapText: true };
}
function formatKst(date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}
function normalizedMetric(result, key) {
  const rawCandidate = result?.[`${key}Raw`] ?? result?.[`${key}Display`] ?? result?.[key]?.raw ?? result?.[key]?.display ?? "";
  const raw = toText(rawCandidate);
  const numericCandidate = result?.[key]?.exact ?? result?.[key]?.number ?? (typeof result?.[key] === "number" ? result[key] : null);
  const suppliedQuality = toText(result?.[key]?.quality ?? result?.[`${key}Quality`]);
  if (!raw) {
    if (Number.isFinite(numericCandidate)) return { raw: "", exact: null, quality: "원문 미보존·재수집 필요", note: `${key} 원문 표시값이 없어 이전 숫자를 정확값으로 사용하지 않음` };
    return { raw: "", exact: null, quality: "미노출", note: `${key} 공개 수치 미노출` };
  }
  const cleaned = raw.replace(/,/g, "").replace(/\s+/g, "");
  if (/[KMB만천]/i.test(cleaned)) return { raw, exact: null, quality: "반올림 공개값", note: `${key}가 압축 표기로 공개되어 정확 증감에서 제외` };
  const parsed = Number(cleaned.replace(/[^0-9]/g, ""));
  if (!Number.isFinite(parsed) || parsed === 0 && !/^0+$/.test(cleaned.replace(/[^0-9]/g, ""))) return { raw, exact: null, quality: "형식 미확인", note: `${key} 표시 형식을 해석하지 못함` };
  return { raw, exact: parsed, quality: suppliedQuality || "정확 공개값", note: "" };
}
function normalizedContent(content, collectionDate) {
  const shortcode = toText(content.shortcode ?? content.id);
  const kind = toText(content.kind ?? content.type) || "피드";
  const url = toText(content.url);
  const iso = toText(content.publishedAtKst ?? content.publishedAt ?? content.published_at);
  const specifiedDate = toText(content.publishedDateKst ?? content.publishedDate);
  const specifiedTime = toText(content.publishedTimeKst ?? content.publishedTime);
  let publishedDate = /^\d{4}-\d{2}-\d{2}$/.test(specifiedDate) ? specifiedDate : "";
  let publishedTime = specifiedTime;
  if (!publishedDate && iso) {
    const parsed = new Date(iso);
    if (!Number.isNaN(parsed.getTime())) ({ date: publishedDate, time: publishedTime } = formatKst(parsed));
  }
  const hasPostTime = Boolean(publishedDate && publishedTime);
  const detailState = hasPostTime ? "상세 확인" : "상세 확인·게시시각 미노출";
  const todayDecision = hasPostTime ? (publishedDate === collectionDate ? "확정" : "비당일") : "미확인";
  const likes = normalizedMetric(content, "likes");
  const comments = normalizedMetric(content, "comments");
  const plays = normalizedMetric({
    ...content,
    plays: content.plays ?? content.views,
    playsRaw: content.playsRaw ?? content.viewsRaw,
    playsDisplay: content.playsDisplay ?? content.viewsDisplay,
  }, "plays");
  return {
    shortcode, kind, url, publishedDate, publishedTime, detailState, todayDecision,
    caption: toText(content.caption ?? content.description),
    likes, comments, plays,
    note: toText(content.note),
  };
}

const input = JSON.parse(await fs.readFile(inputPath, "utf8"));
const results = Array.isArray(input.results) ? input.results : [];
const collectionDate = toText(input.dateKst);
const collectionTime = toText(input.timeKst);
if (!/^\d{4}-\d{2}-\d{2}$/.test(collectionDate) || !/^\d{1,2}:\d{2}$/.test(collectionTime)) throw new Error("dateKst(YYYY-MM-DD)와 timeKst(HH:MM)가 필요합니다.");
if (results.length === 0) throw new Error("반영할 공개 프로필 결과가 없습니다.");
const runId = toText(input.runId) || `instagram-${collectionDate.replaceAll("-", "")}-${collectionTime.replace(":", "")}`;
const minProfileSuccessRate = Number(process.argv.find((arg) => arg.startsWith("--min-profile-success-rate="))?.slice(27) ?? 0.9);
const profileSuccessRate = results.filter((result) => toText(result.status) === "확인됨").length / results.length;
if (!Number.isFinite(minProfileSuccessRate) || minProfileSuccessRate < 0 || minProfileSuccessRate > 1) throw new Error("--min-profile-success-rate는 0~1 범위여야 합니다.");
if (profileSuccessRate < minProfileSuccessRate) throw new Error(`프로필 확인률 ${(profileSuccessRate * 100).toFixed(1)}%가 기준 ${(minProfileSuccessRate * 100).toFixed(1)}% 미만이라 기존 파일을 갱신하지 않았습니다.`);

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const accounts = workbook.worksheets.getItem("계정 목록");
const profiles = workbook.worksheets.getItem("프로필 스냅샷");
const contents = workbook.worksheets.getItem("콘텐츠 기록");
const performance = workbook.worksheets.getItem("콘텐츠 성과 스냅샷");
const stories = workbook.worksheets.getItem("스토리 관측");
const logs = workbook.worksheets.getItem("수집 실행 로그");

const accountRows = usedRows(accounts, 6).map((row, index) => ({ rowNumber: index + 6, name: toText(row[0]), handle: toText(row[3]) }));
const accountByHandle = new Map(accountRows.map((account) => [account.handle, account]));
const profileRows = usedRows(profiles, 6);
const profileByKey = new Map(profileRows.map((row, index) => [`${dateKey(row[0])}::${toText(row[4])}`, index + 6]));
const storyRows = usedRows(stories, 6);
const storyByKey = new Map(storyRows.map((row, index) => [`${dateKey(row[0])}::${toText(row[4])}`, index + 6]));
const contentRows = usedRows(contents, 6);
const contentById = new Map(contentRows.map((row, index) => [toText(row[6]), index + 6]).filter(([id]) => id));
const existingPerformance = new Set(usedRows(performance, 6).map((row) => `${dateKey(row[0])}::${toText(row[5])}`));

const profileAppend = [];
const storyAppend = [];
const contentAppend = [];
const performanceAppend = [];
let profilesConfirmed = 0;
let profilesError = 0;
let detailsConfirmed = 0;
let todayConfirmed = 0;
let accountsUpdated = 0;

for (const result of results) {
  const handle = toText(result.handle);
  const account = accountByHandle.get(handle);
  if (!account) continue;
  const status = toText(result.status) || "오류";
  const url = toText(result.url);
  const follower = normalizedMetric(result, "followers");
  const following = normalizedMetric(result, "following");
  const storyState = toText(result.activeStory ?? result.story?.state) || "확인 불가";
  const note = [toText(result.note), follower.note, following.note].filter(Boolean).join(" · ");
  const accountContents = (Array.isArray(result.contents) ? result.contents : []).map((content) => normalizedContent(content, collectionDate)).filter((content) => content.shortcode && content.url);
  const confirmedPosts = new Map(accountContents.filter((content) => content.todayDecision === "확정").map((content) => [content.shortcode, content]));
  const feedCount = [...confirmedPosts.values()].filter((content) => content.kind !== "릴스").length;
  const reelCount = [...confirmedPosts.values()].filter((content) => content.kind === "릴스").length;
  const latestPost = accountContents.filter((content) => content.publishedDate).map((content) => content.publishedDate).sort().at(-1) ?? null;
  const declaredContentState = toText(result.contentCheckStatus);
  const contentCheckState = declaredContentState || "미확인";
  const currentAccountValues = accounts.getRange(`E${account.rowNumber}:R${account.rowNumber}`).values?.[0] ?? [];
  const lastConfirmation = status === "확인됨" ? dateCell(collectionDate) : currentAccountValues[1] ?? null;
  const nextFeedCount = contentCheckState === "확인됨" ? feedCount : (currentAccountValues[10] ?? 0);
  const nextReelCount = contentCheckState === "확인됨" ? reelCount : (currentAccountValues[11] ?? 0);
  accounts.getRange(`E${account.rowNumber}:R${account.rowNumber}`).values = [[
    status, lastConfirmation,
    status === "확인됨" ? follower.raw : currentAccountValues[2] ?? "", status === "확인됨" ? follower.exact : currentAccountValues[3] ?? null, status === "확인됨" ? follower.quality : currentAccountValues[4] ?? "미확인",
    status === "확인됨" ? following.raw : currentAccountValues[5] ?? "", status === "확인됨" ? following.exact : currentAccountValues[6] ?? null, status === "확인됨" ? following.quality : currentAccountValues[7] ?? "미확인",
    status === "확인됨" ? dateCell(latestPost) : currentAccountValues[8] ?? null, status === "확인됨" ? contentCheckState : "오류", nextFeedCount, nextReelCount, storyState, note,
  ]];
  const profileKey = `${collectionDate}::${handle}`;
  const profileValue = [dateCell(collectionDate), collectionTime, runId, account.name, handle, follower.raw, follower.exact, follower.quality, following.raw, following.exact, following.quality, url, status, note];
  const existingProfileRow = profileByKey.get(profileKey);
  if (existingProfileRow) profiles.getRange(`A${existingProfileRow}:N${existingProfileRow}`).values = [profileValue]; else profileAppend.push(profileValue);
  const storyValue = [dateCell(collectionDate), collectionTime, runId, account.name, handle, storyState, url, storyState === "확인 불가" ? "확인 불가" : status, toText(result.story?.note ?? result.note)];
  const existingStoryRow = storyByKey.get(profileKey);
  if (existingStoryRow) stories.getRange(`A${existingStoryRow}:I${existingStoryRow}`).values = [storyValue]; else storyAppend.push(storyValue);

  for (const content of accountContents) {
    const existingContentRow = contentById.get(content.shortcode);
    const contentValue = [
      existingContentRow ? undefined : dateCell(collectionDate), dateCell(content.publishedDate), content.publishedTime,
      runId, account.name, handle, content.shortcode, content.kind, content.caption,
      content.likes.raw, content.likes.exact, content.likes.quality,
      content.comments.raw, content.comments.exact, content.comments.quality,
      content.plays.raw, content.plays.exact, content.plays.quality,
      content.url, content.detailState, content.todayDecision, content.note || "공개 콘텐츠 상세 확인",
    ];
    if (existingContentRow) {
      const existing = contents.getRange(`A${existingContentRow}:V${existingContentRow}`).values?.[0] ?? [];
      const firstSeen = existing[0] ?? dateCell(collectionDate);
      contents.getRange(`A${existingContentRow}:V${existingContentRow}`).values = [[firstSeen, ...contentValue.slice(1)]];
    } else {
      contentAppend.push(contentValue);
      contentById.set(content.shortcode, -1);
    }
    if (content.detailState === "상세 확인") detailsConfirmed += 1;
    if (contentCheckState === "확인됨" && content.todayDecision === "확정") todayConfirmed += 1;
    const performanceKey = `${collectionDate}::${content.shortcode}`;
    if (!existingPerformance.has(performanceKey)) {
      performanceAppend.push([
        dateCell(collectionDate), collectionTime, runId, account.name, handle, content.shortcode,
        content.likes.raw, content.likes.exact, content.likes.quality,
        content.comments.raw, content.comments.exact, content.comments.quality,
        content.plays.raw, content.plays.exact, content.plays.quality,
        content.url, content.detailState, content.note || "공개 콘텐츠 상세 확인",
      ]);
      existingPerformance.add(performanceKey);
    }
  }
  if (status === "확인됨") profilesConfirmed += 1; else profilesError += 1;
  accountsUpdated += 1;
}

const profileStart = appendRows(profiles, 6, profileAppend); formatRows(profiles, profileStart, profileAppend.length, 14);
const storyStart = appendRows(stories, 6, storyAppend); formatRows(stories, storyStart, storyAppend.length, 9);
const contentStart = appendRows(contents, 6, contentAppend); formatRows(contents, contentStart, contentAppend.length, 22);
const performanceStart = appendRows(performance, 6, performanceAppend); formatRows(performance, performanceStart, performanceAppend.length, 18);
appendRows(logs, 6, [[runId, dateCell(collectionDate), collectionTime, "공개 프로필·상세 수집", accountsUpdated, profilesConfirmed, profilesError, detailsConfirmed, todayConfirmed, profilesError ? "부분 완료" : "완료", detailsConfirmed ? "상세 데이터 포함" : "프로필만 확인", `프로필 확인률 ${(profileSuccessRate * 100).toFixed(1)}% · 반올림 공개값·미노출 값은 정확 수치 및 증감에서 제외`]]);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(workbookPath);
console.log(JSON.stringify({ runId, accountsUpdated, profilesConfirmed, profilesError, profileSnapshotsAdded: profileAppend.length, detailsConfirmed, newContents: contentAppend.length, performanceSnapshotsAdded: performanceAppend.length, todayConfirmed }, null, 2));

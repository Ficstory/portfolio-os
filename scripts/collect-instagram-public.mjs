import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(rootDir, "docs", "통계", "국회의원_인스타그램_일일성과_추적.xlsx");
const timeZone = "Asia/Seoul";
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const maxAccounts = Math.max(1, Math.min(Number(limitArg?.split("=")[1] ?? 132), 132));
const memberArg = process.argv.find((arg) => arg.startsWith("--member="));
const onlyMember = decodeURIComponent(memberArg?.slice("--member=".length) ?? "").trim();
const dryRun = process.argv.includes("--dry-run");
const itemsArg = process.argv.find((arg) => arg.startsWith("--items-per-account="));
const itemsPerAccount = Math.max(1, Math.min(Number(itemsArg?.split("=")[1] ?? 12), 18));

function toText(value) { return value == null ? "" : String(value).trim(); }

function kstParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

function todayContext() {
  const parts = kstParts();
  const dateKey = `${parts.year}-${parts.month}-${parts.day}`;
  return { dateKey, dateCell: new Date(`${dateKey}T00:00:00Z`), timeLabel: `${parts.hour}:${parts.minute}` };
}

function dateKeyOf(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (typeof value === "number" && Number.isFinite(value)) return new Date(Date.UTC(1899, 11, 30) + value * 86400000).toISOString().slice(0, 10);
  return "";
}

function parseCompactNumber(value) {
  const cleaned = toText(value).replace(/,/g, "").toUpperCase();
  const match = cleaned.match(/([0-9]+(?:\.[0-9]+)?)([KM])?/);
  if (!match) return null;
  const multiplier = match[2] === "K" ? 1000 : match[2] === "M" ? 1000000 : 1;
  return Math.round(Number(match[1]) * multiplier);
}

function decodeHtml(value) {
  return toText(value).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function metaContent(html, property) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const propertyMatch = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1];
    if (propertyMatch?.toLowerCase() !== property.toLowerCase()) continue;
    const content = tag.match(/content=["']([^"']*)["']/i)?.[1];
    if (content != null) return decodeHtml(content);
  }
  return "";
}

function countFromDescription(description, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const before = new RegExp(`([0-9][0-9,]*(?:\\.[0-9]+)?[KM]?)\\s*${escaped}`, "i").exec(description)?.[1];
    const after = new RegExp(`${escaped}\\s*([0-9][0-9,]*(?:\\.[0-9]+)?[KM]?)`, "i").exec(description)?.[1];
    const parsed = parseCompactNumber(before ?? after ?? "");
    if (parsed != null) return parsed;
  }
  return null;
}

function profileDetails(html, handle) {
  const description = metaContent(html, "og:description");
  const followers = countFromDescription(description, ["Followers", "팔로워"]);
  const following = countFromDescription(description, ["Following", "팔로잉"]);
  const allowedPath = new RegExp(`/${handle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/(p|reel)/([A-Za-z0-9_-]+)/`, "gi");
  const found = [];
  const seen = new Set();
  for (const match of html.matchAll(allowedPath)) {
    const kind = match[1].toLowerCase() === "reel" ? "릴스" : "피드";
    const shortcode = match[2];
    if (seen.has(shortcode)) continue;
    seen.add(shortcode);
    found.push({ shortcode, kind, url: `https://www.instagram.com/${handle}/${match[1]}/${shortcode}/` });
    if (found.length >= itemsPerAccount) break;
  }
  const activeStory = /"has_public_story"\s*:\s*true|"has_story"\s*:\s*true/i.test(html)
    ? "공개 표시 관측"
    : /"has_public_story"\s*:\s*false|"has_story"\s*:\s*false/i.test(html)
      ? "공개 표시 없음"
      : "확인 불가";
  return { followers, following, contents: found, activeStory, description };
}

function postDetails(html) {
  const description = metaContent(html, "og:description");
  const title = metaContent(html, "og:title");
  const likes = countFromDescription(description, ["likes", "좋아요"]);
  const comments = countFromDescription(description, ["comments", "댓글"]);
  const plays = countFromDescription(description, ["plays", "views", "재생"]);
  const iso = html.match(/<time\b[^>]*datetime=["']([^"']+)["']/i)?.[1] ?? html.match(/"uploadDate"\s*:\s*"([^"]+)"/i)?.[1] ?? "";
  const published = iso ? new Date(iso) : null;
  if (published && Number.isNaN(published.getTime())) return { likes, comments, plays, title, published: null, publishedTime: "" };
  if (!published) return { likes, comments, plays, title, published: null, publishedTime: "" };
  const parts = kstParts(published);
  return { likes, comments, plays, title, published: new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00Z`), publishedTime: `${parts.hour}:${parts.minute}` };
}

async function fetchPublic(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  const html = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (/Please wait a few minutes before you try again|challenge_required/i.test(html)) throw new Error("접속 제한 또는 확인 화면");
  return html;
}

function usedRows(sheet, firstDataRow) {
  const values = sheet.getUsedRange()?.values ?? [];
  return values.slice(firstDataRow - 1).filter((row) => row.some((value) => value != null && value !== ""));
}

function nextEmptyRow(sheet, startRow) {
  const values = sheet.getUsedRange()?.values ?? [];
  for (let index = startRow - 1; index < values.length; index += 1) {
    if ((values[index] ?? []).every((value) => value == null || value === "")) return index + 1;
  }
  return Math.max(startRow, values.length + 1);
}

function appendRows(sheet, startRow, rows) {
  if (rows.length === 0) return;
  const row = nextEmptyRow(sheet, startRow);
  sheet.getRangeByIndexes(row - 1, 0, rows.length, rows[0].length).values = rows;
}

function truncate(text, max = 140) {
  const value = toText(text).replace(/\s+/g, " ");
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

const context = todayContext();
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const accountsSheet = workbook.worksheets.getItem("계정 목록");
const followerSheet = workbook.worksheets.getItem("팔로워 일별");
const contentSheet = workbook.worksheets.getItem("콘텐츠 기록");
const storySheet = workbook.worksheets.getItem("스토리 관측");

const accountRows = usedRows(accountsSheet, 6)
  .map((row, index) => ({ row, rowNumber: index + 6, name: toText(row[0]), url: toText(row[2]), handle: toText(row[3]) }))
  .filter((account) => account.url && account.handle && (!onlyMember || account.name === onlyMember))
  .slice(0, maxAccounts);
if (onlyMember && accountRows.length === 0) throw new Error(`'${onlyMember}' 의원의 정규화된 인스타그램 계정을 찾지 못했습니다.`);

const existingFollowerKeys = new Set(usedRows(followerSheet, 6).map((row) => `${dateKeyOf(row[0])}::${toText(row[3])}`));
const existingStoryKeys = new Set(usedRows(storySheet, 6).map((row) => `${dateKeyOf(row[0])}::${toText(row[3])}`));
const existingContentIds = new Set(usedRows(contentSheet, 6).map((row) => toText(row[5])).filter(Boolean));
const followerRows = [];
const storyRows = [];
const contentRows = [];
const outcomes = [];

for (let index = 0; index < accountRows.length; index += 1) {
  const account = accountRows[index];
  let status = "확인됨";
  let note = "";
  let followers = null;
  let following = null;
  let activeStory = "확인 불가";
  let recentContentDate = null;
  let newFeedCount = 0;
  let newReelCount = 0;
  let profileDescription = "";
  try {
    const profile = profileDetails(await fetchPublic(account.url), account.handle);
    followers = profile.followers;
    following = profile.following;
    activeStory = profile.activeStory;
    profileDescription = profile.description;
    if (followers == null) note = "팔로워 공개 수치를 읽지 못함";

    for (const content of profile.contents) {
      const isNew = !existingContentIds.has(content.shortcode);
      if (!isNew) continue;
      existingContentIds.add(content.shortcode);
      if (content.kind === "릴스") newReelCount += 1; else newFeedCount += 1;
      contentRows.push([
        context.dateCell, null, "", account.name, account.handle, content.shortcode, content.kind,
        "", null, null, null, content.url, "공개 프로필에서 신규 발견 (세부 수치는 필요 시 후속 수집)",
      ]);
    }
    if (profile.contents.length === 0) note = note || "최근 공개 콘텐츠 링크를 읽지 못함";
    if (!existingFollowerKeys.has(`${context.dateKey}::${account.handle}`)) {
      followerRows.push([context.dateCell, context.timeLabel, account.name, account.handle, followers, following, account.url, status, note]);
    }
    if (!existingStoryKeys.has(`${context.dateKey}::${account.handle}`)) {
      storyRows.push([context.dateCell, context.timeLabel, account.name, account.handle, activeStory, account.url, activeStory === "확인 불가" ? "확인 불가" : "관측됨", "공개 프로필 기준"]);
    }
  } catch (error) {
    status = "오류";
    note = error instanceof Error ? error.message : String(error);
    if (!existingFollowerKeys.has(`${context.dateKey}::${account.handle}`)) followerRows.push([context.dateCell, context.timeLabel, account.name, account.handle, null, null, account.url, status, note]);
    if (!existingStoryKeys.has(`${context.dateKey}::${account.handle}`)) storyRows.push([context.dateCell, context.timeLabel, account.name, account.handle, "확인 불가", account.url, status, note]);
  }
  outcomes.push({ name: account.name, handle: account.handle, status, followers, newFeedCount, newReelCount, note: truncate(note, 80), ...(dryRun ? { profileDescription: truncate(profileDescription, 220) } : {}) });
  if (!dryRun) {
    accountsSheet.getRange(`E${account.rowNumber}:M${account.rowNumber}`).values = [[status, context.dateCell, followers, following, recentContentDate, newFeedCount, newReelCount, activeStory, note]];
  }
  if (index < accountRows.length - 1) await new Promise((resolve) => setTimeout(resolve, 800));
}

if (!dryRun) {
  appendRows(followerSheet, 6, followerRows);
  appendRows(storySheet, 6, storyRows);
  appendRows(contentSheet, 6, contentRows);
  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(workbookPath);
}

const report = {
  dateKst: context.dateKey,
  accountsChecked: accountRows.length,
  accountsConfirmed: outcomes.filter((outcome) => outcome.status === "확인됨").length,
  followerSnapshots: followerRows.filter((row) => row[7] === "확인됨").length,
  newFeeds: outcomes.reduce((sum, outcome) => sum + outcome.newFeedCount, 0),
  newReels: outcomes.reduce((sum, outcome) => sum + outcome.newReelCount, 0),
  errors: outcomes.filter((outcome) => outcome.status === "오류").length,
  dryRun,
  outcomes,
};
console.log(JSON.stringify(report, null, 2));

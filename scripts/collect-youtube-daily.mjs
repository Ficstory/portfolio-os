import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(rootDir, "docs", "통계", "국회의원_유튜브_일일성과_추적.xlsx");
const apiKey = process.env.YOUTUBE_API_KEY;
const timeZone = "Asia/Seoul";
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const maxChannels = Math.max(1, Math.min(Number(limitArg?.split("=")[1] ?? 191), 191));
const trackingDaysArg = process.argv.find((arg) => arg.startsWith("--tracking-days="));
const trackingDays = Math.max(1, Math.min(Number(trackingDaysArg?.split("=")[1] ?? 30), 90));
const memberArg = process.argv.find((arg) => arg.startsWith("--member="));
const onlyMember = decodeURIComponent(memberArg?.slice("--member=".length) ?? "").trim();

if (!apiKey) throw new Error("YOUTUBE_API_KEY 환경 변수가 없습니다. 키 값은 출력하지 않습니다.");

function kstParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

function todayContext() {
  const now = new Date();
  const parts = kstParts(now);
  const dateKey = `${parts.year}-${parts.month}-${parts.day}`;
  const start = new Date(`${dateKey}T00:00:00+09:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { dateKey, dateCell: new Date(`${dateKey}T00:00:00Z`), timeLabel: `${parts.hour}:${parts.minute}`, start, end };
}

function dateCell(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(Date.UTC(1899, 11, 30) + value * 24 * 60 * 60 * 1000);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00Z`);
  return null;
}

function dateKeyOf(value) {
  const cell = dateCell(value);
  return cell ? cell.toISOString().slice(0, 10) : "";
}

function kstDateAndTime(iso) {
  const parts = kstParts(new Date(iso));
  return { date: new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00Z`), time: `${parts.hour}:${parts.minute}` };
}

function toText(value) { return value == null ? "" : String(value).trim(); }

function durationSeconds(isoDuration = "") {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(isoDuration);
  if (!match) return null;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

function contentType(video) {
  if (video.snippet?.liveBroadcastContent && video.snippet.liveBroadcastContent !== "none") return "라이브";
  const seconds = durationSeconds(video.contentDetails?.duration);
  return seconds != null && seconds <= 180 ? "짧은 영상(추정)" : "일반 영상";
}

async function youtube(endpoint, params) {
  const query = new URLSearchParams({ ...params, key: apiKey });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}?${query}`);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error?.message ?? `YouTube API 요청 실패 (${response.status})`);
  }
  return body;
}

async function resolveChannelId(rawUrl) {
  const url = new URL(rawUrl);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const channelIndex = pathParts.indexOf("channel");
  if (channelIndex >= 0 && /^UC[\w-]{20,}$/.test(pathParts[channelIndex + 1] ?? "")) return pathParts[channelIndex + 1];

  let response;
  if (pathParts[0]?.startsWith("@")) {
    response = await youtube("channels", { part: "id", forHandle: decodeURIComponent(pathParts[0].slice(1)) });
  } else if (pathParts[0] === "user" && pathParts[1]) {
    response = await youtube("channels", { part: "id", forUsername: decodeURIComponent(pathParts[1]) });
  }
  if (response?.items?.[0]?.id) return response.items[0].id;

  // Legacy custom URLs cannot always be resolved by the API. Read only the public channel page;
  // no account/session data is used and an unresolved result remains explicit in the workbook.
  const page = await fetch(rawUrl, { redirect: "follow" });
  const html = await page.text();
  const match = /"channelId":"(UC[\w-]{20,})"/.exec(html) ?? /channelId=(UC[\w-]{20,})/.exec(html);
  return match?.[1] ?? null;
}

async function uploadPlaylistId(channelId) {
  const result = await youtube("channels", { part: "contentDetails", id: channelId });
  return result.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

async function recentVideos(playlistId, start, end) {
  const ids = [];
  let pageToken = "";
  let coveredWholeWindow = false;
  // Most channels end well before this. The wider ceiling still keeps the daily
  // API budget practical while covering unusually active short-form channels.
  for (let page = 0; page < 20; page += 1) {
    const playlist = await youtube("playlistItems", { part: "snippet,contentDetails", playlistId, maxResults: "50", ...(pageToken ? { pageToken } : {}) });
    const items = playlist.items ?? [];
    let reachedOlderVideo = false;
    for (const item of items) {
      const publishedAt = item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt;
      const published = new Date(publishedAt);
      if (published >= start && published < end && item.contentDetails?.videoId) ids.push(item.contentDetails.videoId);
      if (published < start) reachedOlderVideo = true;
    }
    if (!playlist.nextPageToken || reachedOlderVideo) {
      coveredWholeWindow = true;
      break;
    }
    pageToken = playlist.nextPageToken;
  }
  if (!coveredWholeWindow) {
    throw new Error("최근 30일 공개 영상이 1,000개를 넘어 전체 범위를 확정하지 못함");
  }
  if (ids.length === 0) return [];
  const videos = [];
  for (let index = 0; index < ids.length; index += 50) {
    const response = await youtube("videos", { part: "snippet,statistics,contentDetails,status", id: ids.slice(index, index + 50).join(",") });
    videos.push(...(response.items ?? []));
  }
  return videos;
}

function firstEmptyRow(sheet, startRow) {
  const used = sheet.getUsedRange();
  const values = used?.values ?? [];
  for (let index = startRow - 1; index < values.length; index += 1) {
    if (values[index]?.every((value) => value == null || value === "")) return index + 1;
  }
  return Math.max(startRow, values.length + 1);
}

function usedRows(sheet, firstDataRow) {
  const values = sheet.getUsedRange()?.values ?? [];
  return values.slice(firstDataRow - 1).filter((row) => row.some((value) => value != null && value !== ""));
}

function usedRowsWithNumbers(sheet, firstDataRow) {
  const values = sheet.getUsedRange()?.values ?? [];
  return values
    .slice(firstDataRow - 1)
    .map((row, index) => ({ row, rowNumber: index + firstDataRow }))
    .filter(({ row }) => row.some((value) => value != null && value !== ""));
}

function applyDataRowFormat(sheet, address, dateCols = [], numberCols = []) {
  sheet.getRange(address).format = { borders: { preset: "inside", style: "thin", color: "#D3DEE8" }, verticalAlignment: "center" };
  for (const col of dateCols) sheet.getRange(`${col}${address.match(/\d+/)[0]}`).format.numberFormat = "yyyy-mm-dd";
  for (const col of numberCols) sheet.getRange(`${col}${address.match(/\d+/)[0]}`).format.numberFormat = "#,##0";
}

const range = todayContext();
const captureDateTime = new Date(`${range.dateKey}T${range.timeLabel}:00Z`);
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const channelSheet = workbook.worksheets.getItem("채널 목록");
const newVideoSheet = workbook.worksheets.getItem("신규 영상");
const trackedVideoSheet = workbook.worksheets.getItem("추적 영상");
const snapshotSheet = workbook.worksheets.getItem("일별 조회수");
const dailySheet = workbook.worksheets.getItem("일별 채널 요약");

const channelRows = channelSheet.getRange("A6:J240").values
  .map((row, index) => ({ row, rowNumber: index + 6 }))
  .filter(({ row }) => toText(row[0]) && toText(row[1]));
const selectedChannels = (onlyMember ? channelRows.filter(({ row }) => toText(row[0]) === onlyMember) : channelRows).slice(0, maxChannels);
if (onlyMember && selectedChannels.length === 0) throw new Error(`의원 '${onlyMember}'을 채널 목록에서 찾지 못했습니다.`);
const knownNewVideos = new Map(usedRows(newVideoSheet, 6).map((row, index) => [toText(row[5]), index + 6]).filter(([videoId]) => videoId));
const trackedRows = usedRowsWithNumbers(trackedVideoSheet, 6);
const trackedRowByVideo = new Map(trackedRows.map(({ row, rowNumber }) => [toText(row[5]), { row, rowNumber }]).filter(([videoId]) => videoId));
const snapshotRows = usedRowsWithNumbers(snapshotSheet, 6);
const snapshotRowByKey = new Map(snapshotRows.map(({ row, rowNumber }) => [`${dateKeyOf(row[0])}|${toText(row[3])}`, rowNumber]));
const latestPriorSnapshotByVideo = new Map();
for (const { row } of snapshotRows) {
  const videoId = toText(row[3]);
  if (videoId && dateKeyOf(row[0]) !== range.dateKey) latestPriorSnapshotByVideo.set(videoId, Number(row[6]) || 0);
}
const dailyRows = usedRowsWithNumbers(dailySheet, 6);
const dailyRowByKey = new Map(dailyRows.map(({ row, rowNumber }) => [`${dateKeyOf(row[0])}|${toText(row[1])}`, rowNumber]));
const trackingStart = new Date(range.end.getTime() - trackingDays * 24 * 60 * 60 * 1000);

let newVideoCount = 0;
let snapshotCount = 0;
let resolvedCount = 0;
let errorCount = 0;

for (const { row, rowNumber } of selectedChannels) {
  const [member, sourceUrl, existingChannelId, previousStatus, previousPlaylistId] = row;
  let channelId = toText(existingChannelId);
  let playlistId = toText(previousPlaylistId);
  let status = "확인됨";
  let note = "";
  let recent = [];

  try {
    if (!channelId) channelId = await resolveChannelId(toText(sourceUrl));
    if (!channelId) throw new Error("공개 URL에서 채널 ID를 확인하지 못함");
    if (!playlistId) playlistId = await uploadPlaylistId(channelId);
    if (!playlistId) throw new Error("업로드 재생목록을 확인하지 못함");
    recent = await recentVideos(playlistId, trackingStart, range.end);
    resolvedCount += 1;
  } catch (error) {
    status = previousStatus === "확인됨" ? "오류" : "미확인";
    note = error instanceof Error ? error.message.slice(0, 180) : "알 수 없는 수집 오류";
    errorCount += 1;
  }

  const newVideos = recent.filter((video) => {
    const published = new Date(video.snippet?.publishedAt);
    return published >= range.start && published < range.end;
  });
  const freshVideos = newVideos.filter((video) => !knownNewVideos.has(video.id));
  const viewSum = newVideos.reduce((total, video) => total + (Number(video.statistics?.viewCount) || 0), 0);
  const newestAt = newVideos.map((video) => new Date(video.snippet?.publishedAt)).sort((a, b) => b - a)[0];
  channelSheet.getRange(`C${rowNumber}:J${rowNumber}`).values = [[
    channelId || null,
    status,
    playlistId || null,
    captureDateTime,
    newestAt ? kstDateAndTime(newestAt.toISOString()).date : null,
    newVideos.length,
    viewSum,
    note || (freshVideos.length ? `${freshVideos.length}개 신규 영상 확인` : "당일 신규 영상 없음"),
  ]];
  channelSheet.getRange(`F${rowNumber}:G${rowNumber}`).format.numberFormat = "yyyy-mm-dd hh:mm";
  channelSheet.getRange(`H${rowNumber}:I${rowNumber}`).format.numberFormat = "#,##0";

  const dailyKey = `${range.dateKey}|${member}`;
  const dailyRow = dailyRowByKey.get(dailyKey) ?? firstEmptyRow(dailySheet, 6);
  dailySheet.getRange(`A${dailyRow}:G${dailyRow}`).values = [[range.dateCell, member, channelId || null, newVideos.length, viewSum, status, note || `최근 ${trackingDays}일 추적 영상 ${recent.length}개 확인`]];
  applyDataRowFormat(dailySheet, `A${dailyRow}:G${dailyRow}`, ["A"], ["D", "E"]);
  dailyRowByKey.set(dailyKey, dailyRow);

  for (const video of recent) {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const { date: publishedDate, time: publishedTime } = kstDateAndTime(video.snippet?.publishedAt);
    const views = Number(video.statistics?.viewCount) || 0;
    const isNewToday = newVideos.some((newVideo) => newVideo.id === video.id);
    const existingTracked = trackedRowByVideo.get(video.id);
    const trackedRow = existingTracked?.rowNumber ?? firstEmptyRow(trackedVideoSheet, 6);
    trackedVideoSheet.getRange(`A${trackedRow}:O${trackedRow}`).values = [[
      existingTracked?.row?.[0] ?? range.dateCell, publishedDate, publishedTime, member, channelId, video.id,
      video.snippet?.title ?? "", contentType(video), video.status?.privacyStatus ?? "public", views,
      range.dateCell, range.timeLabel, videoUrl, isNewToday ? "당일 신규" : "최근 30일 보강", "확인됨",
    ]];
    applyDataRowFormat(trackedVideoSheet, `A${trackedRow}:O${trackedRow}`, ["A", "B", "K"], ["J"]);
    trackedRowByVideo.set(video.id, { row: trackedVideoSheet.getRange(`A${trackedRow}:O${trackedRow}`).values[0], rowNumber: trackedRow });

    if (isNewToday && !knownNewVideos.has(video.id)) {
      const appendRow = firstEmptyRow(newVideoSheet, 6);
      newVideoSheet.getRange(`A${appendRow}:O${appendRow}`).values = [[
        range.dateCell, publishedDate, publishedTime, member, channelId, video.id,
        video.snippet?.title ?? "", contentType(video), views, views, videoUrl,
        video.status?.privacyStatus ?? "public", "확인됨", "YouTube Data API v3", "공개 영상 기준",
      ]];
      applyDataRowFormat(newVideoSheet, `A${appendRow}:O${appendRow}`, ["A", "B"], ["I", "J"]);
      knownNewVideos.set(video.id, appendRow);
      newVideoCount += 1;
    }
    const snapshotKey = `${range.dateKey}|${video.id}`;
    const existingSnapshotRow = snapshotRowByKey.get(snapshotKey);
    const snapshotRow = existingSnapshotRow ?? firstEmptyRow(snapshotSheet, 6);
    const previousViews = latestPriorSnapshotByVideo.get(video.id) ?? null;
    const delta = previousViews == null ? null : Math.max(0, views - previousViews);
    snapshotSheet.getRange(`A${snapshotRow}:J${snapshotRow}`).values = [[
      range.dateCell, range.timeLabel, member, video.id, video.snippet?.title ?? "", contentType(video), views, previousViews, delta, videoUrl,
    ]];
    applyDataRowFormat(snapshotSheet, `A${snapshotRow}:J${snapshotRow}`, ["A"], ["G", "H", "I"]);
    snapshotRowByKey.set(snapshotKey, snapshotRow);
    if (!existingSnapshotRow) snapshotCount += 1;
  }
}

const out = await SpreadsheetFile.exportXlsx(workbook);
await out.save(workbookPath);
console.log(JSON.stringify({ dateKst: range.dateKey, trackingDays, channelsChecked: selectedChannels.length, channelsResolved: resolvedCount, newVideos: newVideoCount, viewSnapshots: snapshotCount, errors: errorCount }));

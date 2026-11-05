import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(rootDir, "docs", "통계", "국회의원_인스타그램_일일성과_추적.xlsx");
const timeZone = "Asia/Seoul";
const limit = Math.max(1, Math.min(Number(process.argv.find((arg) => arg.startsWith("--limit="))?.slice(8) ?? 132), 132));
const member = decodeURIComponent(process.argv.find((arg) => arg.startsWith("--member="))?.slice(9) ?? "").trim();
const itemsPerAccount = Math.max(1, Math.min(Number(process.argv.find((arg) => arg.startsWith("--items-per-account="))?.slice(20) ?? 6), 18));
const detailLimit = Math.max(1, Math.min(Number(process.argv.find((arg) => arg.startsWith("--detail-limit="))?.slice(15) ?? 80), 500));
const outputPath = process.argv.find((arg) => arg.startsWith("--output="))?.slice(9) ?? path.join(os.tmpdir(), "instagram-public-results.json");

function toText(value) { return value == null ? "" : String(value).trim(); }
function kstParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return { dateKst: `${get("year")}-${get("month")}-${get("day")}`, timeKst: `${get("hour")}:${get("minute")}` };
}
function decodeHtml(value) { return toText(value).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); }
function metaContent(html, property) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1];
    if (key?.toLowerCase() !== property.toLowerCase()) continue;
    const content = tag.match(/content=["']([^"']*)["']/i)?.[1];
    if (content != null) return decodeHtml(content);
  }
  return "";
}
function rawForLabels(description, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const before = new RegExp(`([0-9][0-9,.]*(?:[KMB])?)\\s*${escaped}`, "i").exec(description)?.[1];
    const after = new RegExp(`${escaped}\\s*([0-9][0-9,.]*(?:[KMB])?)`, "i").exec(description)?.[1];
    if (before || after) return before ?? after;
  }
  return "";
}
function metric(raw) {
  const display = toText(raw);
  if (!display) return { raw: "", exact: null, quality: "미노출" };
  const compact = display.replace(/\s+/g, "");
  if (/[KMB]/i.test(compact)) return { raw: display, exact: null, quality: "반올림 공개값" };
  const digits = compact.replace(/[^0-9]/g, "");
  if (!digits) return { raw: display, exact: null, quality: "형식 미확인" };
  return { raw: display, exact: Number(digits), quality: "정확 공개값" };
}
function postTime(html) {
  const raw = html.match(/<time\b[^>]*datetime=["']([^"']+)["']/i)?.[1] ?? html.match(/"uploadDate"\s*:\s*"([^"]+)"/i)?.[1] ?? "";
  if (!raw) return { publishedAtKst: "", publishedDateKst: "", publishedTimeKst: "" };
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return { publishedAtKst: "", publishedDateKst: "", publishedTimeKst: "" };
  const parts = kstParts(date);
  return { publishedAtKst: date.toISOString(), publishedDateKst: parts.dateKst, publishedTimeKst: parts.timeKst };
}
function profileContentUrls(html, handle) {
  const escapedHandle = handle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`/${escapedHandle}/(p|reel)/([A-Za-z0-9_-]+)/`, "gi");
  const unique = new Set();
  const items = [];
  for (const match of html.matchAll(regex)) {
    const shortcode = match[2];
    if (unique.has(shortcode)) continue;
    unique.add(shortcode);
    const pathType = match[1].toLowerCase();
    items.push({ shortcode, kind: pathType === "reel" ? "릴스" : "피드", url: `https://www.instagram.com/${handle}/${pathType}/${shortcode}/` });
    if (items.length >= itemsPerAccount) break;
  }
  return items;
}
async function fetchPublic(url) {
  const response = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136 Safari/537.36", "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8" } });
  const html = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (/Please wait a few minutes before you try again|challenge_required|login_required/i.test(html)) throw new Error("접속 제한 또는 로그인 요구");
  return html;
}
function usedRows(sheet, startRow) { return (sheet.getUsedRange()?.values ?? []).slice(startRow - 1).filter((row) => row.some((value) => value != null && value !== "")); }

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const accountRows = usedRows(workbook.worksheets.getItem("계정 목록"), 6)
  .map((row) => ({ name: toText(row[0]), url: toText(row[2]), handle: toText(row[3]) }))
  .filter((account) => account.name && account.url && account.handle && (!member || account.name === member))
  .slice(0, limit);
if (member && accountRows.length === 0) throw new Error(`${member} 의원의 정규화된 인스타그램 계정을 찾지 못했습니다.`);

const context = kstParts();
const results = [];
let detailRequests = 0;
for (const account of accountRows) {
  try {
    const profileHtml = await fetchPublic(account.url);
    const description = metaContent(profileHtml, "og:description");
    const followers = metric(rawForLabels(description, ["Followers", "팔로워"]));
    const following = metric(rawForLabels(description, ["Following", "팔로잉"]));
    const contents = [];
    let contentCheckStatus = "확인됨";
    for (const item of profileContentUrls(profileHtml, account.handle)) {
      if (detailRequests >= detailLimit) {
        contents.push({ ...item, note: "상세 수집 한도 초과" });
        contentCheckStatus = "부분";
        continue;
      }
      detailRequests += 1;
      try {
        const detailHtml = await fetchPublic(item.url);
        const detailDescription = metaContent(detailHtml, "og:description");
        contents.push({
          ...item,
          ...postTime(detailHtml),
          caption: metaContent(detailHtml, "og:title"),
          likes: metric(rawForLabels(detailDescription, ["likes", "좋아요"])),
          comments: metric(rawForLabels(detailDescription, ["comments", "댓글"])),
          plays: metric(rawForLabels(detailDescription, ["plays", "views", "재생"])),
          note: "공개 콘텐츠 상세 확인",
        });
      } catch (error) {
        contents.push({ ...item, note: `상세 수집 오류: ${error instanceof Error ? error.message : String(error)}` });
        contentCheckStatus = "부분";
      }
    }
    results.push({ name: account.name, handle: account.handle, url: account.url, status: "확인됨", followers, following, activeStory: "확인 불가", contentCheckStatus, note: followers.quality === "미노출" ? "팔로워 공개 수치 미노출" : "", contents });
  } catch (error) {
    results.push({ name: account.name, handle: account.handle, url: account.url, status: "오류", followers: { raw: "", exact: null, quality: "오류" }, following: { raw: "", exact: null, quality: "오류" }, activeStory: "확인 불가", note: error instanceof Error ? error.message : String(error), contents: [] });
  }
}

const payload = { dateKst: context.dateKst, timeKst: context.timeKst, runId: `instagram-${context.dateKst.replaceAll("-", "")}-${context.timeKst.replace(":", "")}`, source: "공개 HTTP 프로필·상세 페이지", results };
await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");
console.log(JSON.stringify({ outputPath, accountsChecked: results.length, profilesConfirmed: results.filter((result) => result.status === "확인됨").length, errors: results.filter((result) => result.status !== "확인됨").length, contentDetailsAttempted: detailRequests }, null, 2));

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = "C:\\Users\\ljh43\\Downloads\\국회 SNS.xlsx";
const outputPath = path.join(rootDir, "docs", "통계", "국회의원_인스타그램_일일성과_추적.xlsx");
const sourceUrl = "https://www.assembly.go.kr/portal/na/assmSns/assmSns.do?menuNo=601001&tabMenuNo1=601018&tabMenuNo2=601025&tabMenuNo3=601001";
const seedGrace = process.argv.includes("--seed-grace");

const colors = {
  navy: "#0F2742",
  blue: "#0076A8",
  blueSoft: "#EAF5FA",
  ink: "#1B2A3A",
  muted: "#5D6B7A",
  grid: "#D3DEE8",
  pale: "#F7FAFC",
  green: "#E7F4EC",
  amber: "#FFF5DD",
};

function toText(value) {
  return value == null ? "" : String(value).trim();
}

function profileFromRaw(raw) {
  const source = toText(raw);
  const marker = source.toLowerCase().lastIndexOf("instagram.com/");
  if (marker < 0) return null;
  const tail = source.slice(marker + "instagram.com/".length)
    .replace(/[?#].*$/, "")
    .replace(/^@/, "")
    .split("/")[0]
    .replace(/[)>,.]+$/, "")
    .trim();
  if (!/^[A-Za-z0-9._]{1,30}$/.test(tail)) return null;
  return { handle: tail, url: `https://www.instagram.com/${tail}/` };
}

function sectionTitle(sheet, range, text) {
  sheet.getRange(range).merge();
  sheet.getRange(range.split(":")[0]).values = [[text]];
  sheet.getRange(range).format = {
    fill: colors.blueSoft,
    font: { bold: true, color: colors.navy, size: 11 },
    verticalAlignment: "center",
  };
}

function header(sheet, range) {
  sheet.getRange(range).format = {
    fill: colors.navy,
    font: { bold: true, color: "#FFFFFF", size: 10 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: colors.navy },
  };
}

function bodyBorders(sheet, range) {
  sheet.getRange(range).format = {
    borders: { preset: "inside", style: "thin", color: colors.grid },
    verticalAlignment: "center",
  };
}

function kstCapture() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return { date: new Date(`${get("year")}-${get("month")}-${get("day")}T00:00:00Z`), time: `${get("hour")}:${get("minute")}` };
}

const sourceWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const sourceSheet = sourceWorkbook.worksheets.getItemAt(0);
const sourceValues = sourceSheet.getUsedRange().values;
const headerRowIndex = sourceValues.findIndex((row) => row.some((value) => toText(value) === "인스타그램"));
if (headerRowIndex < 0) throw new Error("원본 국회 SNS 파일에서 인스타그램 열을 찾지 못했습니다.");
const headers = sourceValues[headerRowIndex].map(toText);
const typeIndex = headers.indexOf("구분");
const nameIndex = headers.indexOf("이름");
const instagramIndex = headers.indexOf("인스타그램");
if (typeIndex < 0 || nameIndex < 0 || instagramIndex < 0) throw new Error("원본 국회 SNS 파일에서 필요한 열을 찾지 못했습니다.");

const accounts = [];
for (const row of sourceValues.slice(headerRowIndex + 1)) {
  if (toText(row[typeIndex]) !== "국회의원") continue;
  const rawUrl = toText(row[instagramIndex]);
  if (!rawUrl) continue;
  const profile = profileFromRaw(rawUrl);
  accounts.push([
    toText(row[nameIndex]),
    rawUrl,
    profile?.url ?? "",
    profile?.handle ?? "",
    profile ? "점검 대기" : "정규화 필요",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    profile ? "공개 프로필 기준 수집 대기" : "국회 SNS 등록 주소 형식 확인 필요",
    sourceUrl,
  ]);
}

const normalizedCount = accounts.filter((row) => row[4] === "점검 대기").length;
const workbook = Workbook.create();
const summary = workbook.worksheets.add("요약");
const accountsSheet = workbook.worksheets.add("계정 목록");
const followerSheet = workbook.worksheets.add("팔로워 일별");
const contentSheet = workbook.worksheets.add("콘텐츠 기록");
const storySheet = workbook.worksheets.add("스토리 관측");
const rulesSheet = workbook.worksheets.add("수집 규칙");
for (const sheet of [summary, accountsSheet, followerSheet, contentSheet, storySheet, rulesSheet]) sheet.showGridLines = false;

// 요약
summary.mergeCells("A1:J1");
summary.getRange("A1").values = [["국회의원 인스타그램 공개지표 추적"]];
summary.getRange("A1:J1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 18 }, verticalAlignment: "center" };
summary.getRange("A2:J2").merge();
summary.getRange("A2").values = [["공개 프로필 기반 · 팔로워 스냅샷과 피드·릴스 신규 게시를 매일 기록합니다. 스토리 조회·도달 등 비공개 인사이트는 수집하지 않습니다."]];
summary.getRange("A2:J2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
summary.getRange("A4:B4").merge(); summary.getRange("D4:E4").merge(); summary.getRange("G4:H4").merge(); summary.getRange("I4:J4").merge();
summary.getRange("A4").values = [["등록 인스타 계정"]];
summary.getRange("D4").values = [["공개 확인 계정"]];
summary.getRange("G4").values = [["팔로워 스냅샷"]];
summary.getRange("I4").values = [["오늘 신규 콘텐츠"]];
summary.getRange("A5:B6").merge(); summary.getRange("D5:E6").merge(); summary.getRange("G5:H6").merge(); summary.getRange("I5:J6").merge();
summary.getRange("A5").formulas = [["=COUNTA('계정 목록'!$A$6:$A$205)"]];
summary.getRange("D5").formulas = [["=COUNTIF('계정 목록'!$E$6:$E$205,\"확인됨\")"]];
summary.getRange("G5").formulas = [["=COUNTA('팔로워 일별'!$A$6:$A$5000)"]];
summary.getRange("I5").formulas = [["=COUNTIF('콘텐츠 기록'!$A$6:$A$5000,TODAY())"]];
for (const labelRange of ["A4:B4", "D4:E4", "G4:H4", "I4:J4"]) summary.getRange(labelRange).format = { fill: colors.blueSoft, font: { bold: true, color: colors.navy, size: 10 }, horizontalAlignment: "center", verticalAlignment: "center" };
for (const valueRange of ["A5:B6", "D5:E6", "G5:H6", "I5:J6"]) summary.getRange(valueRange).format = { fill: "#FFFFFF", font: { bold: true, color: colors.blue, size: 18 }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: colors.grid }, numberFormat: "#,##0" };
sectionTitle(summary, "A8:J8", "수집 범위와 해석");
const scopeRows = [
  ["팔로워", "프로필에 공개된 팔로워 수를 일 단위로 기록합니다."],
  ["피드·릴스", "공개 프로필에 노출되는 게시물 URL을 기준으로 신규 게시 여부와 공개 반응 수치를 기록합니다."],
  ["스토리", "로그인하지 않은 일반 방문자에게 보이는 활성 표시만 관측합니다. 스토리 수·조회수·도달은 기록하지 않습니다."],
  ["누락 처리", "프로필 비공개·접속 제한·주소 오류는 0으로 대체하지 않고 상태와 사유를 남깁니다."],
  ["원본", "국회 SNS 목록(국회 웹사이트 공개 정보)을 기반으로 계정을 등록했습니다."],
].map(([label, note]) => [label, note, ...Array(8).fill("")]);
summary.getRange("A9:J13").values = scopeRows;
summary.getRange("A9:A13").format = { fill: colors.pale, font: { bold: true, color: colors.navy }, verticalAlignment: "center" };
summary.getRange("B9:J13").merge(true);
summary.getRange("A9:J13").format = { borders: { preset: "inside", style: "thin", color: colors.grid }, verticalAlignment: "center", wrapText: true };
summary.getRange("A15:J15").merge();
summary.getRange("A15").values = [[`초기 등록: ${accounts.length}건 · 정규화 완료: ${normalizedCount}건 · 기준 파일: 국회 SNS.xlsx`]];
summary.getRange("A15:J15").format = { font: { italic: true, color: colors.muted, size: 9 }, verticalAlignment: "center" };
summary.getRange("A1:J1").format.rowHeight = 30;
summary.getRange("A2:J2").format.rowHeight = 30;
summary.getRange("A4:J6").format.rowHeight = 22;
summary.getRange("A9:J13").format.rowHeight = 30;
summary.getRange("A:A").format.columnWidth = 17;
summary.getRange("B:B").format.columnWidth = 22;
summary.getRange("C:F").format.columnWidth = 12;
summary.getRange("G:J").format.columnWidth = 16;

// 계정 목록
accountsSheet.mergeCells("A1:N1");
accountsSheet.getRange("A1").values = [["국회의원 인스타그램 계정 목록"]];
accountsSheet.getRange("A1:N1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
accountsSheet.mergeCells("A2:N2");
accountsSheet.getRange("A2").values = [["국회 SNS 공개 명단을 기준으로 등록했습니다. ‘연결 상태’가 확인됨일 때만 최신 공개 프로필 수치가 채워집니다."]];
accountsSheet.getRange("A2:N2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center" };
const accountHeaders = [["의원", "국회 SNS 등록 URL", "정규화 프로필 URL", "핸들", "연결 상태", "마지막 확인일", "팔로워", "팔로잉", "최근 콘텐츠일", "오늘 신규 피드", "오늘 신규 릴스", "활성 스토리 관측", "수집 메모", "원본 출처"]];
accountsSheet.getRange("A5:N5").values = accountHeaders;
header(accountsSheet, "A5:N5");
accountsSheet.getRange(`A6:N${accounts.length + 5}`).values = accounts;
bodyBorders(accountsSheet, `A6:N${accounts.length + 5}`);
accountsSheet.getRange(`F6:F${accounts.length + 5}`).format.numberFormat = "yyyy-mm-dd";
accountsSheet.getRange(`G6:K${accounts.length + 5}`).format.numberFormat = "#,##0";
accountsSheet.getRange(`A6:N${accounts.length + 5}`).format.wrapText = true;
accountsSheet.getRange(`G6:K${accounts.length + 5}`).format.horizontalAlignment = "right";
accountsSheet.getRange("A:A").format.columnWidth = 12;
accountsSheet.getRange("B:C").format.columnWidth = 34;
accountsSheet.getRange("D:D").format.columnWidth = 20;
accountsSheet.getRange("E:E").format.columnWidth = 14;
accountsSheet.getRange("F:F").format.columnWidth = 13;
accountsSheet.getRange("G:K").format.columnWidth = 14;
accountsSheet.getRange("L:L").format.columnWidth = 17;
accountsSheet.getRange("M:M").format.columnWidth = 32;
accountsSheet.getRange("N:N").format.columnWidth = 38;
accountsSheet.getRange(`A6:N${accounts.length + 5}`).format.rowHeight = 22;
accountsSheet.freezePanes.freezeRows(5);
accountsSheet.tables.add(`A5:N${accounts.length + 5}`, true, "InstagramAccountsTable");

// 팔로워 일별
followerSheet.mergeCells("A1:I1");
followerSheet.getRange("A1").values = [["팔로워·팔로잉 일별 스냅샷"]];
followerSheet.getRange("A1:I1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
followerSheet.mergeCells("A2:I2");
followerSheet.getRange("A2").values = [["동일 수집일·핸들은 한 번만 기록합니다. 공개되지 않거나 읽을 수 없는 수치는 비워 두고 상태를 남깁니다."]];
followerSheet.getRange("A2:I2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center" };
followerSheet.getRange("A5:I5").values = [["수집일", "수집 시각(KST)", "의원", "핸들", "팔로워", "팔로잉", "프로필 URL", "상태", "메모"]];
header(followerSheet, "A5:I5");
followerSheet.getRange("A6:I205").format = { borders: { preset: "inside", style: "thin", color: colors.grid }, verticalAlignment: "center" };
followerSheet.getRange("A6:A205").format.numberFormat = "yyyy-mm-dd";
followerSheet.getRange("E6:F205").format.numberFormat = "#,##0";
followerSheet.getRange("A:A").format.columnWidth = 13; followerSheet.getRange("B:B").format.columnWidth = 14; followerSheet.getRange("C:C").format.columnWidth = 12; followerSheet.getRange("D:D").format.columnWidth = 20; followerSheet.getRange("E:F").format.columnWidth = 14; followerSheet.getRange("G:G").format.columnWidth = 36; followerSheet.getRange("H:H").format.columnWidth = 14; followerSheet.getRange("I:I").format.columnWidth = 36;
followerSheet.freezePanes.freezeRows(5);

// 콘텐츠 기록
contentSheet.mergeCells("A1:M1");
contentSheet.getRange("A1").values = [["공개 피드·릴스 기록"]];
contentSheet.getRange("A1:M1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
contentSheet.mergeCells("A2:M2");
contentSheet.getRange("A2").values = [["공개 프로필에서 노출되는 최근 콘텐츠만 대상으로 합니다. 비공개·삭제·지역 제한 콘텐츠는 수집하지 않습니다."]];
contentSheet.getRange("A2:M2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center" };
contentSheet.getRange("A5:M5").values = [["최초 수집일", "게시일(KST)", "게시 시각(KST)", "의원", "핸들", "콘텐츠 ID", "콘텐츠 구분", "짧은 설명", "좋아요", "댓글", "공개 재생수", "콘텐츠 URL", "상태·메모"]];
header(contentSheet, "A5:M5");
contentSheet.getRange("A6:M3005").format = { borders: { preset: "inside", style: "thin", color: colors.grid }, verticalAlignment: "center" };
contentSheet.getRange("A6:B3005").format.numberFormat = "yyyy-mm-dd";
contentSheet.getRange("I6:K3005").format.numberFormat = "#,##0";
contentSheet.getRange("A:A").format.columnWidth = 13; contentSheet.getRange("B:B").format.columnWidth = 13; contentSheet.getRange("C:C").format.columnWidth = 14; contentSheet.getRange("D:D").format.columnWidth = 12; contentSheet.getRange("E:E").format.columnWidth = 20; contentSheet.getRange("F:F").format.columnWidth = 16; contentSheet.getRange("G:G").format.columnWidth = 13; contentSheet.getRange("H:H").format.columnWidth = 46; contentSheet.getRange("I:K").format.columnWidth = 14; contentSheet.getRange("L:L").format.columnWidth = 42; contentSheet.getRange("M:M").format.columnWidth = 26;
contentSheet.freezePanes.freezeRows(5);

// 스토리 관측
storySheet.mergeCells("A1:H1");
storySheet.getRange("A1").values = [["공개 스토리 관측"]];
storySheet.getRange("A1:H1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
storySheet.mergeCells("A2:H2");
storySheet.getRange("A2").values = [["일반 공개 프로필에서 활성 스토리 표시가 보이는지 여부만 기록합니다. 스토리의 콘텐츠·조회수·도달은 수집하지 않습니다."]];
storySheet.getRange("A2:H2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center" };
storySheet.getRange("A5:H5").values = [["수집일", "수집 시각(KST)", "의원", "핸들", "활성 스토리 관측", "프로필 URL", "상태", "메모"]];
header(storySheet, "A5:H5");
storySheet.getRange("A6:H205").format = { borders: { preset: "inside", style: "thin", color: colors.grid }, verticalAlignment: "center" };
storySheet.getRange("A6:A205").format.numberFormat = "yyyy-mm-dd";
storySheet.getRange("A:A").format.columnWidth = 13; storySheet.getRange("B:B").format.columnWidth = 14; storySheet.getRange("C:C").format.columnWidth = 12; storySheet.getRange("D:D").format.columnWidth = 20; storySheet.getRange("E:E").format.columnWidth = 19; storySheet.getRange("F:F").format.columnWidth = 38; storySheet.getRange("G:G").format.columnWidth = 14; storySheet.getRange("H:H").format.columnWidth = 38;
storySheet.freezePanes.freezeRows(5);

// 수집 규칙
rulesSheet.mergeCells("A1:H1");
rulesSheet.getRange("A1").values = [["수집 규칙 · 공개 범위"]];
rulesSheet.getRange("A1:H1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
rulesSheet.getRange("A3:H9").values = [
  ["항목", "기준", "", "", "", "", "", ""],
  ["대상", "국회 SNS 목록에 등록된 국회의원 인스타그램 프로필", "", "", "", "", "", ""],
  ["팔로워", "로그인하지 않은 공개 프로필에서 일반 방문자에게 보이는 팔로워·팔로잉 수만 기록", "", "", "", "", "", ""],
  ["피드·릴스", "최근 공개 콘텐츠의 URL·게시 시각·공개 반응 수치만 기록. 신규 판단은 콘텐츠 ID 기준", "", "", "", "", "", ""],
  ["스토리", "활성 여부의 공개 표시만 관측. 스토리 수·조회수·도달·완주율은 기록 대상이 아님", "", "", "", "", "", ""],
  ["오류 처리", "비공개·로그인 요구·주소 오류·접속 제한은 0으로 기록하지 않고 상태와 사유를 남김", "", "", "", "", "", ""],
  ["기준 출처", sourceUrl, "", "", "", "", "", ""],
];
rulesSheet.getRange("A3:H3").merge(true);
rulesSheet.getRange("A3:H3").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF" }, verticalAlignment: "center" };
rulesSheet.getRange("A4:A9").format = { fill: colors.pale, font: { bold: true, color: colors.navy }, verticalAlignment: "center" };
rulesSheet.getRange("B4:H9").merge(true);
rulesSheet.getRange("A3:H9").format = { borders: { preset: "inside", style: "thin", color: colors.grid }, verticalAlignment: "center", wrapText: true };
rulesSheet.getRange("A:A").format.columnWidth = 17; rulesSheet.getRange("B:H").format.columnWidth = 20;
rulesSheet.getRange("A4:H9").format.rowHeight = 34;

if (seedGrace) {
  const capture = kstCapture();
  const graceIndex = accounts.findIndex((row) => row[3] === "grace.kang.165");
  const graceContents = ["DcNLYzbE0Iz", "DcI4ecpk7LB", "DcA8WIQE8s9", "Db5c1jikw9U", "Db3Pou0k9bs", "Db0SAblk2gG", "DbXFbbhIHTC", "DbVCupCE2fV", "DaeVXDYIH6H", "DZAVCSSE8vG", "DZAN02JEzTs", "DY91q-yE1NJ"];
  if (graceIndex >= 0) {
    const accountRow = graceIndex + 6;
    accountsSheet.getRange(`E${accountRow}:M${accountRow}`).values = [["확인됨", capture.date, 1096, 62, null, graceContents.length, 0, "확인 불가", "로그인 없는 공개 프로필 화면 기준"]];
    followerSheet.getRange("A6:I6").values = [[capture.date, capture.time, "강경숙", "grace.kang.165", 1096, 62, "https://www.instagram.com/grace.kang.165/", "확인됨", "로그인 없는 공개 프로필 화면 기준"]];
    storySheet.getRange("A6:H6").values = [[capture.date, capture.time, "강경숙", "grace.kang.165", "확인 불가", "https://www.instagram.com/grace.kang.165/", "확인 불가", "하이라이트는 보였으나 활성 스토리 표시는 확인하지 못함"]];
    contentSheet.getRange("A6:M17").values = graceContents.map((shortcode) => [capture.date, null, "", "강경숙", "grace.kang.165", shortcode, "피드", "", null, null, null, `https://www.instagram.com/grace.kang.165/p/${shortcode}/`, "공개 프로필 화면에서 최초 확인"]);
  }
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(JSON.stringify({ outputPath, totalAccounts: accounts.length, normalizedCount }, null, 2));

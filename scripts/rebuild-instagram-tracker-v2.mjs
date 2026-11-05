import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(rootDir, "docs", "통계");
const defaultSource = path.join(docsDir, "국회의원_인스타그램_일일성과_추적_2026-08-22_수집완료.xlsx");
const defaultOutput = path.join(docsDir, "국회의원_인스타그램_일일성과_추적.xlsx");
const sourcePath = process.argv.find((arg) => arg.startsWith("--source="))?.slice(9) ?? defaultSource;
const outputPath = process.argv.find((arg) => arg.startsWith("--output="))?.slice(9) ?? defaultOutput;
const baselineRunId = "baseline-20260822-0337";

const colors = {
  navy: "#102A43",
  blue: "#007EB9",
  blueSoft: "#E9F5FB",
  blueRow: "#D6EEF9",
  muted: "#52616B",
  grid: "#D7E1EA",
  warning: "#FFF4D6",
  warningText: "#8A5A00",
  error: "#FDE8E7",
  errorText: "#9A1C1C",
  green: "#E8F5EC",
  greenText: "#216A3C",
};

function toText(value) {
  return value == null ? "" : String(value).trim();
}

function asDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) return new Date(Date.UTC(1899, 11, 30) + value * 86400000);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return null;
}

function usedRows(sheet, startRow) {
  return (sheet.getUsedRange()?.values ?? []).slice(startRow - 1).filter((row) => row.some((value) => value != null && value !== ""));
}

function compactCount(value, accountStatus = "확인됨") {
  const count = typeof value === "number" && Number.isFinite(value) ? value : null;
  if (accountStatus !== "확인됨") return { display: "", exact: null, quality: accountStatus === "오류" ? "오류" : "미확인", note: "프로필 수집 오류로 공개 수치를 확인하지 못함" };
  if (count == null) return { display: "", exact: null, quality: "미노출", note: "공개 프로필 수치 미노출" };
  if (count % 1000 === 0) {
    return {
      display: "",
      exact: null,
      quality: "원문 미보존·재수집 필요",
      note: `기존 파일의 ${count.toLocaleString("en-US")} 환산값은 원문(K/M 표기 여부)을 보존하지 않아 정확값으로 사용하지 않음`,
    };
  }
  return { display: count.toLocaleString("en-US"), exact: count, quality: "정확 공개값", note: "" };
}

function styleHeader(sheet, range) {
  sheet.getRange(range).format = {
    fill: colors.navy,
    font: { bold: true, color: "#FFFFFF", size: 10 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
  };
}

function bodyStyle(sheet, range) {
  sheet.getRange(range).format = {
    borders: { preset: "inside", style: "thin", color: colors.grid },
    verticalAlignment: "center",
    wrapText: true,
  };
}

function addBandedRows(sheet, range) {
  sheet.getRange(range).conditionalFormats.addCustom(`=MOD(ROW(),2)=0`, { fill: colors.blueSoft });
}

function sectionTitle(sheet, range, text) {
  sheet.mergeCells(range);
  const cell = sheet.getRange(range.split(":")[0]);
  cell.values = [[text]];
  sheet.getRange(range).format = {
    fill: colors.blueSoft,
    font: { bold: true, color: colors.navy, size: 11 },
    verticalAlignment: "center",
  };
}

const source = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const sourceAccounts = usedRows(source.worksheets.getItem("계정 목록"), 6);
const sourceFollowers = usedRows(source.worksheets.getItem("팔로워 일별"), 6);
const sourceContents = usedRows(source.worksheets.getItem("콘텐츠 기록"), 6);
const sourceStories = usedRows(source.worksheets.getItem("스토리 관측"), 6);

const accountRows = sourceAccounts.map((row) => {
  const followers = compactCount(row[6], toText(row[4]));
  const following = compactCount(row[7], toText(row[4]));
  const originalNote = toText(row[12]);
  const notes = [originalNote, followers.note, following.note].filter(Boolean).join(" · ");
  return [
    toText(row[0]), toText(row[1]), toText(row[2]), toText(row[3]), toText(row[4]) || "미확인", asDate(row[5]),
    followers.display, followers.exact, followers.quality,
    following.display, following.exact, following.quality,
    null, "기준선·상세 미수집", 0, 0, toText(row[11]) || "확인 불가", notes, toText(row[13]),
  ];
});

const followerRows = sourceFollowers.map((row) => {
  const followers = compactCount(row[4], toText(row[7]));
  const following = compactCount(row[5], toText(row[7]));
  return [
    asDate(row[0]), toText(row[1]), baselineRunId, toText(row[2]), toText(row[3]),
    followers.display, followers.exact, followers.quality,
    following.display, following.exact, following.quality,
    toText(row[6]), toText(row[7]) || "미확인", [toText(row[8]), followers.note, following.note].filter(Boolean).join(" · "),
  ];
});

const contentRows = sourceContents.map((row) => [
  asDate(row[0]), null, "", baselineRunId, toText(row[3]), toText(row[4]), toText(row[5]), toText(row[6]) || "피드",
  "", "", null, "미수집", "", null, "미수집", "", null, "미수집", toText(row[11]), "기준선 · 상세 미수집", "미확인",
  "기존 목록 이관: 최초 발견일은 게시일이 아니며, 게시 시각·설명·성과 수치는 재수집 전까지 미확인",
]);

const storyRows = sourceStories.map((row) => [
  asDate(row[0]), toText(row[1]), baselineRunId, toText(row[2]), toText(row[3]), toText(row[4]) || "확인 불가",
  toText(row[5]), toText(row[6]) || "미확인", [toText(row[7]), "기준선 이관"].filter(Boolean).join(" · "),
]);

const confirmed = accountRows.filter((row) => row[4] === "확인됨").length;
const failed = accountRows.length - confirmed;
const workbook = Workbook.create();
const summary = workbook.worksheets.add("요약");
const accounts = workbook.worksheets.add("계정 목록");
const profiles = workbook.worksheets.add("프로필 스냅샷");
const contents = workbook.worksheets.add("콘텐츠 기록");
const performance = workbook.worksheets.add("콘텐츠 성과 스냅샷");
const stories = workbook.worksheets.add("스토리 관측");
const logs = workbook.worksheets.add("수집 실행 로그");
const rules = workbook.worksheets.add("수집 규칙");
for (const sheet of [summary, accounts, profiles, contents, performance, stories, logs, rules]) sheet.showGridLines = false;

// 요약
summary.mergeCells("A1:L1");
summary.getRange("A1").values = [["국회의원 인스타그램 공개지표 추적"]];
summary.getRange("A1:L1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 18 }, verticalAlignment: "center" };
summary.mergeCells("A2:L2");
summary.getRange("A2").values = [["공개 화면에서 확인 가능한 값만 기록합니다. 최초 발견·실제 게시·성과 스냅샷을 분리하며, 반올림 표기와 미확인은 정확값으로 사용하지 않습니다."]];
summary.getRange("A2:L2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
for (const [range, label] of [["A4:C4", "등록 인스타 계정"], ["D4:F4", "공개 확인 프로필"], ["G4:I4", "정확 공개 팔로워 스냅샷"], ["J4:L4", "당일 확정 신규 콘텐츠"]]) {
  summary.mergeCells(range);
  summary.getRange(range.split(":")[0]).values = [[label]];
  summary.getRange(range).format = { fill: colors.blueSoft, font: { bold: true, color: colors.navy, size: 10 }, horizontalAlignment: "center", verticalAlignment: "center" };
}
for (const range of ["A5:C6", "D5:F6", "G5:I6", "J5:L6"]) {
  summary.mergeCells(range);
  summary.getRange(range).format = { fill: "#FFFFFF", font: { bold: true, color: colors.blue, size: 18 }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: colors.grid }, numberFormat: "#,##0" };
}
summary.getRange("A5").formulas = [["=COUNTA('계정 목록'!$A$6:$A$205)"]];
summary.getRange("D5").formulas = [["=COUNTIF('계정 목록'!$E$6:$E$205,\"확인됨\")"]];
summary.getRange("G5").formulas = [["=COUNTIF('프로필 스냅샷'!$H$6:$H$5000,\"정확 공개값\")"]];
summary.getRange("J5").formulas = [["=COUNTIFS('콘텐츠 기록'!$B$6:$B$5000,TODAY(),'콘텐츠 기록'!$U$6:$U$5000,\"확정\")"]];
for (const [range, label] of [["A8:C8", "초기 기준선 콘텐츠"], ["D8:F8", "상세 확인 콘텐츠"], ["G8:I8", "재수집 필요 팔로워"], ["J8:L8", "현재 데이터 상태"]]) {
  summary.mergeCells(range);
  summary.getRange(range.split(":")[0]).values = [[label]];
  summary.getRange(range).format = { fill: colors.blueSoft, font: { bold: true, color: colors.navy, size: 10 }, horizontalAlignment: "center", verticalAlignment: "center" };
}
for (const range of ["A9:C10", "D9:F10", "G9:I10", "J9:L10"]) {
  summary.mergeCells(range);
  summary.getRange(range).format = { fill: "#FFFFFF", font: { bold: true, color: colors.navy, size: 14 }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: colors.grid }, numberFormat: "#,##0" };
}
summary.getRange("A9").formulas = [["=COUNTA('콘텐츠 기록'!$G$6:$G$5000)"]];
summary.getRange("D9").formulas = [["=COUNTIF('콘텐츠 기록'!$T$6:$T$5000,\"상세 확인\")"]];
summary.getRange("G9").formulas = [["=COUNTIF('프로필 스냅샷'!$H$6:$H$5000,\"원문 미보존·재수집 필요\")"]];
summary.getRange("J9").values = [["기준선 재구축 중"]];
summary.getRange("J9:L10").format.font = { bold: true, color: colors.warningText, size: 13 };
sectionTitle(summary, "A12:L12", "수집 기준");
summary.getRange("A13:L16").values = [
  ["신규 게시", "콘텐츠 상세의 실제 게시일(KST)이 수집일과 같고, 게시 시각이 확인된 콘텐츠만 확정으로 집계합니다.", "", "", "", "", "", "", "", "", "", ""],
  ["최초 발견", "처음 발견한 콘텐츠 ID를 뜻할 뿐, 오늘 게시됐다는 의미가 아닙니다.", "", "", "", "", "", "", "", "", "", ""],
  ["팔로워", "숫자가 그대로 공개된 경우만 정확값으로 기록합니다. K/M 표기는 원문과 정확도를 별도 저장합니다.", "", "", "", "", "", "", "", "", "", ""],
  ["기준선", "2026-08-22 기존 수집분은 상세 정보가 없는 초기 목록으로 보관하며, 성과 분석에서 제외합니다.", "", "", "", "", "", "", "", "", "", ""],
];
summary.mergeCells("B13:L13"); summary.mergeCells("B14:L14"); summary.mergeCells("B15:L15"); summary.mergeCells("B16:L16");
summary.getRange("A13:L16").format = { borders: { preset: "inside", style: "thin", color: colors.grid }, verticalAlignment: "center", wrapText: true };
summary.getRange("A13:A16").format = { fill: colors.blueSoft, font: { bold: true, color: colors.navy } };
summary.getRange("A1:L1").format.rowHeight = 30; summary.getRange("A2:L2").format.rowHeight = 32; summary.getRange("A4:L10").format.rowHeight = 22; summary.getRange("A13:L16").format.rowHeight = 30;
summary.getRange("A:C").format.columnWidth = 17; summary.getRange("D:F").format.columnWidth = 17; summary.getRange("G:I").format.columnWidth = 18; summary.getRange("J:L").format.columnWidth = 18;

// 계정 목록
accounts.mergeCells("A1:S1"); accounts.getRange("A1").values = [["국회의원 인스타그램 계정 목록"]];
accounts.getRange("A1:S1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
accounts.mergeCells("A2:S2"); accounts.getRange("A2").values = [["K/M 표기에서 이전에 환산된 수치는 원문이 보존되지 않아 정확값으로 쓰지 않습니다. 콘텐츠 상세 확인 상태가 ‘확인됨’일 때만 당일 게시 수를 갱신합니다."]];
accounts.getRange("A2:S2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
const accountHeaders = [["의원", "국회 SNS 등록 URL", "정규화 프로필 URL", "핸들", "계정 상태", "마지막 프로필 확인", "팔로워 표시값", "팔로워 정확 숫자", "팔로워 정확도", "팔로잉 표시값", "팔로잉 정확 숫자", "팔로잉 정확도", "최근 실제 게시일", "콘텐츠 상세 확인", "당일 확정 피드", "당일 확정 릴스", "활성 스토리 관측", "수집 메모", "원본 출처"]];
accounts.getRange("A5:S5").values = accountHeaders; styleHeader(accounts, "A5:S5");
accounts.getRange(`A6:S${accountRows.length + 5}`).values = accountRows; bodyStyle(accounts, `A6:S${accountRows.length + 5}`); addBandedRows(accounts, `A6:S${accountRows.length + 5}`);
accounts.getRange(`F6:F${accountRows.length + 5}`).format.numberFormat = "yyyy-mm-dd";
accounts.getRange(`H6:H${accountRows.length + 5}`).format.numberFormat = "#,##0";
accounts.getRange(`K6:K${accountRows.length + 5}`).format.numberFormat = "#,##0";
accounts.getRange(`M6:M${accountRows.length + 5}`).format.numberFormat = "yyyy-mm-dd";
accounts.getRange(`O6:P${accountRows.length + 5}`).format.numberFormat = "#,##0";
accounts.getRange("A:A").format.columnWidth = 12; accounts.getRange("B:C").format.columnWidth = 32; accounts.getRange("D:D").format.columnWidth = 19; accounts.getRange("E:E").format.columnWidth = 14; accounts.getRange("F:F").format.columnWidth = 14; accounts.getRange("G:L").format.columnWidth = 18; accounts.getRange("M:M").format.columnWidth = 14; accounts.getRange("N:N").format.columnWidth = 20; accounts.getRange("O:P").format.columnWidth = 14; accounts.getRange("Q:Q").format.columnWidth = 17; accounts.getRange("R:R").format.columnWidth = 42; accounts.getRange("S:S").format.columnWidth = 38;
accounts.getRange(`A6:S${accountRows.length + 5}`).format.rowHeight = 28; accounts.freezePanes.freezeRows(5); accounts.tables.add(`A5:S${accountRows.length + 5}`, true, "InstagramAccountsV2");

// 프로필 스냅샷
profiles.mergeCells("A1:N1"); profiles.getRange("A1").values = [["프로필 공개지표 스냅샷"]]; profiles.getRange("A1:N1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
profiles.mergeCells("A2:N2"); profiles.getRange("A2").values = [["표시값과 정확 숫자를 분리합니다. 반올림·원문 미보존·미노출은 증감 계산에서 제외합니다."]]; profiles.getRange("A2:N2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
profiles.getRange("A5:N5").values = [["수집일", "수집 시각(KST)", "실행 ID", "의원", "핸들", "팔로워 표시값", "팔로워 정확 숫자", "팔로워 정확도", "팔로잉 표시값", "팔로잉 정확 숫자", "팔로잉 정확도", "프로필 URL", "상태", "메모"]]; styleHeader(profiles, "A5:N5");
profiles.getRange(`A6:N${followerRows.length + 5}`).values = followerRows; bodyStyle(profiles, `A6:N${followerRows.length + 5}`); addBandedRows(profiles, `A6:N${followerRows.length + 5}`);
profiles.getRange(`A6:A${followerRows.length + 5}`).format.numberFormat = "yyyy-mm-dd"; profiles.getRange(`G6:G${followerRows.length + 5}`).format.numberFormat = "#,##0"; profiles.getRange(`J6:J${followerRows.length + 5}`).format.numberFormat = "#,##0";
profiles.getRange("A:A").format.columnWidth = 13; profiles.getRange("B:B").format.columnWidth = 14; profiles.getRange("C:C").format.columnWidth = 22; profiles.getRange("D:D").format.columnWidth = 12; profiles.getRange("E:E").format.columnWidth = 20; profiles.getRange("F:K").format.columnWidth = 18; profiles.getRange("L:L").format.columnWidth = 36; profiles.getRange("M:M").format.columnWidth = 14; profiles.getRange("N:N").format.columnWidth = 52; profiles.getRange(`A6:N${followerRows.length + 5}`).format.rowHeight = 26; profiles.freezePanes.freezeRows(5); profiles.tables.add(`A5:N${followerRows.length + 5}`, true, "InstagramProfileSnapshotsV2");

// 콘텐츠 기록
contents.mergeCells("A1:V1"); contents.getRange("A1").values = [["공개 콘텐츠 기록"]]; contents.getRange("A1:V1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
contents.mergeCells("A2:V2"); contents.getRange("A2").values = [["최초 발견일은 게시일이 아닙니다. 실제 게시 시각과 원문·정확도까지 확보한 공개지표만 당일 신규·성과 분석에 사용합니다."]]; contents.getRange("A2:V2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
contents.getRange("A5:V5").values = [["최초 발견일", "게시일(KST)", "게시 시각(KST)", "실행 ID", "의원", "핸들", "콘텐츠 ID", "콘텐츠 구분", "짧은 설명", "좋아요 표시값", "좋아요 정확 숫자", "좋아요 정확도", "댓글 표시값", "댓글 정확 숫자", "댓글 정확도", "재생수 표시값", "재생수 정확 숫자", "재생수 정확도", "콘텐츠 URL", "상세 상태", "당일 게시 판정", "메모"]]; styleHeader(contents, "A5:V5");
contents.getRange(`A6:V${contentRows.length + 5}`).values = contentRows; bodyStyle(contents, `A6:V${contentRows.length + 5}`); addBandedRows(contents, `A6:V${contentRows.length + 5}`);
contents.getRange(`A6:B${contentRows.length + 5}`).format.numberFormat = "yyyy-mm-dd"; contents.getRange(`K6:K${contentRows.length + 5}`).format.numberFormat = "#,##0"; contents.getRange(`N6:N${contentRows.length + 5}`).format.numberFormat = "#,##0"; contents.getRange(`Q6:Q${contentRows.length + 5}`).format.numberFormat = "#,##0";
contents.getRange("A:B").format.columnWidth = 14; contents.getRange("C:C").format.columnWidth = 14; contents.getRange("D:D").format.columnWidth = 22; contents.getRange("E:E").format.columnWidth = 12; contents.getRange("F:F").format.columnWidth = 20; contents.getRange("G:G").format.columnWidth = 16; contents.getRange("H:H").format.columnWidth = 13; contents.getRange("I:I").format.columnWidth = 46; contents.getRange("J:R").format.columnWidth = 17; contents.getRange("S:S").format.columnWidth = 42; contents.getRange("T:U").format.columnWidth = 18; contents.getRange("V:V").format.columnWidth = 56; contents.getRange(`A6:V${contentRows.length + 5}`).format.rowHeight = 26; contents.freezePanes.freezeRows(5); contents.tables.add(`A5:V${contentRows.length + 5}`, true, "InstagramContentsV2");

// 콘텐츠 성과 스냅샷
performance.mergeCells("A1:R1"); performance.getRange("A1").values = [["콘텐츠 공개 성과 스냅샷"]]; performance.getRange("A1:R1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
performance.mergeCells("A2:R2"); performance.getRange("A2").values = [["상세 페이지에서 공개된 원문·정확 숫자·정확도를 함께 기록합니다. 숨김·미노출 값은 0이 아닌 빈값으로 남깁니다."]]; performance.getRange("A2:R2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
performance.getRange("A5:R5").values = [["수집일", "수집 시각(KST)", "실행 ID", "의원", "핸들", "콘텐츠 ID", "좋아요 표시값", "좋아요 정확 숫자", "좋아요 정확도", "댓글 표시값", "댓글 정확 숫자", "댓글 정확도", "재생수 표시값", "재생수 정확 숫자", "재생수 정확도", "콘텐츠 URL", "상태", "메모"]]; styleHeader(performance, "A5:R5");
performance.getRange("A:A").format.columnWidth = 13; performance.getRange("B:B").format.columnWidth = 14; performance.getRange("C:C").format.columnWidth = 22; performance.getRange("D:D").format.columnWidth = 12; performance.getRange("E:E").format.columnWidth = 20; performance.getRange("F:F").format.columnWidth = 16; performance.getRange("G:O").format.columnWidth = 17; performance.getRange("P:P").format.columnWidth = 42; performance.getRange("Q:Q").format.columnWidth = 16; performance.getRange("R:R").format.columnWidth = 46; performance.freezePanes.freezeRows(5);

// 스토리 관측
stories.mergeCells("A1:I1"); stories.getRange("A1").values = [["공개 스토리 관측"]]; stories.getRange("A1:I1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
stories.mergeCells("A2:I2"); stories.getRange("A2").values = [["로그인하지 않은 일반 방문자에게 보이는 활성 스토리 표시만 기록합니다. 스토리 수·조회수·도달은 공개값이 아니므로 수집하지 않습니다."]]; stories.getRange("A2:I2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
stories.getRange("A5:I5").values = [["수집일", "수집 시각(KST)", "실행 ID", "의원", "핸들", "활성 스토리 관측", "프로필 URL", "상태", "메모"]]; styleHeader(stories, "A5:I5");
stories.getRange(`A6:I${storyRows.length + 5}`).values = storyRows; bodyStyle(stories, `A6:I${storyRows.length + 5}`); addBandedRows(stories, `A6:I${storyRows.length + 5}`); stories.getRange(`A6:A${storyRows.length + 5}`).format.numberFormat = "yyyy-mm-dd";
stories.getRange("A:A").format.columnWidth = 13; stories.getRange("B:B").format.columnWidth = 14; stories.getRange("C:C").format.columnWidth = 22; stories.getRange("D:D").format.columnWidth = 12; stories.getRange("E:E").format.columnWidth = 20; stories.getRange("F:F").format.columnWidth = 18; stories.getRange("G:G").format.columnWidth = 38; stories.getRange("H:H").format.columnWidth = 14; stories.getRange("I:I").format.columnWidth = 42; stories.getRange(`A6:I${storyRows.length + 5}`).format.rowHeight = 26; stories.freezePanes.freezeRows(5); stories.tables.add(`A5:I${storyRows.length + 5}`, true, "InstagramStorySnapshotsV2");

// 수집 실행 로그
logs.mergeCells("A1:L1"); logs.getRange("A1").values = [["수집 실행 로그"]]; logs.getRange("A1:L1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
logs.mergeCells("A2:L2"); logs.getRange("A2").values = [["실행 단위의 범위·성공률·상세 확인량을 남깁니다. 기준 미달 실행은 기존 데이터에 덮어쓰지 않습니다."]]; logs.getRange("A2:L2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
logs.getRange("A5:L5").values = [["실행 ID", "수집일", "수집 시각(KST)", "실행 유형", "대상 계정", "프로필 확인", "프로필 오류", "상세 확인", "당일 확정 게시", "실행 상태", "데이터 품질", "메모"]]; styleHeader(logs, "A5:L5");
logs.getRange("A6:L6").values = [[baselineRunId, new Date("2026-08-22T00:00:00Z"), "01:19–03:37", "초기 기준선 이관", accountRows.length, confirmed, failed, 0, 0, "완료", "기준선용", "기존 전체 수집 목록을 이관함. 콘텐츠 상세·성과·반올림 원문은 재수집 필요"]]; bodyStyle(logs, "A6:L6"); logs.getRange("B6").format.numberFormat = "yyyy-mm-dd";
logs.getRange("A:A").format.columnWidth = 22; logs.getRange("B:B").format.columnWidth = 13; logs.getRange("C:C").format.columnWidth = 16; logs.getRange("D:D").format.columnWidth = 18; logs.getRange("E:I").format.columnWidth = 14; logs.getRange("J:K").format.columnWidth = 16; logs.getRange("L:L").format.columnWidth = 64; logs.getRange("A6:L6").format.rowHeight = 36; logs.freezePanes.freezeRows(5); logs.tables.add("A5:L6", true, "InstagramRunLogV2");

// 수집 규칙
rules.mergeCells("A1:D1"); rules.getRange("A1").values = [["수집 기준과 품질 규칙"]]; rules.getRange("A1:D1").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF", size: 16 }, verticalAlignment: "center" };
rules.mergeCells("A2:D2"); rules.getRange("A2").values = [["모든 판단은 일반 공개 화면에서 확인 가능한 값에 한정합니다. 보이지 않는 값은 추정하거나 0으로 대체하지 않습니다."]]; rules.getRange("A2:D2").format = { fill: colors.blueSoft, font: { color: colors.muted, size: 10 }, verticalAlignment: "center", wrapText: true };
rules.getRange("A5:D5").values = [["항목", "기준", "기록 위치", "처리 원칙"]]; styleHeader(rules, "A5:D5");
rules.getRange("A6:D12").values = [
  ["대상", "국회 SNS 공개 목록에 등록된 인스타그램 계정", "계정 목록", "계정 주소 오류·접속 제한은 오류 사유를 남김"],
  ["프로필 수치", "프로필 원문 표시값과 정확도를 별도로 기록", "프로필 스냅샷", "K/M·원문 미보존 값은 정확 숫자·증감 계산에서 제외"],
  ["최초 발견", "콘텐츠 ID를 처음 수집한 시각", "콘텐츠 기록", "게시일과 혼동하지 않음"],
  ["당일 신규", "실제 게시일(KST)=수집일이며 게시 시각 확인 완료", "콘텐츠 기록", "상세 페이지 게시 시각 미확인 시 ‘미확인’"],
  ["콘텐츠 성과", "상세 페이지에 공개된 좋아요·댓글·재생수", "콘텐츠 성과 스냅샷", "비공개·미노출 값은 빈값으로 기록"],
  ["초기 기준선", "기존에 목록화된 콘텐츠", "콘텐츠 기록", "성과·신규 집계에서 제외하고 상세 재수집 대상으로 유지"],
  ["실행 검증", "프로필 확인률·상세 확인 수·오류 사유 기록", "수집 실행 로그", "기준 미달 실행은 엑셀 최신값을 덮어쓰지 않음"],
]; bodyStyle(rules, "A6:D12"); addBandedRows(rules, "A6:D12"); rules.getRange("A:A").format.columnWidth = 18; rules.getRange("B:B").format.columnWidth = 46; rules.getRange("C:C").format.columnWidth = 24; rules.getRange("D:D").format.columnWidth = 52; rules.getRange("A6:D12").format.rowHeight = 38; rules.freezePanes.freezeRows(5);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ sourcePath, outputPath, accounts: accountRows.length, profileSnapshots: followerRows.length, baselineContents: contentRows.length, stories: storyRows.length, confirmed, failed }, null, 2));

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = process.argv[2] ?? path.join(rootDir, "docs", "통계", "국회의원_인스타그램_일일성과_추적.xlsx");
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const previewDir = await fs.mkdtemp(path.join(os.tmpdir(), "instagram-tracker-preview-"));
const sheetRanges = {
  "요약": "A1:L16",
  "계정 목록": "A1:S25",
  "프로필 스냅샷": "A1:N25",
  "콘텐츠 기록": "A1:V25",
  "콘텐츠 성과 스냅샷": "A1:R20",
  "스토리 관측": "A1:I25",
  "수집 실행 로그": "A1:L12",
  "수집 규칙": "A1:D12",
};

const summaryCheck = await workbook.inspect({ kind: "table", range: "요약!A1:L16", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 12 });
const errorCheck = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
for (const [sheetName, range] of Object.entries(sheetRanges)) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(previewDir, `${sheetName}.png`), new Uint8Array(await preview.arrayBuffer()));
}

console.log(JSON.stringify({ previewDir, summary: summaryCheck.ndjson, formulaErrors: errorCheck.ndjson }, null, 2));

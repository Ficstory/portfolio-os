import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(rootDir, "docs", "통계", "국회의원_인스타그램_일일성과_추적.xlsx");
const outputPath = process.argv[2] ?? path.join(os.tmpdir(), "instagram-browser-plan.json");
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const sheet = workbook.worksheets.getItem("계정 목록");
const rows = sheet.getUsedRange().values.slice(5);
const accounts = rows
  .map((row) => ({ name: String(row[0] ?? "").trim(), url: String(row[2] ?? "").trim(), handle: String(row[3] ?? "").trim() }))
  .filter((account) => account.name && account.url && account.handle);
await fs.writeFile(outputPath, JSON.stringify({ accounts }, null, 2), "utf8");
console.log(JSON.stringify({ outputPath, accounts: accounts.length }));

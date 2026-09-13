import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const input = process.argv[2];
if (!input) throw new Error("Usage: node scripts/prepare-pm1-character.mjs <approved PNG>");
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
const original = await readFile(input);
const metadata = await sharp(original).metadata();
const archive = path.resolve("docs/pm1-assets/jaeho-character-original.png");
const outputDirectory = path.resolve("public/pm1/character");
const reportDirectory = path.resolve(".codex_tmp/pm1-fix-2026-09-14");
await mkdir(path.dirname(archive), { recursive: true });
await mkdir(outputDirectory, { recursive: true });
await mkdir(reportDirectory, { recursive: true });
try {
  const existing = await readFile(archive);
  if (hash(existing) !== hash(original)) throw new Error("Archived original differs; preserve it before replacing.");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  await copyFile(input, archive);
}
const outputs = [];
for (const width of [640, 1040]) {
  const output = path.join(outputDirectory, `jaeho-${width}.webp`);
  await sharp(original)
    .resize({ width, withoutEnlargement: true, kernel: "lanczos3" })
    .webp({ quality: 94, alphaQuality: 100, effort: 6 })
    .toFile(output);
  const result = await sharp(output).metadata();
  if (metadata.hasAlpha && !result.hasAlpha) throw new Error("Character alpha channel was lost.");
  outputs.push({ file: path.relative(process.cwd(), output), width: result.width, height: result.height, hasAlpha: result.hasAlpha, bytes: (await stat(output)).size });
}
const unchanged = hash(await readFile(input)) === hash(original);
if (!unchanged) throw new Error("Original file changed during conversion.");
const report = { original: { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha, bytes: original.length, sha256: hash(original), unchanged }, outputs };
await writeFile(path.join(reportDirectory, "character-metadata.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));

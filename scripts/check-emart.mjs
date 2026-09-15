import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch {
  ({ chromium } = createRequire(path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json"))("playwright"));
}
const origin = process.argv[2] || "http://127.0.0.1:3217";
const output = process.env.EMART_QA_OUTPUT || "../qa-local";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
const report = { origin, browser: browser.version(), checks: [], errors: [], screenshots: [] };
const check = (value, label) => { assert.ok(value, label); report.checks.push(label); };
page.on("pageerror", error => report.errors.push(error.message));
async function ready(lang) {
  await page.waitForFunction(lang => document.documentElement.lang === lang, lang === "zh" ? "zh-Hans" : "ko");
  await page.getByRole("button", { name: lang === "zh" ? "中文(简体)" : "한국어", exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
}
try {
  let response = await page.goto(`${origin}/event/emart`);
  check(response.ok(), "Extensionless /event/emart opens successfully");
  await ready("ko");
  check(await page.locator("h1").innerText() === "이마트 신촌점", "Fresh visit defaults to Korean");
  check(await page.getByRole("img", { name: "이마트", exact: true }).evaluate(image => image.complete && image.naturalWidth === 121), "Official Emart logo loads");
  const storeText = await page.locator("main").innerText();
  check(storeText.includes("10:00–22:30") && storeText.includes("8만원 이상"), "Verified Sinchon hours and parking threshold");
  check(!/샘플점|시연용 예시|가상 지점|1,000원/.test(storeText), "Old fictional data and notices removed");
  await page.getByRole("button", { name: "B3", exact: true }).click();
  await page.getByRole("link", { name: "주차 안내", exact: true }).click();
  const scrollBefore = await page.evaluate(() => scrollY);
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.getByRole("button", { name: "中文(简体)", exact: true }).click();
  await ready("zh");
  check(await page.locator("h1").innerText() === "易买得新村店", "Chinese store name");
  check(await page.getByRole("button", { name: "B3", exact: true }).getAttribute("aria-pressed") === "true", "Language switch preserves selected floor");
  check(await page.evaluate(() => performance.timeOrigin) === timeOrigin, "Language switch does not reload");
  check(Math.abs(await page.evaluate(() => scrollY) - scrollBefore) < 4, "Language switch preserves scroll position");
  await page.reload(); await ready("zh");
  check(await page.locator("h1").innerText() === "易买得新村店", "Reload remembers selected language");
  await page.goto(`${origin}/`);
  await page.goto(`${origin}/event/emart/`); await ready("zh");
  check(await page.locator("h1").innerText() === "易买得新村店", "Return visit remembers selected language");
  await page.goto(`${origin}/event/emart/?lang=ko`); await ready("ko");
  check(await page.locator("h1").innerText() === "이마트 신촌점", "URL ko overrides stored zh");
  await page.getByRole("button", { name: "한국어", exact: true }).click();
  await page.goto(`${origin}/event/emart/?lang=zh`); await ready("zh");
  check(await page.locator("h1").innerText() === "易买得新村店", "URL zh overrides stored ko");
  await page.getByRole("button", { name: "한국어", exact: true }).click();
  check(new URL(page.url()).searchParams.get("lang") === "ko", "Manual choice updates explicit URL language");
  for (const language of ["ko", "zh"]) {
    await page.goto(`${origin}/event/emart/?lang=${language}`); await ready(language);
    const zoneLinks = page.getByRole("group", { name: language === "ko" ? "행사 공간 바로가기" : "活动区域快捷入口", exact: true });
    await zoneLinks.getByRole("button", { name: /B3/ }).click();
    check((await page.locator("#emart-floor-panel").innerText()).includes(language === "ko" ? "K 팔레트" : "K Palette"), `${language} B3 K Palette shortcut`);
    await zoneLinks.getByRole("button", { name: /B1/ }).click();
    check((await page.locator("#emart-floor-panel").innerText()).includes(language === "ko" ? "패킹존" : "打包整理区"), `${language} B1 packing zone shortcut`);
    check(await page.getByRole("link", { name: language === "ko" ? /수유실 문의/ : /母婴室咨询/ }).getAttribute("href") === "tel:0262881234", `${language} unverified nursery points to store inquiry`);
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      for (const floor of ["B1", "B2", "B3"]) {
        await page.getByRole("button", { name: floor, exact: true }).click();
        check((await page.locator("#emart-floor-panel").innerText()).startsWith(floor), `${language} ${width}px ${floor} panel updates`);
        const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, overflowing: [...document.querySelectorAll("#emart-top *")].filter(e => e.getBoundingClientRect().right > innerWidth + 1 || e.getBoundingClientRect().left < -1).map(e => e.tagName) }));
        check(overflow.scroll <= overflow.width && overflow.overflowing.length === 0, `${language} ${width}px ${floor} no horizontal overflow`);
      }
      if (width === 390) {
        await page.getByRole("button", { name: "B1", exact: true }).click();
        await page.getByRole("link", { name: language === "ko" ? "맨 위로" : "返回顶部", exact: true }).click();
        const file = `mobile-${language}.png`;
        await page.screenshot({ path: path.join(output, file), fullPage: true });
        report.screenshots.push(file);
      }
    }
    await page.getByRole("button", { name: language === "ko" ? /화장실/ : /洗手间/ }).click();
    check(await page.getByRole("button", { name: "B1", exact: true }).getAttribute("aria-pressed") === "true", `${language} facility jumps to correct floor`);
  }
  for (const route of ["/", "/pm/", "/PM/", "/PM/print/"]) {
    response = await page.goto(`${origin}${route}`);
    check(response.ok(), `Existing profile ${route} HTTP ${response.status()}`);
    check(!(await page.locator("body").innerText()).includes("이마트 신촌점"), `Existing ${route} remains separate`);
  }
  check(report.errors.length === 0, "No browser runtime errors");
} finally {
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));

import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// Production usage: node scripts/check-pm-print.mjs http://127.0.0.1:3216
// Playwright may come from the local project or the bundled Codex runtime.
const localRequire = createRequire(import.meta.url);
let playwright;
try { playwright = localRequire("playwright"); } catch {
  const bundledRequire = createRequire(path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json"));
  playwright = bundledRequire("playwright");
}
const origin = process.argv[2] || "http://127.0.0.1:3216";
const output = process.env.PM_PRINT_OUTPUT || "output/pdf";
const channel = process.env.PM_PRINT_BROWSER || "msedge";
await mkdir(path.join(output, "qa"), { recursive: true });
const browser = await playwright.chromium.launch({ channel, headless: true });
const report = { origin, browser: `${channel} ${browser.version()}`, checks: [], routes: [], errors: [] };
const check = (condition, label) => { assert.ok(condition, label); report.checks.push(label); };
const normalize = (text) => text.replace(/\s+/g, " ").trim();
// The authorized resume edit removed this exact GPA suffix; keep every other baseline character strict.
const normalizeBaselineText = (text) => normalize(text).replace(" · 평점 3.74/4.5", "");
const expected = [null, "부산이음길", "부산이음길", "부산이음길", "애낌", "애낌", "애낌", "웃지마게임", "웃지마게임", "웃지마게임", "Play Pick", "Play Pick", null];
async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await document.fonts.load('500 20px "Pm Pretendard"');
    await Promise.all([...document.querySelectorAll("[data-pm-print] img")].map(image => image.decode()));
  });
}
try {
  let reference;
  for (const [route, filename] of [["/PM/", "lee-jaeho-pm-portfolio.pdf"], ["/PM/print/", "lee-jaeho-pm-portfolio-preview.pdf"]]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    page.on("pageerror", error => report.errors.push(error.message));
    const response = await page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });
    check(response.status() === 200, `${route}: direct HTTP 200`);
    const source = await response.text();
    check((source.match(/data-pm-slide(?:=|\s|>)/g) || []).length === 13, `${route}: all 13 slides server-rendered`);
    await ready(page);
    check(await page.evaluate(() => window.scrollY === 0), `${route}: print prepared without scrolling`);
    if (route === "/PM/") {
      check(!(await page.locator("[data-pm-print]").isVisible()), "normal screen hides the print deck");
      const main = page.locator("#pm-content");
      const before = await main.evaluate(element => ({ text: element.innerText, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
      try {
        const baseline = JSON.parse(await readFile(".codex_tmp/pm-print-baseline/report.json", "utf8"));
        check(normalizeBaselineText(before.text) === normalizeBaselineText(baseline.screens[0].text), "desktop main text matches pre-change baseline");
        report.desktopBaseline = {before:baseline.screens[0].height, after:before.height, width:before.width};
        if (!process.env.PM_PRINT_LAYOUT_DIAGNOSTICS) check(Math.abs(before.width - baseline.screens[0].width) < 1 && Math.abs(before.height - baseline.screens[0].height) < 1, "desktop main dimensions match pre-change baseline");
      } catch (error) { if (error.code !== "ENOENT") throw error; }
      await page.screenshot({ path: path.join(output, "qa/desktop.png") });
    } else {
      check(await page.locator("[data-pm-print]").isVisible(), "preview displays the shared deck");
      await page.screenshot({ path: path.join(output, "qa/preview.png") });
      check((await page.reload({waitUntil:"networkidle"})).status() === 200, "preview refresh HTTP 200");
      await ready(page);
    }
    await page.emulateMedia({ media: "print" });
    await ready(page);
    const slides = await page.locator("[data-pm-slide]").evaluateAll(elements => elements.map((slide) => {
      const rect = slide.getBoundingClientRect();
      const bounds = [...slide.querySelectorAll("h2,h3,p,li,dt,dd,figure,figcaption,table,footer,img")].flatMap(element => {
        const box = element.getBoundingClientRect();
        if (!box.width || !box.height) return [];
        return box.left < rect.left - 1 || box.top < rect.top - 1 || box.right > rect.right + 1 || box.bottom > rect.bottom + 1
          ? [{ tag: element.tagName, text: (element.textContent || "").slice(0, 100), x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height }] : [];
      });
      return { id: slide.id, title: slide.querySelector("h2")?.textContent, text: slide.innerText, width: rect.width, height: rect.height,
        scrollWidth: slide.scrollWidth, scrollHeight: slide.scrollHeight, bounds,
        contentBottom: slide.querySelector('[data-pm-slide-content]')?.getBoundingClientRect().bottom - rect.top,
        footerTop: slide.querySelector('footer')?.getBoundingClientRect().top - rect.top,
        images: [...slide.querySelectorAll("img")].map(image => ({src: new URL(image.src).pathname, width:image.naturalWidth, height:image.naturalHeight, loading:image.loading})),
        bodyFonts: [...slide.querySelectorAll("p,li,dd,td")].map(element => ({text: element.textContent.slice(0, 60), size: parseFloat(getComputedStyle(element).fontSize)})) };
    }));
    report.routes.push({ route, slides });
    check(slides.length === 13, `${route}: 13 DOM slides`);
    const busanText = normalize(slides.slice(1, 4).map(slide => slide.text).join(" "));
    const aekkimText = normalize(slides.slice(4, 7).map(slide => slide.text).join(" "));
    check(busanText.includes("애자일") && busanText.includes("본인 문서 변경 커밋") && /29\s*건/.test(busanText) && busanText.includes("Docs/ 기준"), `${route}: Busan agile documentation and verified commit count`);
    check(["워터폴", "팀원 이탈", "MVP", "예상", "개발 방식"].every(text => aekkimText.includes(text)), `${route}: Aekkim process change and retrospective included`);
    check(slides[4].images.length > 0 && slides[6].images.length > 0 && [...slides[4].images, ...slides[6].images].every(image => image.src !== "/pm/previews/aekkim.webp"), `${route}: Aekkim uses existing still captures instead of the video poster`);
    check(slides[4].images[0].src !== slides[6].images[0].src, `${route}: Aekkim overview and contribution use distinct matching captures`);
    check([slides[1], slides[4]].every(slide => slide.images.length === 2 && new Set(slide.images.map(image => image.src)).size === 2), `${route}: Busan and Aekkim introductions each show two distinct captures`);
    for (const [index, slide] of slides.entries()) {
      check(!expected[index] || slide.text.includes(expected[index]), `${route}: project order on page ${index+1}`);
      check(Math.abs(slide.width - 320 / 25.4 * 96) < 1 && Math.abs(slide.height - 180 / 25.4 * 96) < 1, `${route}: page ${index+1} is 320 × 180 mm`);
      if (!process.env.PM_PRINT_LAYOUT_DIAGNOSTICS) check(slide.bounds.length === 0 && slide.scrollWidth <= Math.ceil(slide.width) + 1 && slide.scrollHeight <= Math.ceil(slide.height) + 1, `${route}: page ${index+1} has no boundary overflow`);
      if (!process.env.PM_PRINT_LAYOUT_DIAGNOSTICS) check(slide.contentBottom <= slide.footerTop - 8, `${route}: page ${index+1} keeps content clear of footer`);
      check(slide.images.every(image => image.width > 0 && image.height > 0 && image.loading !== "lazy"), `${route}: page ${index+1} images loaded eagerly`);
    }
    check(await page.locator("[data-pm-print] button,[data-pm-print] video,[data-pm-print] nav").count() === 0, `${route}: no player or navigation controls in deck`);
    const visibleChrome = await page.locator('a[href="#pm-content"], header nav, [data-pm-print-toolbar]').evaluateAll(elements => elements.filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== "hidden").map(element => element.textContent));
    check(visibleChrome.length === 0, `${route}: web navigation and skip link hidden in print`);
    const text = slides.map(slide => normalize(slide.text));
    if (reference) check(JSON.stringify(text) === JSON.stringify(reference), "both print routes have identical content and order");
    reference = text;
    await page.pdf({ path: path.join(output, filename), preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, scale: 1 });
    await page.emulateMedia({ media: "screen" });
    if (route === "/PM/") {
      check(await page.locator("#pm-content").isVisible(), "home restores after leaving print media");
      check(!(await page.locator("[data-pm-print]").isVisible()), "deck hides again after leaving print media");
      await page.bringToFront();
      const skip = page.locator('a[href="#pm-content"]').first();
      await skip.focus();
      await page.waitForFunction(() => {
        const element = document.querySelector('a[href="#pm-content"]');
        return element === document.activeElement && element.getBoundingClientRect().top >= 0;
      });
      report.skipFocus = await skip.evaluate(element => ({active:document.activeElement?.tagName,top:element.getBoundingClientRect().top,transform:getComputedStyle(element).transform,display:getComputedStyle(element).display}));
      await page.screenshot({path:path.join(output,"qa/skip-focus.png")});
      check(await skip.evaluate(element => document.activeElement === element && element.getBoundingClientRect().top >= 0), "keyboard skip link remains available on web");
      await skip.press("Enter");
      check(await page.locator("#pm-content").evaluate(element => document.activeElement === element), "skip link moves focus to main");
    }
    await page.close();
  }
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await mobile.goto(new URL("/PM/", origin).href, {waitUntil:"networkidle"});
  await ready(mobile);
  check(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "ordinary mobile page has no horizontal overflow");
  try {
    const baseline = JSON.parse(await readFile(".codex_tmp/pm-print-baseline/report.json", "utf8"));
    const main = await mobile.locator("#pm-content").evaluate(element => ({text:element.innerText,height:element.getBoundingClientRect().height}));
    report.mobileBaseline = {before:baseline.screens[1].height,after:main.height};
    if (!process.env.PM_PRINT_LAYOUT_DIAGNOSTICS) check(normalizeBaselineText(main.text) === normalizeBaselineText(baseline.screens[1].text) && Math.abs(main.height-baseline.screens[1].height) < 1, "mobile main content and dimensions match baseline");
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  await mobile.screenshot({path:path.join(output,"qa/mobile.png")});
  const menu = mobile.locator('summary[aria-label="메뉴"]');
  await menu.click();
  check(await mobile.getByRole("link", {name:"인쇄 미리보기", exact:true}).last().isVisible(), "mobile menu exposes print preview");
  await menu.press("Escape");
  check(!(await menu.locator("..").evaluate(element => element.open)), "mobile menu Escape closes menu");
  await mobile.close();
  for (const [route, status] of [["/PM/Print/",404],["/PM/unknown/",404],["/pm/",200], ...["smile-game","aekkim","busan-eumgil","play-pick"].map(slug => [`/PM/${slug}/`,200])]) {
    const response = await fetch(new URL(route,origin));
    check(response.status === status, `${route}: HTTP ${status}`);
    await response.body?.cancel();
  }
  check(report.errors.length === 0, "no browser runtime errors");
  report.diagnosticOnly = Boolean(process.env.PM_PRINT_LAYOUT_DIAGNOSTICS);
  console.log(`${report.diagnosticOnly ? 'DIAGNOSTIC RUN (bounds/baseline assertions skipped)' : 'PASS'}: ${report.checks.length} checks; ${report.browser}; PDFs: ${output}`);
} catch(error) {
  report.failure = error.stack;
  throw error;
} finally {
  await writeFile(path.join(output,"qa/dom-report.json"), JSON.stringify(report,null,2));
  await browser.close();
}

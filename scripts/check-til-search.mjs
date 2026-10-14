import assert from "node:assert/strict";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

// Run against a running dev or production server: node scripts/check-til-search.mjs [origin]
const localRequire = createRequire(import.meta.url);
let playwright;
try { playwright = localRequire("playwright"); } catch {
  const bundledRequire = createRequire(path.join(os.homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json"));
  playwright = bundledRequire("playwright");
}
const origin = process.argv[2] || "http://127.0.0.1:3000";
const browser = await playwright.chromium.launch({ channel: process.env.TIL_TEST_BROWSER || "msedge", headless: true });
const errors = [];

try {
  for (const viewport of [{ width: 1920, height: 940 }, { width: 390, height: 844 }]) {
    for (const route of ["/TIL/", "/til/future-dream/"]) {
      const page = await browser.newPage({ viewport });
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const archiveLink = page.getByRole("link", { name: "TIL 기록으로 건너뛰기", exact: true });
      await archiveLink.focus();
      await archiveLink.press("Enter");
      const input = page.getByRole("searchbox", { name: "기록 검색" });
      const rows = page.getByRole("list", { name: "날짜별 TIL 기록" }).getByRole("listitem");
      await input.click();
      const startY = await page.evaluate(() => window.scrollY);
      const count = await rows.count();
      assert.ok(count > 1, "fixture has multiple published entries");
      const historyLength = await page.evaluate(() => history.length);
      const requests = [];
      page.on("request", request => {
        const url = new URL(request.url());
        if (url.pathname === route && (url.searchParams.has("_rsc") || request.resourceType() === "document")) requests.push(url.href);
      });
      const stable = async label => {
        const state = await input.evaluate(element => ({ focused: document.activeElement === element, y: window.scrollY }));
        assert.ok(state.focused, `${label}: search keeps keyboard focus`);
        assert.ok(Math.abs(state.y - startY) <= 1, `${label}: scroll moved from ${startY} to ${state.y}`);
      };
      const queryIs = async query => {
        await page.waitForFunction(query => (new URL(location.href).searchParams.get("q") ?? "") === query, query);
        await page.waitForTimeout(100);
      };

      await input.dispatchEvent("compositionstart");
      for (const text of ["ㅇ", "이", "이맡"]) {
        await input.fill(text);
        await page.waitForTimeout(300);
        assert.equal(await rows.count(), count, "incomplete Korean composition must not filter the list");
        assert.equal(new URL(page.url()).searchParams.get("q"), null, "composition does not change the URL");
        await stable(text);
      }
      await input.fill("이마트24");
      await input.dispatchEvent("compositionend", { data: "이마트24" });
      await queryIs("이마트24");
      assert.equal(await rows.count(), 1);
      await stable("completed Korean query");

      for (const text of ["no-matching-til-987654", "이마트", ""]) {
        await input.fill(text);
        await queryIs(text);
        await stable(text || "clear search");
        assert.equal(await rows.count(), text.startsWith("no-matching") ? 0 : count);
      }
      await input.press("Enter");
      await stable("Enter");
      assert.equal(new URL(page.url()).pathname, route);
      assert.equal(new URL(page.url()).hash, "#archive", "search preserves the archive anchor");
      assert.equal(await page.evaluate(() => history.length), historyLength, "typing does not add history entries");
      assert.deepEqual(requests, [], "search does not initiate page navigation or server component requests");

      await page.getByRole("button", { name: "교육", exact: true }).click();
      await page.waitForFunction(() => new URL(location.href).searchParams.get("category") === "education");
      assert.equal(await rows.count(), 1);
      await input.fill("이마트24");
      // Open a result before the debounce runs; it must cancel the pending search.
      await rows.first().getByRole("button").click();
      await page.getByRole("heading", { level: 1, name: /이마트24/ }).waitFor();
      await page.waitForTimeout(400);
      const articleURL = page.url();
      assert.equal(new URL(articleURL).searchParams.get("q"), "이마트24");
      assert.ok(new URL(articleURL).searchParams.has("entry"));
      await page.goBack();
      await input.waitFor();
      assert.equal(await input.inputValue(), "");
      assert.equal(new URL(page.url()).searchParams.get("category"), "education");
      await page.goForward();
      await page.getByRole("heading", { level: 1, name: /이마트24/ }).waitFor();
      assert.equal(page.url(), articleURL);
      await page.getByRole("link", { name: "TIL 목록", exact: true }).click();
      await input.waitFor();
      assert.equal(await input.inputValue(), "이마트24");
      assert.equal(await rows.count(), 1);
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await input.inputValue(), "이마트24", "reload restores the shared query");
      assert.equal(await rows.count(), 1);
      console.log(`PASS ${route} ${viewport.width}×${viewport.height}: Korean composition, scroll, focus, empty/clear search, URL, category, reader, history, reload`);
      await page.close();
    }
  }
  assert.deepEqual(errors, [], "no browser runtime errors");
} finally {
  await browser.close();
}

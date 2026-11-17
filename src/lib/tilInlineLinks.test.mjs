import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parseTILInlineLinks } from "./tilInlineLinks.ts";

test("source links preserve Korean labels, surrounding text and multiple URLs", () => {
  assert.deepEqual(parseTILInlineLinks("근거. [배민](https://bcut.baemin.com/3529/), [Google](https://support.google.com/glass?hl=en)."), [
    { text: "근거. " }, { text: "배민", href: "https://bcut.baemin.com/3529/" },
    { text: ", " }, { text: "Google", href: "https://support.google.com/glass?hl=en" }, { text: "." },
  ]);
});

test("plain text, malformed links and executable protocols never become anchors", () => {
  for (const text of ["기존 문단 [자료 7]", "[x](javascript:alert(1))", "[x](data:text/html,test)", "[x](https://)", "[미완성](https://example.com", "[x](/relative)"]) {
    assert.deepEqual(parseTILInlineLinks(text), [{ text }]);
  }
});

test("PP journal keeps all source links in the separate resources section", () => {
  const markdown = readFileSync(new URL("../../content/til/published/ssg-pp-picking-questions.md", import.meta.url), "utf8");
  const [body, resources] = markdown.split("## 관련 자료");
  assert.doesNotMatch(markdown, /\[자료 \d/);
  const hrefs = parseTILInlineLinks(body).filter(part => part.href).map(part => part.href);
  const sources = [...resources.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(match => match[1]);
  assert.equal(sources.length, 16);
  assert.equal(new Set(sources).size, 16);
  assert.equal(hrefs.length, 0, "Source links must stay outside the narrative");
});

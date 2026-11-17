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

test("PP journal source links follow the narrative at paragraph ends", () => {
  const markdown = readFileSync(new URL("../../content/til/published/ssg-pp-picking-questions.md", import.meta.url), "utf8");
  const [body, resources] = markdown.split("## 관련 자료");
  assert.doesNotMatch(markdown, /\[자료 \d/);
  const hrefs = parseTILInlineLinks(body).filter(part => part.href).map(part => part.href);
  const sources = [...resources.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(match => match[1]);
  assert.equal(sources.length, 16);
  assert.equal(new Set(sources).size, 16);
  for (const source of sources) assert.ok(hrefs.includes(source));
  for (const line of body.split(/\r?\n/).filter(line => /\]\(https?:/.test(line))) {
    assert.match(line, /\(출처: \[.+\]\(https?:.*\)\)$/);
    assert.doesNotMatch(line.slice(0, line.indexOf("(출처:")), /\]\(https?:/);
  }
});

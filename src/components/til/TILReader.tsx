"use client";

import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type RefObject } from "react";
import { formatTILDate } from "@/lib/tilArchive";
import type { TILBlock, TILCategoryMeta, TILEntry } from "@/types/til";
import { TILMedia } from "./TILMedia";
import { navigateToTILAnchor } from "./tilNavigation";
import styles from "./til-reader.module.css";

const reflectionSections = [
  { key: "learned", label: "오늘 배운 것" },
  { key: "tried", label: "직접 시도한 것" },
  { key: "blocked", label: "막혔던 지점" },
  { key: "insights", label: "새롭게 이해한 것" },
] as const;

export function TILReader({ entry, categories, onBack, previous, next, onSelect, headingRef }: {
  entry: TILEntry;
  categories: readonly TILCategoryMeta[];
  onBack: () => void;
  previous?: TILEntry;
  next?: TILEntry;
  onSelect: (entry: TILEntry) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const sections = reflectionSections.map((section) => ({ ...section,
    blocks: (entry.blocks?.[section.key] ?? entry[section.key].map((text) => ({ type: "paragraph", text } as const)))
      .filter((block) => block.type !== "paragraph" || block.text.trim()),
  })).filter((section) => section.blocks.length > 0);
  const hasResources = entry.resources.length > 0 || entry.skills.length > 0;
  const contents = [
    ...sections.map((section) => ({ id: section.key, label: section.label })),
    ...(entry.nextActions.length ? [{ id: "next-actions", label: "다음 액션" }] : []),
    ...(hasResources ? [{ id: "resources", label: "관련 자료" }] : []),
  ];
  const readingLength = sections.reduce((length, section) => length + section.blocks.reduce((size, block) =>
    size + (block.type === "paragraph" ? block.text.length : 450), 0), 0);
  const showContents = contents.length >= 3 && readingLength >= 900;
  const contentsKey = contents.map((item) => item.id).join("|");
  const [activeSection, setActiveSection] = useState(contents[0]?.id ?? "");
  useEffect(() => {
    if (!showContents) return;
    const headings = contentsKey.split("|").map((id) => ({ id, element: document.getElementById(`til-${id}`) }));
    let frame = 0;
    const update = () => {
      frame = 0;
      // Track the last heading above the reading line, including long sections
      // whose heading has already left the viewport.
      const readingLine = Math.min(160, window.innerHeight * 0.25);
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        if (heading.element && heading.element.getBoundingClientRect().top <= readingLine) current = heading.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = headings.at(-1)?.id ?? current;
      }
      setActiveSection(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    const article = headings[0]?.element?.closest("article");
    if (article) observer.observe(article);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [contentsKey, showContents]);
  const category = categories.find((item) => item.id === entry.category);
  const contentsLinks = <ol>{contents.map((item, index) => <li key={item.id}>
    <a href={`#til-${item.id}`} onClick={(event) => navigateToTILAnchor(event, `til-${item.id}`)}
      aria-current={activeSection === item.id ? "location" : undefined}>
      <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
    </a>
  </li>)}</ol>;

  return (
    <>
      <header className={styles.readerNav}>
        <button type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" /> TIL 목록</button>
        <span>LEARNING IN PUBLIC</span>
        <Link href="/">Portfolio <ArrowRight size={14} aria-hidden="true" /></Link>
      </header>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.metadata}>
            <time dateTime={entry.date}>{formatTILDate(entry.date)}</time>
            {entry.session ? <span>{entry.session}</span> : null}
            {category ? <span>{category.label}</span> : null}
            {entry.isDemo ? <span>샘플 기록</span> : null}
          </div>
          <h1 ref={headingRef} tabIndex={-1} id="til-reader-title">{entry.title}</h1>
          <p className={styles.summary}>{entry.summary}</p>
        </header>
        {showContents ? <div className={styles.contents}>
          <nav className={styles.desktopContents} aria-label="이 글의 목차"><p>이 글의 순서</p>{contentsLinks}</nav>
          <details className={styles.mobileContents}>
            <summary>이 글의 목차 <span>{contents.find((item) => item.id === activeSection)?.label ?? `${contents.length}개 섹션`} <ChevronDown size={16} aria-hidden="true" /></span></summary>
            <nav aria-label="이 글의 목차">{contentsLinks}</nav>
          </details>
        </div> : null}
        <div className={styles.body}>
          {sections.map((section, index) => (
            <section className={styles.section} key={section.key} aria-labelledby={`til-${section.key}`}>
              <h2 id={`til-${section.key}`} tabIndex={-1}><span>{String(index + 1).padStart(2, "0")}</span>{section.label}</h2>
              {section.blocks.map((block: TILBlock, blockIndex: number) => block.type === "paragraph"
                ? <p key={blockIndex}>{block.text}</p>
                : <TILMedia key={blockIndex} block={block} />)}
            </section>
          ))}
          {entry.nextActions.length ? <section className={styles.section} aria-labelledby="til-next-actions">
            <h2 id="til-next-actions" tabIndex={-1}>다음 액션</h2>
            <ul className={styles.actions}>{entry.nextActions.map((action) => <li key={action.id}>
              <span className={styles.actionStatus} data-status={action.status} aria-label={action.status === "done" ? "완료" : "계획"}>
                {action.status === "done" ? <Check size={13} aria-hidden="true" /> : null}
              </span><span>{action.text}</span>
            </li>)}</ul>
          </section> : null}
          {hasResources ? <section className={styles.section} aria-labelledby="til-resources">
            <h2 id="til-resources" tabIndex={-1}>관련 자료</h2>
            {entry.skills.length ? <ul className={styles.skills} aria-label="관련 역량">{entry.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul> : null}
            {entry.resources.length ? <ul className={styles.resources}>{entry.resources.map((resource) => <li key={resource.id}>
              <a href={resource.href}>{resource.title}<ArrowRight size={15} aria-hidden="true" /></a>
              {resource.description ? <p>{resource.description}</p> : null}
            </li>)}</ul> : null}
          </section> : null}
        </div>
        <footer className={styles.articleFooter}>
          <p>오늘의 배움을 다음의 시도로.</p>
          <nav aria-label="TIL 글 이동" className={styles.entryNavigation}>
            {previous ? <button type="button" onClick={() => onSelect(previous)}><span><ArrowLeft size={15} aria-hidden="true" /> 이전 글</span><strong>{previous.title}</strong></button> : <div />}
            {next ? <button type="button" onClick={() => onSelect(next)}><span>다음 글 <ArrowRight size={15} aria-hidden="true" /></span><strong>{next.title}</strong></button> : <div />}
          </nav>
          <button type="button" className={styles.backToList} onClick={onBack}>TIL 목록으로 돌아가기</button>
        </footer>
      </article>
    </>
  );
}

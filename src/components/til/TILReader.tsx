"use client";

import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpToLine, Check, ChevronDown, List } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { formatTILDate } from "@/lib/tilArchive";
import { parseTILInlineLinks } from "@/lib/tilInlineLinks";
import type { TILBlock, TILCategoryMeta, TILEntry } from "@/types/til";
import { TILMedia } from "./TILMedia";
import { StoreAnalysis } from "./StoreAnalysis";
import { JournalChart } from "./JournalChart";
import { EvidenceSection } from "./EvidenceSection";
import { navigateToTILAnchor, pmPortfolioUrl } from "./tilNavigation";
import styles from "./til-reader.module.css";

const reflectionSections = [
  { key: "learned", label: "오늘 배운 것" },
  { key: "tried", label: "직접 시도한 것" },
  { key: "blocked", label: "막혔던 지점" },
  { key: "insights", label: "새롭게 이해한 것" },
] as const;

export function TILReader({ entry, categories, listHref, previous, next, onSelect, headingRef }: {
  entry: TILEntry;
  categories: readonly TILCategoryMeta[];
  listHref: string;
  previous?: TILEntry;
  next?: TILEntry;
  onSelect: (entry: TILEntry) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const isJournal = entry.format === "journal";
  const isPickingEvidence = isJournal && entry.slug === "ssg-pp-voice-picking";
  const isEvidenceJournal = isPickingEvidence || (isJournal && entry.slug === "yellowtail-futomaki-prototype");
  const sections: { key: string; label?: string; blocks: TILBlock[] }[] = isJournal
    ? (entry.journal ?? []).map((section, index) => ({ key: section.anchor ?? `journal-${index}`, label: section.heading, blocks: section.blocks }))
    : reflectionSections.map((section) => ({ ...section,
    blocks: (entry.blocks?.[section.key] ?? entry[section.key].map((text) => ({ type: "paragraph", text } as const)))
      .filter((block) => block.type !== "paragraph" || block.text.trim()),
  })).filter((section) => section.blocks.length > 0);
  const hasResources = entry.resources.length > 0 || entry.skills.length > 0;
  const contents = [
    ...sections.flatMap((section) => section.label ? [{ id: section.key, label: section.label }] : []),
    ...(entry.nextActions.length ? [{ id: "next-actions", label: isJournal ? "다음에 해볼 것" : "다음 액션" }] : []),
    ...(hasResources ? [{ id: "resources", label: "관련 자료" }] : []),
  ];
  const contentsKey = contents.map((item) => item.id).join("|");
  const [activeSection, setActiveSection] = useState(contents[0]?.id ?? "");
  const [contentsOpen, setContentsOpen] = useState(false);
  const contentsToggleRef = useRef<HTMLButtonElement>(null);
  const contentsListRef = useRef<HTMLOListElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!contentsKey) return;
    const headings = contentsKey.split("|").map((id) => ({ id, element: document.getElementById(`til-${id}`) }));
    let frame = 0;
    const update = () => {
      frame = 0;
      // Track the last heading above the reading line, including long sections
      // whose heading has already left the viewport.
      const readingLine = Math.max(96, Math.min(160, window.innerHeight * 0.25));
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        if (heading.element && heading.element.getBoundingClientRect().top <= readingLine) current = heading.id;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
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
  }, [contentsKey]);

  useEffect(() => {
    const list = contentsListRef.current;
    const current = list?.querySelector('[aria-current="location"]');
    if (!list || !current) return;

    const keepCurrentLinkInView = () => {
      if (!list.clientHeight) return;
      const { top, bottom } = current.getBoundingClientRect();
      const visibleTop = list.getBoundingClientRect().top + list.clientTop;
      const visibleBottom = visibleTop + list.clientHeight;
      if (top < visibleTop) list.scrollTop += top - visibleTop;
      else if (bottom > visibleBottom) list.scrollTop += bottom - visibleBottom;
    };

    keepCurrentLinkInView();
    const observer = new ResizeObserver(keepCurrentLinkInView);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeSection, contentsKey]);

  const scrollToEdge = (edge: "top" | "bottom") => {
    setContentsOpen(false);
    const target = edge === "top" ? headingRef.current : footerRef.current;
    target?.focus({ preventScroll: true });
    window.scrollTo({
      top: edge === "top" ? 0 : document.documentElement.scrollHeight,
      behavior: "instant",
    });
  };
  const category = categories.find((item) => item.id === entry.category);

  return (
    <>
      <header className={styles.readerNav}>
        <a href={listHref}><ArrowLeft size={17} aria-hidden="true" /> TIL 목록</a>
        <span>LEARNING IN PUBLIC</span>
        <a href={pmPortfolioUrl}>Portfolio <ArrowRight size={14} aria-hidden="true" /></a>
      </header>
      <article className={contents.length ? `${styles.article} ${styles.articleWithContents}` : styles.article} data-deck-evidence={isPickingEvidence || undefined}>
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
        <div className={styles.readerTools}>
          {contents.length ? (
            <nav className={styles.contents} aria-label="이 글의 목차"
              onBlur={(event) => {
                if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setContentsOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Escape" || !contentsOpen) return;
                setContentsOpen(false);
                contentsToggleRef.current?.focus();
              }}>
              <p className={styles.contentsTitle}>{isPickingEvidence ? "장표별 근거자료" : "이 글의 목차"}</p>
              <button type="button" className={styles.contentsToggle} ref={contentsToggleRef}
                aria-expanded={contentsOpen} aria-controls="til-reader-contents" onClick={() => setContentsOpen((open) => !open)}>
                <List size={17} aria-hidden="true" /> 목차 <ChevronDown size={14} aria-hidden="true" />
              </button>
              <ol id="til-reader-contents" className={styles.contentsList} ref={contentsListRef} data-open={contentsOpen}>
                {contents.map((item) => (
                  <li key={item.id}>
                    <a href={`#til-${item.id}`} aria-current={activeSection === item.id ? "location" : undefined}
                      onClick={(event) => {
                        navigateToTILAnchor(event, `til-${item.id}`);
                        if (event.defaultPrevented) setContentsOpen(false);
                      }}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div className={styles.scrollControls} role="group" aria-label="글 스크롤">
            <button type="button" onClick={() => scrollToEdge("top")}>
              <ArrowUpToLine size={16} aria-hidden="true" /> 맨 위
            </button>
            <button type="button" onClick={() => scrollToEdge("bottom")}>
              <ArrowDownToLine size={16} aria-hidden="true" /> 맨 아래
            </button>
          </div>
        </div>
        <div className={styles.body}>
          {sections.map((section, index) => (
            <section className={styles.section} key={section.key} aria-labelledby={section.label ? `til-${section.key}` : undefined} aria-label={section.label ? undefined : "본문"}>
              {section.label ? <h2 id={`til-${section.key}`} tabIndex={-1}>{isJournal ? null : <span>{String(index + 1).padStart(2, "0")}</span>}{section.label}</h2> : null}
              {entry.visualizations?.type === "journal-figures" && entry.visualizations.figures
                .filter(figure => figure.heading === section.label)
                .map(figure => <JournalChart key={figure.heading} figure={figure} />)}
              {isEvidenceJournal ? <EvidenceSection blocks={section.blocks} sectionIndex={index} /> : section.blocks.map((block: TILBlock, blockIndex: number) => block.type === "paragraph"
                ? <p key={blockIndex}>{parseTILInlineLinks(block.text).map((part, partIndex) => part.href
                  ? <a key={partIndex} href={part.href}>{part.text}</a>
                  : part.text)}</p>
                : <TILMedia key={blockIndex} block={block} />)}
              {section.key === "tried" && entry.visualizations?.type === "store-analysis" ? <StoreAnalysis data={entry.visualizations} /> : null}
            </section>
          ))}
          {isJournal && entry.visualizations?.type === "store-analysis" ? <StoreAnalysis data={entry.visualizations} /> : null}
          {entry.nextActions.length ? <section className={styles.section} aria-labelledby="til-next-actions">
            <h2 id="til-next-actions" tabIndex={-1}>{isJournal ? "다음에 해볼 것" : "다음 액션"}</h2>
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
              {resource.type === "document" && /^\/til\/media\/.*\.pdf$/i.test(resource.href) ? <>
                <strong>{resource.title}</strong>
                <div className={styles.documentLinks}>
                  <a href={resource.href} target="_blank" rel="noopener noreferrer">PDF 보기<ArrowRight size={15} aria-hidden="true" /></a>
                  <a href={resource.href} download>다운로드</a>
                </div>
              </> : <a href={resource.href}>{resource.title}<ArrowRight size={15} aria-hidden="true" /></a>}
              {resource.description ? <p>{resource.description}</p> : null}
            </li>)}</ul> : null}
          </section> : null}
        </div>
        <footer className={styles.articleFooter} ref={footerRef} tabIndex={-1}>
          {isEvidenceJournal ? null : <p>오늘의 배움을 다음의 시도로.</p>}
          <nav aria-label="TIL 글 이동" className={styles.entryNavigation}>
            {previous ? <button type="button" onClick={() => onSelect(previous)}><span><ArrowLeft size={15} aria-hidden="true" /> 이전 글</span><strong>{previous.title}</strong></button> : <div />}
            {next ? <button type="button" onClick={() => onSelect(next)}><span>다음 글 <ArrowRight size={15} aria-hidden="true" /></span><strong>{next.title}</strong></button> : <div />}
          </nav>
          <a href={listHref} className={styles.backToList}>TIL 목록으로 돌아가기</a>
        </footer>
      </article>
    </>
  );
}

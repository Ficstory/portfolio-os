"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CompositionEvent,
} from "react";

import { links } from "@/data/links";
import {
  filterTILEntries,
  formatTILDate,
  normalizeTILSearch,
  resolveSelectedTILEntry,
  type TILCategoryFilter,
} from "@/lib/tilArchive";
import type {
  AcademyJourney,
  TILCategory,
  TILCategoryMeta,
  TILEntry,
} from "@/types/til";

import styles from "./future-dream-til.module.css";

const reflectionSections = [
  { key: "learned", label: "오늘 배운 것", Icon: BookOpen },
  { key: "tried", label: "직접 시도한 것", Icon: FlaskConical },
  { key: "blocked", label: "막혔던 지점", Icon: AlertTriangle },
  { key: "insights", label: "새롭게 이해한 것", Icon: Lightbulb },
] as const;

function createArchiveSearch(
  category: TILCategoryFilter,
  query: string,
  entrySlug: string | null,
) {
  const params = new URLSearchParams();
  const normalizedQuery = query.trim();

  if (category !== "all") {
    params.set("category", category);
  }

  if (normalizedQuery) {
    params.set("q", normalizedQuery);
  }

  if (entrySlug) {
    params.set("entry", entrySlug);
  }

  return params.toString();
}

function NotebookVisual() {
  return (
    <div aria-hidden="true" className={styles.notebookVisual}>
      <div className={styles.notebookShadow} />
      <div className={styles.notebook}>
        <div className={styles.notebookPage}>
          <p className={styles.handwritingEnglish}>
            Better Questions,
            <br />
            Brighter Tomorrow.
          </p>
          <span className={styles.redStroke} />
        </div>
        <div className={styles.notebookSpine} />
        <div className={styles.notebookPage}>
          <p className={styles.handwritingKorean}>
            배움이
            <br />
            오늘의 나를 만든다.
          </p>
          <span className={styles.pencilMark}>—</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        <Link className={styles.portfolioLabel} href="/">
          MY PORTFOLIO
        </Link>
        <p className={styles.sidebarNote}>
          Learning today,
          <br />a better me tomorrow.
        </p>
      </div>

      <nav aria-label="TIL 페이지 섹션" className={styles.sidebarNav}>
        <Link href="/">
          <span>01</span>
          About Me
        </Link>
        <a href="#academy">
          <span>02</span>
          Future &amp; Dream Academy
        </a>
        <a aria-current="page" className={styles.sidebarActive} href="#archive">
          <span>03</span>
          TIL Archive
        </a>
        <Link href="/pm/">
          <span>04</span>
          Projects
        </Link>
        <a href={links.email}>
          <span>05</span>
          Contact
        </a>
      </nav>

      <p className={styles.sidebarKeywords}>
        PEOPLE
        <br />
        IDEAS
        <br />
        EXPERIENCE
        <br />
        GROWTH
      </p>
    </aside>
  );
}

function TopNavigation() {
  return (
    <header className={styles.topNavigation}>
      <Link href="/">About</Link>
      <a aria-current="page" className={styles.topActive} href="#archive">
        TIL
      </a>
      <Link href="/pm/">Projects</Link>
      <a href="#academy">Academy</a>
      <a href={links.email}>Contact</a>
      <p>
        A SMALL STEP
        <br />A BIGGER TOMORROW
      </p>
    </header>
  );
}

function Hero({ journey }: { journey: AcademyJourney }) {
  const progress = journey.progress;
  const progressValue = progress
    ? Math.min(100, Math.max(0, (progress.current / progress.total) * 100))
    : null;

  return (
    <section className={styles.hero} id="academy">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>
          <span /> FUTURE &amp; DREAM ACADEMY <span />
        </p>
        <h1>
          TIL —<br />
          Learning in Public
        </h1>
        <p className={styles.heroSubtitle}>배우고, 시도하고, 성장한 기록</p>
        <p className={styles.heroDescription}>
          신세계 Future &amp; Dream Academy에서 배우고 관찰한 것을 기록합니다.
          작은 실험과 팀의 대화, 고민 끝에 내린 결정까지. 매일의 배움을 다음
          행동으로 연결하는 개인 학습 아카이브입니다.
        </p>

        <div className={styles.journey}>
          <BookOpen aria-hidden="true" size={29} strokeWidth={1.7} />
          <div>
            <strong>{journey.label}</strong>
            <p>{journey.status}</p>
          </div>
          {progress && progressValue !== null ? (
            <div className={styles.journeyProgress}>
              <div
                aria-label={`${progress.current} / ${progress.total} ${progress.unitLabel}`}
                aria-valuemax={progress.total}
                aria-valuemin={0}
                aria-valuenow={progress.current}
                role="progressbar"
              >
                <span style={{ width: `${progressValue}%` }} />
              </div>
              <span>
                {progress.current} / {progress.total} {progress.unitLabel}
              </span>
            </div>
          ) : (
            <span className={styles.journeyStatus}>학습 기록 중</span>
          )}
        </div>
      </div>
      <NotebookVisual />
    </section>
  );
}

function CategoryBadge({
  categories,
  category,
}: {
  categories: readonly TILCategoryMeta[];
  category: TILCategory;
}) {
  const metadata = categories.find((item) => item.id === category);

  if (!metadata) {
    return null;
  }

  return (
    <span className={styles.categoryBadge} data-tone={metadata.tone}>
      {metadata.label}
    </span>
  );
}

function EntryList({
  entries,
  categories,
  selectedEntry,
  onSelect,
}: {
  entries: readonly TILEntry[];
  categories: readonly TILCategoryMeta[];
  selectedEntry: TILEntry | null;
  onSelect: (entry: TILEntry) => void;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <ol aria-label="날짜별 TIL 기록" className={styles.entryList}>
      {entries.map((entry) => {
        const isSelected = entry.slug === selectedEntry?.slug;

        return (
          <li key={entry.id}>
            <button
              aria-current={isSelected ? "true" : undefined}
              className={styles.entryButton}
              data-selected={isSelected}
              onClick={() => onSelect(entry)}
              type="button"
            >
              <span className={styles.entryDate}>
                <time dateTime={entry.date}>{formatTILDate(entry.date)}</time>
                {entry.session ? <small>{entry.session}</small> : null}
              </span>
              <span aria-hidden="true" className={styles.timelineDot} />
              <span className={styles.entryCopy}>
                <strong>{entry.title}</strong>
                <span>{entry.summary}</span>
              </span>
              <CategoryBadge categories={categories} category={entry.category} />
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className={styles.emptyState} role="status">
      <strong>조건에 맞는 기록이 없습니다.</strong>
      <p>검색어나 카테고리를 변경해 보세요.</p>
      <button onClick={onReset} type="button">
        <RotateCcw aria-hidden="true" size={15} />
        조건 초기화
      </button>
    </div>
  );
}

function EntryDetail({
  entry,
  categories,
  hasPrevious,
  hasNext,
  onBack,
  onPrevious,
  onNext,
  headingRef,
}: {
  entry: TILEntry;
  categories: readonly TILCategoryMeta[];
  hasPrevious: boolean;
  hasNext: boolean;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <article className={styles.detailArticle}>
      <div className={styles.detailNavigation}>
        <button className={styles.mobileBack} onClick={onBack} type="button">
          <ChevronLeft aria-hidden="true" size={18} />
          목록으로
        </button>
        <div>
          <button disabled={!hasPrevious} onClick={onPrevious} type="button">
            <ChevronLeft aria-hidden="true" size={16} /> 이전 글
          </button>
          <span aria-hidden="true" />
          <button disabled={!hasNext} onClick={onNext} type="button">
            다음 글 <ChevronRight aria-hidden="true" size={16} />
          </button>
        </div>
      </div>

      <header className={styles.entryHeader}>
        <div className={styles.entryMeta}>
          <time dateTime={entry.date}>{formatTILDate(entry.date)}</time>
          {entry.session ? <span>{entry.session}</span> : null}
          {entry.isDemo ? <span>샘플 기록</span> : null}
        </div>
        <div className={styles.entryTitleRow}>
          <h2 ref={headingRef} tabIndex={-1}>
            {entry.title}
          </h2>
          <CategoryBadge categories={categories} category={entry.category} />
        </div>
        <blockquote>“ {entry.summary} ”</blockquote>
      </header>

      <div className={styles.reflectionGrid}>
        {reflectionSections.map(({ key, label, Icon }) => (
          <section key={key}>
            <div className={styles.reflectionHeading}>
              <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
              <h3>{label}</h3>
            </div>
            {entry[key].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>

      <section className={styles.nextActions}>
        <div className={styles.reflectionHeading}>
          <ArrowRight aria-hidden="true" size={22} strokeWidth={1.8} />
          <h3>다음 액션</h3>
        </div>
        <ul>
          {entry.nextActions.map((action) => (
            <li key={action.id}>
              <span
                aria-label={action.status === "done" ? "완료" : "계획"}
                className={styles.actionStatus}
                data-status={action.status}
              >
                {action.status === "done" ? (
                  <Check aria-hidden="true" size={12} strokeWidth={2.5} />
                ) : null}
              </span>
              <span>{action.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.resources}>
        <h3>관련 자료</h3>
        <div className={styles.skillList} aria-label="관련 역량">
          {entry.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
        {entry.resources.length > 0 ? (
          <ul>
            {entry.resources.map((resource) => (
              <li key={resource.id}>
                <a href={resource.href}>{resource.title}</a>
                {resource.description ? <p>{resource.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.resourcesPending}>연결할 자료를 준비 중입니다.</p>
        )}
      </section>
    </article>
  );
}

export function FutureDreamTilPage({
  categories,
  entries,
  journey,
}: {
  categories: readonly TILCategoryMeta[];
  entries: readonly TILEntry[];
  journey: AcademyJourney;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const categoryIds = useMemo(
    () => new Set<TILCategory>(categories.map((item) => item.id)),
    [categories],
  );
  const category: TILCategoryFilter =
    rawCategory !== null && categoryIds.has(rawCategory as TILCategory)
      ? (rawCategory as TILCategory)
      : "all";
  const urlQuery = searchParams.get("q") ?? "";
  const requestedSlug = searchParams.get("entry");
  const filteredEntries = useMemo(
    () => filterTILEntries(entries, category, urlQuery),
    [category, entries, urlQuery],
  );
  const selectedEntry = useMemo(
    () => resolveSelectedTILEntry(filteredEntries, requestedSlug),
    [filteredEntries, requestedSlug],
  );
  const selectedIndex = selectedEntry
    ? filteredEntries.findIndex((entry) => entry.slug === selectedEntry.slug)
    : -1;
  const [searchDraft, setSearchDraft] = useState(urlQuery);
  const [isComposing, setIsComposing] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "detail">(
    requestedSlug ? "detail" : "list",
  );
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listScrollPositionRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const detailHeadingRef = useRef<HTMLHeadingElement>(null);

  const navigateToState = (
    nextCategory: TILCategoryFilter,
    nextQuery: string,
    nextEntrySlug: string | null,
    mode: "push" | "replace",
  ) => {
    const search = createArchiveSearch(
      nextCategory,
      nextQuery,
      nextEntrySlug,
    );
    const href = search ? `${pathname}?${search}` : pathname;

    router[mode](href, { scroll: false });
  };

  useEffect(() => {
    if (
      isComposing ||
      searchDraft === urlQuery ||
      searchInputRef.current === document.activeElement
    ) {
      return;
    }

    const animationFrameId = requestAnimationFrame(() => {
      setSearchDraft(urlQuery);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [isComposing, searchDraft, urlQuery]);

  useEffect(() => {
    const desiredSearch = createArchiveSearch(
      category,
      normalizeTILSearch(urlQuery),
      selectedEntry?.slug ?? null,
    );

    if (desiredSearch !== searchParams.toString()) {
      router.replace(desiredSearch ? `${pathname}?${desiredSearch}` : pathname, {
        scroll: false,
      });
    }
  }, [category, pathname, router, searchParams, selectedEntry, urlQuery]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    },
    [],
  );

  const commitSearch = (value: string) => {
    const normalizedQuery = value.trim();
    const nextResults = filterTILEntries(
      entries,
      category,
      normalizedQuery,
    );
    const nextSelected = resolveSelectedTILEntry(
      nextResults,
      selectedEntry?.slug ?? null,
    );

    navigateToState(
      category,
      normalizedQuery,
      nextSelected?.slug ?? null,
      "replace",
    );
  };

  const scheduleSearch = (value: string) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => commitSearch(value), 240);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchDraft(value);

    if (!isComposing) {
      scheduleSearch(value);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    scheduleSearch(event.currentTarget.value);
  };

  const handleCategoryChange = (nextCategory: TILCategoryFilter) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    const nextResults = filterTILEntries(
      entries,
      nextCategory,
      searchDraft,
    );
    const nextSelected = resolveSelectedTILEntry(
      nextResults,
      selectedEntry?.slug ?? null,
    );

    navigateToState(
      nextCategory,
      searchDraft,
      nextSelected?.slug ?? null,
      "push",
    );
  };

  const focusDetailOnMobile = () => {
    requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 1023px)").matches) {
        detailHeadingRef.current?.focus({ preventScroll: true });
      }
    });
  };

  const handleSelect = (entry: TILEntry) => {
    listScrollPositionRef.current = window.scrollY;
    setMobileView("detail");
    navigateToState(category, urlQuery, entry.slug, "push");
    focusDetailOnMobile();
  };

  const handleEntryNavigation = (offset: number) => {
    const nextEntry = filteredEntries[selectedIndex + offset];

    if (!nextEntry) {
      return;
    }

    navigateToState(category, urlQuery, nextEntry.slug, "push");
    focusDetailOnMobile();
  };

  const handleBackToList = () => {
    setMobileView("list");
    requestAnimationFrame(() => {
      window.scrollTo({ top: listScrollPositionRef.current, behavior: "auto" });
    });
  };

  const handleReset = () => {
    setSearchDraft("");
    setMobileView("list");
    navigateToState("all", "", entries[0]?.slug ?? null, "push");
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const hasDemoEntries = entries.some((entry) => entry.isDemo);

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#archive">
        TIL 기록으로 건너뛰기
      </a>
      <Sidebar />
      <main className={styles.main}>
        <TopNavigation />
        <Hero journey={journey} />

        <section className={styles.archive} id="archive">
          <div className={styles.archiveHeader}>
            <div>
              <div className={styles.archiveTitleLine}>
                <h2>TIL Archive</h2>
                <p>하루의 배움이, 내일의 가능성이 된다.</p>
                {hasDemoEntries ? <span>샘플 기록</span> : null}
              </div>
            </div>
            <label className={styles.searchField}>
              <Search aria-hidden="true" size={16} strokeWidth={1.8} />
              <span className={styles.srOnly}>기록 검색</span>
              <input
                autoComplete="off"
                onChange={handleSearchChange}
                onCompositionEnd={handleCompositionEnd}
                onCompositionStart={handleCompositionStart}
                placeholder="기록 검색하기…"
                ref={searchInputRef}
                type="search"
                value={searchDraft}
              />
            </label>
          </div>

          <div className={styles.archiveBody} data-mobile-view={mobileView}>
            <div className={styles.listPanel}>
              <div aria-label="TIL 카테고리" className={styles.filters}>
                <button
                  aria-pressed={category === "all"}
                  data-active={category === "all"}
                  onClick={() => handleCategoryChange("all")}
                  type="button"
                >
                  전체
                </button>
                {categories.map((item) => (
                  <button
                    aria-pressed={category === item.id}
                    data-active={category === item.id}
                    key={item.id}
                    onClick={() => handleCategoryChange(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {entries.length === 0 ? (
                <div className={styles.emptyState} role="status">
                  <strong>아직 등록된 학습 기록이 없습니다.</strong>
                </div>
              ) : filteredEntries.length === 0 ? (
                <EmptyState onReset={handleReset} />
              ) : (
                <EntryList
                  categories={categories}
                  entries={filteredEntries}
                  onSelect={handleSelect}
                  selectedEntry={selectedEntry}
                />
              )}
            </div>

            <div className={styles.detailPanel}>
              {selectedEntry ? (
                <EntryDetail
                  categories={categories}
                  entry={selectedEntry}
                  hasNext={selectedIndex < filteredEntries.length - 1}
                  hasPrevious={selectedIndex > 0}
                  headingRef={detailHeadingRef}
                  onBack={handleBackToList}
                  onNext={() => handleEntryNavigation(1)}
                  onPrevious={() => handleEntryNavigation(-1)}
                />
              ) : (
                <EmptyState onReset={handleReset} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

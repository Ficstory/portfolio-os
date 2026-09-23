"use client";

import {
  BookOpen,
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
  type TILCategoryFilter,
} from "@/lib/tilArchive";
import type {
  AcademyJourney,
  TILCategory,
  TILCategoryMeta,
  TILEntry,
} from "@/types/til";

import styles from "./future-dream-til.module.css";
import { TILReader } from "./TILReader";
import { navigateToTILAnchor } from "./tilNavigation";

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
        <a href="#academy" onClick={(event) => navigateToTILAnchor(event, "academy")}>
          <span>02</span>
          Future &amp; Dream Academy
        </a>
        <a aria-current="page" className={styles.sidebarActive} href="#archive" onClick={(event) => navigateToTILAnchor(event, "archive")}>
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
      <a aria-current="page" className={styles.topActive} href="#archive" onClick={(event) => navigateToTILAnchor(event, "archive")}>
        TIL
      </a>
      <Link href="/pm/">Projects</Link>
      <a href="#academy" onClick={(event) => navigateToTILAnchor(event, "academy")}>Academy</a>
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
    <section className={styles.hero} id="academy" tabIndex={-1}>
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
              id={`til-entry-${entry.slug}`}
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

export function FutureDreamTilPage({ categories, entries, journey }: {
  categories: readonly TILCategoryMeta[];
  entries: readonly TILEntry[];
  journey: AcademyJourney;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const category: TILCategoryFilter = categories.some((item) => item.id === rawCategory)
    ? rawCategory! : "all";
  const urlQuery = searchParams.get("q") ?? "";
  const requestedSlug = searchParams.get("entry");
  const isReading = requestedSlug !== null;
  // A direct article URL remains valid even when its archive filters exclude it.
  const selectedEntry = entries.find((entry) => entry.slug === requestedSlug) ?? null;
  const [searchDraft, setSearchDraft] = useState(urlQuery);
  const filteredEntries = useMemo(() => filterTILEntries(entries, category, searchDraft), [entries, category, searchDraft]);
  const selectedIndex = filteredEntries.findIndex((entry) => entry.slug === requestedSlug);
  const isComposing = useRef(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const positions = useRef(new Map<string, number>());
  const listFocus = useRef(new Map<string, string>());
  const listKey = createArchiveSearch(category, urlQuery, null);
  const listHref = `${pathname}${listKey ? `?${listKey}` : ""}#archive`;
  const locationKey = searchParams.toString();
  const previousLocation = useRef(locationKey);
  const previousReading = useRef(isReading);

  const cancelSearch = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = null;
  };
  const navigate = (nextCategory: TILCategoryFilter, query: string, slug: string | null, mode: "push" | "replace" = "push") => {
    cancelSearch();
    positions.current.set(locationKey, window.scrollY);
    const search = createArchiveSearch(nextCategory, query, slug);
    router[mode](search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!isComposing.current && document.activeElement !== searchInput.current) setSearchDraft(urlQuery);
    });
    return () => cancelAnimationFrame(frame);
  }, [urlQuery]);

  useEffect(() => {
    const changed = previousLocation.current !== locationKey;
    const wasReading = previousReading.current;
    previousLocation.current = locationKey;
    previousReading.current = isReading;
    const savedPosition = positions.current.get(locationKey) ?? 0;
    let restoring = changed && (isReading || wasReading);
    const frame = requestAnimationFrame(() => {
      if (changed && (isReading || wasReading)) {
        if (isReading) headingRef.current?.focus({ preventScroll: true });
        else {
          const slug = listFocus.current.get(listKey);
          const target = slug ? document.getElementById(`til-entry-${slug}`) : document.getElementById("archive-title");
          target?.focus({ preventScroll: true });
        }
        window.scrollTo({ top: savedPosition, behavior: "instant" });
      }
      restoring = false;
    });
    const remember = () => { if (!restoring) positions.current.set(locationKey, window.scrollY); };
    window.addEventListener("scroll", remember, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", remember);
    };
  }, [locationKey, isReading, listKey]);

  useEffect(() => {
    const handleHistory = () => {
      cancelSearch();
      if (!isComposing.current) setSearchDraft(new URL(window.location.href).searchParams.get("q") ?? "");
    };
    window.addEventListener("popstate", handleHistory);
    return () => { cancelSearch(); window.removeEventListener("popstate", handleHistory); };
  }, []);

  const scheduleSearch = (value: string) => {
    cancelSearch();
    searchTimer.current = setTimeout(() => navigate(category, value, null, "replace"), 240);
  };
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchDraft(event.target.value);
    if (!isComposing.current) scheduleSearch(event.target.value);
  };
  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    scheduleSearch(event.currentTarget.value);
  };
  const handleSelect = (entry: TILEntry) => {
    // Keep the visible results and article navigation on the same query.
    isComposing.current = false;
    listFocus.current.set(createArchiveSearch(category, searchDraft, null), entry.slug);
    navigate(category, searchDraft, entry.slug);
  };
  const handleReset = () => {
    setSearchDraft("");
    navigate("all", "", null);
    searchInput.current?.focus();
  };

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href={isReading ? "#til-reader-title" : "#archive"}
        onClick={(event) => navigateToTILAnchor(event, isReading ? "til-reader-title" : "archive")}>
        {isReading ? "본문으로 건너뛰기" : "TIL 기록으로 건너뛰기"}
      </a>
      {isReading ? (
        <main className={styles.readerMain}>
          {selectedEntry ? (
            <TILReader key={selectedEntry.slug} entry={selectedEntry} categories={categories}
              headingRef={headingRef} listHref={listHref}
              previous={selectedIndex > 0 ? filteredEntries[selectedIndex - 1] : undefined}
              next={selectedIndex >= 0 ? filteredEntries[selectedIndex + 1] : undefined}
              onSelect={(entry) => navigate(category, urlQuery, entry.slug)} />
          ) : (
            <div className={styles.missingEntry}>
              <p>TIL ARCHIVE</p>
              <h1 id="til-reader-title" ref={headingRef} tabIndex={-1}>기록을 찾을 수 없습니다.</h1>
              <p>주소가 변경되었거나 공개되지 않은 기록입니다.</p>
              <a href={listHref}>TIL 목록으로 돌아가기</a>
            </div>
          )}
        </main>
      ) : (
        <>
          <Sidebar />
          <main className={styles.main}>
            <TopNavigation />
            <Hero journey={journey} />
            <section className={styles.archive} id="archive" tabIndex={-1}>
              <div className={styles.archiveHeader}>
                <div className={styles.archiveTitleLine}>
                  <h2 id="archive-title" tabIndex={-1}>TIL Archive</h2>
                  <p>하루의 배움이, 내일의 가능성이 된다.</p>
                  {entries.some((entry) => entry.isDemo) ? <span>샘플 기록</span> : null}
                </div>
                <label className={styles.searchField}>
                  <Search aria-hidden="true" size={16} />
                  <span className={styles.srOnly}>기록 검색</span>
                  <input autoComplete="off" onChange={handleSearchChange}
                    onCompositionStart={() => { isComposing.current = true; cancelSearch(); }}
                    onCompositionEnd={handleCompositionEnd}
                    placeholder="기록 검색하기…" ref={searchInput} type="search" value={searchDraft} />
                </label>
              </div>
              <div className={styles.archiveBody}>
                <div className={styles.listPanel}>
                  <div aria-label="TIL 카테고리" className={styles.filters}>
                    {[{ id: "all", label: "전체" }, ...categories].map((item) => (
                      <button aria-pressed={category === item.id} data-active={category === item.id}
                        key={item.id} onClick={() => navigate(item.id, searchDraft, null)} type="button">{item.label}</button>
                    ))}
                  </div>
                  <p className={styles.resultCount} role="status">{filteredEntries.length}개의 기록 · 기록을 선택해 이어 읽어 보세요.</p>
                  {entries.length === 0 ? <div className={styles.emptyState} role="status"><strong>아직 등록된 학습 기록이 없습니다.</strong></div>
                    : filteredEntries.length === 0 ? <EmptyState onReset={handleReset} />
                      : <EntryList categories={categories} entries={filteredEntries} onSelect={handleSelect} selectedEntry={null} />}
                </div>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
}

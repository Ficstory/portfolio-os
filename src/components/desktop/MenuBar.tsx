"use client";

import {
  Check,
  Clock,
  MonitorCog,
  Moon,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { cn } from "@/lib/cn";
import { navigationItems } from "@/data/navigation";
import { skills } from "@/data/skills";
import { usePortfolioTrack } from "@/components/portfolio/PortfolioTrackProvider";
import type { AppearanceMode, ResolvedTheme } from "@/lib/timeTheme";
import { useDesktopStore } from "@/stores/desktopStore";
import { useThemeStore } from "@/stores/themeStore";
import type { WindowId } from "@/types/portfolio";

const menuPlaceholderItems = ["Format", "Window", "Help"] as const;
const appearanceOptions: {
  mode: AppearanceMode;
  label: string;
  Icon: LucideIcon;
}[] = [
  { mode: "auto", label: "Auto", Icon: Clock },
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
];
const MAX_SEARCH_RESULTS = 7;

type SearchResult = {
  id: string;
  label: string;
  category: string;
  description: string;
  windowId: WindowId;
  windowTitle: string;
  searchText: string;
};

type MenuBarProps = {
  now: Date;
  resolvedTheme: ResolvedTheme;
};

function getThemeLabel(theme: ResolvedTheme) {
  return theme === "light" ? "Light" : "Dark";
}

function getAppearanceLabel(
  appearanceMode: AppearanceMode,
  resolvedTheme: ResolvedTheme,
) {
  if (appearanceMode === "auto") {
    return `Appearance: Auto (${getThemeLabel(resolvedTheme)})`;
  }

  return `Appearance: ${getThemeLabel(appearanceMode)}`;
}

function getNextOptionIndex(currentIndex: number, offset: number) {
  return (
    (currentIndex + offset + appearanceOptions.length) %
    appearanceOptions.length
  );
}

export function MenuBar({
  now,
  resolvedTheme,
}: MenuBarProps) {
  const { projects } = usePortfolioTrack();
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const lock = useDesktopStore((state) => state.lock);
  const openWindow = useDesktopStore((state) => state.openWindow);
  const windows = useDesktopStore((state) => state.windows);
  const appearanceMode = useThemeStore((state) => state.appearanceMode);
  const setAppearanceMode = useThemeStore((state) => state.setAppearanceMode);
  const [isAppearanceMenuOpen, setIsAppearanceMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const appearanceButtonRef = useRef<HTMLButtonElement>(null);
  const appearanceMenuRef = useRef<HTMLDivElement>(null);
  const appearanceOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPaletteRef = useRef<HTMLDivElement>(null);
  const appearanceMenuId = useId();
  const searchPaletteId = useId();
  const AppearanceIcon = resolvedTheme === "light" ? Sun : Moon;
  const portfolioSearchResults: SearchResult[] = useMemo(
    () => [
      ...navigationItems.map((item) => ({
        id: `window-${item.id}`,
        label: item.title,
        category: "Window",
        description: `Open ${item.label}`,
        windowId: item.windowId,
        windowTitle: item.title,
        searchText: [item.label, item.title, item.id].join(" "),
      })),
      ...projects.map((project) => ({
        id: `project-${project.slug}`,
        label: project.title,
        category: "Project",
        description: project.stack.join(" / "),
        windowId: `project-${project.slug}` as WindowId,
        windowTitle: project.title,
        searchText: [
          project.title,
          project.slug,
          project.summary,
          project.valueStatement,
          project.stack.join(" "),
          project.role.join(" "),
        ].join(" "),
      })),
      ...skills.map((skill) => ({
        id: `skill-${skill.name}`,
        label: skill.name,
        category: "Skill",
        description: `${skill.category} / ${skill.level}`,
        windowId: "skills" as const,
        windowTitle: "Skills",
        searchText: [
          skill.name,
          skill.category,
          skill.level,
          skill.description,
          skill.relatedProjects.join(" "),
        ].join(" "),
      })),
    ],
    [projects],
  );

  const activeWindowTitle = useMemo(() => {
    if (!activeWindowId) {
      return "Desktop";
    }

    return (
      windows.find((window) => window.id === activeWindowId)?.title ?? "Desktop"
    );
  }, [activeWindowId, windows]);

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now),
    [now],
  );

  const appearanceLabel = useMemo(
    () => getAppearanceLabel(appearanceMode, resolvedTheme),
    [appearanceMode, resolvedTheme],
  );

  const visibleSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return portfolioSearchResults.slice(0, MAX_SEARCH_RESULTS);
    }

    return portfolioSearchResults
      .filter((result) => result.searchText.toLowerCase().includes(query))
      .slice(0, MAX_SEARCH_RESULTS);
  }, [portfolioSearchResults, searchQuery]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const animationFrameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        searchButtonRef.current?.contains(target) ||
        searchPaletteRef.current?.contains(target)
      ) {
        return;
      }

      setIsSearchOpen(false);
      setSearchQuery("");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsSearchOpen(false);
      setSearchQuery("");
      searchButtonRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isAppearanceMenuOpen) {
      return;
    }

    const selectedIndex = appearanceOptions.findIndex(
      (option) => option.mode === appearanceMode,
    );
    const animationFrameId = requestAnimationFrame(() => {
      appearanceOptionRefs.current[selectedIndex]?.focus();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [appearanceMode, isAppearanceMenuOpen]);

  useEffect(() => {
    if (!isAppearanceMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        appearanceButtonRef.current?.contains(target) ||
        appearanceMenuRef.current?.contains(target)
      ) {
        return;
      }

      setIsAppearanceMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsAppearanceMenuOpen(false);
      appearanceButtonRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAppearanceMenuOpen]);

  const selectAppearanceMode = (nextAppearanceMode: AppearanceMode) => {
    setAppearanceMode(nextAppearanceMode);
    setIsAppearanceMenuOpen(false);
    appearanceButtonRef.current?.focus();
  };

  const openSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(true);
    setIsAppearanceMenuOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    searchButtonRef.current?.focus();
  };

  const openSearchResult = (result: SearchResult) => {
    openWindow(result.windowId, result.windowTitle);
    closeSearch();
  };

  const handleAppearanceMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();

    const currentIndex = appearanceOptionRefs.current.findIndex(
      (element) => element === document.activeElement,
    );
    const fallbackIndex = appearanceOptions.findIndex(
      (option) => option.mode === appearanceMode,
    );
    const nextIndex = getNextOptionIndex(
      currentIndex >= 0 ? currentIndex : fallbackIndex,
      event.key === "ArrowDown" ? 1 : -1,
    );

    appearanceOptionRefs.current[nextIndex]?.focus();
  };

  const handleSearchInputKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    const firstResult = visibleSearchResults[0];

    if (!firstResult) {
      return;
    }

    event.preventDefault();
    openSearchResult(firstResult);
  };

  return (
    <>
      <header className="menu-bar-surface flex h-8 items-center justify-between gap-4 px-4 text-sm font-semibold">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <button
              aria-label="Lock screen"
              className="menu-bar-action grid min-h-7 min-w-7 place-items-center rounded-sm transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
              onClick={lock}
              title="Lock screen"
              type="button"
            >
              <MonitorCog aria-hidden="true" size={16} strokeWidth={2.2} />
            </button>
            <span>Portfolio OS</span>
          </div>
          <nav
            aria-label="Application menus"
            className="hidden shrink-0 items-center gap-1 md:flex"
          >
            {menuPlaceholderItems.map((item) => (
              <button
                aria-label={`${item} menu`}
                className="menu-bar-action min-h-7 rounded-sm px-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
                key={item}
                title={`${item} menu`}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>
          <span
            aria-label={`Active window: ${activeWindowTitle}`}
            className="menu-bar-muted hidden min-w-0 truncate text-xs font-medium sm:block"
          >
            {activeWindowTitle}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            aria-controls={isSearchOpen ? searchPaletteId : undefined}
            aria-expanded={isSearchOpen}
            aria-haspopup="dialog"
            aria-label="Open portfolio search"
            className="menu-bar-action grid min-h-7 min-w-7 place-items-center rounded-sm px-2 transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
            onClick={openSearch}
            ref={searchButtonRef}
            title="Search"
            type="button"
          >
            <Search aria-hidden="true" size={15} strokeWidth={2.1} />
          </button>
          <time dateTime={now.toISOString()} suppressHydrationWarning>
            {formattedTime}
          </time>
          <div className="relative">
            <button
              aria-controls={isAppearanceMenuOpen ? appearanceMenuId : undefined}
              aria-expanded={isAppearanceMenuOpen}
              aria-haspopup="menu"
              aria-label={appearanceLabel}
              className="menu-bar-action grid min-h-7 min-w-7 place-items-center rounded-sm px-2 transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
              onClick={() => setIsAppearanceMenuOpen((isOpen) => !isOpen)}
              ref={appearanceButtonRef}
              title={appearanceLabel}
              type="button"
            >
              <AppearanceIcon aria-hidden="true" size={15} strokeWidth={2.1} />
            </button>

            {isAppearanceMenuOpen ? (
            <div
              aria-label="Appearance"
              className="appearance-menu-surface absolute top-[calc(100%+0.35rem)] right-0 z-[1300] w-44 max-w-[calc(100vw-1rem)] rounded-md p-1 text-[13px] font-medium"
              id={appearanceMenuId}
              onKeyDown={handleAppearanceMenuKeyDown}
              ref={appearanceMenuRef}
              role="menu"
            >
              <div className="px-2 py-1.5 text-[11px] font-semibold text-muted">
                Appearance
              </div>
              {appearanceOptions.map(({ Icon, label, mode }, index) => {
                const isSelected = appearanceMode === mode;

                return (
                  <button
                    aria-checked={isSelected}
                    className={cn(
                      "appearance-menu-item flex h-8 w-full items-center gap-2 rounded-sm px-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4f8fd9]",
                      isSelected && "appearance-menu-item-active",
                    )}
                    key={mode}
                    onClick={() => selectAppearanceMode(mode)}
                    ref={(element) => {
                      appearanceOptionRefs.current[index] = element;
                    }}
                    role="menuitemradio"
                    type="button"
                  >
                    <span className="grid size-4 shrink-0 place-items-center">
                      {isSelected ? (
                        <Check aria-hidden="true" size={13} strokeWidth={2.5} />
                      ) : null}
                    </span>
                    <Icon aria-hidden="true" size={14} strokeWidth={2.1} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            ) : null}
          </div>
        </div>
      </header>

      {isSearchOpen ? (
        <div className="search-palette-backdrop fixed inset-0 z-[1400] px-4 pt-16">
          <section
            aria-label="Portfolio search"
            aria-modal="true"
            className="search-palette-surface mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-lg text-left shadow-[0_28px_90px_rgba(15,23,42,0.32)]"
            id={searchPaletteId}
            ref={searchPaletteRef}
            role="dialog"
          >
            <div className="flex h-14 items-center gap-3 border-b border-slate-200/70 px-4 dark:border-white/12">
              <Search
                aria-hidden="true"
                className="shrink-0 text-muted"
                size={19}
                strokeWidth={2.2}
              />
              <input
                aria-label="Search portfolio"
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                placeholder="Search projects, skills, resume..."
                ref={searchInputRef}
                type="search"
                value={searchQuery}
              />
            </div>

            <div className="max-h-[min(60vh,26rem)] overflow-auto p-2">
              {visibleSearchResults.length > 0 ? (
                <div className="space-y-1">
                  {visibleSearchResults.map((result) => (
                    <button
                      className="search-result-item flex min-h-14 w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4f8fd9]"
                      key={result.id}
                      onClick={() => openSearchResult(result)}
                      type="button"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-[var(--color-text)]">
                          {result.label}
                        </span>
                        <span className="mt-0.5 block truncate text-xs font-medium text-muted">
                          {result.description}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-sm border border-slate-200/70 px-2 py-1 text-[11px] font-bold uppercase text-muted dark:border-white/12">
                        {result.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-6 text-sm font-medium text-muted">
                  No matching portfolio items
                </p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

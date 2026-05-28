"use client";

import { MonitorCog, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useDesktopStore } from "@/stores/desktopStore";

function useMinuteClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    const msToNextMinute = 60_000 - (Date.now() % 60_000);
    let intervalId: ReturnType<typeof setInterval> | undefined;

    updateNow();

    const timeoutId = setTimeout(() => {
      updateNow();
      intervalId = setInterval(updateNow, 60_000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return now;
}

export function MenuBar() {
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const windows = useDesktopStore((state) => state.windows);
  const now = useMinuteClock();

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

  return (
    <header className="glass-surface flex h-8 items-center justify-between gap-4 px-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <MonitorCog aria-hidden="true" size={16} strokeWidth={2.2} />
          <span>Portfolio OS</span>
        </div>
        <span
          aria-label={`활성 창: ${activeWindowTitle}`}
          className="hidden min-w-0 truncate text-xs font-medium text-muted sm:block"
        >
          {activeWindowTitle}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <time dateTime={now.toISOString()} suppressHydrationWarning>
          {formattedTime}
        </time>
        <button
          aria-label="테마 토글 준비 중"
          className="flex min-h-7 items-center gap-1 rounded-sm px-2 text-muted transition hover:bg-white/32 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:hover:bg-white/10"
          title="테마 토글 준비 중"
          type="button"
        >
          <Sun aria-hidden="true" size={14} strokeWidth={2.1} />
          <Moon aria-hidden="true" size={14} strokeWidth={2.1} />
        </button>
      </div>
    </header>
  );
}

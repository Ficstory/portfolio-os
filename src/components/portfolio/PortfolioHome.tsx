"use client";

import { LockScreen } from "@/components/lock-screen/LockScreen";
import { cn } from "@/lib/cn";
import {
  getTimeOfDay,
  getWallpaperForTimeOfDay,
  resolveAppearanceMode,
} from "@/lib/timeTheme";
import { useMinuteClock } from "@/lib/useMinuteClock";
import { useDesktopStore } from "@/stores/desktopStore";
import { useThemeStore } from "@/stores/themeStore";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const UNLOCK_ANIMATION_MS = 550;
const PortfolioDesktopShell = dynamic(
  () =>
    import("@/components/portfolio/PortfolioDesktopShell").then(
      (module) => module.PortfolioDesktopShell,
    ),
  {
    loading: () => null,
    ssr: false,
  },
);

export default function Home() {
  const hasUnlocked = useDesktopStore((state) => state.hasUnlocked);
  const unlock = useDesktopStore((state) => state.unlock);
  const appearanceMode = useThemeStore((state) => state.appearanceMode);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = useMinuteClock();
  const timeOfDay = useMemo(() => getTimeOfDay(now.getHours()), [now]);
  const wallpaperUrl = useMemo(
    () => getWallpaperForTimeOfDay(timeOfDay),
    [timeOfDay],
  );
  const resolvedTheme = useMemo(
    () => resolveAppearanceMode(appearanceMode, timeOfDay),
    [appearanceMode, timeOfDay],
  );

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  const startUnlock = useCallback(() => {
    if (hasUnlocked || isUnlocking || unlockTimerRef.current) {
      return;
    }

    setIsUnlocking(true);

    unlockTimerRef.current = setTimeout(() => {
      unlock();
      setIsUnlocking(false);
      unlockTimerRef.current = null;
    }, UNLOCK_ANIMATION_MS);
  }, [hasUnlocked, isUnlocking, unlock]);

  const isDesktopVisible = hasUnlocked || isUnlocking;
  const dimState = isDesktopVisible ? "unlocked" : "locked";

  return (
    <main
      aria-label="Portfolio"
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
      data-portfolio-root=""
      data-theme={resolvedTheme}
      data-time-theme={timeOfDay}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-[filter] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isDesktopVisible ? "blur-0" : "scale-[1.01] blur-[4px]",
        )}
        data-wallpaper-layer=""
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black transition-opacity duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: `var(--wallpaper-dim-${dimState})` }}
      />

      {isDesktopVisible ? (
        <PortfolioDesktopShell isVisible={isDesktopVisible} now={now} resolvedTheme={resolvedTheme} />
      ) : null}

      {!hasUnlocked ? (
        <LockScreen isUnlocking={isUnlocking} now={now} onUnlock={startUnlock} />
      ) : null}
    </main>
  );
}

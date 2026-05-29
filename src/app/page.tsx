"use client";

import { DesktopShell } from "@/components/desktop/DesktopShell";
import { LockScreen } from "@/components/lock-screen/LockScreen";
import { cn } from "@/lib/cn";
import {
  getThemeModeForTimeOfDay,
  getTimeOfDay,
  getWallpaperForTimeOfDay,
} from "@/lib/timeTheme";
import { useDesktopStore } from "@/stores/desktopStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const UNLOCK_ANIMATION_MS = 900;
const BOOT_SEQUENCE_MS = 1350;

function PortfolioBootScreen() {
  return (
    <section
      aria-label="Portfolio boot sequence"
      className="absolute inset-0 z-30 flex min-h-screen items-center justify-center bg-slate-950 text-white"
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-7 px-6 text-center">
        <div className="flex size-20 animate-pulse items-center justify-center rounded-[18px] border border-white/18 bg-white/8 text-2xl font-bold tracking-normal shadow-[0_22px_80px_rgba(79,143,217,0.24)]">
          JH
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white/78">Portfolio OS</p>
          <div
            aria-hidden="true"
            className="h-1.5 w-56 overflow-hidden rounded-full bg-white/12"
          >
            <div className="h-full origin-left rounded-full bg-[#8ab7ff] [animation:portfolio-boot-progress_1350ms_cubic-bezier(0.22,1,0.36,1)_forwards]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const hasUnlocked = useDesktopStore((state) => state.hasUnlocked);
  const unlock = useDesktopStore((state) => state.unlock);
  const [isUnlocked, setIsUnlocked] = useState(hasUnlocked);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeOfDay = useMemo(() => getTimeOfDay(new Date().getHours()), []);
  const wallpaperUrl = useMemo(
    () => getWallpaperForTimeOfDay(timeOfDay),
    [timeOfDay],
  );
  const themeMode = useMemo(
    () => getThemeModeForTimeOfDay(timeOfDay),
    [timeOfDay],
  );

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }

      if (bootTimerRef.current) {
        clearTimeout(bootTimerRef.current);
      }
    };
  }, []);

  const startUnlock = useCallback(() => {
    if (
      isUnlocked ||
      isUnlocking ||
      isBooting ||
      unlockTimerRef.current ||
      bootTimerRef.current
    ) {
      return;
    }

    setIsUnlocking(true);

    unlockTimerRef.current = setTimeout(() => {
      setIsUnlocking(false);
      unlockTimerRef.current = null;
      setIsBooting(true);

      bootTimerRef.current = setTimeout(() => {
        unlock();
        setIsUnlocked(true);
        setIsBooting(false);
        bootTimerRef.current = null;
      }, BOOT_SEQUENCE_MS);
    }, UNLOCK_ANIMATION_MS);
  }, [isBooting, isUnlocked, isUnlocking, unlock]);

  const isDesktopVisible = isUnlocked;
  const dimState = isDesktopVisible ? "unlocked" : "locked";

  return (
    <main
      aria-label="Portfolio"
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
      data-theme={themeMode}
      data-time-theme={timeOfDay}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-[filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isDesktopVisible ? "blur-0" : "scale-[1.01] blur-[4px]",
        )}
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black transition-opacity duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: `var(--wallpaper-dim-${dimState})` }}
      />

      <DesktopShell isVisible={isDesktopVisible} />

      {!isUnlocked && !isBooting ? (
        <LockScreen isUnlocking={isUnlocking} onUnlock={startUnlock} />
      ) : null}

      {isBooting ? <PortfolioBootScreen /> : null}
    </main>
  );
}

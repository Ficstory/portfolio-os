"use client";

import {
  BatteryFull,
  Bluetooth,
  Moon,
  Wifi,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SwipeUnlockControl } from "@/components/lock-screen/SwipeUnlockControl";
import { cn } from "@/lib/cn";

type LockScreenProps = {
  isUnlocking: boolean;
  onUnlock: () => void;
};

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

function formatTime(now: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

function LockStatusBar({
  isUnlocking,
  now,
}: {
  isUnlocking: boolean;
  now: Date;
}) {
  const statusTime = useMemo(() => formatTime(now), [now]);

  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between px-4 text-sm font-medium text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-14 sm:px-6",
        isUnlocking && "pointer-events-none -translate-y-4 opacity-0",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Wifi aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2.2} />
        <span className="truncate">Portfolio</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Moon
          aria-label="Moon"
          className="hidden h-4 w-4 sm:block"
          strokeWidth={2.2}
        />
        <Bluetooth
          aria-label="Bluetooth"
          className="hidden h-4 w-4 sm:block"
          strokeWidth={2.2}
        />
        <BatteryFull
          aria-label="Battery"
          className="h-4 w-4"
          strokeWidth={2.2}
        />
        <time
          className="tabular-nums"
          dateTime={now.toISOString()}
          suppressHydrationWarning
        >
          {statusTime}
        </time>
      </div>
    </header>
  );
}

function LockClock({ now }: { now: Date }) {
  const formattedTime = useMemo(() => formatTime(now), [now]);
  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(now),
    [now],
  );

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <time
        className="text-[clamp(5rem,13vw,8.5rem)] font-thin leading-none tracking-normal text-white drop-shadow-[0_8px_36px_rgba(0,0,0,0.45)]"
        dateTime={now.toISOString()}
        suppressHydrationWarning
      >
        {formattedTime}
      </time>
      <p
        className="text-sm font-medium text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.42)] sm:text-base"
        suppressHydrationWarning
      >
        {formattedDate}
      </p>
    </div>
  );
}

function LockIdentity() {
  return (
    <section
      aria-label="Portfolio owner"
      className="flex flex-col items-center gap-3 sm:gap-4"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/20 text-2xl font-semibold text-white shadow-[0_18px_56px_rgba(30,8,80,0.36)] backdrop-blur-2xl sm:h-24 sm:w-24 sm:text-3xl">
        JH
      </div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-semibold leading-tight text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.5)] sm:text-3xl">
          이재호
        </h1>
        <p className="text-sm font-medium text-white/80 sm:text-base">
          Client Portfolio
        </p>
      </div>
    </section>
  );
}

export function LockScreen({ isUnlocking, onUnlock }: LockScreenProps) {
  const now = useMinuteClock();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isUnlocking) {
        return;
      }

      if (event.key === "Enter" && !event.altKey && !event.ctrlKey && !event.metaKey) {
        onUnlock();
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (isUnlocking) {
        return;
      }

      if (event.deltaY < 0) {
        onUnlock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isUnlocking, onUnlock]);

  return (
    <section
      aria-label="Portfolio lock screen"
      className={cn(
        "absolute inset-0 z-20 overflow-hidden text-white",
        isUnlocking && "pointer-events-none",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent transition-opacity duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isUnlocking && "opacity-0",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/70 via-black/25 to-transparent transition-opacity duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isUnlocking && "opacity-0",
        )}
      />

      <LockStatusBar isUnlocking={isUnlocking} now={now} />

      <div
        className={cn(
          "relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pb-20 pt-16 text-center transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 sm:pb-24 sm:pt-20",
          isUnlocking && "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <div className="flex w-full max-w-2xl flex-col items-center gap-5 sm:gap-7">
          <LockClock now={now} />
          <LockIdentity />
          <SwipeUnlockControl disabled={isUnlocking} onUnlock={onUnlock} />
        </div>
      </div>
    </section>
  );
}

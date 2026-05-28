"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

const headline =
  "사용자 경험을 화면의 구조로 설계하고, 문제를 제품의 형태로 구현합니다.";

const quickLinks = [
  {
    label: "GitHub",
    href: "https://github.com/",
    ariaLabel: "GitHub 프로필 열기",
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    ariaLabel: "Resume PDF 열기",
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    ariaLabel: "Email 보내기",
  },
] as const;

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

export function LockScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const now = useMinuteClock();
  const shouldReduceMotion = useReducedMotion();

  const unlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  useEffect(() => {
    if (unlocked) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.altKey && !event.ctrlKey && !event.metaKey) {
        unlock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [unlock, unlocked]);

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now),
    [now],
  );

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(now),
    [now],
  );

  const lockExit = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.98 };
  const desktopInitial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 1.02 };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#dde7f3_0%,#eef2f7_45%,#f7e7e2_100%)] text-slate-900 dark:bg-[linear-gradient(135deg,#172033_0%,#111827_48%,#31253a_100%)] dark:text-slate-50">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.34),rgba(255,255,255,0)_42%),linear-gradient(0deg,rgba(31,41,55,0.08),rgba(31,41,55,0))] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%),linear-gradient(0deg,rgba(0,0,0,0.22),rgba(0,0,0,0))]" />
      <AnimatePresence mode="wait" initial={false}>
        {!unlocked ? (
          <motion.section
            key="lock-screen"
            aria-label="잠금화면 랜딩"
            className="relative z-10 flex min-h-screen flex-col items-center justify-end px-5 py-8 text-center sm:px-8 sm:py-10"
            animate={{ opacity: 1, scale: 1 }}
            exit={lockExit}
            initial={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, ease: "easeOut" }}
          >
            <div className="mb-16 flex w-full max-w-3xl flex-col items-center sm:mb-20">
              <time
                className="font-semibold leading-none tracking-normal text-[clamp(3.75rem,13vw,8rem)]"
                dateTime={now.toISOString()}
                suppressHydrationWarning
              >
                {formattedTime}
              </time>
              <p
                className="mt-4 text-sm font-medium text-slate-700 sm:text-base dark:text-slate-200"
                suppressHydrationWarning
              >
                {formattedDate}
              </p>
              <h1 className="mt-8 max-w-2xl text-pretty text-xl font-semibold leading-8 text-slate-950 sm:text-2xl sm:leading-9 dark:text-white">
                {headline}
              </h1>
              <button
                type="button"
                className="mt-8 min-h-11 rounded-md border border-white/50 bg-white/78 px-6 py-3 text-sm font-bold text-slate-900 shadow-[0_18px_48px_rgba(15,23,42,0.2)] backdrop-blur-[18px] transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4f8fd9] dark:border-white/20 dark:bg-slate-900/68 dark:text-white dark:hover:bg-slate-900/88"
                onClick={unlock}
              >
                포트폴리오 입장
              </button>
            </div>

            <nav
              aria-label="잠금화면 빠른 링크"
              className="grid w-full max-w-sm grid-cols-3 overflow-hidden rounded-xl border border-white/46 bg-white/56 text-sm font-semibold text-slate-800 shadow-[0_18px_48px_rgba(15,23,42,0.16)] backdrop-blur-[18px] dark:border-white/16 dark:bg-slate-900/54 dark:text-slate-100"
            >
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  aria-label={link.ariaLabel}
                  className="flex min-h-11 items-center justify-center border-r border-white/50 px-3 transition last:border-r-0 hover:bg-white/60 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#4f8fd9] dark:border-white/12 dark:hover:bg-white/10"
                  href={link.href}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.section>
        ) : (
          <motion.section
            key="desktop-placeholder"
            aria-label="데스크톱 임시 화면"
            className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center"
            animate={{ opacity: 1, scale: 1 }}
            initial={desktopInitial}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, ease: "easeOut" }}
          >
            <h2 className="rounded-md border border-white/46 bg-white/68 px-6 py-4 text-lg font-bold text-slate-900 shadow-[0_18px_48px_rgba(15,23,42,0.16)] backdrop-blur-[18px] dark:border-white/16 dark:bg-slate-900/62 dark:text-white">
              Desktop workspace 준비 중
            </h2>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

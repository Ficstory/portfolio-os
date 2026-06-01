"use client";

import { Dock } from "@/components/desktop/Dock";
import { MenuBar } from "@/components/desktop/MenuBar";
import { WindowManager } from "@/components/desktop/WindowManager";
import { MobileHome } from "@/components/mobile/MobileHome";
import { cn } from "@/lib/cn";
import type { ResolvedTheme } from "@/lib/timeTheme";
import { useDesktopStore } from "@/stores/desktopStore";

type DesktopShellProps = {
  isVisible?: boolean;
  resolvedTheme: ResolvedTheme;
};

const revealClass =
  "transition-[opacity,transform] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

export function DesktopShell({
  isVisible = true,
  resolvedTheme,
}: DesktopShellProps) {
  const hasMaximizedWindow = useDesktopStore((state) =>
    state.windows.some((window) => window.isMaximized && !window.isMinimized),
  );

  return (
    <section
      aria-label="Portfolio desktop"
      className={cn(
        "relative z-10 min-h-screen text-slate-900 transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-slate-50",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <div className="md:hidden" data-layout="mobile-shell">
        <MobileHome />
      </div>

      <div
        className="relative hidden min-h-screen overflow-hidden md:block"
        data-layout="desktop-shell"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),rgba(255,255,255,0)_42%),linear-gradient(0deg,rgba(31,41,55,0.08),rgba(31,41,55,0))] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%),linear-gradient(0deg,rgba(0,0,0,0.22),rgba(0,0,0,0))]" />

        <div
          className={cn(
            "absolute inset-x-0 top-0 z-[1000]",
            revealClass,
            isVisible
              ? "delay-[60ms] translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          )}
        >
          <MenuBar resolvedTheme={resolvedTheme} />
        </div>

        <div
          className={cn(
            "absolute inset-0",
            hasMaximizedWindow ? "z-[1100]" : "z-[800]",
            revealClass,
            isVisible
              ? "delay-[90ms] translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          )}
        >
          <WindowManager />
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-5 z-[900] flex justify-center px-6",
            revealClass,
            isVisible
              ? "delay-[120ms] translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          )}
        >
          <Dock />
        </div>
      </div>
    </section>
  );
}

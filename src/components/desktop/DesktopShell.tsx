"use client";

import { DesktopIconGrid } from "@/components/desktop/DesktopIconGrid";
import { Dock } from "@/components/desktop/Dock";
import { MenuBar } from "@/components/desktop/MenuBar";
import { WindowManager } from "@/components/desktop/WindowManager";
import { MobileHome } from "@/components/mobile/MobileHome";

export function DesktopShell() {
  return (
    <main className="wallpaper min-h-screen">
      <div className="md:hidden" data-layout="mobile-shell">
        <MobileHome />
      </div>

      <div
        className="relative hidden min-h-screen overflow-hidden md:block"
        data-layout="desktop-shell"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),rgba(255,255,255,0)_42%),linear-gradient(0deg,rgba(31,41,55,0.08),rgba(31,41,55,0))] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%),linear-gradient(0deg,rgba(0,0,0,0.22),rgba(0,0,0,0))]" />

        <div className="absolute inset-x-0 top-0 z-[1000]">
          <MenuBar />
        </div>

        <div className="absolute inset-x-6 bottom-28 top-14 z-10 overflow-hidden">
          <DesktopIconGrid />
        </div>

        <WindowManager />

        <div className="absolute inset-x-0 bottom-5 z-[900] flex justify-center px-6">
          <Dock />
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, type KeyboardEvent, type MouseEvent } from "react";

import { DesktopShell } from "@/components/desktop/DesktopShell";
import { LockScreen } from "@/components/lock-screen/LockScreen";
import { useDesktopStore } from "@/stores/desktopStore";

export default function Home() {
  const hasUnlocked = useDesktopStore((state) => state.hasUnlocked);
  const unlock = useDesktopStore((state) => state.unlock);

  useEffect(() => {
    if (hasUnlocked) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Enter" && !event.altKey && !event.ctrlKey && !event.metaKey) {
        unlock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasUnlocked, unlock]);

  if (hasUnlocked) {
    return <DesktopShell />;
  }

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.closest("button")) {
      unlock();
    }
  };

  const handleKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.altKey && !event.ctrlKey && !event.metaKey) {
      unlock();
    }
  };

  return (
    <div
      onClickCapture={handleClickCapture}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <LockScreen />
    </div>
  );
}

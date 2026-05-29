"use client";

import { ArrowUp, ChevronUp, LockKeyhole } from "lucide-react";
import { useRef, type PointerEvent } from "react";

const SWIPE_UNLOCK_THRESHOLD = 50;

type SwipeUnlockControlProps = {
  disabled?: boolean;
  onUnlock: () => void;
};

export function SwipeUnlockControl({
  disabled = false,
  onUnlock,
}: SwipeUnlockControlProps) {
  const pointerStartYRef = useRef<number | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    pointerStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const startY = pointerStartYRef.current;
    pointerStartYRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (startY !== null && startY - event.clientY >= SWIPE_UNLOCK_THRESHOLD) {
      onUnlock();
    }
  };

  const handlePointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    pointerStartYRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <button
        aria-label="Unlock portfolio"
        className="group inline-flex h-16 w-full max-w-[420px] items-center justify-between gap-3 rounded-full border border-white/22 bg-white/[0.12] px-5 text-[10px] font-bold uppercase leading-tight tracking-normal text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-[18px] transition-[background,border-color,transform] duration-200 hover:border-white/34 hover:bg-white/[0.18] active:scale-[0.98] disabled:cursor-default disabled:opacity-70 sm:min-w-[380px] sm:px-6 sm:text-[13px]"
        disabled={disabled}
        onClick={onUnlock}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
        type="button"
      >
        <LockKeyhole
          aria-hidden="true"
          className="h-[18px] w-[18px] shrink-0 text-white/78 transition group-hover:text-white/90"
          strokeWidth={2.1}
        />
        <span className="min-w-0 flex-1 text-center">
          SWIPE UP TO UNLOCK PORTFOLIO
        </span>
        <ArrowUp
          aria-hidden="true"
          className="h-[18px] w-[18px] shrink-0 text-white/78 transition group-hover:text-white/90"
          strokeWidth={2.25}
        />
      </button>

      <ChevronUp
        aria-hidden="true"
        className="mt-3 h-5 w-5 text-white/48 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
        strokeWidth={2.2}
      />
    </div>
  );
}

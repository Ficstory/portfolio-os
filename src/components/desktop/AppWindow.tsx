"use client";

import { X } from "lucide-react";
import {
  type PointerEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";
import { type WindowPosition, useDesktopStore } from "@/stores/desktopStore";
import type { WindowId, WindowSize } from "@/types/portfolio";

export type AppWindowProps = {
  id: WindowId;
  title: string;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  isActive: boolean;
  children: ReactNode;
};

type DragState = {
  pointerId: number;
  origin: WindowPosition;
  startPosition: WindowPosition;
};

export function AppWindow({
  id,
  title,
  position,
  size,
  zIndex,
  isActive,
  children,
}: AppWindowProps) {
  const titleId = useId();
  const dragStateRef = useRef<DragState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const closeWindow = useDesktopStore((state) => state.closeWindow);
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const moveWindow = useDesktopStore((state) => state.moveWindow);

  const handleWindowPointerDown = () => {
    focusWindow(id);
  };

  const handleTitlebarPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    focusWindow(id);

    dragStateRef.current = {
      pointerId: event.pointerId,
      origin: {
        x: event.clientX,
        y: event.clientY,
      },
      startPosition: position,
    };
    setIsDragging(true);
  };

  const handleTitlebarPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    moveWindow(id, {
      x: Math.round(
        dragState.startPosition.x + event.clientX - dragState.origin.x,
      ),
      y: Math.round(
        dragState.startPosition.y + event.clientY - dragState.origin.y,
      ),
    });
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
  };

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "glass-surface window-shadow pointer-events-auto absolute flex overflow-hidden rounded-lg text-left text-slate-900 dark:text-slate-50",
        "border transition-shadow duration-150",
        isActive
          ? "border-sky-300/70 shadow-[0_26px_90px_rgba(15,23,42,0.28)] dark:border-sky-300/40"
          : "border-white/48 dark:border-white/14",
      )}
      onPointerDown={handleWindowPointerDown}
      role="dialog"
      style={{
        height: size.height,
        left: position.x,
        top: position.y,
        width: size.width,
        zIndex,
      }}
    >
      <div className="flex min-h-0 w-full flex-col">
        <div
          className={cn(
            "flex h-11 shrink-0 items-center gap-3 border-b border-white/40 bg-white/58 px-3 dark:border-white/12 dark:bg-slate-950/28",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          onPointerCancel={stopDragging}
          onPointerDown={handleTitlebarPointerDown}
          onPointerMove={handleTitlebarPointerMove}
          onPointerUp={stopDragging}
          style={{ touchAction: "none" }}
        >
          <button
            aria-label="창 닫기"
            className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e98b74] text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
            onClick={() => closeWindow(id)}
            onPointerDown={(event) => event.stopPropagation()}
            type="button"
          >
            <X aria-hidden="true" size={14} strokeWidth={2.4} />
          </button>
          <h2
            className="min-w-0 flex-1 truncate text-center text-sm font-bold"
            id={titleId}
          >
            {title}
          </h2>
          <span aria-hidden="true" className="size-6 shrink-0" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-white/42 p-5 dark:bg-slate-950/18">
          {children}
        </div>
      </div>
    </section>
  );
}

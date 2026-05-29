"use client";

import { Maximize2, Minimize2, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
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
  isMaximized: boolean;
  children: ReactNode;
};

type DragState = {
  pointerId: number;
  origin: WindowPosition;
  startPosition: WindowPosition;
};

type ResizeState = {
  pointerId: number;
  origin: WindowPosition;
  startSize: WindowSize;
};

export function AppWindow({
  id,
  title,
  position,
  size,
  zIndex,
  isActive,
  isMaximized,
  children,
}: AppWindowProps) {
  const titleId = useId();
  const dragStateRef = useRef<DragState | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const pendingResizeRef = useRef<WindowSize | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const closeWindow = useDesktopStore((state) => state.closeWindow);
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const moveWindow = useDesktopStore((state) => state.moveWindow);
  const resizeWindow = useDesktopStore((state) => state.resizeWindow);
  const toggleMaximize = useDesktopStore((state) => state.toggleMaximize);
  const toggleMinimize = useDesktopStore((state) => state.toggleMinimize);

  const scheduleResize = (nextSize: WindowSize) => {
    pendingResizeRef.current = nextSize;

    if (resizeFrameRef.current !== null) {
      return;
    }

    resizeFrameRef.current = requestAnimationFrame(() => {
      resizeFrameRef.current = null;
      const pendingSize = pendingResizeRef.current;

      if (!pendingSize) {
        return;
      }

      pendingResizeRef.current = null;
      resizeWindow(id, pendingSize);
    });
  };

  const flushResize = () => {
    if (resizeFrameRef.current !== null) {
      cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = null;
    }

    const pendingSize = pendingResizeRef.current;

    if (!pendingSize) {
      return;
    }

    pendingResizeRef.current = null;
    resizeWindow(id, pendingSize);
  };

  useEffect(() => {
    return () => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, []);

  const handleWindowPointerDown = () => {
    focusWindow(id);
  };

  const handleClosePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    closeWindow(id);
  };

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeWindow(id);
  };

  const handleControlPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const handleMinimizeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleMinimize(id);
  };

  const handleMaximizeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleMaximize(id);
  };

  const handleTitlebarPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isMaximized) {
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

  const handleResizePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    focusWindow(id);

    resizeStateRef.current = {
      pointerId: event.pointerId,
      origin: {
        x: event.clientX,
        y: event.clientY,
      },
      startSize: size,
    };
    setIsResizing(true);
  };

  const handleResizePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const resizeState = resizeStateRef.current;

    if (!resizeState || resizeState.pointerId !== event.pointerId) {
      return;
    }

    scheduleResize({
      width: Math.round(
        resizeState.startSize.width + event.clientX - resizeState.origin.x,
      ),
      height: Math.round(
        resizeState.startSize.height + event.clientY - resizeState.origin.y,
      ),
    });
  };

  const stopResizing = (event: PointerEvent<HTMLButtonElement>) => {
    const resizeState = resizeStateRef.current;

    if (!resizeState || resizeState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    flushResize();
    resizeStateRef.current = null;
    setIsResizing(false);
  };

  return (
    <motion.section
      aria-labelledby={titleId}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      className={cn(
        "window-surface window-shadow pointer-events-auto absolute flex overflow-hidden rounded-lg text-left text-slate-900 dark:text-slate-50",
        "border transition-shadow duration-150",
        isActive
          ? "border-sky-300/70 shadow-[0_26px_90px_rgba(15,23,42,0.28)] dark:border-sky-300/40"
          : "border-white/48 dark:border-white/14",
      )}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      onPointerDown={handleWindowPointerDown}
      role="dialog"
      style={{
        height: size.height,
        left: position.x,
        top: position.y,
        transformOrigin: "center",
        width: size.width,
        zIndex,
      }}
      transition={{
        duration: shouldReduceMotion ? 0.14 : 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex min-h-0 w-full flex-col">
        <div
          className={cn(
            "flex h-11 shrink-0 items-center gap-3 border-b border-white/40 bg-[var(--color-surface-strong)] px-3 dark:border-white/12",
            isDragging ? "cursor-grabbing" : "cursor-grab",
            isMaximized && "cursor-default",
          )}
          onPointerCancel={stopDragging}
          onPointerDown={handleTitlebarPointerDown}
          onPointerMove={handleTitlebarPointerMove}
          onPointerUp={stopDragging}
          style={{ touchAction: "none" }}
        >
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              aria-label="Close window"
              className="grid size-6 shrink-0 place-items-center rounded-md bg-[#e98b74] text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
              onClick={handleCloseClick}
              onPointerDown={handleClosePointerDown}
              title="Close"
              type="button"
            >
              <X aria-hidden="true" size={14} strokeWidth={2.4} />
            </button>
            <button
              aria-label="Minimize window"
              className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-900/10 text-slate-700 shadow-sm transition hover:bg-slate-900/16 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:bg-white/12 dark:text-slate-100 dark:hover:bg-white/20"
              onClick={handleMinimizeClick}
              onPointerDown={handleControlPointerDown}
              title="Minimize"
              type="button"
            >
              <Minimize2 aria-hidden="true" size={14} strokeWidth={2.4} />
            </button>
            <button
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
              className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-900/10 text-slate-700 shadow-sm transition hover:bg-slate-900/16 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:bg-white/12 dark:text-slate-100 dark:hover:bg-white/20"
              onClick={handleMaximizeClick}
              onPointerDown={handleControlPointerDown}
              title={isMaximized ? "Restore" : "Maximize"}
              type="button"
            >
              <Maximize2 aria-hidden="true" size={14} strokeWidth={2.4} />
            </button>
          </div>
          <h2
            className="min-w-0 flex-1 truncate text-center text-sm font-bold"
            id={titleId}
          >
            {title}
          </h2>
          <span aria-hidden="true" className="w-[82px] shrink-0" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-[var(--color-surface-strong)] p-5">
          {children}
        </div>
      </div>

      <button
        aria-label="Resize window"
        className={cn(
          "absolute bottom-0 right-0 z-20 hidden size-6 cursor-nwse-resize touch-none md:block",
          "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]",
          isResizing && "bg-sky-400/10",
        )}
        onPointerCancel={stopResizing}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={stopResizing}
        title="Resize"
        type="button"
      >
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 right-1.5 h-3 w-3 border-b-2 border-r-2 border-slate-500/60 dark:border-white/50"
        />
      </button>
    </motion.section>
  );
}

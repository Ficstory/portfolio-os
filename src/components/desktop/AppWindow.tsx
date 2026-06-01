"use client";

import { Maximize2, Minus, X } from "lucide-react";
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

type ResizeDirection = "n" | "e" | "s" | "w" | "ne" | "se" | "sw" | "nw";

type ResizeFrame = {
  position: WindowPosition;
  size: WindowSize;
};

type ResizeState = {
  pointerId: number;
  direction: ResizeDirection;
  origin: WindowPosition;
  startPosition: WindowPosition;
  startSize: WindowSize;
};

const FULL_SCREEN_WINDOW_Z_INDEX = 1200;
const MIN_RESIZE_SIZE: WindowSize = {
  width: 360,
  height: 280,
};
const trafficLightIconClass =
  "opacity-0 transition-opacity group-hover/control:opacity-70 group-focus-visible/control:opacity-70";
const resizeHandles: {
  className: string;
  direction: ResizeDirection;
}[] = [
  {
    direction: "n",
    className: "left-5 right-5 top-0 h-3 cursor-ns-resize",
  },
  {
    direction: "e",
    className: "right-0 top-5 bottom-5 w-3 cursor-ew-resize",
  },
  {
    direction: "s",
    className: "bottom-0 left-5 right-5 h-3 cursor-ns-resize",
  },
  {
    direction: "w",
    className: "left-0 top-5 bottom-5 w-3 cursor-ew-resize",
  },
  {
    direction: "ne",
    className: "right-0 top-0 size-5 cursor-nesw-resize",
  },
  {
    direction: "se",
    className: "bottom-0 right-0 size-5 cursor-nwse-resize",
  },
  {
    direction: "sw",
    className: "bottom-0 left-0 size-5 cursor-nesw-resize",
  },
  {
    direction: "nw",
    className: "left-0 top-0 size-5 cursor-nwse-resize",
  },
];

function getResizedFrame(
  resizeState: ResizeState,
  pointer: WindowPosition,
): ResizeFrame {
  const {
    direction,
    origin,
    startPosition,
    startSize,
  } = resizeState;
  const deltaX = pointer.x - origin.x;
  const deltaY = pointer.y - origin.y;
  let width = startSize.width;
  let height = startSize.height;
  let x = startPosition.x;
  let y = startPosition.y;

  if (direction.includes("e")) {
    width = Math.max(MIN_RESIZE_SIZE.width, startSize.width + deltaX);
  }

  if (direction.includes("s")) {
    height = Math.max(MIN_RESIZE_SIZE.height, startSize.height + deltaY);
  }

  if (direction.includes("w")) {
    width = Math.max(MIN_RESIZE_SIZE.width, startSize.width - deltaX);
    x = startPosition.x + startSize.width - width;
  }

  if (direction.includes("n")) {
    height = Math.max(MIN_RESIZE_SIZE.height, startSize.height - deltaY);
    y = startPosition.y + startSize.height - height;
  }

  return {
    position: {
      x: Math.round(x),
      y: Math.round(y),
    },
    size: {
      width: Math.round(width),
      height: Math.round(height),
    },
  };
}

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
  const pendingResizeRef = useRef<ResizeFrame | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const closeWindow = useDesktopStore((state) => state.closeWindow);
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const moveWindow = useDesktopStore((state) => state.moveWindow);
  const resizeWindowFrame = useDesktopStore((state) => state.resizeWindowFrame);
  const toggleFill = useDesktopStore((state) => state.toggleFill);
  const toggleMaximize = useDesktopStore((state) => state.toggleMaximize);
  const toggleMinimize = useDesktopStore((state) => state.toggleMinimize);

  const scheduleResize = (nextFrame: ResizeFrame) => {
    pendingResizeRef.current = nextFrame;

    if (resizeFrameRef.current !== null) {
      return;
    }

    resizeFrameRef.current = requestAnimationFrame(() => {
      resizeFrameRef.current = null;
      const pendingFrame = pendingResizeRef.current;

      if (!pendingFrame) {
        return;
      }

      pendingResizeRef.current = null;
      resizeWindowFrame(id, pendingFrame.position, pendingFrame.size);
    });
  };

  const flushResize = () => {
    if (resizeFrameRef.current !== null) {
      cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = null;
    }

    const pendingFrame = pendingResizeRef.current;

    if (!pendingFrame) {
      return;
    }

    pendingResizeRef.current = null;
    resizeWindowFrame(id, pendingFrame.position, pendingFrame.size);
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

  const handleTitlebarDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;

    if (target instanceof HTMLElement && target.closest("button")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isMaximized) {
      return;
    }

    toggleFill(id);
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

  const handleResizePointerDown =
    (direction: ResizeDirection) => (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || isMaximized) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      focusWindow(id);

      resizeStateRef.current = {
        pointerId: event.pointerId,
        direction,
        origin: {
          x: event.clientX,
          y: event.clientY,
        },
        startPosition: position,
        startSize: size,
      };
      setIsResizing(true);
    };

  const handleResizePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const resizeState = resizeStateRef.current;

    if (!resizeState || resizeState.pointerId !== event.pointerId) {
      return;
    }

    scheduleResize(
      getResizedFrame(resizeState, {
        x: event.clientX,
        y: event.clientY,
      }),
    );
  };

  const stopResizing = (event: PointerEvent<HTMLDivElement>) => {
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
        "window-surface pointer-events-auto absolute flex overflow-hidden text-left text-slate-900 dark:text-slate-50",
        "border transition-shadow duration-150",
        !isMaximized && "window-shadow rounded-lg",
        isActive
          ? "border-sky-300/70 shadow-[0_26px_90px_rgba(15,23,42,0.28)] dark:border-sky-300/40"
          : "border-white/48 dark:border-white/14",
        isMaximized && "rounded-none border-transparent shadow-none",
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
        zIndex: isMaximized ? FULL_SCREEN_WINDOW_Z_INDEX : zIndex,
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
          onDoubleClick={handleTitlebarDoubleClick}
          onPointerDown={handleTitlebarPointerDown}
          onPointerMove={handleTitlebarPointerMove}
          onPointerUp={stopDragging}
          style={{ touchAction: "none" }}
        >
          <div className="flex w-[70px] shrink-0 items-center gap-2">
            <button
              aria-label="Close window"
              className="group/control grid size-3.5 shrink-0 place-items-center rounded-full border border-black/10 bg-[#ff5f57] text-red-950/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
              onClick={handleCloseClick}
              onPointerDown={handleClosePointerDown}
              title="Close"
              type="button"
            >
              <X
                aria-hidden="true"
                className={trafficLightIconClass}
                size={9}
                strokeWidth={3}
              />
            </button>
            <button
              aria-label="Minimize window"
              className="group/control grid size-3.5 shrink-0 place-items-center rounded-full border border-black/10 bg-[#febc2e] text-amber-950/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
              onClick={handleMinimizeClick}
              onPointerDown={handleControlPointerDown}
              title="Minimize"
              type="button"
            >
              <Minus
                aria-hidden="true"
                className={trafficLightIconClass}
                size={9}
                strokeWidth={3}
              />
            </button>
            <button
              aria-label={isMaximized ? "Exit full screen" : "Enter full screen"}
              className="group/control grid size-3.5 shrink-0 place-items-center rounded-full border border-black/10 bg-[#28c840] text-emerald-950/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]"
              onClick={handleMaximizeClick}
              onPointerDown={handleControlPointerDown}
              title={isMaximized ? "Exit full screen" : "Enter full screen"}
              type="button"
            >
              <Maximize2
                aria-hidden="true"
                className={trafficLightIconClass}
                size={8}
                strokeWidth={3}
              />
            </button>
          </div>
          <h2
            className="min-w-0 flex-1 truncate text-center text-sm font-bold"
            id={titleId}
          >
            {title}
          </h2>
          <span aria-hidden="true" className="w-[70px] shrink-0" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-[var(--color-surface-strong)] p-5">
          {children}
        </div>
      </div>

      {isMaximized ? null : resizeHandles.map((handle) => (
        <div
          aria-hidden="true"
          aria-label="Resize window"
          className={cn(
            "absolute z-30 hidden touch-none bg-transparent md:block",
            handle.className,
            isResizing && "select-none",
          )}
          key={handle.direction}
          onPointerCancel={stopResizing}
          onPointerDown={handleResizePointerDown(handle.direction)}
          onPointerMove={handleResizePointerMove}
          onPointerUp={stopResizing}
          style={{ touchAction: "none" }}
          tabIndex={-1}
        />
      ))}
    </motion.section>
  );
}

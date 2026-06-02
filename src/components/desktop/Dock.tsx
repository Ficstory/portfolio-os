"use client";

import {
  Bot,
  Code2,
  ExternalLink,
  FileText,
  FolderKanban,
  Mail,
  Route,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { type PointerEvent, useRef } from "react";

import { links } from "@/data/links";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { useDesktopStore } from "@/stores/desktopStore";
import type { FolderId, NavigationItem } from "@/types/portfolio";

const dockFolderIds = [
  "about",
  "career-tracks",
  "projects",
  "skills",
  "ai-chat",
  "resume",
  "contact",
] as const;

const BASE_DOCK_ICON_SIZE = 48;
const MAX_DOCK_ICON_SIZE = 66;
const DOCK_LIFT = -14;
const DOCK_EXTRA_GAP = 5;
const DOCK_MAGNIFICATION_DISTANCE = 136;
const DOCK_SPRING = {
  damping: 30,
  mass: 0.34,
  stiffness: 420,
};

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Code2,
  FileText,
  FolderKanban,
  Mail,
  Route,
  UserRound,
};

const dockControlClassName =
  "relative grid shrink-0 place-items-center rounded-[14px] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4f8fd9]";
const dockFallbackClassName =
  "border border-white/44 bg-white/62 text-slate-800 shadow-sm hover:bg-white/86 dark:border-white/14 dark:bg-slate-900/62 dark:text-slate-50 dark:hover:bg-slate-800/86";

function isDockFolderId(id: FolderId): id is (typeof dockFolderIds)[number] {
  return dockFolderIds.includes(id as (typeof dockFolderIds)[number]);
}

function getDockInfluence(
  mouseX: number,
  element: HTMLElement | null,
): number {
  if (!element || mouseX === Number.POSITIVE_INFINITY) {
    return 0;
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const distance = Math.abs(mouseX - centerX);

  return Math.max(0, 1 - distance / DOCK_MAGNIFICATION_DISTANCE);
}

function useDockItemMotion<TElement extends HTMLElement>(
  mouseX: MotionValue<number>,
  shouldReduceMotion: boolean,
) {
  const itemRef = useRef<TElement>(null);
  const size = useTransform(mouseX, (latest) => {
    const influence = getDockInfluence(latest, itemRef.current);

    return BASE_DOCK_ICON_SIZE + (MAX_DOCK_ICON_SIZE - BASE_DOCK_ICON_SIZE) * influence;
  });
  const y = useTransform(mouseX, (latest) => {
    const influence = getDockInfluence(latest, itemRef.current);

    return DOCK_LIFT * influence;
  });
  const gap = useTransform(mouseX, (latest) => {
    const influence = getDockInfluence(latest, itemRef.current);

    return DOCK_EXTRA_GAP * influence;
  });
  const smoothSize = useSpring(size, DOCK_SPRING);
  const smoothY = useSpring(y, DOCK_SPRING);
  const smoothGap = useSpring(gap, DOCK_SPRING);
  const style = shouldReduceMotion
    ? {
        height: BASE_DOCK_ICON_SIZE,
        width: BASE_DOCK_ICON_SIZE,
      }
    : {
        height: smoothSize,
        marginLeft: smoothGap,
        marginRight: smoothGap,
        width: smoothSize,
        y: smoothY,
      };

  return {
    ref: itemRef,
    style,
  };
}

function DockIconImage({ src }: { src: string }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="pointer-events-none size-full select-none object-contain drop-shadow-md"
      draggable={false}
      height={512}
      sizes={`${MAX_DOCK_ICON_SIZE}px`}
      src={src}
      width={512}
    />
  );
}

function DockButton({
  item,
  isOpen,
  mouseX,
  onOpen,
}: {
  item: NavigationItem;
  isOpen: boolean;
  mouseX: MotionValue<number>;
  onOpen: (item: NavigationItem) => void;
}) {
  const Icon = iconMap[item.iconName] ?? ExternalLink;
  const shouldReduceMotion = Boolean(useReducedMotion());
  const { ref, style } = useDockItemMotion<HTMLButtonElement>(
    mouseX,
    shouldReduceMotion,
  );
  const hasImageIcon = Boolean(item.dockIconSrc);

  return (
    <motion.button
      aria-label={`${item.label} 열기`}
      className={cn(
        dockControlClassName,
        hasImageIcon ? "bg-transparent" : dockFallbackClassName,
        isOpen && !hasImageIcon && "bg-white/90 dark:bg-slate-800/94",
      )}
      onClick={() => onOpen(item)}
      ref={ref}
      style={style}
      title={item.title}
      type="button"
    >
      {item.dockIconSrc ? (
        <DockIconImage src={item.dockIconSrc} />
      ) : (
        <Icon aria-hidden="true" size={23} strokeWidth={2.2} />
      )}
      {isOpen ? (
        <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#5dae8b] shadow-[0_0_0_3px_rgba(93,174,139,0.18)]" />
      ) : null}
    </motion.button>
  );
}

function DockExternalLink({
  dockIconSrc,
  mouseX,
}: {
  dockIconSrc: string;
  mouseX: MotionValue<number>;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const { ref, style } = useDockItemMotion<HTMLAnchorElement>(
    mouseX,
    shouldReduceMotion,
  );

  return (
    <motion.a
      aria-label="GitHub 열기"
      className={dockControlClassName}
      href={links.github}
      ref={ref}
      rel="noreferrer"
      style={style}
      target="_blank"
      title="GitHub"
    >
      <DockIconImage src={dockIconSrc} />
    </motion.a>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const openWindow = useDesktopStore((state) => state.openWindow);
  const restoreWindow = useDesktopStore((state) => state.restoreWindow);
  const windows = useDesktopStore((state) => state.windows);
  const dockItems = navigationItems.filter((item) => isDockFolderId(item.id));

  const handleOpen = (item: NavigationItem) => {
    const existingWindow = windows.find((window) => window.id === item.windowId);

    if (existingWindow?.isMinimized) {
      restoreWindow(item.windowId);
      return;
    }

    openWindow(item.windowId, item.title);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    mouseX.set(event.clientX);
  };

  const resetMagnification = () => {
    mouseX.set(Number.POSITIVE_INFINITY);
  };

  return (
    <nav
      aria-label="Dock"
      className="glass-surface dock-shadow flex h-[76px] items-center gap-2 rounded-[22px] px-4"
      onPointerCancel={resetMagnification}
      onPointerLeave={resetMagnification}
      onPointerMove={handlePointerMove}
    >
      {dockItems.map((item) => (
        <DockButton
          isOpen={windows.some((window) => window.id === item.windowId)}
          item={item}
          key={item.id}
          mouseX={mouseX}
          onOpen={handleOpen}
        />
      ))}

      <span
        aria-hidden="true"
        className="mx-1 h-10 w-px bg-slate-700/16 dark:bg-white/18"
      />

      <DockExternalLink dockIconSrc="/icons/dock/git.webp" mouseX={mouseX} />
    </nav>
  );
}

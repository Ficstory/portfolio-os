"use client";

import {
  ExternalLink,
  FileText,
  FolderKanban,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { links } from "@/data/links";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { useDesktopStore } from "@/stores/desktopStore";
import type { FolderId, NavigationItem } from "@/types/portfolio";

const dockFolderIds = ["about", "projects", "resume", "contact"] as const;

const iconMap: Record<string, LucideIcon> = {
  FileText,
  FolderKanban,
  Mail,
  UserRound,
};

function isDockFolderId(id: FolderId): id is (typeof dockFolderIds)[number] {
  return dockFolderIds.includes(id as (typeof dockFolderIds)[number]);
}

function DockButton({
  item,
  isOpen,
  onOpen,
}: {
  item: NavigationItem;
  isOpen: boolean;
  onOpen: (item: NavigationItem) => void;
}) {
  const Icon = iconMap[item.iconName] ?? ExternalLink;

  return (
    <button
      aria-label={`${item.label} 열기`}
      className={cn(
        "relative grid size-12 place-items-center rounded-md border border-white/44 bg-white/62 text-slate-800 shadow-sm transition hover:-translate-y-1 hover:bg-white/86 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4f8fd9] dark:border-white/14 dark:bg-slate-900/62 dark:text-slate-50 dark:hover:bg-slate-800/86",
        isOpen && "bg-white/90 dark:bg-slate-800/94",
      )}
      onClick={() => onOpen(item)}
      title={item.title}
      type="button"
    >
      <Icon aria-hidden="true" size={23} strokeWidth={2.2} />
      {isOpen ? (
        <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#5dae8b] shadow-[0_0_0_3px_rgba(93,174,139,0.18)]" />
      ) : null}
    </button>
  );
}

export function Dock() {
  const openWindow = useDesktopStore((state) => state.openWindow);
  const windows = useDesktopStore((state) => state.windows);
  const dockItems = navigationItems.filter((item) => isDockFolderId(item.id));

  const handleOpen = (item: NavigationItem) => {
    openWindow(item.windowId, item.title);
  };

  return (
    <nav
      aria-label="Dock"
      className="glass-surface dock-shadow flex h-[72px] items-center gap-3 rounded-[22px] px-4"
    >
      {dockItems.map((item) => (
        <DockButton
          isOpen={windows.some((window) => window.id === item.windowId)}
          item={item}
          key={item.id}
          onOpen={handleOpen}
        />
      ))}

      <span
        aria-hidden="true"
        className="mx-1 h-10 w-px bg-slate-700/16 dark:bg-white/18"
      />

      <a
        aria-label="GitHub 열기"
        className="grid size-12 place-items-center rounded-md border border-white/44 bg-white/62 text-slate-800 shadow-sm transition hover:-translate-y-1 hover:bg-white/86 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4f8fd9] dark:border-white/14 dark:bg-slate-900/62 dark:text-slate-50 dark:hover:bg-slate-800/86"
        href={links.github}
        rel="noreferrer"
        target="_blank"
        title="GitHub"
      >
        <ExternalLink aria-hidden="true" size={23} strokeWidth={2.2} />
      </a>
    </nav>
  );
}

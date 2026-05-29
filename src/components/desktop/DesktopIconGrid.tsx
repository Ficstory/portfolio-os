"use client";

import {
  Bot,
  Code2,
  FileText,
  Folder,
  FolderKanban,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { folders } from "@/data/folders";
import { useDesktopStore } from "@/stores/desktopStore";
import type { FolderId } from "@/types/portfolio";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Code2,
  FileText,
  FolderKanban,
  Mail,
  UserRound,
};

export function DesktopIconGrid() {
  const openWindow = useDesktopStore((state) => state.openWindow);

  const handleOpen = (id: FolderId) => {
    openWindow(id);
  };

  return (
    <nav
      aria-label="바탕화면 폴더"
      className="grid max-h-full w-full grid-cols-[repeat(auto-fill,84px)] content-start gap-x-5 gap-y-4"
    >
      {folders.map((folder) => {
        const Icon = iconMap[folder.iconName] ?? Folder;

        return (
          <DesktopIcon
            description={folder.description}
            icon={<Icon size={26} strokeWidth={2.1} />}
            id={folder.id}
            key={folder.id}
            label={folder.title}
            onOpen={handleOpen}
          />
        );
      })}
    </nav>
  );
}

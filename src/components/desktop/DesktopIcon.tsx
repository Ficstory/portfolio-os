"use client";

import type { KeyboardEvent, ReactNode } from "react";

import type { FolderId } from "@/types/portfolio";

export type DesktopIconProps = {
  id: FolderId;
  label: string;
  description: string;
  icon: ReactNode;
  onOpen: (id: FolderId) => void;
};

export function DesktopIcon({
  id,
  label,
  description,
  icon,
  onOpen,
}: DesktopIconProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onOpen(id);
  };

  return (
    <button
      aria-label={`${label} 폴더 열기`}
      className="group flex h-[92px] w-[84px] flex-col items-center justify-start gap-2 rounded-md px-1 py-2 text-center text-slate-900 transition hover:-translate-y-0.5 hover:bg-white/30 focus-visible:bg-white/38 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:text-white dark:hover:bg-white/10 dark:focus-visible:bg-white/14"
      onDoubleClick={() => onOpen(id)}
      onKeyDown={handleKeyDown}
      title={description}
      type="button"
    >
      <span
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-md border border-white/46 bg-white/62 text-[#4f8fd9] shadow-[0_10px_24px_rgba(15,23,42,0.14)] backdrop-blur-[18px] transition group-hover:bg-white/82 dark:border-white/14 dark:bg-slate-900/62 dark:text-[#8ab7ff]"
      >
        {icon}
      </span>
      <span className="max-h-10 overflow-hidden text-balance text-xs font-bold leading-5 drop-shadow-[0_1px_8px_rgba(255,255,255,0.72)] dark:drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
        {label}
      </span>
    </button>
  );
}

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

import { MobileSection } from "@/components/mobile/MobileSection";
import { folders } from "@/data/folders";
import { profile } from "@/data/profile";

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Code2,
  FileText,
  FolderKanban,
  Mail,
  UserRound,
};

export function MobileHome() {
  return (
    <section className="mobile-document min-h-screen px-4 py-5" id="mobile-home">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="rounded-lg border border-slate-200/80 bg-white/76 p-5 shadow-sm dark:border-white/12 dark:bg-slate-950/36">
          <p className="text-xs font-bold uppercase text-sky-700 dark:text-sky-200">
            Portfolio OS
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
            {profile.name}
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {profile.headline}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            모바일에서는 창을 끌어 움직이는 방식 대신 폴더별 문서 화면으로 탐색합니다.
          </p>
        </header>

        <nav aria-label="모바일 포트폴리오 섹션" className="space-y-3">
          {folders.map((folder) => {
            const Icon = iconMap[folder.iconName] ?? Folder;

            return (
              <a
                aria-label={`${folder.title} 열기`}
                className="flex min-h-20 w-full items-start gap-4 rounded-lg border border-slate-200/80 bg-white/72 p-4 text-left shadow-sm transition active:scale-[0.99] dark:border-white/12 dark:bg-slate-950/34"
                data-mobile-folder-card={folder.id}
                href={`#mobile-section-${folder.id}`}
                key={folder.id}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#dcebff] text-slate-800 dark:bg-white/10 dark:text-slate-100">
                  <Icon aria-hidden="true" size={23} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-slate-950 dark:text-white">
                    {folder.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted">
                    {folder.description}
                  </span>
                </span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 space-y-6">
        {folders.map((folder) => (
          <MobileSection key={folder.id} sectionId={folder.id} />
        ))}
      </div>
    </section>
  );
}

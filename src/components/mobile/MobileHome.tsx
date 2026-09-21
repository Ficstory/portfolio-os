"use client";

import {
  BookOpen,
  Code2,
  FileText,
  Folder,
  FolderKanban,
  Mail,
  Route,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { MobileSection } from "@/components/mobile/MobileSection";
import { usePortfolioTrack } from "@/components/portfolio/PortfolioTrackProvider";
import { folders } from "@/data/folders";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  FileText,
  FolderKanban,
  Mail,
  Route,
  UserRound,
};

export function MobileHome() {
  const { profile, track } = usePortfolioTrack();

  return (
    <section className="mobile-document min-h-screen px-4 py-5" id="mobile-home">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="rounded-lg border border-slate-200/80 bg-white/76 p-5 shadow-sm dark:border-white/12 dark:bg-slate-950/36">
          <p className="text-xs font-bold uppercase text-sky-700 dark:text-sky-200">
            Portfolio OS · {track.label}
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
            {profile.name}
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {profile.headline}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            아래에서 소개, 프로젝트, 이력서를 살펴보실 수 있습니다.
          </p>
        </header>

        <nav aria-label="모바일 포트폴리오 섹션" className="space-y-3">
          <Link
            aria-label="Future & Dream TIL 아카이브 열기"
            className="flex min-h-20 w-full items-start gap-4 rounded-lg border border-slate-200/80 bg-white/72 p-4 text-left shadow-sm transition active:scale-[0.99] dark:border-white/12 dark:bg-slate-950/34"
            href="/TIL/"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#ffe7eb] text-[#c9213b] dark:bg-[#e9364f]/20 dark:text-[#ff8c9c]">
              <BookOpen aria-hidden="true" size={23} strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold text-slate-950 dark:text-white">
                TIL Archive
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted">
                Future &amp; Dream Academy에서 배운 내용을 기록한 학습 아카이브.
              </span>
            </span>
          </Link>

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

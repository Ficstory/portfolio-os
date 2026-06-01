import type { Metadata } from "next";
import { Download, FileClock } from "lucide-react";

import { resumeSummary } from "@/content/resume-summary";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "이력서 요약 | Portfolio OS",
  description:
    "공공정책 분석과 SW·AI 프로젝트 경험을 연결한 서비스 기획 포트폴리오의 이력서 요약 페이지입니다.",
};

const resumePdf: { href: string; isReady: boolean } = {
  href: resumeSummary.pdfPath,
  isReady: false,
};

const projectTitleById = new Map(
  projects.map((project) => [project.id, project.title]),
);

export default function ResumePage() {
  return (
    <main className="wallpaper min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <article className="mx-auto w-full max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <header className="glass-surface window-shadow rounded-lg p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-normal text-muted">
                Resume Summary
              </p>
              <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">
                이력서 요약
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-200">
                {resumeSummary.headline}
              </p>
            </div>
          </header>

          <section
            aria-labelledby="resume-pdf-heading"
            className="glass-surface rounded-lg p-4"
          >
            <div className="flex items-center gap-2">
              <FileClock aria-hidden="true" size={18} />
              <h2
                id="resume-pdf-heading"
                className="text-sm font-bold text-slate-950 dark:text-white"
              >
                PDF 준비 중
              </h2>
            </div>
            <p
              id="resume-pdf-status"
              className="mt-2 max-w-sm text-sm leading-6 text-muted"
            >
              실제 PDF 파일은 아직 추가되지 않았습니다. 추후{" "}
              <code className="rounded bg-slate-950/6 px-1.5 py-0.5 text-xs dark:bg-white/10">
                public/resume/resume.pdf
              </code>
              가 준비되면 같은 경로로 다운로드를 활성화합니다.
            </p>

            {resumePdf.isReady ? (
              <a
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                download
                href={resumePdf.href}
              >
                <Download aria-hidden="true" size={16} />
                이력서 PDF 다운로드
              </a>
            ) : (
              <button
                aria-describedby="resume-pdf-status"
                className="mt-4 inline-flex min-h-10 w-full flex-wrap items-center justify-center gap-2 rounded-md border border-slate-200/80 bg-white/54 px-4 py-2 text-sm font-bold text-muted dark:border-white/12 dark:bg-white/8"
                disabled
                type="button"
              >
                <Download aria-hidden="true" size={16} />
                이력서 PDF 다운로드
                <span className="rounded-full bg-slate-950/8 px-2 py-0.5 text-xs dark:bg-white/12">
                  PDF 준비 중
                </span>
              </button>
            )}
          </section>
        </div>

        <section
          aria-labelledby="resume-strengths-heading"
          className="mt-9 space-y-4"
        >
          <h2
            id="resume-strengths-heading"
            className="text-lg font-bold text-slate-950 dark:text-white"
          >
            핵심 역량
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {resumeSummary.strengths.map((strength) => (
              <li
                className="rounded-lg border border-slate-200/80 bg-white/56 p-4 text-sm leading-6 text-slate-800 dark:border-white/12 dark:bg-slate-950/28 dark:text-slate-100"
                key={strength}
              >
                {strength}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="resume-projects-heading"
          className="mt-9 space-y-4"
        >
          <h2
            id="resume-projects-heading"
            className="text-lg font-bold text-slate-950 dark:text-white"
          >
            프로젝트 요약
          </h2>
          <div className="grid gap-3">
            {resumeSummary.projectHighlights.map((highlight) => (
              <article
                className="rounded-lg border border-slate-200/80 bg-white/52 p-4 dark:border-white/12 dark:bg-slate-950/24"
                key={highlight.projectId}
              >
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  {projectTitleById.get(highlight.projectId) ??
                    highlight.projectId}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  {highlight.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          <section
            aria-labelledby="resume-tech-heading"
            className="space-y-4"
          >
            <h2
              id="resume-tech-heading"
              className="text-lg font-bold text-slate-950 dark:text-white"
            >
              기술 요약
            </h2>
            <ul className="space-y-3">
              {resumeSummary.techSummary.map((item) => (
                <li className="text-sm leading-6 text-muted" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="resume-activities-heading"
            className="space-y-4"
          >
            <h2
              id="resume-activities-heading"
              className="text-lg font-bold text-slate-950 dark:text-white"
            >
              교육/활동 요약
            </h2>
            <ul className="space-y-3">
              {resumeSummary.educationAndActivities.map((item) => (
                <li className="text-sm leading-6 text-muted" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}

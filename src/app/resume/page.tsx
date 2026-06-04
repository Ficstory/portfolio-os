import type { Metadata } from "next";
import { Download } from "lucide-react";

import { resumeSummary } from "@/content/resume-summary";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "이력서 요약 | Portfolio OS",
  description:
    "공공정책 분석과 SW·AI 프로젝트 경험을 연결한 서비스 기획 포트폴리오의 이력서 요약 페이지입니다.",
};

const projectTitleById = new Map(
  projects.map((project) => [project.id, project.title]),
);

export default function ResumePage() {
  const hasResumePdf = resumeSummary.pdfPath.trim().length > 0;

  return (
    <main className="wallpaper min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <article className="mx-auto w-full max-w-5xl">
        <div
          className={
            hasResumePdf
              ? "grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
              : ""
          }
        >
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

          {hasResumePdf ? (
            <section
              aria-labelledby="resume-pdf-heading"
              className="glass-surface rounded-lg p-4"
            >
              <h2
                id="resume-pdf-heading"
                className="text-sm font-bold text-slate-950 dark:text-white"
              >
                PDF 이력서
              </h2>
              <a
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                download
                href={resumeSummary.pdfPath}
              >
                <Download aria-hidden="true" size={16} />
                이력서 PDF 다운로드
              </a>
            </section>
          ) : null}
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

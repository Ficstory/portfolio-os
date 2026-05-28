import { Download } from "lucide-react";

import { resumeSummary } from "@/content/resume-summary";
import { projects } from "@/data/projects";

const projectTitleById = new Map(
  projects.map((project) => [project.id, project.title]),
);

export function ResumeWindow() {
  const hasPdfPath = resumeSummary.pdfPath.trim().length > 0;

  return (
    <section className="space-y-5" aria-labelledby="resume-window-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h3
            id="resume-window-heading"
            className="text-xl font-bold text-slate-950 dark:text-white"
          >
            이력 요약
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-200">
            {resumeSummary.headline}
          </p>
        </div>

        {hasPdfPath ? (
          <a
            className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            download
            href={resumeSummary.pdfPath}
          >
            <Download aria-hidden="true" size={16} />
            이력서 PDF 다운로드
          </a>
        ) : (
          <button
            className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md border border-slate-200/80 bg-white/54 px-4 py-2 text-sm font-bold text-muted dark:border-white/12 dark:bg-white/8"
            disabled
            type="button"
          >
            <Download aria-hidden="true" size={16} />
            PDF 준비 중
          </button>
        )}
      </div>

      <section className="space-y-3" aria-labelledby="resume-strengths-heading">
        <h4
          id="resume-strengths-heading"
          className="text-sm font-bold text-slate-950 dark:text-white"
        >
          핵심 역량
        </h4>
        <ul className="grid gap-3 sm:grid-cols-3">
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

      <section className="space-y-3" aria-labelledby="resume-projects-heading">
        <h4
          id="resume-projects-heading"
          className="text-sm font-bold text-slate-950 dark:text-white"
        >
          프로젝트 요약
        </h4>
        <div className="space-y-3">
          {resumeSummary.projectHighlights.map((highlight) => (
            <article
              className="rounded-lg border border-slate-200/80 bg-white/52 p-4 dark:border-white/12 dark:bg-slate-950/24"
              key={highlight.projectId}
            >
              <h5 className="text-sm font-bold text-slate-950 dark:text-white">
                {projectTitleById.get(highlight.projectId) ?? highlight.projectId}
              </h5>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {highlight.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="space-y-3" aria-labelledby="resume-tech-heading">
          <h4
            id="resume-tech-heading"
            className="text-sm font-bold text-slate-950 dark:text-white"
          >
            기술 요약
          </h4>
          <ul className="space-y-2">
            {resumeSummary.techSummary.map((item) => (
              <li className="text-sm leading-6 text-muted" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3" aria-labelledby="resume-activities-heading">
          <h4
            id="resume-activities-heading"
            className="text-sm font-bold text-slate-950 dark:text-white"
          >
            교육 및 활동
          </h4>
          <ul className="space-y-2">
            {resumeSummary.educationAndActivities.map((item) => (
              <li className="text-sm leading-6 text-muted" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

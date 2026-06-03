import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ClipboardList, GitBranch, Network } from "lucide-react";

import type { Project } from "@/types/portfolio";

type PmProjectCardProps = {
  href: string;
  index: number;
  project: Project;
};

function SectionBlock({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section className="min-w-0 rounded-md border border-slate-200 bg-white p-3">
      <h4 className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-normal text-slate-500">
        {icon}
        <span className="min-w-0 break-words">{title}</span>
      </h4>
      {children}
    </section>
  );
}

export function PmProjectCard({ href, index, project }: PmProjectCardProps) {
  return (
    <Link
      aria-label={`${project.title} PM 사례 상세 보기`}
      className="group grid h-full min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200/90 bg-white text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] md:grid-rows-[auto_1fr_auto]"
      href={href}
    >
      <div className="min-w-0 border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <span className="max-w-full rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold uppercase tracking-normal text-sky-800">
            PM Case {String(index).padStart(2, "0")}
          </span>
          <span className="max-w-full break-words rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
            요구사항·화면·협업
          </span>
        </div>
        <h3 className="mt-4 text-pretty break-words text-2xl font-bold leading-tight text-slate-950">
          {project.title}
        </h3>
        <p className="mt-3 break-words text-sm leading-6 text-slate-700">
          {project.summary}
        </p>
      </div>

      <div className="min-w-0 space-y-3 p-4 sm:p-5">
        <SectionBlock
          icon={<ClipboardList aria-hidden="true" size={14} strokeWidth={2.4} />}
          title="Problem"
        >
          <p className="mt-2 break-words text-sm leading-6 text-slate-700">
            {project.problem}
          </p>
        </SectionBlock>

        <div className="grid gap-3 md:grid-cols-2">
          <SectionBlock
            icon={<Network aria-hidden="true" size={14} strokeWidth={2.4} />}
            title="PM Output"
          >
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-700">
              {project.implementationHighlights.slice(0, 2).map((highlight) => (
                <li className="flex gap-2" key={highlight}>
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500"
                  />
                  <span className="min-w-0 break-words">{highlight}</span>
                </li>
              ))}
            </ul>
          </SectionBlock>

          <SectionBlock
            icon={<GitBranch aria-hidden="true" size={14} strokeWidth={2.4} />}
            title="Collaboration Evidence"
          >
            <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-800">
              {project.valueStatement}
            </p>
            <p className="mt-2 break-words text-xs leading-5 text-slate-600">
              {project.troubleshooting[0]}
            </p>
          </SectionBlock>
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2 border-t border-slate-200 p-4 sm:p-5">
        {project.role.slice(0, 4).map((role) => (
          <span
            className="max-w-full break-words rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
            key={role}
          >
            {role}
          </span>
        ))}
        <span className="inline-flex basis-full items-center justify-end gap-1 text-xs font-bold text-sky-700 sm:ml-auto sm:basis-auto">
          상세 보기
          <ArrowRight aria-hidden="true" size={14} strokeWidth={2.4} />
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CircleDot, FileText, Route, Users } from "lucide-react";

import type { Project } from "@/types/portfolio";

type PublicServiceProjectCardProps = {
  href: string;
  index: number;
  project: Project;
};

function EvidenceBlock({
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

export function PublicServiceProjectCard({
  href,
  index,
  project,
}: PublicServiceProjectCardProps) {
  const requirementTranslation =
    project.implementationHighlights[0] ?? project.valueStatement;
  const userFlow = project.implementationHighlights[1] ?? project.summary;
  const policyContext =
    project.implementationHighlights[2] ?? project.troubleshooting[0] ?? project.valueStatement;

  return (
    <Link
      aria-label={`${project.title} 공공디지털 사례 상세 보기`}
      className="group grid h-full min-w-0 max-w-full overflow-hidden rounded-lg border border-emerald-200/80 bg-white text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] md:grid-rows-[auto_1fr_auto]"
      href={href}
    >
      <div className="min-w-0 border-b border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <span className="max-w-full break-words rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold uppercase tracking-normal text-emerald-800">
            Public Digital Case {String(index).padStart(2, "0")}
          </span>
          <span className="max-w-full break-words rounded-md border border-emerald-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
            문제정의·사용자흐름·요구사항
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
        <EvidenceBlock
          icon={<Users aria-hidden="true" size={14} strokeWidth={2.4} />}
          title="Problem Context"
        >
          <p className="mt-2 break-words text-sm leading-6 text-slate-700">
            {project.problem}
          </p>
        </EvidenceBlock>

        <div className="grid gap-3 md:grid-cols-2">
          <EvidenceBlock
            icon={<Route aria-hidden="true" size={14} strokeWidth={2.4} />}
            title="User Flow"
          >
            <p className="mt-2 break-words text-xs leading-5 text-slate-700">
              {userFlow}
            </p>
          </EvidenceBlock>

          <EvidenceBlock
            icon={<FileText aria-hidden="true" size={14} strokeWidth={2.4} />}
            title="Requirement Translation"
          >
            <p className="mt-2 break-words text-xs leading-5 text-slate-700">
              {requirementTranslation}
            </p>
          </EvidenceBlock>
        </div>

        <section className="rounded-md border border-emerald-100 bg-emerald-50/50 p-3">
          <h4 className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-normal text-emerald-800">
            <CircleDot aria-hidden="true" size={13} strokeWidth={2.5} />
            <span className="min-w-0 break-words">Public-sector Fit</span>
          </h4>
          <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-800">
            {project.valueStatement}
          </p>
          <p className="mt-2 break-words text-xs leading-5 text-slate-600">
            {policyContext}
          </p>
        </section>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2 border-t border-emerald-100 p-4 sm:p-5">
        {project.stack.slice(0, 4).map((tech) => (
          <span
            className="max-w-full break-words rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800"
            key={tech}
          >
            {tech}
          </span>
        ))}
        <span className="inline-flex basis-full items-center justify-end gap-1 text-xs font-bold text-emerald-800 sm:ml-auto sm:basis-auto">
          상세 보기
          <ArrowRight aria-hidden="true" size={14} strokeWidth={2.4} />
        </span>
      </div>
    </Link>
  );
}

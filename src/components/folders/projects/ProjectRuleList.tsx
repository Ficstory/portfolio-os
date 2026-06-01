import { Braces, CircleDot } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

import type {
  ProjectInspectorMethod,
  ProjectRule,
} from "./projectInspectorModel";

type ProjectRuleListProps = {
  project: Project;
  rules: ProjectRule[];
};

function getMethodClass(method: ProjectInspectorMethod) {
  if (method === "POST") {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-300/14 dark:text-emerald-100";
  }

  if (method === "PATCH") {
    return "bg-amber-100 text-amber-800 dark:bg-amber-300/14 dark:text-amber-100";
  }

  return "bg-sky-100 text-sky-800 dark:bg-sky-300/14 dark:text-sky-100";
}

function getStatusClass(statusCode: number) {
  if (statusCode >= 500) {
    return "border-amber-300/70 bg-amber-50 text-amber-800 dark:border-amber-300/24 dark:bg-amber-300/10 dark:text-amber-100";
  }

  if (statusCode === 204) {
    return "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/12 dark:bg-white/8 dark:text-slate-300";
  }

  if (statusCode >= 300) {
    return "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-300/24 dark:bg-violet-300/10 dark:text-violet-100";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-300/22 dark:bg-emerald-300/10 dark:text-emerald-100";
}

export function ProjectRuleList({ project, rules }: ProjectRuleListProps) {
  return (
    <section className="flex min-h-0 flex-col border-r border-slate-200/80 bg-white/74 dark:border-white/12 dark:bg-slate-900/30">
      <header className="border-b border-slate-200/80 px-4 py-4 dark:border-white/12">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-bold uppercase text-muted">
            <Braces aria-hidden="true" size={13} strokeWidth={2.2} />
            Project Inspector
          </span>
          <span className="min-w-0 truncate rounded-md bg-slate-900/6 px-2 py-1 font-mono text-[11px] font-semibold text-slate-600 dark:bg-white/8 dark:text-slate-300">
            {project.slug}
          </span>
        </div>
        <h3 className="truncate text-[18px] font-bold text-slate-950 dark:text-white">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-slate-700 dark:text-slate-200">
          {project.summary}
        </p>
        <p className="mt-3 rounded-md border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-[12px] leading-5 text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-200">
          {project.valueStatement}
        </p>
      </header>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {rules.map((rule) => (
          <article
            className="rounded-md border border-slate-200/82 bg-white/82 p-3 shadow-sm dark:border-white/12 dark:bg-white/6"
            key={rule.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[11px] font-black",
                      getMethodClass(rule.method),
                    )}
                  >
                    {rule.method}
                  </span>
                  <h4 className="truncate text-[13px] font-bold text-slate-950 dark:text-white">
                    {rule.label}
                  </h4>
                </div>
                <p className="mt-1 text-[12px] leading-5 text-muted">
                  {rule.description}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md border px-2 py-1 text-[11px] font-bold",
                  getStatusClass(rule.statusCode),
                )}
              >
                {rule.statusLabel}
              </span>
            </div>

            <ul className="mt-3 space-y-1.5">
              {rule.entries.map((entry) => (
                <li
                  className="flex gap-2 text-[12px] leading-5 text-slate-700 dark:text-slate-200"
                  key={entry}
                >
                  <CircleDot
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-slate-400 dark:text-slate-500"
                    size={12}
                    strokeWidth={2.2}
                  />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

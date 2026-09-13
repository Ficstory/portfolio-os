import {
  Activity,
  CheckCircle2,
  CircleDot,
  FileText,
  Link2,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

import type {
  ProjectActivityLog as ProjectActivityLogItem,
  ProjectActivityLogId,
  ProjectInspectorMethod,
} from "./projectInspectorModel";

type ProjectActivityLogProps = {
  project: Project;
  logs: ProjectActivityLogItem[];
  selectedLogId: ProjectActivityLogId;
  onSelectLog: (logId: ProjectActivityLogId) => void;
};

function getCodeClass(code: number) {
  if (code >= 500) {
    return "text-amber-700 dark:text-amber-200";
  }

  if (code === 204) {
    return "text-slate-500 dark:text-slate-300";
  }

  if (code >= 300) {
    return "text-violet-700 dark:text-violet-200";
  }

  return "text-emerald-700 dark:text-emerald-200";
}

function getMethodClass(method: ProjectInspectorMethod) {
  if (method === "POST") {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-300/14 dark:text-emerald-100";
  }

  if (method === "PATCH") {
    return "bg-amber-100 text-amber-800 dark:bg-amber-300/14 dark:text-amber-100";
  }

  return "bg-sky-100 text-sky-800 dark:bg-sky-300/14 dark:text-sky-100";
}

function getUniqueDetails(log: ProjectActivityLogItem) {
  return Array.from(
    new Set(
      log.details.filter((detail) => detail.trim() && detail !== log.summary),
    ),
  );
}

function formatShortList(entries: string[], fallback: string) {
  return entries.slice(0, 3).join(" / ") || fallback;
}

function getEvidenceStatus(project: Project) {
  return `${project.evidence.filter((item) => item.href).length}개 자료 링크`;
}

export function ProjectActivityLog({
  project,
  logs,
  selectedLogId,
  onSelectLog,
}: ProjectActivityLogProps) {
  const selectedLog = logs.find((log) => log.id === selectedLogId) ?? logs[0];

  if (!selectedLog) {
    return null;
  }

  return (
    <section className="flex min-h-0 flex-col bg-slate-50/70 dark:bg-slate-950/20">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 dark:border-white/12">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-100">
            <Activity aria-hidden="true" size={15} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-bold text-slate-950 dark:text-white">
              사례 목차
            </h3>
            <p className="truncate font-mono text-[11px] text-muted">
              /project/{project.slug}
            </p>
          </div>
        </div>
        <span className="rounded-md bg-white/80 px-2 py-1 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-200">
          {logs.length} topics
        </span>
      </header>

      <div className="min-h-0 flex-[1.05] overflow-auto">
        <div className="sticky top-0 z-10 grid grid-cols-[64px_74px_minmax(180px,1fr)] border-b border-slate-200/80 bg-slate-100/94 px-3 py-2 font-mono text-[11px] font-bold uppercase text-slate-500 dark:border-white/12 dark:bg-slate-950/92 dark:text-slate-400">
          <span>Code</span>
          <span>Method</span>
          <span>Path</span>
        </div>

        <div className="divide-y divide-slate-200/72 dark:divide-white/10">
          {logs.map((log) => {
            const isSelected = log.id === selectedLog.id;

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "grid w-full grid-cols-[64px_74px_minmax(180px,1fr)] items-center px-3 py-2 text-left transition",
                  "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#4f8fd9]",
                  isSelected
                    ? "bg-[#dcebff]/84 dark:bg-sky-300/14"
                    : "hover:bg-white/72 dark:hover:bg-white/8",
                )}
                key={log.id}
                onClick={() => onSelectLog(log.id)}
                type="button"
              >
                <span
                  className={cn(
                    "font-mono text-[12px] font-black",
                    getCodeClass(log.code),
                  )}
                >
                  {log.code}
                </span>
                <span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[11px] font-black",
                      getMethodClass(log.method),
                    )}
                  >
                    {log.method}
                  </span>
                </span>
                <span className="min-w-0 truncate font-mono text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                  {log.path}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-[220px] flex-[0.95] flex-col border-t border-slate-200/80 bg-white/72 dark:border-white/12 dark:bg-slate-900/24">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-3 py-2.5 dark:border-white/12">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-slate-900/6 text-slate-700 dark:bg-white/10 dark:text-slate-100">
              <FileText aria-hidden="true" size={14} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <h4 className="truncate text-[13px] font-bold text-slate-950 dark:text-white">
                Case brief
              </h4>
              <p className="truncate text-[11px] font-semibold text-muted">
                {selectedLog.label} focus
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-md bg-slate-900/6 px-2 py-1 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-200">
            Portfolio view
          </span>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="min-h-0 overflow-y-auto p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "font-mono text-[12px] font-black",
                  getCodeClass(selectedLog.code),
                )}
              >
                {selectedLog.code}
              </span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-[11px] font-black",
                  getMethodClass(selectedLog.method),
                )}
              >
                {selectedLog.method}
              </span>
              <span className="min-w-0 truncate font-mono text-[12px] font-semibold text-muted">
                {selectedLog.path}
              </span>
            </div>

            <p className="mt-3 text-[13px] leading-5 text-slate-800 dark:text-slate-100">
              {selectedLog.summary}
            </p>

            <ul className="mt-3 space-y-1.5">
              {getUniqueDetails(selectedLog).map((detail) => (
                <li
                  className="rounded-md border border-slate-200/80 bg-slate-50/86 px-2.5 py-2 text-[12px] leading-5 text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
                  key={detail}
                >
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-h-0 overflow-y-auto border-t border-slate-200/80 bg-slate-50/72 p-3 lg:border-l lg:border-t-0 dark:border-white/12 dark:bg-slate-950/38">
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-md border border-slate-200/80 bg-white/78 p-2.5 dark:border-white/10 dark:bg-white/6">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted">
                  <UserRound aria-hidden="true" size={12} strokeWidth={2.2} />
                  Role
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-slate-800 dark:text-slate-100">
                  {formatShortList(project.role.slice(0, 2), "역할 미정리")}
                </p>
              </div>

              <div className="rounded-md border border-slate-200/80 bg-white/78 p-2.5 dark:border-white/10 dark:bg-white/6">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted">
                  <CheckCircle2 aria-hidden="true" size={12} strokeWidth={2.2} />
                  Stack
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-slate-800 dark:text-slate-100">
                  {formatShortList(project.stack, "스택 미정리")}
                </p>
              </div>

              <div className="rounded-md border border-slate-200/80 bg-white/78 p-2.5 dark:border-white/10 dark:bg-white/6">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted">
                  <Link2 aria-hidden="true" size={12} strokeWidth={2.2} />
                  Evidence
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-slate-800 dark:text-slate-100">
                  {getEvidenceStatus(project)}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-md border border-slate-200/80 bg-white/78 p-3 dark:border-white/10 dark:bg-white/6">
              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900 dark:text-white">
                <CircleDot
                  aria-hidden="true"
                  className="text-sky-600 dark:text-sky-200"
                  size={13}
                  strokeWidth={2.2}
                />
                관련 자료
              </div>
              <p className="mt-2 text-[12px] leading-5 text-slate-700 dark:text-slate-200">
                <a className="font-semibold underline underline-offset-4" href={`/pm/${project.slug}/`}>시연과 상세 작업 보기 ↗</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

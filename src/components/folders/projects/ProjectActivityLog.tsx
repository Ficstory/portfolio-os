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

function hasProjectLinks(project: Project) {
  return Object.values(project.links).some(Boolean);
}

function formatShortList(entries: string[], fallback: string) {
  return entries.slice(0, 3).join(" / ") || fallback;
}

function getPortfolioNote(log: ProjectActivityLogItem, project: Project) {
  if (log.id === "role") {
    return `이 사례에서 맡은 범위는 ${formatShortList(project.role, "아직 정리되지 않았습니다")}. 역할 설명은 구현, 문서, 발표 등 실제 산출물과 연결됩니다.`;
  }

  if (log.id === "stack") {
    return `주요 기술은 ${formatShortList(project.stack, "아직 정리되지 않았습니다")}. 기술 목록은 선택한 작업 항목의 구현 방식과 협업 흐름을 보조합니다.`;
  }

  if (log.id === "implementation") {
    return `${project.implementationHighlights.length}개의 구현 하이라이트가 정리되어 있습니다. 기능명보다 의사결정과 산출물 중심으로 읽히게 구성했습니다.`;
  }

  if (log.id === "troubleshooting") {
    return `${project.troubleshooting.length}개의 제약 사항과 검증 포인트가 분리되어 있습니다. 확인된 성과와 재검증이 필요한 부분을 구분합니다.`;
  }

  if (log.id === "result") {
    return `${project.result.length}개의 결과 항목이 정리되어 있습니다. 현재 확인 가능한 산출물과 증빙 연결을 우선합니다.`;
  }

  if (log.id === "links") {
    return hasProjectLinks(project)
      ? "외부 링크가 등록되어 있어 평가자가 프로젝트 증빙으로 바로 확인할 수 있습니다."
      : "아직 외부 링크가 등록되지 않았습니다. 배포 URL 대신 GitHub, 화면 캡처, 시연 자료 같은 확인 가능한 증빙을 연결할 수 있습니다.";
  }

  return `${project.title}은 문제 배경, 담당 범위, 구현 기록, 결과를 한 화면에서 이어 볼 수 있도록 정리한 사례입니다.`;
}

function getEvidenceStatus(project: Project) {
  if (hasProjectLinks(project)) {
    return "증빙 링크 있음";
  }

  return "증빙 링크 미등록";
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
              Activity log
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
                Portfolio angle
              </div>
              <p className="mt-2 text-[12px] leading-5 text-slate-700 dark:text-slate-200">
                {getPortfolioNote(selectedLog, project)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

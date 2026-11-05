import { ClipboardList, GitBranch, Network } from "lucide-react";

import { pmArtifactStack } from "@/components/tracks/pm/pmLandingContent";

const icons = [ClipboardList, Network, GitBranch, ClipboardList] as const;

export function PmArtifactStack() {
  return (
    <div
      aria-label="PM 산출물 카드 예시"
      className="relative min-h-[420px] w-full min-w-0"
    >
      <div className="absolute inset-x-4 top-4 h-64 rounded-md border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.12)] sm:inset-x-8" />
      <div className="absolute inset-x-2 top-10 h-64 rotate-[-2deg] rounded-md border border-slate-200 bg-sky-50 shadow-[0_22px_60px_rgba(15,23,42,0.10)] sm:inset-x-5" />
      <div className="absolute inset-x-0 top-16 space-y-3 rounded-md border border-slate-200 bg-white p-4 shadow-[0_28px_70px_rgba(15,23,42,0.14)] sm:p-5">
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="min-w-0">
            <p className="break-words text-xs font-bold uppercase tracking-normal text-sky-700">
              PM Artifact Stack
            </p>
            <p className="mt-1 break-words text-sm font-bold text-slate-950">
              문제에서 출시 기준까지 한 흐름으로 정렬
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
            Draft
          </span>
        </div>

        {pmArtifactStack.map((artifact, index) => {
          const Icon = icons[index] ?? ClipboardList;

          return (
            <article
              className="grid min-w-0 grid-cols-[auto_1fr] gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
              key={artifact.title}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-sky-700 ring-1 ring-slate-200">
                <Icon aria-hidden="true" size={17} strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="break-words text-sm font-bold text-slate-950">
                    {artifact.title}
                  </h3>
                  <span className="break-words text-xs font-semibold text-slate-500">
                    {artifact.meta}
                  </span>
                </div>
                <ul className="mt-2 flex min-w-0 flex-wrap gap-1.5">
                  {artifact.points.map((point) => (
                    <li
                      className="max-w-full break-words rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200"
                      key={point}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

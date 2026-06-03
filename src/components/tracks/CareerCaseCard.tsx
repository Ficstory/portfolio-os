import { ExternalLink, FileText, Link as LinkIcon } from "lucide-react";

import type { CareerCase } from "@/data/careerCases";
import type { PortfolioTrackId } from "@/lib/portfolioTrack";

type CareerCaseCardProps = {
  careerCase: CareerCase;
  trackId: PortfolioTrackId;
  featured?: boolean;
};

type CareerDocumentCardProps = CareerCaseCardProps & {
  index: number;
};

const evidenceLevelLabel = {
  strong: "강한 증빙",
  medium: "보조 증빙",
  "needs-check": "검증 필요",
} as const;

const documentTrackLabel = {
  default: "공공 실무",
  publicDigital: "공공 실무",
  pm: "PM 배경",
  policy: "정책지원관",
  assembly: "국회 보좌",
} as const satisfies Record<PortfolioTrackId, string>;

function resolveRelevanceKey(trackId: PortfolioTrackId) {
  return trackId === "default" ? "publicDigital" : trackId;
}

function CareerCaseEvidenceLabel({
  evidence,
}: {
  evidence: CareerCase["evidence"][number];
}) {
  if (!evidence.href) {
    return <span>{evidence.publicLabel}</span>;
  }

  return (
    <a
      aria-label={`${evidence.publicLabel} ${
        evidence.linkLabel ?? "원문"
      } 새 창 열기`}
      className="inline-flex min-w-0 max-w-full flex-wrap items-center gap-x-1 font-semibold text-sky-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      href={evidence.href}
      rel="noreferrer"
      target="_blank"
    >
      <span className="min-w-0 break-words">{evidence.publicLabel}</span>
      <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-sky-600">
        {evidence.linkLabel ?? "원문"}
        <ExternalLink aria-hidden="true" size={12} strokeWidth={2.3} />
      </span>
    </a>
  );
}

function EvidenceLevelBadge({
  level,
}: {
  level: CareerCase["evidence"][number]["level"];
}) {
  return (
    <span className="rounded-sm bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
      {evidenceLevelLabel[level]}
    </span>
  );
}

export function CareerCaseCard({
  careerCase,
  featured = false,
  trackId,
}: CareerCaseCardProps) {
  const relevanceKey = resolveRelevanceKey(trackId);

  return (
    <article
      className={[
        "flex h-full min-w-0 max-w-full flex-col gap-4 rounded-lg border bg-white p-5 text-left shadow-sm",
        featured
          ? "border-sky-300 shadow-[0_18px_42px_rgba(15,23,42,0.11)]"
          : "border-slate-200/80",
      ].join(" ")}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
          Career Case
        </p>
        <h3 className="mt-2 text-pretty break-words text-xl font-bold text-slate-950">
          {careerCase.title}
        </h3>
      </div>

      <p className="break-words text-sm leading-6 text-slate-700">
        {careerCase.summary}
      </p>
      <p className="break-words text-sm font-semibold leading-6 text-slate-950">
        {careerCase.relevance[relevanceKey]}
      </p>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
          주요 작업
        </h4>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
          {careerCase.workHighlights.slice(0, 3).map((highlight) => (
            <li className="flex gap-2" key={highlight}>
              <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-sky-500" />
              <span className="min-w-0 break-words">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {careerCase.outputs.slice(0, 5).map((output) => (
          <span
            className="max-w-full break-words rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
            key={output}
          >
            {output}
          </span>
        ))}
      </div>

      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
        <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
          증빙 기준
        </h4>
        <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-600">
          {careerCase.evidence.slice(0, 2).map((evidence) => (
            <li className="min-w-0 break-words" key={`${careerCase.id}-${evidence.publicLabel}`}>
              <span className="font-bold text-slate-800">
                {evidenceLevelLabel[evidence.level]}
              </span>
              {" · "}
              <CareerCaseEvidenceLabel evidence={evidence} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function CareerDocumentCard({
  careerCase,
  featured = false,
  index,
  trackId,
}: CareerDocumentCardProps) {
  const relevanceKey = resolveRelevanceKey(trackId);
  const linkedEvidence = careerCase.evidence.filter((evidence) => evidence.href);
  const visibleEvidence =
    linkedEvidence.length > 0 ? linkedEvidence.slice(0, 3) : careerCase.evidence.slice(0, 2);

  return (
    <article
      className={[
        "grid min-w-0 max-w-full overflow-hidden rounded-lg border bg-white text-left shadow-sm md:grid-cols-[minmax(0,1fr)_18rem]",
        featured
          ? "border-sky-300 shadow-[0_18px_42px_rgba(15,23,42,0.11)]"
          : "border-slate-200/90",
      ].join(" ")}
    >
      <div className="min-w-0 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold uppercase tracking-normal text-sky-800">
            <FileText aria-hidden="true" size={14} strokeWidth={2.4} />
            <span className="min-w-0 break-words">
              Evidence Brief {String(index).padStart(2, "0")}
            </span>
          </span>
          <span className="max-w-full break-words rounded-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600">
            {documentTrackLabel[trackId]}
          </span>
        </div>

        <h3 className="mt-4 text-pretty break-words text-2xl font-bold leading-tight text-slate-950">
          {careerCase.title}
        </h3>
        <p className="mt-3 break-words text-sm leading-6 text-slate-700">
          {careerCase.summary}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <section>
            <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
              상황
            </h4>
            <p className="mt-2 break-words text-sm leading-6 text-slate-700">
              {careerCase.context}
            </p>
          </section>

          <section>
            <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
              직무 연결
            </h4>
            <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-950">
              {careerCase.relevance[relevanceKey]}
            </p>
          </section>
        </div>
      </div>

      <aside className="border-t border-slate-200 bg-slate-50 p-5 md:border-l md:border-t-0">
        <section>
          <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
            역할
          </h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {careerCase.role.slice(0, 5).map((role) => (
              <li
                className="max-w-full break-words rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                key={role}
              >
                {role}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
            산출물
          </h4>
          <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-700">
            {careerCase.outputs.slice(0, 4).map((output) => (
              <li className="flex gap-2" key={output}>
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500"
                />
                <span className="min-w-0 break-words">{output}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5 rounded-md border border-slate-200 bg-white p-3">
          <h4 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-normal text-slate-500">
            <LinkIcon aria-hidden="true" size={13} strokeWidth={2.4} />
            공개 증빙
          </h4>
          <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-600">
            {visibleEvidence.map((evidence) => (
              <li className="min-w-0" key={`${careerCase.id}-${evidence.publicLabel}`}>
                <EvidenceLevelBadge level={evidence.level} />
                <span className="ml-1.5">
                  <CareerCaseEvidenceLabel evidence={evidence} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </article>
  );
}

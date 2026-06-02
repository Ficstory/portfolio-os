import type { CareerCase } from "@/data/careerCases";
import type { PortfolioTrackId } from "@/lib/portfolioTrack";

type CareerCaseCardProps = {
  careerCase: CareerCase;
  trackId: PortfolioTrackId;
  featured?: boolean;
};

const evidenceLevelLabel = {
  strong: "강한 증빙",
  medium: "보조 증빙",
  "needs-check": "검증 필요",
} as const;

function resolveRelevanceKey(trackId: PortfolioTrackId) {
  return trackId === "default" ? "publicDigital" : trackId;
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
        "flex h-full flex-col gap-4 rounded-lg border bg-white p-5 text-left shadow-sm",
        featured
          ? "border-sky-300 shadow-[0_18px_42px_rgba(15,23,42,0.11)]"
          : "border-slate-200/80",
      ].join(" ")}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
          Career Case
        </p>
        <h3 className="mt-2 text-pretty text-xl font-bold text-slate-950">
          {careerCase.title}
        </h3>
      </div>

      <p className="text-sm leading-6 text-slate-700">{careerCase.summary}</p>
      <p className="text-sm font-semibold leading-6 text-slate-950">
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
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {careerCase.outputs.slice(0, 5).map((output) => (
          <span
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
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
            <li key={`${careerCase.id}-${evidence.publicLabel}`}>
              <span className="font-bold text-slate-800">
                {evidenceLevelLabel[evidence.level]}
              </span>
              {" · "}
              {evidence.publicLabel}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

import type { TrackLandingModel } from "@/components/tracks/trackLandingModel";

type TrackProofPanelProps = {
  model: TrackLandingModel;
};

export function TrackProofPanel({ model }: TrackProofPanelProps) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-[100vw] gap-6 px-5 py-10 md:max-w-6xl md:grid-cols-2 md:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
            Proof Focus
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            먼저 연결할 증빙
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {model.proofFocus.map((proof) => (
              <li className="flex gap-2" key={proof}>
                <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-sky-500" />
                <span>{proof}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
            Caution
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            표현 주의
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {model.cautionNotes.map((note) => (
              <li className="flex gap-2" key={note}>
                <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-[var(--color-coral)]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

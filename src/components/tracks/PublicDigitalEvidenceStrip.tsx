import { publicDigitalEvidenceItems } from "@/data/publicDigitalMethod";

export function PublicDigitalEvidenceStrip() {
  return (
    <section
      aria-labelledby="public-digital-evidence-strip"
      className="border-b border-slate-200 bg-sky-50/55"
      id="evidence-strip"
    >
      <div className="mx-auto w-full max-w-[100vw] px-5 py-6 md:max-w-6xl md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
              Evidence Strip
            </p>
            <h2
              className="mt-1 text-xl font-bold text-slate-950"
              id="public-digital-evidence-strip"
            >
              경력과 프로젝트에서 다룬 업무
            </h2>
          </div>

          <ul className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {publicDigitalEvidenceItems.map((item) => (
              <li
                className="flex min-w-0 items-center gap-2 rounded-md border border-sky-100 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                key={item}
              >
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-[var(--color-green)]"
                />
                <span className="min-w-0 break-words">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

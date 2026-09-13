import {
  publicDigitalLibraryItems,
  type PublicDigitalLibraryItem,
} from "@/data/publicDigitalMethod";

const libraryTypeLabel = {
  brief: "브리프",
  prd: "PRD",
  flow: "흐름 분석",
  checklist: "체크리스트",
  "case-note": "회의·작업 기록",
} as const satisfies Record<PublicDigitalLibraryItem["type"], string>;

const visibilityLabel = {
  public: "자료 열기 ↗",
  sanitized: "익명화 필요",
  internal: "내부 증빙",
} as const satisfies Record<PublicDigitalLibraryItem["visibility"], string>;

const visibilityClassName = {
  public: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  sanitized: "bg-sky-50 text-sky-800 ring-sky-100",
  internal: "bg-rose-50 text-rose-800 ring-rose-100",
} as const satisfies Record<PublicDigitalLibraryItem["visibility"], string>;

export function PublicDigitalEvidenceLibrary() {
  return (
    <section
      aria-labelledby="public-digital-library"
      className="border-y border-slate-200 bg-slate-50"
      id="evidence-library"
    >
      <div className="mx-auto w-full max-w-[100vw] px-5 py-10 md:max-w-6xl md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
              Evidence Library
            </p>
            <h2
              className="mt-2 text-2xl font-bold text-slate-950"
              id="public-digital-library"
            >
              프로젝트와 경력의 근거 자료
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              프로젝트 문서와 Git 기록, 경력증명서에서 관련 부분을 발췌·요약했습니다.
              각 자료에 원본의 이름과 확인 범위를 적었습니다.
            </p>
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="hidden grid-cols-[10rem_minmax(0,1fr)_8rem] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-normal text-slate-500 md:grid">
            <span>Type</span>
            <span>Document</span>
            <span>자료</span>
          </div>

          <ul className="divide-y divide-slate-200">
            {publicDigitalLibraryItems.map((item) => (
              <li
                className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[10rem_minmax(0,1fr)_8rem] md:items-start"
                key={item.title}
              >
                <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                  {libraryTypeLabel[item.type]}
                </span>
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-1 break-words text-sm leading-6 text-slate-700">
                    {item.summary}
                  </p>
                </div>
                <a href={item.href} target="_blank" rel="noreferrer"
                  className={`w-fit rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${visibilityClassName[item.visibility]}`}
                >
                  {visibilityLabel[item.visibility]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

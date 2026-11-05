import { publicDigitalMethodPhases } from "@/data/publicDigitalMethod";

export function PublicDigitalMethodSection() {
  return (
    <section
      aria-labelledby="public-digital-method"
      className="bg-white"
      id="method-framework"
    >
      <div className="mx-auto w-full max-w-[100vw] px-5 py-10 md:max-w-6xl md:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
              Method Framework
            </p>
            <h2
              className="mt-2 text-2xl font-bold text-slate-950"
              id="public-digital-method"
            >
              자료 읽기에서 구현 협업 문서까지의 흐름
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              방법론은 별도의 장식이 아니라 산출물의 순서입니다. 공공자료의
              쟁점을 요구사항, 화면 흐름, 협업 기준으로 바꾸는 단계를 한
              화면에서 확인할 수 있게 배치했습니다.
            </p>
          </div>

          <ol className="grid min-w-0 gap-3 sm:grid-cols-2">
            {publicDigitalMethodPhases.map((phase, index) => (
              <li
                className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4"
                key={phase.title}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sm font-bold text-sky-800">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-bold text-slate-950">
                      {phase.title}
                    </h3>
                    <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                      {phase.description}
                    </p>
                    <p className="mt-3 break-words text-xs font-bold uppercase tracking-normal text-emerald-700">
                      Output · {phase.output}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

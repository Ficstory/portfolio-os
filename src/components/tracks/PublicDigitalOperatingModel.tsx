import { publicDigitalOperatingSteps } from "@/data/publicDigitalMethod";

export function PublicDigitalOperatingModel() {
  return (
    <section
      aria-labelledby="public-digital-operating-model"
      className="bg-white"
      id="operating-model"
    >
      <div className="mx-auto w-full max-w-[100vw] px-5 py-10 md:max-w-6xl md:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
            Operating Model
          </p>
          <h2
            className="mt-2 text-2xl font-bold text-slate-950"
            id="public-digital-operating-model"
          >
            자료 조사와 개발에서 맡은 작업
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            부산참여연대에서는 예산·결산 자료와 의회 활동을 조사했습니다.
            이후 팀 프로젝트에서는 설문, 요구사항 문서, 화면 구현을 맡았습니다.
            각 경험에서 직접 수행한 작업을 정리했습니다.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-5">
          {publicDigitalOperatingSteps.map((step, index) => (
            <article
              className="flex min-w-0 flex-col rounded-md border border-slate-200 bg-slate-50 p-4"
              key={step.title}
            >
              <span className="text-xs font-bold uppercase tracking-normal text-sky-700">
                작업 {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 break-words text-lg font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 break-words text-sm leading-6 text-slate-700">
                {step.summary}
              </p>

              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
                  산출물
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-700">
                  {step.deliverables.map((deliverable) => (
                    <li className="flex gap-2" key={deliverable}>
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500"
                      />
                      <span className="min-w-0 break-words">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
                  증빙
                </h4>
                <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-800">
                  {step.evidence.join(" · ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

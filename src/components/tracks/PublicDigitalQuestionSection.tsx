import { publicDigitalQuestions } from "@/data/publicDigitalMethod";

export function PublicDigitalQuestionSection() {
  return (
    <section
      aria-labelledby="public-digital-questions"
      className="border-y border-slate-200 bg-slate-50"
      id="public-service-questions"
    >
      <div className="mx-auto w-full max-w-[100vw] px-5 py-10 md:max-w-6xl md:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
            Public Service Questions
          </p>
          <h2
            className="mt-2 text-2xl font-bold text-slate-950"
            id="public-digital-questions"
          >
            구현 후 더 확인할 질문
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            현재 자료만으로 답하기 어려운 질문입니다. 아래는 사용자 검증을
            이어간다면 확인하고 싶은 항목과 방법입니다.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {publicDigitalQuestions.map((item, index) => (
            <article
              className="min-w-0 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
              key={item.question}
            >
              <span className="text-xs font-bold uppercase tracking-normal text-sky-700">
                Q{index + 1}
              </span>
              <h3 className="mt-2 break-words text-lg font-bold leading-7 text-slate-950">
                {item.question}
              </h3>

              <div className="mt-4 space-y-4">
                <section>
                  <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    확인 방법
                  </h4>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                    {item.approach}
                  </p>
                </section>

                <section>
                  <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    기록할 항목
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {item.deliverables.map((deliverable) => (
                      <li
                        className="max-w-full break-words rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800"
                        key={deliverable}
                      >
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    관련 프로젝트
                  </h4>
                  <p className="mt-2 break-words text-xs font-semibold leading-5 text-slate-800">
                    {item.evidence.join(" · ")}
                  </p>
                </section>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

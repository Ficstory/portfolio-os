import Link from "next/link";

import { links } from "@/data/links";

export function PublicDigitalFinalCta() {
  return (
    <section
      aria-labelledby="public-digital-final-cta"
      className="bg-white"
      id="public-digital-contact"
    >
      <div className="mx-auto w-full max-w-[100vw] px-5 py-10 md:max-w-6xl md:px-8">
        <div className="rounded-md border border-sky-200 bg-sky-50 p-5 md:p-7">
          <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
            Next Step
          </p>
          <h2
            className="mt-2 max-w-3xl text-2xl font-bold text-slate-950"
            id="public-digital-final-cta"
          >
            프로젝트와 경력에 대해 이야기 나누고 싶습니다
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
            부산이음길 상세에는 사용자별 화면, 글자 크기 설정, 제보 지도 구현을 담았습니다.
            경력과 다른 프로젝트는 이력서에서 함께 확인하실 수 있습니다.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="rounded-md bg-slate-950 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]"
              href="/projects/busan-eumgil"
            >
              부산이음길 사례 보기
            </Link>
            <Link
              className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 transition hover:border-sky-400 hover:text-sky-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]"
              href="/resume"
            >
              이력서 보기
            </Link>
            <a
              className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 transition hover:border-sky-400 hover:text-sky-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]"
              href={links.email}
            >
              메일 보내기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

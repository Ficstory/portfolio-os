import Link from "next/link";

const trackLinks = [
  {
    href: "/public-digital",
    label: "공공·디지털 서비스기획",
    summary:
      "이동약자 길안내 앱의 문서·화면 작업과 공공자료 분석 경험을 소개합니다.",
    evidence: "부산이음길, 부산참여연대 공공자료 분석, AEKKIM",
  },
  {
    href: "/pm",
    label: "주니어 PM / APM",
    summary:
      "네 개 팀 프로젝트에서 맡은 조사, 요구사항 문서, 화면·API 구현을 소개합니다.",
    evidence: "AEKKIM, 부산이음길, 웃지마게임, Play Pick",
  },
  {
    href: "/policy",
    label: "정책지원관",
    summary:
      "부산참여연대에서 맡은 예산·결산 분석과 의정평가, 행정사무감사 의제 취합 업무를 소개합니다.",
    evidence: "부산참여연대, 행감 의제, 조례·예산 분석, 정책문서 작성",
  },
  {
    href: "/assembly",
    label: "국회 보좌관",
    summary:
      "지방의회 활동을 조사하고 보고서·발제·대외 설명 자료를 작성한 경험을 소개합니다.",
    evidence: "의정감시, 회기 모니터링, 평가보고서, 발제·인터뷰",
  },
] as const;

export function TrackLinkPanel() {
  return (
    <section className="space-y-5">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-normal text-sky-700 dark:text-sky-200">
          Direct Portfolio Links
        </p>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Career Tracks
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            관심 있는 직무별로 프로젝트와 경력을 살펴볼 수 있습니다.
          </p>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {trackLinks.map((track) => (
          <Link
            className="group flex h-full flex-col gap-3 rounded-lg border border-slate-200/80 bg-white/72 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] dark:border-white/12 dark:bg-slate-950/34 dark:hover:border-sky-300/40 dark:hover:bg-slate-900/68"
            href={track.href}
            key={track.href}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {track.label}
              </h3>
              <span
                aria-hidden="true"
                className="mt-1 size-2.5 shrink-0 rounded-full bg-[var(--color-green)] shadow-[0_0_0_4px_rgba(93,174,139,0.14)]"
              />
            </div>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
              {track.summary}
            </p>
            <p className="mt-auto rounded-md bg-sky-50 px-3 py-2 text-xs font-bold leading-5 text-sky-800 dark:bg-sky-300/12 dark:text-sky-100">
              {track.evidence}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

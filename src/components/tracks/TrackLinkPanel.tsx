import Link from "next/link";

const trackLinks = [
  {
    href: "/public-digital",
    label: "공공·디지털 서비스기획",
    summary:
      "공공 문제를 사용자 요구, 서비스 흐름, 요구사항, 기능 기준으로 번역하는 트랙입니다.",
    evidence: "부산이음길, 부산참여연대 공공자료 분석, AEKKIM",
  },
  {
    href: "/pm",
    label: "주니어 PM / APM",
    summary:
      "요구사항, 화면 흐름, MVP 범위, 팀 협업 기준을 정리하는 트랙입니다.",
    evidence: "AEKKIM, 부산이음길, 웃지마게임, 문서화 경험",
  },
  {
    href: "/policy",
    label: "정책지원관",
    summary:
      "조례·예산·행정사무감사·지역 의제를 정책 문서와 의정지원 자료로 구조화하는 트랙입니다.",
    evidence: "부산참여연대, 행감 의제, 조례·예산 분석, 정책문서 작성",
  },
  {
    href: "/assembly",
    label: "국회 보좌관",
    summary:
      "공공 이슈를 조사하고 입법·상임위·질의·메시지 자료로 정리하는 트랙입니다.",
    evidence: "의정감시, 회기 모니터링, 보도자료·논평, 이슈 브리프",
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
            루트 포트폴리오는 통합 OS 허브로 유지하고, 지원서에는 아래 직무별 URL을 직접 첨부합니다.
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

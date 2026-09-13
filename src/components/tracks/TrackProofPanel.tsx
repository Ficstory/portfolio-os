import type { TrackLandingModel } from "@/components/tracks/trackLandingModel";

export function TrackProofPanel({ model }: { model: TrackLandingModel }) {
  const isCareer = model.primaryCaseKind === "career";
  const documents = isCareer ? [
    ["/pm/sources/career-scope.txt", "부산참여연대 경력·담당 업무 요약"],
    ["/resume", "프로젝트·교육을 포함한 이력서"],
  ] : [
    ["/pm/sources/busan-contribution.txt", "부산이음길 요구사항·개인 구현 기록"],
    ["/pm/sources/aekkim-requirements.txt", "애낌 요구사항정의서 발췌"],
    ["/pm/sources/smile-decisions.txt", "웃지마게임 회의·역할 기록"],
  ];
  return <section className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid w-full max-w-[100vw] gap-6 px-5 py-10 md:max-w-6xl md:grid-cols-2 md:px-8">
      <div><p className="text-xs font-bold uppercase tracking-normal text-sky-700">Documents</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">관련 자료</h2>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">{documents.map(([href,label]) =>
          <li key={href}><a href={href} className="font-semibold text-sky-700 underline underline-offset-4">{label}</a></li>)}</ul>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-bold uppercase tracking-normal text-slate-500">Contact</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">경험에 대해 더 이야기 나누고 싶습니다</h2>
        <p className="mt-4 text-sm leading-6 text-slate-700">담당 업무와 프로젝트에 관한 질문은 이메일로 보내 주세요.</p>
        <a className="mt-3 inline-block break-all text-sm font-semibold text-sky-700 underline underline-offset-4" href="mailto:dlwo4367@gmail.com">dlwo4367@gmail.com</a>
      </div>
    </div>
  </section>;
}

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { selectedProjects, type PmProject } from "./content";
import { ProjectVisual } from "./PmVisuals";
import styles from "./pm.module.css";

const cases = {
  "busan-eumgil": {
    problemTitle: "거리만으로는 이동 가능성을 설명할 수 없었습니다.",
    problem: "보행약자는 경사와 단차, 접근 가능한 시설이 필요하고 저시력자는 안내 방식부터 달라야 합니다. 부산의 지형과 사용자 조건을 함께 고려하는 길안내를 목표로 했습니다.",
    decisionTitle: "사용자 유형을 먼저 나누고, 안내 흐름을 설계했습니다.",
    decision: "사용자 유형에 따라 온보딩과 화면군을 나누고, 보행약자에게는 경로와 접근성 시설을, 저시력자에게는 큰 선택지와 음성 안내를 연결했습니다. 경로의 상태를 사용자에게 어떻게 설명할지도 설계 범위에 넣었습니다.",
    result: "원본 README와 시연 자료에서 사용자 유형 선택, 저시력자 전용 흐름, 글씨 크기 설정과 경로 검색 화면을 확인했습니다. 기획·사용자 흐름 정리와 프론트엔드 구현 참여를 개인 기여로 두고, 앱 전체는 팀 산출물로 구분합니다.",
    limit: "시연 화면은 UI 구현을 보여주는 자료입니다. 실제 이동약자와 저시력자를 대상으로 한 사용성 검증, 경로별 통행 검증 결과는 이번에 확인하지 못했습니다. 경로 안내 화면이 있다는 이유로 안전한 통행이 보장된다고 해석하지 않습니다.",
    source: "/pm/sources/busan-readme.txt",
    sourceLabel: "원본 README 기능 설명 발췌",
  },
  "smile-game": {
    problemTitle: "재미있다는 반응이 곧 참여 의향은 아니었습니다.",
    problem: "실시간 화상 게임은 얼굴을 공개하고 낯선 상대를 만나는 부담이 있습니다. 아이디어의 흥미와 실제 참여의 조건을 분리해서 확인할 필요가 있었습니다.",
    decisionTitle: "기능을 늘리기 전에, 참여를 망설이는 이유를 봤습니다.",
    decision: "설문 분석 보고서는 친구·지인과의 매칭, 녹화·저장 방지, 얼굴 가림 같은 참여 조건을 제안했습니다. 설문과 피드백을 바탕으로 MVP 방향과 화면 범위를 다시 정리한 것이 이 사례의 핵심입니다. 제안된 보호 기능이 모두 구현됐다는 의미는 아닙니다.",
    result: "분석 리포트의 Q9에서 매우 부담됨 56명, 꽤 부담됨 56명, 조금 부담됨 35명, 보통 13명, 전혀 부담 없음 8명을 확인했습니다. 총 168명 중 꽤·매우 부담은 112명(66.7%), 조금 부담까지 포함하면 147명(87.5%)입니다.",
    limit: "위 비율은 항목별 반올림 비율의 합이 아닌 응답 수로 재계산했습니다. 응답 원데이터와 설문 폼은 확보하지 못했고, 분석 PDF에 기록된 수치를 확인했습니다. 보고서상 24~29세와 남성 응답의 비중이 높아 전체 사용자에게 일반화하기 어렵습니다. 서비스 성공률이나 개선율로 사용하지 않습니다.",
    source: "/pm/sources/smile-survey.txt",
    sourceLabel: "설문 분석 리포트 Q9와 조사 범위 발췌",
  },
  "play-pick": {
    problemTitle: "공연 정보의 항목을 탐색 기준으로 바꿨습니다.",
    problem: "장르, 일정, 장소와 사용자 취향이 흩어져 있으면 공연을 탐색하고 비교하기 어렵습니다. 콘텐츠 데이터를 서비스에서 활용할 수 있는 구조로 정리하는 것이 출발점이었습니다.",
    decisionTitle: "화면과 API가 같은 공연 정보를 다루게 했습니다.",
    decision: "Vue.js 화면과 Django REST API를 연결하며 공연 목록·상세와 추천·커뮤니티의 탐색 흐름을 다뤘습니다. 기획에서 개발과 배포까지 경험한 프로젝트로, 데이터 구조화와 API 연동에 초점을 맞춥니다.",
    result: "기존 프로젝트 기록에서 기획·개발·REST API 연동·배포 경험을 확인했습니다. PM 총괄 사례로 확대하지 않고, 구현 과정에서 데이터와 화면의 연결을 경험한 보조 사례로 소개합니다.",
    limit: "현재 서비스의 운영 여부, 추천의 품질, 사용자 지표는 확인되지 않았습니다. 제품 화면과 API 예시, 세부 기여를 확인할 원본 자료는 추가 정리가 필요합니다.",
    source: "/projects/play-pick/",
    sourceLabel: "기존 프로젝트 상세 기록",
  },
} as const;

export function PmSupportingCase({ project }: { project: PmProject }) {
  const content = cases[project.slug as keyof typeof cases];
  const index = selectedProjects.findIndex((item) => item.slug === project.slug);
  const next = selectedProjects[(index + 1) % selectedProjects.length];
  return <main id="pm-content" tabIndex={-1} className={styles.container}>
    <section className={styles.caseHero} aria-labelledby="case-title"><Link className={styles.backLink} href="/pm/#work"><ArrowLeft size={16} aria-hidden="true" />선택한 작업으로</Link><p className={styles.eyebrow}>{project.name} · {project.category}</p><h1 id="case-title">{project.title[0]}<br />{project.title[1]}</h1><p className={styles.caseLead}>{project.summary}</p><p className={styles.note}>{project.contribution}</p></section>
    {project.slug !== "play-pick" && <figure><ProjectVisual slug={project.slug} /><figcaption>{project.caption}</figcaption></figure>}
    <div className={styles.supportingBody}>
      <section className={styles.caseSection}><p className={styles.sectionLabel}>상황과 문제</p><h2>{content.problemTitle}</h2><p>{content.problem}</p></section>
      <section className={styles.caseSection}><p className={styles.sectionLabel}>판단과 실행</p><h2>{content.decisionTitle}</h2><p>{content.decision}</p></section>
      <section className={styles.caseSection}><p className={styles.sectionLabel}>확인된 결과와 한계</p><h2>확인한 범위에서 설명합니다.</h2><p>{content.result}</p><p>{content.limit}</p><a className={styles.sourceLink} href={content.source}>{content.sourceLabel}<ArrowUpRight size={16} aria-hidden="true" /></a></section>
    </div>
    <div className={styles.nextProject}><p>다음 프로젝트</p><Link href={`/pm/${next.slug}/`}>{next.name}<ArrowUpRight aria-hidden="true" /></Link></div>
  </main>;
}

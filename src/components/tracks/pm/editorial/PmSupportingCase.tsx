import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { selectedProjects, type PmProject } from "./content";
import { ProjectVisual, SurveyVisual } from "./PmVisuals";
import styles from "./pm.module.css";

const cases = {
  "busan-eumgil": {
    facts: ["2026.04–05", "7인 팀 · FE·문서 담당"],
    sections: [
      { label: "사용자와 서비스 범위", title: "보행 조건과 화면을 읽는 조건을 나눴습니다.", paragraphs: [
        "부산이음길은 경사·계단·단차와 접근성 시설 정보를 함께 살펴보며 목적지를 찾는 Android 앱입니다. 팀은 휠체어 사용자 등 보행약자와 저시력자를 주요 대상으로 정했습니다.",
        "보행약자 화면은 지도에서 시설과 경로를 비교하는 데 초점을 맞췄습니다. 저시력자 화면은 큰 버튼과 적은 수의 선택지, 음성 입력·안내를 중심으로 구성했습니다. 두 유형은 온보딩 이후 서로 다른 홈으로 진입합니다.",
      ] },
      { label: "맡은 작업", title: "명세 갱신과 글자 크기 설정, 제보 표시를 맡았습니다.", paragraphs: [
        "저는 기획 문서와 Android 화면 작업에 참여했습니다. PRD·기능명세·화면명세에 제보 사진 업로드와 처리 상태의 노출 조건을 반영하고, 요구사항명세서에는 구현된 화면과 데이터·API의 추가 확인 항목을 구분해 적었습니다.",
        "글자 크기는 기본·크게·아주 크게 중 선택하면 저장해 앱에 적용하도록 구현했습니다. 마이페이지에서 다시 설정할 수 있게 연결하고, 글자를 키웠을 때 바로가기 영역이 대응하도록 수정했습니다.",
        "지도에서는 승인된 제보를 시설 마커와 별도 레이어로 표시하고 제보 내용을 여는 하단 패널을 연결했습니다. 장소 정보와 사용자가 올린 제보를 화면에서 구분하는 작업입니다.",
      ] },
      { label: "협업과 구현 제약", title: "화면 표시와 경로 데이터의 책임을 구분했습니다.", paragraphs: [
        "앱에는 ‘안전한 길’과 최단 경로를 비교하는 화면이 있습니다. 제가 다룬 것은 화면·명세와 API 연동이며, 경로 계산과 공간 데이터 구축은 팀의 백엔드·AI 작업입니다. 5월 20일 요구사항명세서에도 경로 계산 품질과 운영 데이터 범위를 별도 확인 대상으로 남겼습니다.",
        "사용자 유형별 흐름은 원본 온보딩 시연에서, 글자 크기 설정과 제보 표시는 구현 코드에서 확인할 수 있습니다. 실제 이동약자 대상 사용성 시험이나 현장 통행 검증 결과는 현재 제시할 자료가 없습니다.",
      ] },
    ],
    sources: [["/pm/sources/busan-readme.txt", "사용자 유형별 서비스 흐름"], ["/pm/sources/busan-contribution.txt", "요구사항·개인 구현 기록 발췌"]],
  },
  "smile-game": {
    facts: ["2026.01–02", "7인 팀 · PM·FE 담당"],
    sections: [
      { label: "조사에서 확인한 문제", title: "재미에 대한 반응과 참여 부담은 달랐습니다.", paragraphs: [
        "웃지마게임은 서로의 표정을 보며 웃음을 참는 실시간 화상 대결 서비스입니다. 저는 팀의 시장조사를 취합하고 설문을 설계했습니다. 1월 13~14일에 받은 응답 168건을 분석해 기획서와 기능명세서에 반영했습니다.",
        "서비스가 흥미롭다는 응답은 92명이었지만, 해볼 의향이 있다는 응답은 75명이었습니다. 얼굴 공개가 ‘꽤’ 또는 ‘매우’ 부담된다는 응답은 112명(66.7%)이었습니다. 아이디어에 대한 반응만으로 참여를 기대하기 어려웠습니다.",
      ] },
      { label: "기획 변경과 구현", title: "친구 초대방을 먼저 만들기로 했습니다.", paragraphs: [
        "1월 14일 팀 회의에서 친구·지인 매칭을 우선하고 랜덤 매칭을 함께 제공하기로 결정했습니다. 로그인과 준비 버튼을 필수 흐름에 포함하고, 방 기능을 먼저 만든 뒤 랜덤 매칭을 추가하는 순서로 정했습니다.",
        "저는 이 논의를 회의록과 기획·기능명세에 정리했습니다. 개발에서는 친구 초대방 생성·입장·대기실 화면을 구현하고, 초대한 상대가 보이지 않는 문제와 매칭 화면의 통신 연동 오류를 수정했습니다.",
      ] },
      { label: "AI 판정과 게임 경험", title: "판정을 납득할 수 있는지도 기획에 포함했습니다.", paragraphs: [
        "웃음 감지가 승패를 결정하므로, 오판이나 지연은 게임 진행에 직접 영향을 줍니다. 설문에서는 판정 순간 리플레이와 사전 기준 설명을 원하는 응답이 나왔고, 기획서에는 판정 불만에 대한 대응으로 이를 담았습니다. 컨설턴트 회의에서는 실시간 처리가 어려울 때 턴 종료 후 판정하는 대안도 논의했습니다.",
        "웃음 감지 모델 개발은 양한빈 팀원이, 배틀 화면의 AI 판정 연동은 박세홍 팀원이 맡았습니다. 저는 조사·기획 문서와 초대방 구현을 담당했습니다. 리플레이·필터 등은 기획 항목이며, 위 영상은 준비와 게임 시작까지를 보여줍니다.",
      ] },
      { label: "남은 결과", title: "친구 초대 흐름과 조사·결정 기록이 남았습니다.", paragraphs: [
        "설문 분석, 기획서, 기능명세와 회의록 6건, 초대방 구현·시연을 남겼습니다. 설문에서 확인한 참여 부담을 팀의 기능 우선순위에 반영하고 실제 화면까지 구현한 경험입니다.",
        "조사는 출시 전 사용 의향 조사입니다. 24~29세와 남성 응답 비중이 높으며, 수치는 보관된 분석 PDF를 기준으로 합니다. 출시 후 참여율·재대결률이나 모델 정확도의 사용자 검증 결과는 제시할 자료가 없습니다.",
      ] },
    ],
    sources: [["/pm/sources/smile-survey.txt", "설문 분석 보고서 발췌"], ["/pm/sources/smile-decisions.txt", "기획 변경·역할·구현 기록 발췌"]],
  },
} as const;

export function PmSupportingCase({ project }: { project: PmProject }) {
  const content = cases[project.slug as keyof typeof cases];
  const index = selectedProjects.findIndex((item) => item.slug === project.slug);
  const next = selectedProjects[(index + 1) % selectedProjects.length];
  return <main id="pm-content" tabIndex={-1} className={styles.container}>
    <section className={styles.caseHero} aria-labelledby="case-title"><Link className={styles.backLink} href="/pm/#work"><ArrowLeft size={16} aria-hidden="true" />선택한 작업으로</Link><p className={styles.eyebrow}>{project.name} · {project.category}</p><h1 id="case-title">{project.title[0]}<br />{project.title[1]}</h1><p className={styles.caseLead}>{project.summary}</p><p className={styles.note}>{content.facts.join(" / ")}</p></section>
    <figure><ProjectVisual slug={project.slug} /><figcaption>{project.caption}</figcaption></figure>
    <div className={styles.supportingBody}>
      {content.sections.map((section, index) => <section key={section.title} className={styles.caseSection}>
        <p className={styles.sectionLabel}>{section.label}</p><h2>{section.title}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {project.slug === "smile-game" && index === 0 && <figure className={styles.surveyEvidence}><SurveyVisual /><figcaption>2026.01.13–14 설문, n=168. Q9의 응답 수로 비율을 계산했습니다.</figcaption></figure>}
      </section>)}
      <section className={styles.caseSection}><h2>관련 자료</h2><ul className={styles.sourceList}>{content.sources.map(([href, label]) => <li key={href}><a className={styles.sourceLink} href={href} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={16} aria-hidden="true" /></a></li>)}</ul></section>
    </div>
    <div className={styles.nextProject}><p>다음 프로젝트</p><Link href={"/pm/" + next.slug + "/"}>{next.name}<ArrowUpRight aria-hidden="true" /></Link></div>
  </main>;
}

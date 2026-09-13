import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { type PmProject } from "./content";
import { ProjectVisual } from "./PmVisuals";
import styles from "./pm.module.css";

const flow = [
  ["선택", "화면에서 호불호 구분"],
  ["저장", "공연 ID와 응답 전달"],
  ["취향 계산", "선호 벡터 생성"],
  ["첫 추천", "다른 추천 기준과 결합"],
];

export function PmPlayPickCase({ project }: { project: PmProject }) {
  return <main id="pm-content" tabIndex={-1} className={styles.container}>
    <section className={styles.caseHero} aria-labelledby="case-title">
      <Link className={styles.backLink} href="/pm/#play-pick"><ArrowLeft size={16} aria-hidden="true" />선택한 작업으로</Link>
      <p className={styles.eyebrow}>Play Pick · 2인 팀 · 공연 추천 웹 서비스</p>
      <h1 id="case-title">{project.title[0]}<br />{project.title[1]}</h1>
      <p className={styles.caseLead}>{project.summary}</p>
      <dl className={styles.caseFacts}>
        <div><dt>맡은 역할</dt><dd>팀장 / 화면 설계·FE 구현<br />온보딩·마이페이지 API 연동</dd></div>
        <div><dt>구현 기록</dt><dd>2025.12<br />2인 프로젝트</dd></div>
        <div><dt>개발 환경</dt><dd>Vue 3 / Pinia<br />Django REST Framework</dd></div>
        <div><dt>핵심 흐름</dt><dd>취향 선택 → 저장<br />선호 계산 → 추천 확인</dd></div>
      </dl>
    </section>
    <figure><ProjectVisual slug="play-pick" /><figcaption>{project.caption}</figcaption></figure>
    <div className={styles.caseLayout}>
      <nav className={styles.caseNav} aria-label="Play Pick 사례 목차">
        <a href="#context">상황과 문제</a><a href="#decision">온보딩 기준</a><a href="#implementation">화면과 데이터 연결</a><a href="#contribution">개인 기여</a><a href="#results">구현 결과</a><a href="#sources">출처</a>
      </nav>
      <div className={styles.caseContent}>
        <section id="context" className={styles.caseSection}>
          <p className={styles.sectionLabel}>상황과 문제</p><h2>첫 추천에 쓸 취향 정보가 필요했습니다.</h2>
          <p>Play Pick은 공연 정보와 사용자 취향을 연결하는 공연 추천 서비스입니다. 개인화된 첫 화면을 만들려면 가입 직후, 아직 조회나 찜 기록이 없는 사용자의 관심을 파악할 방법이 필요했습니다.</p>
          <p>공연을 직접 보여주고 반응을 받는 온보딩을 구현했습니다. 인기·최근 공연과 여러 장르의 후보를 섞고, 선택한 공연의 정보를 초기 선호 데이터로 활용하는 흐름입니다.</p>
        </section>
        <section id="decision" className={styles.caseSection}>
          <p className={styles.sectionLabel}>온보딩 기준</p><h2>중립 응답과 비선호를 구분했습니다.</h2>
          <dl className={styles.beforeAfter}>
            <div><dt>보고싶어요</dt><dd>관심이 있다는 신호로 저장합니다. 해당 공연의 임베딩에 양의 가중치를 적용합니다.</dd></div>
            <div><dt>안볼래요</dt><dd>관심이 없다는 신호로 저장합니다. 선호 계산에서 음의 가중치로 반영합니다.</dd></div>
            <div><dt>모르겠어요</dt><dd>중립 응답으로 건너뜁니다. 비선호로 저장하거나 완료에 필요한 호불호 개수에 포함하지 않습니다.</dd></div>
          </dl>
          <p>호불호를 8개 이상 선택하면 완료할 수 있도록 진행률과 버튼 상태를 구현했습니다. ‘모르겠어요’를 누르면 다음 공연으로 넘어가되 완료에 필요한 개수는 늘어나지 않습니다.</p>
          <p className={styles.note}>최소 8개는 명세의 완료 조건입니다. 선택 개수에 따른 입력 부담과 추천 품질은 비교하지 않았습니다.</p>
        </section>
        <section id="implementation" className={styles.caseSection}>
          <p className={styles.sectionLabel}>화면과 데이터 연결</p><h2>선택 결과를 저장한 뒤<br />추천 화면으로 이동하게 했습니다.</h2>
          <ol className={styles.flow} aria-label="온보딩 응답에서 첫 추천까지의 데이터 흐름">{flow.map(([title, description], index) => <li key={title}><div><strong>{title}</strong><span>{description}</span></div>{index < flow.length - 1 && <ArrowRight size={19} aria-hidden="true" />}</li>)}</ol>
          <p>Vue 화면의 선택 상태를 Pinia에서 관리하고, 공연 ID와 응답 값을 API 형식으로 변환했습니다. 응답 저장과 온보딩 완료 요청을 순서대로 처리한 뒤, 저장한 취향을 사용하는 추천 화면으로 연결했습니다.</p>
          <p>온보딩 서버는 선택한 공연의 특징을 수치로 담은 임베딩에 응답 가중치를 적용해 사용자의 선호 정보를 만듭니다. 이 취향 저장 처리도 구현에 포함했습니다. 팀원이 개발한 추천 엔진은 이 값과 지역·인기 등의 기준을 함께 사용합니다.</p>
          <details className={styles.evidenceDetails}><summary>구현 기준 자세히 보기</summary><div><p>보고싶어요는 1.5, 안볼래요는 −1.0으로 전달하며, 중립 응답은 원본 프런트엔드에서 저장 요청에 포함하지 않습니다. 서버는 공연 임베딩을 가중 합산하고 정규화해 선호 벡터로 저장합니다.</p><p>저장 실패 시 오류를 보여주고 완료 처리를 진행하지 않습니다. 이처럼 사용자 행동의 의미와 요청 순서, 실패 상태를 함께 다뤘습니다.</p><a className={styles.sourceLink} href="/pm/sources/play-pick-implementation.txt" target="_blank" rel="noreferrer">당시 구현 코드 발췌<ArrowUpRight size={16} aria-hidden="true" /></a></div></details>
        </section>
        <section id="contribution" className={styles.caseSection}>
          <p className={styles.sectionLabel}>개인 기여</p><h2>2인 팀에서 화면과<br />온보딩 저장 처리를 맡았습니다.</h2>
          <p>2인 팀에서 화면 설계와 프론트엔드 구현, 발표와 문서 정리를 맡았습니다. 온보딩 화면·API·선호 저장 처리, 관람함, 마이페이지와 커뮤니티 페이지를 작업했습니다.</p>
          <p>임경수 팀원은 공연 데이터 수집, 핵심 AI 검색·추천 엔진과 배포 설정을 맡았습니다. 저는 사용자의 선택을 공연 ID·응답 값으로 저장하고, 찜과 관람 기록이 관련 화면에 반영되도록 구현했습니다.</p>

        </section>
        <section id="results" className={styles.caseSection}>
          <p className={styles.sectionLabel}>구현 결과</p><h2>취향 선택부터 첫 추천까지<br />동작하는 흐름을 만들었습니다.</h2>
          <p>보관된 원본 화면으로 취향 선택·저장·추천 결과 조회를 재현했습니다. 위 영상에서 완료 전후의 버튼 상태와 화면 전환을 볼 수 있습니다.</p>
          <p>후속 검증에서는 선택 개수를 바꿔 온보딩 완료 시간·완료율과 첫 추천의 상세 조회·찜을 함께 비교하려 합니다. 입력 부담을 줄여도 추천을 탐색하는 데 도움이 되는지 확인하기 위한 계획입니다.</p>
          <p className={styles.note}>실제 이용자의 온보딩 완료율과 추천 품질은 아직 측정하지 않았습니다.</p>
        </section>
        <section id="sources" className={styles.caseSection}>
          <p className={styles.sectionLabel}>출처</p><h2>명세와 구현 기록</h2>
          <ul className={styles.sourceList}><li><a className={styles.sourceLink} href="/pm/sources/play-pick-onboarding.txt" target="_blank" rel="noreferrer">온보딩 명세와 역할 기록<ArrowUpRight size={16} aria-hidden="true" /></a><span>온보딩 명세와 2025년 12월 구현 커밋 6fde165·e51d2d3.</span></li><li><a className={styles.sourceLink} href="/pm/sources/play-pick-implementation.txt" target="_blank" rel="noreferrer">화면 상태·API·선호 계산 코드<ArrowUpRight size={16} aria-hidden="true" /></a><span>당시 저장된 화면 상태, API 요청, 취향 저장 코드.</span></li></ul>
        </section>
      </div>
    </div>
    <div className={styles.nextProject}><p>다음 프로젝트</p><Link href="/pm/aekkim/">AEKKIM<ArrowUpRight aria-hidden="true" /></Link></div>
  </main>;
}

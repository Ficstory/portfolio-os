import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Trophy } from "lucide-react";
import { AekkimVisual, SubscriptionFlow } from "./PmVisuals";
import { aekkimAward, selectedProjects } from "./content";
import styles from "./pm.module.css";

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className={styles.sourceLink} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={15} aria-label="새 창" /></a>;
}

export function PmAekkimCase() {
  const project = selectedProjects[0];
  return <main id="pm-content" tabIndex={-1} className={styles.container}>
    <section className={styles.caseHero} aria-labelledby="case-title">
      <Link className={styles.backLink} href="/pm/#work"><ArrowLeft size={16} aria-hidden="true" />선택한 작업으로</Link>
      <p className={[styles.eyebrow, styles.caseEyebrow].join(" ")}><span>애낌(AEKKIM) · 구독 관리 Android MVP</span><span className={styles.projectAward}><Trophy size={16} strokeWidth={1.7} aria-hidden="true" />{aekkimAward} · 팀 수상</span></p>
      <h1 id="case-title">{project.title[0]}<br />{project.title[1]}</h1>
      <p className={styles.caseLead}>{project.summary}</p>
      <dl className={styles.caseFacts}><div><dt>맡은 역할</dt><dd>PM / 요구사항·화면명세 관리<br />프론트엔드 구현·API 연동</dd></div><div><dt>작업 시기</dt><dd>2026.03</dd></div><div><dt>팀 구성</dt><dd>Android / 백엔드 / AI<br />파트별 협업</dd></div><div><dt>결과</dt><dd>Android MVP 제작<br />프로젝트 우수상 · 팀 수상</dd></div></dl>
    </section>
    <figure><AekkimVisual compact /><figcaption>{project.caption} <SourceLink href="/pm/aekkim-detail-original.png">초기 구독 상세 목업</SourceLink></figcaption></figure>
    <div className={styles.caseLayout}>
      <nav className={styles.caseNav} aria-label="AEKKIM 사례 목차"><a href="#context">구독 관리의 문제</a><a href="#decision">후보 확인 흐름</a><a href="#artifacts">요구사항과 화면명세</a><a href="#implementation">개인 구현</a><a href="#results">결과</a></nav>
      <div className={styles.caseContent}>
        <section className={styles.caseSection} id="context">
          <p className={styles.sectionLabel}>구독 관리의 문제</p><h2>결제 내역만으로는<br />관리할 구독이 정해지지 않았습니다.</h2>
          <p>구독은 가입 후 사용하지 않아도 결제가 이어지고, 해지 시점을 놓치기 쉽습니다. 애낌은 결제 내역과 앱 사용 정보를 함께 보여주고, 사용자가 구독을 점검·수정하거나 해지 안내를 확인하도록 만든 앱입니다.</p>
          <p>분석 결과에는 서비스가 식별된 구독 후보와 직접 확인해야 하는 결제가 섞여 있었습니다. 사용자가 실제 구독이 아닌 항목을 제외하거나, 연결되지 않은 결제의 서비스를 선택할 수 있어야 했습니다.</p>
        </section>
        <section className={styles.caseSection} id="decision">
          <p className={styles.sectionLabel}>후보 확인 흐름</p><h2>후보 확인과 구독 등록을<br />서로 다른 단계로 다뤘습니다.</h2>
          <p>요구사항의 구독 분석·확인(FR-03)과 수동 추가·매핑(FR-05)을 화면별 행동으로 구체화했습니다. 후보 확인 화면에서는 제외할 항목을 고르고, 수동 매핑 화면에서는 미확인 결제를 서비스에 연결합니다. 확인을 마치면 등록한 구독을 대시보드에서 볼 수 있습니다.</p>
          <SubscriptionFlow />
          <dl className={styles.beforeAfter}><div><dt>감지된 후보</dt><dd>분석 결과에서 찾은 항목입니다. 화면에서 제외한 후보는 이번 등록 요청에 넣지 않습니다.</dd></div><div><dt>미확인 결제</dt><dd>서비스를 정하지 못한 항목입니다. 사용자가 서비스와 요금제를 확인하는 화면으로 이동합니다.</dd></div><div><dt>등록한 구독</dt><dd>생성 요청을 마친 뒤 구독 목록에서 조회·수정·삭제하는 대상입니다.</dd></div></dl>
        </section>
        <section className={styles.caseSection} id="artifacts">
          <p className={styles.sectionLabel}>요구사항과 화면명세</p><h2>구현된 범위와<br />화면의 진입·이동 조건을 정리했습니다.</h2>
          <p>문서를 구현 상태에 맞춰 갱신했습니다. 요구사항정의서에는 지원 기능과 미구현 항목을, 화면명세서에는 각 화면의 목적과 이동 조건을 적었습니다. 최종 요구사항정의서 v2.6은 3월 29일 기준입니다.</p>
          <details className={styles.evidenceDetails} open><summary>요구사항정의서: 지원하는 기능과 범위</summary><div><p>구독 후보 확인, 수동 추가·매핑, 대시보드의 빈 상태·오류 상태를 명시했습니다. 로그인 화면에 버튼이 있어도 실제 인증을 지원하지 않는 Naver 로그인은 미구현으로 구분했습니다.</p></div></details>
          <details className={styles.evidenceDetails}><summary>화면명세서: 후보 확인에서 등록까지</summary><div><p>구독 확인 화면(SCR-002-2), 대시보드, 수동 매핑 화면이 각각 어떤 정보를 보여주고 어디로 이동하는지 정리했습니다.</p></div></details>
        </section>
        <section className={styles.caseSection} id="implementation">
          <p className={styles.sectionLabel}>개인 구현</p><h2>구독 확인 화면과<br />후보·건수 표시를 구현했습니다.</h2>
          <p>구독 확인 화면의 초기 구현, 분석 결과가 없을 때의 안내와 후보 제외 상태를 맡았습니다. 이후 중복 후보 노출과 확인이 필요한 결제 건수를 수정했습니다. 구독 생성 요청·실패 처리는 김응서 팀원이, 번들 처리는 박규빈 팀원이 보완했습니다. 아래는 이 작업들이 합쳐진 현재 화면의 동작입니다.</p>
          <ul className={styles.implementationList}><li><strong>분석 결과 없음</strong><span>오류 안내를 표시하고 다시 분석하도록 알립니다.</span></li><li><strong>후보 제외</strong><span>현재 분석 세션에서 제외 상태를 관리하고, 남은 후보를 생성 요청의 대상으로 삼습니다.</span></li><li><strong>등록 중·실패</strong><span>진행 중에는 중복 진입을 막습니다. 요청에 실패하면 화면을 유지하고 오류 메시지를 표시합니다.</span></li><li><strong>등록 완료</strong><span>대상 중복을 정리해 API를 호출하고, 모든 생성 요청을 마치면 분석 세션을 비운 뒤 대시보드로 이동합니다.</span></li></ul>
        </section>
        <section className={styles.caseSection} id="results">
          <p className={styles.sectionLabel}>결과</p><h2>구독 관리 MVP를 만들고<br />팀으로 수상했습니다.</h2>
          <p>팀은 Android MVP를 제작해 프로젝트 우수상을 받았습니다. 제 기여는 요구사항·화면명세 관리, 구독 관리 화면 구현과 API 연동입니다. 구독 비용 절감액이나 실사용자 증가를 측정한 성과는 없습니다.</p>
        </section>
      </div>
    </div>
    <div className={styles.nextProject}><p>다음 프로젝트</p><Link href="/pm/busan-eumgil/">부산이음길<ArrowUpRight aria-hidden="true" /></Link></div>
  </main>;
}

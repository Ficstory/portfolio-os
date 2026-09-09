import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AekkimVisual, SubscriptionFlow } from "./PmVisuals";
import styles from "./pm.module.css";

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className={styles.sourceLink} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={15} aria-label="새 창" /></a>;
}

export function PmAekkimCase() {
  return <main id="pm-content" tabIndex={-1} className={styles.container}>
    <section className={styles.caseHero} aria-labelledby="case-title">
      <Link className={styles.backLink} href="/pm/#work"><ArrowLeft size={16} aria-hidden="true" />선택한 작업으로</Link>
      <p className={styles.eyebrow}>AEKKIM · 구독 관리 Android MVP</p>
      <h1 id="case-title">함께 만들 기준부터<br />맞췄습니다.</h1>
      <p className={styles.caseLead}>‘구독을 찾는다’는 한 문장을, 후보를 확인하고 등록하는 화면과 API의 실행 기준으로 나눴습니다.</p>
      <dl className={styles.caseFacts}><div><dt>맡은 역할</dt><dd>PM / 요구사항·화면명세<br />프론트엔드 구현·API 연동</dd></div><div><dt>확인한 작업 기록</dt><dd>2026.03</dd></div><div><dt>팀의 작업 범위</dt><dd>Android / 백엔드 / AI<br />파트 간 협업</dd></div><div><dt>프로젝트 상태</dt><dd>MVP 코드와 QA 기록 확인<br />실사용 성과 미측정</dd></div></dl>
    </section>
    <figure><AekkimVisual compact /><figcaption>초기 구독 상세 목업 원본과 요구사항 기반 흐름 재구성. 화면 속 금액은 예시이며, 이후 QA에서 금액 표현을 수정했습니다. <SourceLink href="/pm/aekkim-detail-original.png">목업 원본 크게 보기</SourceLink></figcaption></figure>
    <div className={styles.caseLayout}>
      <nav className={styles.caseNav} aria-label="AEKKIM 사례 목차"><a href="#context">상황과 문제</a><a href="#decision">판단과 결정</a><a href="#artifacts">실행 산출물</a><a href="#implementation">구현 연결</a><a href="#results">결과와 한계</a><a href="#sources">출처</a></nav>
      <div className={styles.caseContent}>
        <section className={styles.caseSection} id="context">
          <p className={styles.sectionLabel}>상황과 문제</p><h2>기능 이름만 같다고,<br />같은 것을 만드는 건 아니었습니다.</h2>
          <p>AEKKIM은 결제 내역과 앱 사용 정보를 바탕으로 구독을 정리하는 Android 앱입니다. 사용자가 놓치기 쉬운 구독 현황을 보여주고, 직접 수정하거나 해지 안내로 이동하도록 설계했습니다.</p>
          <p>‘자동 구독 분석’에는 서로 다른 상태가 들어 있었습니다. 분석이 찾은 항목인지, 사용자가 확인한 구독인지, 아직 서비스와 연결하지 못한 결제인지에 따라 화면의 행동과 저장 조건이 달라졌습니다.</p>
          <blockquote>화면에서 확인한 행동이,<br />데이터에서도 같은 의미여야 했습니다.</blockquote>
          <p>저는 요구사항과 화면명세를 관리하며 프론트엔드 구현과 API 연동을 함께 맡았습니다. 문서의 기능 목록을 화면 상태, 사용자 행동, 다음 단계로 풀어 쓰는 데 집중했습니다.</p>
        </section>
        <section className={styles.caseSection} id="decision">
          <p className={styles.sectionLabel}>판단과 결정</p><h2>감지 결과와 사용자의 확인을<br />서로 다른 단계로 뒀습니다.</h2>
          <dl className={styles.beforeAfter}><div><dt>Before</dt><dd>‘분석한 구독을 보여준다’는 설명만으로는 언제 구독이 생성되는지 분명하지 않았습니다.</dd></div><div><dt>Decision</dt><dd>감지된 후보를 먼저 보여주고, 사용자가 제외하거나 미확인 결제를 연결한 뒤 구독을 생성하는 흐름으로 구체화했습니다.</dd></div><div><dt>After</dt><dd>구독 확인 화면, 수동 매핑 화면, 구독 생성 API의 책임을 나눠 같은 흐름으로 설명할 수 있게 했습니다.</dd></div></dl>
          <SubscriptionFlow />
          <div className={styles.decisionOptions}><div><h3>자동 등록으로 끝내면</h3><p>사용자의 행동은 줄지만 감지된 결제와 실제 구독이 다를 때 정정이 뒤로 밀립니다.</p></div><div><h3 className={styles.chosen}>확인 단계를 두면</h3><p>한 단계가 추가되지만 제외할 항목과 직접 연결할 결제를 등록 전에 구분할 수 있습니다.</p></div></div>
          <p className={styles.note}>이 절의 Before/Decision/After와 대안 비교는 현재 요구사항과 구현 구조를 설명하기 위해 재구성했습니다. 당시 회의에서 검토한 모든 선택지를 기록한 자료는 확보하지 못했습니다.</p>
        </section>
        <section className={styles.caseSection} id="artifacts">
          <p className={styles.sectionLabel}>실행 산출물</p><h2>문서마다 답해야 할 질문을<br />다르게 정했습니다.</h2>
          <p>요구사항에서는 범위를, 화면명세에서는 행동을, QA 기록에서는 실제로 어긋난 의미를 확인합니다.</p>
          <details className={styles.evidenceDetails} open><summary>요구사항정의서: 어디까지 만들 것인가</summary><div><p>FR-03은 분석 이후 구독 후보를 확인하는 흐름, FR-05는 수동 추가와 수동 매핑을 정의합니다. 현행 문서는 Naver 실제 로그인처럼 미구현인 범위도 따로 적고 있습니다.</p><SourceLink href="/pm/sources/aekkim-requirements.txt">요구사항정의서 v2.6 발췌 보기</SourceLink></div></details>
          <details className={styles.evidenceDetails}><summary>화면명세서: 무엇을 보고, 어떻게 행동하는가</summary><div><p>SCR-002-2 구독 확인 화면은 감지한 후보의 1차 확인을 맡고, 대시보드와 수동 매핑 화면은 각각 구독 관리와 미확인 결제 연결을 맡습니다. 화면 목적과 진입·이동 조건을 함께 정리했습니다.</p><SourceLink href="/pm/sources/aekkim-screens.txt">화면명세서 발췌 보기</SourceLink></div></details>
          <details className={styles.evidenceDetails}><summary>QA 기록: 어느 지점에서 해석이 달라지는가</summary><div><p>시스템 알림 권한과 앱 수신 설정이 같은 의미처럼 보이는 문제, 연간 할인액이 월 절감액처럼 보이는 문제를 따로 기록했습니다. 데이터와 문구가 함께 바뀌어야 하는 이유를 남겼습니다.</p><SourceLink href="/pm/sources/aekkim-qa.txt">MVP 테스트 개선 기록 발췌 보기</SourceLink></div></details>
        </section>
        <section className={styles.caseSection} id="implementation">
          <p className={styles.sectionLabel}>구현 연결</p><h2>확인 버튼 뒤의 조건까지<br />같은 기준으로 연결했습니다.</h2>
          <p>구독 확인 ViewModel과 API 인터페이스에서 아래 연결을 확인할 수 있습니다. 서버 개발 전체가 아닌 프론트엔드의 상태 관리와 API 연동 범위입니다.</p>
          <ul className={styles.implementationList}><li><strong>분석 결과가 없는 경우</strong><span>오류 상태를 표시하고 확인 흐름을 진행하지 않습니다. 다시 읽기 동작을 별도 의도로 구분합니다.</span></li><li><strong>후보를 제외하는 경우</strong><span>세션 안에서 제외 상태를 관리합니다. 확인 시 화면에 남아 있는 후보만 구독 생성 대상으로 사용합니다.</span></li><li><strong>확인 중이거나 요청에 실패한 경우</strong><span>진행 중 재진입을 막고, 생성 요청이 실패하면 메시지를 표시하며 완료 상태를 해제합니다.</span></li><li><strong>생성 요청을 마친 경우</strong><span>중복 대상을 정리한 뒤 구독 생성 API를 호출합니다. 모든 요청을 마치면 분석 세션을 정리하고 대시보드로 이동합니다.</span></li></ul>
          <SourceLink href="/pm/sources/aekkim-implementation.txt">구독 확인 코드 발췌 보기</SourceLink>
          <p className={styles.note}>검증 기준: 제외한 후보가 생성 요청에서 빠지는지, 오류가 있으면 화면을 유지하는지, 완료 후 대시보드로 이동하는지. 이번 포트폴리오 작업에서는 Android 앱을 재실행하지 않았으며 위 내용은 소스 확인 결과입니다.</p>
        </section>
        <section className={styles.caseSection} id="results">
          <p className={styles.sectionLabel}>확인된 결과와 한계</p><h2>완성의 기준을,<br />사용자가 읽는 의미까지 넓혔습니다.</h2>
          <h3>알림이 ‘켜져 있다’는 말부터 분리했습니다.</h3>
          <dl className={styles.beforeAfter}><div><dt>Before</dt><dd>시스템 알림 권한을 허용했는데 앱 내 토글은 꺼져 보여 상태를 이해하기 어려웠습니다.</dd></div><div><dt>Decision</dt><dd>시스템 권한 상태를 따로 표시하고, 체크인·혜택 토글이 앱 내 수신 설정임을 안내했습니다.</dd></div><div><dt>After</dt><dd>QA 문서에 해결로 기록됐습니다. 권한이 꺼져 있을 때 시스템 설정으로 이동하는 경로도 함께 정리됐습니다.</dd></div></dl>
          <p>팀의 산출물로 요구사항·화면명세·구독 확인 구현과 QA 개선 기록이 남았습니다. 개인의 기여는 요구사항과 화면명세 관리, 프론트엔드 구현, API 명세 정합성 확인으로 구분합니다.</p>
          <p>생산성 향상이나 사용자 증가를 측정한 자료는 없습니다. 구독을 순차 생성하는 도중 일부 요청만 성공했을 때 재시도가 어떻게 처리되는지는 추가 검증이 필요합니다. 외부 해지 안내 링크의 리다이렉트 이슈도 QA 기록에서 보류 상태입니다.</p>
          <blockquote>다음에는 정상 흐름뿐 아니라,<br />일부만 성공한 상태의 복구 기준도 먼저 합의하겠습니다.</blockquote>
        </section>
        <section className={styles.caseSection} id="sources">
          <h2>출처와 확인 범위</h2>
          <ul className={styles.sourceList}><li><SourceLink href="/pm/sources/aekkim-requirements.txt">요구사항정의서 v2.6</SourceLink><span>문서 내부 기준일 2026.03.29. 본인 작성 커밋 9c0fb29 확인.</span></li><li><SourceLink href="/pm/sources/aekkim-screens.txt">화면명세서</SourceLink><span>구독 확인·수동 매핑 화면의 목적과 흐름.</span></li><li><SourceLink href="/pm/sources/aekkim-qa.txt">2026.03.24 MVP 테스트 개선사항</SourceLink><span>알림 설정, 금액 표현, 추천 이동과 외부 링크 이슈.</span></li><li><SourceLink href="/pm/sources/aekkim-implementation.txt">구독 확인 ViewModel / API</SourceLink><span>로컬 프로젝트 원본 코드 발췌. 실제 서비스 운영 성과와는 구분합니다.</span></li></ul>
          <p className={styles.note}>제작 기간의 정확한 시작·종료일, 당시 팀 인원과 역할 변경 시점은 추가 확인이 필요해 숫자로 기재하지 않았습니다.</p>
        </section>
      </div>
    </div>
    <div className={styles.nextProject}><p>다음 프로젝트</p><Link href="/pm/busan-eumgil/">부산이음길: 실제로 갈 수 있는 길<ArrowUpRight aria-hidden="true" /></Link></div>
  </main>;
}

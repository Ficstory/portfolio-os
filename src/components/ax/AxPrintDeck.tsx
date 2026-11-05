/* Reuse the actual PM PRINT layout, typography and 320 × 180 mm page shell. */
/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import Link from "next/link";
import p from "@/components/pm-improved/print/PmPrintPortfolio.module.css";
import { AxPrintButton } from "./AxPrintButton";
import s from "./axPrint.module.css";

const total = 14;
function Page({ n, label, title, children, className = "", source }: { n: number; label: string; title: ReactNode; children: ReactNode; className?: string; source?: string }) {
  return <article className={`${p.page} ${className}`} data-ax-sheet={n} aria-labelledby={`ax-print-${n}`}>
    <header className={p.pageHeader}><p>{label}</p><span>LEE JAEHO · AX PORTFOLIO</span></header>
    <h2 id={`ax-print-${n}`}>{title}</h2>
    <div className={p.pageContent} data-ax-slide-content>{children}</div>
    <footer className={p.pageFooter}><span>{source || "LOTTE AX Challenge 2026"}</span><span>{String(n).padStart(2, "0")}/{String(total).padStart(2, "0")}</span></footer>
  </article>;
}
function Evidence({ src, alt, caption, phone = false }: { src: string; alt: string; caption: string; phone?: boolean }) {
  return <figure className={`${p.evidenceImage} ${phone ? p.phoneImage : ""}`}><img src={src} alt={alt} loading="eager" /><figcaption>{caption}</figcaption></figure>;
}
function Meta({ period, team, role }: { period: string; team: string; role: string }) {
  return <dl className={p.projectMeta}><div><dt>기간·기준</dt><dd>{period}</dd></div><div><dt>구성</dt><dd>{team}</dd></div><div><dt>내 역할</dt><dd>{role}</dd></div></dl>;
}
function Roles({ mine, team }: { mine: string; team: string }) {
  return <dl className={p.roleSplit}><div><dt>MY ROLE</dt><dd>{mine}</dd></div><div><dt>TEAM</dt><dd>{team}</dd></div></dl>;
}
function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return <li><span>{n}</span><div><strong>{title}</strong><p>{children}</p></div></li>;
}

export function AxPrintDeck() {
  return <div className={s.site}>
    <div className={s.toolbar}><Link href="/ax/">포트폴리오로 돌아가기</Link><span>PM 프린트 형식 · 320 × 180mm · 16:9 · 14쪽</span><AxPrintButton /></div>
    <main className={`${p.root} ${s.root}`} data-pm-print-preview="" aria-label="이재호 AX 인쇄 포트폴리오">
      <div className={p.deck}>
        <Page n={1} label="LOTTE AX Challenge · 2026" title={<><span>업무의 맥락을 읽고,</span><span className={p.coverTitleAccent}>AI 서비스를 구현합니다.</span></>} className={p.cover}>
          <div className={p.coverGrid}><div className={p.coverStatement}><p>이재호 / LEE JAEHO</p><p className={p.coverRole}>기획 · AI Agent · 서비스 개발</p></div><div className={p.coverSummary}><p>사용자의 요구를 화면과 데이터 흐름으로 옮기고, AI가 찾은 근거와 실행 결과를 확인하며 개선했습니다.</p><ul className={p.capabilityList}><li><span>01 · J-OS</span>기억·검색·실행을 설계하고 고정 조건으로 검증</li><li><span>02 · 부산이음길</span>기관 인터뷰를 지도·경로·음성 안내로 구현</li><li><span>03 · 애낌</span>AI 분석 결과를 사용자 확인·등록으로 연결</li></ul></div></div>
        </Page>
        <Page n={2} label="Project 01 · 개인 AI Agent 플랫폼" title="J-OS" source="J-OS · J1 / 구조 문서·코드·UI 검증 화면">
          <div className={p.introGrid}><div className={p.introCopy}><p className={p.lead}>대화가 끝나도 이어지는 업무 맥락</p><p>기억·지식 검색부터 역할별 검토와 도구 실행까지, 개인용 AI Agent 플랫폼을 직접 기획·개발·운영했습니다.</p><section className={p.problemBox}><span>USER PROBLEM</span><p>새 대화마다 이전 결정과 자료를 다시 설명해야 했습니다. 필요한 근거를 찾아 다음 업무와 실행으로 연결하고자 했습니다.</p></section><Meta period="2026.11.04 자료 확인" team="개인 프로젝트" role="서비스 기획 · React 웹 · Fastify API · SQLite · 개인 운영" /></div><Evidence src="/ax/evidence/jos-report-fixture.png" alt="J-OS 보고서와 인용 근거 표시 화면" caption="실제 UI + 합성 원문·모델 결과의 검증 화면. 운영 모델의 답변 품질을 나타내지 않습니다." /></div>
        </Page>
        <Page n={3} label="J-OS · 핵심 기여 01" title="요약과 원문을 구분하고, 검색 결과에 근거 위치를 붙였습니다." source="J-OS · J1 / ARCHITECTURE.md · memory·knowledge·실행 모듈">
          <div className={p.playFlowLayout}><ol className={p.pipeline}><li><span>01 · 입력</span><strong>대화와 등록 자료</strong><p>요청·이전 결정·원문을 보존</p></li><li><span>02 · 기억</span><strong>원문과 파생 정보 분리</strong><p>출처 해시·원문 범위·처리 위치 기록</p></li><li><span>03 · 검색</span><strong>근거 구절 선택</strong><p>범위·활성 버전·인용 위치 전달</p></li><li><span>04 · 응답·실행</span><strong>답변과 역할별 검토</strong><p>도구 실행 단계·결과 보존</p></li></ol><ol className={p.outputSteps}><Step n="01" title="요약을 원문과 같은 사실로 취급하지 않았습니다.">파생 기억의 출처를 남겨 원문으로 되짚을 수 있게 했습니다. 어떤 자료가 답변의 근거인지 확인하는 구조입니다.</Step><Step n="02" title="검색과 실행을 하나의 서비스 흐름으로 연결했습니다.">문서 버전·인용 ID와 구절을 전달합니다. API가 실행 모듈을 불러 수행하고 SQLite에 단계와 결과를 저장합니다.</Step></ol><p className={p.sourceNote}>개인 서비스 운영과 기능별 로컬 검증은 구분합니다. 다음 쪽은 고정 입력을 사용한 검색 평가입니다.</p></div>
        </Page>
        <Page n={4} label="J-OS · 핵심 기여 02" title="질문 해석과 빠진 근거 구간을 고쳐, 같은 조건에서 비교했습니다." source="J-OS · J2 / 10·24 검색 평가 원 산출물·해시·평가 스크립트">
          <div className={s.evaluationGrid}><section className={`${p.bigStat} ${s.retrievalStat}`}><span>LOCAL RETRIEVAL CHECK</span><strong>6 → 10<small>/14</small></strong><p>검색 엄격 기준 통과<br />전체 답변 정확도와 구분</p></section><div><dl className={p.metricRow}><div><dt>기본 자료</dt><dd>325개 고정</dd></div><div><dt>질문·판정 기준</dt><dd>14개 고정</dd></div><div><dt>비교 범위</dt><dd>로컬 검색</dd></div></dl><ol className={`${p.numberedEvidence} ${s.topGap}`}><Step n="01" title="출력 지시와 검색 질문을 분리했습니다.">형식 지시가 질문으로 섞이거나 ‘인터뷰’ 맥락이 잘못 분류되는 문제를 수정했습니다.</Step><Step n="02" title="대표 구간 밖의 조건도 후보로 남겼습니다.">비중첩 구간을 최대 두 개 더 후보로 두고, 기존 전달 예산 안에서 필요한 구절을 선택했습니다.</Step></ol></div><div className={s.fullWidth}><ol className={p.decisionTrace}><li><span>검사 기준</span><strong>필요 구절·금지 자료·원문 위치·버전·전달 예산</strong></li><li><span>개선된 4개 유형</span><strong>UI 비교·영상 제작 절차·접근성 QA·미끼 배제</strong></li><li><span>남은 한계</span><strong>변형 질문의 누락·무관 자료 유입, 답변 품질 미측정</strong></li></ol><p className={p.sourceNote}>미끼 검사는 합성 1개를 더한 326개 조건입니다. 산술 질문의 기존 판정 불일치도 실패에 포함했습니다. 서비스 전체 성능으로 일반화하지 않습니다.</p></div></div>
        </Page>
        <Page n={5} label="J-OS · 핵심 기여 03" title="실패를 완료로 보이지 않게, 단계와 재개 위치를 남겼습니다." source="J-OS · J3 / 10·10 실행 검증·10·30 운영 반영·README">
          <div className={p.deliveryGrid}><ol className={p.outputSteps}><Step n="01" title="실행 계획과 한도를 먼저 검사했습니다.">단계 의존관계·시도·산출물·실행 키를 저장하고 단계 수·시간·모델 호출 예산을 관리했습니다.</Step><Step n="02" title="중복을 억제하고 중단 지점을 남겼습니다.">회차 키와 실행 임대로 중복 실행을 억제했습니다. 성공한 단계를 재사용하고, 독립 단계는 계속 진행하도록 구성했습니다.</Step></ol><div className={p.documentStack}><span>EXECUTION STATE</span><p>완료 · 산출물·근거 보존</p><p>부분 완료 · 단계별 분리</p><p>실패 · 원인·재개 위치</p></div><div className={`${p.criteriaNotes} ${s.fullWidth}`}><section><span>로컬 구현·검증</span><p>취소·재시작·부분 실패·호출 한도 fixture 검사. 개발 컨테이너 종단 검증은 Docker 부재로 미완료입니다.</p></section><section><span>개인 서비스 운영</span><p>OCI 릴리스 전환, SQLite 백업·격리 복원·데이터 보존을 확인했습니다. 10/30 요청 접수 방식의 운영 반영 기록이 있습니다.</p></section></div></div>
        </Page>
        <Page n={6} label="Project 02 · 보행약자 길안내 앱" title="부산이음길" source="부산이음길 · B1–B2 / PRD·기관 인터뷰·앱 코드·원본 시연">
          <div className={`${p.introGrid} ${p.phoneIntro}`}><div className={p.introCopy}><p className={p.lead}>이동 조건에 맞춰 달라지는 길안내</p><p>보행약자와 저시력자의 이동 조건을 경로 선택, 화면 크기, 음성 안내에 반영한 Android 앱입니다.</p><section className={p.problemBox}><span>USER PROBLEM</span><p>같은 목적지라도 경사·단차·폭과 사용자의 화면 이용 조건에 따라 필요한 경로와 안내가 달랐습니다.</p></section><Meta period="2026.04–05" team="7인 팀" role="서비스 기획 · 기관 섭외·인터뷰 · Kotlin·Jetpack Compose FE" /></div><div className={p.phonePair}><Evidence phone src="/pm-improved/evidence/busan-route-map.png" alt="부산이음길 지도" caption="실제 지도 화면 · 시설 탐색" /><Evidence phone src="/pm/busan-low-vision.png" alt="부산이음길 사용자 유형 선택" caption="원본 앱 · 사용자 유형 선택" /></div></div>
        </Page>
        <Page n={7} label="부산이음길 · 핵심 기여 01" title="기관 인터뷰의 요구를, 기능과 안내 방식의 기준으로 옮겼습니다." source="부산이음길 · B1 / 함세상 인터뷰 결과·PRD·기여 분석 v2">
          <div className={p.planningGrid}><Evidence src="/pm-improved/evidence/busan-mvp-meeting.png" alt="부산이음길 MVP를 설명하고 의견을 나눈 기관 미팅 현장" caption="MVP 기능을 설명하고 의견을 나눈 미팅 현장" /><ol className={p.interviewTrace}><li><span>01 · 기관 인터뷰</span><p>함세상 장애인자립생활센터에 연락해 이동 조건과 안전 정보, 선택지의 필요를 확인했습니다.</p></li><li><span>02 · 기획·명세</span><p>경로 비교, 사용자 유형 온보딩, 접근성 시설 탐색을 기능과 화면으로 구체화했습니다.</p></li><li><span>03 · 안내 방식</span><p>보행약자의 경사·단차 조건, 저시력자의 큰 글자와 음성 안내를 연결했습니다.</p></li></ol></div><p className={p.sourceNote}>기관 연락·인터뷰 진행은 본인 확인 기록, PRD·인터뷰 결과 작성은 Git 기록이 근거입니다. 현장 안전성·시간 단축 효과는 미측정입니다.</p>
        </Page>
        <Page n={8} label="부산이음길 · 핵심 기여 02" title="경로 응답을 변환하고, 지도·설정·TTS의 상태를 연결했습니다." source="부산이음길 · B2 / 경로 파서·TTS·설정 코드·Git 이력">
          <div className={p.interfaceGrid}><Evidence phone src="/ax/evidence/busan-route-29s.jpg" alt="지도와 구간별 경로 안내" caption="원본 경로 시연 · 29초" /><ol className={p.numberedEvidence}><Step n="01" title="예시 응답에서 SDK·API로 연결했습니다.">Kakao 지도·장소 검색과 경로 조회·선택·재탐색을 연결하고, geometry 빈값·형식·좌표 오류를 구분했습니다.</Step><Step n="02" title="사용할 수 없는 상태도 반영했습니다.">TTS 초기화·준비·사용 불가를 나누고 중지·자원 해제를 구현했습니다. 설정은 저장하고 화면에 적용했습니다.</Step><Step n="03" title="인증과 계정 상태도 정리했습니다.">인증 갱신 후 1회 재시도와 로그아웃 상태 정리를 연결했습니다. 현장 관찰은 후속 과제입니다.</Step></ol><Roles mine="앱 기반·설정·지도·경로 파서·TTS 연결" team="AI 시설물 탐지·경로 가중치·서버·경로 알고리즘" /></div>
        </Page>
        <Page n={9} label="Project 03 · Android 구독 관리 앱" title="애낌" source="애낌 · A1 / 요구사항·화면명세·분석 파이프라인·기여 분석 v2">
          <div className={`${p.introGrid} ${p.phoneIntro}`}><div className={p.introCopy}><p className={p.lead}>AI가 찾고, 사용자가 확인하는 구독 관리</p><p>팀장·PM·프론트엔드로 요구사항·화면을 설계하고, 분석 결과를 서비스 흐름에 통합했습니다.</p><section className={p.problemBox}><span>CORE FLOW</span><p>규칙 판정과 온디바이스 AI 분석으로 찾은 후보를 사용자가 확인·제외·연결한 뒤 구독 목록에 반영합니다.</p></section><Meta period="2026.03" team="5인 팀" role="팀장·PM · 분석 흐름 연결 · 결과·실패 상태 · 확인 화면" /><p className={p.teamResult}>SSAFY 특화 프로젝트 우수상 · 2026.03.30 · 팀 수상</p></div><div className={p.phonePair}><Evidence phone src="/pm-improved/evidence/aekkim-candidate-review-capture.png" alt="애낌 후보 확인" caption="후보 확인 · 예시 데이터 앱 데모" /><Evidence phone src="/ax/evidence/aekkim-dashboard-after.png" alt="애낌 등록 후 목록" caption="등록 후 목록·합계 · 같은 데모" /></div></div>
        </Page>
        <Page n={10} label="애낌 · 핵심 기여 01" title="규칙·AI 분석 결과를 사용자 확인과 등록으로 연결했습니다." source="애낌 · A1 / AnalysisPipelineOrchestrator·OnDeviceAiResolver">
          <div className={p.playFlowLayout}><ol className={p.pipeline}><li><span>01 · 준비</span><strong>결제·사용 정보</strong><p>분석에 필요한 입력 준비</p></li><li><span>02 · 분석</span><strong>규칙 + 온디바이스 AI</strong><p>미해결 후보와 분석 결과 전달</p></li><li><span>03 · 확인</span><strong>후보·서비스 연결</strong><p>확인·제외·수동 등록 상태 처리</p></li><li><span>04 · 반영</span><strong>구독 목록 갱신</strong><p>사용자가 확정한 결과 표시</p></li></ol><table className={p.criteriaTable}><thead><tr><th>분석·조회 상태</th><th>서비스에서 처리한 흐름</th></tr></thead><tbody><tr><th>결과가 없거나 미해결</th><td>안내와 후보 상태를 유지하고 사용자 확인으로 연결</td></tr><tr><th>일괄 조회 실패</th><td>미해결 후보를 보존하는 대체 처리로 전환</td></tr></tbody></table><Roles mine="분석 흐름 연결·결과와 실패 상태·사용자 확인 화면 통합" team="FastText·XGBoost 모델 및 추론 엔진은 AI 담당 팀원 구현" /></div>
        </Page>
        <Page n={11} label="애낌 · 핵심 기여 02" title="제외한 후보가 되살아나지 않도록, 사용자의 상태를 보존했습니다." source="애낌 · A2 / d5ffadd·JSON 계약 검사·QA·오프라인 데모">
          <div className={p.criteriaLayout}><table className={p.criteriaTable}><thead><tr><th>문제</th><th>내린 판단과 구현</th><th>확인한 근거</th></tr></thead><tbody><tr><th>같은 결과를 다시 관찰하면 제외한 후보가 재생성</th><td>seed key가 같으면 후보를 재초기화하지 않도록 수정</td><td>d5ffadd 상태 보존 변경</td></tr><tr><th>후보와 남은 결제 건수의 불일치</th><td>현재 후보 상태와 남은 건수를 관찰하도록 보완</td><td>후보 확인·연결 → 목록·합계 갱신 데모</td></tr></tbody></table><div className={p.criteriaNotes}><section><span>검증한 범위</span><p>코드 변경·기존 JSON 계약 검사·QA 기록과 예시 데이터 앱 데모를 확인했습니다. 이번에는 Android 테스트를 재실행하지 않았습니다.</p></section><section><span>역할·한계</span><p>오프라인 데모는 실제 결제 수집·모델 추론 검증이 아닙니다. 후속 등록 실패 처리에는 팀원 기여가 있으며, 정확도·비용 절감은 미측정입니다.</p></section></div></div>
        </Page>
        <Page n={12} label="Supporting Work · 사용자 조사와 추천 입력" title="긍정 반응과 실제 선택, 중립과 비선호를 구분했습니다." source="보조 사례 · S1–S2 / 설문 분석 원본·온보딩 명세·시연 기록">
          <div className={s.supportingGrid}><section><h3>웃지마게임</h3><p className={s.supportingRole}>PM · 설문 설계·분석 · FE</p><dl className={p.metricRow}><div><dt>응답 수</dt><dd>168명</dd></div><div><dt>흥미 긍정</dt><dd>92명</dd></div><div><dt>참여 의향</dt><dd>75명</dd></div></dl><p>얼굴 공개를 ‘매우·꽤 부담’으로 답한 112명을 함께 읽고, 친구 초대와 안전 장치를 우선하는 제안으로 연결했습니다.</p><p>친구 초대의 로그인 복귀·입장·대기 흐름을 구현했습니다.</p><p className={p.sourceNote}>원 응답 데이터 미확보. 성별·연령 편중이 있으며 실제 참여율 개선은 측정하지 않았습니다.</p></section><section><h3>Play Pick</h3><p className={s.supportingRole}>팀장 · FE / 추천 엔진은 팀원 구현</p><dl className={p.choiceRules}><div><dt>호감·비호감</dt><dd>유효 응답으로 저장</dd></div><div><dt>모르겠어요</dt><dd>판단 보류로 구분</dd></div></dl><p>선택·저장·완료를 연결하고, 저장 성공 뒤 추천으로 이동하도록 했습니다. 호불호 8개 저장과 첫 추천 조회를 로컬 시연에서 확인했습니다.</p><p className={p.sourceNote}>원본 UI·예시 계정·보관 데이터 시연. 8개는 구현 기준이며 추천 정확도·전환율의 최적값으로 검증하지 않았습니다.</p></section></div>
        </Page>
        <Page n={13} label="For LOTTE Chilsung · 현재 기획·설계 단계" title="같은 시장·패널·상황에서, 신제품 투입 전후를 비교하겠습니다." source="롯데칠성음료 · L1–L2 / 공식 요건·11/4 지원서·설계 문서">
          <div className={p.playFlowLayout}><ol className={p.pipeline}><li><span>01 · 시스템 준비</span><strong>시장과 패널</strong><p>기존 상품·가격·판매 조건<br />고유 가상 소비자 최소 1만 명</p></li><li><span>02 · 사용자 입력</span><strong>신제품·검증 조건</strong><p>시장·패널·상황·버전을 고정해 비교</p></li><li><span>03 · 실행·검토</span><strong>투입 전후 반응</strong><p>유효 선택·보류와 기술 실패를 분리</p></li><li><span>04 · 결과 분석</span><strong>경쟁·대체 관계</strong><p>어느 상품에서 이동했는지와 후속 검증 가설</p></li></ol><ol className={p.decisionTrace}><li><span>J-OS → 실행·검증</span><strong>자료·모델 버전, 단계별 실패·재개, 시간·비용 기록</strong></li><li><span>부산이음길 → 조건별 화면</span><strong>음료군·가격·채널을 고정하지 않고 조건과 전후 결과 비교</strong></li><li><span>애낌 → 결과 확인</span><strong>기업 자료를 사용할 수 있을 때 보정·검증으로 연결</strong></li></ol><div className={p.failureRule}><strong>현재 상태</strong><p>Nemotron-Personas-Korea를 기본 소스로 사용할 계획입니다. 시장 DB·시뮬레이터 구축과 1만 명 실행은 미완료입니다.</p></div><p className={p.sourceNote}>해커톤에서는 실제 소비자 정답 없이 실행 가능한 시뮬레이터를 준비합니다. 합성 반응을 실제 선택의 정답으로 쓰지 않으며, 현업 자료를 확보하면 별도 보정·검증을 연결합니다.</p></div>
        </Page>
        <Page n={14} label="Evidence & Contact" title="구현한 것과 검증한 범위를, 근거와 함께 설명하겠습니다." source="자료 확인 기준 · 2026.11.04 / 공개 평가축을 예선 확정 배점으로 해석하지 않음">
          <table className={`${p.criteriaTable} ${s.evidenceTable}`}><thead><tr><th>사례</th><th>확인한 근거</th><th>해석의 범위</th></tr></thead><tbody><tr><th>J-OS · J1–J3</th><td>구조·코드 / 10·24 검색 평가 / 실행·운영 기록</td><td>검색과 답변 품질, 로컬 검사와 운영 반영 구분</td></tr><tr><th>부산이음길 · B1–B2</th><td>인터뷰·PRD / 지도·경로·TTS 코드 / 원 시연</td><td>개인 FE와 팀 AI·서버 구분 / 현장 효과 미측정</td></tr><tr><th>애낌 · A1–A2</th><td>분석·상태 코드 / QA·예시 데이터 데모 / 상장</td><td>모델·엔진은 팀원 / 수상은 팀 / 운영 수치 아님</td></tr><tr><th>보조·롯데 · S1–L2</th><td>설문 원본·온보딩 시연 / 공식 요건·지원서</td><td>의향과 행동 구분 / 롯데 과제는 기획·설계 단계</td></tr></tbody></table><div className={s.contact}><div><strong>이재호 / LEE JAEHO</strong><a href="mailto:dlwo4367@gmail.com">dlwo4367@gmail.com</a></div><div><a href="https://ficstory.dev/pm/">기존 포트폴리오 · ficstory.dev/pm/ ↗</a><a href="https://lotteaxchallenge.com/jobs/RC20261015037730">LOTTE AX Challenge 공식 과제 ↗</a></div></div>
        </Page>
      </div>
    </main>
  </div>;
}

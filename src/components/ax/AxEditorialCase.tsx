import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Trophy } from "lucide-react";
import { AekkimVisual, BusanVisual, SubscriptionFlow } from "@/components/tracks/pm/editorial/PmVisuals";
import p from "@/components/tracks/pm/editorial/pm.module.css";
import s from "./axEditorial.module.css";
import { axProjects, type AxSlug } from "./axEditorialContent";
import { JosEditorialVisual } from "./AxEditorialHome";

function Section({ id, label, title, children }: { id: string; label: string; title: ReactNode; children: ReactNode }) {
  return <section className={p.caseSection} id={id}><p className={p.sectionLabel}>{label}</p><h2>{title}</h2>{children}</section>;
}
function Evidence({ children }: { children: ReactNode }) {
  return <div className={s.evidence}><p>{children}</p><a className={p.sourceLink} href="/ax/evidence/verification-summary.txt" target="_blank" rel="noreferrer">공개용 근거 요약<ArrowUpRight size={15} aria-hidden="true" /></a></div>;
}
function Steps({ rows }: { rows: string[][] }) {
  return <ol className={s.architecture}>{rows.map(([title, text], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>;
}

function JosContent() {
  return <>
    <Section id="context" label="문제와 구조" title={<>저장된 자료가,<br />필요한 근거로 전달되지는 않았습니다.</>}>
      <p>매번 배경을 설명하고 자료를 찾아 붙이는 부담을 줄이고 싶었습니다. 대화와 등록 자료를 다음 업무에 쓰는 개인 AI Agent를 기획·개발하고 직접 운영했습니다. 기억을 저장하는 데서 나아가, 현재 요청에 필요한 맥락을 골라 답변·검토·실행으로 전달하도록 구성했습니다.</p>
      <Steps rows={[
        ["요청과 대화 저장", "API가 대상 대화·프로젝트를 확인하고 사용자 요청과 원문을 저장합니다."],
        ["기억·등록 지식 선택", "범위·활성 상태·문서 버전을 확인하고 원문 구절과 인용 ID를 전달합니다."],
        ["응답·검토·실행 분기", "요청에 따라 직접 답변, 역할 위임, 등록 도구와 다단계 실행을 선택합니다."],
        ["결과와 실행 근거 반환", "결과·부분 완료·실패와 다음 행동을 저장 상태에 맞춰 표시합니다."],
      ]} />
      <p>React·Vite 화면, TypeScript·Fastify API, SQLite와 실행 모듈을 연결했습니다. API가 같은 서버의 실행 패키지를 호출하는 구조입니다. 대화 원문과 파생 기억을 구분하고 출처 해시·원문 범위·처리 위치를 보존했습니다.</p>
    </Section>
    <Section id="decision" label="검색의 판단과 개선" title={<>모델을 바꾸기 전에,<br />질문 해석과 누락된 구간을 고쳤습니다.</>}>
      <p>“저장 자료를 근거로 답해 달라”는 출력 지시가 별도 질문으로 섞이고, 채용·영상의 ‘인터뷰’를 현장조사로 분류하는 문제가 있었습니다. 질문과 형식 지시를 분리하고 주변 문맥을 함께 확인하도록 수정했습니다.</p>
      <div className={p.decisionOptions}><div><h3>대표 구간만 남기기</h3><p>절차와 검수 조건이 문서의 다른 위치에 있으면, 필요한 조건 중 하나가 빠졌습니다.</p></div><div><h3 className={p.chosen}>보완 구간도 후보로 남기기</h3><p>같은 주제를 공유하면서 다른 조건을 담은 비중첩 구간을 최대 두 개 추가하고 기존 전달 예산 안에서 선택했습니다.</p></div></div>
      <p>자료를 몇 개 찾았는지보다 실제 선택 함수가 모델에 무엇을 넘겼는지 확인했습니다. 출처 ID·문서 버전·원문 위치를 유지하고, 메타데이터만 일치하는 경우를 본문의 근거로 인정하지 않도록 했습니다.</p>
    </Section>
    <Section id="verification" label="고정 조건의 검증" title={<>같은 자료와 질문으로,<br />필요한 근거가 전달됐는지 비교했습니다.</>}>
      <div className={s.metric}><strong>6 → 10 <small>/ 14</small></strong><p>검색 엄격 기준 통과 사례 · 2026.10.24 로컬 비교</p></div>
      <p>기본 자료는 활성 일반 자료 325개입니다. 본문·메타데이터·순서·버전과 14개 고정 질문·판정 기준을 유지했습니다. 원 평가 파일의 입력 해시 일치와 strictPass 집계를 대조했습니다.</p>
      <ul className={p.implementationList}><li><strong>필요한 조건을 포함하는가</strong><span>요구한 근거 그룹을 모두 포함하고 금지 문서를 전달하지 않는지 검사했습니다.</span></li><li><strong>원문과 일치하는가</strong><span>원문 구간·문서 버전·좌표·메타데이터의 정합성을 확인했습니다.</span></li><li><strong>동일한 제약으로 검색했는가</strong><span>구간 수·전달 분량 예산과 고정 코퍼스 전체 검색·잘림 여부를 검사했습니다.</span></li></ul>
      <p className={p.note}>메타데이터 미끼 항목은 기본 325개에 고정 합성 문서 1개를 추가한 326개 조건입니다. 산술 질문의 기존 검색 필요 여부 불일치도 실패로 포함한 엄격 집계입니다.</p>
      <p>추가 변형 질문에서는 근거 누락과 무관 자료 유입이 남았습니다. 이 결과는 로컬 검색·근거 전달 평가이며, 새 모델 답변이나 운영 응답의 정확도를 측정한 결과는 아닙니다.</p>
    </Section>
    <Section id="execution" label="실행 관리와 운영" title={<>실패한 일을 완료로 보이지 않게,<br />단계와 근거를 남겼습니다.</>}>
      <p>모델이 만든 계획은 서버에서 검사하고 단계 의존관계·시도 횟수·실행 키·결과·근거·중단 위치를 저장했습니다. SQLite의 회차 키와 실행 임대로 중복 실행을 억제하고, 성공한 단계의 산출물을 재사용했습니다.</p>
      <dl className={p.beforeAfter}><div><dt>로컬 검증</dt><dd>취소·재시작·부분 실패·호출 한도를 fixture로 검사했습니다. 개발 컨테이너의 종단 검증은 Docker 부재로 미완료입니다.</dd></div><div><dt>개인 운영</dt><dd>OCI 릴리스 전환, SQLite 백업·격리 복원·데이터 보존을 확인했습니다. 10/30 대화 진입 계약 변경은 별도 운영 반영 기록이 있습니다.</dd></div></dl>
      <p>롯데 과제에서는 패널·시장·모델 버전을 고정하고, 중단 후 재개와 유효 반응·보류·기술 실패를 구분하는 데 이 경험을 적용하겠습니다. 가상시장 서비스는 현재 기획·설계 단계입니다.</p>
      <Evidence>J1–J3 · 아키텍처, 10/24 고정 검색 평가, 10/10 로컬 실행 검증, 10/30 운영 반영 기록. 개인 원문·질문은 공개하지 않았습니다.</Evidence>
    </Section>
  </>;
}
function BusanContent() {
  return <>
    <Section id="context" label="현장의 요구" title={<>같은 목적지라도,<br />필요한 안내가 달랐습니다.</>}>
      <p>함세상 장애인자립생활센터에 연락하고 인터뷰를 진행했습니다. 경사·단차·폭뿐 아니라 안전 정보와 선택 가능한 경로, 화면과 음성을 병행하는 안내가 필요하다는 요구를 PRD와 기능 명세에 정리했습니다.</p>
      <blockquote>이용자의 이동 조건을,<br />경로 선택과 안내 방식으로 옮긴다.</blockquote>
      <p>기획·기관 인터뷰와 Android 프론트엔드를 담당했습니다. Kotlin·Jetpack Compose 앱 기반, 초기 설정 저장, 지도·경로·TTS와 글자 크기 공통 기반을 구현했습니다.</p>
    </Section>
    <Section id="decision" label="요구에서 화면으로" title={<>이동 조건과 표시 설정이,<br />실제 이용 흐름으로 이어지게 했습니다.</>}>
      <ul className={p.implementationList}><li><strong>보행 조건과 경로 선택</strong><span>사용자 유형·보행 조건을 저장하고 ‘안전한 길’과 ‘최단거리’의 경로 비교로 연결했습니다.</span></li><li><strong>글자 크기의 선택과 유지</strong><span>기본·크게·아주 크게를 선택하고 repository에 저장한 값을 화면에 반영했습니다.</span></li><li><strong>화면과 음성의 병행</strong><span>TTS를 초기화·준비·사용 불가로 구분하고 재생 중지와 자원 해제를 구현했습니다.</span></li></ul>
      <p>경로 fixture와 geometry parser로 입력 계약을 정리한 뒤 Kakao 지도·장소 검색과 경로 API를 연결했습니다. 잘못된 geometry와 좌표를 구분하고 화면에 필요한 경로 모델로 변환했습니다.</p>
    </Section>
    <Section id="implementation" label="경로와 안내의 연결" title={<>경로 데이터가,<br />화면과 음성 안내가 되도록 연결했습니다.</>}>
      <figure><video className={s.routeVideo} src="/pm-improved/busan/route-search-v2.mp4" poster="/ax/evidence/busan-route-29s.jpg" controls playsInline preload="none" aria-label="부산이음길 원본 앱 경로 탐색 시연" /><figcaption>원본 앱 경로 탐색 시연. ‘안전한 길’ 표시는 현장 안전성 측정 결과와 구분합니다.</figcaption></figure>
      <dl className={p.beforeAfter}><div><dt>본인 구현</dt><dd>지도 SDK·장소 검색, 경로 파서와 FE API 계층, 안내 runtime·TTS, 글자 크기 저장·반영.</dd></div><div><dt>팀 구현</dt><dd>로드뷰의 볼라드·점자블록 AI 탐지, 경로 가중치 데이터와 서버·경로 알고리즘. 저시력 화면 전체도 공동 작업입니다.</dd></div></dl>
    </Section>
    <Section id="verification" label="확인한 범위" title={<>구현한 동작과,<br />현장에서 확인할 효과를 구분했습니다.</>}>
      <p>원본 앱 시연과 경로 파서·TTS·설정 관련 테스트 코드가 남아 있습니다. 실제 이동 안전성이나 이동 시간 단축을 측정한 자료는 없습니다.</p>
      <p>사용자 특성을 분류하는 데서 그치지 않고 입력·선택지·안내 방법으로 번역한 경험입니다. 롯데 과제에서는 시장·상황 조건을 명시하고 전후 결과와 실패 상태를 읽을 수 있는 화면에 적용하겠습니다.</p>
      <Evidence>B1–B2 · 기관 인터뷰·PRD, 원본 코드·Git 이력, 원본 앱 시연. 상세 역할과 검증 범위는 공개용 근거 요약에 정리했습니다.</Evidence>
    </Section>
  </>;
}
function AekkimContent() {
  return <>
    <Section id="context" label="분석에서 확인으로" title={<>발견한 결제를,<br />바로 구독으로 확정할 수는 없었습니다.</>}>
      <p>애낌은 결제와 사용 정보를 한곳에서 관리하는 Android 앱입니다. 분석 결과에는 서비스가 식별된 후보와 사용자가 직접 확인해야 하는 결제가 섞여 있었습니다. 실제 구독이 아닌 후보를 제외하고, 불분명한 결제를 서비스에 연결해야 했습니다.</p>
      <p>팀장·PM·프론트엔드로 요구사항과 화면 명세를 관리하고, 데이터 준비·규칙 판정·AI 분석·결과 전달의 흐름을 통합했습니다.</p>
    </Section>
    <Section id="decision" label="분석 흐름의 통합" title={<>규칙·AI·사용자 판단을,<br />하나의 흐름으로 연결했습니다.</>}>
      <SubscriptionFlow />
      <Steps rows={[
        ["결제·사용 정보 준비", "결제 내역, 서비스 catalog, UsageStats를 정규화하고 후보를 추출했습니다."],
        ["규칙 판정·일괄 조회·AI 분석", "미해결 후보를 AI resolver로 넘기고, 일괄 조회에 실패해도 확인할 후보를 유지했습니다."],
        ["결과 병합과 확인 화면", "후보 병합·중복 제거 후 확인·제외·수동 연결·등록 화면으로 전달했습니다."],
      ]} />
      <p>FastText·XGBoost 모델과 추론 엔진은 AI 담당 팀원의 구현입니다. 저는 분석 흐름과 결과 계약, fallback, 상태와 사용자 확인 화면을 연결했습니다.</p>
    </Section>
    <Section id="implementation" label="사용자의 판단 보존" title={<>제외한 후보가,<br />다시 나타나는 문제를 고쳤습니다.</>}>
      <p>저장 상태를 재관찰할 때 같은 분석 결과로 후보를 다시 만들면, 사용자가 제외한 항목이 돌아왔습니다. 같은 세션을 재초기화하지 않는 seed key를 두고 남은 결제 건수와 화면 상태를 맞췄습니다.</p>
      <div className={p.decisionOptions}><div><h3>수정 전</h3><p>동일 분석 결과로 후보가 다시 생성되어 화면의 남은 수와 사용자 판단이 어긋났습니다.</p></div><div><h3 className={p.chosen}>수정 후</h3><p>latestPendingReviewSeedKey로 같은 결과의 재생성을 억제하고 현재 후보 상태를 관찰했습니다.</p></div></div>
      <p>대표 변경은 d5ffadd입니다. 구독 생성 요청·실패 처리의 후속 수정은 김응서, 번들과 관련 실패 보완은 박규빈 팀원의 기여입니다.</p>
    </Section>
    <Section id="verification" label="결과와 검증 범위" title={<>Android MVP를 만들고,<br />팀으로 우수상을 받았습니다.</>}>
      <p className={p.projectAward}><Trophy size={18} aria-hidden="true" />SSAFY 특화 프로젝트 우수상 · 2026.03.30 · 부울경 1반 3등</p>
      <p>화면은 기존 Compose UI·ViewModel에 예시 API 응답을 전달하는 오프라인 데모입니다. 후보 연결 뒤 목록·합계 갱신을 보여줍니다. 실제 결제 수집·AI 추론·운영 백엔드를 검증한 시연은 아닙니다.</p>
      <p>분석 결과 계약과 파싱 테스트 코드는 최신 모델의 예측 정확도를 평가한 검사가 아닙니다. 구독 비용 절감액이나 실사용자 증가도 측정하지 않았습니다.</p>
      <p>분석을 확정값으로 취급하지 않고 모호한 항목과 실패를 사용자 확인으로 넘긴 경험을, 롯데 과제의 유효 반응·보류·기술 오류 구분에 적용하겠습니다.</p>
      <Evidence>A1–A2 · 분석 오케스트레이션, 후보 상태 코드·원본 Git 이력, 오프라인 데모, 팀 수상 상장. 개인 모델 개발과 단독 수상으로 표현하지 않았습니다.</Evidence>
    </Section>
  </>;
}

export function AxEditorialCase({ slug }: { slug: AxSlug }) {
  const project = axProjects.find(item => item.slug === slug)!;
  const index = axProjects.findIndex(item => item.slug === slug);
  const next = axProjects[(index + 1) % axProjects.length];
  const facts = slug === "jos" ? ["기획·개발·개인 운영", "지속 개발·고도화", "개인 프로젝트", "고정 검색 평가 · 로컬 6→10 / 14"] : slug === "busan-eumgil" ? ["기획·기관 인터뷰·Android FE", "2026.04–05", "7인 팀", "Android 시제품·원본 앱 시연"] : ["팀장·PM·Android FE", "2026.03", "5인 팀", "Android MVP · 프로젝트 우수상"];
  return <main id="ax-content" tabIndex={-1} className={p.container}>
    <section className={p.caseHero} aria-labelledby="case-title">
      <Link className={p.backLink} href="/ax/#work"><ArrowLeft size={16} aria-hidden="true" />선택한 작업으로</Link>
      <p className={p.eyebrow}>{project.name} · {project.category}</p><h1 id="case-title">{project.title[0]}<br />{project.title[1]}</h1><p className={p.caseLead}>{project.summary}</p>
      <dl className={p.caseFacts}>{["맡은 역할", "작업 시기", "팀 구성", "결과"].map((label, i) => <div key={label}><dt>{label}</dt><dd>{facts[i]}</dd></div>)}</dl>
    </section>
    <figure>{slug === "jos" ? <JosEditorialVisual /> : slug === "busan-eumgil" ? <BusanVisual /> : <AekkimVisual compact />}<figcaption>{project.caption}</figcaption></figure>
    <div className={p.caseLayout}>
      <nav className={p.caseNav} aria-label={project.name + " 사례 목차"}><a href="#context">문제와 구조</a><a href="#decision">핵심 판단</a>{slug === "jos" ? <><a href="#verification">검색 평가</a><a href="#execution">실행과 운영</a></> : <><a href="#implementation">개인 구현</a><a href="#verification">검증과 결과</a></>}</nav>
      <div className={p.caseContent}>{slug === "jos" ? <JosContent /> : slug === "busan-eumgil" ? <BusanContent /> : <AekkimContent />}</div>
    </div>
    <div className={p.nextProject}><p>다음 프로젝트</p><Link href={"/ax/" + next.slug + "/"}>{next.name}<ArrowUpRight aria-hidden="true" /></Link></div>
  </main>;
}


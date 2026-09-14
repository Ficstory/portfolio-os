import { ArrowRight, Check, FileCheck2, Settings2 } from "lucide-react";
import { subscriptionFlow, survey } from "./content";
import { PmVideoPreview } from "./PmVideoPreview";
import styles from "./pm.module.css";
import visual from "./visuals.module.css";

export function SubscriptionFlow() {
  return <ol className={styles.flow} aria-label="구독 등록 흐름">
    {subscriptionFlow.map((step, index) => <li key={step.title}><div><strong>{step.title}</strong><span>{step.description}</span></div>{index < subscriptionFlow.length - 1 && <ArrowRight size={19} aria-hidden="true" />}</li>)}
  </ol>;
}

export function AekkimVisual({ compact = false }: { compact?: boolean }) {
  return <div className={`${styles.aekkimVisual} ${compact ? styles.compactVisual : ""}`}>
    <div className={styles.visualStatement}>
      <span className={styles.visualLabel}>Android 구독 관리 앱</span>
      <p>이용 중인 구독과<br />매달 나가는 비용을<br /><em>한눈에.</em></p>
    </div>
    <PmVideoPreview name="AEKKIM" file="aekkim" width={480} height={1040} description="구독 관리 화면 데모 · 오프라인 · 예시 데이터 사용" />
  </div>;
}

export function BusanVisual() {
  return <div className={visual.busanContribution}>
    <div className={visual.contributionIntro}>
      <span className={styles.visualLabel}>초기 기획·기관 인터뷰 · 프론트엔드 개발</span>
      <p>초기 기획부터 MVP 선정까지 맡고,<br /><em>길안내 지도 화면을 구현했습니다.</em></p>
    </div>
    <div className={visual.contributionGrid} aria-label="부산이음길 핵심 기여">
      <section>
        <span>01</span>
        <strong>초기 기획·인터뷰·MVP 선정</strong>
        <p>함세상 장애인자립생활센터를 직접 섭외해 회의·인터뷰를 진행하고 MVP 범위를 선정했습니다.</p>
      </section>
      <section>
        <span>02</span>
        <strong>길안내 지도·프론트엔드 개발</strong>
        <p>길안내 지도 위 마커를 고정하는 동작과 관련 프론트엔드를 구현했습니다.</p>
      </section>
    </div>
  </div>;
}

export function BusanAdditionalVisual() {
  return <div className={visual.busanEvidence}>
    <div className={visual.evidenceIntro}>
      <span className={styles.visualLabel}>구현 기준 요약</span>
      <p>접근성 설정과<br /><em>제보 표시</em></p>
    </div>
    <div className={visual.ruleSheet} aria-label="부산이음길 설정과 승인 제보의 구현 규칙">
      <section>
        <div className={visual.ruleHeading}><Settings2 aria-hidden="true" /><strong>글자 크기 설정</strong></div>
        <div className={visual.sizeChoices} aria-label="선택 가능한 글자 크기">
          <span>기본</span><span>크게</span><span className={visual.selected}>아주 크게 <Check size={14} aria-hidden="true" /></span>
        </div>
        <p>선택 즉시 저장하고 앱 화면에 적용 · 별도 저장 버튼 없음</p>
      </section>
      <section>
        <div className={visual.ruleHeading}><FileCheck2 aria-hidden="true" /><strong>승인된 제보</strong></div>
        <div className={visual.layerPair}>
          <span>시설 마커</span><span aria-hidden="true">+</span><span className={visual.selected}>승인 제보 마커</span>
        </div>
        <div className={visual.mapLayers}>
          <span>제보 선택</span><ArrowRight size={16} aria-hidden="true" /><span>하단 패널</span>
        </div>
        <p>시설 마커와 분리해 표시 · 제보를 누르면 내용 확인</p>
      </section>
    </div>
  </div>;
}

export function SurveyVisual() {
  const burdenCount = survey.responses[0].count + survey.responses[1].count;
  const burdenPercent = (burdenCount / survey.total * 100).toFixed(1);
  return <div className={styles.surveyVisual}>
    <div className={styles.surveyTakeaway}><span className={styles.visualLabel}>얼굴을 드러내는 일의 부담</span><p className={styles.surveyNumber}>{burdenPercent}<span>%</span></p><p>‘꽤’ 또는 ‘매우’ 부담됨<br /><span>{survey.total}명 중 {burdenCount}명</span></p></div>
    <div className={styles.chart}><p className={styles.chartTitle}>얼굴 노출 부담</p><ul>{survey.responses.map((response, index) => <li key={response.label}><div><span>{response.label}</span><span>{response.count}명 <small>{(response.count / survey.total * 100).toFixed(1)}%</small></span></div><span aria-hidden="true" className={index < 2 ? styles.barStrong : styles.bar} style={{ width: `${response.count / 56 * 100}%` }} /></li>)}</ul><p className={styles.chartNote}>사전 설문 {survey.total}명 · 2026.01 · 24–29세와 남성 응답 비중이 높음</p></div>
  </div>;
}

function SmileResearchVisual() {
  const burdenCount = survey.responses[0].count + survey.responses[1].count;
  const burdenPercent = (burdenCount / survey.total * 100).toFixed(1);

  return <div className={visual.smileEvidence}>
    <SurveyVisual />
    <div className={visual.decisionTrace}>
      <span>설문 분석과 친구 초대방 구현 과정 요약</span>
      <ol>
        <li><strong>사전 설문</strong><p>흥미 {survey.signals.interest}/{survey.total}<br />참여 의향 {survey.signals.willingToParticipate}/{survey.total}</p></li>
        <li><strong>장벽 확인</strong><p>얼굴 노출 부담<br />{burdenCount}/{survey.total} · {burdenPercent}%</p></li>
        <li><strong>팀 결정</strong><p>친구 초대 우선<br />랜덤 매칭도 유지</p></li>
        <li><strong>내 담당</strong><p>설문·결정 기록<br />방 생성·입장·대기 구현</p></li>
      </ol>
    </div>
  </div>;
}

export function SmileTeamDemoVisual() {
  return <div className={styles.smileVisual}>
    <div className={styles.smileStatement}><span className={styles.visualLabel}>팀 서비스 시연 · 랜덤 매칭</span><p>준비부터,<br /><em>웃음 판정과 결과까지.</em></p></div>
    <PmVideoPreview name="웃지마게임" file="smile" width={1280} height={720} wide description="팀 서비스 시연 · 랜덤 매칭" />
  </div>;
}

export function BusanOnboardingVisual() {
  return <div className={visual.secondaryVideo}>
    <div><span className={styles.visualLabel}>팀 서비스 시연 · 온보딩</span><p>사용자 유형과 보행 조건 선택</p></div>
    <PmVideoPreview name="부산이음길" file="busan" width={480} height={1040} description="팀 서비스 시연 · 온보딩" />
  </div>;
}

export function ProjectVisual({ slug }: { slug: string }) {
  if (slug === "aekkim") return <AekkimVisual />;
  if (slug === "busan-eumgil") return <BusanVisual />;
  if (slug === "play-pick") return <div className={styles.playPickVisual}>
    <div className={styles.playPickHeading}><div><span className={styles.visualLabel}>Play Pick</span><p>취향에 맞는 공연을<br /><em>탐색하는 추천 서비스.</em></p></div><span>서비스 화면 재현 데모 · 예시 데이터 사용</span></div>
    <PmVideoPreview name="Play Pick" file="play-pick" width={960} height={720} wide description="서비스 화면 재현 데모 · 예시 데이터 사용" />
  </div>;
  if (slug === "smile-game") return <SmileResearchVisual />;
  return null;
}

import { ArrowRight, Accessibility, AudioLines } from "lucide-react";
import { subscriptionFlow, survey } from "./content";
import { PmVideoPreview } from "./PmVideoPreview";
import styles from "./pm.module.css";

export function SubscriptionFlow() {
  return <ol className={styles.flow} aria-label="요구사항과 코드 기반 구독 확인 흐름">
    {subscriptionFlow.map((step, index) => <li key={step.title}><div><strong>{step.title}</strong><span>{step.description}</span></div>{index < subscriptionFlow.length - 1 && <ArrowRight size={19} aria-hidden="true" />}</li>)}
  </ol>;
}

export function AekkimVisual({ compact = false }: { compact?: boolean }) {
  return <div className={`${styles.aekkimVisual} ${compact ? styles.compactVisual : ""}`}>
    <div className={styles.visualStatement}>
      <span className={styles.visualLabel}>AEKKIM</span>
      <p>자동으로 찾고,<br /><em>직접 확인하는</em><br />구독 관리.</p>
      <SubscriptionFlow />
    </div>
    <PmVideoPreview name="AEKKIM" file="aekkim" width={480} height={1040} description="기존 앱 UI를 데모 데이터로 실행한 시연. 결제 후보를 확인하고 웨이브에 연결하면 구독 목록과 월 합계가 바뀌며, 등록한 구독의 상세 화면을 엽니다." />
  </div>;
}

export function BusanVisual() {
  return <div className={styles.busanVisual}>
    <div className={styles.busanStatement}><span className={styles.visualLabel}>부산이음길</span><p>같은 목적지,<br /><em>다른 이동 조건.</em></p><ul><li><Accessibility aria-hidden="true" size={24} /><span>보행약자<strong>경사·단차·접근성 시설</strong></span></li><li><AudioLines aria-hidden="true" size={24} /><span>저시력자<strong>큰 버튼·음성 중심 안내</strong></span></li></ul></div>
    <PmVideoPreview name="부산이음길" file="busan" width={480} height={1040} description="원본 온보딩 시연. 사용자 유형과 보행 조건을 고르고, 글씨 크기와 안내 방식을 설정합니다." />
  </div>;
}

export function SurveyVisual() {
  const burdenCount = survey.responses[0].count + survey.responses[1].count;
  return <div className={styles.surveyVisual}>
    <div className={styles.surveyTakeaway}><span className={styles.visualLabel}>얼굴을 드러내는 일의 부담</span><p className={styles.surveyNumber}>{(burdenCount / survey.total * 100).toFixed(1)}<span>%</span></p><p>‘꽤’ 또는 ‘매우’ 부담됨<br /><span>{survey.total}명 중 {burdenCount}명</span></p></div>
    <div className={styles.chart}><p className={styles.chartTitle}>Q9. 얼굴 노출 부담</p><ul>{survey.responses.map((response, index) => <li key={response.label}><div><span>{response.label}</span><span>{response.count}명 <small>{(response.count / survey.total * 100).toFixed(1)}%</small></span></div><span aria-hidden="true" className={index < 2 ? styles.barStrong : styles.bar} style={{ width: `${response.count / 56 * 100}%` }} /></li>)}</ul><p className={styles.chartNote}>분석 리포트의 인원수 기준 재계산 · n=168</p></div>
  </div>;
}

export function ProjectVisual({ slug }: { slug: string }) {
  if (slug === "aekkim") return <AekkimVisual />;
  if (slug === "busan-eumgil") return <BusanVisual />;
  if (slug === "play-pick") return <div className={styles.playPickVisual}>
    <div className={styles.playPickHeading}><div><span className={styles.visualLabel}>Play Pick</span><p>취향을 고르면,<br /><em>첫 추천이 시작됩니다.</em></p></div><span>호불호 선택 → 취향 저장 → 첫 추천</span></div>
    <PmVideoPreview name="Play Pick" file="play-pick" width={960} height={720} wide description="원본 온보딩 화면을 로컬에서 실행한 시연. 보고싶어요, 모르겠어요, 안볼래요를 선택하고 호불호 8개를 저장한 뒤 첫 추천을 확인합니다. 예시 계정과 보관된 공연 임베딩을 사용합니다." />
  </div>;
  if (slug === "smile-game") return <div className={styles.smileVisual}>
    <div className={styles.smileStatement}><span className={styles.visualLabel}>웃지마게임</span><p>함께 준비하고,<br /><em>한 판 시작하기.</em></p><span>준비 완료 → 카운트다운 → 게임 시작</span></div>
    <PmVideoPreview name="웃지마게임" file="smile" width={960} height={720} wide description="원본 초대배틀 녹화에서 핵심 화면을 확대하고 대기 구간을 줄인 편집본. 두 사용자가 준비를 마치고 3, 2, 1 카운트다운을 거쳐 게임을 시작합니다." />
  </div>;
  return null;
}

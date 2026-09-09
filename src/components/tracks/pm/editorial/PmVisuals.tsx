import Image from "next/image";
import { ArrowRight, Accessibility, AudioLines } from "lucide-react";
import { subscriptionFlow, survey } from "./content";
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
    <Image className={styles.aekkimImage} src="/pm/aekkim-detail.webp" width={620} height={1116} alt="AEKKIM 초기 구독 상세 목업. 요금, 사용 이력, 해지 안내를 보여주며 표시 금액은 예시입니다." sizes="(max-width: 767px) 230px, 340px" />
  </div>;
}

export function BusanVisual() {
  return <div className={styles.busanVisual}>
    <div className={styles.busanStatement}><span className={styles.visualLabel}>부산이음길</span><p>같은 목적지,<br /><em>다른 이동 조건.</em></p><ul><li><Accessibility aria-hidden="true" size={24} /><span>보행약자<strong>경사·단차·접근성 시설</strong></span></li><li><AudioLines aria-hidden="true" size={24} /><span>저시력자<strong>큰 버튼·음성 중심 안내</strong></span></li></ul></div>
    <Image className={styles.busanImage} src="/pm/busan-low-vision.webp" width={540} height={1170} alt="부산이음길 시연 화면. 저시력자와 보행약자 유형을 큰 버튼으로 선택합니다." sizes="(max-width: 767px) 220px, 300px" />
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
  if (slug === "smile-game") return <SurveyVisual />;
  return null;
}

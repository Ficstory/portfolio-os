import Image from "next/image";
import type { PrintSlide } from "./PmPrintPortfolio";
import base from "./PmPrintPortfolio.module.css";
import styles from "./PmPrintFndaSlides.module.css";

function Shot({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  return <figure className={styles.phone}>
    <Image src={`/pm-fnda/${name}.png`} alt={alt} width={1440} height={3120} loading="eager" sizes="230px" />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export const fndaSlides: PrintSlide[] = [
  {
    id: "pm-print-goraeit-intro",
    eyebrow: "FNDA 1차 · 제품·운영 개선 제안",
    title: "고래잇 세이프 카트",
    className: styles.slide,
    content: <div className={styles.cartIntro}>
      <div>
        <p className={base.lead}>아이 동반 고객의 불편을<br />기존 카트를 활용하는 개선안으로.</p>
        <p className={styles.description}>보호자의 장보기 경험을 조사하고, 탈부착 시트와 위생 커버를 결합한 카트 이용 개선안을 제안했습니다.</p>
        <section className={base.problemBox}><span>USER PROBLEM</span><p>아이를 돌보며 장을 보는 동안, 카트의 청결과 아이의 안정성을 계속 신경 써야 했습니다.</p></section>
        <dl className={base.projectMeta}>
          <div><dt>기간</dt><dd>2026.10.16–10.20</dd></div>
          <div><dt>프로젝트</dt><dd>FNDA · 이마트 고객경험 개선</dd></div>
          <div><dt>내 역할</dt><dd>팀장 / 고객 조사 설계·분석 / 해결안 범위 조정 / 제안 발표</dd></div>
        </dl>
      </div>
      <div className={styles.cartVisual}>
        <figure><Image src="/pm-fnda/goraeit-cover.png" alt="고래잇 세이프 카트 제안서 표지" width={1500} height={844} loading="eager" sizes="650px" /><figcaption>팀 최종 제안서 표지 · 제품·운영 기획 시안</figcaption></figure>
        <div className={styles.outputLine}><span>제안의 핵심</span><p>기존 카트에 탈부착 시트와 위생 커버를 더하고,<br />비치부터 회수·세척까지 이용 흐름을 설계</p></div>
      </div>
    </div>,
  },
  {
    id: "pm-print-goraeit-research",
    eyebrow: "고래잇 세이프 카트 · 고객 조사",
    title: "아이를 돌보며 장을 보는 보호자의 부담에 주목했습니다.",
    className: styles.slide,
    content: <div className={styles.research}>
      <aside className={styles.researchCounts}>
        <span>고객 조사</span>
        <div><strong>12<small>건</small></strong><p>인터뷰</p></div>
        <div><strong>10<small>건</small></strong><p>온라인 설문</p></div>
      </aside>
      <div>
        <table className={styles.evidenceTable}>
          <thead><tr><th>수집한 경험 · 요약</th><th>기획에서 주목한 점</th></tr></thead>
          <tbody>
            <tr><td>직접 닦아도 카트가 불결하게 느껴짐</td><td>사용 전 청결에 대한 불안</td></tr>
            <tr><td>아이가 불안정하게 느껴져 손으로 받쳐 줌</td><td>아이를 계속 살피는 보호자의 부담</td></tr>
            <tr><td>계산하는 동안 아이를 돌보기 어려움</td><td>장보기와 돌봄이 겹치는 순간</td></tr>
          </tbody>
        </table>
        <div className={styles.copyBlock}><span>내 기여</span><p>아이 동반 경험과 카트 이용 여부에 따라 질문을 설계했습니다. 팀이 수집한 고객 경험을 분석하고, 장보기 여정에서 불편이 발생하는 순간을 정리했습니다.</p></div>
        <div className={styles.callout}><strong>해결할 문제: 장보기와 돌봄이 겹치는 부담</strong><p>청결에 대한 불안과 아이를 계속 살펴야 하는 부담을 바탕으로, 아이가 앉는 공간을 개선하는 방향을 잡았습니다.</p></div>
      </div>
    </div>,
  },
  {
    id: "pm-print-goraeit-scope",
    eyebrow: "고래잇 세이프 카트 · 범위와 운영",
    title: "기존 카트를 활용하는 방향으로 제안의 범위를 좁혔습니다.",
    className: styles.slide,
    content: <div className={styles.scope}>
      <div className={styles.scopeComparison}>
        <section><span>초기 논의</span><h3>카트 구조 변경</h3><p>카트 전체를 바꾸는 방식은<br />실현 가능성이 주요 쟁점이었습니다.</p></section>
        <span className={styles.arrow} aria-hidden="true">→</span>
        <section><span>구체화한 제안</span><h3>탈부착 시트 + 위생 커버</h3><p>기존 카트를 활용하고,<br />보호자가 사용 전 커버를 씌우는 방식입니다.</p></section>
      </div>
      <ol className={styles.operationFlow} aria-label="제안한 운영 흐름">
        <li><span>01</span><strong>비치</strong><p>카트 이용 동선에<br />커버를 준비</p></li>
        <li><span>02</span><strong>사용</strong><p>아이를 태우기 전<br />커버 장착</p></li>
        <li><span>03</span><strong>회수</strong><p>사용한 커버를<br />지정 장소로 반환</p></li>
        <li><span>04</span><strong>세척·점검</strong><p>위생·상태 확인 후<br />다음 사용 준비</p></li>
      </ol>
      <div className={styles.bottomPair}>
        <section><span>내 판단과 기여</span><p>실현 가능성을 기준으로 기존 카트를 활용하도록 범위를 좁혔습니다. 고객 조사와 해결 방향을 연결하고, 제품과 운영을 함께 설명하는 제안을 구성했습니다.</p></section>
        <section><span>기획 결과</span><p>보호자의 장착·사용 과정과 매장의 회수·관리 과정을 함께 담은 개선안을 완성했습니다.</p></section>
      </div>
    </div>,
  },
  {
    id: "pm-print-ibosho-intro",
    eyebrow: "FNDA 2차 · 서비스 제안 · Android 시제품",
    title: "이보쇼",
    className: styles.slide,
    content: <div className={styles.appIntro}>
      <div>
        <p className={base.lead}>정보를 찾은 다음,<br />내 상황에 맞게 고르는 대화.</p>
        <p className={styles.description}>상품 설명·추천·쇼핑메모를 연결하는 AI 쇼핑 에이전트입니다. 이마트 앱 내 기능으로 기획하고, 별도 Android 시제품을 제작했습니다.</p>
        <section className={base.problemBox}><span>CORE EXPERIENCE</span><p>상품 확인 → 목적·조건 질문 → 설명·추천 → 추가 질문과 쇼핑메모</p></section>
        <dl className={base.projectMeta}>
          <div><dt>기간</dt><dd>2026.10.21–11.13</dd></div>
          <div><dt>결과물</dt><dd>기획서 · Android 앱 · 발표자료</dd></div>
          <div><dt>내 역할</dt><dd>고객 조사·설문 분석 / 서비스·UI 기획 / 시제품 구현·개선</dd></div>
        </dl>
      </div>
      <div className={styles.phones}>
        <Shot name="ibosho-product" alt="이보쇼 시제품의 올리브유 상품 상세 화면" caption="상품 상세 확인" />
        <Shot name="ibosho-conversation" alt="선택한 올리브유를 유지한 연관 상품 추천 대화" caption="선택 상품을 이어받는 대화" />
        <p className={styles.phoneNote}>Android 시제품 화면</p>
      </div>
    </div>,
  },
  {
    id: "pm-print-ibosho-research",
    eyebrow: "이보쇼 · 고객 문제와 서비스 기획",
    title: "정보를 확인해도 구매 판단이 어려운 고객에 주목했습니다.",
    className: styles.slide,
    content: <div className={styles.iboshoResearch}>
      <div className={styles.surveyStats}>
        <section><span>장보기 중 어려움 경험</span><strong>80.3<small>%</small></strong><p>최근 3개월 대형마트 방문자<br /><b>137명 중 110명</b></p></section>
        <section><span>부분 해결 후에도 판단 부족</span><strong>51.8<small>%</small></strong><p>어려움을 경험한 응답자<br /><b>110명 중 57명</b></p></section>
      </div>
      <div className={styles.researchReasoning}>
        <section><span>INTERPRETATION</span><h3>찾는 것에서, 이해하고 선택하는 것으로</h3><p>검색·포장·후기에서 얻은 정보를 자신의 사용 목적에 맞게 해석하는 과제가 남았습니다.</p></section>
        <section><span>SERVICE DECISION</span><h3>목적과 조건을 이어받는 대화</h3><p>“샐러드에 쓸 거예요”처럼 고객이 알려주는 상황을 상품 설명·추천 이유·후속 질문에 연결하도록 기획했습니다.</p></section>
        <section><span>내 기여</span><p>설문 응답을 장보기 어려움의 경험 여부와 해결 정도로 나눠 분석했습니다. 정보를 찾은 이후에도 남는 구매 판단의 어려움을 정리했습니다.</p></section>
      </div>
      <p className={styles.surveyFootnote}>고객 설문 150건 · 2026.11.06 마감</p>
    </div>,
  },
  {
    id: "pm-print-ibosho-implementation",
    eyebrow: "이보쇼 · 핵심 경험 구현",
    title: "선택한 상품을 중심으로 대화와 추천이 이어지게 했습니다.",
    className: styles.slide,
    content: <div className={styles.implementation}>
      <Shot name="ibosho-recommendations" alt="이보쇼 Android 시제품의 연관 상품 추천 카드" caption="선택한 상품에 대한 연관 추천" />
      <div className={styles.implementationCopy}>
        <ol className={styles.improvements}>
          <li><span>01</span><div><h3>상품을 다시 설명하지 않아도 이어지는 대화</h3><p>화면에서 선택한 상품을 대화의 기준으로 유지하도록 설계했습니다. 상품 상세를 확인한 뒤 같은 상품에 대해 질문할 수 있게 구현했습니다.</p></div></li>
          <li><span>02</span><div><h3>“같이 살 상품”을 새로운 검색으로 처리하던 문제 개선</h3><p>연관 추천 요청을 일반 검색으로 해석하던 동작을 수정했습니다. 선택한 상품을 유지하고, 그 상품과 연결된 추천을 보여주도록 바꿨습니다.</p></div></li>
          <li><span>03</span><div><h3>추천에서 상품 확인까지 이어지는 화면</h3><p>대화에 추천 상품 카드를 제공하고 상세 화면으로 연결했습니다. 상세 확인 후 대화로 돌아와도 추천 목록이 유지되도록 했습니다.</p></div></li>
        </ol>
        <div className={styles.callout}><strong>Android 시제품 구현</strong><p>상품 검색부터 추천 상품 상세 확인·대화 복귀까지 실제 휴대폰에서 동작을 확인했습니다.</p></div>
      </div>
    </div>,
  },
];

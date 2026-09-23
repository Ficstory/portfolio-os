import type { StoreAnalysisVisualization } from "@/types/til";
import styles from "./store-analysis.module.css";

const money = (value: number) => `${new Intl.NumberFormat("ko-KR").format(value)}원`;
const signedMoney = (value: number) => `${value >= 0 ? "+" : "−"}${money(Math.abs(value))}`;
const signedPercent = (value: number) => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}%`;
const million = (value: number) => `${(value / 1_000_000).toFixed(1)}백만원`;
const storeColors = ["#bd2138", "#667d89", "#a28458"];

function ChartHeading({ number, title, description }: { number: string; title: string; description: string }) {
  return <header className={styles.chartHeading}>
    <span>{number}</span><div><h3>{title}</h3><p>{description}</p></div>
  </header>;
}

function ExactValues({ rows }: { rows: { label: string; value: number }[] }) {
  return <details className={styles.exactValues}>
    <summary>원 단위 값 보기</summary>
    <dl>{rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{money(row.value)}</dd></div>)}</dl>
  </details>;
}

export function StoreAnalysis({ data }: { data: StoreAnalysisVisualization }) {
  const revenueRank = [...data.stores].sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = revenueRank[0].revenue;
  const minWeek = 60_000_000;
  const maxWeek = 73_000_000;
  const point = (revenue: number, index: number) => ({ x: 35 + index * 105, y: 175 - ((revenue - minWeek) / (maxWeek - minWeek)) * 135 });
  const weekPoints = data.weeks.map((week, index) => point(week.revenue, index));
  const promotionMax = Math.max(...data.promotion.flatMap((period) => period.sales));

  return <section className={styles.analysis} aria-label="점포 성과 분석 시각화">
    <div className={styles.intro}>
      <p className={styles.eyebrow}>DATA NOTE · 실습용 가상 데이터</p>
      <h2>같은 매출 증가, 서로 다른 내부 변화</h2>
      <p className={styles.lead}>동일 요일로 맞춘 비교기간의 전체 매출은 2.19% 증가했지만, 센트럴은 방문 감소와 객단가 상승, 리버는 전 상품군 증가, 파크는 구매건수 증가와 객단가 감소가 동시에 나타났다.</p>
      <dl className={styles.scope}>
        <div><dt>전체기간</dt><dd>{data.period}</dd></div>
        <div><dt>점포 · 상품</dt><dd>센트럴점 · 리버점 · 파크점 / 6개 상품군 · 20개 SKU</dd></div>
        <div><dt>비교기간</dt><dd>{data.comparison}</dd></div>
      </dl>
      <p className={styles.method}>두 비교기간에는 각 요일이 두 번씩 포함된다. 방문수는 고유 고객 수가 아닌 일별 방문 집계이며, 구매건수는 구매자 수가 아닌 거래 건수다. 매출은 할인 반영 후 순매출이다. 2026-09-24는 현재 시점보다 미래이므로 이 범위는 실습 데이터의 전체기간이다.</p>
    </div>

    <div className={styles.kpis} aria-label="전체 핵심 지표">
      {data.kpis.map((kpi) => <div key={kpi.label} className={styles.kpi}><span>{kpi.label}</span><strong>{kpi.value}</strong></div>)}
    </div>

    <section className={styles.chart} aria-label="점포별 전체 매출 규모">
      <ChartHeading number="01" title="점포별 전체 매출 규모" description="55일간의 순매출과 전체 매출에서 차지하는 비중" />
      <div className={styles.barList} role="img" aria-label={revenueRank.map((store) => `${store.name} ${money(store.revenue)}, ${store.share}%`).join("; ")}>
        {revenueRank.map((store) => <div className={styles.revenueRow} key={store.name}>
          <div className={styles.barMeta}><strong>{store.name}</strong><span title={money(store.revenue)}>{million(store.revenue)} <small>· {store.share.toFixed(2)}%</small></span></div>
          <div className={styles.barTrack}><span style={{ width: `${store.revenue / maxRevenue * 100}%` }} /></div>
        </div>)}
      </div>
      <ExactValues rows={revenueRank.map((store) => ({ label: store.name, value: store.revenue }))} />
      <p className={styles.observation}>55일 동안 매출·구매건수·구매율은 센트럴점, 파크점, 리버점 순으로 나타났다. 이 순위만으로 수익성이나 운영 역량을 판단할 수 없다.</p>
    </section>

    <section className={styles.chart} aria-label="점포별 매출 구조 변화">
      <ChartHeading number="02" title="점포별 매출 구조 변화" description="같은 요일 구성의 두 기간을 비교했다. 막대는 증감률이며 구매율 차이는 별도로 표시한다." />
      <div className={styles.structureGrid}>
        {data.stores.map((store) => <article className={styles.storeCard} key={store.name}>
          <h4>{store.name}</h4>
          {([ ["매출", store.salesChange], ["방문", store.visitsChange], ["객단가", store.basketChange] ] as const).map(([label, value]) => <div className={styles.changeRow} key={label}>
            <span>{label}</span><div className={styles.changePlot}><span className={value < 0 ? styles.negative : styles.positive} style={{ width: `${Math.abs(value) / 4 * 50}%`, [value < 0 ? "right" : "left"]: "50%" }} /></div><strong>{signedPercent(value)}</strong>
          </div>)}
          <dl className={styles.storeDetails}>
            <div><dt>구매건수</dt><dd>{store.purchasesBefore.toLocaleString("ko-KR")} → {store.purchasesAfter.toLocaleString("ko-KR")}</dd></div>
            <div><dt>구매율 차이</dt><dd>+{store.conversionPointChange.toFixed(3)}%p</dd></div>
            <div><dt>구매당 수량</dt><dd>{store.unitsBefore.toFixed(3)} → {store.unitsAfter.toFixed(3)}개</dd></div>
          </dl>
          <p>{store.observation}</p>
        </article>)}
      </div>
    </section>

    <section className={styles.chart} aria-label="점포별 상품군 매출 증감액">
      <ChartHeading number="03" title="점포 × 상품군 매출 증감액" description="0원을 기준으로 오른쪽은 증가, 왼쪽은 감소. 각 행에 원 단위 증감액을 함께 적었다." />
      <div className={styles.categoryList}>
        {data.categories.map((category) => <div className={styles.category} key={category.name}>
          <h4>{category.name}</h4>
          {category.changes.map((change, index) => <div className={styles.divergingRow} key={data.stores[index].name}>
            <span className={styles.storeName}>{data.stores[index].name.replace("점", "")}</span>
            <div className={styles.divergingPlot} role="img" aria-label={`${data.stores[index].name} ${signedMoney(change)}`}>
              <span className={change < 0 ? styles.negative : styles.positive} style={{ width: `${Math.abs(change) / 653000 * 50}%`, [change < 0 ? "right" : "left"]: "50%" }} />
            </div><strong>{signedMoney(change)}</strong>
          </div>)}
        </div>)}
      </div>
      <p className={styles.observation}>전체 합계에서는 6개 상품군 모두 증가했다. 가공식품 증가액은 +1,177,800원으로 전체 매출 순증액의 41.00%다. 냉장 간편식은 센트럴·파크에서 감소하고 리버에서 증가했다. 센트럴은 4개 증가·2개 감소, 리버는 6개 모두 증가, 파크는 5개 증가·1개 감소했다.</p>
    </section>

    <section className={styles.chart} aria-label="완전 주차별 전체 매출 추이">
      <ChartHeading number="04" title="완전 주차별 전체 매출 추이" description="7일이 모두 포함된 주만 비교했다. 첫 주 2일과 마지막 주 4일은 제외했다." />
      <div className={styles.lineChart}>
        <svg viewBox="0 0 700 210" role="img" aria-labelledby="weekly-title weekly-desc" preserveAspectRatio="xMidYMid meet">
          <title id="weekly-title">완전 주차별 전체 순매출</title>
          <desc id="weekly-desc">{data.weeks.map((week) => `${week.label} ${money(week.revenue)}`).join("; ")}</desc>
          {[40, 92, 144, 175].map((y) => <line key={y} x1="35" x2="665" y1={y} y2={y} className={styles.gridLine} />)}
          <polyline points={weekPoints.map(({ x, y }) => `${x},${y}`).join(" ")} fill="none" stroke="#bd2138" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {weekPoints.map(({ x, y }, index) => <circle key={data.weeks[index].label} cx={x} cy={y} r="5" fill="#fff" stroke="#bd2138" strokeWidth="2.5" />)}
        </svg>
        <ol className={styles.weekLabels}>{data.weeks.map((week) => <li key={week.label}><span>{week.label}</span><strong title={money(week.revenue)}>{million(week.revenue)}</strong></li>)}</ol>
      </div>
      <ExactValues rows={data.weeks.map((week) => ({ label: week.label, value: week.revenue }))} />
      <p className={styles.observation}>전체 완전주 매출은 8월 31일~9월 6일에 가장 높았고 이후 두 주 연속 감소했다.</p>
    </section>

    <section className={styles.chart} aria-label="행사기간 전 중 후 관측값">
      <ChartHeading number="05" title="행사기간 전·중·후 관측값" description="행사 대상 냉장 간편식 6개 SKU의 점포별 7일 순매출" />
      <div className={styles.promotionGrid}>{data.promotion.map((period) => <div className={styles.promotionPeriod} key={period.label}>
        <h4>{period.label}<span>{period.dates}</span></h4>
        {period.sales.map((sale, index) => <div className={styles.promotionRow} key={data.stores[index].name}>
          <span>{data.stores[index].name.replace("점", "")}</span><div className={styles.promotionTrack}><span style={{ width: `${sale / promotionMax * 100}%`, background: storeColors[index] }} /></div><strong title={money(sale)}>{million(sale)}</strong>
        </div>)}
      </div>)}</div>
      <ExactValues rows={data.promotion.flatMap((period) => period.sales.map((sale, index) => ({ label: `${period.label} · ${data.stores[index].name}`, value: sale })))} />
      <div className={styles.tableScroll}><table><caption>행사 전 대비 매출 변화</caption><thead><tr><th scope="col">점포</th><th scope="col">행사 중 / 전</th><th scope="col">행사 후 / 전</th><th scope="col">비행사 14개 SKU 중 / 전</th></tr></thead><tbody>
        {[["센트럴점", "+36.93%", "−8.06%", "+9.55%"], ["리버점", "+2.51%", "+0.45%", "+5.57%"], ["파크점", "+26.88%", "−3.18%", "+4.92%"]].map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}
      </tbody></table></div>
      <p className={styles.caveat}>실제 행사 기록은 9월 4일부터지만 RM-101 마스터 메모에는 9월 5일 시작으로 적혀 있다. 이 수치는 행사기간의 관측값이며 행사로 인한 효과를 뜻하지 않는다.</p>
    </section>

    <section className={styles.chart} aria-label="최신 완전주의 재고커버">
      <ChartHeading number="06" title="최신 완전주의 재고커버" description="재고커버일 = 기말재고 ÷ 일평균 판매수량. 색의 농도와 수치를 함께 표시했다." />
      <div className={styles.tableScroll}><table className={styles.heatmap}><caption>상품군별 점포 재고커버일</caption><thead><tr><th scope="col">상품군</th>{data.stores.map((store) => <th key={store.name} scope="col">{store.name}</th>)}</tr></thead><tbody>
        {data.categories.map((category) => <tr key={category.name}><th scope="row">{category.name}</th>{category.coverDays.map((days, index) => <td key={data.stores[index].name} style={{ backgroundColor: `rgba(189, 33, 56, ${0.055 + days / 8.8 * 0.15})` }}>{days.toFixed(2)}일</td>)}</tr>)}
      </tbody></table></div>
      <p className={styles.caveat}>SKU 최대는 파크 LV-602 8.96일, 최소는 파크 FR-203 2.37일이다. 최신 완전주의 모든 점포 × SKU 기말재고는 양수다. 일중 품절·리드타임·안전재고·폐기 정보가 없어 재고 상태를 판정할 수 없다.</p>
    </section>

    <section className={styles.chart} aria-label="SKU별 변화 사례">
      <ChartHeading number="07" title="집계 안의 다른 방향: SKU 사례" description="같은 상품군 안에서도 SKU별 증감 방향은 다르게 나타났다." />
      <div className={styles.skuGrid}>
        <div><span>리버 · RM-104 된장찌개</span><strong>+278,800원 <small>+12.39%</small></strong></div>
        <div><span>리버 · RM-101 <small>(상품명 미제공)</small></span><strong>−64,900원 <small>−3.10%</small></strong></div>
        <div><span>RM-106 곤약비빔밥</span><strong>센트럴 +249,600원<br />리버 +98,800원<br />파크 −228,800원</strong></div>
        <div><span>센트럴 · RM-103 샐러드랩</span><strong>−353,400원 <small>−9.38%</small></strong></div>
      </div>
      <p className={styles.caveat}>원본 분석 자료에 RM-101의 상품명이 없어 코드로만 표기했다. 리버 냉장 간편식 순증액 중 RM-104 증감액 비율은 60.01%다. 이는 상품군 순증액 대비 해당 SKU 증감액의 비율이며 성장 원인이나 매출 구성비가 아니다.</p>
    </section>

    <section className={styles.timeline} aria-label="기록된 운영 사건">
      <ChartHeading number="08" title="기록된 운영 사건" description="동일 기간에 남은 운영 메모를 관측값과 분리해 읽는다." />
      <ol>{data.events.map((event) => <li key={`${event.date}-${event.store}`}><time>{event.date}</time><div><strong>{event.store}</strong><p>{event.text}</p></div></li>)}</ol>
      <p className={styles.caveat}>각 사건은 같은 시기에 존재한 기록이며 매출 변화의 원인으로 확인된 것은 아니다.</p>
    </section>
  </section>;
}

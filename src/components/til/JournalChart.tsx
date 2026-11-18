import type { JournalFigure } from "@/types/til";
import styles from "./journal-chart.module.css";

const integer = new Intl.NumberFormat("ko-KR");
const percentage = new Intl.NumberFormat("ko-KR", { style: "percent", maximumFractionDigits: 2 });

export function JournalChart({ figure }: { figure: JournalFigure }) {
  const { rows, title, unit, note } = figure;
  const composition = figure.kind === "composition";
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const maximum = Math.max(...rows.map(row => row.value));

  return <figure className={styles.figure} aria-label={title}>
    <figcaption>{title}</figcaption>
    {composition && <div className={styles.stack} aria-hidden="true">
      {rows.map(row => <span key={row.label} style={{ width: `${100 * row.value / total}%` }} />)}
    </div>}
    <ul className={composition ? styles.legend : styles.bars}>
      {rows.map(row => <li key={row.label} data-highlight={row.highlight || undefined}>
        <span className={styles.label}>{row.label}</span>
        <span className={styles.value}>{integer.format(row.value)}{unit}
          {composition && figure.percentages && <small> ({percentage.format(row.value / total)})</small>}
        </span>
        {!composition && <span className={styles.track} aria-hidden="true">
          <span style={{ width: `${100 * row.value / maximum}%` }} />
        </span>}
      </li>)}
    </ul>
    <div className={styles.note}>{note}</div>
  </figure>;
}

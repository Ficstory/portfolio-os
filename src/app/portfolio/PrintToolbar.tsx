import styles from "./document.module.css";

export default function PrintToolbar() {
  return <div className={styles.toolbar}>
    <a className={styles.brand} href="#top">이재호 <span>포트폴리오</span></a>
    <nav aria-label="페이지 이동"><a href="#experience">경력</a><a href="#aekkim">프로젝트</a><a href="#about">교육·활동</a></nav>
    <div className={styles.printAction}><a href="/portfolio/print/">제출용 PDF</a></div>
  </div>;
}

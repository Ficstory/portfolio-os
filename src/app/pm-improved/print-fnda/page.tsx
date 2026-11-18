import type { Metadata } from "next";
import { PmPrintFndaPortfolio } from "@/components/pm-improved/print/PmPrintFndaPortfolio";
import { PmPrintToolbar } from "@/components/pm-improved/PmPrintToolbar";
import styles from "@/components/pm-improved/printPreview.module.css";
import fnda from "@/components/pm-improved/print/PmPrintFndaSlides.module.css";

export const metadata: Metadata = {
  title: { absolute: "FNDA 포함본 | 이재호 PM 포트폴리오" },
  description: "이보쇼, 고래잇 세이프 카트, J-OS, 부산이음길, 애낌을 담은 17쪽 PM 포트폴리오입니다.",
  robots: { index: false, follow: false },
};

export default function PmPrintFndaPage() {
  return <main id="pm-content" tabIndex={-1} className={styles.previewMain}>
    <nav className={fnda.previewNav} aria-label="FNDA 포함본 바로가기">
      <div><h1>PM 포트폴리오 · FNDA 포함본</h1><p>17쪽 · 고객 조사부터 서비스 기획과 시제품까지</p></div>
      <div><a href="#pm-print-cover">표지</a><a href="#pm-print-ibosho-intro">01 · 이보쇼</a><a href="#pm-print-goraeit-intro">02 · 고래잇 세이프 카트</a><a href="/PM/print/">기본 인쇄본</a></div>
    </nav>
    <PmPrintToolbar />
    <PmPrintFndaPortfolio preview />
  </main>;
}

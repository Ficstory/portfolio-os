import type { Metadata } from "next";

import { PmPrintPortfolio } from "@/components/pm-improved/print/PmPrintPortfolio";
import { PmPrintToolbar } from "@/components/pm-improved/PmPrintToolbar";
import styles from "@/components/pm-improved/printPreview.module.css";
import { baseUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "인쇄 미리보기 | 이재호 PM 포트폴리오" },
  alternates: { canonical: new URL("/PM/print/", baseUrl).toString() },
  openGraph: {
    title: "인쇄 미리보기 | 이재호 PM 포트폴리오",
    description: "이재호 PM 포트폴리오의 인쇄 미리보기입니다.",
    url: new URL("/PM/print/", baseUrl).toString(),
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "인쇄 미리보기 | 이재호 PM 포트폴리오",
    description: "이재호 PM 포트폴리오의 인쇄 미리보기입니다.",
    images: [],
  },
  robots: { follow: false, index: false },
};

export default function PmPrintPreviewPage() {
  return <main id="pm-content" tabIndex={-1} className={styles.previewMain}>
    <h1 className={styles.screenTitle}>이재호 PM 포트폴리오 인쇄 미리보기</h1>
    <PmPrintToolbar />
    <PmPrintPortfolio preview />
  </main>;
}

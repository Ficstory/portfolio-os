import type { Metadata } from "next";
import Image from "next/image";
import { baseUrl } from "@/lib/seo";
import styles from "./print.module.css";

export const metadata: Metadata = {
  title: { absolute: "이재호 | 제출용 포트폴리오 PDF" },
  description: "경력과 프로젝트를 담은 7쪽의 제출용 포트폴리오입니다.",
  alternates: { canonical: `${baseUrl}/portfolio/print/` },
  robots: { index: false, follow: false },
};

const pages = ["경력과 프로젝트", "부산참여연대", "애낌", "부산이음길", "웃지마게임", "PlayPick", "교육·활동"];
const pdf = "/portfolio/files/lee-jaeho-portfolio.pdf";

export default function PortfolioPrintPage() {
  return <main className={styles.site}>
    <header className={styles.toolbar}>
      <a className={styles.back} href="/portfolio/">← 웹 포트폴리오로 돌아가기</a>
      <div className={styles.actions}>
        <span>7쪽 · 가로형 · 820KB</span>
        <a className={styles.download} href={pdf} download="이재호_공통_포트폴리오.pdf">PDF 다운로드</a>
      </div>
    </header>
    <h1 className={styles.srOnly}>이재호 제출용 포트폴리오</h1>
    <div className={styles.deck} aria-label="PDF 전체 7쪽 미리보기">
      {pages.map((title, index) => <figure className={styles.page} key={title}>
        <Image src={`/portfolio/print/pages/page-${String(index + 1).padStart(2, "0")}.webp`}
          alt={`${index + 1}쪽 — ${title}`} width={1600} height={900} sizes="(max-width: 1280px) 100vw, 1200px" unoptimized loading="eager" priority={index === 0} />
        <figcaption className={styles.srOnly}>{index + 1}쪽 — {title}</figcaption>
      </figure>)}
      <p className={styles.note}>작은 화면에서는 <a href={pdf}>PDF를 열어 확대해서 볼 수 있습니다.</a></p>
    </div>
  </main>;
}

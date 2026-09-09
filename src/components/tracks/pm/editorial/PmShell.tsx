import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { links } from "@/data/links";
import { PmHeader } from "./PmHeader";
import styles from "./pm.module.css";

export function PmShell({ children }: { children: ReactNode }) {
  return <div className={styles.site}>
    <a className={styles.skipLink} href="#pm-content">본문으로 건너뛰기</a>
    <PmHeader />
    {children}
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        <p className={styles.footerLabel}>Contact</p>
        <h2>다음에 풀 문제를<br />함께 이야기해요.</h2>
        <a className={styles.email} href={links.email}>{links.email.replace("mailto:", "")}<ArrowUpRight aria-hidden="true" /></a>
        <div className={styles.footerBottom}><p>이재호 · PM 포트폴리오</p><Link href="/">다른 포트폴리오 보기 <ArrowUpRight size={16} aria-hidden="true" /></Link><a href="#pm-content">맨 위로 ↑</a></div>
      </div>
    </footer>
  </div>;
}

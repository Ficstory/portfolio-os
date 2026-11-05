import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { AxEditorialHeader } from "./AxEditorialHeader";
import p from "@/components/tracks/pm/editorial/pm.module.css";
import s from "./axEditorial.module.css";

export function AxEditorialShell({ children }: { children: ReactNode }) {
  return <div className={`${p.site} ${s.shell}`}>
    <a className={p.skipLink} href="#ax-content">본문으로 건너뛰기</a>
    <AxEditorialHeader />
    {children}
    <footer className={p.footer} id="contact"><div className={p.container}>
      <p className={p.footerLabel}>Contact</p><h2>다음에 풀 문제를<br />함께 이야기해요.</h2>
      <a className={p.email} href="mailto:dlwo4367@gmail.com">dlwo4367@gmail.com<ArrowUpRight aria-hidden="true" /></a>
      <div className={p.footerBottom}><p>이재호 · LOTTE AX Challenge 2026</p><Link href="/pm/">PM 포트폴리오<ArrowUpRight size={16} aria-hidden="true" /></Link><a href="#ax-content">맨 위로 ↑</a></div>
    </div></footer>
  </div>;
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useRef } from "react";
import { links } from "@/data/links";
import styles from "./pm.module.css";

const navigation = [
  { label: "프로젝트", href: "/pm/#work" },
  { label: "소개", href: "/pm/#about" },
  { label: "이력서", href: "/resume/" },
  { label: "이메일", href: links.email },
];

export function PmHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => { if (menu.current) menu.current.open = false; };
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.wordmark} href="/pm/" onClick={close} aria-label="Lee Jaeho, PM 포트폴리오 홈">Lee Jaeho<span aria-hidden="true">.</span></Link>
        <nav className={styles.desktopNav} aria-label="PM 포트폴리오">
          {navigation.map((item) => <Link key={item.label} href={item.href}>{item.label}{item.label === "이메일" && <ArrowUpRight aria-hidden="true" size={15} />}</Link>)}
        </nav>
        <details className={styles.mobileMenu} ref={menu} onKeyDown={(event) => {
          if (event.key === "Escape") { close(); menu.current?.querySelector("summary")?.focus(); }
        }}>
          <summary aria-label="메뉴"><span>메뉴</span><Menu className={styles.menuOpen} size={20} aria-hidden="true" /><X className={styles.menuClose} size={20} aria-hidden="true" /></summary>
          <nav aria-label="모바일 PM 포트폴리오">
            {navigation.map((item) => <Link key={item.label} href={item.href} onClick={close}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}

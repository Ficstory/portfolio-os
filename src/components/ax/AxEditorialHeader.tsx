"use client";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import p from "@/components/tracks/pm/editorial/pm.module.css";

const navigation = [
  { label: "Selected Work", href: "/ax/#work" },
  { label: "과제 적용", href: "/ax/#approach" },
  { label: "PDF · 인쇄 보기", href: "/ax/print/" },
];
export function AxEditorialHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => { if (menu.current) menu.current.open = false; };
  return <header className={p.header}><div className={p.headerInner}>
    <Link className={p.wordmark} href="/ax/" onClick={close}>Lee Jaeho<span>.</span></Link>
    <nav className={p.desktopNav} aria-label="AX 포트폴리오">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}{item.href === "/ax/print/" && <ArrowUpRight size={15} aria-hidden="true" />}</Link>)}</nav>
    <details className={p.mobileMenu} ref={menu} onKeyDown={event => { if (event.key === "Escape") { close(); menu.current?.querySelector("summary")?.focus(); } }}>
      <summary aria-label="메뉴"><span>메뉴</span><Menu className={p.menuOpen} size={20} aria-hidden="true" /><X className={p.menuClose} size={20} aria-hidden="true" /></summary>
      <nav aria-label="모바일 탐색">{navigation.map(item => <Link key={item.href} href={item.href} onClick={close}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}</nav>
    </details>
  </div></header>;
}

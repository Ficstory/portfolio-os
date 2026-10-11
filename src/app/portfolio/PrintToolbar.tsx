"use client";

import { useState } from "react";
import styles from "./document.module.css";

export default function PrintToolbar() {
  const [status, setStatus] = useState<"idle" | "preparing" | "failed">("idle");
  async function print() {
    setStatus("preparing");
    try {
      await document.fonts.ready;
      await Promise.all(Array.from(document.querySelectorAll<HTMLImageElement>("[data-common-portfolio] img")).map((image) => image.decode()));
      window.print();
      setStatus("idle");
    } catch {
      setStatus("failed");
    }
  }
  return <div className={styles.toolbar}>
    <a className={styles.brand} href="#top">이재호 <span>포트폴리오</span></a>
    <nav aria-label="페이지 이동"><a href="#experience">경력</a><a href="#aekkim">프로젝트</a><a href="#about">교육·활동</a></nav>
    <div className={styles.printAction}><button onClick={print} disabled={status === "preparing"}>{status === "preparing" ? "인쇄 준비 중…" : "PDF 저장·인쇄"}</button><p>인쇄 설정에서 머리글·바닥글을 해제해 주세요.</p></div>
    <p className={styles.printStatus} role="status">{status === "failed" ? "이미지를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요." : ""}</p>
  </div>;
}

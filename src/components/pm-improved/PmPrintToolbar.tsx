"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./printPreview.module.css";

type PrintStatus = "idle" | "preparing" | "failed";

async function preparePrintAssets() {
  await Promise.all([
    document.fonts.load("1em 'Pm Pretendard'"),
    document.fonts.ready,
  ]);

  const images = Array.from(document.querySelectorAll<HTMLImageElement>("[data-pm-print] img"));
  await Promise.all(images.map(async (image) => {
    await image.decode();
    if (!image.naturalWidth) throw new Error("An image could not be prepared for printing.");
  }));
}

export function PmPrintToolbar() {
  const [status, setStatus] = useState<PrintStatus>("idle");

  const handlePrint = async () => {
    setStatus("preparing");
    try {
      await preparePrintAssets();
      window.print();
      setStatus("idle");
    } catch {
      setStatus("failed");
    }
  };

  return <section className={styles.toolbar} data-pm-print-toolbar aria-label="인쇄 도구">
    <Link href="/PM/">포트폴리오로 돌아가기</Link>
    <div className={styles.actions}>
      <button type="button" onClick={handlePrint} disabled={status === "preparing"}>
        {status === "preparing" ? "인쇄 준비 중…" : "PDF 저장·인쇄"}
      </button>
      <p>인쇄 설정에서 ‘머리글과 바닥글 해제’와 ‘배경 그래픽 활성화’를 선택해 주세요.</p>
    </div>
    <p className={styles.status} aria-live="polite">
      {status === "failed" && "인쇄 준비에 문제가 생겼습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요."}
    </p>
  </section>;
}

"use client";

import { useState } from "react";

export function AxPrintButton() {
  const [status, setStatus] = useState<"idle" | "preparing" | "failed">("idle");
  const print = async () => {
    setStatus("preparing");
    try {
      await document.fonts.load("1em 'AX Portfolio Sans'");
      await document.fonts.ready;
      await Promise.all(Array.from(document.querySelectorAll<HTMLImageElement>("[data-ax-sheet] img")).map(image => image.decode()));
      window.print();
      setStatus("idle");
    } catch {
      setStatus("failed");
    }
  };
  return <><button type="button" onClick={print} disabled={status === "preparing"}>{status === "preparing" ? "인쇄 준비 중…" : "PDF 저장·인쇄"}</button>{status === "failed" && <span role="status">인쇄 자료를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.</span>}</>;
}

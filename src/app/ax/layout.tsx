import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "이재호 | LOTTE AX Challenge 2026 포트폴리오" },
  description: "문제를 정의하고 AI의 근거·실행·사용자 경험을 연결한 J-OS, 부산이음길, 애낌의 구현과 검증 기록.",
  robots: { index: false, follow: false },
  icons: { icon: "/ax/icon.svg" },
  openGraph: { title: "이재호 | AX 포트폴리오", description: "문제에서 구현으로, 구현에서 검증으로.", images: [] },
};

export default function AxLayout({ children }: { children: ReactNode }) {
  return children;
}

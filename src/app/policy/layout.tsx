import type { Metadata } from "next";

import { baseUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "이재호 | 정책지원관 포트폴리오",
  description:
    "부산참여연대의 의정평가, 예산·결산 분석, 시민감사 의제 취합 경험을 담은 정책지원관 지원 포트폴리오.",
  alternates: {
    canonical: new URL("/", baseUrl).toString(),
  },
  robots: {
    follow: false,
    index: false,
  },
};

export default function PolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

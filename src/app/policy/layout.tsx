import type { Metadata } from "next";

import { baseUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "이재호 | 정책지원관 포트폴리오",
  description:
    "조례·예산·행정사무감사·지역 의제를 분석해 정책 문서와 의정지원 자료로 구조화하는 정책지원관 지원 포트폴리오.",
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

import type { Metadata } from "next";

import { baseUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "이재호 | 공공·디지털 서비스기획 포트폴리오",
  description:
    "공공 문제를 사용자 요구, 요구사항, 화면 흐름, 기능 기준으로 번역하는 공공·디지털 서비스기획 포트폴리오.",
  alternates: {
    canonical: new URL("/", baseUrl).toString(),
  },
  robots: {
    follow: false,
    index: false,
  },
};

export default function PublicDigitalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

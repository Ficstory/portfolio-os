import type { Metadata } from "next";

import { baseUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "이재호 | 공공·디지털 서비스기획 포트폴리오",
  description:
    "공공자료 분석과 이동약자 길안내 앱의 요구사항·화면 구현 경험을 담은 서비스기획 포트폴리오.",
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

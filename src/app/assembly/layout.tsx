import type { Metadata } from "next";

import { baseUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "이재호 | 국회 보좌 실무 포트폴리오",
  description:
    "공공 이슈를 조사하고 입법·상임위·질의·메시지 자료로 구조화할 수 있는 보좌 실무 지원 포트폴리오.",
  alternates: {
    canonical: new URL("/", baseUrl).toString(),
  },
  robots: {
    follow: false,
    index: false,
  },
};

export default function AssemblyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

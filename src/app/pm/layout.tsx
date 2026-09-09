import type { Metadata } from "next";
import type { ReactNode } from "react";

import { baseUrl } from "@/lib/seo";
import { PmShell } from "@/components/tracks/pm/editorial/PmShell";

export const metadata: Metadata = {
  title: { absolute: "이재호 | 문제를 읽고, 실행을 설계하는 PM" },
  description:
    "AEKKIM, 부산이음길, 웃지마게임의 문제와 판단, 요구사항과 구현 근거를 담은 이재호의 PM 포트폴리오입니다.",
  alternates: {
    canonical: new URL("/pm/", baseUrl).toString(),
  },
  openGraph: {
    title: "이재호 | 문제를 읽고, 실행을 설계하는 PM",
    description: "프로젝트의 문제와 판단, 요구사항과 구현 근거를 담은 PM 포트폴리오입니다.",
    url: new URL("/pm/", baseUrl).toString(),
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "이재호 | PM 포트폴리오",
    description: "문제를 읽고, 실행을 설계합니다.",
    images: [],
  },
  robots: {
    follow: false,
    index: false,
  },
};

export default function PmLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <PmShell>{children}</PmShell>;
}

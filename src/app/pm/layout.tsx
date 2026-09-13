import type { Metadata } from "next";
import type { ReactNode } from "react";

import { baseUrl } from "@/lib/seo";
import { PmShell } from "@/components/tracks/pm/editorial/PmShell";

export const metadata: Metadata = {
  title: { absolute: "이재호 | PM 포트폴리오" },
  description:
    "애낌, 부산이음길, 웃지마게임, 플레이픽에서 맡은 조사, 요구사항 문서, 화면·API 구현을 소개합니다.",
  alternates: {
    canonical: new URL("/pm/", baseUrl).toString(),
  },
  openGraph: {
    title: "이재호 | PM 포트폴리오",
    description: "팀 프로젝트의 조사·기획·개발 경험과 산출물을 소개합니다.",
    url: new URL("/pm/", baseUrl).toString(),
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "이재호 | PM 포트폴리오",
    description: "조사, 요구사항 문서, 화면·API 구현 경험을 소개합니다.",
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

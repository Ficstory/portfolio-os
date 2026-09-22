import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { baseUrl } from "@/lib/seo";

const pretendard = localFont({
  src: "../../../../public/pm/fonts/PretendardVariable.woff2",
  variable: "--font-til-body",
  weight: "100 900",
  display: "swap",
});

const title = "Future & Dream Academy TIL 아카이브";
const description =
  "신세계 Future & Dream Academy에서 배우고 관찰한 내용을 다음 행동으로 연결하는 개인 학습 아카이브입니다.";
const canonicalUrl = new URL("/TIL/", baseUrl).toString();

export const metadata: Metadata = {
  title: { absolute: `${title} | 이재호 포트폴리오` },
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title,
    description,
    url: canonicalUrl,
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [],
  },
};

export default function FutureDreamTilLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className={pretendard.variable}>{children}</div>;
}

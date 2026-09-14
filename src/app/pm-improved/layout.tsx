import type { Metadata } from "next";
import type { ReactNode } from "react";

import { baseUrl } from "@/lib/seo";
import { PmShell } from "@/components/pm-improved/PmShell";

const title = "이재호 | Product Manager 포트폴리오";
const description =
  "조사 결과를 요구사항으로 정리하고 화면과 API까지 연결하는 이재호의 Product Manager 포트폴리오입니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: new URL("/PM/", baseUrl).toString(),
  },
  openGraph: {
    title,
    description,
    url: new URL("/PM/", baseUrl).toString(),
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title,
    description,
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

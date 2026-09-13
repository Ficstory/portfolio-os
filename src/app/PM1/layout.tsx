import type { Metadata } from "next";
import localFont from "next/font/local";

const display = localFont({
  src: "../../../public/pm1/fonts/Kanit-Black.ttf",
  variable: "--font-pm1-display",
  weight: "900",
  display: "swap",
});

const body = localFont({
  src: "../../../public/pm/fonts/PretendardVariable.woff2",
  variable: "--font-pm1-body",
  weight: "100 900",
  display: "swap",
});

const title = "이재호 | PM Portfolio";
const description =
  "기획 문서 작성, 사용자 조사, 프론트엔드 QA 경험을 담은 이재호의 PM 포트폴리오입니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://ficstory.dev/PM1/" },
  openGraph: {
    title,
    description,
    url: "https://ficstory.dev/PM1/",
    siteName: "이재호 PM Portfolio",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/PM1/opengraph-image/", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/PM1/opengraph-image/"],
  },
};

export default function Pm1Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${body.variable}`}>{children}</div>;
}

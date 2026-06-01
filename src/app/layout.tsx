import type { Metadata } from "next";

import { baseUrl, ogImage, siteDescription, siteName } from "@/lib/seo";

import "./globals.css";

const metadataTitle = `${siteName} | 공공·디지털 서비스 기획 포트폴리오`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: metadataTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    title: metadataTitle,
    description: siteDescription,
    url: baseUrl,
    siteName,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Portfolio OS 공유 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metadataTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";

import { baseUrl, siteDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "PM Track",
  description: siteDescription,
  alternates: {
    canonical: new URL("/", baseUrl).toString(),
  },
  robots: {
    follow: false,
    index: false,
  },
};

export default function PmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

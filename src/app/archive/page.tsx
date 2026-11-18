import type { Metadata } from "next";

import PortfolioHome from "@/components/portfolio/PortfolioHome";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortfolioArchivePage() {
  return <PortfolioHome />;
}

import type { Metadata } from "next";
import EmartGuide from "./EmartGuide";
import { content } from "./content";

export const metadata: Metadata = {
  title: { absolute: content.ko.title },
  description: `${content.ko.noticeKo} ${content.zh.noticeZh}`,
  robots: { index: false, follow: false },
  openGraph: { title: content.ko.title, description: content.ko.noticeKo, url: "/event/emart/", images: [] },
  twitter: { card: "summary", title: content.ko.title, description: content.ko.noticeKo, images: [] },
};

export default function EmartPage() {
  return <EmartGuide />;
}

import type { Metadata } from "next";
import EmartGuide from "./EmartGuide";
import { content } from "./content";

export const metadata: Metadata = {
  title: { absolute: content.ko.title },
  description: `${content.ko.store} · ${content.ko.intro} ${content.ko.footer}`,
  robots: { index: false, follow: false },
  openGraph: { title: content.ko.title, description: content.ko.intro, url: "/event/emart/", images: [] },
  twitter: { card: "summary", title: content.ko.title, description: content.ko.intro, images: [] },
};

export default function EmartPage() {
  return <EmartGuide />;
}

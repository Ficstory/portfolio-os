import { Suspense } from "react";

import { FutureDreamTilPage } from "@/components/til/FutureDreamTilPage";
import { loadPublishedTILContent } from "@/lib/tilContent";

export default function FutureDreamTilRoute() {
  const { categories, entries, journey } = loadPublishedTILContent();

  return (
    <Suspense fallback={<div aria-label="TIL 아카이브 불러오는 중" />}>
      <FutureDreamTilPage
        categories={categories}
        entries={entries}
        journey={journey}
      />
    </Suspense>
  );
}

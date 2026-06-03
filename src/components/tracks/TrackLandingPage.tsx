import Link from "next/link";

import { TrackCaseSection } from "@/components/tracks/TrackCaseSection";
import { TrackHero } from "@/components/tracks/TrackHero";
import { getTrackLandingModel } from "@/components/tracks/trackLandingModel";
import { TrackProofPanel } from "@/components/tracks/TrackProofPanel";
import type { PortfolioTrackId } from "@/lib/portfolioTrack";

type TrackLandingPageProps = {
  trackId: PortfolioTrackId;
};

export function TrackLandingPage({ trackId }: TrackLandingPageProps) {
  const model = getTrackLandingModel(trackId);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <nav
        aria-label="트랙 이동"
        className="border-b border-slate-200 bg-slate-950 text-white"
      >
        <div className="mx-auto flex w-full max-w-[100vw] flex-col items-start gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between md:max-w-6xl md:px-8">
          <Link className="text-sm font-bold" href="/">
            ficstory.dev
          </Link>
          <div className="flex min-w-0 flex-wrap gap-2 text-xs font-semibold text-slate-300">
            <Link className="rounded-md px-2.5 py-1.5 hover:bg-white/10 hover:text-white" href="/public-digital">
              Public Digital
            </Link>
            <Link className="rounded-md px-2.5 py-1.5 hover:bg-white/10 hover:text-white" href="/pm">
              PM
            </Link>
            <Link className="rounded-md px-2.5 py-1.5 hover:bg-white/10 hover:text-white" href="/policy">
              Policy
            </Link>
            <Link className="rounded-md px-2.5 py-1.5 hover:bg-white/10 hover:text-white" href="/assembly">
              Assembly
            </Link>
          </div>
        </div>
      </nav>

      <TrackHero model={model} />
      <TrackCaseSection model={model} />
      <TrackProofPanel model={model} />
    </main>
  );
}

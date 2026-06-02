import Link from "next/link";

import type { TrackLandingModel } from "@/components/tracks/trackLandingModel";

type TrackHeroProps = {
  model: TrackLandingModel;
};

export function TrackHero({ model }: TrackHeroProps) {
  const { ctaLinks, profile, track } = model;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.25fr_0.75fr] md:px-8 md:py-14">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
            {track.label}
          </p>
          <h1 className="mt-3 text-pretty text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
            {profile.headline}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700">
            {profile.introduction}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {ctaLinks.map((link) => (
              <Link
                className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 transition hover:border-sky-400 hover:text-sky-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-bold text-slate-950">핵심 역량</h2>
          <ul className="mt-4 space-y-3">
            {profile.strengths.map((strength) => (
              <li className="flex gap-3 text-sm leading-6 text-slate-700" key={strength}>
                <span aria-hidden="true" className="mt-2 size-2 rounded-full bg-[var(--color-green)]" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.focusKeywords.map((keyword) => (
              <span
                className="rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800"
                key={keyword}
              >
                {keyword}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

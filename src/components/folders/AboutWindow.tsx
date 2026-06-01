import { usePortfolioTrack } from "@/components/portfolio/PortfolioTrackProvider";

export function AboutWindow() {
  const { profile } = usePortfolioTrack();

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase text-muted">{profile.role}</p>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
            {profile.name}
          </h3>
          <p className="max-w-2xl text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
            {profile.headline}
          </p>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            {profile.introduction}
          </p>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="about-strengths-heading">
        <h4
          id="about-strengths-heading"
          className="text-sm font-bold text-slate-950 dark:text-white"
        >
          핵심 강점
        </h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {profile.strengths.slice(0, 3).map((strength, index) => (
            <article
              className="rounded-lg border border-slate-200/80 bg-white/56 p-4 dark:border-white/12 dark:bg-slate-950/28"
              key={strength}
            >
              <span className="text-xs font-bold text-[#4f8fd9] dark:text-[#8ab7ff]">
                0{index + 1}
              </span>
              <p className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-100">
                {strength}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="about-focus-heading">
        <h4
          id="about-focus-heading"
          className="text-sm font-bold text-slate-950 dark:text-white"
        >
          현재 집중
        </h4>
        <div className="rounded-lg border border-slate-200/80 bg-white/48 p-4 dark:border-white/12 dark:bg-slate-950/24">
          <p className="text-sm leading-6 text-slate-800 dark:text-slate-100">
            {profile.currentFocus}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="현재 집중 키워드">
            {profile.focusKeywords.map((keyword) => (
              <li
                className="rounded-md border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-white/12 dark:bg-white/8 dark:text-slate-100"
                key={keyword}
              >
                {keyword}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

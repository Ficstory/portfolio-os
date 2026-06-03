import { ProjectCard } from "@/components/projects/ProjectCard";
import { PmProjectCard } from "@/components/projects/PmProjectCard";
import { PublicServiceProjectCard } from "@/components/projects/PublicServiceProjectCard";
import {
  CareerCaseCard,
  CareerDocumentCard,
} from "@/components/tracks/CareerCaseCard";
import type { TrackLandingModel } from "@/components/tracks/trackLandingModel";

type TrackCaseSectionProps = {
  model: TrackLandingModel;
};

function SectionHeading({
  eyebrow,
  summary,
  title,
}: {
  eyebrow: string;
  summary: string;
  title: string;
}) {
  return (
    <div className="min-w-0 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 break-words text-2xl font-bold text-slate-950">
        {title}
      </h2>
      <p className="mt-3 break-words text-sm leading-6 text-slate-700">{summary}</p>
    </div>
  );
}

export function TrackCaseSection({ model }: TrackCaseSectionProps) {
  const {
    caseSections,
    orderedCareerCases,
    orderedProjects,
    primaryCaseKind,
    primaryProjectCardKind,
    track,
  } = model;
  const isCareerFirst = primaryCaseKind === "career";
  const primaryCareerCases = orderedCareerCases.slice(0, isCareerFirst ? 6 : 2);
  const primaryProjects = orderedProjects.slice(0, isCareerFirst ? 3 : 4);

  function renderPrimaryProjectCard(
    project: (typeof primaryProjects)[number],
    index: number,
  ) {
    const href = `/projects/${project.slug}`;

    if (primaryProjectCardKind === "pm") {
      return (
        <PmProjectCard
          href={href}
          index={index + 1}
          key={project.id}
          project={project}
        />
      );
    }

    if (primaryProjectCardKind === "publicDigital") {
      return (
        <PublicServiceProjectCard
          href={href}
          index={index + 1}
          key={project.id}
          project={project}
        />
      );
    }

    return <ProjectCard href={href} key={project.id} project={project} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[100vw] flex-col gap-10 px-5 py-10 md:max-w-6xl md:px-8">
      {isCareerFirst ? (
        <>
          <section className="min-w-0 max-w-full" aria-labelledby="career-cases" id="career-cases">
            <SectionHeading {...caseSections.primary} />
            <div className="mt-5 flex flex-col gap-4">
              {primaryCareerCases.map((careerCase, index) => (
                <CareerDocumentCard
                  careerCase={careerCase}
                  featured={index === 0}
                  index={index + 1}
                  key={careerCase.id}
                  trackId={track.id}
                />
              ))}
            </div>
          </section>

          <section className="min-w-0 max-w-full" aria-labelledby="case-studies" id="case-studies">
            <SectionHeading {...caseSections.secondary} />
            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
              {primaryProjects.map((project) => (
                <ProjectCard href={`/projects/${project.slug}`} key={project.id} project={project} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="min-w-0 max-w-full" aria-labelledby="case-studies" id="case-studies">
            <SectionHeading {...caseSections.primary} />
            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              {primaryProjects.map(renderPrimaryProjectCard)}
            </div>
          </section>

          <section className="min-w-0 max-w-full" aria-labelledby="career-cases" id="career-cases">
            <SectionHeading {...caseSections.secondary} />
            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              {primaryCareerCases.map((careerCase, index) => (
                <CareerCaseCard
                  careerCase={careerCase}
                  featured={index === 0}
                  key={careerCase.id}
                  trackId={track.id}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

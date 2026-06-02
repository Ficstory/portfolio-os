import { ProjectCard } from "@/components/projects/ProjectCard";
import { CareerCaseCard } from "@/components/tracks/CareerCaseCard";
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
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-normal text-sky-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{summary}</p>
    </div>
  );
}

export function TrackCaseSection({ model }: TrackCaseSectionProps) {
  const { orderedCareerCases, orderedProjects, primaryCaseKind, track } = model;
  const isCareerFirst = primaryCaseKind === "career";
  const primaryCareerCases = orderedCareerCases.slice(0, isCareerFirst ? 6 : 2);
  const primaryProjects = orderedProjects.slice(0, isCareerFirst ? 3 : 4);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 md:px-8">
      {isCareerFirst ? (
        <>
          <section aria-labelledby="career-cases" id="career-cases">
            <SectionHeading
              eyebrow="Career Evidence"
              summary="정책지원관과 국회 보좌관 트랙에서는 개발 프로젝트보다 의정감시, 정책자료 분석, 문서화 경험을 먼저 보여줍니다."
              title="정책·의정 경력 케이스"
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
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

          <section aria-labelledby="case-studies" id="case-studies">
            <SectionHeading
              eyebrow="Digital Literacy"
              summary="소프트웨어 프로젝트는 정책·보좌 트랙에서 상단 증거가 아니라 디지털 이슈와 협업 가능성을 보여주는 보조 근거입니다."
              title="보조 디지털 프로젝트"
            />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {primaryProjects.map((project) => (
                <ProjectCard href={`/projects/${project.slug}`} key={project.id} project={project} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section aria-labelledby="case-studies" id="case-studies">
            <SectionHeading
              eyebrow="Case Studies"
              summary="서비스기획 트랙에서는 프로젝트 산출물과 구현 협업 기준을 먼저 보여주고, 공공정책 경력은 문제정의의 배경 증거로 연결합니다."
              title="대표 프로젝트"
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {primaryProjects.map((project) => (
                <ProjectCard href={`/projects/${project.slug}`} key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section aria-labelledby="career-cases" id="career-cases">
            <SectionHeading
              eyebrow="Public-sector Evidence"
              summary="부산참여연대 경력은 프로젝트가 아니라 공공 문제를 읽고 문서로 구조화한 경력 케이스로 분리합니다."
              title="공공·의정 경력 근거"
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
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

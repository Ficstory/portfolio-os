import { ProjectMetaPanel } from "@/components/projects/ProjectMetaPanel";
import { ExternalLink, FileCheck2 } from "lucide-react";
import type { Project } from "@/types/portfolio";

type ProjectDetailProps = {
  project: Project;
};

type ProjectSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

function ProjectSection({ children, id, title }: ProjectSectionProps) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 className="text-xl font-bold text-slate-950 dark:text-white" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li className="rounded-lg border border-slate-200 bg-white/64 p-4 text-sm leading-7 text-slate-700 dark:border-white/12 dark:bg-slate-950/30 dark:text-slate-200" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function EvidenceList({ items }: { items: Project["evidence"] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          className="rounded-lg border border-slate-200 bg-white/64 p-4 text-sm leading-7 text-slate-700 dark:border-white/12 dark:bg-slate-950/30 dark:text-slate-200"
          key={item.label}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
              {item.category}
            </span>
            <span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-bold text-sky-800 dark:bg-sky-300/12 dark:text-sky-100">
              {item.availability === "public" ? "공개 자료" : "내부 산출물"}
            </span>
          </div>
          <div className="mt-4 flex gap-3">
            <FileCheck2
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-sky-700 dark:text-sky-200"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-slate-950 dark:text-white">{item.label}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
              {item.href ? (
                <a
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-sky-700 underline-offset-4 hover:underline dark:text-sky-200"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  증빙 열기
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="mx-auto max-w-3xl space-y-9">
        <section
          aria-labelledby="project-value-heading"
          className="rounded-lg border border-white/54 bg-white/72 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-[18px] dark:border-white/14 dark:bg-slate-950/42"
        >
          <p className="text-xs font-bold uppercase tracking-normal text-sky-700 dark:text-sky-200">
            프로젝트 한 줄 가치
          </p>
          <h1
            className="mt-3 text-pretty text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white"
            id="project-value-heading"
          >
            {project.title}
          </h1>
          <p className="mt-5 text-pretty text-lg font-semibold leading-8 text-slate-900 dark:text-slate-50">
            {project.valueStatement}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {project.summary}
          </p>
        </section>

        <ProjectSection id="project-problem" title="문제 정의">
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
            {project.problem}
          </p>
        </ProjectSection>

        <ProjectSection id="project-role" title="내 역할">
          <ul className="flex flex-wrap gap-2">
            {project.role.map((role) => (
              <li
                className="rounded-md border border-slate-200 bg-white/68 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-white/12 dark:bg-white/8 dark:text-slate-100"
                key={role}
              >
                {role}
              </li>
            ))}
          </ul>
        </ProjectSection>

        <ProjectSection id="project-stack" title="기술 이해">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                className="rounded-md bg-sky-50 px-3 py-2 text-sm font-bold text-sky-800 dark:bg-sky-300/12 dark:text-sky-100"
                key={tech}
              >
                {tech}
              </li>
            ))}
          </ul>
        </ProjectSection>

        <ProjectSection id="project-implementation" title="산출물과 기술 이해">
          <TextList items={project.implementationHighlights} />
        </ProjectSection>

        <ProjectSection id="project-troubleshooting" title="제약 조건과 주의점">
          <TextList items={project.troubleshooting} />
        </ProjectSection>

        <ProjectSection id="project-result" title="직무 관점의 의미와 증빙">
          <TextList items={project.result} />
        </ProjectSection>

        <ProjectSection id="project-evidence" title="증빙 자료">
          <EvidenceList items={project.evidence} />
        </ProjectSection>

        <ProjectSection id="project-links-media" title="역할·기술 요약">
          <ProjectMetaPanel project={project} />
        </ProjectSection>
      </div>
    </article>
  );
}

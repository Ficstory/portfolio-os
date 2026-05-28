import { ProjectMetaPanel } from "@/components/projects/ProjectMetaPanel";
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

        <ProjectSection id="project-stack" title="기술 스택">
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

        <ProjectSection id="project-implementation" title="주요 구현">
          <TextList items={project.implementationHighlights} />
        </ProjectSection>

        <ProjectSection id="project-troubleshooting" title="트러블슈팅">
          <TextList items={project.troubleshooting} />
        </ProjectSection>

        <ProjectSection id="project-result" title="성과와 배운 점">
          <TextList items={project.result} />
        </ProjectSection>

        <ProjectSection id="project-links-media" title="링크와 미디어">
          <ProjectMetaPanel project={project} />
        </ProjectSection>
      </div>
    </article>
  );
}

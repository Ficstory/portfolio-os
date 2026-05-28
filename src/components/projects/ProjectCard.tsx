import Link from "next/link";

import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

type ProjectCardBaseProps = {
  project: Project;
  className?: string;
};

type ProjectCardLinkProps = ProjectCardBaseProps & {
  href: string;
  onSelect?: never;
};

type ProjectCardButtonProps = ProjectCardBaseProps & {
  href?: never;
  onSelect: () => void;
};

export type ProjectCardProps = ProjectCardLinkProps | ProjectCardButtonProps;

function ProjectCardContent({ project }: { project: Project }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-normal text-sky-700 dark:text-sky-200">
            Featured Project
          </p>
          <h3 className="mt-2 text-pretty text-xl font-bold text-slate-950 dark:text-white">
            {project.title}
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 size-3 shrink-0 rounded-full bg-[var(--color-green)] shadow-[0_0_0_4px_rgba(93,174,139,0.16)]"
        />
      </div>

      <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
        {project.summary}
      </p>
      <p className="text-sm font-semibold leading-6 text-slate-950 dark:text-white">
        {project.valueStatement}
      </p>

      <div aria-label="담당 역할" className="flex flex-wrap gap-2">
        {project.role.map((role) => (
          <span
            className="rounded-md border border-slate-200 bg-white/62 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-white/12 dark:bg-white/8 dark:text-slate-100"
            key={role}
          >
            {role}
          </span>
        ))}
      </div>

      <ul aria-label="기술 스택" className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-sky-300/12 dark:text-sky-100"
            key={tech}
          >
            {tech}
          </li>
        ))}
      </ul>
    </>
  );
}

export function ProjectCard(props: ProjectCardProps) {
  const { className, project } = props;
  const interactiveClassName = cn(
    "group flex h-full w-full flex-col gap-4 rounded-lg border border-slate-200/80 bg-white/76 p-5 text-left shadow-sm transition duration-150",
    "hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]",
    "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]",
    "dark:border-white/12 dark:bg-slate-950/34 dark:hover:border-sky-300/40 dark:hover:bg-slate-900/68",
    className,
  );
  const ariaLabel = `${project.title} 상세 보기`;

  if ("onSelect" in props) {
    return (
      <button
        aria-label={ariaLabel}
        className={interactiveClassName}
        onClick={props.onSelect}
        type="button"
      >
        <ProjectCardContent project={project} />
      </button>
    );
  }

  return (
    <Link aria-label={ariaLabel} className={interactiveClassName} href={props.href}>
      <ProjectCardContent project={project} />
    </Link>
  );
}

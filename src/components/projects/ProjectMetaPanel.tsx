import { ExternalLink, FileText, Images, Rocket } from "lucide-react";

import type { Project, ProjectLinks } from "@/types/portfolio";

type ProjectMetaPanelProps = {
  project: Project;
};

const linkLabels: Record<keyof ProjectLinks, string> = {
  article: "아티클",
  demo: "데모",
  github: "GitHub",
};

const linkIcons: Record<keyof ProjectLinks, typeof ExternalLink> = {
  article: FileText,
  demo: Rocket,
  github: ExternalLink,
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function ProjectMetaPanel({ project }: ProjectMetaPanelProps) {
  const linkItems = (Object.entries(project.links) as [keyof ProjectLinks, string][])
    .filter(([, href]) => Boolean(href));

  return (
    <aside
      aria-label={`${project.title} 메타 정보`}
      className="rounded-lg border border-slate-200 bg-white/78 p-5 shadow-sm dark:border-white/12 dark:bg-slate-950/36"
    >
      <div className="space-y-6">
        <section aria-labelledby="project-meta-role">
          <h3
            className="text-xs font-bold uppercase tracking-normal text-slate-500 dark:text-slate-300"
            id="project-meta-role"
          >
            역할
          </h3>
          <ul className="mt-3 space-y-2">
            {project.role.map((role) => (
              <li className="text-sm leading-6 text-slate-800 dark:text-slate-100" key={role}>
                {role}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-meta-stack">
          <h3
            className="text-xs font-bold uppercase tracking-normal text-slate-500 dark:text-slate-300"
            id="project-meta-stack"
          >
            기술 스택
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-sky-300/12 dark:text-sky-100"
                key={tech}
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-meta-links">
          <h3
            className="text-xs font-bold uppercase tracking-normal text-slate-500 dark:text-slate-300"
            id="project-meta-links"
          >
            링크
          </h3>
          {linkItems.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {linkItems.map(([type, href]) => {
                const Icon = linkIcons[type];
                const isExternal = isExternalHref(href);

                return (
                  <a
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:border-sky-300 hover:text-sky-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)] dark:border-white/12 dark:bg-white/8 dark:text-slate-100 dark:hover:border-sky-300/40 dark:hover:text-sky-100"
                    href={href}
                    key={type}
                    rel={isExternal ? "noreferrer" : undefined}
                    target={isExternal ? "_blank" : undefined}
                  >
                    <Icon aria-hidden="true" size={16} strokeWidth={2.2} />
                    {linkLabels[type]}
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
              등록된 외부 링크가 없습니다.
            </p>
          )}
        </section>

        <section aria-labelledby="project-meta-media">
          <h3
            className="text-xs font-bold uppercase tracking-normal text-slate-500 dark:text-slate-300"
            id="project-meta-media"
          >
            미디어
          </h3>
          {project.media.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {project.media.map((media) => (
                <li
                  className="flex items-start gap-2 text-sm leading-6 text-slate-800 dark:text-slate-100"
                  key={media}
                >
                  <Images
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-slate-400"
                    size={16}
                    strokeWidth={2.2}
                  />
                  <span className="min-w-0 break-words">{media}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
              등록된 미디어가 없습니다.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}

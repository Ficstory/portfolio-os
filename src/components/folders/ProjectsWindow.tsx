import { projects } from "@/data/projects";

const displayedProjects = projects.slice(0, 3);

export function ProjectsWindow() {
  return (
    <section className="space-y-4" aria-labelledby="projects-window-heading">
      <div className="space-y-1">
        <h3
          id="projects-window-heading"
          className="text-xl font-bold text-slate-950 dark:text-white"
        >
          대표 프로젝트
        </h3>
        <p className="text-sm leading-6 text-muted">
          상세 화면 연결 전까지 프로젝트 3개의 핵심 요약만 표시합니다.
        </p>
      </div>

      <div className="grid gap-4">
        {displayedProjects.map((project) => (
          <article
            className="rounded-lg border border-slate-200/80 bg-white/56 p-4 dark:border-white/12 dark:bg-slate-950/28"
            key={project.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">
                  {project.title}
                </h4>
                <p className="max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-200">
                  {project.summary}
                </p>
              </div>
              <span className="w-fit rounded-md bg-[#dcebff] px-3 py-1 text-xs font-bold text-slate-800 dark:bg-white/10 dark:text-slate-100">
                {project.slug}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <div>
                <dt className="text-xs font-bold uppercase text-muted">Role</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.role.slice(0, 3).map((role) => (
                    <span
                      className="rounded-md border border-slate-200/80 bg-white/68 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-white/12 dark:bg-white/8 dark:text-slate-100"
                      key={role}
                    >
                      {role}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-muted">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.stack.slice(0, 4).map((stack) => (
                    <span
                      className="rounded-md bg-slate-900/6 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-white/8 dark:text-slate-100"
                      key={stack}
                    >
                      {stack}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

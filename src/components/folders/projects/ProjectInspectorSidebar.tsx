import { Archive, FolderKanban, GitBranch, PanelLeft } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

import { createProjectActivityLogs } from "./projectInspectorModel";

type ProjectInspectorSidebarProps = {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
};

const projectIcons = [FolderKanban, GitBranch, Archive] as const;

export function ProjectInspectorSidebar({
  projects,
  selectedProjectId,
  onSelectProject,
}: ProjectInspectorSidebarProps) {
  const totalLogCount = projects.reduce(
    (count, project) => count + createProjectActivityLogs(project).length,
    0,
  );

  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200/80 bg-slate-100/72 text-slate-900 dark:border-white/12 dark:bg-slate-950/28 dark:text-slate-50">
      <div className="border-b border-slate-200/80 px-3 py-3 dark:border-white/12">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-white/72 text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-100">
            <PanelLeft aria-hidden="true" size={15} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold">All projects</p>
            <p className="text-[11px] font-medium text-muted">
              {totalLogCount} documented logs
            </p>
          </div>
          <span className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            {projects.length}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {projects.map((project, index) => {
          const Icon = projectIcons[index % projectIcons.length];
          const isSelected = project.id === selectedProjectId;
          const logCount = createProjectActivityLogs(project).length;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition",
                "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4f8fd9]",
                isSelected
                  ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/80 dark:bg-white/12 dark:text-white dark:ring-white/14"
                  : "text-slate-700 hover:bg-white/58 dark:text-slate-200 dark:hover:bg-white/8",
              )}
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              type="button"
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-md border",
                  isSelected
                    ? "border-sky-200 bg-[#dcebff] text-[#2f6fac] dark:border-sky-300/28 dark:bg-sky-300/16 dark:text-sky-100"
                    : "border-slate-200/80 bg-white/64 text-slate-500 dark:border-white/10 dark:bg-white/8 dark:text-slate-300",
                )}
              >
                <Icon aria-hidden="true" size={16} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold">
                  {project.title}
                </span>
                <span className="block truncate font-mono text-[11px] text-muted">
                  /{project.slug}
                </span>
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-bold",
                  isSelected
                    ? "bg-slate-900/8 text-slate-700 dark:bg-white/12 dark:text-slate-100"
                    : "bg-white/70 text-slate-500 dark:bg-white/8 dark:text-slate-300",
                )}
                title={`${logCount} logs`}
              >
                {logCount}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

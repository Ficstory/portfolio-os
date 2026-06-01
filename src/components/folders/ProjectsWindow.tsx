"use client";

import { useMemo, useState } from "react";

import { projects } from "@/data/projects";

import { ProjectActivityLog } from "./projects/ProjectActivityLog";
import { ProjectInspectorSidebar } from "./projects/ProjectInspectorSidebar";
import { ProjectRuleList } from "./projects/ProjectRuleList";
import {
  createProjectActivityLogs,
  createProjectInspector,
  type ProjectActivityLogId,
} from "./projects/projectInspectorModel";

const firstProject = projects[0];
const firstLogId =
  firstProject ? createProjectActivityLogs(firstProject)[0]?.id ?? "context" : "context";

export function ProjectsWindow() {
  const [selectedProjectId, setSelectedProjectId] = useState(
    firstProject?.id ?? "",
  );
  const [selectedLogId, setSelectedLogId] =
    useState<ProjectActivityLogId>(firstLogId);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? firstProject;

  const inspector = useMemo(() => {
    if (!selectedProject) {
      return {
        rules: [],
        logs: [],
      };
    }

    return createProjectInspector(selectedProject);
  }, [selectedProject]);

  const resolvedLogId =
    inspector.logs.find((log) => log.id === selectedLogId)?.id ??
    inspector.logs[0]?.id ??
    "context";

  const handleSelectProject = (projectId: string) => {
    const nextProject = projects.find((project) => project.id === projectId);
    const nextFirstLog = nextProject
      ? createProjectActivityLogs(nextProject)[0]?.id
      : undefined;

    setSelectedProjectId(projectId);
    setSelectedLogId(nextFirstLog ?? "context");
  };

  if (!selectedProject) {
    return (
      <section className="rounded-md border border-slate-200/80 bg-white/70 p-4 text-sm text-muted dark:border-white/12 dark:bg-white/6">
        No projects documented.
      </section>
    );
  }

  return (
    <section
      aria-label="Project inspector"
      className="grid h-full min-h-[560px] overflow-hidden rounded-md border border-slate-200/80 bg-white/64 text-slate-900 shadow-sm md:grid-cols-[208px_minmax(300px,0.9fr)_minmax(380px,1.1fr)] dark:border-white/12 dark:bg-slate-950/18 dark:text-slate-50"
    >
      <ProjectInspectorSidebar
        onSelectProject={handleSelectProject}
        projects={projects}
        selectedProjectId={selectedProject.id}
      />
      <ProjectRuleList project={selectedProject} rules={inspector.rules} />
      <ProjectActivityLog
        logs={inspector.logs}
        onSelectLog={setSelectedLogId}
        project={selectedProject}
        selectedLogId={resolvedLogId}
      />
    </section>
  );
}

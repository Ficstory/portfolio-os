import type { Project, ProjectLinks } from "@/types/portfolio";

export type ProjectInspectorMethod = "GET" | "POST" | "PATCH";

export type ProjectRuleId =
  | "role"
  | "stack"
  | "problem"
  | "implementation"
  | "troubleshooting"
  | "result"
  | "links";

export type ProjectActivityLogId = "context" | ProjectRuleId;

export type ProjectRule = {
  id: ProjectRuleId;
  label: string;
  method: ProjectInspectorMethod;
  path: string;
  statusCode: number;
  statusLabel: string;
  description: string;
  entries: string[];
};

export type ProjectActivityLog = {
  id: ProjectActivityLogId;
  label: string;
  code: number;
  method: ProjectInspectorMethod;
  path: string;
  summary: string;
  details: string[];
};

export type ProjectInspector = {
  rules: ProjectRule[];
  logs: ProjectActivityLog[];
};

function projectPath(project: Project, segment: string) {
  return `/project/${project.slug}/${segment}`;
}

function getDocumentedLinks(links: ProjectLinks) {
  return Object.entries(links).filter((entry): entry is [string, string] =>
    Boolean(entry[1]),
  );
}

function formatLinks(links: ProjectLinks) {
  return getDocumentedLinks(links).map(([type, href]) => `${type}: ${href}`);
}

function firstLine(entries: string[], fallback: string) {
  return entries[0] ?? fallback;
}

export function createProjectRules(project: Project): ProjectRule[] {
  const links = formatLinks(project.links);
  const hasLinks = links.length > 0;

  const rules: ProjectRule[] = [
    {
      id: "role",
      label: "Role",
      method: "GET",
      path: projectPath(project, "role"),
      statusCode: 200,
      statusLabel: "200 Documented",
      description: "Ownership and responsibilities in this project.",
      entries: project.role,
    },
    {
      id: "stack",
      label: "Stack",
      method: "GET",
      path: projectPath(project, "stack"),
      statusCode: 200,
      statusLabel: "200 Documented",
      description: "Frontend tools and supporting workflow choices.",
      entries: project.stack,
    },
    {
      id: "problem",
      label: "Problem",
      method: "GET",
      path: projectPath(project, "context"),
      statusCode: 200,
      statusLabel: "200 Context",
      description: "The project problem this work is framed around.",
      entries: [project.problem],
    },
    {
      id: "implementation",
      label: "Implementation",
      method: "POST",
      path: projectPath(project, "implementation"),
      statusCode: 201,
      statusLabel: "201 Created",
      description: "Implemented decisions and reusable pieces.",
      entries: project.implementationHighlights,
    },
    {
      id: "troubleshooting",
      label: "Troubleshooting",
      method: "PATCH",
      path: projectPath(project, "troubleshooting"),
      statusCode: 500,
      statusLabel: "500 Investigated",
      description: "Failure cases or ambiguity that shaped the work.",
      entries: project.troubleshooting,
    },
    {
      id: "result",
      label: "Result",
      method: "GET",
      path: projectPath(project, "result"),
      statusCode: 200,
      statusLabel: "200 Result",
      description: "Outcome statements captured for the portfolio.",
      entries: project.result,
    },
  ];

  if (hasLinks) {
    rules.push({
      id: "links",
      label: "Links",
      method: "GET",
      path: projectPath(project, "links"),
      statusCode: 302,
      statusLabel: "302 Linked",
      description: "External references attached to this project.",
      entries: links,
    });
  }

  return rules;
}

export function createProjectActivityLogs(project: Project): ProjectActivityLog[] {
  const links = formatLinks(project.links);
  const hasLinks = links.length > 0;

  const logs: ProjectActivityLog[] = [
    {
      id: "context",
      label: "Context",
      code: 200,
      method: "GET",
      path: projectPath(project, "context"),
      summary: project.valueStatement,
      details: [project.summary, project.valueStatement, project.problem],
    },
    {
      id: "role",
      label: "Role",
      code: 200,
      method: "GET",
      path: projectPath(project, "role"),
      summary: firstLine(project.role, "No role entries documented."),
      details: project.role,
    },
    {
      id: "stack",
      label: "Stack",
      code: 200,
      method: "GET",
      path: projectPath(project, "stack"),
      summary: project.stack.join(", "),
      details: project.stack,
    },
    {
      id: "implementation",
      label: "Implementation",
      code: 201,
      method: "POST",
      path: projectPath(project, "implementation"),
      summary: firstLine(
        project.implementationHighlights,
        "No implementation highlights documented.",
      ),
      details: project.implementationHighlights,
    },
    {
      id: "troubleshooting",
      label: "Troubleshooting",
      code: 500,
      method: "PATCH",
      path: projectPath(project, "troubleshooting"),
      summary: firstLine(
        project.troubleshooting,
        "No troubleshooting entries documented.",
      ),
      details: project.troubleshooting,
    },
    {
      id: "result",
      label: "Result",
      code: 200,
      method: "GET",
      path: projectPath(project, "result"),
      summary: firstLine(project.result, "No result entries documented."),
      details: project.result,
    },
  ];

  if (hasLinks) {
    logs.push({
      id: "links",
      label: "Links",
      code: 302,
      method: "GET",
      path: projectPath(project, "links"),
      summary: "External project links are documented.",
      details: links,
    });
  }

  return logs;
}

export function createProjectInspector(project: Project): ProjectInspector {
  return {
    rules: createProjectRules(project),
    logs: createProjectActivityLogs(project),
  };
}

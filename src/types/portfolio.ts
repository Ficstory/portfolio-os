export type FolderId =
  | "about"
  | "projects"
  | "skills"
  | "ai-chat"
  | "resume"
  | "contact";

export type WindowId = FolderId | `project-${string}`;

export type ThemeMode = "light" | "dark" | "system";

export type SkillCategory =
  | "frontend"
  | "state"
  | "styling"
  | "tooling"
  | "collaboration"
  | "ai";

export type WindowSize = {
  width: number;
  height: number;
};

export type FolderItem = {
  id: FolderId;
  title: string;
  description: string;
  iconName: string;
  defaultWindowSize: WindowSize;
};

export type NavigationItem = {
  id: FolderId;
  label: string;
  title: string;
  iconName: string;
  windowId: WindowId;
};

export type ProjectLinks = {
  github?: string;
  demo?: string;
  article?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  valueStatement: string;
  problem: string;
  role: string[];
  stack: string[];
  implementationHighlights: string[];
  troubleshooting: string[];
  result: string[];
  links: ProjectLinks;
  thumbnail: string;
  media: string[];
  contentPath?: string;
};

export type Skill = {
  name: string;
  category: SkillCategory;
  level: "used" | "comfortable" | "strong";
  description: string;
  relatedProjects: string[];
};

export type ResumeSummary = {
  headline: string;
  strengths: string[];
  projectHighlights: {
    projectId: string;
    summary: string;
  }[];
  techSummary: string[];
  educationAndActivities: string[];
  pdfPath: string;
};

export type ExternalLinkType = "github" | "blog" | "email";

export type ExternalLinks = Partial<Record<ExternalLinkType, string>>;

export type ExternalLinkSlot = {
  type: ExternalLinkType;
  label: string;
  iconName: string;
};

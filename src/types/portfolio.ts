export type FolderId =
  | "about"
  | "career-tracks"
  | "projects"
  | "skills"
  | "resume"
  | "contact";

export type WindowId = FolderId | `project-${string}`;

export type ThemeMode = "light" | "dark" | "system";

export type SkillCategory =
  | "problem-framing"
  | "requirements"
  | "stakeholder"
  | "data"
  | "technical"
  | "documentation"
  | "ai";

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowSizePreset = {
  widthRatio: number;
  heightRatio: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
};

export type FolderItem = {
  id: FolderId;
  title: string;
  description: string;
  iconName: string;
  defaultWindowSize: WindowSizePreset;
};

export type NavigationItem = {
  id: FolderId;
  label: string;
  title: string;
  iconName: string;
  dockIconSrc?: string;
  windowId: WindowId;
};

export type ProjectLinks = {
  github?: string;
  demo?: string;
  article?: string;
};

export type ProjectEvidence = {
  label: string;
  category: string;
  description: string;
  availability: "public" | "internal";
  href?: string;
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
  evidence: ProjectEvidence[];
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

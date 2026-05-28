import type { FolderItem } from "@/types/portfolio";

export const folders = [
  {
    id: "about",
    title: "About Me",
    description: "Profile, strengths, current focus, and personal keywords.",
    iconName: "UserRound",
    defaultWindowSize: {
      width: 760,
      height: 560,
    },
  },
  {
    id: "projects",
    title: "Projects",
    description: "Three featured projects with implementation details.",
    iconName: "FolderKanban",
    defaultWindowSize: {
      width: 920,
      height: 640,
    },
  },
  {
    id: "skills",
    title: "Skills",
    description: "Frontend skills grouped by practical usage context.",
    iconName: "Code2",
    defaultWindowSize: {
      width: 820,
      height: 600,
    },
  },
  {
    id: "resume",
    title: "Resume",
    description: "Resume summary and PDF download entry point.",
    iconName: "FileText",
    defaultWindowSize: {
      width: 780,
      height: 620,
    },
  },
  {
    id: "contact",
    title: "Contact",
    description: "Contact channels and external profile entry points.",
    iconName: "Mail",
    defaultWindowSize: {
      width: 680,
      height: 480,
    },
  },
] as const satisfies readonly FolderItem[];

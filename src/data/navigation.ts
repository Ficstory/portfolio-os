import type { ExternalLinkSlot, NavigationItem } from "@/types/portfolio";

export const navigationItems = [
  {
    id: "about",
    label: "About",
    title: "About Me",
    iconName: "UserRound",
    windowId: "about",
  },
  {
    id: "projects",
    label: "Projects",
    title: "Projects",
    iconName: "FolderKanban",
    windowId: "projects",
  },
  {
    id: "skills",
    label: "Skills",
    title: "Skills",
    iconName: "Code2",
    windowId: "skills",
  },
  {
    id: "ai-chat",
    label: "AI Chat",
    title: "Portfolio AI",
    iconName: "Bot",
    windowId: "ai-chat",
  },
  {
    id: "resume",
    label: "Resume",
    title: "Resume",
    iconName: "FileText",
    windowId: "resume",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact",
    iconName: "Mail",
    windowId: "contact",
  },
] as const satisfies readonly NavigationItem[];

export const externalLinkSlots = [
  {
    type: "github",
    label: "GitHub",
    iconName: "Github",
  },
  {
    type: "blog",
    label: "Blog",
    iconName: "BookOpenText",
  },
  {
    type: "email",
    label: "Email",
    iconName: "Mail",
  },
] as const satisfies readonly ExternalLinkSlot[];

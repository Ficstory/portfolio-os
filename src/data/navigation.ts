import type { ExternalLinkSlot, NavigationItem } from "@/types/portfolio";

export const navigationItems = [
  {
    id: "about",
    label: "About",
    title: "About Me",
    iconName: "UserRound",
    dockIconSrc: "/icons/dock/about.webp",
    windowId: "about",
  },
  {
    id: "projects",
    label: "Case Studies",
    title: "Case Studies",
    iconName: "FolderKanban",
    dockIconSrc: "/icons/dock/projects.webp",
    windowId: "projects",
  },
  {
    id: "skills",
    label: "Skills",
    title: "Skills",
    iconName: "Code2",
    dockIconSrc: "/icons/dock/skills.webp",
    windowId: "skills",
  },
  {
    id: "ai-chat",
    label: "AI Chat",
    title: "Portfolio AI",
    iconName: "Bot",
    dockIconSrc: "/icons/dock/ai-chat.webp",
    windowId: "ai-chat",
  },
  {
    id: "resume",
    label: "Resume",
    title: "Resume",
    iconName: "FileText",
    dockIconSrc: "/icons/dock/resume.webp",
    windowId: "resume",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact",
    iconName: "Mail",
    dockIconSrc: "/icons/dock/contact.webp",
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

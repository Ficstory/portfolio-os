"use client";

import { AppWindow } from "@/components/desktop/AppWindow";
import { AboutWindow } from "@/components/folders/AboutWindow";
import { ContactWindow } from "@/components/folders/ContactWindow";
import { ProjectsWindow } from "@/components/folders/ProjectsWindow";
import { ResumeWindow } from "@/components/folders/ResumeWindow";
import { SkillsWindow } from "@/components/folders/SkillsWindow";
import {
  type DesktopWindow,
  useDesktopStore,
} from "@/stores/desktopStore";

function PlaceholderContent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-prose text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function renderWindowContent(window: DesktopWindow) {
  switch (window.id) {
    case "about":
      return <AboutWindow />;
    case "projects":
      return <ProjectsWindow />;
    case "skills":
      return <SkillsWindow />;
    case "resume":
      return <ResumeWindow />;
    case "contact":
      return <ContactWindow />;
    default:
      if (window.id.startsWith("project-")) {
        return (
          <PlaceholderContent
            description="Project detail content will be connected after the project detail step."
            title={window.title}
          />
        );
      }

      return null;
  }
}

export function WindowManager() {
  const windows = useDesktopStore((state) => state.windows);
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);

  if (windows.length === 0) {
    return null;
  }

  return (
    <div aria-label="Open windows" className="pointer-events-none absolute inset-0">
      {windows.map((window) => (
        <AppWindow
          id={window.id}
          isActive={window.id === activeWindowId}
          key={window.id}
          position={window.position}
          size={window.size}
          title={window.title}
          zIndex={window.zIndex}
        >
          {renderWindowContent(window)}
        </AppWindow>
      ))}
    </div>
  );
}

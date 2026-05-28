import { skills } from "@/data/skills";
import type { SkillCategory } from "@/types/portfolio";

const categoryOrder: SkillCategory[] = [
  "frontend",
  "state",
  "styling",
  "tooling",
  "collaboration",
  "ai",
];

const categoryLabels: Record<SkillCategory, string> = {
  frontend: "Frontend",
  state: "State Management",
  styling: "Styling",
  tooling: "Tooling",
  collaboration: "Collaboration",
  ai: "AI Workflow",
};

const levelLabels = {
  used: "Used",
  comfortable: "Comfortable",
  strong: "Strong",
} as const;

const groupedSkills = categoryOrder.map((category) => ({
  category,
  label: categoryLabels[category],
  skills: skills.filter((skill) => skill.category === category),
}));

export function SkillsWindow() {
  return (
    <section className="space-y-5" aria-labelledby="skills-window-heading">
      <div className="space-y-1">
        <h3
          id="skills-window-heading"
          className="text-xl font-bold text-slate-950 dark:text-white"
        >
          기술 경험
        </h3>
        <p className="text-sm leading-6 text-muted">
          기술을 단순 나열하지 않고 실제 사용 맥락별로 묶었습니다.
        </p>
      </div>

      <div className="space-y-5">
        {groupedSkills.map((group) => {
          if (group.skills.length === 0) {
            return null;
          }

          return (
            <section className="space-y-3" key={group.category}>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                {group.label}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.skills.map((skill) => (
                  <article
                    className="rounded-lg border border-slate-200/80 bg-white/56 p-4 dark:border-white/12 dark:bg-slate-950/28"
                    key={skill.name}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h5 className="text-base font-bold text-slate-950 dark:text-white">
                        {skill.name}
                      </h5>
                      <span className="shrink-0 rounded-md bg-[#dcebff] px-2.5 py-1 text-xs font-bold text-slate-800 dark:bg-white/10 dark:text-slate-100">
                        {levelLabels[skill.level]}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                      {skill.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

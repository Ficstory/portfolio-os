import { skills } from "@/data/skills";
import type { SkillCategory } from "@/types/portfolio";

const categoryOrder: SkillCategory[] = [
  "problem-framing",
  "requirements",
  "stakeholder",
  "data",
  "technical",
  "documentation",
  "ai",
];

const categoryLabels: Record<SkillCategory, string> = {
  "problem-framing": "Problem Framing",
  requirements: "Requirement Definition",
  stakeholder: "Stakeholder Communication",
  data: "Data-informed Planning",
  technical: "Technical Understanding",
  documentation: "Product Documentation",
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
          직무 역량
        </h3>
        <p className="text-sm leading-6 text-muted">
          개발 스택보다 문제 정의, 요구사항, 문서화, 기술 이해의 근거를 먼저 보여줍니다.
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

import Link from "next/link";
import {
  ArrowUp,
  BookOpenText,
  Code2,
  Download,
  ExternalLink,
  FileText,
  FolderKanban,
  Mail,
  Route,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { usePortfolioTrack } from "@/components/portfolio/PortfolioTrackProvider";
import { TrackLinkPanel } from "@/components/tracks/TrackLinkPanel";
import { resumeSummary } from "@/content/resume-summary";
import { externalLinks } from "@/data/links";
import { externalLinkSlots } from "@/data/navigation";
import { skills } from "@/data/skills";
import type {
  ExternalLinkType,
  FolderId,
  Project,
  ProjectLinks,
  SkillCategory,
} from "@/types/portfolio";

type MobileSectionProps = {
  sectionId: FolderId;
};

type SectionMeta = {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
};

const sectionMeta: Record<FolderId, SectionMeta> = {
  about: {
    title: "About Me",
    eyebrow: "Profile",
    description: "소개, 강점, 현재 집중하는 키워드를 한 화면에서 읽습니다.",
    icon: UserRound,
  },
  "career-tracks": {
    title: "Career Tracks",
    eyebrow: "Direct Links",
    description: "지원 직무별로 정리한 포트폴리오 링크를 확인합니다.",
    icon: Route,
  },
  projects: {
    title: "Case Studies",
    eyebrow: "Featured Work",
    description: "대표 사례의 문제, 역할, 산출물, 기술 이해를 문서형으로 정리합니다.",
    icon: FolderKanban,
  },
  skills: {
    title: "Skills",
    eyebrow: "Experience",
    description: "직무 역량과 이를 뒷받침하는 근거 경험을 확인합니다.",
    icon: Code2,
  },
  resume: {
    title: "Resume",
    eyebrow: "Summary",
    description: "핵심 역량, 프로젝트 요약, 기술 요약을 제공합니다.",
    icon: FileText,
  },
  contact: {
    title: "Contact",
    eyebrow: "Links",
    description: "GitHub와 이메일 진입점을 제공합니다.",
    icon: Mail,
  },
};

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
  ai: "AI Workflow",
  data: "Data-informed Planning",
  documentation: "Product Documentation",
  "problem-framing": "Problem Framing",
  requirements: "Requirement Definition",
  stakeholder: "Stakeholder Communication",
  technical: "Technical Understanding",
};

const levelLabels = {
  comfortable: "Comfortable",
  strong: "Strong",
  used: "Used",
} as const;

const linkLabels: Record<keyof ProjectLinks, string> = {
  article: "아티클",
  demo: "데모",
  github: "GitHub",
};

const contactDescriptions: Record<ExternalLinkType, string> = {
  blog: "개발 기록과 회고",
  email: "직접 연락",
  github: "코드와 프로젝트 작업 기록",
};

const contactIcons = {
  blog: BookOpenText,
  email: Mail,
  github: Code2,
} satisfies Record<ExternalLinkType, LucideIcon>;

function isUsableHref(href: string | undefined) {
  return Boolean(href && href !== "mailto:");
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function SectionBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-950 dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ChipList({
  ariaLabel,
  items,
  tone = "neutral",
}: {
  ariaLabel: string;
  items: string[];
  tone?: "neutral" | "accent";
}) {
  return (
    <ul aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          className={
            tone === "accent"
              ? "rounded-md bg-sky-50 px-3 py-2 text-sm font-bold text-sky-800 dark:bg-sky-300/12 dark:text-sky-100"
              : "rounded-md border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-white/12 dark:bg-white/8 dark:text-slate-100"
          }
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          className="rounded-lg border border-slate-200/80 bg-white/68 p-4 text-sm leading-6 text-slate-700 dark:border-white/12 dark:bg-slate-950/30 dark:text-slate-200"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectLinksList({ project }: { project: Project }) {
  const linkItems = (Object.entries(project.links) as [keyof ProjectLinks, string][])
    .filter(([, href]) => Boolean(href));

  if (linkItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {linkItems.map(([type, href]) => {
        const isExternal = isExternalHref(href);

        return (
          <a
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200/80 bg-white/76 px-3 py-2 text-sm font-bold text-slate-800 dark:border-white/12 dark:bg-white/8 dark:text-slate-100"
            href={href}
            key={type}
            rel={isExternal ? "noreferrer" : undefined}
            target={isExternal ? "_blank" : undefined}
          >
            {linkLabels[type]}
            <ExternalLink aria-hidden="true" size={15} strokeWidth={2.2} />
          </a>
        );
      })}
    </div>
  );
}

function AboutContent() {
  const { profile } = usePortfolioTrack();

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <p className="text-sm font-bold uppercase text-muted">{profile.role}</p>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
          {profile.name}
        </h2>
        <p className="text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
          {profile.headline}
        </p>
        <p className="text-sm leading-6 text-muted">{profile.introduction}</p>
      </section>

      <SectionBlock title="핵심 강점">
        <TextList items={profile.strengths} />
      </SectionBlock>

      <SectionBlock title="현재 집중">
        <div className="rounded-lg border border-slate-200/80 bg-white/68 p-4 dark:border-white/12 dark:bg-slate-950/30">
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
            {profile.currentFocus}
          </p>
          <div className="mt-4">
            <ChipList ariaLabel="현재 집중 키워드" items={profile.focusKeywords} />
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}

function ProjectsContent() {
  const { projects } = usePortfolioTrack();

  return (
    <div className="space-y-5">
      {projects.map((project, index) => (
        <article
          className="space-y-5 rounded-lg border border-slate-200/80 bg-white/72 p-4 shadow-sm dark:border-white/12 dark:bg-slate-950/34"
          key={project.id}
        >
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase text-sky-700 dark:text-sky-200">
              Project 0{index + 1}
            </p>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                {project.title}
              </h2>
              <p className="text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
                {project.valueStatement}
              </p>
              <p className="text-sm leading-6 text-muted">{project.summary}</p>
            </div>
          </header>

          <SectionBlock title="문제 정의">
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
              {project.problem}
            </p>
          </SectionBlock>

          <SectionBlock title="내 역할">
            <ChipList ariaLabel={`${project.title} 역할`} items={project.role} />
          </SectionBlock>

          <SectionBlock title="기술 이해">
            <ChipList
              ariaLabel={`${project.title} 기술 이해`}
              items={project.stack}
              tone="accent"
            />
          </SectionBlock>

          <SectionBlock title="산출물과 기술 이해">
            <TextList items={project.implementationHighlights} />
          </SectionBlock>

          <SectionBlock title="제약 조건과 주의점">
            <TextList items={project.troubleshooting} />
          </SectionBlock>

          <SectionBlock title="직무 관점의 의미와 증빙">
            <TextList items={project.result} />
          </SectionBlock>

          <div className="flex flex-col gap-3">
            <ProjectLinksList project={project} />
            <Link
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
              href={`/projects/${project.slug}`}
            >
              상세 페이지 열기
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function SkillsContent() {
  const groupedSkills = categoryOrder.map((category) => ({
    category,
    label: categoryLabels[category],
    skills: skills.filter((skill) => skill.category === category),
  }));

  return (
    <div className="space-y-6">
      {groupedSkills.map((group) => {
        if (group.skills.length === 0) {
          return null;
        }

        return (
          <SectionBlock key={group.category} title={group.label}>
            <div className="space-y-3">
              {group.skills.map((skill) => (
                <article
                  className="rounded-lg border border-slate-200/80 bg-white/68 p-4 dark:border-white/12 dark:bg-slate-950/30"
                  key={skill.name}
                >
                  <div className="flex flex-col gap-2 min-[390px]:flex-row min-[390px]:items-start min-[390px]:justify-between">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white">
                      {skill.name}
                    </h3>
                    <span className="w-fit rounded-md bg-[#dcebff] px-2.5 py-1 text-xs font-bold text-slate-800 dark:bg-white/10 dark:text-slate-100">
                      {levelLabels[skill.level]}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    {skill.description}
                  </p>
                </article>
              ))}
            </div>
          </SectionBlock>
        );
      })}
    </div>
  );
}

function ResumeContent() {
  const { projects } = usePortfolioTrack();
  const hasPdfPath = resumeSummary.pdfPath.trim().length > 0;
  const projectTitleById = new Map(
    projects.map((project) => [project.id, project.title]),
  );

  return (
    <div className="space-y-7">
      <section className="space-y-4">
        <p className="text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
          {resumeSummary.headline}
        </p>
        {hasPdfPath ? (
          <a
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
            download
            href={resumeSummary.pdfPath}
          >
            <Download aria-hidden="true" size={16} />
            이력서 PDF 다운로드
          </a>
        ) : null}
      </section>

      <SectionBlock title="핵심 역량">
        <TextList items={resumeSummary.strengths} />
      </SectionBlock>

      <SectionBlock title="프로젝트 요약">
        <div className="space-y-3">
          {resumeSummary.projectHighlights.map((highlight) => (
            <article
              className="rounded-lg border border-slate-200/80 bg-white/68 p-4 dark:border-white/12 dark:bg-slate-950/30"
              key={highlight.projectId}
            >
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                {projectTitleById.get(highlight.projectId) ?? highlight.projectId}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {highlight.summary}
              </p>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="기술 요약">
        <TextList items={resumeSummary.techSummary} />
      </SectionBlock>

      <SectionBlock title="교육 및 활동">
        <TextList items={resumeSummary.educationAndActivities} />
      </SectionBlock>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="space-y-3">
      {externalLinkSlots.map((slot) => {
        const Icon = contactIcons[slot.type];
        const href = externalLinks[slot.type];
        const hasHref = isUsableHref(href);
        const isExternal = href?.startsWith("http") ?? false;

        return (
          <article
            className="rounded-lg border border-slate-200/80 bg-white/68 p-4 dark:border-white/12 dark:bg-slate-950/30"
            key={slot.type}
          >
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#dcebff] text-slate-800 dark:bg-white/10 dark:text-slate-100">
                <Icon aria-hidden="true" size={20} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="text-base font-bold text-slate-950 dark:text-white">
                  {slot.label}
                </h2>
                <p className="text-sm leading-6 text-muted">
                  {contactDescriptions[slot.type]}
                </p>
              </div>
            </div>

            <div className="mt-4">
              {hasHref ? (
                <a
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200/80 bg-white/76 px-4 py-2 text-sm font-bold text-slate-800 dark:border-white/12 dark:bg-white/8 dark:text-slate-100"
                  href={href}
                  rel={isExternal ? "noreferrer" : undefined}
                  target={isExternal ? "_blank" : undefined}
                >
                  열기
                  {isExternal ? (
                    <ExternalLink aria-hidden="true" size={15} />
                  ) : null}
                </a>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function renderContent(sectionId: FolderId) {
  switch (sectionId) {
    case "about":
      return <AboutContent />;
    case "career-tracks":
      return <TrackLinkPanel />;
    case "projects":
      return <ProjectsContent />;
    case "skills":
      return <SkillsContent />;
    case "resume":
      return <ResumeContent />;
    case "contact":
      return <ContactContent />;
  }
}

export function MobileSection({ sectionId }: MobileSectionProps) {
  const meta = sectionMeta[sectionId];
  const Icon = meta.icon;

  return (
    <article
      className="mobile-document min-h-screen scroll-mt-4 px-4 py-5"
      id={`mobile-section-${sectionId}`}
    >
      <header className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <a
          className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md border border-slate-200/80 bg-white/72 px-3 py-2 text-sm font-bold text-slate-800 shadow-sm dark:border-white/12 dark:bg-slate-950/34 dark:text-slate-100"
          href="#mobile-home"
        >
          <ArrowUp aria-hidden="true" size={17} strokeWidth={2.2} />
          목록
        </a>

        <div className="rounded-lg border border-slate-200/80 bg-white/76 p-5 shadow-sm dark:border-white/12 dark:bg-slate-950/36">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#dcebff] text-slate-800 dark:bg-white/10 dark:text-slate-100">
              <Icon aria-hidden="true" size={23} strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-bold uppercase text-sky-700 dark:text-sky-200">
                {meta.eyebrow}
              </p>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
                {meta.title}
              </h1>
              <p className="text-sm leading-6 text-muted">{meta.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 w-full max-w-2xl pb-10">
        {renderContent(sectionId)}
      </div>
    </article>
  );
}

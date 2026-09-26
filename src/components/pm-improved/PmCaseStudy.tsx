import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { selectedProjects, type PmProject } from "./content";
import base from "./pm.module.css";
import styles from "./caseStudy.module.css";

export type CaseSectionId =
  | "problem"
  | "evidence"
  | "decision"
  | "action"
  | "collaboration"
  | "result"
  | "learning";

export const sectionLabels: Record<CaseSectionId, string> = {
  problem: "문제 / Problem",
  evidence: "근거 / Evidence",
  decision: "판단 / Decision",
  action: "실행 / Action",
  collaboration: "협업 / Collaboration",
  result: "결과 / Result",
  learning: "회고 / Reflection",
};

export function CaseHero({ project }: { project: PmProject }) {
  const personalResult = project.result.split(" 팀:")[0].replace(/^개인:\s*/, "");

  return (
    <section className={styles.hero} aria-labelledby="case-title">
      <Link className={base.backLink} href="/PM/#work">
        <ArrowLeft size={16} aria-hidden="true" />선택한 작업으로
      </Link>
      <p className={styles.eyebrow}>{project.serviceType}</p>
      <h1 id="case-title">{project.name}</h1>
      <p className={styles.serviceHeadline}>{project.headline}</p>
      <p className={styles.serviceDescription}>{project.subtitle}</p>

      <dl className={styles.meta}>
        <div><dt>기간</dt><dd>{project.period}</dd></div>
        {project.team && <div><dt>팀</dt><dd>{project.team}</dd></div>}
      </dl>

      <div className={styles.summaryGrid}>
        <section aria-labelledby="my-role-title">
          <p className={styles.roleTag}>MY ROLE</p>
          <h2 id="my-role-title">역할과 핵심 기여</h2>
          <dl className={styles.roleOwnership}>
            <div><dt>내 담당</dt><dd>{project.role}</dd></div>
          </dl>
          <ol className={styles.actionList}>
            {project.actions.map((action, index) => (
              <li key={action}><span>{String(index + 1).padStart(2, "0")}</span>{action}</li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="result-title">
          <p className={`${styles.roleTag} ${styles.teamTag}`}>RESULT</p>
          <h2 id="result-title">남긴 결과</h2>
          <dl className={styles.resultSplit}>
            <div><dt>산출물</dt><dd>{personalResult}</dd></div>
          </dl>
        </section>
      </div>

      <section className={styles.strengths} aria-labelledby="strength-title">
        <p id="strength-title">이 프로젝트에서 보여준 역량</p>
        <ul>{project.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul>
      </section>
    </section>
  );
}

export function CaseBody({ children, labels }: {
  children: React.ReactNode;
  labels?: Partial<Record<CaseSectionId, string>>;
}) {
  return (
    <div className={styles.bodyLayout}>
      <nav className={styles.nav} aria-label="사례 목차">
        {(Object.keys(sectionLabels) as CaseSectionId[]).map((id) => {
          const label = labels?.[id] ?? sectionLabels[id];
          return <a key={id} href={`#${id}`}>{label.split(" / ")[0]}</a>;
        })}
      </nav>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export function CaseSection({ id, title, label, children }: {
  id: CaseSectionId;
  title: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <p className={styles.sectionLabel}>{label ?? sectionLabels[id]}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function RoleBoundary({ kind, children }: {
  kind: "MY ROLE" | "TEAM" | "COLLABORATION";
  children: React.ReactNode;
}) {
  return (
    <div className={styles.boundary}>
      <strong>{kind}</strong>
      <p>{children}</p>
    </div>
  );
}

export function EvidenceList({ items }: { items: Array<{ title: string; text: string }> }) {
  return (
    <dl className={styles.evidenceList}>
      {items.map((item) => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}
    </dl>
  );
}

export function NextProject({ project }: { project: PmProject }) {
  const index = selectedProjects.findIndex((item) => item.slug === project.slug);
  const next = selectedProjects[(index + 1) % selectedProjects.length];
  return (
    <div className={base.nextProject}>
      <p>다음 프로젝트</p>
      <Link href={`/PM/${next.slug}/`}>{next.name}<ArrowUpRight aria-hidden="true" /></Link>
    </div>
  );
}

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { selectedProjects, workingPrinciples } from "./content";
import { ProjectVisual } from "./PmVisuals";
import styles from "./pm.module.css";

export function PmEditorialHome() {
  return <main id="pm-content" tabIndex={-1} className={styles.container}>
    <section className={styles.hero} aria-labelledby="pm-title">
      <p className={styles.eyebrow}>이재호 · Product Manager</p>
      <h1 id="pm-title">문제를 읽고,<br /><span>실행을 설계합니다.</span></h1>
      <div className={styles.heroBottom}><p>사용자 문제를 정의하고, MVP 범위를 좁히고,<br className={styles.desktopBreak} /> 요구사항과 화면 흐름으로 팀이 함께 만들 기준을 정리합니다.</p><a className={styles.heroCta} href="#work">어떤 문제를 풀었는지 보기<ArrowDown size={19} aria-hidden="true" /></a></div>
    </section>
    <section className={styles.work} id="work" aria-labelledby="work-heading">
      <span id="case-studies" className={styles.anchorAlias} />
      <div className={styles.workHeading}><h2 id="work-heading">Selected Work<span>선택한 작업</span></h2><span>4개의 프로젝트</span></div>
      {selectedProjects.map((project, index) => <article key={project.slug} className={`${styles.project} ${index === 3 ? styles.supportingProject : ""}`}>
        <div className={styles.projectMeta}><p><span>{String(index + 1).padStart(2, "0")}</span>{project.name}</p><span>{project.category}</span></div>
        <Link className={styles.projectTitleLink} href={`/pm/${project.slug}/`}><h3>{project.title[0]}{index === 3 ? " " : <br />}{project.title[1]}</h3><ArrowUpRight className={styles.projectArrow} aria-hidden="true" /></Link>
        <p className={styles.projectSummary}>{project.summary}</p>
        {index < 3 && <figure><Link className={styles.visualLink} href={`/pm/${project.slug}/`} aria-label={`${project.name} 사례 읽기`}><ProjectVisual slug={project.slug} /></Link><figcaption>{project.caption}</figcaption></figure>}
        <div className={styles.projectBottom}><p>{project.contribution}</p><Link href={`/pm/${project.slug}/`}>사례 읽기<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </article>)}
    </section>
    <section className={styles.method} id="process" aria-labelledby="method-heading">
      <div className={styles.methodIntro}><h2 id="method-heading">How I Work</h2><p>생각을 문서로,<br />문서를 실행으로.</p></div>
      <ol>{workingPrinciples.map((principle, index) => <li key={principle.title}><span className={styles.methodNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3>{principle.title}</h3><p>{principle.text}</p><Link href={principle.href}>{principle.project}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></li>)}</ol>
    </section>
    <section className={styles.about} id="about" aria-labelledby="about-heading">
      <span id="career-cases" className={styles.anchorAlias} />
      <h2 id="about-heading">About</h2>
      <div><p className={styles.aboutStatement}>복잡한 자료를 읽는 일에서,<br /><span>함께 만들 제품을 정의하는 일로.</span></p><div className={styles.aboutBody}><p>부산참여연대에서 조례와 예산, 의정 자료를 분석하고 이해관계자의 요구를 회의자료와 정책 문서로 정리했습니다.</p><p>이후 SSAFY에서 소프트웨어 프로젝트의 기획과 화면 구현을 경험했습니다. 자료를 구조화하던 태도를 요구사항과 사용자 흐름에 연결하고, 개발 과정에서 드러나는 제약까지 함께 살핍니다.</p><Link className={styles.textLink} href="/resume/">이력서 읽기<ArrowUpRight size={18} aria-hidden="true" /></Link></div></div>
    </section>
  </main>;
}

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Trophy } from "lucide-react";
import { selectedProjects, workingPrinciples } from "./content";
import { ProjectVisual } from "./PmVisuals";
import styles from "./pm.module.css";

export function PmEditorialHome() {
  return <main id="pm-content" tabIndex={-1} className={styles.container}>
    <section className={styles.hero} aria-labelledby="pm-title">
      <p className={styles.eyebrow}>이재호 · Product Manager</p>
      <h1 id="pm-title">요구사항을 정리하고,<br /><span>화면을 구현했습니다.</span></h1>
      <div className={styles.heroBottom}><p>구독 관리, 길안내, 화상 게임, 공연 추천 프로젝트에서<br className={styles.desktopBreak} /> 조사와 기획 문서 작성, 화면 구현·API 연동을 맡았습니다.</p><a className={styles.heroCta} href="#work">프로젝트와 맡은 일 보기<ArrowDown size={19} aria-hidden="true" /></a></div>
    </section>
    <section className={styles.work} id="work" aria-labelledby="work-heading">
      <span id="case-studies" className={styles.anchorAlias} />
      <div className={styles.workHeading}><h2 id="work-heading">Selected Work<span>선택한 작업</span></h2><span>4개의 프로젝트</span></div>
      {selectedProjects.map((project, index) => <article key={project.slug} id={project.slug} className={styles.project}>
        <div className={styles.projectMeta}><div className={styles.projectIdentity}><p><span>{String(index + 1).padStart(2, "0")}</span>{project.name}</p>{project.award && <span className={styles.projectAward}><Trophy size={16} strokeWidth={1.7} aria-hidden="true" />{project.award}</span>}</div><span>{project.category}</span></div>
        <Link className={styles.projectTitleLink} href={`/pm/${project.slug}/`}><h3>{project.title[0]}<br />{project.title[1]}</h3><ArrowUpRight className={styles.projectArrow} aria-hidden="true" /></Link>
        <p className={styles.projectSummary}>{project.summary}</p>
        <figure><ProjectVisual slug={project.slug} /><figcaption>{project.caption}</figcaption></figure>
        <div className={styles.projectBottom}><p>{project.contribution}</p><Link href={`/pm/${project.slug}/`}>사례 읽기<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </article>)}
    </section>
    <section className={styles.method} id="process" aria-labelledby="method-heading">
      <div className={styles.methodIntro}><h2 id="method-heading">How I Work</h2><p>조사하고 구현하며<br />확인한 것들.</p></div>
      <ol>{workingPrinciples.map((principle, index) => <li key={principle.title}><span className={styles.methodNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3>{principle.title}</h3><p>{principle.text}</p><Link href={principle.href}>{principle.project}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></li>)}</ol>
    </section>
    <section className={styles.about} id="about" aria-labelledby="about-heading">
      <span id="career-cases" className={styles.anchorAlias} />
      <h2 id="about-heading">About</h2>
      <div><p className={styles.aboutStatement}>공공자료 분석 실무를 거쳐,<br /><span>소프트웨어 기획과 개발을 배웠습니다.</span></p><div className={styles.aboutBody}><p>2021년 5월부터 2025년 2월까지 부산참여연대에서 일했습니다. 부산시의회 의정활동 평가보고서 작성, 예산·결산 분석, 행정사무감사 시민의제 취합과 기자회견 실무를 맡았습니다.</p><p>이후 SSAFY에서 팀 프로젝트의 조사·기획과 Android·웹 화면 구현을 경험했습니다. 요구사항을 작성하는 데서 출발해, 화면의 선택이 API 요청과 저장 데이터에 반영되는 과정까지 다뤘습니다.</p><Link className={styles.textLink} href="/resume/">이력서 읽기<ArrowUpRight size={18} aria-hidden="true" /></Link></div></div>
    </section>
  </main>;
}

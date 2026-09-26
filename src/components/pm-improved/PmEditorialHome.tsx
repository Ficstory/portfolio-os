import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Mail } from "lucide-react";

import { links } from "@/data/links";

import { selectedProjects, workingPrinciples } from "./content";
import home from "./home.module.css";
import styles from "./pm.module.css";
import { ProjectVisual } from "./PmVisuals";
import { PmExperience } from "./PmExperience";

export function PmEditorialHome() {
  return (
    <main id="pm-content" tabIndex={-1} className={styles.container}>
      <section className={home.homeHero} aria-labelledby="pm-title">
        <p className={home.identity}>이재호 · Product Manager</p>
        <h1 id="pm-title" className={home.heroTitle}>
          <span>팀이 같은 기준으로 일하도록,</span>
          <span>
            기획과 개발을 <span className={home.keepTogether}>연결합니다.</span>
          </span>
        </h1>
        <p className={home.subtitle}>
          공공자료 분석 실무 3년 10개월과 소프트웨어 팀 프로젝트 경험을 바탕으로,
          <br className={styles.desktopBreak} /> 조사·기획 문서부터 사용자의 선택이
          데이터로 저장되는 과정까지 다뤘습니다.
        </p>
        <ul className={home.heroKeywords} aria-label="핵심 역량">
          <li>조사·분석</li>
          <li>요구사항 관리</li>
          <li>화면·데이터 흐름</li>
          <li>개발 협업</li>
        </ul>
        <div className={home.heroActions}>
          <a className={home.primaryAction} href="#work">
            프로젝트와 맡은 일 보기
            <ArrowDown size={18} aria-hidden="true" />
          </a>
          <a className={home.secondaryAction} href="#about">
            경력·이력서 보기
            <ArrowDown size={17} aria-hidden="true" />
          </a>
          <a className={home.contactAction} href={links.email}>
            이메일로 연락하기
            <Mail size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section
        className={home.bridge}
        id="process"
        aria-labelledby="bridge-heading"
      >
        <h2 id="bridge-heading">
          자료를 분석해 판단 근거를 정리하던 경험을,
          <br /> 제품의 요구사항과 구현 기준을 다루는 일로 확장했습니다.
        </h2>
        <div className={home.evidenceLinks}>
          {workingPrinciples.map((principle) => (
            <div className={home.evidenceEntry} key={principle.title}>
              <span>
                <strong>{principle.title}</strong>
                <small>{principle.text}</small>
              </span>
              <span className={home.evidenceTargets}>
                <Link href={principle.href}>
                  {principle.project}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={home.work} id="work" aria-labelledby="work-heading">
        <span id="case-studies" className={styles.anchorAlias} />
        <header className={home.sectionHeading}>
          <h2 id="work-heading">Selected Work</h2>
          <p>맡은 일과 판단, 다음에 바꾸고 싶은 점을 정리했습니다.</p>
        </header>

        {selectedProjects.map((project) => {
          const result = project.result.split(" 팀:")[0].replace(/^개인:\s*/, "");
          return (
            <article
              key={project.slug}
              id={project.slug}
              className={`${styles.project} ${home.projectItem}`}
            >
              <p className={home.serviceType}>{project.serviceType}</p>
              <header className={home.projectHeader}>
                <Link href={`/PM/${project.slug}/`}>
                  <h3>{project.name}</h3>
                  <ArrowUpRight size={29} aria-hidden="true" />
                </Link>
                <ul aria-label={`${project.name} 대표 역량`}>
                  {project.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </header>

              <p className={home.projectHeadline}>{project.headline}</p>
              <p className={home.projectSubtitle}>{project.subtitle}</p>

              <div className={home.projectEvidence}>
                <section aria-labelledby={`${project.slug}-role`}>
                  <p className={home.evidenceLabel}>MY ROLE</p>
                  <h4 id={`${project.slug}-role`}>역할과 핵심 기여</h4>
                  <dl className={home.roleList}>
                    <div>
                      <dt>내 담당</dt>
                      <dd>{project.role}</dd>
                    </div>
                  </dl>
                  <ul className={home.actionList}>
                    {project.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby={`${project.slug}-result`}>
                  <p className={home.evidenceLabel}>DECISION &amp; OUTPUT</p>
                  <h4 id={`${project.slug}-result`}>판단과 남긴 결과</h4>
                  <dl className={home.resultList}>
                    {project.decision && (
                      <div>
                        <dt>판단</dt>
                        <dd>{project.decision}</dd>
                      </div>
                    )}
                    <div>
                      <dt>결과</dt>
                      <dd>{result}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <div className={home.projectFooter}>
                <dl className={home.projectFacts}>
                  {project.award && (
                    <div>
                      <dt>수상</dt>
                      <dd>{project.award}</dd>
                    </div>
                  )}
                  <div>
                    <dt>기간</dt>
                    <dd>{project.period}</dd>
                  </div>
                  {project.team && (
                    <div>
                      <dt>구성</dt>
                      <dd>{project.team}</dd>
                    </div>
                  )}
                </dl>
                <Link className={home.projectLink} href={`/PM/${project.slug}/`}>
                  맡은 일과 회고 읽기
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>

              <figure className={home.projectMedia}>
                <ProjectVisual slug={project.slug} />
                <figcaption>{project.caption}</figcaption>
              </figure>
            </article>
          );
        })}
      </section>

      <PmExperience />
    </main>
  );
}

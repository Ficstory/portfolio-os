import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { activities, career, education, skills, type ResumeEntry } from "./resume-content";
import { pmResume } from "./resume";
import styles from "./experience.module.css";
import shell from "./pm.module.css";

function ResumeRecord({ entry }: { entry: ResumeEntry }) {
  return (
    <div className={styles.record}>
      <p className={styles.recordTitle}>
        {entry.organization}
        <span>{entry.title}</span>
      </p>
      {entry.period && <p className={styles.recordMeta}>{entry.period}</p>}
      {entry.detail && <p className={styles.recordDetail}>{entry.detail}</p>}
      {entry.bullets && (
        <ul className={styles.dutyList}>
          {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      )}
    </div>
  );
}

export function PmExperience() {
  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading">
      <span id="career-cases" className={shell.anchorAlias} />
      <header>
        <p className={styles.headingEyebrow}>Experience</p>
        <h2 id="about-heading" className={styles.heading}>경력·교육·대외활동</h2>
      </header>
      <div className={styles.body}>
        <p className={styles.lead}>조사와 분석의 경험을, 제품의 요구사항과 구현 기준을 다루는 일로 이어 왔습니다.</p>

        <section className={styles.group} aria-labelledby="career-heading">
          <h3 id="career-heading" className={styles.groupTitle}>경력</h3>
          <div className={styles.records}><ResumeRecord entry={career} /></div>
        </section>

        <section className={styles.group} aria-labelledby="education-heading">
          <h3 id="education-heading" className={styles.groupTitle}>학력·교육</h3>
          <div className={styles.records}>{education.map((entry) => <ResumeRecord entry={entry} key={entry.organization} />)}</div>
        </section>

        <section className={styles.group} aria-labelledby="activity-heading">
          <h3 id="activity-heading" className={styles.groupTitle}>대외활동</h3>
          <div className={styles.records}>{activities.map((entry) => <ResumeRecord entry={entry} key={entry.organization} />)}</div>
        </section>

        <section className={styles.group} aria-labelledby="award-heading">
          <h3 id="award-heading" className={styles.groupTitle}>수상</h3>
          <div className={styles.records}>
            <div className={styles.award}>
              <div>
                <p className={styles.awardTitle}>SSAFY 특화 프로젝트 우수상 · 애낌 AEKKIM</p>
                <p className={styles.awardMeta}>2026.03 · 팀 수상</p>
              </div>
              <Link href="/PM/aekkim/" className={styles.awardLink}>프로젝트 보기 <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className={styles.group} aria-labelledby="skills-heading">
          <h3 id="skills-heading" className={styles.groupTitle}>기술·협업 도구</h3>
          <dl className={styles.skills}>
            {skills.map((skill) => <div key={skill.label}><dt>{skill.label}</dt><dd>{skill.items}</dd></div>)}
          </dl>
        </section>

        <div className={styles.resumeActions} aria-label="이력서 파일">
          <a className={styles.resumePrimary} href={pmResume.pdfPath} target="_blank" rel="noopener noreferrer">
            이력서 보기 (PDF)<ArrowUpRight size={18} aria-hidden="true" /><span className={shell.visuallyHidden}>새 탭에서 열림</span>
          </a>
          <a className={styles.resumeSecondary} download={pmResume.wordFilename} href={pmResume.wordPath}>Word 원본 다운로드</a>
          <span className={styles.resumeFormat}>PDF · 새 탭 / Word · 다운로드</span>
        </div>
      </div>
    </section>
  );
}

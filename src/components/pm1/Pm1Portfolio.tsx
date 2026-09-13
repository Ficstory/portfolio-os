"use client";

import Image from "next/image";
import { ArrowDownRight, ArrowUp, ArrowUpRight, X } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import HeroCharacter from "./HeroCharacter";
import {
  aboutCopy,
  capabilities,
  contactLinks,
  decorationAssets,
  portfolioCopy,
  projects,
  type Pm1Project,
} from "./content";
import styles from "./Pm1Portfolio.module.css";

const ease = [0.25, 0.1, 0.25, 1] as const;

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { y: 22 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function MarqueeTile({ project }: { project: Pm1Project }) {
  return (
    <article className={styles.marqueeTile} data-accent={project.accent}>
      <div className={styles.marqueeMeta}>
        <span>{project.number}</span>
        <span>{project.category}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.title}</p>
      <span className={styles.marqueeOutput}>{project.output}</span>
    </article>
  );
}

function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const right = useTransform(scrollYProgress, [0, 1], [-640, -220]);
  const left = useTransform(scrollYProgress, [0, 1], [-220, -640]);
  const sequence = [...projects, ...projects, ...projects];

  return (
    <section ref={sectionRef} className={styles.marquee} aria-label="프로젝트 요약">
      <div className={styles.marqueeViewport}>
        <motion.div className={styles.marqueeTrack} style={reduceMotion ? undefined : { x: right }}>
          {sequence.map((project, index) => (
            <div key={`top-${project.name}-${index}`} aria-hidden={index >= projects.length}>
              <MarqueeTile project={project} />
            </div>
          ))}
        </motion.div>
      </div>
      <div className={styles.marqueeViewport} aria-hidden="true">
        <motion.div className={`${styles.marqueeTrack} ${styles.marqueeTrackReverse}`} style={reduceMotion ? undefined : { x: left }}>
          {[...sequence].reverse().map((project, index) => (
            <div key={`bottom-${project.name}-${index}`}>
              <MarqueeTile project={project} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AboutDecorations() {
  return (
    <div className={styles.aboutDecorations} aria-hidden="true">
      {Object.entries(decorationAssets).map(([shape, src]) => (
        <Image key={shape} className={styles[shape]} src={src} width={240} height={240} alt="" loading="lazy" />
      ))}
    </div>
  );
}

const aboutPhrases = [
  "안녕하세요, 이재호입니다.",
  "기획 문서를 작성하고, 프론트엔드 QA로 화면의 표시와 동작을 확인해 왔습니다.",
  "애낌에서는 요구사항과 화면의 의미를 정리하고 불일치를 수정했습니다.",
  "웃지마게임에서는 설문 결과를 팀의 기능 우선순위 논의에 반영했습니다.",
  "부산참여연대에서는 공개 자료를 비교하고 보고서와 제안으로 정리했습니다.",
];

function AboutStatement() {
  const reduceMotion = useReducedMotion();
  return (
    <p className={styles.aboutCopy}>
      <span className={styles.srOnly}>{aboutCopy}</span>
      <span className={styles.aboutPhrases} aria-hidden="true">
        {aboutPhrases.map((phrase, index) => (
          <motion.span
            key={phrase}
            initial={reduceMotion ? false : { opacity: 0.68, y: 7 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7, delay: index * 0.06, ease }}
          >
            {phrase}{" "}
          </motion.span>
        ))}
      </span>
    </p>
  );
}

function ProjectDialog({ project }: { project: Pm1Project }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const restoreFocus = () => triggerRef.current?.focus();
    dialog.addEventListener("close", restoreFocus);
    return () => dialog.removeEventListener("close", restoreFocus);
  }, []);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeOnBackdrop(event: ReactMouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  function trapDialogFocus(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialog = event.currentTarget;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <button ref={triggerRef} className={styles.ghostButton} type="button" onClick={openDialog}>
        {project.buttonLabel}<ArrowUpRight size={18} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={closeOnBackdrop}
        onKeyDown={trapDialogFocus}
      >
        <div className={styles.dialogPanel}>
          <header className={styles.dialogHeader}>
            <div>
              <p>{project.number} · {project.category}</p>
              <h3 id={titleId}>{project.name}</h3>
            </div>
            <button className={styles.dialogClose} type="button" onClick={() => dialogRef.current?.close()} aria-label={`${project.name} 상세 닫기`}>
              <X aria-hidden="true" />
            </button>
          </header>
          <div className={styles.dialogScroll}>
            <section className={styles.dialogProjectIntro} aria-label="프로젝트 소개와 역할">
              <p id={descriptionId} className={styles.dialogDescription}>{project.description}</p>
              <div className={styles.dialogRole}>
                <span>MY ROLE</span>
                <p>{project.role}</p>
              </div>
            </section>
            <section className={styles.dialogCaseIntro} aria-label="대표 사례">
              <span>FOCUSED CASE</span>
              <h4>{project.title}</h4>
            </section>
            {project.evidenceNote && (
              <aside className={styles.evidenceNote} aria-label="자료 안내">
                <strong>사이트 작성 안내</strong>
                <p>{project.evidenceNote}</p>
              </aside>
            )}
            <div className={styles.dialogBody}>
              {project.details.map((detail) => (
                <section key={detail.label}>
                  <h5>{detail.label}</h5>
                  <p>{detail.text}</p>
                  {detail.sources && detail.sources.length > 0 && (
                    <ul className={styles.sourceList} aria-label={`${detail.label} 근거 자료`}>
                      {detail.sources.map((source) => (
                        <li key={`${source.href}-${source.label}`}>
                          <a href={source.href}>{source.label}<ArrowUpRight size={14} aria-hidden="true" /></a>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
          <button className={styles.dialogDone} type="button" onClick={() => dialogRef.current?.close()}>
            닫기
          </button>
        </div>
      </dialog>
    </>
  );
}

function ProjectCard({ project, index }: { project: Pm1Project; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 32%", "end 12%"],
  });
  const targetScale = 1 - (projects.length - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const stackOffset = 28 * (index + 1);
    const updateStackability = () => {
      const desktop = window.matchMedia("(min-width: 701px)").matches;
      card.dataset.stackable = String(desktop && card.scrollHeight <= window.innerHeight - stackOffset);
    };
    const observer = new ResizeObserver(updateStackability);
    observer.observe(card);
    window.addEventListener("resize", updateStackability);
    updateStackability();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateStackability);
    };
  }, [index]);

  return (
    <motion.article
      ref={cardRef}
      className={styles.projectCard}
      data-accent={project.accent}
      style={reduceMotion ? undefined : { scale }}
    >
      <div className={styles.cardTopline}>
        <div>
          <h3 className={styles.cardName}>{project.name}</h3>
          <p>{project.category}</p>
        </div>
        <span className={styles.cardNumber} aria-hidden="true">{project.number}</span>
      </div>
      <div className={styles.cardGrid}>
        <div className={styles.cardContext}>
          <p className={styles.cardDescription}>{project.description}</p>
          <div className={styles.cardRole}>
            <span>MY ROLE</span>
            <p>{project.role}</p>
          </div>
        </div>
        <div className={styles.cardCase}>
          <div className={styles.cardCaseCopy}>
            <span>FOCUSED CASE</span>
            <h4>{project.title}</h4>
            <div className={styles.cardSummary}>
              <span>CASE SUMMARY</span>
              <p>{project.summary}</p>
            </div>
          </div>
          <div className={styles.cardOutput}>
            <span>VERIFIED OUTPUT</span>
            <p>{project.output}</p>
          </div>
          <ProjectDialog project={project} />
        </div>
      </div>
    </motion.article>
  );
}

export default function Pm1Portfolio() {
  const reduceMotion = useReducedMotion();

  return (
    <main className={`${styles.portfolio} pm1-portfolio`} id="top">
      <section className={styles.hero} aria-labelledby="pm1-title">
        <motion.nav
          className={styles.nav}
          aria-label="PM 포트폴리오 주요 메뉴"
          initial={reduceMotion ? false : { y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0, duration: 0.7, ease }}
        >
          <a href="#about">ABOUT</a>
          <a href="#capabilities">CAPABILITIES</a>
          <a href="#projects">PROJECTS</a>
          <a href="#contact">CONTACT</a>
        </motion.nav>

        <motion.h1
          id="pm1-title"
          className={styles.heroTitle}
          initial={reduceMotion ? false : { y: 40 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.15, duration: 0.85, ease }}
        >
          {portfolioCopy.heroHeading}
        </motion.h1>

        <HeroCharacter />

        <div className={styles.heroFooter}>
          <motion.div
            className={styles.heroIntro}
            initial={reduceMotion ? false : { y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease }}
          >
            <p>{portfolioCopy.heroIntroLines[0]}<br />{portfolioCopy.heroIntroLines[1]}</p>
            <span>{portfolioCopy.heroSubtitle}</span>
          </motion.div>
          <motion.a
            className={styles.primaryButton}
            href="#projects"
            initial={reduceMotion ? false : { y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
          >
            {portfolioCopy.primaryCtaLabel}<ArrowDownRight size={19} aria-hidden="true" />
          </motion.a>
        </div>
      </section>

      <Marquee />

      <section className={styles.about} id="about" aria-labelledby="about-title">
        <AboutDecorations />
        <FadeIn className={styles.aboutInner}>
          <h2 id="about-title">ABOUT ME</h2>
          <AboutStatement />
          <a className={styles.primaryButton} href="#projects">작업 사례 보기<ArrowDownRight size={19} aria-hidden="true" /></a>
        </FadeIn>
      </section>

      <section className={styles.capabilities} id="capabilities" aria-labelledby="capabilities-title">
        <div className={styles.capabilitiesInner}>
          <FadeIn>
            <h2 id="capabilities-title">CAPABILITIES</h2>
          </FadeIn>
          <ol className={styles.capabilityList}>
            {capabilities.map((item, index) => (
              <motion.li
                key={item.number}
                initial={reduceMotion ? false : { y: 24 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, delay: index * 0.1, ease }}
              >
                <span>{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.projects} id="projects" aria-labelledby="projects-title">
        <div className={styles.projectsInner}>
          <FadeIn className={styles.projectsHeading}>
            <h2 id="projects-title">PROJECTS</h2>
            <p>{portfolioCopy.projectsIntro}</p>
          </FadeIn>
          <div className={styles.projectStack}>
            {projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}
          </div>
        </div>
      </section>

      <footer className={styles.contact} id="contact" aria-labelledby="contact-title">
        <FadeIn className={styles.contactInner}>
          <h2 id="contact-title">{portfolioCopy.contactTitle}</h2>
          <p>{portfolioCopy.contactBody}</p>
          <div className={styles.contactActions}>
            {contactLinks.email && <a className={styles.primaryButton} href={contactLinks.email}>이메일 보내기<ArrowUpRight size={19} aria-hidden="true" /></a>}
            {contactLinks.resume && <a className={styles.ghostButton} href={contactLinks.resume}>이력서 보기<ArrowUpRight size={19} aria-hidden="true" /></a>}
          </div>
        </FadeIn>
        <div className={styles.contactBottom}>
          <span>{portfolioCopy.contactSignature}</span>
          <a href="#top">맨 위로<ArrowUp size={17} aria-hidden="true" /></a>
        </div>
      </footer>
    </main>
  );
}

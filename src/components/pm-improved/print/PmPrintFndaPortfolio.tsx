import Image from "next/image";
import type { ReactNode } from "react";

import { links } from "@/data/links";
import { profile } from "@/data/profile";

import { pmMedia, selectedProjects, type PmProject } from "../content";
import { career, education, skills } from "../resume-content";
import styles from "./PmPrintPortfolio.module.css";
import { agentSlides } from "./PmPrintAgentSlides";
import { fndaSlides } from "./PmPrintFndaSlides";
import fndaStyles from "./PmPrintFndaSlides.module.css";

const projectDescriptions: Record<string, string> = {
  "pm-print-goraeit-intro": "유아 동반 고객을 위한 카트 개선안",
  "pm-print-ibosho-intro": "이마트 앱 내 AI 쇼핑 에이전트",
  "pm-print-jos-intro": "개인 업무용 AI 에이전트 플랫폼",
  "pm-print-busan-intro": "보행약자를 위한 길안내 앱",
  "pm-print-aekkim-intro": "구독 비용·결제일 통합 관리 앱",
};

export type PrintSlide = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  className?: string;
  content: ReactNode;
};

// Verified from the author's unique, non-merge Docs/ commits; audit record:
// docs/pm-print-revision-2026-09-15.md
const busanDocumentCommitMetric = {
  count: 29,
  label: "본인 문서 변경 커밋",
  scope: "2026.04~05 · 기획·명세 등 Docs/ 기준 · 병합 제외",
} as const;

function getProject(slug: PmProject["slug"]) {
  const project = selectedProjects.find((item) => item.slug === slug);
  if (!project) throw new Error(`PM print project not found: ${slug}`);
  return project;
}

function ProjectMeta({ project }: { project: PmProject }) {
  return (
    <dl className={styles.projectMeta}>
      <div><dt>기간</dt><dd>{project.period}</dd></div>
      {project.team && <div><dt>구성</dt><dd>{project.team}</dd></div>}
      <div><dt>내 역할</dt><dd>{project.role}</dd></div>
    </dl>
  );
}

function EvidenceImage({
  src,
  alt,
  caption,
  width,
  height,
  phone = false,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  phone?: boolean;
}) {
  return (
    <figure className={`${styles.evidenceImage} ${phone ? styles.phoneImage : ""}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="eager"
        sizes={phone ? "300px" : "720px"}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function PhonePair({ children }: { children: ReactNode }) {
  return <div className={styles.phonePair}>{children}</div>;
}

function RoleSplit({ mine, team }: { mine: string; team: string }) {
  return (
    <dl className={styles.roleSplit}>
      <div><dt>MY ROLE</dt><dd>{mine}</dd></div>
      <div><dt>TEAM</dt><dd>{team}</dd></div>
    </dl>
  );
}

export function PmPrintFndaPortfolio({ preview = false }: { preview?: boolean }) {
  const aekkim = getProject("aekkim");
  const busan = getProject("busan-eumgil");

  const slides: PrintSlide[] = [
    ...agentSlides,
    ...fndaSlides,
    {
      id: "pm-print-cover",
      eyebrow: "Product manager portfolio · 2026",
      title: <><span>고객의 문제를 발견하고,</span>{" "}<span className={styles.coverTitleAccent}>작동하는 서비스로 구체화합니다.</span></>,
      className: styles.cover,
      content: (
        <div className={styles.coverGrid}>
          <div className={styles.coverStatement}>
            <p>{profile.name}</p>
            <p className={styles.coverRole}>Product Manager<br />고객경험 · AI 서비스 기획</p>
          </div>
          <div className={styles.coverSummary}>
            <p>현장과 데이터에서 고객의 불편을 찾고, 서비스의 핵심 경험을 설계합니다. 개발 경험과 AI 도구를 활용해 직접 구현하고, 실제 동작을 확인하며 개선합니다.</p>
            <ul className={styles.capabilityList}>
              <li><span>01 · 문제 발견</span>고객 조사와 데이터로 문제의 근거를 확인</li>
              <li><span>02 · 경험 설계</span>고객의 이용 흐름과 실행 가능한 범위를 설계</li>
              <li><span>03 · 구현·개선</span>AI와 개발로 구체화하고 실제 동작을 점검</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "pm-print-aekkim-intro",
      eyebrow: "Project 03 · Android 구독 관리 앱",
      title: aekkim.name,
      className: styles.projectIntro,
      content: (
        <div className={`${styles.introGrid} ${styles.phoneIntro}`}>
          <div className={styles.introCopy}>
            <p className={styles.lead}>{aekkim.headline}</p>
            <p>{aekkim.subtitle}</p>
            <section className={styles.problemBox} aria-label="주요 사용자 흐름">
              <span>CORE FLOW</span>
              <p>결제 내역에서 찾은 구독 후보를 사용자가 확인·제외한 뒤 구독 목록에 반영하는 흐름입니다.</p>
            </section>
            <ProjectMeta project={aekkim} />
            <p className={styles.teamResult}>{aekkim.award}</p>
          </div>
          <PhonePair>
            <EvidenceImage phone src={pmMedia.evidence.aekkimDashboard} alt="애낌 구독 통합 관리 화면" width={1080} height={2284} caption="구독 통합 관리" />
            <EvidenceImage phone src={pmMedia.evidence.aekkimPromotion} alt="디즈니플러스, 티빙, 웨이브 프로모션 상세 화면" width={1080} height={2284} caption="프로모션 상세" />
          </PhonePair>
        </div>
      ),
    },
    {
      id: "pm-print-aekkim-criteria",
      eyebrow: "애낌 · 핵심 기여 01",
      title: "후보 상태별 처리 기준을 요구사항과 화면명세에 맞췄습니다.",
      content: (
        <div className={styles.criteriaLayout}>
          <table className={styles.criteriaTable}>
            <thead><tr><th>후보 상태</th><th>사용자 화면</th><th>다음 처리</th></tr></thead>
            <tbody>
              <tr><th>서비스가 식별된 후보</th><td>등록할 항목을 확인</td><td>확인된 대상만 등록 흐름으로</td></tr>
              <tr><th>구독이 아닌 결제</th><td>제외 상태를 표시</td><td>등록 대상에서 제외</td></tr>
              <tr><th>서비스 정보가 부족한 결제</th><td>남은 확인 건수를 표시</td><td>수동 매핑으로 이동</td></tr>
            </tbody>
          </table>
          <div className={styles.criteriaNotes}>
            <section><span>워터폴 진행</span><p>요구사항·화면명세를 먼저 정리해 단계별로 개발했습니다. 변경된 MVP 범위는 문서와 화면에 반영했습니다.</p></section>
            <section><span>개발 방식에 대한 회고</span><p>다음에는 MVP 범위 변경을 정기적으로 점검하고, 명세와 실제 구현의 차이를 함께 확인하겠습니다.</p></section>
          </div>
        </div>
      ),
    },
    {
      id: "pm-print-aekkim-interface",
      eyebrow: "애낌 · 핵심 기여 02",
      title: "후보 확인 UI와 제외·중복·남은 건수 표시를 수정했습니다.",
      content: (
        <div className={styles.interfaceGrid}>
          <EvidenceImage phone src="/pm-improved/evidence/aekkim-candidate-list-demo.png" alt="여러 구독 후보, 구독 아님 버튼, 확인이 필요한 결제 1건과 확인완료 버튼" width={1080} height={2340} caption="후보·미해결 결제 확인 · 예시 데이터 앱 시연" />
          <ol className={styles.numberedEvidence}>
            <li><span>01</span><div><strong>초기 확인 UI</strong><p>분석 결과가 없을 때의 안내와 후보 목록의 기본 화면을 구현했습니다.</p></div></li>
            <li><span>02</span><div><strong>제외 상태</strong><p>사용자가 고른 제외 상태를 화면에 반영하고 남은 후보를 구분했습니다.</p></div></li>
            <li><span>03</span><div><strong>표시 정합성</strong><p>중복 후보 노출과 수동 확인이 필요한 결제의 남은 건수 표시를 수정했습니다.</p></div></li>
          </ol>
          <RoleSplit mine="후보 확인 초기 UI, 제외 상태, 중복 후보와 남은 건수 표시, 요구사항·화면명세" team="구독 등록 요청·실패 처리와 번들 보완" />
        </div>
      ),
    },
    {
      id: "pm-print-busan-intro",
      eyebrow: "Project 02 · 보행약자 길안내 앱",
      title: busan.name,
      className: styles.projectIntro,
      content: (
        <div className={`${styles.introGrid} ${styles.phoneIntro}`}>
          <div className={styles.introCopy}>
            <p className={styles.lead}>{busan.headline}</p>
            <p>{busan.subtitle}</p>
            <section className={styles.problemBox} aria-label="팀의 AI 시설물 데이터 구축">
              <span>TEAM · AI DATA</span>
              <p>로드뷰 수집 → 볼라드·점자블록 식별 → 경로 가중치용 데이터 생성. 공공데이터에 부족한 보행 시설물 정보를 팀의 AI 모델로 보강했습니다.</p>
            </section>
            <ProjectMeta project={busan} />
          </div>
          <PhonePair>
            <EvidenceImage phone src={pmMedia.evidence.busanMap} alt="접근성 시설과 최근 목적지를 표시하는 부산이음길 지도 화면" width={720} height={1560} caption="실제 지도 화면 · 시설 탐색" />
            <EvidenceImage phone src={pmMedia.evidence.busanUserType} alt="저시력자와 보행약자 중 사용자 유형을 선택하는 부산이음길 화면" width={720} height={1560} caption="사용자 유형 선택 · 팀 서비스" />
          </PhonePair>
        </div>
      ),
    },
    {
      id: "pm-print-busan-planning",
      eyebrow: "부산이음길 · 핵심 기여 01",
      title: "기관을 직접 섭외해 현장 의견을 MVP 범위로 연결했습니다.",
      content: (
        <div className={styles.planningGrid}>
          <EvidenceImage src={pmMedia.evidence.busanMeeting} alt="MVP 지도 기능을 설명하고 의견을 나누는 미팅 현장" width={1920} height={1080} caption="MVP 기능을 설명하고 의견을 나눈 미팅 현장" />
          <ol className={styles.interviewTrace}>
            <li><span>01 · 초기 기획</span><p>보행약자의 이동 조건을 다루는 서비스 방향을 처음부터 기획했습니다.</p></li>
            <li><span>02 · 직접 섭외</span><p>함세상 장애인자립생활센터에 연락해 미팅·인터뷰를 진행했습니다.</p></li>
            <li><span>03 · MVP 선정</span><p>경로 비교, 사용자 유형 온보딩, 접근성 시설 탐색을 핵심 범위로 연결했습니다.</p></li>
          </ol>
          <blockquote>“이동 보조기기마다 다른 조건”을 화면과 기능의 선택 기준으로 바꿨습니다.</blockquote>
        </div>
      ),
    },
    {
      id: "pm-print-busan-map",
      eyebrow: "부산이음길 · 핵심 기여 02",
      title: "애자일 방식에 맞춰 지도 구현과 문서를 함께 갱신했습니다.",
      content: (
        <div className={styles.mapGrid}>
          <EvidenceImage phone src={pmMedia.evidence.busanMap} alt="부산이음길 길안내 지도 화면" width={720} height={1560} caption="길안내 지도 화면 · 실제 구현 캡처" />
          <div className={styles.mapDetails}>
            <section><span>MAP INTERACTION</span><h3>선택 핀 고정 렌더링</h3><p>길안내 지도 위 선택 핀이 화면의 기준 위치에 유지되도록 하고 카메라 이동·확대 제스처와 동기화했습니다.</p></section>
            <section className={styles.documentSync}>
              <div><span>애자일 문서 동기화</span><h3>구현 변화와 문서를 함께 갱신</h3><p>애자일 방식에서 바뀐 구현 기준을 요구사항·화면명세에 반영했습니다. 최신 문서를 유지하는 일이 팀의 협업 기준을 지키는 데 중요했습니다.</p></div>
              <p className={styles.documentMetric}><strong>{busanDocumentCommitMetric.count}<small>건</small></strong><span>{busanDocumentCommitMetric.label}</span><small>{busanDocumentCommitMetric.scope}</small></p>
            </section>
            <p className={styles.supportingWork}><strong>보조 구현</strong> 글자 크기 즉시 저장·적용 · 승인된 제보 구분 표시와 내용 확인 패널 연결</p>
            <RoleSplit mine="길안내 지도·마커 고정, 문서 갱신, 접근성 설정·제보 표시" team="AI 시설물 식별·경로 가중치용 데이터, 경로 탐색·공간 데이터 개발" />
          </div>
        </div>
      ),
    },
    {
      id: "pm-print-experience-contact",
      eyebrow: "Experience · Education · Contact",
      title: "현장과 데이터를 읽는 경험을 서비스 기획과 구현으로 넓혔습니다.",
      className: styles.closing,
      content: (
        <div className={styles.closingGrid}>
          <section className={styles.careerBlock}>
            <span>CAREER</span>
            <h3>{career.organization}</h3>
            <p>{career.title} · {career.period}</p>
            <p>{career.detail}</p>
            <ul>{career.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </section>
          <section className={styles.educationBlock}>
            <span>EDUCATION</span>
            <dl>{education.map((entry) => <div key={entry.organization}><dt>{entry.organization}</dt><dd>{entry.period && `${entry.period} · `}{entry.detail}</dd></div>)}</dl>
            <span>TOOLS</span>
            <dl className={styles.tools}>{skills.map((skill) => <div key={skill.label}><dt>{skill.label}</dt><dd>{skill.items}</dd></div>)}</dl>
            <p className={styles.awardLine}>팀 성과 · 애낌 프로젝트 우수상</p>
          </section>
          <address className={styles.contactBlock}>
            <span>CONTACT</span>
            <strong>이재호 · Product Manager</strong>
            <a href={links.email}>{links.email.replace("mailto:", "")}</a>
            <a href="https://ficstory.dev/PM/">ficstory.dev/PM/</a>
            <a href={links.github}>{links.github.replace("https://", "")}</a>
          </address>
        </div>
      ),
    },
  ];

  const orderedSlideIds = [
    "pm-print-cover",
    "pm-print-ibosho-intro",
    "pm-print-ibosho-research",
    "pm-print-ibosho-implementation",
    "pm-print-goraeit-intro",
    "pm-print-goraeit-research",
    "pm-print-goraeit-scope",
    "pm-print-jos-intro",
    "pm-print-jos-memory",
    "pm-print-jos-execution",
    "pm-print-busan-intro",
    "pm-print-busan-planning",
    "pm-print-busan-map",
    "pm-print-aekkim-intro",
    "pm-print-aekkim-criteria",
    "pm-print-aekkim-interface",
    "pm-print-experience-contact",
  ] as const;
  const orderedSlides = orderedSlideIds.map((id) => {
    const slide = slides.find((item) => item.id === id);
    if (!slide) throw new Error(`PM print slide not found: ${id}`);
    return slide;
  });
  const total = orderedSlides.length;

  return (
    <section
      className={styles.root}
      data-pm-print=""
      data-pm-print-preview={preview ? "" : undefined}
      aria-label="이재호 PM 인쇄 포트폴리오 · FNDA 포함본"
    >
      <div className={styles.deck}>
        {orderedSlides.map((slide, index) => {
          const titleId = `${slide.id}-title`;
          const projectNumber = slide.id.startsWith("pm-print-ibosho-") ? "01"
            : slide.id.startsWith("pm-print-goraeit-") ? "02"
            : slide.id.startsWith("pm-print-jos-") ? "03"
            : slide.id.startsWith("pm-print-busan-") ? "04"
            : slide.id.startsWith("pm-print-aekkim-") ? "05" : null;
          const projectLabel = projectNumber ? `Project ${projectNumber}` : null;
          const eyebrow = slide.eyebrow.replace(/^Project \d+ · /, "");
          const headerLabel = projectLabel ? `${projectLabel} · ${eyebrow}` : eyebrow;
          return (
            <article
              className={`${styles.page} ${slide.className ?? ""}`}
              id={slide.id}
              key={slide.id}
              data-pm-slide=""
              aria-labelledby={titleId}
            >
              <header className={styles.pageHeader}>
                <p>{headerLabel}</p>
              </header>
              <h2 id={titleId} className={projectDescriptions[slide.id] ? fndaStyles.projectTitle : undefined}>
                {projectDescriptions[slide.id] ? <><span>{slide.title}</span>{" "}<span className={fndaStyles.projectDescription}>{projectDescriptions[slide.id]}</span></> : slide.title}
              </h2>
              <div className={styles.pageContent} data-pm-slide-content="">{slide.content}</div>
              <footer className={styles.pageFooter}>
                <span>{projectLabel ?? slide.eyebrow.split(" · ")[0]}</span>
                <span>{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import Image from "next/image";
import type { ReactNode } from "react";

import { links } from "@/data/links";
import { profile } from "@/data/profile";

import { pmMedia, selectedProjects, survey, type PmProject } from "../content";
import { career, education, skills } from "../resume-content";
import styles from "./PmPrintPortfolio.module.css";

type PrintSlide = {
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

export function PmPrintPortfolio({ preview = false }: { preview?: boolean }) {
  const smile = getProject("smile-game");
  const aekkim = getProject("aekkim");
  const busan = getProject("busan-eumgil");
  const playPick = getProject("play-pick");
  const burdenCount = survey.responses[0].count + survey.responses[1].count;
  const burdenPercent = ((burdenCount / survey.total) * 100).toFixed(1);

  const slides: PrintSlide[] = [
    {
      id: "pm-print-cover",
      eyebrow: "Product manager portfolio · 2026",
      title: <><span>팀이 같은 기준으로 일하도록,</span>{" "}<span className={styles.coverTitleAccent}>기획과 개발을 연결합니다.</span></>,
      className: styles.cover,
      content: (
        <div className={styles.coverGrid}>
          <div className={styles.coverStatement}>
            <p>{profile.name}</p>
            <p className={styles.coverRole}>Product Manager</p>
          </div>
          <div className={styles.coverSummary}>
            <p>공공자료 분석 실무 3년 10개월과 소프트웨어 팀 프로젝트 경험을 바탕으로 조사, 요구사항, 화면과 데이터 흐름을 다뤘습니다.</p>
            <ul className={styles.capabilityList}>
              <li><span>01</span>조사 결과를 기능 선택의 근거로 정리</li>
              <li><span>02</span>요구사항과 실제 구현 상태를 연결</li>
              <li><span>03</span>사용자 행동을 저장·완료 흐름으로 구현</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "pm-print-smile-intro",
      eyebrow: "Project 03 · 실시간 화상 게임",
      title: smile.name,
      className: styles.projectIntro,
      content: (
        <div className={styles.introGrid}>
          <div className={styles.introCopy}>
            <p className={styles.lead}>{smile.headline}</p>
            <p>{smile.subtitle}</p>
            <section className={styles.problemBox} aria-label="대상 사용자와 문제">
              <span>USER PROBLEM</span>
              <p>아이디어에 흥미를 느끼는 것과 실제로 카메라를 켜고 참여하는 것 사이의 장벽을 확인해야 했습니다.</p>
            </section>
            <ProjectMeta project={smile} />
          </div>
          <EvidenceImage src={pmMedia.previews.smile.poster} alt="웃지마게임 팀 서비스 시연 화면" width={1280} height={720} caption="팀 서비스 시연 · 랜덤 매칭" />
        </div>
      ),
    },
    {
      id: "pm-print-smile-research",
      eyebrow: "웃지마게임 · 핵심 기여 01",
      title: "흥미와 참여 의향, 얼굴 공개 부담을 분리해 물었습니다.",
      content: (
        <div className={styles.researchGrid}>
          <section className={styles.bigStat} aria-label="얼굴 공개 부담 설문 결과">
            <span>FACE EXPOSURE BARRIER</span>
            <strong>{burdenPercent}<small>%</small></strong>
            <p>‘꽤’ 또는 ‘매우’ 부담됨<br />{survey.total}명 중 {burdenCount}명</p>
          </section>
          <div className={styles.surveyPanel}>
            <dl className={styles.metricRow}>
              <div><dt>흥미</dt><dd>{survey.signals.interest} / {survey.total}</dd></div>
              <div><dt>참여 의향</dt><dd>{survey.signals.willingToParticipate} / {survey.total}</dd></div>
              <div><dt>얼굴 공개 부담</dt><dd>{burdenCount} / {survey.total}</dd></div>
            </dl>
            <ul className={styles.barChart} aria-label="얼굴 노출 부담 응답 분포">
              {survey.responses.map((response, index) => (
                <li key={response.label}>
                  <span>{response.label}</span>
                  <span className={styles.barTrack} aria-hidden="true"><i className={index < 2 ? styles.barAccent : ""} style={{ width: `${(response.count / 56) * 100}%` }} /></span>
                  <strong>{response.count}명</strong>
                </li>
              ))}
            </ul>
            <p className={styles.sourceNote}>사전 설문 168명 · 2026.01 · 24–29세와 남성 응답 비중이 높음</p>
          </div>
          <ol className={styles.decisionTrace} aria-label="조사에서 팀 결정까지의 흐름">
            <li><span>01 · 조사</span><strong>흥미·이용 의향·노출 부담을 각각 확인</strong></li>
            <li><span>02 · 해석</span><strong>참여 장벽을 얼굴 공개 부담으로 구분</strong></li>
            <li><span>03 · 팀 결정</span><strong>친구 초대를 우선하고 랜덤 매칭도 유지</strong></li>
          </ol>
        </div>
      ),
    },
    {
      id: "pm-print-smile-delivery",
      eyebrow: "웃지마게임 · 핵심 기여 02",
      title: "팀의 결정을 문서와 친구 초대방 구현으로 남겼습니다.",
      content: (
        <div className={styles.deliveryGrid}>
          <ol className={styles.outputSteps}>
            <li><span>01</span><div><strong>결정 기록</strong><p>설문 분석 결과와 매칭 우선순위를 기획서·기능명세·회의 기록에 반영했습니다.</p></div></li>
            <li><span>02</span><div><strong>방 생성·입장</strong><p>친구가 같은 방으로 진입할 수 있는 생성·입장 화면을 구현했습니다.</p></div></li>
            <li><span>03</span><div><strong>대기 흐름</strong><p>대기 화면을 구현하고 초대한 상대가 보이지 않는 문제와 통신 연동 오류를 수정했습니다.</p></div></li>
          </ol>
          <div className={styles.documentStack} aria-label="남긴 산출물">
            <span>DECISION RECORD</span>
            <p>설문 보고서</p><p>기획서</p><p>기능명세</p><p>회의 기록</p>
          </div>
          <RoleSplit mine="설문 설계·분석, 결정 기록, 친구 초대방 생성·입장·대기 화면 구현" team="웃음 판정 모델과 배틀 연동" />
        </div>
      ),
    },
    {
      id: "pm-print-aekkim-intro",
      eyebrow: "Project 02 · Android 구독 관리 앱",
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
            <section><span>개발 방식에 대한 회고</span><p>중간 팀원 이탈로 MVP 범위가 바뀌었고, 개발도 예상보다 느리게 진행됐습니다. 다음 프로젝트에서는 범위와 구현을 더 자주 점검하는 방식으로 바꿔야겠다고 느꼈습니다.</p></section>
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
          <EvidenceImage phone src={pmMedia.evidence.aekkimCandidateReview} alt="확인이 필요한 결제 묶음과 서비스 선택·제거 버튼" width={1080} height={2340} caption="후보 확인·제외 화면 캡처 · 예시 데이터" />
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
      eyebrow: "Project 01 · 보행약자 길안내 앱",
      title: busan.name,
      className: styles.projectIntro,
      content: (
        <div className={`${styles.introGrid} ${styles.phoneIntro}`}>
          <div className={styles.introCopy}>
            <p className={styles.lead}>{busan.headline}</p>
            <p>{busan.subtitle}</p>
            <section className={styles.problemBox} aria-label="대상 사용자와 문제">
              <span>USER PROBLEM</span>
              <p>부산의 보행약자와 저시력자가 자신의 이동 조건과 화면 이용 조건을 반영해 길을 확인할 수 있어야 했습니다.</p>
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
            <RoleSplit mine="길안내 지도·마커 고정, 문서 갱신, 접근성 설정·제보 표시" team="경로 탐색과 공간 데이터 개발" />
          </div>
        </div>
      ),
    },
    {
      id: "pm-print-play-pick-intro",
      eyebrow: "Project 04 · 공연 추천 웹 서비스",
      title: playPick.name,
      className: styles.projectIntro,
      content: (
        <div className={styles.introGrid}>
          <div className={styles.introCopy}>
            <p className={styles.lead}>{playPick.headline}</p>
            <p>{playPick.subtitle}</p>
            <section className={styles.problemBox} aria-label="온보딩의 역할">
              <span>ONBOARDING ROLE</span>
              <p>이용 기록이 없는 신규 사용자의 첫 추천에 활용할 취향 정보를 가입 직후 수집합니다.</p>
            </section>
            <ProjectMeta project={playPick} />
          </div>
          <EvidenceImage src={pmMedia.previews["play-pick"].poster} alt="Play Pick 공연 취향 온보딩 화면" width={960} height={720} caption="서비스 화면 재현 데모 · 예시 데이터 사용" />
        </div>
      ),
    },
    {
      id: "pm-print-play-pick-flow",
      eyebrow: "Play Pick · 핵심 기여",
      title: "선택의 의미를 지키며 저장 성공 뒤에만 추천으로 이동했습니다.",
      content: (
        <div className={styles.playFlowLayout}>
          <dl className={styles.choiceRules}>
            <div><dt>보고싶어요</dt><dd>호감 응답으로 저장</dd></div>
            <div><dt>안볼래요</dt><dd>비호감 응답으로 저장</dd></div>
            <div><dt>모르겠어요</dt><dd>판단 보류 · 저장과 완료 개수에서 제외</dd></div>
          </dl>
          <ol className={styles.pipeline} aria-label="온보딩 저장과 완료 흐름">
            <li><span>01</span><strong>선택</strong><p>호감·비호감 유효 응답을 8개 이상 수집</p></li>
            <li><span>02</span><strong>저장</strong><p>공연 ID와 응답 값을 서버 요청으로 전달</p></li>
            <li><span>03</span><strong>완료</strong><p>저장 성공 뒤 온보딩 완료 처리</p></li>
            <li><span>04</span><strong>추천 이동</strong><p>저장된 취향을 첫 추천에 연결</p></li>
          </ol>
          <div className={styles.failureRule}><strong>실패 기준</strong><p>저장 요청이 실패하면 현재 화면에 머물고 완료 처리와 추천 이동을 진행하지 않습니다.</p></div>
          <RoleSplit mine="팀장 · 온보딩 화면·프론트엔드, API, 사용자 선호 저장 처리" team={playPick.teamRole ?? "핵심 검색·추천 엔진 개발"} />
        </div>
      ),
    },
    {
      id: "pm-print-experience-contact",
      eyebrow: "Experience · Education · Contact",
      title: "분석 실무를 제품의 요구사항과 구현 기준으로 확장했습니다.",
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
    "pm-print-busan-intro",
    "pm-print-busan-planning",
    "pm-print-busan-map",
    "pm-print-aekkim-intro",
    "pm-print-aekkim-criteria",
    "pm-print-aekkim-interface",
    "pm-print-smile-intro",
    "pm-print-smile-research",
    "pm-print-smile-delivery",
    "pm-print-play-pick-intro",
    "pm-print-play-pick-flow",
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
      aria-label="이재호 PM 인쇄 포트폴리오"
    >
      <div className={styles.deck}>
        {orderedSlides.map((slide, index) => {
          const titleId = `${slide.id}-title`;
          return (
            <article
              className={`${styles.page} ${slide.className ?? ""}`}
              id={slide.id}
              key={slide.id}
              data-pm-slide=""
              aria-labelledby={titleId}
            >
              <header className={styles.pageHeader}>
                <p>{slide.eyebrow}</p>
                <span>LEE JAEHO · PM PORTFOLIO</span>
              </header>
              <h2 id={titleId}>{slide.title}</h2>
              <div className={styles.pageContent} data-pm-slide-content="">{slide.content}</div>
              <footer className={styles.pageFooter}>
                <span>{slide.eyebrow.split(" · ")[0]}</span>
                <span>{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}

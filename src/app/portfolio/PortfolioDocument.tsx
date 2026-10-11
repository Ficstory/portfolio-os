import Image from "next/image";
import type { ReactNode } from "react";
import PrintToolbar from "./PrintToolbar";
import reportPage from "./assets/civic-report-37.png";
import styles from "./document.module.css";

type Project = {
  id: string; number: string; name: string; period: string; category: string;
  heading: string; description: string; role: string; actions: string[];
  output: string; result: string; image: string; alt: string; href: string;
  portrait: boolean; width: number; height: number; caption: string;
};

function Page({ id, label, context, number, footer, href, children, cover = false }: {
  id: string; label: string; context: string; number: number; footer: string;
  href?: string; children: ReactNode; cover?: boolean;
}) {
  return <section id={id} className={`${styles.page} ${cover ? styles.cover : ""}`} aria-label={`${number}쪽 · ${label}`}>
    <header className={styles.pageHeader}><p>{label}</p><span>{context}</span></header>
    <div className={styles.pageBody}>{children}</div>
    <footer className={styles.pageFooter}><span>{footer}</span>{href && <a href={href}>프로젝트 상세 ↗</a>}<span>{String(number).padStart(2, "0")} / 07</span></footer>
  </section>;
}

function Narrative({ title, children }: { title: string; children: ReactNode }) {
  return <div className={styles.narrative}><h3>{title}</h3><p>{children}</p></div>;
}

function ProjectImage({ project }: { project: Project }) {
  return <figure className={project.portrait ? styles.phoneFigure : styles.wideFigure}>
    <a href={project.image} target="_blank" rel="noopener" aria-label={`${project.name} 이미지 크게 보기`}>
      <Image src={project.image} alt={project.alt} width={project.width} height={project.height} loading="eager" sizes={project.portrait ? "230px" : "(max-width: 900px) 90vw, 490px"} />
    </a>{project.caption && <figcaption>{project.caption}</figcaption>}
  </figure>;
}

export default function PortfolioDocument({ projects }: { projects: Project[] }) {
  const [aekkim, busan, smile, play] = projects;
  return <div className={styles.site}>
    <a href="#content" className={styles.skip}>본문으로 건너뛰기</a>
    <PrintToolbar />
    <main id="content" className={styles.deck} data-common-portfolio>
      <Page id="top" label="이재호" context="경력과 프로젝트" number={1} footer="경력과 작업물을 담은 포트폴리오" cover>
        <h1>자료를 정리하고,<br /><span>함께 실행할 기준을 만듭니다.</span></h1>
        <p className={styles.coverIntro}>부산참여연대의 자료 분석·대외 협의 경험에<br className={styles.desktopOnly} /> SSAFY 팀 프로젝트의 기획·구현 경험을 더했습니다.</p>
        <div className={styles.coverBottom}>
          <div className={styles.identity}><h2>이재호 <span>LEE JAEHO</span></h2><p>부산참여연대 지방자치본부<br />2021.05–2025.02 · 간사, 팀장</p><p>삼성 청년 SW·AI 아카데미(SSAFY) 수료<br />2025.07–2026.06</p></div>
          <ol className={styles.contents}>
            <li><a href="#experience"><span>자료 분석·문서 작성·대외 협의</span><strong>부산참여연대 경력</strong><small>02</small></a></li>
            <li><a href="#aekkim"><span>조사·기획·UX·개발</span><strong>애낌 · 부산이음길 · 웃지마게임 · PlayPick</strong><small>03–06</small></a></li>
            <li><a href="#about"><span>교육과 활동</span><strong>SSAFY 수료 · 신세계 FNDA 2기 교육 중</strong><small>07</small></a></li>
          </ol>
        </div>
      </Page>

      <Page id="experience" label="자료 분석·문서 작성·대외 협의" context="부산참여연대 · 2021.05–2025.02" number={2} footer="간사 2021.05–2024.03 · 팀장 2024.03–2025.02">
        <h2 className={styles.pageTitle}>자료를 분석하고,<br />협의에 필요한 근거를 정리했습니다.</h2>
        <div className={styles.careerGrid}>
          <div>
            <p className={styles.role}><b>본인 역할</b> 지방자치·재정감시 실무 · 보고서 작성 · 대외 협의 · 시민 교육</p>
            <Narrative title="자료의 쟁점을 문서로 정리했습니다.">부산시 예산·결산과 시의회 의정활동을 분석하고 평가 보고서를 작성했습니다. 조례 입법예고 의견을 취합하고 행정사무감사 시민의제를 정리했습니다.</Narrative>
            <Narrative title="의견을 모으고 협의 실무를 맡았습니다.">시민의제 제안 기자회견과 부산시의회 의장단 간담회 실무를 맡았습니다. 시민사회·의회·행정 사이에서 의견과 자료를 취합하고 협의를 지원했습니다.</Narrative>
            <Narrative title="시민에게 필요한 설명으로 풀었습니다.">의회모니터단 교육 자료를 만들고 강의와 현장 방청을 진행했습니다. 회의록과 예산안의 핵심을 추려 지역 생활 사례로 설명했습니다.</Narrative>
          </div>
          <figure className={styles.reportFigure}><a href={reportPage.src} target="_blank" rel="noopener" aria-label="분석 보고서 원본 37쪽 크게 보기"><Image src={reportPage} alt="부산시 구·군의회 공무국외출장 실태 분석 보고서의 심사위원회 구성 비교표" loading="eager" sizes="300px" /></a><figcaption>공무국외출장 실태 분석 보고서 · 원본 37쪽<br />심사위원회 구성 비교표</figcaption></figure>
        </div>
      </Page>

      <Page id="aekkim" label="요구사항·작업계획·구현" context={`SSAFY 특화 프로젝트 · ${aekkim.period}`} number={3} footer="SSAFY 특화 프로젝트 우수상 · 2026.03 · 팀 수상" href={aekkim.href}>
        <h2 className={styles.pageTitle}>요구사항과 작업계획을<br />구독 확인·등록 화면으로 연결했습니다.</h2>
        <div className={styles.phoneGrid}>
          <ProjectImage project={aekkim} />
          <div><h3 className={styles.projectTitle}>구독 관리 서비스 ‘애낌’</h3><p className={styles.projectIntro}>{aekkim.description}</p><p className={styles.role}><b>본인 역할</b> {aekkim.role}</p>
            <Narrative title="무엇을 만들고 어떤 순서로 할지 정리했습니다.">요구사항정의서와 화면명세서를 작성하고, 프론트엔드 작업 순서와 처리 기준을 정리했습니다. 구현 중 달라진 동작과 예외 처리 기준을 명세에 반영했습니다.</Narrative>
            <Narrative title="분석 결과를 사용자가 확인하는 화면을 구현했습니다.">사용자가 구독 후보를 확인·제외하고 등록하는 화면을 구현했습니다. 매칭되지 않은 결제 내역을 직접 연결하는 흐름도 다뤘습니다.</Narrative>
            <p className={styles.result}><b>산출물</b> 요구사항정의서 · 화면명세서 · 작업계획 · 구독 확인·등록 화면</p>
          </div>
        </div>
      </Page>

      <Page id="busan-eumgil" label="기관 협의·요구사항·UX" context={`SSAFY 자율 프로젝트 · ${busan.period}`} number={4} footer="" href={busan.href}>
        <h2 className={styles.pageTitle}>현장에서 들은 조건을<br />요구사항과 이용 흐름으로 정리했습니다.</h2>
        <div className={styles.phoneGrid}>
          <ProjectImage project={busan} />
          <div><h3 className={styles.projectTitle}>이동을 돕는 길찾기 ‘부산이음길’</h3><p className={styles.projectIntro}>{busan.description}</p><p className={styles.role}><b>본인 역할</b> 기관 연락·인터뷰 · 요구사항 정리 · UX 설계 · 프론트엔드</p>
            <Narrative title="9개 기관에 협조를 요청하며 현장의 조건을 들었습니다.">인적 네트워크와 공문을 활용했습니다. 거절 이후에도 다른 기관에 접촉해 시각장애인 협회의 추가 인터뷰를 성사시켰으나, 실사용 데이터 확보에는 이르지 못했습니다.</Narrative>
            <Narrative title="이동 조건을 경로 선택과 화면에 반영했습니다.">경사·단차·보행로 폭 등을 정리하고, 안전한 길과 최단거리를 비교·선택하는 흐름을 설계했습니다. 지도·길안내 화면 구현에도 참여했습니다.</Narrative>
            <p className={styles.followup}><b>프로젝트 이후</b> 기존 결과물을 정리하고 데이터 기반 수익구조를 보완해 공공데이터 공모전에 출품했으나 수상하지 못했습니다.</p>
          </div>
        </div>
      </Page>

      <Page id="smile-game" label="사용자 조사·의사결정·문서화" context={`SSAFY 공통 프로젝트 · ${smile.period}`} number={5} footer="" href={smile.href}>
        <h2 className={styles.pageTitle}>참여를 망설이는 이유를 확인하고,<br />기능의 우선순위를 조정했습니다.</h2>
        <div className={styles.landscapeGrid}>
          <div><h3 className={styles.projectTitle}>실시간 표정 게임 ‘웃지마게임’</h3><p className={styles.projectIntro}>{smile.description}</p><p className={styles.role}><b>본인 역할</b> {smile.role}</p>
            <Narrative title="설문 결과를 팀의 판단에 연결했습니다.">설문 초안 작성·배포·분석을 맡았습니다. 응답 168건 중 112건에서 얼굴 노출 부담을 확인하고, 팀과 논의해 친구·지인과의 참여 흐름을 우선했습니다.</Narrative>
            <Narrative title="결정한 내용을 문서와 화면으로 남겼습니다.">기획서·기능명세서·회의록·발표자료를 정리하고, 초대·로그인·대기실 구현에 참여했습니다.</Narrative>
          </div><ProjectImage project={smile} />
        </div>
      </Page>

      <Page id="play-pick" label="화면 설계·구현·발표" context={`SSAFY 관통 프로젝트 · ${play.period}`} number={6} footer="" href={play.href}>
        <h2 className={styles.pageTitle}>취향을 남기는 첫 단계부터<br />추천 화면까지 연결했습니다.</h2>
        <div className={styles.landscapeGrid}>
          <div><h3 className={styles.projectTitle}>공연 추천·커뮤니티 ‘PlayPick’</h3><p className={styles.projectIntro}>{play.description}</p><p className={styles.role}><b>본인 역할</b> 팀장 · UI/UX · 프론트엔드 · 문서·발표</p>
            <Narrative title="사용자가 서비스를 시작하는 흐름을 구현했습니다.">온보딩에서 취향을 선택하고 응답을 저장한 뒤 추천 화면으로 이동하는 흐름을 구현했습니다. 팀원이 담당한 추천·검색 기능을 사용자 화면과 연결했습니다.</Narrative>
            <Narrative title="화면 설계부터 문서와 발표까지 맡았습니다.">2인 팀에서 사용자 화면 설계와 프론트엔드 구현을 맡고, 프로젝트 문서와 발표자료를 정리했습니다.</Narrative>
          </div><ProjectImage project={play} />
        </div>
      </Page>

      <Page id="about" label="교육과 활동" context="이재호 · 2026" number={7} footer="경력과 프로젝트">
        <h2 className={styles.pageTitle}>배움과 참여를 이어가고 있습니다.</h2>
        <div className={styles.backgroundGrid}>
          <div><h3 className={styles.columnTitle}>교육</h3><dl className={styles.entries}>
            <div><dt>신세계 Future &amp; Dream Academy (FNDA) 2기</dt><dd>부산대 과정 · 2026.09.09–현재 교육 중<br />리테일·고객경험·데이터/AI 활용<br /><strong>2026.12.02 수료 예정</strong></dd></div>
            <div><dt>삼성 청년 SW·AI 아카데미 (SSAFY)</dt><dd>2025.07–2026.06 · 1,628시간 수료</dd></div>
            <div><dt>국립한국해양대학교 동아시아학과</dt><dd>2022.08 졸업 · 국제지역학사</dd></div>
          </dl></div>
          <div><h3 className={styles.columnTitle}>대외활동</h3><dl className={styles.entries}>
            <div><dt>부산진구 청년네트워크 위원</dt><dd>2025.02–2025.12</dd></div><div><dt>부산진구 의정비심의위원회 위원</dt><dd>2024.02–2025.01</dd></div><div><dt>부산청년정책네트워크 참여자</dt><dd>2022.02–2022.12</dd></div>
          </dl><h3 className={`${styles.columnTitle} ${styles.toolsTitle}`}>활용 도구</h3><p className={styles.tools}>Figma · Notion · Jira · Git<br />Python · Django · Kotlin · Jetpack Compose</p></div>
        </div>
        <div id="contact" className={styles.contact}><a href="mailto:dlwo4367@gmail.com">dlwo4367@gmail.com</a><a href="https://github.com/Ficstory">GitHub ↗</a><a href="/PM/">PM 상세 포트폴리오 ↗</a></div>
      </Page>
    </main>
  </div>;
}

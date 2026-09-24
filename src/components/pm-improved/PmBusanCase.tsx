import Image from "next/image";
import type { PmProject } from "./content";
import {
  CaseBody,
  CaseHero,
  CaseSection,
  EvidenceList,
  RoleBoundary,
} from "./PmCaseStudy";
import { PmBusanDemos } from "./PmBusanDemos";
import detail from "./caseStudy.module.css";
import styles from "./busanCase.module.css";

const youtube = {
  playlist: "https://www.youtube.com/playlist?list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  onboarding: "https://www.youtube.com/watch?v=FXIbw8DThdI&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  route: "https://www.youtube.com/watch?v=6W7sITJkd6I&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  report: "https://www.youtube.com/watch?v=N_Y9HEl7hVc&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  fontSize: "https://www.youtube.com/watch?v=PnETu8ukxlA&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  lowVision: "https://www.youtube.com/watch?v=SOZbTG74Aek&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  appDemo: "https://www.youtube.com/watch?v=NYmv58tJr7o&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  presentation: "https://www.youtube.com/watch?v=Ghsyp3Pk8RI&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
  admin: "https://www.youtube.com/watch?v=H7rwuiiyHuo&list=PLv_Yl-rq-62rcCDquK6y2S8j1RRBETKtJ",
} as const;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

function AdminFigure({ src, alt, title, width, height, children }: {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <figure className={styles.adminFigure}>
      <a href={src} target="_blank" rel="noreferrer" aria-label={`${title} 원본 이미지 새 탭에서 열기`}>
        <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 767px) 100vw, 760px" />
      </a>
      <figcaption><strong>TEAM · {title}</strong>{children} <span>이미지를 누르면 원본 크기로 볼 수 있습니다.</span></figcaption>
    </figure>
  );
}

export function PmBusanCase({ project }: { project: PmProject }) {
  const caseProject: PmProject = {
    ...project,
    subtitle: "함세상 장애인자립생활센터 인터뷰에서 확인한 이동 조건을 MVP로 좁히고, 길안내 지도의 핵심 상호작용을 구현한 7인 팀 프로젝트입니다.",
    role: "초기 서비스 기획 · 기관 섭외·인터뷰 · MVP 선정 · 지도 프론트엔드 · API 사용 계약",
    teamRole: "경로 알고리즘·공간 데이터 · 온보딩·저시력 모드·즐겨찾기·제보 등록 등 팀 구현",
    actions: [
      "함세상 장애인자립생활센터를 직접 섭외해 2026년 4월 10일 인터뷰를 진행하고 MVP 범위를 정했습니다.",
      "지도 렌더링과 선택 마커 고정, 카메라 제스처 동기화를 구현했습니다.",
      "글자 크기 즉시 저장·적용과 승인된 제보 마커·하단 정보 패널을 구현했습니다.",
      "Aro/ODsay 대중교통 API 사용 계약에 E102 대표로 서명하고 기획·기능 명세를 동기화했습니다.",
    ],
    result: "개인: 인터뷰를 MVP 결정으로 연결하고 지도 핵심 상호작용, 접근성 설정, 승인 제보 표시를 구현했으며 API 사용 근거와 협업 문서를 남겼습니다. 팀: 보행약자의 이동 조건을 반영한 길안내 앱과 운영 검토 화면을 완성했습니다.",
    strengths: ["현장 인터뷰→MVP", "지도 상호작용 구현", "외부 API·문서 협업"],
  };

  return (
    <>
      <CaseHero project={caseProject} />
      <PmBusanDemos />

      <CaseBody labels={{
        problem: "현장 인터뷰",
        evidence: "MVP 판단",
        decision: "지도 구현",
        action: "API·문서",
        collaboration: "운영 협업",
        result: "결과·한계",
        learning: "회고·자료",
      }}>
        <CaseSection id="problem" label="현장 인터뷰 / Discovery" title="기획안을 들고 현장으로 가서, 이동에서 막히는 지점을 먼저 들었습니다.">
          <p>저는 부산이음길의 초기 서비스 기획을 맡고, 함세상 장애인자립생활센터를 직접 섭외했습니다. 2026년 4월 10일 센터를 방문해 기획 중인 지도 기능을 설명하고 이동 경험과 필요한 정보를 인터뷰했습니다.</p>
          <p>인터뷰는 아이디어를 확인하는 데서 끝내지 않고, 제한된 개발 기간에 무엇부터 구현할지 정하는 근거로 사용했습니다.</p>
          <figure className={detail.mediaEvidence}>
            <Image
              className={styles.meetingImage}
              src="/pm-improved/evidence/busan-mvp-meeting.png"
              alt="지도 기능과 MVP 범위를 설명하며 의견을 나누는 미팅 현장"
              width={1920}
              height={1080}
              sizes="(max-width: 767px) 100vw, 760px"
            />
            <figcaption>MY ROLE · MVP 기능을 설명하고 이동 조건에 관한 의견을 들은 인터뷰 현장</figcaption>
          </figure>
          <RoleBoundary kind="MY ROLE">초기 기획, 기관 섭외와 일정 조율, 인터뷰 진행, 인터뷰 내용을 MVP 범위로 정리하는 일까지 직접 맡았습니다.</RoleBoundary>
        </CaseSection>

        <CaseSection id="evidence" label="MVP 판단 / From interview to scope" title="요구를 기능 목록이 아니라, 첫 사용 흐름의 세 가지 판단으로 바꿨습니다.">
          <EvidenceList items={[
            { title: "이동 조건을 먼저 묻기", text: "이동 보조기기마다 피해야 할 조건이 다르다는 의견을 사용자 유형 온보딩과 경로 조건의 출발점으로 삼았습니다." },
            { title: "경로를 비교해 선택하기", text: "하나의 최단 경로만 주기보다 경사·계단·폭과 같은 정보를 확인하고 선택할 수 있도록 경로 비교·상세·안내 흐름을 MVP에 포함했습니다." },
            { title: "시설과 현장 정보를 함께 보기", text: "화장실·충전기·건물 접근성 정보와 사용자 제보를 지도에서 구분해 탐색하는 범위를 정했습니다." },
          ]} />
          <p className={styles.scopeNote}>제가 MVP 판단에 사용한 4월 10일 인터뷰만으로 다양한 이동 조건에서의 효과를 일반화할 수는 없습니다. 실제 이동 상황에서의 후속 검증이 필요합니다.</p>
        </CaseSection>

        <CaseSection id="decision" label="지도 프론트엔드 / Implementation" title="선택한 장소가 지도 조작 중에도 맥락을 잃지 않도록 만들었습니다.">
          <p>길안내 지도에서 사용자가 선택한 마커는 화면 기준 위치에 고정되어야 했고, 지도 이동·확대 같은 카메라 제스처와 표시 상태가 함께 움직여야 했습니다. 저는 지도 렌더링과 선택 마커의 고정 동작, 카메라 제스처 동기화를 구현했습니다.</p>
          <figure className={detail.mediaEvidence}>
            <div className={styles.mapImage}>
              <Image
                src="/pm-improved/evidence/busan-route-map.png"
                alt="접근성 시설 마커와 최근 목적지를 표시하는 부산이음길 지도 화면"
                width={720}
                height={1560}
                sizes="(max-width: 767px) 88vw, 430px"
              />
            </div>
            <figcaption>MY ROLE · 지도 렌더링, 선택 마커 고정, 카메라 제스처 동기화</figcaption>
          </figure>
          <EvidenceList items={[
            { title: "글자 크기", text: "기본·크게·매우 크게 중 하나를 선택하면 값을 즉시 저장하고 앱 화면에 바로 반영하도록 구현했습니다." },
            { title: "승인 제보", text: "승인된 제보는 접근성 시설과 다른 마커로 구분하고, 선택 시 하단 패널에서 내용을 확인하도록 구현했습니다." },
            { title: "역할 경계", text: "경로 알고리즘과 공간 데이터는 팀원이 담당했습니다. 저는 그 결과가 사용자의 지도 조작과 선택 상태로 이어지는 프론트엔드 경험을 맡았습니다." },
          ]} />
          <p className={styles.inlineLinks}><ExternalLink href={youtube.route}>경로 탐색 시연</ExternalLink><ExternalLink href={youtube.fontSize}>글자 크기 시연</ExternalLink><ExternalLink href={youtube.report}>제보 기능 시연</ExternalLink></p>
        </CaseSection>

        <CaseSection id="action" label="외부 API 확보·문서 / Delivery" title="외부 API 사용 조건과 화면 명세를 구현 가능한 약속으로 관리했습니다.">
          <p>Aro/ODsay 대중교통 API 사용 계약에 E102 대표로 서명해 2026년 5월 13일부터 2027년 5월 12일까지 1년간 무상 사용 근거를 확보했습니다. 계약서에는 로고·출처 표기와 서비스 기획안·화면 제출 의무가 명시되어 있습니다.</p>
          <p>팀 서비스에서는 지하철 도착 정보와 역 접근성 정보를 함께 보여주고, 엘리베이터 접근 지점을 포함한 이동 정보를 안내했습니다. 이 대중교통 연동은 팀 산출물입니다.</p>
          <p className={styles.scopeNote}>이용 기간과 조건은 사용 약정서 기준이며, 개인정보가 포함된 원문은 공개하지 않습니다.</p>
          <EvidenceList items={[
            { title: "기획 문서", text: "인터뷰에서 확인한 요구와 MVP 선택 이유를 팀이 같은 기준으로 볼 수 있도록 정리했습니다." },
            { title: "기능·화면 명세", text: "접근성 설정, 지도 마커, 하단 패널의 상태와 표시 기준을 구현 내용에 맞춰 갱신했습니다." },
            { title: "API 사용 조건", text: "계약서에서 사용 기간, 출처·로고 표기, 서비스 기획안·화면 제출 의무를 확인했습니다." },
          ]} />
          <RoleBoundary kind="COLLABORATION">문서가 기획의 기록으로만 남지 않고, 디자인·프론트엔드·경로 개발이 같은 상태와 용어를 보도록 구현 변화와 함께 맞췄습니다.</RoleBoundary>
        </CaseSection>

        <CaseSection id="collaboration" label="운영 검토 / Team operations" title="시설·경로 검수부터 오류 관측까지, 팀 서비스의 운영 흐름을 갖췄습니다.">
          <p>아래 관리자·모니터링 화면은 팀 구현입니다. PM 관점에서는 시설 정보의 신뢰성, 경로 구간의 조건, 오류 상황을 운영자가 다시 확인할 수 있어야 사용자 화면의 품질을 유지할 수 있다고 판단했습니다.</p>
          <div className={styles.adminGallery}>
            <AdminFigure
              src="/pm-improved/busan/admin-facilities.jpg"
              alt="접근성 시설의 위치와 상세 정보를 검토하는 부산이음길 관리자 화면"
              title="접근성 시설 검토"
              width={4500}
              height={2569}
            >시설 위치와 접근성 속성을 운영자가 확인하는 화면입니다.</AdminFigure>
            <AdminFigure
              src="/pm-improved/busan/admin-routes.jpg"
              alt="경로 구간과 프로파일, 구간별 속성을 검토하는 부산이음길 관리자 화면"
              title="경로 구간 검토"
              width={4493}
              height={2577}
            >구간별 속성과 경로 프로파일을 함께 확인해 사용자에게 보이는 경로의 근거를 추적합니다.</AdminFigure>
            <AdminFigure
              src="/pm-improved/busan/monitoring.jpg"
              alt="애플리케이션 로그와 오류 상태를 확인하는 Grafana 모니터링 화면"
              title="Grafana 모니터링"
              width={4502}
              height={2585}
            >오류와 로그를 관찰해 시연·운영 중 발생한 문제를 찾는 팀의 관측 화면입니다.</AdminFigure>
          </div>
          <p className={styles.inlineLinks}><ExternalLink href={youtube.admin}>관리자 기능 영상 보기</ExternalLink></p>
        </CaseSection>

        <CaseSection id="result" label="결과와 한계 / Output" title="인터뷰의 언어를 앱의 선택 기준과 지도 상호작용으로 연결했습니다.">
          <EvidenceList items={[
            { title: "개인 산출물", text: "기관 인터뷰 기록과 MVP 범위, 지도 핵심 상호작용, 글자 크기 설정, 승인 제보 표시, API 사용 계약과 협업 명세를 남겼습니다." },
            { title: "팀 산출물", text: "사용자 유형 온보딩, 경로 탐색, 저시력 모드, 즐겨찾기, 제보 등록과 관리자·모니터링 화면을 포함한 앱을 완성했습니다." },
          ]} />
          <p>현재 확인한 근거는 프로토타입 구현과 시연 단계입니다. 실제 사용자 대상의 경로 선택·지도 가독성·제보 신뢰도 검증은 후속 과제로 남았습니다.</p>
          <p className={styles.inlineLinks}><ExternalLink href={youtube.appDemo}>앱 기능 요약 영상</ExternalLink><ExternalLink href={youtube.playlist}>8개 영상 플레이리스트</ExternalLink></p>
        </CaseSection>

        <CaseSection id="learning" label="회고와 참고 자료 / Reflection" title="PM의 역할은 요구를 많이 모으는 것이 아니라, 확인 가능한 결정과 역할 경계로 바꾸는 일이었습니다.">
          <p>현장 인터뷰를 직접 만들고 그 결과를 MVP로 좁힌 뒤, 제가 맡은 지도 화면까지 구현하면서 기획과 개발 사이의 간격을 체감했습니다. 사용자 요구를 화면 상태와 데이터, 운영 검토 기준까지 연결해야 팀이 같은 기능을 구현할 수 있다는 점을 배웠습니다.</p>
          <details className={styles.references}>
            <summary>영상·참고 자료 전체 보기</summary>
            <ul>
              <li><span>2026.06 · 사업계획서, 기능·운영 구성 확인 · 비공개 자료</span></li>
              <li><ExternalLink href={youtube.presentation}>프로젝트 소개 발표 · 4분 37초</ExternalLink></li>
              <li><ExternalLink href={youtube.onboarding}>사용자 유형 온보딩 · 약 20초</ExternalLink></li>
              <li><ExternalLink href={youtube.route}>경로 탐색 · 34초</ExternalLink></li>
              <li><ExternalLink href={youtube.report}>사용자 제보 · 33초</ExternalLink></li>
              <li><ExternalLink href={youtube.fontSize}>글자 크기 설정 · 15초</ExternalLink></li>
              <li><ExternalLink href={youtube.lowVision}>저시력 모드 · 16초</ExternalLink></li>
              <li><ExternalLink href={youtube.appDemo}>앱 기능 요약 · 27초</ExternalLink></li>
              <li><ExternalLink href={youtube.admin}>관리자 기능 · 3분 15초</ExternalLink></li>
            </ul>
          </details>
        </CaseSection>
      </CaseBody>
    </>
  );
}

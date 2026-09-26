import Image from "next/image";
import type { PmProject } from "./content";
import {
  CaseBody,
  CaseHero,
  CaseSection,
  EvidenceList,
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
} as const;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

export function PmBusanCase({ project }: { project: PmProject }) {
  const caseProject: PmProject = {
    ...project,
    subtitle: "장애인자립생활센터에 직접 연락해 들은 이동 조건을 제품 기준으로 정리하고, Android 기반부터 지도·경로·내비게이션의 데이터 흐름까지 구현한 프로젝트입니다.",
    role: "서비스 기획·기관 연락·인터뷰 · Android 기반 · 지도·경로·내비게이션 FE · 인증·API 연동",
    actions: [
      "함세상 장애인자립생활센터에 최초 연락하고 인터뷰를 진행해 이동 조건을 PRD와 MVP 기준으로 구체화했습니다.",
      "Android 앱의 기본 구조와 초기 설정 저장·재진입 분기, 지도 상태·필터·마커 구조를 만들었습니다.",
      "Kakao 지도·장소 검색, 경로 API 응답 변환, 길안내 상태와 음성 안내를 하나의 흐름으로 연결했습니다.",
      "인증 재발급·재시도, 계정별 저장 정보 정리, 북마크 저장 기준과 음성 기능의 프론트엔드 범위를 코드와 문서로 남겼습니다.",
    ],
    result: "현장 요구를 제품 기준으로 바꾸고, 앱 기반부터 지도·경로·안내·인증 복구까지 이어지는 프론트엔드 구조와 테스트를 남겼습니다. 기능별 API 연동 조건을 백엔드와 맞추고 대중교통 API 사용 약정에도 대표로 서명했습니다.",
    strengths: ["현장 요구의 제품화", "지도·경로 통합", "오류 복구·계약 정리"],
  };

  return (
    <>
      <CaseHero project={caseProject} />
      <PmBusanDemos />

      <CaseBody labels={{
        problem: "프로젝트와 역할",
        evidence: "현장→MVP",
        decision: "예시→실연동",
        action: "인증·상태 복구",
        collaboration: "API·인계",
        result: "구현 결과",
        learning: "다음 적용",
      }}>
        <CaseSection id="problem" label="프로젝트와 역할 / Context" title="기획 문서에서 시작한 역할은 앱의 기반과 데이터 흐름을 잇는 일까지 넓어졌습니다.">
          <p>부산이음길은 보행약자가 목적지까지 이동할 때 접근성 정보, 경로 비교, 장애물 제보를 한 흐름에서 확인하도록 만든 Android 서비스입니다. 저는 초기 기획과 현장 인터뷰를 맡은 뒤 Android 기반, 지도·경로·내비게이션, 인증과 상태 복구까지 이어서 구현했습니다.</p>
          <p>작업 범위는 초기 설정 저장과 재진입 분기에서 시작해 실제 지도·경로 API 연결, 음성 안내, 인증 재발급과 계정별 저장 정보 정리까지 순서대로 확장됐습니다.</p>
          <figure className={detail.mediaEvidence}>
            <Image
              className={styles.meetingImage}
              src="/pm-improved/evidence/busan-mvp-meeting.png"
              alt="지도 기능과 MVP 범위를 설명하며 의견을 나누는 미팅 현장"
              width={1920}
              height={1080}
              sizes="(max-width: 767px) 100vw, 760px"
            />
            <figcaption>2026.04.10 · 직접 연락하고 진행한 함세상 장애인자립생활센터 인터뷰</figcaption>
          </figure>
        </CaseSection>

        <CaseSection id="evidence" label="회고 01 / 현장 의견을 MVP로" title="‘교통약자를 위한 길찾기’를 사용자가 비교하고 확인할 수 있는 기준으로 바꿨습니다.">
          <p>4월 10일 인터뷰에서는 수동 휠체어가 경사·단차·보도 상태와 폭의 영향을 크게 받고, 음성 안내를 들으면서도 화면을 함께 확인한다는 의견이 나왔습니다.</p>
          <p>저는 인터뷰 내용을 이슈별로 정리해 안전한 길과 최단거리 비교, 접근성 시설 확인, 화면과 음성을 함께 쓰는 흐름으로 구체화했습니다. 이 기준을 PRD와 화면·기능 명세에 반영했습니다.</p>
          <EvidenceList items={[
            { title: "경로 비교", text: "안전한 길과 최단거리 중 이동 조건에 맞는 경로를 고르는 구조를 MVP에 넣었습니다." },
            { title: "접근성 정보", text: "경사·단차·보도 폭과 시설 정보를 경로와 지도에서 함께 확인하도록 기준을 정리했습니다." },
            { title: "화면과 음성", text: "화면에서 경로를 확인하며 음성 안내를 함께 사용하는 기준을 세웠습니다." },
          ]} />
          <p>정리한 기준은 이후 경로 데이터, 지도 필터, 길안내 음성 구현에 반영됐습니다. 다음 프로젝트에서는 인터뷰 기록에 연락·진행·참석·결정 담당을 함께 남기고, 실제 이동 테스트에서 경사·GPS 오차·재탐색·음성 안내를 같은 체크리스트로 검증하겠습니다.</p>
        </CaseSection>

        <CaseSection id="decision" label="회고 02 / 예시 데이터에서 실제 연동으로" title="예시 경로로 세운 데이터 구조를 실제 지도와 경로 API에 연결했습니다.">
          <p>4월에는 예시 경로 응답과 좌표 변환, 데이터 접근 구조와 테스트를 먼저 만들었습니다. 5월에는 이 구조에 실제 Kakao 지도와 장소 검색, 도보·대중교통 경로 API를 차례로 연결했습니다.</p>
          <p>저는 Kakao 지도의 초기화·카메라·마커·경로선과 장소 검색을 구현하고, 경로 검색·선택·재탐색·도착·평가 응답이 길안내 상태로 이어지게 만들었습니다. 기능별 요청과 응답 조건은 백엔드와 직접 맞췄습니다.</p>
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
            <figcaption>지도·장소 검색·경로 API와 길안내 상태를 연결한 실제 앱 화면</figcaption>
          </figure>
          <EvidenceList items={[
            { title: "앱 기반", text: "Android 앱 구조와 화면 이동, 초기 설정 저장(DataStore), 재진입 분기를 만들었습니다." },
            { title: "지도·경로", text: "지도 상태·필터·마커에서 시작해 실제 지도, 장소 검색, 경로 응답 변환과 안내 상태를 연결했습니다." },
            { title: "안내·접근성", text: "경로 진행 상태와 음성 안내(TTS), 글자 크기 공통 설정과 즉시 적용을 구현했습니다." },
          ]} />
          <p>지도·검색·경로·안내 코드와 각 계층의 테스트, 기능 시연까지 남았습니다. 다음에는 지도 연결→응답 변환→화면 표시→통합 테스트 순으로 변경을 나누고, 실제 API 예시와 테스트 데이터의 차이를 자동으로 검사하겠습니다.</p>
          <p className={styles.inlineLinks}><ExternalLink href={youtube.route}>경로 탐색 시연</ExternalLink><ExternalLink href={youtube.fontSize}>글자 크기 시연</ExternalLink><ExternalLink href={youtube.report}>제보 기능 시연</ExternalLink></p>
        </CaseSection>

        <CaseSection id="action" label="회고 03 / 인증과 상태 복구" title="인증과 계정 상태의 복구 처리를 공통 흐름으로 모았습니다.">
          <p>Google 로그인은 ID token 검증 방식으로 연결한 다음 날, AccessToken으로 사용자 정보를 조회하는 계약으로 프론트엔드와 서버 코드를 함께 변경했습니다. 이어 인증이 만료되면 세션을 갱신하고 원래 요청을 한 번만 다시 보내는 공통 처리 계층을 추가했습니다.</p>
          <p>로그아웃 뒤에는 이전 사용자의 장소·출발지·목적지·미전송 제보가 남지 않도록 계정별 저장 정보를 정리했습니다. 북마크도 서버 저장 결과를 기준으로 바꾸고 로컬 임시 저장 경로를 제거했습니다.</p>
          <EvidenceList items={[
            { title: "인증 복구", text: "세션 재발급, 갱신, 원 요청 1회 재시도와 재인증 실패 처리를 한 계층에 모았습니다." },
            { title: "계정 격리", text: "로그아웃 때 계정에 묶인 장소·경로·제보 정보를 저장소 단위로 정리했습니다." },
            { title: "저장 일관성", text: "북마크는 서버 응답을 기준으로 삼아 화면과 저장소가 다른 결과를 갖는 경로를 줄였습니다." },
          ]} />
          <p>인증 갱신과 요청 재시도, 계정 전환 시 저장 정보 정리를 테스트로 남겼습니다. 다음에는 로그인 수단별 전달 값·서버 검증 방식·갱신 책임을 한 장의 계약표로 먼저 맞추고, 만료·갱신 실패·로그아웃·다른 계정 재로그인을 공통 테스트 시나리오로 운영하겠습니다.</p>
        </CaseSection>

        <CaseSection id="collaboration" label="API·인계 / Collaboration" title="기능별 API 연동 조건과 음성 기능의 인계 내용을 정리했습니다.">
          <p>대중교통 API 사용 약정에는 E102 대표로 서명했고, 앱 기능별 API 요청·응답 조건은 백엔드와 직접 합의했습니다. 이 조건을 프론트엔드의 경로 데이터와 길안내 동작에 연결하고, 구현 변화에 맞춰 기획·화면·기능 문서를 갱신했습니다.</p>
          <p>음성 기능에서는 받아쓴 문장을 앱 동작으로 바꾸는 규칙 기반 프론트엔드와 테스트를 만들었습니다. 장소 분석과 앱 제어의 역할, 추가 연동 대상 API를 인계 문서에 구분해 적었습니다.</p>
          <EvidenceList items={[
            { title: "음성 기능 기반", text: "음성 명령을 화면 이동·장소 검색·제보 열기 같은 앱 동작으로 바꾸고 실패 시 대체 흐름을 만들었습니다." },
            { title: "승인 제보", text: "승인된 제보를 별도 마커와 상세 화면으로 보여 주고 API 응답과 지도 상태를 맞췄습니다." },
            { title: "문서 동기화", text: "기획·화면·기능 명세와 인계 문서를 실제 화면 상태와 요청·응답 형식에 맞춰 갱신했습니다." },
          ]} />
        </CaseSection>

        <CaseSection id="result" label="구현 결과 / Output" title="현장 요구부터 앱 기반, 실제 API와 복구 흐름까지 하나의 흐름으로 연결했습니다.">
          <EvidenceList items={[
            { title: "제품 기준", text: "기관 연락·인터뷰 진행, 결과 보고서와 PRD, 안전/최단 경로·접근성·음성 보조 원칙을 남겼습니다." },
            { title: "동작하는 구조", text: "Android 기반, 초기 설정 저장, Kakao 지도·검색, 경로 응답 변환, 길안내·음성, 인증 복구와 계정별 저장 정보 정리를 구현했습니다." },
            { title: "확장 접점", text: "글자 크기, 승인 제보 지도 표시, 북마크 일관성, 음성 기능 기반과 API·인계 문서를 실제 흐름에 연결했습니다." },
          ]} />
          <p>기능 시연과 테스트 코드까지 남겼습니다. 자동 테스트 실행은 환경 오류로 중단됐습니다. 실제 이동 환경의 경로 선택·GPS 오차·네트워크 단절·음성 안내는 현장 검증 과제입니다.</p>
          <p className={styles.inlineLinks}><ExternalLink href={youtube.appDemo}>앱 기능 요약 영상</ExternalLink><ExternalLink href={youtube.playlist}>8개 영상 플레이리스트</ExternalLink></p>
        </CaseSection>

        <CaseSection id="learning" label="다음 프로젝트에 적용할 것 / Reflection" title="다음에는 ‘구현됨’과 ‘검증됨’을 더 일찍 나누어 관리하겠습니다.">
          <p>다음 프로젝트에서는 외부 연동의 요청·응답 형식과 완료 기준을 개발 전에 합의하고, 코드 작성·테스트·시연·현장 검증을 각각 다른 완료 상태로 관리하겠습니다.</p>
          <EvidenceList items={[
            { title: "연동표 먼저", text: "API별 요청·응답 예시, 인증 방식, 오류 처리 책임을 한 장에 모으고 같은 예시 데이터로 연결 테스트를 시작합니다." },
            { title: "작게 통합", text: "외부 서비스 연결, 응답 변환, 화면 표시, 통합 테스트를 순서대로 나눠 검토하고 장애 원인을 좁힙니다." },
            { title: "현장에서 검증", text: "기기·OS·실제 경로와 함께 GPS 오차, 네트워크 단절, 경로 재탐색, 음성 재생 충돌을 기록합니다." },
          ]} />
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
            </ul>
          </details>
        </CaseSection>
      </CaseBody>
    </>
  );
}

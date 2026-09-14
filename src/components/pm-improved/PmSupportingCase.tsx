import Image from "next/image";
import { type PmProject } from "./content";
import {
  BusanAdditionalVisual,
  BusanOnboardingVisual,
  ProjectVisual,
  SmileTeamDemoVisual,
} from "./PmVisuals";
import {
  CaseBody,
  CaseHero,
  CaseSection,
  EvidenceList,
  NextProject,
} from "./PmCaseStudy";
import base from "./pm.module.css";
import detail from "./caseStudy.module.css";
import visual from "./visuals.module.css";

function SmileCase({ project }: { project: PmProject }) {
  return <>
    <CaseHero project={project} />
    <figure className={detail.mediaEvidence}>
      <ProjectVisual slug="smile-game" />
      <figcaption>설문 보고서·구현 기록 기반</figcaption>
    </figure>
    <CaseBody labels={{ collaboration: "역할 분담", result: "구현 결과" }}>
      <CaseSection id="problem" title="재미있다는 반응만으로 참여를 기대하기 어려웠습니다.">
        <p>웃지마게임은 얼굴을 보이며 웃음을 참는 실시간 화상 대결입니다. 아이디어에 흥미를 느끼는 것과 실제로 카메라를 켜고 참여하는 것은 다른 문제였습니다.</p>
        <p>저는 참여 장벽을 분리해 확인하기 위해 흥미, 이용 의향, 얼굴 노출 부담을 각각 묻는 설문을 설계하고 응답 168건을 분석했습니다.</p>
      </CaseSection>

      <CaseSection id="evidence" title="흥미, 참여 의향, 얼굴 노출 부담을 각각 확인했습니다.">
        <EvidenceList items={[
          { title: "흥미", text: "서비스가 흥미롭다고 답한 응답은 92/168명이었습니다." },
          { title: "참여 의향", text: "해볼 의향이 있다고 답한 응답은 75/168명이었습니다." },
          { title: "얼굴 공개 부담", text: "‘꽤’ 또는 ‘매우’ 부담된다는 응답은 112/168명, 66.7%였습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="decision" title="팀은 친구 초대를 우선하고 랜덤 매칭도 유지했습니다.">
        <p>팀 논의를 통해 아는 사람과 시작할 수 있는 친구 초대 흐름을 우선 개발하고, 랜덤 매칭도 함께 제공하기로 결정했습니다. 저는 설문 분석 결과와 결정 내용을 기획서·기능명세·회의 기록에 반영했습니다.</p>
      </CaseSection>

      <CaseSection id="action" title="결정 기록과 친구 초대방 흐름을 구현으로 남겼습니다.">
        <EvidenceList items={[
          { title: "조사·분석", text: "168건의 설문 응답을 문항별로 분석해 참여 부담과 기능 요구를 정리했습니다." },
          { title: "결정 기록", text: "기획서, 기능명세, 회의록에 매칭 우선순위와 필수 흐름을 반영했습니다." },
          { title: "초대방 구현", text: "방 생성·입장·대기 화면을 구현하고, 초대한 상대가 보이지 않는 문제와 통신 연동 오류를 수정했습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="collaboration" label="역할 분담 / Role split" title="역할 분담">
        <EvidenceList items={[
          { title: "내 담당", text: "설문 설계·분석, 결정 기록, 친구 초대방 생성·입장·대기 화면 구현" },
          { title: "팀원 담당", text: "웃음 판정 모델·배틀 연동" },
        ]} />
      </CaseSection>

      <CaseSection id="result" label="구현 결과 / Output" title="조사 근거와 친구 초대방 구현 결과를 남겼습니다.">
        <p>사전 설문 분석과 기획·기능명세의 결정 기록, 친구 초대방 생성·입장·대기 화면을 산출물로 남겼습니다.</p>
        <figure className={detail.mediaEvidence}>
          <SmileTeamDemoVisual />
          <figcaption>팀 서비스 시연 · 랜덤 매칭</figcaption>
        </figure>
      </CaseSection>

      <CaseSection id="learning" title="반응과 실제 참여 조건을 분리해서 물어야 했습니다.">
        <p>‘재미있다’는 반응과 카메라를 켜고 참여할 의향을 별도로 묻고, 참여 부담까지 함께 살펴 팀이 시작 방식의 우선순위를 정할 수 있도록 근거를 나눠 제시했습니다.</p>
      </CaseSection>
    </CaseBody>
  </>;
}

function BusanCase({ project }: { project: PmProject }) {
  return <>
    <CaseHero project={project} />
    <figure className={detail.mediaEvidence}>
      <ProjectVisual slug="busan-eumgil" />
      <figcaption>기여 요약</figcaption>
    </figure>
    <CaseBody labels={{
      problem: "기획",
      evidence: "지도 개발",
      decision: "추가 구현",
      action: "주요 산출물",
      collaboration: "역할 분담",
      result: "팀 결과",
    }}>
      <CaseSection id="problem" label="초기 기획·인터뷰 / Planning" title="처음부터 기획하고, 현장 인터뷰로 MVP 범위를 정했습니다.">
        <p>부산이음길의 초기 서비스 기획을 맡았습니다. 기획을 구체화하기 위해 함세상 장애인자립생활센터를 직접 섭외하고, 2026년 4월 10일 미팅·인터뷰를 진행했습니다. 그 내용을 바탕으로 MVP 범위를 선정했습니다.</p>
        <figure className={detail.mediaEvidence}>
          <div className={visual.meetingEvidence}>
            <Image
              src="/pm-improved/evidence/busan-mvp-meeting.png"
              alt="MVP 지도 기능을 화면으로 설명하고 참석자들과 의견을 나누는 미팅 장면"
              width={1920}
              height={1080}
              sizes="(max-width: 767px) 100vw, 800px"
            />
          </div>
          <figcaption>MVP 기능을 설명하고 의견을 나눈 미팅 현장</figcaption>
        </figure>
        <EvidenceList items={[
          { title: "경로 비교", text: "여러 경로 선택지와 경사·계단·폭 같은 위험 정보를 확인하려는 요구를 경로 비교·상세·안내 흐름으로 연결했습니다." },
          { title: "사용자 이동 조건", text: "이동 보조기기마다 조건이 다르다는 의견을 사용자 유형 온보딩으로 반영했습니다." },
          { title: "접근성 시설 탐색", text: "화장실·충전기·건물 접근성 정보에 대한 요구를 접근성 필터와 시설 상세 탐색으로 연결했습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="evidence" label="지도 개발 / Map development" title="길안내 지도 화면과 마커 고정 동작을 구현했습니다.">
        <p>보행약자가 목적지와 이동 정보를 확인하는 길안내 지도 화면을 개발했습니다. 지도 위 선택 핀의 고정 렌더링과 카메라 제스처 동기화를 포함한 관련 프론트엔드 작업을 맡았습니다.</p>
        <figure className={detail.mediaEvidence}>
          <div className={visual.routeMapEvidence}>
            <Image
              src="/pm-improved/evidence/busan-route-map.png"
              alt="접근성 시설과 최근 목적지를 표시하는 부산이음길 지도 화면"
              width={720}
              height={1560}
              sizes="(max-width: 767px) 88vw, 560px"
            />
          </div>
          <figcaption>지도 화면 캡처 · 시설 탐색과 최근 목적지</figcaption>
        </figure>
      </CaseSection>

      <CaseSection id="decision" label="추가 구현 / Additional work" title="접근성 설정과 제보 표시도 구현했습니다.">
        <p>글자 크기를 선택하면 즉시 저장·적용되도록 구현하고, 승인된 사용자 제보를 접근성 시설과 구분해 지도에 표시했습니다. 제보를 선택하면 내용을 확인하는 하단 패널로 연결했습니다.</p>
        <figure className={detail.mediaEvidence}>
          <BusanAdditionalVisual />
          <figcaption>구현 기준 요약 · 글자 크기 설정과 승인된 제보의 표시 기준</figcaption>
        </figure>
      </CaseSection>

      <CaseSection id="action" label="주요 산출물 / Outputs" title="초기 기획과 MVP 선정, 지도 화면 개발을 산출물로 남겼습니다.">
        <EvidenceList items={[
          { title: "초기 기획·기관 인터뷰", text: "서비스를 기획하고 함세상 장애인자립생활센터를 섭외해 회의·인터뷰를 진행했습니다." },
          { title: "MVP 선정", text: "인터뷰에서 확인한 이동 조건을 경로 비교, 사용자 유형 온보딩, 접근성 시설 탐색 범위로 연결했습니다." },
          { title: "지도 프론트엔드", text: "길안내 지도 화면과 마커 고정 동작을 구현했습니다." },
          { title: "추가 구현", text: "글자 크기 설정, 승인된 제보 표시, 관련 명세 관리를 맡았습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="collaboration" label="역할 분담 / Role split" title="역할 분담">
        <EvidenceList items={[
          { title: "내 담당", text: "초기 서비스 기획, 함세상 장애인자립생활센터 섭외·회의·인터뷰, MVP 선정, 길안내 지도·마커 고정 동작을 포함한 프론트엔드 개발, 접근성 설정·승인 제보 표시·명세 관리" },
          { title: "팀원 담당", text: "경로 탐색과 공간 데이터 개발" },
        ]} />
      </CaseSection>

      <CaseSection id="result" label="팀 결과 / Team output" title="팀이 완성한 서비스의 온보딩 흐름입니다.">
        <figure className={detail.mediaEvidence}>
          <BusanOnboardingVisual />
          <figcaption>팀 서비스 시연 · 온보딩</figcaption>
        </figure>
      </CaseSection>

      <CaseSection id="learning" title="초기 기획부터 인터뷰와 화면 구현을 한 흐름으로 연결했습니다.">
        <p>처음 세운 서비스 방향을 기관 인터뷰로 구체화하고, 그 내용을 MVP 범위와 길안내 지도 화면 구현으로 연결했습니다.</p>
      </CaseSection>
    </CaseBody>
  </>;
}

export function PmSupportingCase({ project }: { project: PmProject }) {
  return <main id="pm-content" tabIndex={-1} className={base.container}>
    {project.slug === "smile-game" ? <SmileCase project={project} /> : <BusanCase project={project} />}
    <NextProject project={project} />
  </main>;
}

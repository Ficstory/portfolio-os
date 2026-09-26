import { survey, type PmProject } from "./content";
import {
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
import { PmBusanCase } from "./PmBusanCase";
import base from "./pm.module.css";
import detail from "./caseStudy.module.css";

function SmileCase({ project }: { project: PmProject }) {
  const burdenCount = survey.responses[0].count + survey.responses[1].count;

  return <>
    <CaseHero project={project} />
    <figure className={detail.mediaEvidence}>
      <ProjectVisual slug="smile-game" />
      <figcaption>설문 보고서·구현 기록 기반</figcaption>
    </figure>
    <CaseBody labels={{
      problem: "문제 정의 / Problem",
      evidence: "사용자 근거 / Evidence",
      decision: "사례 1·범위 판단 / Scope",
      action: "사례 2·초대 여정 / Invite flow",
      collaboration: "사례 3·실시간 상태 / Realtime state",
      result: "사례 3·오류 복구 / Failure UX",
      learning: "회고 정리 / Reflection",
    }}>
      <CaseSection id="problem" title="재미있다는 반응과 카메라를 켤 의향은 같지 않았습니다.">
        <p>웃지마게임은 얼굴을 보며 웃음을 참는 실시간 화상 대결입니다. 초기 아이디어의 재미와 별개로, 얼굴 노출과 무단 저장에 대한 부담이 실제 참여를 막을 수 있는지 확인해야 했습니다.</p>
        <p>PM·프론트엔드 역할로 설문 문항을 작성하고 {survey.total}건의 응답을 분석했습니다. 6차례 회의에서 의제·결정·리스크를 기록하고, 최종 기획서·16쪽 기능 명세·발표 자료를 제작했습니다. 프론트엔드에서는 친구 초대와 카메라 오류 경험을 구현했습니다.</p>
      </CaseSection>

      <CaseSection id="evidence" title="흥미도와 실제 참여 조건을 나눠 보았습니다.">
        <EvidenceList items={[
          { title: "흥미", text: `서비스가 흥미롭다고 답한 응답은 ${survey.signals.interest}/${survey.total}명이었습니다.` },
          { title: "참여 의향", text: `해볼 의향이 있다고 답한 응답은 ${survey.signals.willingToParticipate}/${survey.total}명이었습니다.` },
          { title: "얼굴 공개 부담", text: `‘꽤’ 또는 ‘매우’ 부담된다고 답한 응답은 ${burdenCount}/${survey.total}명이었습니다.` },
          { title: "무단 저장 우려", text: `분석 보고서에는 무단 녹화·유포를 우려한 응답도 111/${survey.total}명으로 기록됐습니다.` },
        ]} />
        <p>흥미와 참여 의향의 간격, 얼굴 공개 부담을 함께 제시해 초기 기능 우선순위를 논의하는 근거로 사용했습니다.</p>
      </CaseSection>

      <CaseSection id="decision" label="사례 1 / Survey to scope" title="설문 권고와 최종 기능 범위를 구분해 남겼습니다.">
        <p>설문 분석에서는 친구 방과 안전 장치를 우선순위로 제안하고 랜덤 매칭을 첫 버전의 제외 범위로 분류했습니다. 이후 회의에서 확정된 최종 범위에는 랜덤 매칭과 친구 방이 모두 포함됐습니다.</p>
        <p>이 범위 변화를 회의 기록과 최종 기획서에 반영하고, 기능 명세에 화면 흐름·예외·목표 비기능 요구사항·QA 체크리스트를 정리했습니다.</p>
        <p>다음에는 설문마다 바꾸려는 제품 결정을 먼저 적고, 원래 가설·관찰·최종 범위·변경 이유·재검토일을 하나의 decision log로 연결하겠습니다.</p>
      </CaseSection>

      <CaseSection id="action" label="사례 2 / Invite journey" title="초대 코드와 로그인 복귀를 이어 친구 방 입장까지 연결했습니다.">
        <p>친구 방은 화면 하나보다 긴 사용자 여정이었습니다. 초대받은 사용자가 로그인하지 않은 상태로 링크를 열어도 초대 코드를 보존하고, 인증을 마친 뒤 원래 방으로 돌아와 참여하도록 프론트엔드 흐름을 구성했습니다.</p>
        <EvidenceList items={[
          { title: "초대 맥락 보존", text: "초대 코드가 담긴 경로와 로그인 이후의 복귀 경로를 연결했습니다." },
          { title: "방 입장 흐름", text: "방 생성·참여 응답의 식별자를 다음 화면으로 넘겨 초대, 입장, 대기 화면이 이어지게 했습니다." },
          { title: "구현 결과", text: "방 생성, 초대 코드, 인증 복귀, 참여 요청과 대기 화면 이동을 하나의 흐름으로 구현했습니다." },
        ]} />
        <p>다음에는 로그인 여부, 코드 유효성, 참여 여부와 재접속의 조합을 먼저 만들고 각 경로의 화면·API 결과를 완료 조건에 연결하겠습니다.</p>
      </CaseSection>

      <CaseSection id="collaboration" label="사례 3A / Realtime state" title="REST, STOMP, 미디어 연결 사이의 상태 어긋남을 수정했습니다.">
        <p>첫 통합 뒤에는 참가자 입장 이벤트가 와도 상대가 보이지 않거나 중복될 수 있었고, 소켓 콜백이 오래된 사용자 ID를 참조했습니다. 대기 화면에서는 OpenVidu 연결 책임과 Ready·시작 권한도 겹쳐 있었습니다.</p>
        <EvidenceList items={[
          { title: "참가자 식별", text: "소켓 콜백이 최신 사용자 ID를 참조하도록 바꾸고 참가자 입장의 누락·중복을 보완했습니다." },
          { title: "Ready 규칙", text: "방장은 준비 상태를 유지하고 참여자는 Ready를 전환하며, 시작 요청은 방장만 보내도록 상태 전이를 정리했습니다." },
          { title: "연결 책임", text: "대기 화면의 중복 OpenVidu 연결을 제거해 실시간 대기 상태와 미디어 세션의 책임을 분리했습니다." },
        ]} />
        <p>다음에는 이벤트 출처와 권한 주체를 상태 머신으로 먼저 정의하고, 중복 이벤트와 순서 역전을 테스트하겠습니다.</p>
      </CaseSection>

      <CaseSection id="result" label="사례 3B / Failure UX" title="카메라 실패를 사용자가 이해할 수 있는 안내로 바꿨습니다.">
        <p>권한 거부, 장치 미발견, 다른 프로그램의 장치 점유, 보안 정책 오류를 서로 다른 메시지로 분류하고 미디어 로드 실패 상태에 연결했습니다. 카메라 미리보기와 공통 화면도 뷰포트에 맞게 조정했습니다.</p>
        <p>다음에는 원인 설명, 사용자가 취할 행동, 재시도 동작을 하나의 완료 조건으로 정의하고 오류별 재현 결과를 남기겠습니다.</p>
        <figure className={detail.mediaEvidence}>
          <SmileTeamDemoVisual />
          <figcaption>최종 서비스 시연 자료 · 랜덤 매칭 화면</figcaption>
        </figure>
      </CaseSection>

      <CaseSection id="learning" title="근거, 결정, 구현과 검증을 하나의 흐름으로 보겠습니다.">
        <p>다음에는 설문에서 바뀐 결정의 이유와 초대·대기·카메라 오류의 완료 기준을 같은 기록에 묶겠습니다.</p>
        <p>초대·대기·카메라 오류 사례에서 기록으로 확인되는 범위는 화면·상태 구현과 명세까지입니다. 초대 코드 만료·재연결·기기별 카메라 복구는 다음 검증 항목입니다.</p>
      </CaseSection>
    </CaseBody>
  </>;
}

export function PmSupportingCase({ project }: { project: PmProject }) {
  return <main id="pm-content" tabIndex={-1} className={base.container}>
    {project.slug === "smile-game" ? <SmileCase project={project} /> : <PmBusanCase project={project} />}
    <NextProject project={project} />
  </main>;
}

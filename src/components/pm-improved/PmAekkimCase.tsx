import { selectedProjects, type PmProject } from "./content";
import { AekkimVisual, SubscriptionFlow } from "./PmVisuals";
import {
  CaseBody,
  CaseHero,
  CaseSection,
  EvidenceList,
  NextProject,
} from "./PmCaseStudy";
import base from "./pm.module.css";
import detail from "./caseStudy.module.css";

export function PmAekkimCase() {
  const project = selectedProjects.find((item) => item.slug === "aekkim");
  if (!project) return null;

  const caseProject: PmProject = {
    ...project,
    subtitle: "카드 결제 내역과 기기 내 앱 사용 정보를 분석해 놓치기 쉬운 구독을 찾고, 비용·결제일·혜택·알림을 한곳에서 관리하는 6인 팀 프로젝트입니다.",
    role: "팀장·프로젝트 총괄 · 요구사항·화면 명세 · Android 프론트엔드 기반과 기능 통합",
    actions: [
      "요구사항과 화면 명세를 구현 변화에 맞춰 반복 개정하고 Android 앱의 기반 구조를 잡았습니다.",
      "인증·약관·권한, 구독 CRUD, 알림·FCM, 체크인·프로모션의 화면 상태와 API를 연결했습니다.",
      "결제 내역·앱 사용량·규칙·서버 조회·온디바이스 AI 결과를 후보 확인 화면으로 전달하는 분석 흐름을 구현했습니다.",
      "중복·재진입·부분 실패를 처리하는 상태 로직과 계약 테스트 코드를 추가하고 회귀 테스트 계획을 작성했습니다.",
    ],
    result: "요구사항·화면 명세, Android 기반, 주요 기능의 화면·API 연결, 분석 파이프라인 연동, 실패 상태 보완, 테스트 코드와 QA 계획을 남겼습니다.",
    strengths: ["요구사항과 구현 정합성", "비동기 상태 설계", "분석 파이프라인 통합"],
  };

  return <main id="pm-content" tabIndex={-1} className={base.container}>
    <CaseHero project={caseProject} />
    <figure className={detail.mediaEvidence}>
      <AekkimVisual compact />
      <figcaption>구독 관리 화면 데모 · 오프라인 · 예시 데이터 사용</figcaption>
    </figure>

    <CaseBody labels={{
      problem: "맡은 범위",
      evidence: "사례 1 · 인증",
      decision: "사례 2 · 상태",
      action: "사례 3 · 분석",
      collaboration: "문서·QA",
      result: "산출물·한계",
      learning: "다음 개선",
    }}>
      <CaseSection id="problem" label="맡은 범위 / Scope" title="기능이 늘어날수록 문서, API, 화면 상태가 같은 기준을 보게 만드는 일이 필요했습니다.">
        <p>저는 팀장·프로젝트 총괄과 Android 프론트엔드 개발을 맡았습니다. 초기 앱 구조와 화면 원형을 만든 뒤, 요구사항과 화면 명세를 실제 구현에 맞춰 개정했습니다. 개발 범위도 인증·약관·권한, 구독 조회·등록·수정·삭제, 후보 확인, 알림·FCM, 체크인, 프로모션, 분석 결과 연결까지 넓어졌습니다.</p>
        <p>각 기능을 따로 붙이는 것보다 사용자가 다시 들어오거나 요청 일부가 실패했을 때도 앞뒤 상태가 맞는지가 더 큰 과제였습니다. 아래 세 사례는 그 과정에서 제가 직접 선택하고 구현한 판단을 중심으로 정리했습니다.</p>
      </CaseSection>

      <CaseSection id="evidence" label="사례 1 / 인증과 온보딩" title="로그인 제공자별 인증을 공통 세션·가입 흐름으로 연결했습니다.">
        <p>초기 인증 코드는 특정 로그인 제공자의 요청 형식에 묶여 있었습니다. Google Credential Manager가 추가된 뒤에도 토큰 교환, 약관 저장, 권한 요청은 같은 가입 흐름 안에서 일관된 순서로 처리해야 했습니다.</p>
        <p>제공자별 인증 정보는 공통 형식으로 받고, 백엔드 세션으로 교환하는 계약은 하나로 묶었습니다. 그 위에 Google 로그인 실행과 오류 처리, 토큰 세션 저장, 약관 동의, 권한 요청을 같은 화면 상태 흐름으로 연결했습니다. 이렇게 하면 로그인 제공자가 달라도 이후 세션 처리를 다시 만들지 않아도 됐습니다.</p>
      </CaseSection>

      <CaseSection id="decision" label="사례 2 / 비동기 상태" title="성공과 실패 사이에 있는 중복, 재진입, 되돌리기를 화면 상태로 다뤘습니다.">
        <p>구독 후보를 제외한 뒤 저장소가 같은 데이터를 다시 내보내면 제외한 항목이 살아났고, 체크인은 이미 제출한 요청과 일반 실패를 구분해야 했습니다. 알림 삭제는 화면에서 먼저 사라진 항목이 서버 실패 뒤에도 복구되지 않을 수 있었고, FCM 토큰은 한 번의 동기화 실패로 알림 연결이 끊길 수 있었습니다.</p>
        <p>후보 확인에는 같은 분석 결과를 다시 주입하지 않는 기준값을 두고 제외 상태와 남은 건수를 맞췄습니다. 체크인은 성공·이미 제출됨·실패를 서로 다른 결과로 처리하고 재시도 조건을 연결했습니다. 알림 삭제는 먼저 화면에 반영하되 실패하면 복원하도록 했고, FCM 토큰 전송에는 간격을 늘려 가는 재시도를 추가했습니다.</p>
        <p>중복 제출·후보 재생성·알림 삭제 실패에 대응하는 상태 처리를 구현했습니다. 체크인의 일부는 시연 동작으로 확인했습니다.</p>
      </CaseSection>

      <CaseSection id="action" label="사례 3 / 분석 파이프라인" title="서로 다른 분석 결과를 하나의 검토 가능한 구독 후보로 모았습니다.">
        <p>결제 내역만으로는 구독 여부와 서비스 이름을 모두 확정하기 어려웠습니다. 앱 사용 정보, 서비스 목록, 규칙 기반 분류, 서버 조회, 온디바이스 AI 결과가 서로 다른 시점과 형식으로 들어왔고, 어느 단계가 실패해도 사용자가 확인할 후보는 남겨야 했습니다.</p>
        <p>결제 내역을 불러온 뒤 서비스 목록과 앱 사용 정보를 결합하고, 정규화·규칙 판단·서버 일괄 조회·AI와 대체 경로를 순서대로 실행하는 조정 로직을 구현했습니다. 결과는 중복을 제거한 뒤 후보 확인 화면으로 넘겼고, 서비스가 정해지지 않은 결제는 사용자가 직접 연결할 수 있게 했습니다. AI 응답은 허용된 서비스 ID와 JSON 형식을 검사하는 계약 및 파서 테스트 코드로 보완했습니다.</p>
        <SubscriptionFlow />
        <p>절감 예상값은 가정과 상한을 적용한 추정치입니다.</p>
      </CaseSection>

      <CaseSection id="collaboration" label="문서와 QA / Delivery" title="변하는 구현을 요구사항과 화면 명세에 다시 반영하고, 확인할 시나리오를 남겼습니다.">
        <p>기능 개발과 함께 요구사항, 화면 이름, 진입 조건, 빈 상태와 오류 상태를 현재 코드 기준으로 반복 수정했습니다. 후반에는 인증부터 분석, 구독, 혜택, 알림, 체크인까지 이어지는 회귀 테스트 시나리오와 심각도, 수정 반복 절차, 종료 기준을 QA 계획으로 정리했습니다.</p>
        <p>온디바이스 응답 계약·대시보드 계산 테스트 코드와 QA 계획을 작성했습니다. QA 실행 결과표는 비어 있으며, 사용자 검증 기록은 확인되지 않습니다.</p>
      </CaseSection>

      <CaseSection id="result" label="남긴 산출물과 한계 / Output" title="요구사항·화면 명세와 프론트엔드 상태를 제품 흐름으로 연결했습니다.">
        <EvidenceList items={[
          { title: "제품 기준", text: "구현 변화에 맞춰 요구사항·화면 명세를 개정하고 인계 문서를 정리했습니다." },
          { title: "앱 구현", text: "인증·권한, 구독 CRUD, 후보 확인, 알림·FCM, 체크인, 프로모션의 화면 상태와 API를 연결했습니다." },
          { title: "분석 연결", text: "결제·앱 사용 정보와 규칙·서버 조회·AI 결과를 후보 검토로 전달하고 계약 테스트를 추가했습니다." },
          { title: "검증 준비", text: "온디바이스 응답 계약과 대시보드 계산 테스트, 기능별 회귀 테스트 계획을 작성했습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="learning" label="다음 개선 / Reflection" title="경계 기능의 계약과 실행 증거를 함께 남기겠습니다">
        <p>제공자별 인증을 공통 세션·가입 흐름으로 묶었습니다. 다음 프로젝트에서는 정상·취소·만료 응답을 예시 데이터로 먼저 고정하고, 화면 구현 전에 계약 테스트를 작성하겠습니다.</p>
        <p>후보 재생성, 체크인 중복, 알림 삭제 실패를 다루며 요청 결과와 화면 상태를 함께 맞췄습니다. 다음에는 재진입·중복·복원을 기능별 완료 조건으로 적고, 분석 단계마다 입력·출력과 실패 시 대체 경로를 짧은 결정 기록으로 남기겠습니다.</p>
        <p>QA 계획에는 회귀 시나리오와 종료 기준을 정리했습니다. 다음에는 기기·빌드별 실행 결과와 남은 제한을 계획 옆에 기록해, 작성한 테스트와 실제 실행 상태를 구분하겠습니다.</p>
      </CaseSection>
    </CaseBody>
    <NextProject project={project} />
  </main>;
}

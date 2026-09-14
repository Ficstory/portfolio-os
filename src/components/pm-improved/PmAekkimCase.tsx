import { selectedProjects } from "./content";
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

  return <main id="pm-content" tabIndex={-1} className={base.container}>
    <CaseHero project={project} />
    <figure className={detail.mediaEvidence}>
      <AekkimVisual compact />
      <figcaption>구독 관리 화면 데모 · 오프라인 · 예시 데이터 사용</figcaption>
    </figure>

    <CaseBody labels={{ collaboration: "역할 분담", result: "구현 결과" }}>
      <CaseSection id="problem" label="구독 등록 흐름" title="결제 내역에서 찾은 후보를 확인해 등록했습니다.">
        <p>결제 내역에서 구독으로 추정되는 항목을 찾고, 사용자가 확인한 항목을 앱의 구독 목록에 등록합니다.</p>
        <p>후보에는 구독이 아닌 결제와 서비스 정보가 부족한 항목도 있어, 등록 전 사용자가 확인하고 제외할 수 있는 흐름을 만들었습니다.</p>
      </CaseSection>

      <CaseSection id="evidence" title="후보별 상태에 맞는 확인 흐름이 필요했습니다.">
        <EvidenceList items={[
          { title: "감지된 후보", text: "서비스가 식별된 결제를 사용자 확인 뒤 등록합니다." },
          { title: "제외한 후보", text: "구독이 아니라고 판단한 항목은 등록 대상에서 뺍니다." },
          { title: "미확인 결제", text: "서비스 정보가 부족한 항목은 수동 매핑으로 넘깁니다." },
        ]} />
      </CaseSection>

      <CaseSection id="decision" title="후보 확인과 등록 요청을 나눴습니다.">
        <p>감지된 후보를 먼저 확인하고 제외할 항목을 고른 뒤, 서비스가 정해지지 않은 결제는 수동 매핑으로 넘겼습니다. 남은 대상만 등록 요청으로 연결했습니다.</p>
        <SubscriptionFlow />
      </CaseSection>

      <CaseSection id="action" title="후보 확인 화면과 표시 상태를 구현했습니다.">
        <EvidenceList items={[
          { title: "초기 확인 화면", text: "분석 결과가 없을 때의 빈 상태와 안내, 구독 후보 목록의 기본 UI를 구현했습니다." },
          { title: "후보 제외", text: "사용자가 고른 제외 상태를 화면에 반영하고, 남은 후보를 구분했습니다." },
          { title: "표시 정합성", text: "중복 후보 노출과 수동 확인이 필요한 결제의 남은 건수 표시를 수정했습니다." },
          { title: "명세 갱신", text: "지원 범위, 빈 상태·오류 상태, 화면 진입과 이동 조건을 현재 구현에 맞춰 정리했습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="collaboration" label="역할 분담" title="내 담당과 팀원 담당">
        <EvidenceList items={[
          { title: "내 담당", text: "후보 확인 초기 UI, 제외 상태, 중복 후보와 남은 건수 표시, 요구사항·화면 명세를 맡았습니다." },
          { title: "팀원 담당", text: "김응서 팀원이 구독 등록 요청과 실패 처리를, 박규빈 팀원이 번들 보완을 맡았습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="result" label="구현 결과" title="구독 확인 화면과 등록 흐름을 완성했습니다.">
        <p>구독 확인 화면의 초기 UI와 상태 수정, 요구사항·화면 명세를 남겼습니다. 팀은 Android MVP를 완성해 프로젝트 우수상을 받았습니다.</p>
      </CaseSection>

      <CaseSection id="learning" title="화면의 건수는 처리 대상과 같은 기준으로 계산해야 했습니다.">
        <p>화면에 보이는 상태·개수와 요청 대상을 같은 기준으로 정리했습니다. 중복 후보와 남은 결제 건수도 현재 동작 기준으로 맞췄습니다.</p>
      </CaseSection>
    </CaseBody>
    <NextProject project={project} />
  </main>;
}

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
  const burdenPercent = (burdenCount / survey.total * 100).toFixed(1);

  return <>
    <CaseHero project={project} />
    <figure className={detail.mediaEvidence}>
      <ProjectVisual slug="smile-game" />
      <figcaption>설문 보고서·구현 기록 기반</figcaption>
    </figure>
    <CaseBody labels={{ collaboration: "역할 분담", result: "구현 결과" }}>
      <CaseSection id="problem" title="재미있다는 반응만으로 참여를 기대하기 어려웠습니다.">
        <p>웃지마게임은 얼굴을 보이며 웃음을 참는 실시간 화상 대결입니다. 아이디어에 흥미를 느끼는 것과 실제로 카메라를 켜고 참여하는 것은 다른 문제였습니다.</p>
        <p>저는 참여 장벽을 분리해 확인하기 위해 흥미, 이용 의향, 얼굴 노출 부담을 각각 묻는 설문을 설계하고 응답 {survey.total}건을 분석했습니다.</p>
      </CaseSection>

      <CaseSection id="evidence" title="흥미, 참여 의향, 얼굴 노출 부담을 각각 확인했습니다.">
        <EvidenceList items={[
          { title: "흥미", text: `서비스가 흥미롭다고 답한 응답은 ${survey.signals.interest}/${survey.total}명이었습니다.` },
          { title: "참여 의향", text: `해볼 의향이 있다고 답한 응답은 ${survey.signals.willingToParticipate}/${survey.total}명이었습니다.` },
          { title: "얼굴 공개 부담", text: `‘꽤’ 또는 ‘매우’ 부담된다는 응답은 ${burdenCount}/${survey.total}명, ${burdenPercent}%였습니다.` },
        ]} />
      </CaseSection>

      <CaseSection id="decision" title="팀은 친구 초대를 우선하고 랜덤 매칭도 유지했습니다.">
        <p>팀 논의를 통해 아는 사람과 시작할 수 있는 친구 초대 흐름을 우선 개발하고, 랜덤 매칭도 함께 제공하기로 결정했습니다. 저는 설문 분석 결과와 결정 내용을 기획서·기능명세·회의 기록에 반영했습니다.</p>
      </CaseSection>

      <CaseSection id="action" title="결정 기록과 친구 초대방 흐름을 구현으로 남겼습니다.">
        <EvidenceList items={[
          { title: "조사·분석", text: `${survey.total}건의 설문 응답을 문항별로 분석해 참여 부담과 기능 요구를 정리했습니다.` },
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

export function PmSupportingCase({ project }: { project: PmProject }) {
  return <main id="pm-content" tabIndex={-1} className={base.container}>
    {project.slug === "smile-game" ? <SmileCase project={project} /> : <PmBusanCase project={project} />}
    <NextProject project={project} />
  </main>;
}

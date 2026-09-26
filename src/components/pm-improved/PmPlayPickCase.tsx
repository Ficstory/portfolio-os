import { type PmProject } from "./content";
import { ProjectVisual } from "./PmVisuals";
import {
  CaseBody,
  CaseHero,
  CaseSection,
  EvidenceList,
  NextProject,
  RoleBoundary,
} from "./PmCaseStudy";
import base from "./pm.module.css";
import detail from "./caseStudy.module.css";
import styles from "./playPick.module.css";

const flow = [
  ["01", "선택", "호감·비호감만 응답 목록에 추가"],
  ["02", "저장", "공연 ID와 응답 값을 서버에 전달"],
  ["03", "완료", "저장이 성공한 뒤 온보딩 완료 처리"],
  ["04", "이동", "추천 화면에서 저장된 취향 사용"],
];

export function PmPlayPickCase({ project }: { project: PmProject }) {
  return <main id="pm-content" tabIndex={-1} className={base.container}>
    <CaseHero project={project} />
    <figure className={detail.mediaEvidence}>
      <ProjectVisual slug="play-pick" />
      <figcaption>서비스 화면 재현 데모 · 예시 데이터 사용</figcaption>
    </figure>

    <CaseBody labels={{ collaboration: "역할 분담", result: "구현 결과" }}>
      <CaseSection id="problem" title="이용 기록이 없는 사용자의 첫 추천에는 입력이 필요했습니다.">
        <p>Play Pick은 공연 정보와 사용자 취향을 연결하는 추천 웹 서비스입니다. 가입 직후에는 조회·찜·관람 기록이 없으므로, 첫 추천에 사용할 관심 정보를 별도로 받아야 했습니다.</p>
        <p>공연을 한 장씩 보여주고 호감·비호감·판단 보류를 받는 온보딩 화면을 만들었습니다. 핵심 과제는 각 행동의 의미를 데이터에 다르게 담고, 저장이 끝난 뒤에만 추천으로 이동하는 것이었습니다.</p>
      </CaseSection>

      <CaseSection id="evidence" title="세 가지 응답은 저장 규칙이 서로 달랐습니다.">
        <EvidenceList items={[
          { title: "보고싶어요", text: "호감 응답으로 공연 ID와 함께 저장 요청에 포함합니다." },
          { title: "안볼래요", text: "비호감 응답으로 저장 요청에 포함합니다." },
          { title: "모르겠어요", text: "판단 보류를 선택하면 다음 공연을 보여 줍니다. 완료 개수는 호감·비호감 응답만 셉니다." },
          { title: "완료 조건", text: "호감·비호감 응답이 8개 이상일 때 완료할 수 있습니다." },
        ]} />
        <p className={detail.compactNote}>제품 명세: 호감·비호감 응답 최소 8개</p>
      </CaseSection>

      <CaseSection id="decision" title="중립 응답을 제외하고, 저장 성공 뒤에 완료 처리했습니다.">
        <p>판단을 보류한 응답을 비선호로 오해하지 않도록 요청 데이터에서 제외했습니다. 호불호가 8개 이상 쌓이면 완료 버튼을 활성화하고, 선택 저장 → 온보딩 완료 → 추천 화면 이동 순서를 지키도록 했습니다.</p>
        <ol className={styles.flow} aria-label="온보딩 응답 저장과 완료 흐름">
          {flow.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}
        </ol>
        <RoleBoundary kind="MY ROLE">사용자의 선택 상태, 요청 데이터 변환, 저장·완료 요청 순서와 화면 이동을 프론트엔드에서 연결했습니다.</RoleBoundary>
      </CaseSection>

      <CaseSection id="action" title="화면 상태와 서버의 취향 저장 처리를 연결했습니다.">
        <EvidenceList items={[
          { title: "선택 상태", text: "현재 공연과 호불호 응답, 유효 응답 개수에 따라 진행 상태와 완료 버튼을 갱신했습니다." },
          { title: "요청 데이터", text: "공연 ID와 호감·비호감 값을 서버 요청 형식으로 바꾸고, 중립 응답은 제외했습니다." },
          { title: "저장 처리", text: "사용자의 응답을 공연 특성 데이터에 반영해 서버에 취향 정보로 저장하는 처리를 구현했습니다." },
          { title: "실패 상태", text: "저장 오류 때 현재 화면을 유지하고 오류를 표시했습니다. 저장 성공 후에만 완료 처리와 추천 이동을 실행했습니다." },
        ]} />
        <details className={base.evidenceDetails}>
          <summary>구현 세부 정보</summary>
          <div><p>화면 상태는 Pinia에서 관리했습니다. 보고싶어요는 1.5, 안볼래요는 −1.0으로 전달하고, 서버는 공연 임베딩을 가중 합산·정규화해 사용자 선호 정보로 저장합니다.</p></div>
        </details>
      </CaseSection>

      <CaseSection id="collaboration" label="역할 분담" title="내 담당과 팀원 담당">
        <EvidenceList items={[
          { title: "내 담당", text: "팀장으로 화면 설계·프론트엔드, 온보딩 API, 사용자 선호 저장 처리를 맡았습니다." },
          { title: "팀원 담당", text: "임경수 팀원이 공연 데이터 수집, 핵심 AI 검색·추천 엔진 개발, 배포 설정을 맡았습니다." },
        ]} />
      </CaseSection>

      <CaseSection id="result" label="구현 결과" title="취향 입력부터 저장·완료·추천 조회까지 연결했습니다.">
        <p>호감·비호감·중립 선택, 유효 응답 8개 조건, 취향 저장, 완료 처리와 추천 화면 이동을 연결했습니다.</p>
      </CaseSection>

      <CaseSection id="learning" title="사용자 행동의 의미와 저장 실패 상태를 함께 다뤘습니다.">
        <p>선택의 의미와 서버 저장 결과를 화면 전환의 기준으로 삼았습니다.</p>
      </CaseSection>
    </CaseBody>
    <NextProject project={project} />
  </main>;
}

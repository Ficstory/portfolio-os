export type CareerCaseId =
  | "participation-local-governance"
  | "council-monitoring"
  | "admin-audit-agenda"
  | "ordinance-budget-policy-analysis"
  | "official-trip-analysis"
  | "policy-writing-briefing";

export type CareerCaseEvidenceLevel = "strong" | "medium" | "needs-check";

export type CareerCaseTrackRelevance = {
  publicDigital: string;
  pm: string;
  policy: string;
  assembly: string;
};

export type CareerCaseEvidence = {
  level: CareerCaseEvidenceLevel;
  publicLabel: string;
  sourceNote: string;
  href?: string;
  linkLabel?: string;
};

export type CareerCase = {
  id: CareerCaseId;
  title: string;
  summary: string;
  context: string;
  role: string[];
  workHighlights: string[];
  outputs: string[];
  evidence: CareerCaseEvidence[];
  relevance: CareerCaseTrackRelevance;
  caution: string[];
};

export const careerCases: CareerCase[] = [
  {
    id: "participation-local-governance",
    title: "부산참여연대 지방자치본부 실무",
    summary:
      "부산참여연대 지방자치본부에서 지방의회, 행정, 시민사회 의제를 다루며 자료 조사와 쟁점 정리, 대외 문서화 업무를 수행했습니다.",
    context:
      "지방자치 현장은 조례, 예산, 회의자료, 언론 이슈, 시민사회 요구가 함께 얽혀 있어 여러 자료를 한 번에 읽고 실무자가 사용할 수 있는 문장과 구조로 바꿔야 했습니다.",
    role: ["간사", "팀장", "자료 조사", "의제 정리", "문서 작성"],
    workHighlights: [
      "지방의회와 행정 의제를 시민사회 관점에서 모니터링했습니다.",
      "조례, 예산, 감사, 지역 현안을 쟁점별로 나눠 정리했습니다.",
      "회의자료와 대외 메시지에 활용할 수 있는 문서 형태로 가공했습니다.",
    ],
    outputs: ["경력 요약", "의제 정리 문서", "회의자료", "대외 메시지 초안"],
    evidence: [
      {
        level: "strong",
        publicLabel: "부산시의회 방청 공개 회의록",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 제298회 임시회 회의록에 부산참여연대 이재호 방청 기록이 있으며, 내부 경력 타임라인은 부산참여연대 2021.05~2025.02 간사·팀장 역할 기준.",
        href: "https://council.busan.go.kr/assem/user/assem/minute/printReview.busan?minuteSid=24493",
        linkLabel: "회의록",
      },
      {
        level: "needs-check",
        publicLabel: "정량 성과 후보 묶음",
        sourceNote:
          "profile/이재호 기초자료/이재호_요약정리.md 기준. 조례 435건, 5분발언 337건, 시정질의 85건, 의정브리핑 25회기 등은 화면 노출 전 원문 증빙 재확인 필요.",
      },
    ],
    relevance: {
      publicDigital:
        "공공 문제의 제도적 맥락을 읽고 디지털 서비스 요구사항으로 바꾸기 위한 기반 경험입니다.",
      pm: "비정형 공공자료를 협업 가능한 문서와 실행 기준으로 정리한 경험입니다.",
      policy:
        "정책지원관의 자료 조사, 쟁점 정리, 의정지원 문서 작성 업무와 직접 연결됩니다.",
      assembly:
        "국회 보좌 실무에서 필요한 공공 이슈 조사와 메시지 구조화 역량을 설명하는 기반 경력입니다.",
    },
    caution: [
      "정책을 직접 결정한 것처럼 표현하지 않습니다.",
      "정량 성과는 원문 증빙을 확인한 뒤 제한적으로 사용합니다.",
      "부산참여연대 경력은 개발 프로젝트가 아니라 공공 실무 경력으로 분리합니다.",
    ],
  },
  {
    id: "council-monitoring",
    title: "의정감시와 회기 모니터링",
    summary:
      "부산시의회 회기와 상임위 활동을 모니터링하고, 발언과 안건에서 확인할 쟁점과 후속 질문을 정리했습니다.",
    context:
      "의회 활동은 회의록, 안건, 상임위 논의, 행정 답변이 분산되어 있어 단순 기록보다 어떤 질문이 필요한지 재구성하는 작업이 중요했습니다.",
    role: ["회의 모니터링", "방청의견 정리", "쟁점 분류", "후속 질문 정리"],
    workHighlights: [
      "본회의와 상임위 논의에서 핵심 쟁점을 분리했습니다.",
      "부서별 논의 내용을 방청의견과 후속 확인 항목으로 정리했습니다.",
      "의정활동을 시민사회가 이해할 수 있는 언어로 요약했습니다.",
    ],
    outputs: ["방청의견", "모니터링 메모", "회기 쟁점 정리", "논평 근거 문장"],
    evidence: [
      {
        level: "strong",
        publicLabel: "본회의·상임위 모니터링 기록",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 공개 회의록과 내부 핵심경력 타임라인의 방청의견·회기 모니터링 문서에 이재호 표기.",
        href: "https://council.busan.go.kr/assem/user/assem/minute/printReview.busan?minuteSid=24493",
        linkLabel: "회의록",
      },
      {
        level: "medium",
        publicLabel: "회기 종료 논평과 의회모니터 운영 자료",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 제320회 임시회 평가 인터뷰와 2021년 부산시의회 회기 모니터링·논평 업무 수행 기록 존재.",
        href: "https://v.daum.net/v/Zy0ZZZQ075?f=p",
        linkLabel: "인터뷰",
      },
    ],
    relevance: {
      publicDigital:
        "공공 서비스가 놓치기 쉬운 행정 절차와 현장 쟁점을 읽는 능력을 보여줍니다.",
      pm: "분산된 회의 정보를 실행 가능한 질문과 후속 작업으로 바꾸는 협업 역량입니다.",
      policy:
        "정책지원관의 회의자료 검토, 질의 보조, 의정활동 지원 업무와 직접 연결됩니다.",
      assembly:
        "상임위와 현안 대응에서 필요한 회의 모니터링, 쟁점 추출, 질의 방향 정리 경험입니다.",
    },
    caution: [
      "국회 상임위 업무를 직접 수행했다고 쓰지 않습니다.",
      "지방의회 모니터링 경험을 국회 보좌 업무의 유사 경험으로만 연결합니다.",
      "방청의견과 논평의 최종 작성 책임 범위는 원문 확인 후 표현합니다.",
    ],
  },
  {
    id: "admin-audit-agenda",
    title: "행정사무감사 의제 발굴·질의자료화",
    summary:
      "행정사무감사 대응 과정에서 지역 현안과 정책 쟁점을 의제 단위로 정리하고, 질의와 대외 발표에 활용 가능한 자료로 구조화했습니다.",
    context:
      "행정사무감사는 부서별 사업, 예산, 집행 결과, 지역 현안이 얽혀 있어 문제 제기 수준에서 멈추지 않고 확인할 질문과 근거를 함께 정리해야 했습니다.",
    role: ["의제 조사", "쟁점 정리", "질의 포인트 작성", "대외 발표 자료화"],
    workHighlights: [
      "행정사무감사에서 확인할 지역 현안과 정책 쟁점을 의제별로 나눴습니다.",
      "문제 제기 문장을 질의 포인트와 근거 자료 형태로 정리했습니다.",
      "기자회견문과 논평에 활용 가능한 메시지로 재구성했습니다.",
    ],
    outputs: ["행정사무감사 의제", "질의 포인트", "기자회견문", "논평 근거"],
    evidence: [
      {
        level: "strong",
        publicLabel: "행정사무감사 시민의제 공개 보도",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 2023 부산시의회 행정사무감사 시민사회 의제 제안 기사와 내부 행감 의제 취합·발표·논평 관련 문서 존재.",
        href: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002971444",
        linkLabel: "언론 보도",
      },
      {
        level: "needs-check",
        publicLabel: "행정사무감사 정량 성과 후보",
        sourceNote:
          "profile/이재호 기초자료/이재호_요약정리.md 기준. 행정사무감사 의제 연 40건 발굴·질의자료 가공 표현은 제출 전 원문과 연도별 산출물 재확인 필요.",
      },
    ],
    relevance: {
      publicDigital:
        "공공 문제를 사용자 요구와 서비스 요구사항으로 번역하기 전, 문제 구조를 정리하는 근거 경험입니다.",
      pm: "복잡한 요구와 쟁점을 우선순위와 실행 문서로 바꾸는 PM형 구조화 경험입니다.",
      policy:
        "정책지원관의 행정사무감사 자료 조사, 질의 지원, 쟁점 정리 업무와 가장 직접 연결됩니다.",
      assembly:
        "국회 보좌진의 감사·상임위 질의자료 작성과 유사한 조사·문서화 경험입니다.",
    },
    caution: [
      "감사 권한을 수행한 것처럼 표현하지 않습니다.",
      "의제 건수는 증빙 확인 전 화면 본문에 노출하지 않습니다.",
      "최종 질의 채택이나 정책 반영 여부를 단정하지 않습니다.",
    ],
  },
  {
    id: "ordinance-budget-policy-analysis",
    title: "조례·예산·정책자료 분석",
    summary:
      "조례, 예산, 도시정책, 공공기여, 지역 개발 이슈 등 복잡한 정책자료를 읽고 쟁점과 판단 기준을 정리했습니다.",
    context:
      "정책자료는 법령, 예산, 행정 절차, 이해관계가 함께 포함되어 있어 핵심 쟁점을 분류하고 외부 이해관계자가 읽을 수 있는 구조로 바꾸는 작업이 필요했습니다.",
    role: ["자료 분석", "제도 쟁점 정리", "정책 문서 요약", "비평 문장 작성"],
    workHighlights: [
      "도시개발과 공공기여 등 장기 이슈를 제도와 사례 단위로 정리했습니다.",
      "조례와 예산 자료에서 확인해야 할 쟁점을 분류했습니다.",
      "정책 비평과 회의 논의에 사용할 수 있는 근거 문장을 작성했습니다.",
    ],
    outputs: ["정책 쟁점 정리", "조례 초안", "제도 분석 문서", "논평 문안"],
    evidence: [
      {
        level: "strong",
        publicLabel: "부산시의회 회기 평가 인터뷰",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 제320회 임시회 평가 인터뷰에서 조례 심의, 시정질의, 5분 발언, 지방보조금 사업 문제 관련 발언 확인.",
        href: "https://v.daum.net/v/Zy0ZZZQ075?f=p",
        linkLabel: "인터뷰",
      },
      {
        level: "medium",
        publicLabel: "조례 초안과 제도 정리 자료",
        sourceNote:
          "profile/이재호 기초자료/문서화/03_직무역량_근거맵.md 기준. 주민참여예산 기본조례 초안, 부산시 공공기여협상제 정리, 정책 비평 문안 작성 근거 존재.",
      },
    ],
    relevance: {
      publicDigital:
        "공공 디지털 서비스 기획에서 행정 제약, 제도 맥락, 공공 데이터 기준을 함께 고려할 수 있는 근거입니다.",
      pm: "복잡한 정책 요구와 제약 조건을 기능 범위와 판단 기준으로 분해하는 역량과 연결됩니다.",
      policy:
        "정책지원관의 조례 검토, 예산 쟁점 정리, 정책자료 작성 업무와 직접 연결됩니다.",
      assembly:
        "입법·예산·지역 현안 리서치와 질의자료 작성을 위한 분석 기반 경험입니다.",
    },
    caution: [
      "조례를 직접 발의하거나 예산을 결정한 것처럼 표현하지 않습니다.",
      "분석 범위와 작성 기여도는 증빙 문서에 맞춰 표현합니다.",
      "정책 평가 표현은 근거 문서의 수준을 넘지 않습니다.",
    ],
  },
  {
    id: "official-trip-analysis",
    title: "공무국외출장 실태 분석",
    summary:
      "지방의회 공무국외출장 자료를 비교하고, 절차와 책임성 관점에서 시민사회가 확인해야 할 쟁점을 정리했습니다.",
    context:
      "공무국외출장은 목적, 예산, 일정, 보고, 사후 관리가 함께 검토되어야 하므로 단순 비판보다 확인 기준과 개선 질문을 명확히 세우는 작업이 중요했습니다.",
    role: ["자료 수집", "실태 비교", "발제문 작성", "제도 개선 쟁점 정리"],
    workHighlights: [
      "지방의회 공무국외출장 자료를 비교 가능한 기준으로 정리했습니다.",
      "절차, 목적, 결과보고 등 책임성 관점의 확인 항목을 분리했습니다.",
      "발제와 대외 설명에 사용할 수 있는 구조로 분석 내용을 정리했습니다.",
    ],
    outputs: ["실태 분석 자료", "발제문", "제도 개선 쟁점", "대외 설명 자료"],
    evidence: [
      {
        level: "strong",
        publicLabel: "공무국외출장 토론회 발제 보도",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산 기초의회 공무국외출장 토론회에서 이재호 부산참여연대 간사가 발제자로 확인되며, 내부 실태 분석 제출본과 발제문 초안 존재.",
        href: "https://www.fnnews.com/news/202310171700556015",
        linkLabel: "언론 보도",
      },
      {
        level: "medium",
        publicLabel: "구군의회 출장 비용 분석 보도",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산 구군의회 공무국외출장 비용과 외유성 문제를 다룬 보도에 부산참여연대 분석 자료가 소개됨.",
        href: "https://www.fnnews.com/news/202310171842514306",
        linkLabel: "언론 보도",
      },
    ],
    relevance: {
      publicDigital:
        "공공 서비스의 투명성, 책임성, 공개자료 활용 문제를 이해하는 배경 경험입니다.",
      pm: "분산된 데이터를 비교 기준으로 정리하고 대외 설명 가능한 산출물로 만든 경험입니다.",
      policy:
        "정책지원관의 의회 운영, 제도 개선, 행정 책임성 관련 자료 지원 업무와 연결됩니다.",
      assembly:
        "자료 요구, 감사성 질의, 제도 개선 메시지를 구성하는 보좌 실무와 연결하기 좋은 사례입니다.",
    },
    caution: [
      "감사기관처럼 조사 권한을 행사한 것으로 표현하지 않습니다.",
      "시민사회 분석과 발제 경험으로 한정해 설명합니다.",
      "개별 의회에 대한 평가는 공개 가능한 자료 범위 안에서만 다룹니다.",
    ],
  },
  {
    id: "policy-writing-briefing",
    title: "보도자료·논평·발제문·정책문서 작성",
    summary:
      "공공 이슈를 외부 이해관계자가 읽을 수 있는 보도자료, 논평, 발제문, 회의자료 형태로 정리했습니다.",
    context:
      "정책 실무에서는 자료를 많이 읽는 것만큼 핵심 근거와 주장, 후속 질문을 짧고 명확한 문장으로 바꾸는 능력이 중요했습니다.",
    role: ["문서 작성", "쟁점 요약", "메시지 구성", "회의자료 정리"],
    workHighlights: [
      "자료의 핵심 근거와 주장 문장을 분리했습니다.",
      "보도자료형 문장과 질의형 문장을 구분해 작성했습니다.",
      "회의와 대외 발표에 바로 사용할 수 있는 문서 구조로 정리했습니다.",
    ],
    outputs: ["보도자료", "논평", "발제문", "회의자료", "정책 의제 요약"],
    evidence: [
      {
        level: "strong",
        publicLabel: "보도자료·논평·발제문 작성 자료",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 행정사무감사 시민사회 의제 제안 기사와 내부 제9대 전반기 의정 브리핑 초안, 기자회견문, 발제문 초안, 정책 비평 문안 존재.",
        href: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002971444",
        linkLabel: "언론 보도",
      },
      {
        level: "medium",
        publicLabel: "기자회견 진행과 대외 커뮤니케이션 자료",
        sourceNote:
          "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 제320회 임시회 평가 인터뷰와 내부 2024년 기자회견 사회 문서, 시민사회컨퍼런스 발표자료 존재.",
        href: "https://v.daum.net/v/Zy0ZZZQ075?f=p",
        linkLabel: "인터뷰",
      },
    ],
    relevance: {
      publicDigital:
        "서비스기획 문서에서도 문제, 근거, 요구사항, 메시지를 명확히 나누는 기반 역량입니다.",
      pm: "PRD, 회의록, 기능 논의 문서에서 필요한 구조화된 문장 작성 능력과 연결됩니다.",
      policy:
        "정책지원관 직무의 정책자료, 질의자료, 보도자료 보조 작성과 직접 연결되는 핵심 증빙입니다.",
      assembly:
        "국회 보좌진의 브리핑, 질의, 메시지, 보도자료 초안 작성과 가장 직접 연결되는 문서화 경험입니다.",
    },
    caution: [
      "작성물 원문을 공개할 수 없는 경우 문서 유형과 역할만 설명합니다.",
      "조직 내부 자료나 비공개 자료의 세부 내용은 노출하지 않습니다.",
      "최종 배포 여부와 작성 기여도는 증빙 기준에 맞춰 표현합니다.",
    ],
  },
];

export function getCareerCaseById(id: CareerCaseId): CareerCase | undefined {
  return careerCases.find((careerCase) => careerCase.id === id);
}

export function getCareerCasesByIds(ids: readonly CareerCaseId[]): CareerCase[] {
  const orderById = new Map(ids.map((id, index) => [id, index]));

  return careerCases
    .filter((careerCase) => orderById.has(careerCase.id))
    .sort((left, right) => {
      const leftOrder = orderById.get(left.id) ?? Number.POSITIVE_INFINITY;
      const rightOrder = orderById.get(right.id) ?? Number.POSITIVE_INFINITY;

      return leftOrder - rightOrder;
    });
}

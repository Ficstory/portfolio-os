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
    "id": "participation-local-governance",
    "title": "부산참여연대 지방자치본부 실무",
    "summary": "2021년 5월부터 2025년 2월까지 부산참여연대 지방자치본부·재정감시센터에서 일했습니다. 의정활동 평가보고서, 예산·결산 분석과 시민의제 실무를 맡았습니다.",
    "context": "회기마다 안건·회의록·예산 자료를 검토하고, 시민단체의 의견을 취합해 보고서와 간담회 자료로 정리하는 업무였습니다.",
    "role": [
      "간사(2021.05–2024.03)",
      "팀장(2024.03–2025.02)",
      "자료 분석·보고서 작성"
    ],
    "workHighlights": [
      "8대·9대 부산시의회 의정활동 평가보고서를 작성했습니다.",
      "예산·결산 자료를 분석하고 조례 입법예고 의견을 취합했습니다.",
      "행정사무감사 시민의제 기자회견과 의장 간담회 실무를 맡았습니다."
    ],
    "outputs": [
      "의정활동 평가보고서",
      "예산·결산 분석 자료",
      "시민의제 자료",
      "조례 의견 취합 자료"
    ],
    "evidence": [
      {
        "level": "strong",
        "publicLabel": "부산시의회 방청 공개 회의록",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 제298회 임시회 회의록에 부산참여연대 이재호 방청 기록이 있으며, 내부 경력 타임라인은 부산참여연대 2021.05~2025.02 간사·팀장 역할 기준.",
        "href": "https://council.busan.go.kr/assem/user/assem/minute/printReview.busan?minuteSid=24493",
        "linkLabel": "회의록"
      },
      {
        "level": "needs-check",
        "publicLabel": "정량 성과 후보 묶음",
        "sourceNote": "profile/이재호 기초자료/이재호_요약정리.md 기준. 조례 435건, 5분발언 337건, 시정질의 85건, 의정브리핑 25회기 등은 화면 노출 전 원문 증빙 재확인 필요."
      }
    ],
    "relevance": {
      "publicDigital": "공공자료의 출처와 제도적 배경을 검토한 경험입니다.",
      "pm": "서로 다른 자료를 취합해 함께 검토할 문서를 작성했습니다.",
      "policy": "시민사회에서 의정감시와 정책자료 작성 실무를 수행했습니다.",
      "assembly": "지방의회와 행정 자료를 조사·정리한 경험을 보좌 실무에 활용하고자 합니다."
    },
    "caution": [
      "정책을 직접 결정한 것처럼 표현하지 않습니다.",
      "정량 성과는 원문 증빙을 확인한 뒤 제한적으로 사용합니다.",
      "부산참여연대 경력은 개발 프로젝트가 아니라 공공 실무 경력으로 분리합니다."
    ]
  },
  {
    "id": "council-monitoring",
    "title": "의정감시와 회기 모니터링",
    "summary": "부산시의회 본회의·상임위 활동을 모니터링하고 의정활동 평가보고서를 작성했습니다.",
    "context": "안건의 심의 내용, 의원 질의와 행정 답변을 함께 검토했습니다. 회의 개최 횟수만으로 드러나지 않는 심의 과정과 시민 의견 수렴 여부를 살폈습니다.",
    "role": [
      "회의 모니터링",
      "방청의견 정리",
      "쟁점 분류",
      "후속 질문 정리"
    ],
    "workHighlights": [
      "회의록과 안건을 검토하고 회기별 평가 자료를 정리했습니다.",
      "조례 심의, 시정질의, 5분 발언에서 추가로 확인할 쟁점을 뽑았습니다.",
      "2024년 제320회 임시회 평가를 인터뷰에서 설명했습니다."
    ],
    "outputs": [
      "의정활동 평가보고서",
      "회기 쟁점 정리",
      "회기 평가 인터뷰"
    ],
    "evidence": [
      {
        "level": "strong",
        "publicLabel": "부산시의회 방청 기록",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 공개 회의록과 내부 핵심경력 타임라인의 방청의견·회기 모니터링 문서에 이재호 표기.",
        "href": "https://council.busan.go.kr/assem/user/assem/minute/printReview.busan?minuteSid=24493",
        "linkLabel": "회의록"
      },
      {
        "level": "medium",
        "publicLabel": "회기 종료 논평과 의회모니터 운영 자료",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 제320회 임시회 평가 인터뷰와 2021년 부산시의회 회기 모니터링·논평 업무 수행 기록 존재.",
        "href": "https://v.daum.net/v/Zy0ZZZQ075?f=p",
        "linkLabel": "인터뷰"
      }
    ],
    "relevance": {
      "publicDigital": "서비스와 관련된 행정 논의와 시민 의견을 확인하는 데 활용할 수 있습니다.",
      "pm": "회의에서 논의한 내용과 후속 확인 항목을 나눠 기록했습니다.",
      "policy": "본회의·상임위 자료를 검토하고 회기별 평가를 작성했습니다.",
      "assembly": "지방의회 모니터링 경험을 바탕으로 상임위·현안 자료 검토를 배우고자 합니다."
    },
    "caution": [
      "국회 상임위 업무를 직접 수행했다고 쓰지 않습니다.",
      "지방의회 모니터링 경험을 국회 보좌 업무의 유사 경험으로만 연결합니다.",
      "방청의견과 논평의 최종 작성 책임 범위는 원문 확인 후 표현합니다."
    ]
  },
  {
    "id": "admin-audit-agenda",
    "title": "행정사무감사 시민의제 발굴·취합",
    "summary": "행정사무감사에서 다룰 시민의제를 발굴·취합하고, 기자회견과 부산시의회 의장 간담회 실무를 맡았습니다.",
    "context": "여러 시민단체가 제안한 의제를 의회에 전달할 자료로 정리하는 일이었습니다. 감사 권한과 의원의 최종 질의는 의회의 역할입니다.",
    "role": [
      "시민의제 조사·취합",
      "기자회견 실무",
      "의장 간담회 준비"
    ],
    "workHighlights": [
      "행정사무감사 시민의제 자료를 취합했습니다.",
      "의제의 배경과 문제, 확인할 내용을 정리했습니다.",
      "기자회견과 의장 간담회에서 사용할 자료를 준비했습니다."
    ],
    "outputs": [
      "시민의제 제안 자료",
      "기자회견 자료",
      "의장 간담회 자료"
    ],
    "evidence": [
      {
        "level": "strong",
        "publicLabel": "행정사무감사 시민의제 공개 보도",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 2023 부산시의회 행정사무감사 시민사회 의제 제안 기사와 내부 행감 의제 취합·발표·논평 관련 문서 존재.",
        "href": "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002971444",
        "linkLabel": "언론 보도"
      },
      {
        "level": "needs-check",
        "publicLabel": "행정사무감사 정량 성과 후보",
        "sourceNote": "profile/이재호 기초자료/이재호_요약정리.md 기준. 행정사무감사 의제 연 40건 발굴·질의자료 가공 표현은 제출 전 원문과 연도별 산출물 재확인 필요."
      }
    ],
    "relevance": {
      "publicDigital": "여러 단체의 요구를 취합하고 제안 자료로 정리했습니다.",
      "pm": "여러 제안의 배경과 확인할 내용을 문서에 모았습니다.",
      "policy": "시민의제 발굴·취합과 의회 전달 실무를 경험했습니다.",
      "assembly": "시민의제 조사·취합 경험을 질의자료 준비에 활용하고자 합니다."
    },
    "caution": [
      "감사 권한을 수행한 것처럼 표현하지 않습니다.",
      "의제 건수는 증빙 확인 전 화면 본문에 노출하지 않습니다.",
      "최종 질의 채택이나 정책 반영 여부를 단정하지 않습니다."
    ]
  },
  {
    "id": "ordinance-budget-policy-analysis",
    "title": "조례·예산·정책자료 분석",
    "summary": "부산시 예산·결산 자료를 분석하고, 조례 입법예고에 제출할 의견을 취합·정리했습니다.",
    "context": "사업의 예산과 집행 내용, 조례의 변경 사항을 검토했습니다. 여러 단체의 의견과 검토 자료를 회의·평가보고서에서 다룰 수 있도록 정리했습니다.",
    "role": [
      "예산·결산 분석",
      "조례 의견 취합",
      "자료 정리"
    ],
    "workHighlights": [
      "부산시 예산·결산 분석 실무를 담당했습니다.",
      "조례 입법예고 의견 제출을 위한 취합과 자료 정리를 맡았습니다.",
      "회기 평가에서 조례 심의와 지방보조금 사업의 쟁점을 설명했습니다."
    ],
    "outputs": [
      "예산·결산 분석 자료",
      "조례 입법예고 의견 취합",
      "회기 평가 자료"
    ],
    "evidence": [
      {
        "level": "strong",
        "publicLabel": "부산시의회 회기 평가 인터뷰",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 제320회 임시회 평가 인터뷰에서 조례 심의, 시정질의, 5분 발언, 지방보조금 사업 문제 관련 발언 확인.",
        "href": "https://v.daum.net/v/Zy0ZZZQ075?f=p",
        "linkLabel": "인터뷰"
      }
    ],
    "relevance": {
      "publicDigital": "공공 서비스와 관련된 예산·조례 자료를 읽은 경험입니다.",
      "pm": "자료의 변경 사항과 제약을 찾아 문서로 정리했습니다.",
      "policy": "예산·결산 분석과 조례 입법예고 의견 정리를 담당했습니다.",
      "assembly": "지역 현안의 예산·제도 자료를 검토하는 데 활용할 수 있습니다."
    },
    "caution": [
      "조례를 직접 발의하거나 예산을 결정한 것처럼 표현하지 않습니다.",
      "분석 범위와 작성 기여도는 증빙 문서에 맞춰 표현합니다.",
      "정책 평가 표현은 근거 문서의 수준을 넘지 않습니다."
    ]
  },
  {
    "id": "official-trip-analysis",
    "title": "공무국외출장 실태 분석",
    "summary": "2022~2023년 부산 기초의회 공무국외출장 자료를 비교하고, 2023년 10월 토론회에서 실태 분석을 발제했습니다.",
    "context": "출장 경비·일정뿐 아니라 목적과 방문지, 결과보고서를 함께 검토했습니다. 보고서의 충실도와 심사 절차에서 확인할 문제를 정리했습니다.",
    "role": [
      "자료 수집",
      "실태 비교",
      "발제문 작성",
      "제도 개선 쟁점 정리"
    ],
    "workHighlights": [
      "기초의회별 출장 일정·비용과 방문 국가를 비교했습니다.",
      "출장 결과보고서와 심사 절차의 문제를 정리했습니다.",
      "2023년 10월 17일 토론회에서 분석 결과를 발제했습니다."
    ],
    "outputs": [
      "공무국외출장 실태 분석",
      "토론회 발제",
      "관련 언론 보도"
    ],
    "evidence": [
      {
        "level": "strong",
        "publicLabel": "공무국외출장 토론회 발제 보도",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산 기초의회 공무국외출장 토론회에서 이재호 부산참여연대 간사가 발제자로 확인되며, 내부 실태 분석 제출본과 발제문 초안 존재.",
        "href": "https://www.fnnews.com/news/202310171700556015",
        "linkLabel": "언론 보도"
      },
      {
        "level": "medium",
        "publicLabel": "구군의회 출장 비용 분석 보도",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산 구군의회 공무국외출장 비용과 외유성 문제를 다룬 보도에 부산참여연대 분석 자료가 소개됨.",
        "href": "https://www.fnnews.com/news/202310171842514306",
        "linkLabel": "언론 보도"
      }
    ],
    "relevance": {
      "publicDigital": "공개자료의 항목을 맞춰 비교하고 결과를 설명했습니다.",
      "pm": "흩어진 자료를 비교 가능한 항목으로 정리했습니다.",
      "policy": "의회 운영 자료를 비교하고 개선 쟁점을 발제했습니다.",
      "assembly": "출장 자료의 비교·분석 경험을 현안 조사에 활용하고자 합니다."
    },
    "caution": [
      "감사기관처럼 조사 권한을 행사한 것으로 표현하지 않습니다.",
      "시민사회 분석과 발제 경험으로 한정해 설명합니다.",
      "개별 의회에 대한 평가는 공개 가능한 자료 범위 안에서만 다룹니다."
    ]
  },
  {
    "id": "policy-writing-briefing",
    "title": "보고서·발제·대외 설명 자료 작성",
    "summary": "의정활동 평가와 공무국외출장 조사 결과를 보고서·발제·인터뷰로 전달했습니다. 시민의제 기자회견과 간담회 자료도 준비했습니다.",
    "context": "회의용 자료에는 검토할 쟁점을, 대외 설명에는 핵심 근거와 주장을 담았습니다. 같은 조사 내용을 읽는 사람과 사용 목적에 맞춰 정리하는 업무였습니다.",
    "role": [
      "문서 작성",
      "쟁점 요약",
      "메시지 구성",
      "회의자료 정리"
    ],
    "workHighlights": [
      "의정활동 평가보고서와 시민의제 자료를 작성했습니다.",
      "공무국외출장 실태 분석을 토론회 발제로 정리했습니다.",
      "부산시의회 회기 평가를 언론 인터뷰에서 설명했습니다."
    ],
    "outputs": [
      "평가보고서",
      "시민의제 자료",
      "토론회 발제",
      "인터뷰"
    ],
    "evidence": [
      {
        "level": "strong",
        "publicLabel": "행정사무감사 시민의제 관련 보도",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 행정사무감사 시민사회 의제 제안 기사와 내부 제9대 전반기 의정 브리핑 초안, 기자회견문, 발제문 초안, 정책 비평 문안 존재.",
        "href": "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002971444",
        "linkLabel": "언론 보도"
      },
      {
        "level": "medium",
        "publicLabel": "의정활동 평가·시민의제 실무 인터뷰",
        "sourceNote": "docs/2026-06-02_이재호_발자취_조사보고서.md 기준. 부산시의회 제320회 임시회 평가 인터뷰와 내부 2024년 기자회견 사회 문서, 시민사회컨퍼런스 발표자료 존재.",
        "href": "https://v.daum.net/v/Zy0ZZZQ075?f=p",
        "linkLabel": "인터뷰"
      }
    ],
    "relevance": {
      "publicDigital": "조사 결과를 회의자료와 대외 설명으로 정리한 경험입니다.",
      "pm": "자료를 읽는 사람과 목적에 맞춰 문서를 작성했습니다.",
      "policy": "보고서·발제·인터뷰 등 서로 다른 형식으로 근거를 전달했습니다.",
      "assembly": "현안 요약과 브리핑 초안 작성에 문서 실무 경험을 활용하고자 합니다."
    },
    "caution": [
      "작성물 원문을 공개할 수 없는 경우 문서 유형과 역할만 설명합니다.",
      "조직 내부 자료나 비공개 자료의 세부 내용은 노출하지 않습니다.",
      "최종 배포 여부와 작성 기여도는 증빙 기준에 맞춰 표현합니다."
    ]
  }
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

export type PublicDigitalOperatingStep = {
  title: string;
  summary: string;
  deliverables: string[];
  evidence: string[];
};

export type PublicDigitalQuestion = {
  question: string;
  approach: string;
  deliverables: string[];
  evidence: string[];
};

export type PublicDigitalMethodPhase = {
  title: string;
  description: string;
  output: string;
};

export type PublicDigitalLibraryItem = {
  title: string;
  type: "brief" | "prd" | "flow" | "checklist" | "case-note";
  summary: string;
  visibility: "public" | "sanitized" | "internal";
  href: string;
};

export const publicDigitalEvidenceItems = [
  "공공자료 분석",
  "PRD·요구사항정의서",
  "접근성 서비스 흐름",
  "화면명세·API 협업",
  "의정평가 보고서 작성",
  "Android/Web 구현 이해",
];

export const publicDigitalOperatingSteps: PublicDigitalOperatingStep[] = [
  {
    "title": "공공자료 조사",
    "summary": "의회 활동과 예산·결산 자료를 검토하고 의정평가 보고서와 발제 자료를 작성했습니다.",
    "deliverables": [
      "의정평가 보고서",
      "예산·결산 분석 자료"
    ],
    "evidence": [
      "부산참여연대 경력증명서",
      "관련 인터뷰·기사"
    ]
  },
  {
    "title": "사용 의향 조사",
    "summary": "웃지마게임 설문을 설계하고 168건의 응답을 분석했습니다. 얼굴 공개 부담을 팀의 매칭 우선순위 논의에 반영했습니다.",
    "deliverables": [
      "설문 분석 보고서",
      "1월 14일 회의록"
    ],
    "evidence": [
      "웃지마게임 설문·회의 기록"
    ]
  },
  {
    "title": "요구사항 문서",
    "summary": "애낌의 구독 확인·등록 조건과 부산이음길의 제보 처리 상태를 문서에 반영했습니다.",
    "deliverables": [
      "요구사항정의서",
      "화면명세 갱신"
    ],
    "evidence": [
      "애낌·부산이음길 문서 변경 이력"
    ]
  },
  {
    "title": "화면과 API",
    "summary": "구독 후보를 선택해 등록하는 화면과 공연 취향을 저장하는 온보딩을 구현했습니다.",
    "deliverables": [
      "구독 후보 확인 화면",
      "취향 수집·저장 흐름"
    ],
    "evidence": [
      "애낌·플레이픽 구현 코드"
    ]
  },
  {
    "title": "오류 수정",
    "summary": "구독 후보의 개수 표시, 초대한 상대가 대기실에 보이지 않는 문제를 수정했습니다.",
    "deliverables": [
      "후보 개수 갱신",
      "초대방 표시 오류 수정"
    ],
    "evidence": [
      "애낌·웃지마게임 Git 기록"
    ]
  }
];

export const publicDigitalQuestions: PublicDigitalQuestion[] = [
  {
    "question": "길안내가 실제 이동 조건에 맞는가?",
    "approach": "이동약자·저시력자와 현장 경로를 따라가며 통행 가능 여부, 안내 이해, 데이터 누락을 확인하고 싶습니다.",
    "deliverables": [
      "경로별 통행·안내 오류",
      "도움이 필요한 단계"
    ],
    "evidence": [
      "부산이음길"
    ]
  },
  {
    "question": "친구 초대가 참여 부담을 줄이는가?",
    "approach": "친구 초대와 랜덤 매칭에서 입장·이탈 이유를 비교하고 싶습니다. 사전 설문과 실제 플레이 행동이 같은지도 확인할 항목입니다.",
    "deliverables": [
      "입장·이탈 이유",
      "판정에 대한 반응"
    ],
    "evidence": [
      "웃지마게임"
    ]
  },
  {
    "question": "첫 추천 전에 여덟 번의 선택을 마치는가?",
    "approach": "온보딩 단계별 이탈과 소요 시간을 기록하고, 선택 개수가 추천 만족도에 미치는 영향을 함께 확인하고 싶습니다.",
    "deliverables": [
      "선택 단계별 이탈",
      "추천 결과 평가"
    ],
    "evidence": [
      "플레이픽"
    ]
  }
];

export const publicDigitalMethodPhases: PublicDigitalMethodPhase[] = [
  {
    title: "Discovery",
    description: "공공자료, 민원, 정책 문서, 현장 문제를 읽습니다.",
    output: "자료 묶음과 문제 후보",
  },
  {
    title: "Definition",
    description: "사용자 문제, 행정 제약, 이해관계자 요구를 분리합니다.",
    output: "문제정의 브리프",
  },
  {
    title: "Translation",
    description: "문제를 요구사항, 화면 흐름, 기능 기준으로 바꿉니다.",
    output: "요구사항과 사용자 흐름",
  },
  {
    title: "Specification",
    description: "PRD, 화면명세, API 협업 기준, 접근성 조건을 문서화합니다.",
    output: "구현 협업 문서",
  },
  {
    title: "Pilot",
    description: "프로토타입, 시연 흐름, MVP 범위로 검증합니다.",
    output: "시연 가능한 범위",
  },
  {
    title: "Improvement",
    description:
      "피드백, 사용성 문제, 운영 지표를 바탕으로 다음 개선안을 만듭니다.",
    output: "개선 후보와 다음 실험",
  },
];

export const publicDigitalLibraryItems: PublicDigitalLibraryItem[] = [
  {
    "title": "부산이음길 사용자·요구사항·구현 기록",
    "type": "prd",
    "summary": "사용자 유형, 화면과 경로 데이터의 확인 범위, 개인 구현 기록을 발췌했습니다.",
    "visibility": "public",
    "href": "/pm/sources/busan-contribution.txt"
  },
  {
    "title": "애낌 요구사항정의서",
    "type": "prd",
    "summary": "구독 후보 확인과 수동 추가, 화면 상태에 관한 요구사항입니다.",
    "visibility": "public",
    "href": "/pm/sources/aekkim-requirements.txt"
  },
  {
    "title": "웃지마게임 기획 변경·역할 기록",
    "type": "case-note",
    "summary": "친구 매칭 우선 결정과 AI 판정 논의, 팀 내 역할을 정리했습니다.",
    "visibility": "public",
    "href": "/pm/sources/smile-decisions.txt"
  },
  {
    "title": "부산참여연대 담당 업무 요약",
    "type": "brief",
    "summary": "경력증명서에서 재직 기간과 담당 업무를 확인해 요약했습니다.",
    "visibility": "public",
    "href": "/pm/sources/career-scope.txt"
  }
];

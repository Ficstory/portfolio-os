export const pmHero = {
  eyebrow: "Junior PM / Service Planning",
  title: "복잡한 서비스 문제를 실행 가능한 제품 전략으로 바꾸는 PM",
  summary:
    "사용자 흐름, 정책/운영 제약, 개발 현실을 함께 보고 요구사항, MVP 범위, 협업 기준으로 정리합니다.",
  primaryCta: {
    label: "대표 프로젝트 보기",
    href: "#work",
  },
  secondaryCta: {
    label: "PM 산출물 보기",
    href: "#artifacts",
  },
  tertiaryCta: {
    label: "이력서 보기",
    href: "/resume",
  },
};

export const pmNavItems = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Artifacts", href: "#artifacts" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export const pmArtifactStack = [
  {
    title: "Requirement Brief",
    meta: "문제, 사용자, 제약 조건",
    points: ["문제 정의", "성공 기준", "확인할 리스크"],
  },
  {
    title: "User Flow",
    meta: "사용자와 운영자 흐름",
    points: ["진입 경로", "상태 전이", "예외 상황"],
  },
  {
    title: "MVP Scope",
    meta: "출시 범위와 후순위",
    points: ["필수 기능", "보류 항목", "검증 방식"],
  },
  {
    title: "Decision Log",
    meta: "협업 기준과 변경 이유",
    points: ["결정 배경", "대안 비교", "담당 범위"],
  },
] as const;

export const pmMetrics = [
  {
    value: "4",
    label: "PM 관점 대표 프로젝트",
    description:
      "AEKKIM, 부산이음길, 웃지마게임, Play Pick을 PM 판단 기준으로 재정리",
  },
  {
    value: "6",
    label: "정책/공공 문서형 경력 근거",
    description:
      "공공자료 분석, 회의 모니터링, 정책문서 작성 경험을 실행 문서화 역량으로 연결",
  },
  {
    value: "PRD · IA · QA",
    label: "산출물 기반 협업",
    description: "요구사항, 화면 흐름, 테스트 관점으로 팀의 해석 차이를 줄인 경험",
  },
  {
    value: "MVP Scope",
    label: "요구사항과 구현 범위 조율",
    description: "요청 목록을 출시 가능 범위와 검증 예정 항목으로 나누는 작업 방식",
  },
] as const;

export const pmFitSegments = [
  {
    title: "복잡한 신청/접수 흐름",
    description: "사용자가 어디서 멈추는지 보고 단계, 안내, 상태를 다시 정리합니다.",
  },
  {
    title: "정책/운영 제약이 있는 서비스",
    description: "제도, 운영 절차, 접근성, 민원 맥락을 요구사항으로 번역합니다.",
  },
  {
    title: "내부 운영 도구",
    description: "반복 확인, 수작업, 부서 간 전달을 줄이는 관리자 흐름을 설계합니다.",
  },
  {
    title: "MVP 범위 조율",
    description: "요청 목록을 검증 가능한 최소 기능과 후순위 항목으로 나눕니다.",
  },
  {
    title: "개발 협업 기준 정리",
    description: "화면, 상태값, 예외 케이스, API 연동 기준을 문서화합니다.",
  },
] as const;

export const pmProblemFrames = [
  {
    title: "Fragmented",
    subtitle: "흐름과 책임이 분산된 서비스",
    problem:
      "사용자 흐름, 관리자 흐름, 정책 조건이 각자 다른 문서와 대화 속에서 움직입니다.",
    approach: "전체 서비스 흐름과 상태 전이를 한 기준으로 정렬합니다.",
  },
  {
    title: "Ambiguous",
    subtitle: "성공 기준과 우선순위가 모호한 요구사항",
    problem:
      "요구는 많지만 어떤 문제가 먼저이고 무엇을 확인해야 하는지 불명확합니다.",
    approach: "문제, 사용자, 제약, 성공 기준을 분리해 MVP 범위를 정합니다.",
  },
  {
    title: "Costly",
    subtitle: "반복 문의와 재작업을 만드는 운영 구조",
    problem:
      "구두 합의와 개별 해석이 반복 문의, 수작업 확인, 재작업으로 이어집니다.",
    approach: "자동화 가능 지점, 안내 개선, 관리 화면 요구사항을 정의합니다.",
  },
] as const;

export const pmOperatingSystem = [
  {
    title: "문제 정의",
    description: "사용자 불편, 운영 병목, 조직 목표를 분리해 한 문장으로 정리합니다.",
  },
  {
    title: "흐름 설계",
    description: "사용자 플로우와 관리자/운영자 플로우를 함께 놓고 상태를 맞춥니다.",
  },
  {
    title: "범위 결정",
    description: "임팩트, 구현 난이도, 리스크, 검증 가능성을 기준으로 MVP를 나눕니다.",
  },
  {
    title: "요구사항 문서화",
    description: "화면, 상태값, 정책 조건, 예외 케이스, API 연결 지점을 명확히 씁니다.",
  },
  {
    title: "협업 정렬",
    description: "디자이너, 개발자, 운영/정책 담당자가 같은 기준으로 판단하게 만듭니다.",
  },
  {
    title: "출시 후 검증",
    description: "피드백, QA 이슈, 사용 로그, 운영 이슈를 다시 개선 과제로 전환합니다.",
  },
] as const;

export const pmCaseStudies = [
  {
    title: "AEKKIM",
    href: "/projects/aekkim",
    summary:
      "OTT 구독 관리 MVP에서 요구사항, 화면명세, API 연동 기준을 맞춘 PM형 협업 사례",
    problem: "팀원 이탈 이후 기능 범위와 화면/API 기준을 같은 문서 기준으로 맞춰야 했습니다.",
    role: "팀장 / PM / Frontend 구현 참여",
    decision:
      "요구사항정의서와 화면명세서 변경 이력을 유지하고, 구독 관리·알림·마이페이지 범위를 MVP 기준으로 조율했습니다.",
    artifacts: ["요구사항정의서", "화면명세서", "브랜치 전략", "FE 테스트 계획"],
    outcome:
      "팀 운영 기준과 구현 범위를 분리해 설명할 수 있는 주니어 PM 핵심 사례로 정리했습니다.",
  },
  {
    title: "부산이음길",
    href: "/projects/busan-eumgil",
    summary:
      "이동약자·저시력자 길안내 경험을 접근성 조건과 사용자 흐름으로 구조화한 공공 디지털 사례",
    problem:
      "최단 경로만으로는 실제 이동 가능성을 판단하기 어려워 접근성 시설, 안내 방식, 경로 비교가 함께 필요했습니다.",
    role: "PM/기획 / 사용자 흐름 정리 / Frontend 구현 참여",
    decision:
      "지도·검색·경로·길안내·마이페이지 흐름을 사용자 조건별로 나누고, 접근성 시설과 음성 UX를 MVP 기준에 연결했습니다.",
    artifacts: ["PRD", "요구사항명세서", "접근성 화면군", "시연 흐름"],
    outcome:
      "공공 현장의 문제를 서비스 요구사항과 화면 흐름으로 번역한 사례로 제시합니다.",
  },
  {
    title: "웃지마게임",
    href: "/projects/smile-game",
    summary:
      "설문과 피드백을 바탕으로 실시간 화상 서비스의 MVP 방향을 조정한 기획 사례",
    problem:
      "초기 아이디어가 사용자에게 설득력 있는지 확인하고, WebRTC 기술 난도와 재미 요소의 균형을 잡아야 했습니다.",
    role: "PM / 설문 설계 / 기능명세·발표자료 정리",
    decision:
      "컨설턴트 피드백 이후 설문을 설계·배포하고 응답 분석을 바탕으로 MVP 방향과 화면 범위를 조정했습니다.",
    artifacts: ["설문 문항", "응답 요약", "피봇 전후 기획안", "회의록"],
    outcome:
      "가벼운 소재보다 사용자 검증과 피봇 판단 과정을 보여주는 보조 사례로 배치합니다.",
  },
] as const;

export const pmComparisonRows = [
  {
    criteria: "사용자 흐름",
    before: "단계와 안내가 분산됨",
    after: "핵심 행동 중심으로 화면과 상태를 재배치",
    effect: "이해 부담 감소를 기대하며 시연/QA에서 확인",
  },
  {
    criteria: "요구사항",
    before: "요청 목록 중심",
    after: "문제, 범위, 우선순위 중심으로 분리",
    effect: "개발 범위와 후순위 항목을 명확히 구분",
  },
  {
    criteria: "협업",
    before: "구두 합의와 개별 해석",
    after: "문서 기준과 결정 로그로 변경 이유 기록",
    effect: "재작업 가능성을 줄이는 기준 마련",
  },
  {
    criteria: "운영",
    before: "수작업 확인 반복",
    after: "상태값, 알림, 관리 기준을 요구사항으로 정의",
    effect: "운영 부담 감소 가능 지점을 검증 과제로 전환",
  },
] as const;

export const pmProductArtifacts = [
  {
    title: "Requirement Brief",
    description: "문제와 사용자, 제약 조건을 한 장으로 맞춰야 할 때 사용합니다.",
    items: ["문제 정의", "대상 사용자", "성공 기준"],
    project: "AEKKIM / 부산이음길",
  },
  {
    title: "IA / User Flow",
    description: "사용자와 운영자 흐름이 나뉘거나 상태 전이가 많을 때 사용합니다.",
    items: ["진입 경로", "화면군", "상태 전이"],
    project: "부산이음길",
  },
  {
    title: "Screen Specification",
    description: "화면별 입력, 출력, 예외 케이스를 개발 기준으로 맞출 때 사용합니다.",
    items: ["화면 목적", "입력값", "예외 문구"],
    project: "AEKKIM",
  },
  {
    title: "MVP Scope",
    description: "요청 기능을 출시 필수와 후순위로 나눠야 할 때 사용합니다.",
    items: ["필수 범위", "보류 항목", "검증 조건"],
    project: "AEKKIM / 웃지마게임",
  },
  {
    title: "Backlog Priority",
    description: "임팩트와 구현 난이도를 함께 보고 작업 순서를 정할 때 사용합니다.",
    items: ["사용자 영향", "개발 난이도", "리스크"],
    project: "팀 프로젝트 공통",
  },
  {
    title: "API Alignment Notes",
    description: "프론트엔드 화면과 백엔드 응답 기준의 해석 차이를 줄일 때 사용합니다.",
    items: ["요청/응답", "상태값", "에러 처리"],
    project: "AEKKIM / Play Pick",
  },
  {
    title: "QA Scenario",
    description: "기능 완성보다 사용자 흐름이 끊기지 않는지 확인할 때 사용합니다.",
    items: ["정상 흐름", "실패 흐름", "회귀 확인"],
    project: "AEKKIM / 부산이음길",
  },
  {
    title: "Launch Review",
    description: "출시 전후 피드백과 운영 이슈를 다음 개선 과제로 바꿀 때 사용합니다.",
    items: ["피드백", "운영 이슈", "다음 액션"],
    project: "웃지마게임 / Play Pick",
  },
] as const;

export const pmCollaborationModel = [
  {
    partner: "Designer",
    title: "화면 의도와 정보 우선순위 정렬",
    description: "문제 정의, 핵심 행동, 화면별 정보 우선순위를 같은 언어로 맞춥니다.",
  },
  {
    partner: "Engineer",
    title: "상태값, 예외 케이스, 구현 범위 정리",
    description: "화면 요구사항을 API 조건, 에러 처리, 구현 단위로 나눠 협업합니다.",
  },
  {
    partner: "Policy / Operation",
    title: "제도 조건과 실제 처리 절차 확인",
    description: "정책 문서, 운영 절차, 민원 흐름을 제품 요구사항의 제약으로 반영합니다.",
  },
  {
    partner: "Stakeholder",
    title: "목표, 일정, 출시 기준 합의",
    description: "범위를 줄일 때도 왜 줄이는지, 무엇을 검증할지 결정 기준을 남깁니다.",
  },
] as const;

export const pmPublicBridge = {
  title: "공공 맥락은 제 PM 역량의 차별점입니다",
  summary:
    "빠른 출시만 보지 않고 제도, 접근성, 운영 지속성, 설명 가능성을 함께 고려합니다. 공공/정책 경험은 PM 페이지에서 별도 직무가 아니라 복잡한 요구사항을 다루는 기반 역량으로 배치합니다.",
  points: [
    "공공 자료와 정책 맥락을 읽고 제품 제약 조건으로 정리합니다.",
    "민원, VOC, 정책 문서를 사용자 문제와 운영 요구로 번역합니다.",
    "접근성과 설명 가능성을 화면 흐름과 안내 기준에 반영합니다.",
    "유지 운영까지 고려해 상태값, 담당 범위, 예외 케이스를 남깁니다.",
  ],
};

export const pmFaqs = [
  {
    question: "개발자가 아닌데 개발팀과 어떻게 협업하나요?",
    answer:
      "화면, 상태값, 예외 케이스, API 연결 기준을 문서화해 해석 차이를 줄입니다. 구현 경험은 기술 과시가 아니라 개발 제약을 이해하고 범위를 조율하는 근거로 사용합니다.",
  },
  {
    question: "정량 지표가 부족한 프로젝트는 어떻게 설명하나요?",
    answer:
      "성과 수치를 만들지 않고 문제 정의, 산출물, 의사결정, 검증 방식으로 설명합니다. 수치가 있는 경우에도 해당 프로젝트의 근거로만 제한해 사용합니다.",
  },
  {
    question: "공공/정책 경험은 PM과 어떻게 연결되나요?",
    answer:
      "복잡한 자료를 구조화하고 이해관계자 제약을 실행 가능한 문서로 바꾼 경험입니다. PM 업무에서는 이를 요구사항, 운영 조건, 사용자 흐름으로 번역합니다.",
  },
  {
    question: "본인이 직접 한 일과 팀 성과는 어떻게 구분하나요?",
    answer:
      "각 케이스에서 역할, 산출물, 의사결정 기여를 분리해 표기합니다. 팀 전체 성과처럼 보일 수 있는 표현은 피하고 맡은 범위와 근거 문서 중심으로 설명합니다.",
  },
  {
    question: "어떤 PM 역할에 가장 잘 맞나요?",
    answer:
      "Junior PM, APM, 서비스 기획, 공공/운영형 디지털 서비스, 내부 도구 기획처럼 요구사항 정리와 협업 기준 수립이 중요한 역할에 잘 맞습니다.",
  },
] as const;

export const pmFinalCta = {
  title: "제품 문제를 구조화하고 실행 가능한 범위로 정리하는 PM이 필요하다면",
  summary:
    "대표 프로젝트와 산출물 유형을 먼저 확인해 주세요. 확인 가능한 근거와 맡은 역할을 기준으로 설명하겠습니다.",
  links: [
    { label: "대표 프로젝트 보기", href: "#work" },
    { label: "이력서 보기", href: "/resume" },
    { label: "메일 보내기", href: "mailto:dlwo4367@gmail.com" },
  ],
} as const;

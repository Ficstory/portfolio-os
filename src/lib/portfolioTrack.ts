import type { Profile } from "@/data/profile";
import type { CareerCaseId } from "@/data/careerCases";

export type PortfolioTrackId =
  | "default"
  | "publicDigital"
  | "pm"
  | "policy"
  | "assembly";

export type PortfolioTrackPath =
  | "/"
  | "/public-digital"
  | "/pm"
  | "/policy"
  | "/assembly";

export type PortfolioTrackKind = "osHub" | "serviceCase" | "careerDocument";

export type PortfolioTrack = {
  id: PortfolioTrackId;
  label: string;
  path: PortfolioTrackPath;
  kind: PortfolioTrackKind;
  noIndex: boolean;
  canonicalPath: "/";
  profile: Profile;
  projectOrder: string[];
  careerCaseOrder: CareerCaseId[];
};

type ProjectLike = {
  id: string;
};

type CareerCaseLike = {
  id: string;
};

const defaultProfile: Profile = {
  "name": "이재호 / LEE JAEHO",
  "role": "공공·디지털 서비스 기획자",
  "headline": "공공자료를 분석하고, 소프트웨어 프로젝트의 요구사항 작성과 화면 구현을 맡았습니다.",
  "introduction": "부산참여연대에서 2021년 5월부터 2025년 2월까지 의정활동 평가보고서 작성, 예산·결산 분석과 행정사무감사 시민의제 실무를 맡았습니다. 이후 SSAFY에서 구독 관리·길안내·화상 게임·공연 추천 서비스를 기획하고 Android·웹 화면을 구현했습니다.",
  "strengths": [
    "의회 회의록과 예산·결산 자료를 검토해 보고서와 시민의제 자료를 작성했습니다.",
    "애낌과 부산이음길의 요구사항·화면명세를 구현 상태에 맞춰 갱신했습니다.",
    "화면의 선택 상태, API 요청 순서와 저장 실패 처리를 직접 구현했습니다."
  ],
  "focusKeywords": [
    "공공자료 분석",
    "요구사항",
    "화면명세",
    "접근성",
    "Android·웹",
    "API 연동"
  ],
  "currentFocus": "서비스 기획과 APM 직무를 준비하고 있습니다. 사용자 조사와 화면 구현 경험을 바탕으로, 필요한 기능과 완료 조건을 구체적으로 다루는 일을 하고 싶습니다."
};

const publicDigitalProfile: Profile = {
  "name": "이재호 / LEE JAEHO",
  "role": "공공·디지털 서비스기획 지원자",
  "headline": "공공자료 분석과 접근성 서비스 개발을 경험했습니다.",
  "introduction": "부산참여연대에서 의정활동 평가와 예산·결산 분석을 맡았습니다. SSAFY에서는 보행약자·저시력자를 위한 부산이음길의 기획 문서를 갱신하고, 글자 크기 설정과 지도 제보 표시를 구현했습니다.",
  "strengths": [
    "부산시의회 평가보고서와 행정사무감사 시민의제 자료를 작성했습니다.",
    "부산이음길의 사용자 유형별 화면과 제보 조건을 명세에 반영했습니다.",
    "Android 화면에서 데이터 표시·입력·API 연동을 다뤘습니다."
  ],
  "focusKeywords": [
    "공공자료 분석",
    "요구사항",
    "화면명세",
    "접근성",
    "Android·웹",
    "API 연동"
  ],
  "currentFocus": "이동·정보 접근성 문제를 다루는 공공 디지털 서비스 기획에 관심이 있습니다."
};

const pmProfile: Profile = {
  "name": "이재호 / LEE JAEHO",
  "role": "주니어 서비스 기획자 / APM 지원자",
  "headline": "조사와 요구사항 작성, 화면 구현을 함께 경험했습니다.",
  "introduction": "웃지마게임의 설문 분석과 기능명세, 애낌의 요구사항·화면명세 관리, Play Pick의 온보딩 구현을 맡았습니다. 프로젝트별로 제가 작성한 자료와 구현한 화면을 소개합니다.",
  "strengths": [
    "설문 응답을 분석해 친구 초대방을 우선하는 팀 기획에 반영했습니다.",
    "구독 후보 확인·수동 등록의 요구사항과 화면 상태를 정리했습니다.",
    "공연 취향의 선택·저장·완료 처리를 구현했습니다."
  ],
  "focusKeywords": [
    "공공자료 분석",
    "요구사항",
    "화면명세",
    "접근성",
    "Android·웹",
    "API 연동"
  ],
  "currentFocus": "서비스 기획과 APM 직무를 준비하고 있습니다. 사용자 조사와 화면 구현 경험을 바탕으로, 필요한 기능과 완료 조건을 구체적으로 다루는 일을 하고 싶습니다."
};

const policyProfile: Profile = {
  "name": "이재호 / LEE JAEHO",
  "role": "정책지원관 지원자",
  "headline": "조례·예산·의정활동을 검토하고 보고서를 작성했습니다.",
  "introduction": "부산참여연대 지방자치본부에서 3년 10개월간 일했습니다. 부산시의회 의정활동 평가, 예산·결산 분석, 행정사무감사 시민의제 발굴과 조례 입법예고 의견 취합을 맡았습니다.",
  "strengths": [
    "회의록과 안건을 검토해 의정활동 평가보고서를 작성했습니다.",
    "행정사무감사 시민의제를 취합하고 기자회견·의장 간담회 실무를 맡았습니다.",
    "조례 입법예고 의견과 예산·결산 분석 자료를 정리했습니다."
  ],
  "focusKeywords": [
    "조례 검토",
    "예산·결산",
    "행정사무감사 시민의제",
    "의정 모니터링",
    "보고서 작성"
  ],
  "currentFocus": "지방의회 자료 조사와 정책지원 문서 작성 업무에 지원하고 있습니다."
};

const assemblyProfile: Profile = {
  "name": "이재호 / LEE JAEHO",
  "role": "국회 보좌 실무 지원자",
  "headline": "의회 활동을 조사하고 쟁점과 근거를 문서로 정리했습니다.",
  "introduction": "부산참여연대에서 지방의회 모니터링, 의정활동 평가보고서와 시민의제 자료 작성을 맡았습니다. 회의 내용을 검토하고, 추가로 확인할 질문을 정리하며, 조사 결과를 발제와 인터뷰로 설명한 경험이 있습니다.",
  "strengths": [
    "지방의회 회의록·안건을 읽고 평가보고서와 후속 확인 항목을 정리했습니다.",
    "공무국외출장 자료를 비교하고 토론회에서 실태 분석을 발제했습니다.",
    "SW 프로젝트에서 화면·API·AI 기능을 다루며 기술 자료를 읽고 구현에 참여했습니다."
  ],
  "focusKeywords": [
    "이슈 조사",
    "회의 모니터링",
    "질의 쟁점",
    "발제·인터뷰",
    "디지털 이해"
  ],
  "currentFocus": "지방의회 조사·문서 작성 경험을 바탕으로 국회 보좌 실무에 지원하고 있습니다."
};

const defaultProjectOrder = [
  "busan-eumgil",
  "aekkim",
  "smile-game",
  "play-pick",
] as const;

const defaultCareerCaseOrder: CareerCaseId[] = [
  "participation-local-governance",
  "council-monitoring",
  "admin-audit-agenda",
  "ordinance-budget-policy-analysis",
  "official-trip-analysis",
  "policy-writing-briefing",
];

export const portfolioTracks = {
  default: {
    id: "default",
    label: "Public Digital Service",
    path: "/",
    kind: "osHub",
    noIndex: false,
    canonicalPath: "/",
    profile: defaultProfile,
    projectOrder: [...defaultProjectOrder],
    careerCaseOrder: [...defaultCareerCaseOrder],
  },
  publicDigital: {
    id: "publicDigital",
    label: "Public Digital Service Planning",
    path: "/public-digital",
    kind: "serviceCase",
    noIndex: true,
    canonicalPath: "/",
    profile: publicDigitalProfile,
    projectOrder: [...defaultProjectOrder],
    careerCaseOrder: [
      "participation-local-governance",
      "admin-audit-agenda",
      "ordinance-budget-policy-analysis",
      "policy-writing-briefing",
      "council-monitoring",
      "official-trip-analysis",
    ],
  },
  pm: {
    id: "pm",
    label: "Junior PM",
    path: "/pm",
    kind: "serviceCase",
    noIndex: true,
    canonicalPath: "/",
    profile: pmProfile,
    projectOrder: ["aekkim", "busan-eumgil", "smile-game", "play-pick"],
    careerCaseOrder: [
      "policy-writing-briefing",
      "participation-local-governance",
      "admin-audit-agenda",
      "ordinance-budget-policy-analysis",
      "council-monitoring",
      "official-trip-analysis",
    ],
  },
  policy: {
    id: "policy",
    label: "Policy Support Officer",
    path: "/policy",
    kind: "careerDocument",
    noIndex: true,
    canonicalPath: "/",
    profile: policyProfile,
    projectOrder: [...defaultProjectOrder],
    careerCaseOrder: [
      "participation-local-governance",
      "admin-audit-agenda",
      "ordinance-budget-policy-analysis",
      "council-monitoring",
      "official-trip-analysis",
      "policy-writing-briefing",
    ],
  },
  assembly: {
    id: "assembly",
    label: "Assembly Staff",
    path: "/assembly",
    kind: "careerDocument",
    noIndex: true,
    canonicalPath: "/",
    profile: assemblyProfile,
    projectOrder: [...defaultProjectOrder],
    careerCaseOrder: [
      "council-monitoring",
      "policy-writing-briefing",
      "participation-local-governance",
      "admin-audit-agenda",
      "ordinance-budget-policy-analysis",
      "official-trip-analysis",
    ],
  },
} as const satisfies Record<PortfolioTrackId, PortfolioTrack>;

export function resolvePortfolioTrack(trackId?: string): PortfolioTrack {
  if (trackId && trackId in portfolioTracks) {
    return portfolioTracks[trackId as PortfolioTrackId];
  }

  return portfolioTracks.default;
}

export function getTrackProfile(trackId?: string): Profile {
  return resolvePortfolioTrack(trackId).profile;
}

export function getTrackProjects<TProject extends ProjectLike>(
  projects: readonly TProject[],
  trackId?: string,
): TProject[] {
  const track = resolvePortfolioTrack(trackId);
  const orderById = new Map(
    track.projectOrder.map((projectId, index) => [projectId, index]),
  );

  return [...projects].sort((left, right) => {
    const leftOrder = orderById.get(left.id) ?? Number.POSITIVE_INFINITY;
    const rightOrder = orderById.get(right.id) ?? Number.POSITIVE_INFINITY;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return 0;
  });
}

export function getTrackCareerCases<TCareerCase extends CareerCaseLike>(
  careerCases: readonly TCareerCase[],
  trackId?: string,
): TCareerCase[] {
  const track = resolvePortfolioTrack(trackId);
  const orderById = new Map(
    track.careerCaseOrder.map((careerCaseId, index) => [careerCaseId, index]),
  );

  return [...careerCases].sort((left, right) => {
    const leftOrder = orderById.get(left.id as CareerCaseId) ?? Number.POSITIVE_INFINITY;
    const rightOrder = orderById.get(right.id as CareerCaseId) ?? Number.POSITIVE_INFINITY;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return 0;
  });
}

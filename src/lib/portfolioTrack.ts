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
  name: "이재호 / LEE JAEHO",
  role: "공공·디지털 서비스 기획자",
  headline:
    "공공·사회 문제를 현장 데이터로 분석하고, 사용자 요구를 요구사항·화면·API 기준으로 옮깁니다.",
  introduction:
    "부산참여연대에서 조례·예산·의정 자료를 분석해 복잡한 공공문제를 의사결정 가능한 문서와 의제로 만들었습니다. 이후 SSAFY SW·AI 과정에서 Android·Web 프로젝트의 기획과 프론트엔드를 맡으며, 문제 정의가 요구사항·화면 흐름·API 연동·MVP 범위로 이어지는 과정을 직접 다뤘습니다.",
  strengths: [
    "현장 자료와 설문 데이터를 기준화해 문제를 정의합니다.",
    "PRD, 요구사항정의서, 화면명세서로 실행 기준을 정리합니다.",
    "기획서를 쓰는 사람이 화면과 API도 만져본 경험으로 파트 간 해석 차이를 줄입니다.",
  ],
  focusKeywords: [
    "Public Digital Service",
    "Requirement Definition",
    "Problem Framing",
    "Product Documentation",
    "Accessibility",
    "Technical Understanding",
    "AI-assisted Workflow",
  ],
  currentFocus:
    "공공·AI 디지털서비스 기획과 주니어 서비스기획 직무에 맞춰, 정책 문제를 서비스 요구사항과 사용자 흐름으로 번역하는 역량을 정리하고 있습니다.",
};

const publicDigitalProfile: Profile = {
  name: defaultProfile.name,
  role: "공공·디지털 서비스기획자",
  headline:
    "공공 문제를 사용자 요구와 서비스 요구사항으로 번역하는 공공·디지털 서비스기획자입니다.",
  introduction:
    "부산참여연대에서 조례·예산·의정 자료를 분석하며 공공 문제의 맥락을 읽었고, SSAFY 프로젝트에서는 그 문제 정의를 요구사항, 화면 흐름, 기능 기준으로 옮기는 경험을 쌓았습니다. 공공 현장의 언어와 개발 협업의 언어를 함께 이해하는 기획자로 정리합니다.",
  strengths: [
    "공공자료와 현장 이슈에서 사용자 문제를 분리합니다.",
    "정책·행정 맥락을 서비스 요구사항과 화면 흐름으로 바꿉니다.",
    "기술 구현 경험을 바탕으로 개발팀과 협업 가능한 기준을 만듭니다.",
  ],
  focusKeywords: [
    "Public Digital Service",
    "GovTech",
    "Problem Framing",
    "Requirement Definition",
    "Service Flow",
    "Accessibility",
    "Policy Context",
  ],
  currentFocus:
    "공공·디지털 서비스기획 지원에 맞춰, 부산이음길과 부산참여연대 경험을 공공 문제 정의와 서비스 요구사항 번역 역량 중심으로 정리하고 있습니다.",
};

const pmProfile: Profile = {
  name: defaultProfile.name,
  role: "주니어 서비스 기획자 / APM",
  headline:
    "정책 분석과 SW 프로젝트 PM 경험을 바탕으로 문제를 실행 가능한 요구사항과 MVP 범위로 정리하는 주니어 서비스 기획자입니다.",
  introduction:
    "공공정책 현장에서 자료를 읽고 의사결정 문서로 구조화한 경험을 바탕으로, SSAFY 프로젝트에서는 요구사항정의서, 화면명세서, 기능명세서, 회의록을 통해 팀의 해석 차이를 줄이는 역할을 맡았습니다. 기술을 깊게 과시하기보다 화면, API, 데이터 흐름을 이해한 상태에서 제품 범위와 협업 기준을 명확히 만드는 데 집중합니다.",
  strengths: [
    "요구사항과 화면 흐름을 문서로 고정해 협업 기준을 만듭니다.",
    "설문과 피드백을 바탕으로 MVP 방향을 조정한 경험이 있습니다.",
    "PM 역할과 프론트엔드 구현을 함께 수행하며 개발 제약을 고려해 범위를 정리합니다.",
  ],
  focusKeywords: [
    "Junior PM",
    "MVP Scope",
    "Requirement Definition",
    "Screen Specification",
    "API Alignment",
    "Team Coordination",
    "Product Documentation",
  ],
  currentFocus:
    "주니어 서비스기획/APM 지원에 맞춰, 팀 프로젝트에서 남긴 요구사항 문서, 화면명세, 의사결정 로그, 구현 범위 조율 경험을 증빙 중심으로 정리하고 있습니다.",
};

const policyProfile: Profile = {
  name: defaultProfile.name,
  role: "정책지원관 지원자",
  headline:
    "조례·예산·행정사무감사·지역 의제를 분석해 실행 가능한 정책 문서로 정리하는 정책 실무자입니다.",
  introduction:
    "부산참여연대 지방자치본부에서 지방의회와 행정 의제를 다루며 자료 조사, 쟁점 정리, 보도자료·논평·발제문 작성 경험을 쌓았습니다. 정책지원관 트랙에서는 개발 프로젝트보다 의정감시, 행정사무감사 의제화, 조례·예산 분석, 정책문서 작성 경험을 우선 증빙합니다.",
  strengths: [
    "조례·예산·행정사무감사 자료에서 쟁점과 질의 포인트를 분리합니다.",
    "지역 현안과 정책 이슈를 회의자료와 대외 문서로 정리합니다.",
    "의회와 행정의 책임성 이슈를 시민이 이해할 수 있는 문장으로 바꿉니다.",
  ],
  focusKeywords: [
    "Policy Support",
    "Council Monitoring",
    "Administrative Audit",
    "Ordinance",
    "Budget Analysis",
    "Issue Brief",
    "Policy Writing",
  ],
  currentFocus:
    "정책지원관 지원에 맞춰, 부산참여연대 경력을 자료 조사·쟁점 정리·질의자료화·정책문서 작성 역량 중심으로 정리하고 있습니다.",
};

const assemblyProfile: Profile = {
  name: defaultProfile.name,
  role: "국회 보좌 실무 지원자",
  headline:
    "공공 이슈를 조사하고 입법·상임위·질의·메시지 자료로 구조화할 수 있는 보좌 실무자입니다.",
  introduction:
    "지방의회 의정감시와 시민사회 정책문서 작성 경험을 바탕으로, 공공 이슈를 빠르게 읽고 쟁점·근거·질의 방향·메시지로 정리하는 역량을 보여주는 트랙입니다. 국회 실무를 직접 수행했다고 과장하지 않고, 유사한 조사·문서화 경험과 디지털 이슈 이해 가능성을 분리해 제시합니다.",
  strengths: [
    "회의자료와 공공자료에서 질의 가능한 쟁점을 빠르게 추출합니다.",
    "보도자료, 논평, 발제문처럼 외부에 전달되는 문장 구조를 만듭니다.",
    "정책·지역·디지털 이슈를 조사하고 보좌 실무에 맞는 형태로 요약합니다.",
  ],
  focusKeywords: [
    "Assembly Staff",
    "Issue Research",
    "Standing Committee",
    "Policy Brief",
    "Question Drafting",
    "Message Writing",
    "Public Agenda",
  ],
  currentFocus:
    "국회 보좌 실무 지원에 맞춰, 의정감시와 정책문서 작성 경험을 이슈 조사·질의 방향 정리·메시지 구성 역량 중심으로 정리하고 있습니다.",
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

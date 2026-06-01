import type { Profile } from "@/data/profile";

export type PortfolioTrackId = "default" | "pm";

export type PortfolioTrack = {
  id: PortfolioTrackId;
  label: string;
  path: "/" | "/pm";
  noIndex: boolean;
  profile: Profile;
  projectOrder: string[];
};

type ProjectLike = {
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

export const portfolioTracks = {
  default: {
    id: "default",
    label: "Public Digital Service",
    path: "/",
    noIndex: false,
    profile: defaultProfile,
    projectOrder: ["busan-eumgil", "aekkim", "play-pick", "smile-game"],
  },
  pm: {
    id: "pm",
    label: "Junior PM",
    path: "/pm",
    noIndex: true,
    profile: pmProfile,
    projectOrder: ["aekkim", "busan-eumgil", "play-pick", "smile-game"],
  },
} as const satisfies Record<PortfolioTrackId, PortfolioTrack>;

export function resolvePortfolioTrack(trackId?: string): PortfolioTrack {
  if (trackId === "pm") {
    return portfolioTracks.pm;
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

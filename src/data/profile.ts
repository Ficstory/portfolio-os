export type Profile = {
  name: string;
  role: string;
  headline: string;
  introduction: string;
  strengths: string[];
  focusKeywords: string[];
  currentFocus: string;
};

export const profile: Profile = {
  name: "프론트엔드 개발자",
  role: "Frontend Developer",
  headline: "사용자 경험을 화면의 구조로 설계하고, 문제를 제품의 형태로 구현합니다.",
  introduction:
    "정적 포트폴리오 MVP를 기준으로 프로젝트, 기술 경험, 이력 요약을 탐색 가능한 화면 구조로 정리합니다.",
  strengths: [
    "정보 구조를 먼저 정리하고 화면 흐름으로 연결합니다.",
    "컴포넌트와 데이터를 분리해 유지보수 가능한 UI를 지향합니다.",
    "문제 상황과 해결 과정을 기록해 다음 구현에 재사용합니다.",
  ],
  focusKeywords: ["React", "Next.js", "TypeScript", "UI Architecture", "Accessibility"],
  currentFocus:
    "MVP 화면에서 사용할 콘텐츠를 검증 가능한 정적 데이터로 정리하는 데 집중하고 있습니다.",
};

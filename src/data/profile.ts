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

import type { ResumeSummary } from "@/types/portfolio";

export const resumeSummary: ResumeSummary = {
  headline:
    "공공정책 분석 3년 10개월과 SSAFY SW·AI 프로젝트 경험을 연결해, 문제를 요구사항·화면·API 기준으로 번역하는 기획자입니다.",
  strengths: [
    "조례·예산·의정 자료와 설문 데이터를 기준화해 문제를 정의합니다.",
    "PRD, 요구사항정의서, 화면명세서, 회의록으로 협업 기준을 남깁니다.",
    "프론트엔드 구현과 API 연동 경험을 바탕으로 개발 제약을 고려해 범위를 정리합니다.",
  ],
  projectHighlights: [
    {
      projectId: "busan-eumgil",
      summary:
        "이동약자·저시력자 길안내 문제를 PRD, 접근성 화면군, 경로 비교, 음성 UX 기준으로 정리했습니다.",
    },
    {
      projectId: "aekkim",
      summary:
        "팀장/PM으로 요구사항정의서와 화면명세서 변경 이력을 관리하고 구독 관리 기능의 FE/API 연동 기준을 맞췄습니다.",
    },
    {
      projectId: "smile-game",
      summary:
        "컨설턴트 피드백 이후 48시간 내 설문을 설계·배포하고 168개 응답을 분석해 MVP 방향을 조정했습니다.",
    },
  ],
  techSummary: [
    "React, Next.js, TypeScript는 웹 화면과 정적 콘텐츠 구조화에 사용합니다.",
    "Kotlin/Jetpack Compose, REST API 연동 경험을 통해 Android 화면 흐름과 API 제약을 이해합니다.",
    "Django/Vue.js 프로젝트와 배포 경험으로 기획에서 서비스 형태까지 이어지는 흐름을 경험했습니다.",
  ],
  educationAndActivities: [
    "부산참여연대 지방자치본부 2021.05~2025.02, 간사에서 팀장 역할 수행.",
    "SSAFY SW·AI 과정 기반 프로젝트 수행, 총 1,725시간 기준 역량 정리.",
    "동아시아학 학사.",
  ],
  pdfPath: "",
};

import type { ResumeSummary } from "@/types/portfolio";

export const resumeSummary: ResumeSummary = {
  headline: "사용자 경험을 화면의 구조로 설계하고, 문제를 제품의 형태로 구현합니다.",
  strengths: [
    "정보 구조와 화면 흐름을 함께 설계합니다.",
    "정적 데이터와 UI 컴포넌트의 책임을 분리합니다.",
    "문제 해결 과정을 기록하고 다음 구현에 반영합니다.",
  ],
  projectHighlights: [
    {
      projectId: "portfolio-os",
      summary: "포트폴리오 MVP가 사용할 About, Projects, Skills, Resume, Contact 콘텐츠 구조를 정리했습니다.",
    },
    {
      projectId: "frontend-collaboration",
      summary: "FE 구현 범위와 협업 전달사항을 분리해 작업 흐름을 명확히 하는 예시를 구성했습니다.",
    },
    {
      projectId: "problem-solving-archive",
      summary: "트러블슈팅 경험을 문제 정의부터 성과까지 같은 순서로 기록하는 구조를 마련했습니다.",
    },
  ],
  techSummary: [
    "Next.js, React, TypeScript 기반의 정적 포트폴리오 화면을 전제로 콘텐츠를 구성합니다.",
    "Tailwind CSS와 상태 관리 도구를 활용하는 FE 구현 흐름에 맞춰 데이터를 분리합니다.",
    "MDX와 TypeScript 데이터를 함께 사용해 상세 콘텐츠와 목록 데이터를 연결합니다.",
  ],
  educationAndActivities: [
    "교육, 활동, 수상 이력은 실제 자료 확인 후 업데이트할 예정입니다.",
    "현재 MVP에서는 검증되지 않은 세부 이력이나 정량 성과를 추가하지 않습니다.",
  ],
  pdfPath: "/resume/resume.pdf",
};

import type { Skill } from "@/types/portfolio";

export const skills: Skill[] = [
  {
    name: "Problem Framing",
    category: "problem-framing",
    level: "strong",
    description:
      "조례, 예산, 회의록, 설문 데이터를 기준화해 공공문제를 의사결정 가능한 쟁점으로 정리했습니다.",
    relatedProjects: ["busan-eumgil"],
  },
  {
    name: "Requirement Definition",
    category: "requirements",
    level: "comfortable",
    description:
      "AEKKIM 요구사항정의서와 화면명세서, 부산이음길 PRD를 기준으로 사용자 흐름과 MVP 범위를 정리했습니다.",
    relatedProjects: ["aekkim", "busan-eumgil"],
  },
  {
    name: "Stakeholder Communication",
    category: "stakeholder",
    level: "comfortable",
    description:
      "시민사회 네트워크 운영과 팀 프로젝트 PM 경험을 통해 이해관계자별 언어를 문서와 실행 기준으로 맞췄습니다.",
    relatedProjects: ["aekkim", "smile-game"],
  },
  {
    name: "Data-informed Planning",
    category: "data",
    level: "comfortable",
    description:
      "웃지마게임 설문 168개 응답 분석과 공공정책 설문 경험을 바탕으로 기획 방향을 검증하는 데 데이터를 사용했습니다.",
    relatedProjects: ["smile-game"],
  },
  {
    name: "Technical Understanding",
    category: "technical",
    level: "comfortable",
    description:
      "React, Next.js, TypeScript, Kotlin, REST API를 직접 다뤄 화면, API, 데이터 흐름의 제약을 이해합니다.",
    relatedProjects: ["busan-eumgil", "aekkim", "play-pick"],
  },
  {
    name: "Product Documentation",
    category: "documentation",
    level: "strong",
    description:
      "PRD, 요구사항정의서, 화면명세서, 기능명세서, 회의록, 브리핑, 보고서를 실무 산출물로 정리했습니다.",
    relatedProjects: ["aekkim", "busan-eumgil", "smile-game"],
  },
  {
    name: "AI-assisted Workflow",
    category: "ai",
    level: "used",
    description:
      "초안 작성, 요구사항 정리, 검토 프롬프트 구성처럼 작업 품질을 점검하는 보조 도구로 AI를 활용합니다.",
    relatedProjects: ["portfolio-os"],
  },
];

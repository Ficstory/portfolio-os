import type { Skill } from "@/types/portfolio";

export const skills: Skill[] = [
  {
    name: "Problem Framing",
    category: "problem-framing",
    level: "strong",
    description:
      "부산참여연대에서 예산·결산 자료와 의회 활동을 검토하고 의정평가 보고서를 작성했습니다.",
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
      "행정사무감사 시민의제와 조례 의견을 취합했습니다. 웃지마게임에서는 회의 결정과 기능 우선순위를 기록했습니다.",
    relatedProjects: ["aekkim", "smile-game"],
  },
  {
    name: "Data-informed Planning",
    category: "data",
    level: "comfortable",
    description:
      "웃지마게임 설문 168건에서 사용 의향과 얼굴 노출 부담을 분석하고 친구 매칭을 우선하는 팀 논의에 반영했습니다.",
    relatedProjects: ["smile-game"],
  },
  {
    name: "Technical Understanding",
    category: "technical",
    level: "comfortable",
    description:
      "애낌의 구독 후보 상태와 플레이픽의 취향 저장 API를 구현하며 로딩·실패·완료 조건을 다뤘습니다.",
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

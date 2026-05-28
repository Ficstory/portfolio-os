import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    id: "portfolio-os",
    slug: "portfolio-os",
    title: "Portfolio OS",
    summary:
      "개인 포트폴리오를 데스크톱 운영체제처럼 탐색할 수 있도록 구성하는 정적 웹 프로젝트입니다.",
    valueStatement:
      "단순 소개 페이지보다 프로젝트와 이력 정보를 더 빠르게 탐색할 수 있는 화면 구조를 목표로 합니다.",
    problem:
      "포트폴리오의 About, Projects, Skills, Resume, Contact 정보가 흩어지지 않도록 한 화면 경험 안에서 정리할 필요가 있었습니다.",
    role: ["정보 구조 설계", "정적 콘텐츠 모델링", "MVP 화면 데이터 준비"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand"],
    implementationHighlights: [
      "MVP에서 필요한 폴더형 섹션을 About, Projects, Skills, Resume, Contact로 제한했습니다.",
      "대표 프로젝트 3개를 동일한 데이터 구조로 관리할 수 있도록 정리했습니다.",
      "UI 컴포넌트가 링크 유무에 따라 버튼을 숨길 수 있도록 links 필드를 빈 객체로 둘 수 있게 했습니다.",
    ],
    troubleshooting: [
      "실제 이력 데이터가 부족한 상태에서는 정량 성과를 임의로 만들지 않고 샘플 콘텐츠임을 전제로 작성했습니다.",
      "상세 페이지와 목록 카드가 같은 프로젝트 데이터를 참조할 수 있도록 공통 필드를 우선했습니다.",
    ],
    result: [
      "MVP 화면 구현자가 바로 사용할 수 있는 프로젝트 데이터의 기준 구조를 마련했습니다.",
      "향후 실제 프로젝트 정보가 생기면 같은 필드에 값을 교체할 수 있습니다.",
    ],
    links: {},
    thumbnail: "",
    media: [],
    contentPath: "src/content/projects/project-01.mdx",
  },
  {
    id: "frontend-collaboration",
    slug: "frontend-collaboration",
    title: "Frontend Collaboration",
    summary:
      "프론트엔드 작업 흐름에서 요구사항, 컴포넌트 책임, 전달사항을 명확히 정리하는 협업 예시 프로젝트입니다.",
    valueStatement:
      "작업 범위와 의사결정 기록을 화면 구현에 연결해 협업 비용을 줄이는 방식을 보여줍니다.",
    problem:
      "FE 작업은 화면 구현뿐 아니라 요구사항 해석, 데이터 계약 확인, 변경 사항 공유가 함께 필요합니다.",
    role: ["요구사항 정리", "컴포넌트 책임 분리", "협업 전달사항 문서화"],
    stack: ["React", "TypeScript", "Figma", "Git", "Markdown"],
    implementationHighlights: [
      "화면 단위를 기준으로 필요한 데이터와 컴포넌트 책임을 분리했습니다.",
      "BE 작업이 필요한 항목은 FE 구현 범위와 분리해 전달할 수 있는 형태로 정리했습니다.",
      "커밋과 MR에서 작업 의도를 추적하기 쉽도록 변경 내용을 작은 단위로 나누는 방식을 사용했습니다.",
    ],
    troubleshooting: [
      "요구사항이 불명확한 부분은 임의 구현보다 확인이 필요한 항목으로 분리했습니다.",
      "문서와 실제 화면 구조가 달라질 수 있어 데이터 모델을 먼저 맞추는 방식으로 위험을 줄였습니다.",
    ],
    result: [
      "FE 구현자가 확인해야 할 작업 범위와 협업 포인트를 한눈에 볼 수 있게 정리했습니다.",
      "실제 프로젝트 정보가 확정되면 협업 사례와 결과를 구체적으로 대체할 수 있습니다.",
    ],
    links: {},
    thumbnail: "",
    media: [],
    contentPath: "src/content/projects/project-02.mdx",
  },
  {
    id: "problem-solving-archive",
    slug: "problem-solving-archive",
    title: "Problem Solving Archive",
    summary:
      "프론트엔드 구현 중 만난 문제를 원인, 시도, 해결, 배운 점으로 정리하는 아카이브형 프로젝트입니다.",
    valueStatement:
      "문제 해결 과정을 프로젝트 상세 콘텐츠로 남겨 기술 선택과 구현 판단의 근거를 보여줍니다.",
    problem:
      "트러블슈팅 경험은 시간이 지나면 맥락이 사라지기 쉬워, 포트폴리오에서 재사용 가능한 구조로 정리할 필요가 있습니다.",
    role: ["문제 상황 구조화", "해결 과정 기록", "재사용 가능한 콘텐츠 템플릿 정리"],
    stack: ["TypeScript", "MDX", "Markdown", "ESLint", "Next.js"],
    implementationHighlights: [
      "문제 정의, 내 역할, 기술 스택, 주요 구현, 트러블슈팅, 성과, 링크 순서로 상세 콘텐츠를 통일했습니다.",
      "블로그나 노트 기능을 만들지 않고 MVP 프로젝트 상세 콘텐츠 안에서만 문제 해결 맥락을 다룹니다.",
      "정량 성과가 없는 항목은 확인 가능한 변화와 다음 업데이트 계획 중심으로 작성했습니다.",
    ],
    troubleshooting: [
      "아카이브가 블로그 기능처럼 확장되지 않도록 MVP 범위를 프로젝트 상세 콘텐츠로 제한했습니다.",
      "샘플 콘텐츠가 실제 성과처럼 보이지 않도록 표현을 보수적으로 조정했습니다.",
    ],
    result: [
      "프로젝트 상세 페이지가 같은 순서의 문제 해결 구조를 가질 수 있게 되었습니다.",
      "향후 실제 사례를 추가할 때 과장 없이 맥락 중심으로 확장할 수 있습니다.",
    ],
    links: {},
    thumbnail: "",
    media: [],
    contentPath: "src/content/projects/project-03.mdx",
  },
];

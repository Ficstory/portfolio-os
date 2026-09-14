export type ResumeEntry = {
  title: string;
  organization: string;
  period?: string;
  detail?: string;
  bullets?: readonly string[];
};

export const career: ResumeEntry = {
  title: "지방자치·재정감시 실무",
  organization: "부산참여연대",
  period: "2021.05–2025.02",
  detail: "팀장 · 2024.03–2025.02 / 간사 · 2021.05–2024.03",
  bullets: [
    "부산시 예산·결산 분석, 부산시의회 의정활동 평가 보고서 작성",
    "행정사무감사 시민의제 발굴, 조례 입법예고 의견 취합·정리",
    "시민의제 제안 기자회견과 시의회 의장단 간담회 운영 지원",
  ],
};

export const education: readonly ResumeEntry[] = [
  {
    title: "졸업",
    organization: "국립한국해양대학교 동아시아학과",
    period: "2022.08",
    detail: "국제지역학사",
  },
  {
    title: "수료",
    organization: "삼성청년SW·AI아카데미 SSAFY",
    period: "2025.07–2026.06",
    detail: "총 1,628시간 · 코딩·알고리즘 및 SW·AI 프로젝트",
  },
  {
    title: "수강 중",
    organization: "신세계 퓨처앤드림아카데미",
    detail: "고객의 상품 선택과 구매 행동을 데이터로 이해하기 위한 학습",
  },
];

export const activities: readonly ResumeEntry[] = [
  {
    title: "위원 위촉",
    organization: "부산진구 청년네트워크",
    period: "2025.02–2025.12",
  },
  {
    title: "위원 위촉",
    organization: "부산진구 의정비심의위원회",
    period: "2024.02–2025.01",
  },
  {
    title: "2022 청년거버넌스 참여자",
    organization: "부산청년정책네트워크",
    period: "2022.02–2022.12",
  },
];

export const skills = [
  { label: "개발", items: "Python, Django, Kotlin, Jetpack Compose" },
  { label: "디자인·협업", items: "Figma, Notion, Slack, Git, Jira" },
] as const;

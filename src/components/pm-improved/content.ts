export type PmProject = {
  slug: string;
  name: string;
  serviceType: string;
  headline: string;
  subtitle: string;
  category: string;
  award?: string;
  title: [string, string];
  summary: string;
  contribution: string;
  caption: string;
  problem: string;
  role: string;
  actions: string[];
  result: string;
  decision?: string;
  period: string;
  team?: string;
  teamRole?: string;
  strengths: string[];
};

export const aekkimAward = "프로젝트 우수상";

export const selectedProjects: PmProject[] = [
  {
    slug: "busan-eumgil",
    name: "부산이음길",
    serviceType: "보행약자 길안내 앱",
    headline: "보행약자의 이동 조건을 고려한 길안내",
    subtitle:
      "부산의 보행약자와 저시력자를 위해 이동 조건과 접근성 설정을 반영한 길안내 앱입니다.",
    category: "초기 기획·기관 인터뷰 · 프론트엔드 개발",
    title: ["현장에서 들은 이동 조건을 정리하고,", "지도와 길안내 흐름을 구현했습니다."],
    summary:
      "부산의 보행약자와 저시력자를 위해 이동 조건과 접근성 설정을 반영한 길안내 앱입니다.",
    contribution: "기관 연락·인터뷰 · PRD 작성 · 지도·경로·음성 안내 구현",
    caption: "기관 인터뷰부터 지도·경로·음성 안내까지 맡은 일",
    problem:
      "사용자별 이동 조건과 화면 이용 조건을 서비스 화면에 반영해야 했습니다.",
    role: "서비스 기획 · 기관 인터뷰 · Android 개발",
    actions: [
      "기관에 직접 연락해 인터뷰를 진행하고 요구를 PRD로 정리했습니다.",
      "지도·경로 탐색·음성 안내의 데이터와 상태 흐름을 구현했습니다.",
      "백엔드와 기능별 API 연동을 합의하고 인증·계정 전환의 예외를 처리했습니다.",
    ],
    result:
      "PRD와 기능명세, 지도·경로·TTS 구현, 인증 복구와 계정별 상태 정리 코드를 남겼습니다.",
    decision:
      "이동 조건에 따라 안전한 길과 최단거리를 비교하도록 요구사항을 구체화했습니다.",
    period: "2026.04~2026.05",
    team: "7인 팀",
    strengths: ["현장 인터뷰", "요구사항 구체화", "지도·경로 연동"],
  },
  {
    slug: "aekkim",
    name: "AEKKIM · 애낌",
    serviceType: "Android 구독 관리 앱",
    headline: "이용 중인 구독과 매달 나가는 비용을 한눈에",
    subtitle:
      "여러 구독 서비스의 비용과 결제일을 한곳에서 확인하고 관리하는 앱입니다.",
    category: "팀장 · 요구사항 관리 · Android 개발",
    award: `${aekkimAward} · 팀 수상`,
    title: ["이용 중인 구독과", "매달 나가는 비용을 한눈에"],
    summary: "여러 구독 서비스의 비용과 결제일을 한곳에서 확인하고 관리하는 앱입니다.",
    contribution: "팀장 · 요구사항·화면명세 · 인증·구독·AI 분석 연동",
    caption: "구독 관리 화면 데모 · 오프라인 · 예시 데이터 사용",
    problem:
      "결제 내역에서 찾은 구독 후보를 사용자가 확인하고 목록에 등록하는 흐름이 필요했습니다.",
    role: "팀장 · 요구사항 관리 · Android 개발",
    actions: [
      "요구사항과 화면명세를 구현 상태에 맞춰 갱신했습니다.",
      "인증·구독 관리와 AI 분석 결과의 후보 확인 흐름을 연결했습니다.",
      "알림·체크인의 중복·실패·재진입 처리를 구현했습니다.",
    ],
    result:
      "화면과 데이터 처리 기준을 명세에 반영하고, 주요 흐름의 테스트 코드와 QA 계획을 남겼습니다.",
    decision:
      "구독 후보의 제외·중복과 요청 실패를 화면 상태와 처리 기준에 반영했습니다.",
    period: "2026.03",
    strengths: ["요구사항 관리", "상태·예외 설계", "QA 계획"],
  },
  {
    slug: "smile-game",
    name: "웃지마게임",
    serviceType: "실시간 화상 게임",
    headline: "친구와 실시간 화상으로 겨루는 웃음 참기 게임",
    subtitle:
      "AI가 웃음을 감지하고, 친구 초대와 랜덤 매칭으로 대결하는 서비스입니다.",
    category: "조사·우선순위 판단",
    title: ["친구와 실시간으로 겨루는", "웃음 참기 게임"],
    summary:
      "AI가 웃음을 감지하고, 친구 초대와 랜덤 매칭으로 대결하는 서비스입니다.",
    contribution: "설문 문항·분석 · 기능명세 · 친구 초대 흐름 · 발표자료 제작",
    caption: "설문 분석과 친구 초대방 구현 과정 요약 · 설문 보고서·구현 기록 기반",
    problem:
      "게임에 대한 흥미와 실제 참여 의향 사이에 얼굴 공개 부담이 있었습니다.",
    role: "PM · 사용자 조사 · 프론트엔드 개발",
    actions: [
      "설문 문항을 작성하고 168건의 응답에서 참여 장벽을 분석했습니다.",
      "기획서·기능명세와 발표자료를 작성했습니다.",
      "친구 초대의 로그인 복귀와 대기실 참가자·준비 상태를 구현하고 수정했습니다.",
    ],
    result:
      "설문 분석 보고서와 기능명세, 발표자료를 만들고 친구 초대·입장·대기 흐름을 구현했습니다.",
    decision:
      "흥미와 실제 참여 의향을 나눠 보고, 카메라 노출 부담을 줄일 친구 대결과 안전 장치를 제안했습니다.",
    period: "2026.01~2026.02",
    team: "7인 팀",
    strengths: ["사용자 조사·분석", "기능 우선순위", "초대방 구현"],
  },
  {
    slug: "play-pick",
    name: "Play Pick",
    serviceType: "공연 추천 웹 서비스",
    headline: "취향에 맞는 공연을 탐색하는 추천 서비스",
    subtitle:
      "가입 직후 취향을 수집해 첫 공연 탐색을 돕는 추천 서비스입니다.",
    category: "입력·저장 흐름",
    title: ["취향에 맞는 공연을 탐색하는", "추천 서비스"],
    summary: "가입 직후 취향을 수집해 첫 공연 탐색을 돕는 추천 서비스입니다.",
    contribution: "팀장 / 화면 설계·FE 구현 / 온보딩 API 연동",
    caption: "서비스 화면 재현 데모 · 예시 데이터 사용",
    problem:
      "이용 기록이 없는 신규 사용자의 첫 추천에 활용할 취향 정보가 필요했습니다.",
    role: "팀장 · 온보딩 화면 설계·프론트엔드 개발",
    actions: [
      "온보딩의 선택 상태를 구현했습니다.",
      "응답 저장과 완료 처리를 연결했습니다.",
      "저장 뒤 추천 화면으로 이동하게 했습니다.",
    ],
    result: "개인: 온보딩의 선택·저장·완료·추천 조회 흐름을 연결했습니다.",
    period: "2025.12",
    team: "2인 팀",
    teamRole: "핵심 검색·추천 엔진 개발",
    strengths: ["온보딩 설계", "화면·데이터 흐름", "프론트엔드 개발"],
  },
];

export const workingPrinciples = [
  {
    title: "이동 조건을 묻고, 길안내의 기준을 정리했습니다",
    text: "부산이음길 · 기관 인터뷰, PRD, 지도·경로 연동",
    project: "부산이음길",
    href: "/PM/busan-eumgil/",
  },
  {
    title: "변경된 동작을 명세와 예외 처리에 반영했습니다",
    text: "애낌 · 요구사항 관리, 구독·인증·알림 흐름",
    project: "애낌",
    href: "/PM/aekkim/",
  },
  {
    title: "게임에 대한 흥미와 참여 부담을 따로 살폈습니다",
    text: "웃지마게임 · 설문 분석, 기능 우선순위, 친구 초대",
    project: "웃지마게임",
    href: "/PM/smile-game/",
  },
  {
    title: "사용자 행동이 데이터에 정확히 반영되도록",
    text: "Play Pick의 입력·저장 흐름",
    project: "Play Pick",
    href: "/PM/play-pick/",
  },
];

export const survey = {
  total: 168,
  signals: {
    interest: 92,
    willingToParticipate: 75,
  },
  responses: [
    { label: "매우 부담됨", count: 56 },
    { label: "꽤 부담됨", count: 56 },
    { label: "조금 부담됨", count: 35 },
    { label: "보통", count: 13 },
    { label: "전혀 부담 없음", count: 8 },
  ],
};

export const pmMedia = {
  previews: {
    aekkim: { poster: "/pm/previews/aekkim.webp", video: "/pm/previews/aekkim.mp4" },
    busan: { poster: "/pm/previews/busan.webp", video: "/pm/previews/busan.mp4" },
    smile: { poster: "/pm/previews/smile.webp", video: "/pm/previews/smile.mp4" },
    "play-pick": { poster: "/pm/previews/play-pick.webp", video: "/pm/previews/play-pick.mp4" },
  },
  evidence: {
    aekkimDashboard: "/pm-improved/evidence/aekkim-dashboard-original.jpg",
    aekkimCandidateReview: "/pm-improved/evidence/aekkim-candidate-review-capture.png",
    aekkimPromotion: "/pm-improved/evidence/aekkim-promotion-original.jpg",
    busanMap: "/pm-improved/evidence/busan-route-map.png",
    busanUserType: "/pm/busan-low-vision.png",
    busanMeeting: "/pm-improved/evidence/busan-mvp-meeting.png",
  },
} as const;

export const subscriptionFlow = [
  { title: "감지", description: "결제 내역 분석" },
  { title: "후보", description: "확인할 항목 분리" },
  { title: "사용자 확인", description: "등록 대상 확인·제외" },
  { title: "목록 등록", description: "앱의 구독 목록에 반영" },
];

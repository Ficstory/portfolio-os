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
    title: ["초기 기획부터 MVP 선정까지 맡고,", "길안내 지도 화면을 구현했습니다."],
    summary:
      "부산의 보행약자와 저시력자를 위해 이동 조건과 접근성 설정을 반영한 길안내 앱입니다.",
    contribution: "서비스 기획 · 기관 섭외·인터뷰 · MVP 선정 · 프론트엔드 개발",
    caption: "기여 요약 · 초기 기획부터 MVP 선정과 길안내 지도 개발",
    problem:
      "사용자별 이동 조건과 화면 이용 조건을 서비스 화면에 반영해야 했습니다.",
    role: "서비스 기획 · 기관 섭외·인터뷰 · MVP 선정 · 프론트엔드 개발",
    actions: [
      "서비스를 처음부터 기획하고, 함세상 장애인자립생활센터를 직접 섭외했습니다.",
      "센터와의 미팅·인터뷰를 바탕으로 MVP 범위를 선정했습니다.",
      "길안내 지도 위 마커를 고정하는 동작과 관련 프론트엔드를 구현했습니다.",
      "글자 크기 설정·승인된 제보 표시를 구현하고 관련 명세를 관리했습니다.",
    ],
    result:
      "개인: 초기 기획과 기관 섭외·인터뷰를 거쳐 MVP 범위를 선정하고, 길안내 지도의 마커 고정 동작을 포함한 프론트엔드를 구현했습니다. 팀: 보행약자를 위한 길안내 앱을 함께 구현했습니다.",
    period: "2026.04~2026.05",
    team: "7인 팀",
    strengths: ["초기 기획·MVP 선정", "기관 인터뷰", "길안내 지도 구현"],
  },
  {
    slug: "aekkim",
    name: "AEKKIM · 애낌",
    serviceType: "Android 구독 관리 앱",
    headline: "이용 중인 구독과 매달 나가는 비용을 한눈에",
    subtitle:
      "여러 구독 서비스의 비용과 결제일을 한곳에서 확인하고 관리하는 앱입니다.",
    category: "요구사항·구현 연결",
    award: `${aekkimAward} · 팀 수상`,
    title: ["이용 중인 구독과", "매달 나가는 비용을 한눈에"],
    summary: "여러 구독 서비스의 비용과 결제일을 한곳에서 확인하고 관리하는 앱입니다.",
    contribution: "PM / 요구사항·화면명세 관리 / Android 화면 구현",
    caption: "구독 관리 화면 데모 · 오프라인 · 예시 데이터 사용",
    problem:
      "결제 내역에서 찾은 구독 후보를 사용자가 확인하고 목록에 등록하는 흐름이 필요했습니다.",
    role: "PM·FE",
    actions: [
      "요구사항과 화면명세를 구현 상태에 맞춰 갱신했습니다.",
      "후보 확인 화면과 제외 상태를 구현했습니다.",
      "중복 후보와 확인 대기 건수 표시를 수정했습니다.",
    ],
    result:
      "개인: 변경된 처리 기준을 요구사항·화면명세와 후보 확인 화면에 반영했습니다. 팀: Android MVP를 완성해 프로젝트 우수상을 받았습니다.",
    period: "2026.03",
    strengths: ["요구사항 관리", "개발 이해", "개발 협업"],
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
    contribution: "PM / 설문·기능명세 / 친구 초대방 구현",
    caption: "설문 분석과 친구 초대방 구현 과정 요약 · 설문 보고서·구현 기록 기반",
    problem:
      "게임에 대한 흥미와 실제 참여 의향 사이에 얼굴 공개 부담이 있었습니다.",
    role: "PM · 사용자 조사 · 프론트엔드 개발",
    actions: [
      "설문을 설계하고 168건의 응답을 분석했습니다.",
      "팀 논의를 바탕으로 기능 우선순위와 결정 기록을 정리했습니다.",
      "친구 초대방의 생성·입장·대기 화면을 구현했습니다.",
    ],
    result:
      "개인: 설문 분석과 결정 기록을 남기고 친구 초대방 생성·입장·대기 흐름을 구현했습니다. 팀: 친구 초대와 랜덤 매칭을 포함한 실시간 화상 게임을 구현했습니다.",
    period: "2026.01~2026.02",
    team: "7인 팀",
    teamRole: "웃음 판정 모델·배틀 연동",
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
    title: "초기 기획과 인터뷰를 MVP와 화면 구현으로 이어가도록",
    text: "부산이음길의 기관 섭외·인터뷰·MVP 선정·길안내 지도 개발",
    project: "부산이음길",
    href: "/PM/busan-eumgil/",
  },
  {
    title: "문서와 구현 상태가 일치하도록",
    text: "애낌의 요구사항·화면명세 관리 사례",
    project: "애낌",
    href: "/PM/aekkim/",
  },
  {
    title: "조사 결과가 기능 선택으로 이어지도록",
    text: "웃지마게임의 조사와 우선순위 사례",
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

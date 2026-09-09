export type PmProject = {
  slug: string;
  name: string;
  category: string;
  title: [string, string];
  summary: string;
  contribution: string;
  caption: string;
};

export const selectedProjects: PmProject[] = [
  {
    slug: "aekkim",
    name: "AEKKIM",
    category: "구독 관리 Android MVP",
    title: ["함께 만들 기준부터", "맞췄습니다."],
    summary: "요구사항과 화면명세, API 조건을 연결해 구독 관리의 실행 기준을 정리했습니다.",
    contribution: "PM / 요구사항·화면명세 / FE 구현",
    caption: "프로젝트 원본 구독 상세 목업과 요구사항 기반 흐름 재구성. 목업의 금액은 예시입니다.",
  },
  {
    slug: "busan-eumgil",
    name: "부산이음길",
    category: "이동약자를 위한 길안내",
    title: ["가장 가까운 길보다,", "실제로 갈 수 있는 길을 정의했습니다."],
    summary: "이동 조건과 정보 접근 방식을 나눠 접근성 시설, 경로 비교, 음성 안내를 사용자 흐름으로 연결했습니다.",
    contribution: "서비스 기획 / 사용자 흐름 / FE 구현 참여",
    caption: "원본 저장소의 저시력자 흐름 시연 썸네일. 실제 경로의 통행 가능성을 검증한 자료는 아닙니다.",
  },
  {
    slug: "smile-game",
    name: "웃지마게임",
    category: "사용자 리서치와 MVP 조정",
    title: ["아이디어를 고집하는 대신,", "168명의 응답에서 방향을 찾았습니다."],
    summary: "화상 게임의 재미와 얼굴 노출 부담을 따로 확인하고, 사용자 반응을 바탕으로 MVP 방향을 조정했습니다.",
    contribution: "PM / 설문 설계 / 기능명세",
    caption: "설문 분석 리포트 Q9의 응답 수를 재구성했습니다. 사용자의 부담을 묻는 조사이며 서비스 성과 지표가 아닙니다.",
  },
  {
    slug: "play-pick",
    name: "Play Pick",
    category: "공연 탐색 웹 프로젝트",
    title: ["흩어진 공연 정보를", "탐색 가능한 구조로 연결했습니다."],
    summary: "공연 데이터와 사용자 취향을 연결하고 Vue.js 화면과 Django REST API로 탐색 흐름을 구현한 보조 사례입니다.",
    contribution: "기획·개발 / REST API 연동",
    caption: "기존 프로젝트 기록 기반의 탐색 구조 요약. 실제 제품 화면은 추가 정리 중입니다.",
  },
];

export const workingPrinciples = [
  { title: "문제와 기능 요청을 분리합니다.", text: "화상 게임의 흥미와 참여 부담을 따로 묻고, 만들고 싶은 기능에 앞서 사용 조건을 확인했습니다.", project: "웃지마게임", href: "/pm/smile-game/" },
  { title: "MVP에서 검증할 범위를 정합니다.", text: "모든 이동 상황을 한 화면에 담기보다, 사용자 유형과 안내 방식에 따라 필요한 흐름을 나눴습니다.", project: "부산이음길", href: "/pm/busan-eumgil/" },
  { title: "팀이 공유할 실행 기준을 만듭니다.", text: "구독 후보와 확정된 구독을 구분하고, 화면의 행동이 어떤 데이터 변경으로 이어지는지 맞췄습니다.", project: "AEKKIM", href: "/pm/aekkim/#decision" },
  { title: "구현 결과를 보고 다시 판단합니다.", text: "알림 권한과 수신 설정의 의미가 섞인 문제를 QA 기록으로 남기고, 상태와 안내 문구를 분리했습니다.", project: "AEKKIM QA", href: "/pm/aekkim/#results" },
];

// Source: 260115_설문조사결과_분석.pdf, p.7, Q9. Counts, not rounded percentages.
export const survey = {
  total: 168,
  responses: [
    { label: "매우 부담됨", count: 56 },
    { label: "꽤 부담됨", count: 56 },
    { label: "조금 부담됨", count: 35 },
    { label: "보통", count: 13 },
    { label: "전혀 부담 없음", count: 8 },
  ],
};

export const subscriptionFlow = [
  { title: "감지", description: "결제 내역 분석" },
  { title: "후보", description: "확인할 항목 분리" },
  { title: "사용자 확인", description: "제외하거나 연결" },
  { title: "구독 생성", description: "목록에 반영" },
];

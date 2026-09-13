export type PmProject = {
  slug: string;
  name: string;
  category: string;
  award?: string;
  title: [string, string];
  summary: string;
  contribution: string;
  caption: string;
};

export const aekkimAward = "프로젝트 우수상";

export const selectedProjects: PmProject[] = [
  {
    slug: "aekkim",
    name: "AEKKIM",
    category: "구독 관리 Android MVP",
    award: `${aekkimAward} · 팀 수상`,
    title: ["구독 후보 확인을", "화면과 API로 구현했습니다."],
    summary: "애낌은 결제 내역과 앱 사용 정보를 바탕으로 구독을 관리하는 Android 앱입니다. 요구사항·화면명세를 갱신하고, 후보 확인과 수동 등록 화면의 구현·API 연동을 맡았습니다.",
    contribution: "PM / 요구사항·화면명세 관리 / Android 화면 구현",
    caption: "결제 후보를 서비스에 연결한 뒤 구독 목록·월 합계·상세를 확인하는 흐름입니다. 기존 앱 UI에 예시 데이터를 넣은 오프라인 데모입니다.",
  },
  {
    slug: "busan-eumgil",
    name: "부산이음길",
    category: "이동약자를 위한 길안내",
    title: ["이동 조건별 길안내,", "화면과 명세를 맞췄습니다."],
    summary: "부산의 보행약자·저시력자를 위한 길안내 앱입니다. 팀원으로 기획 문서를 갱신하고, 글자 크기 설정과 승인 제보의 지도 표시 등 Android 화면 작업을 맡았습니다.",
    contribution: "기획 문서·요구사항 갱신 / Android 화면 구현",
    caption: "사용자 유형과 보행 조건을 선택하고 화면 설정으로 이어지는 원본 온보딩 시연입니다.",
  },
  {
    slug: "smile-game",
    name: "웃지마게임",
    category: "사용자 리서치와 MVP 조정",
    title: ["얼굴 노출 부담을 확인하고,", "친구 초대를 우선했습니다."],
    summary: "AI가 웃음을 감지하는 실시간 화상 대결 게임입니다. 설문 설계와 168건의 응답 분석, 기획·기능명세 작성을 맡고, 친구 초대방의 생성·입장·대기 화면을 구현했습니다.",
    contribution: "PM / 설문·기능명세 / 친구 초대방 구현",
    caption: "친구 초대방에서 두 사용자가 준비를 마치고 게임을 시작하는 장면입니다. 원본 녹화의 대기 구간을 줄인 편집본입니다.",
  },
  {
    slug: "play-pick",
    name: "Play Pick",
    category: "2인 팀 · 공연 추천 웹 서비스",
    title: ["첫 추천을 위한", "취향 수집을 구현했습니다."],
    summary: "가입 직후 공연 취향을 묻는 추천 웹 서비스입니다. 2인 팀에서 화면 설계와 프론트엔드 구현, 온보딩의 응답 저장·완료 처리, 마이페이지 API 연동을 맡았습니다.",
    contribution: "팀장 / 화면 설계·FE 구현 / 온보딩 API 연동",
    caption: "공연에 대한 호불호 8개를 저장하고 첫 추천을 확인하는 로컬 데모입니다. 예시 계정과 보관된 공연 데이터를 사용합니다.",
  },
];

export const workingPrinciples = [
  { title: "흥미와 사용 의향을 따로 묻습니다.", text: "웃지마게임 설문에서 재미에 대한 반응과 얼굴 공개 부담을 함께 조사했습니다. 분석 결과는 친구 초대방을 먼저 만드는 팀 결정의 근거가 됐습니다.", project: "웃지마게임", href: "/pm/smile-game/" },
  { title: "화면과 명세의 차이를 확인합니다.", text: "부산이음길의 제보 상태와 사진 업로드 조건을 기획서·기능명세에 반영하고, 구현 완료와 추가 확인 항목을 요구사항명세서에 구분했습니다.", project: "부산이음길", href: "/pm/busan-eumgil/" },
  { title: "화면의 상태와 표시 개수를 맞춥니다.", text: "애낌의 초기 구독 확인 화면과 후보 제외 상태를 구현했습니다. 이후 중복 후보 노출과 수동 확인 후 남은 결제 건수 표시를 수정했습니다.", project: "AEKKIM", href: "/pm/aekkim/#implementation" },
  { title: "사용자의 응답이 데이터에 담기는 과정을 봅니다.", text: "Play Pick에서 ‘모르겠어요’를 비선호와 구분하고, 호불호 선택 수에 따라 완료 버튼과 취향 저장 요청을 처리했습니다.", project: "Play Pick", href: "/pm/play-pick/#implementation" },
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

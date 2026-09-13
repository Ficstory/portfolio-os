export type ProjectDetail = {
  label: string;
  text: string;
  sources?: Array<{ label: string; href: string }>;
};

export const decorationAssets = {
  moon: "/pm1/decorations/moon.png",
  orb: "/pm1/decorations/orb.png",
  blocks: "/pm1/decorations/blocks.png",
  arrowShape: "/pm1/decorations/arrow.png",
} as const;

export const heroCharacter = {
  src: "/pm1/character/jaeho-1040.webp",
  srcSet:
    "/pm1/character/jaeho-640.webp 640w, /pm1/character/jaeho-1040.webp 1040w",
  width: 1040,
  height: 1040,
  alt: "이재호를 표현한 3D 캐릭터",
} as const;

export type Pm1Project = {
  number: string;
  name: string;
  category: string;
  title: string;
  description: string;
  role: string;
  summary: string;
  output: string;
  buttonLabel: string;
  accent: string;
  details: ProjectDetail[];
  evidenceNote?: string;
};

export const capabilities = [
  {
    number: "01",
    title: "문제와 기준 정리",
    description:
      "공개 자료와 프로젝트 정보를 비교해, 무엇을 확인하고 결정해야 하는지 문서로 정리했습니다.",
  },
  {
    number: "02",
    title: "요구사항·화면 문서화",
    description:
      "애낌에서 요구사항, 화면명세, 실행 기준과 QA 문서를 작성하고 기능의 의미를 정리했습니다.",
  },
  {
    number: "03",
    title: "설문과 사용자 관점",
    description:
      "웃지마게임에서 설문을 설계·배포·분석하고, 응답 결과를 매칭 방식과 MVP 우선순위 논의에 반영했습니다.",
  },
  {
    number: "04",
    title: "팀 의사결정 기록",
    description:
      "조사 결과와 팀 논의를 회의록·기획·명세 문서로 연결하고, 합의한 우선순위를 정리했습니다.",
  },
  {
    number: "05",
    title: "프론트엔드 QA",
    description:
      "애낌에서 구독 후보 제외 상태와 중복 후보, 결제 건수 표시를 확인하고 수정했습니다.",
  },
] as const;

export const projects: Pm1Project[] = [
  {
    number: "01",
    name: "애낌",
    category: "서비스 기획 · 프론트엔드 QA",
    title: "요구사항과 화면 동작 사이의 불일치를 정리하다",
    description:
      "결제내역과 앱 사용정보를 바탕으로 구독을 정리하고, 추천·체크인·해지 안내를 제공하는 Android 앱입니다.",
    role: "요구사항·화면명세 현행화, 구독 후보 확인 화면 구현·수정",
    summary:
      "구독 분석 뒤 후보를 확인하는 화면에서, 후보 제외 상태와 중복 후보 처리를 구현·수정했습니다. 알림 토글 개선은 별도의 팀 QA 사례로 구분했습니다.",
    output: "구독 후보 확인 화면·요구사항 문서와 개인 Git 구현 기록",
    buttonLabel: "프로젝트 살펴보기",
    accent: "violet",
    evidenceNote:
      "아래 문장은 공개된 요구사항·화면명세·구현 기록을 바탕으로 사이트에서 재구성한 요약입니다. 알림 권한·수신 토글 개선은 팀 QA 기록상 김응서 팀원의 문서·구현 기여로, 이 사례의 개인 구현 범위와 분리했습니다.",
    details: [
      {
        label: "흐름과 확인 범위",
        text: "요구사항은 분석 완료 뒤 감지된 구독 후보를 확인하고 대시보드로 진행하도록 정합니다. 화면명세도 후보 목록·요약 문구·다음 CTA를 구독 확인 화면의 요소로 제시합니다.",
        sources: [
          { label: "애낌 요구사항정의서: 분석·구독 후보 확인", href: "/pm/sources/aekkim-requirements.txt" },
          { label: "애낌 화면명세서: SCR-002-2 구독 확인", href: "/pm/sources/aekkim-screens.txt" },
        ],
      },
      {
        label: "개인 구현 범위",
        text: "공개 구현 기록은 이재호의 초기 화면·후보 제외 상태, 후보 중복, 결제 건수 수정 기여를 구분합니다. 실제 구독 생성 요청과 실패 처리는 다른 팀원의 기여로 명시돼 있습니다.",
        sources: [
          { label: "구독 확인 구현 기록: 기여 구분", href: "/pm/sources/aekkim-implementation.txt" },
        ],
      },
      {
        label: "팀 QA 사례 · 문제와 판단",
        text: "시스템 알림 권한은 허용돼 있는데 앱의 수신 토글은 꺼져 보일 수 있었습니다. 두 상태를 같은 의미로 보여 주면 혼동을 일으키므로, 기기의 권한과 앱 내 체크인·혜택 수신 선택을 구분해야 한다는 개선 방향이 팀 QA 기록에 남아 있습니다.",
        sources: [
          { label: "팀 QA 기록 1번: 알림 권한·수신 토글", href: "/pm/sources/aekkim-qa.txt" },
        ],
      },
      {
        label: "팀 QA 사례 · 수정과 확인 범위",
        text: "시스템 권한 상태를 별도로 표시하고, 체크인·혜택 토글에 앱 내 수신 설정이라는 안내를 더하며, 권한이 꺼져 있으면 기기 설정으로 연결하는 내용입니다. 확인된 산출물은 김응서 팀원의 개선 문서·구현 기록입니다. 이재호의 개인 수정 성과나 사용자 혼동 감소를 입증하는 결과로 제시하지 않습니다.",
        sources: [
          { label: "팀 QA 기록: 알림 개선의 기여 구분", href: "/pm/sources/aekkim-qa.txt" },
        ],
      },
    ],
  },
  {
    number: "02",
    name: "웃지마게임",
    category: "사용자 조사 · MVP 기획",
    title: "설문 결과를 기능 우선순위 논의로 연결하다",
    description: "실시간 화상 대결로 웃음 참기를 즐기는 게임입니다.",
    role: "팀 내 PM·프론트엔드, 설문 설계·배포·분석과 기획·회의·명세 문서 작성",
    summary:
      "168건의 사전 설문에서 확인된 얼굴 노출 부담을 공유하고, 친구 매칭 우선·랜덤 매칭 병행·방 기능 우선이라는 팀 합의를 문서로 정리했습니다.",
    output: "설문 분석과 팀 합의가 반영된 회의·기획 문서",
    buttonLabel: "프로젝트 살펴보기",
    accent: "cobalt",
    evidenceNote:
      "아래 문장은 설문 분석 보고서와 회의·기획 기록을 바탕으로 사이트에서 재구성한 요약입니다. 매칭 방식과 우선순위는 팀 회의 결정입니다.",
    details: [
      {
        label: "문제",
        text: "사전 설문 168건에서 얼굴 노출이 ‘매우 부담됨’ 또는 ‘꽤 부담됨’이라고 답한 응답은 112건(66.7%)이었습니다. 화상 게임의 매칭 흐름을 논의할 근거가 필요했습니다.",
        sources: [
          { label: "웃지마게임 설문 분석: Q9 얼굴 노출 부담", href: "/pm/sources/smile-survey.txt" },
        ],
      },
      {
        label: "본인 역할",
        text: "팀 내 PM·프론트엔드로 참여해 설문을 설계·배포·분석하고 기획·회의·명세 문서를 작성했습니다.",
        sources: [
          { label: "기획 변경·역할·구현 기록: 팀 역할", href: "/pm/sources/smile-decisions.txt" },
        ],
      },
      {
        label: "판단 근거와 실행",
        text: "설문 분석을 근거로 공유한 뒤, 팀은 친구·지인 매칭을 우선하고 랜덤 매칭을 병행하기로 했습니다. 친구 방을 먼저 만들고 이후 랜덤 매칭을 붙이는 순서도 팀 회의에서 합의했습니다.",
        sources: [
          { label: "기획 변경 기록: 친구 매칭·랜덤 매칭·방 기능 순서", href: "/pm/sources/smile-decisions.txt" },
        ],
      },
      {
        label: "확인된 산출물",
        text: "설문 분석과 팀 합의가 반영된 회의·기획 문서",
        sources: [
          { label: "웃지마게임 설문 분석 보고서 발췌", href: "/pm/sources/smile-survey.txt" },
          { label: "웃지마게임 기획 변경·역할·구현 기록", href: "/pm/sources/smile-decisions.txt" },
        ],
      },
    ],
  },
  {
    number: "03",
    name: "부산참여연대",
    category: "공개 자료 분석 · 보고서 작성",
    title: "공개 자료를 비교하고 검토 가능한 보고서로 정리하다",
    description: "공개 자료를 분석하고 평가 보고서와 제안으로 정리한 업무 경험입니다.",
    role: "예산·결산 분석, 의정활동 평가 보고서 작성, 시민의제 실무와 조례 의견 취합·정리",
    summary:
      "2022~2023년 부산 16개 구·군의회 공무국외출장을 비용·일정·참여 인원·방문 국가·결과보고서로 비교해, 토론회 발제와 개선 쟁점으로 정리했습니다.",
    output: "공무국외출장 비교 분석과 2023년 토론회 발제",
    buttonLabel: "작업 사례 살펴보기",
    accent: "amber",
    evidenceNote:
      "아래 문장은 공개 보도와 공개 가능한 경력증명서 업무 항목 요약을 바탕으로 사이트에서 재구성한 요약입니다. 비교 항목은 기사에 보도된 범위이며, 원본 분석 보고서 전문은 공개 자료에 포함되지 않습니다.",
    details: [
      {
        label: "과제",
        text: "부산 기초의회 공무국외출장이 목적에 맞게 운영됐는지 검토하기 위해, 2022~2023년 16개 구·군의회의 출장 자료를 비교하는 토론회 발제를 맡았습니다.",
        sources: [
          { label: "부산참여연대 재직 기간·담당 업무 요약", href: "/pm/sources/career-scope.txt" },
          { label: "2023 토론회 보도: 부산 기초의회 공무국외출장", href: "https://www.fnnews.com/news/202310171700556015" },
        ],
      },
      {
        label: "비교 기준",
        text: "공개 보도에서 확인되는 비교 항목은 의회별 출장 비용, 일정, 의원·동행 공무원 수, 방문 국가입니다. 출장 결과보고서의 충실도와 심사 절차도 검토 쟁점으로 제시했습니다.",
        sources: [
          { label: "2023 토론회 보도: 비용·일정·인원·보고서·심사", href: "https://www.fnnews.com/news/202310171700556015" },
        ],
      },
      {
        label: "정리와 제안",
        text: "비교 결과를 토론회 발제로 정리했습니다. 토론회에서는 심사·결과보고 과정에 시민 참여를 보장하는 개선 방향이 논의됐습니다. 기사에 소개된 다른 참석자의 제안은 개인 기여와 구분하며, 제도 개정이나 정책 반영 결과를 뜻하지 않습니다.",
        sources: [
          { label: "2023 토론회 보도: 발제와 개선 방향", href: "https://www.fnnews.com/news/202310171700556015" },
        ],
      },
      {
        label: "확인된 산출물",
        text: "2023년 10월 17일 공무국외출장 문제와 대안 토론회 발제 보도와, 예산·결산 분석·의정활동 평가보고서 작성 등이 확인되는 담당 업무 요약입니다.",
        sources: [
          { label: "2023 토론회 보도: 이재호 발제 확인", href: "https://www.fnnews.com/news/202310171700556015" },
          { label: "부산참여연대 재직 기간·담당 업무 요약", href: "/pm/sources/career-scope.txt" },
        ],
      },
    ],
  },
];

export const aboutCopy =
  "안녕하세요, 이재호입니다. 기획 문서를 작성하고, 프론트엔드 QA로 화면의 표시와 동작을 확인해 왔습니다. 애낌에서는 요구사항과 화면의 의미를 정리하고 불일치를 수정했습니다. 웃지마게임에서는 설문 결과를 팀의 기능 우선순위 논의에 반영했습니다. 부산참여연대에서는 공개 자료를 비교하고 보고서와 제안으로 정리했습니다.";

export const portfolioCopy = {
  heroHeading: "HI, I'M JAEHO",
  heroIntroLines: ["문제와 요구사항을 정리하고,", "실제 화면의 동작까지 확인합니다."],
  heroSubtitle: "이재호 · 주니어 PM 포트폴리오",
  primaryCtaLabel: "프로젝트 보기",
  projectsIntro: "자료를 읽고 기준을 세운 뒤, 팀의 결정과 실제 화면을 연결한 세 가지 경험입니다.",
  contactTitle: "LET'S TALK",
  contactBody: "프로젝트에서 맡은 역할과 판단 과정을 더 자세히 이야기하고 싶습니다.",
  contactSignature: "이재호 · PM Portfolio",
} as const;

export const contactLinks = {
  email: "mailto:dlwo4367@gmail.com",
  resume: "/resume/",
} as const;

export const axProjects = [
  { slug: "jos", name: "J-OS", category: "Personal AI Agent · 기획·개발·운영", title: ["대화와 자료를 다음 업무의", "맥락과 실행으로 연결했습니다."], summary: "개인용 AI Agent 플랫폼을 직접 만들고 운영했습니다. 기억·지식 검색에서 역할별 검토와 실행 상태까지 연결하며, 필요한 근거가 전달되지 않는 문제를 고정 평가로 개선했습니다.", contribution: "개인 프로젝트 · React·Vite / TypeScript·Fastify / SQLite", caption: "실제 J-OS 컴포넌트에 합성 원문·모델 결과를 넣은 UI 검증 화면입니다." },
  { slug: "busan-eumgil", name: "부산이음길", category: "Android · 기획·기관 인터뷰·FE", title: ["이동 조건이 다른 사용자에게,", "필요한 안내도 달라야 했습니다."], summary: "기관 인터뷰의 요구를 경로 선택과 화면·음성 안내로 옮겼습니다. Kotlin·Jetpack Compose에서 지도·경로 데이터와 TTS, 사용자 설정을 연결했습니다.", contribution: "2026.04–05 · 7인 팀 / 기획·인터뷰·Android FE", caption: "원본 앱 온보딩 시연. 사용자 유형·보행 조건·글씨 크기·안내 방식을 설정합니다." },
  { slug: "aekkim", name: "애낌", category: "Android · 팀장·PM·FE", title: ["AI가 찾은 구독 후보를,", "사용자의 확인과 등록으로 연결했습니다."], summary: "결제 준비·규칙 판정·AI 분석·결과 전달의 흐름을 통합했습니다. 후보 확인과 서비스 연결 화면을 만들고, 사용자가 제외한 항목이 다시 나타나는 상태 문제를 보완했습니다.", contribution: "2026.03 · 5인 팀 / 팀장·PM·Android FE", caption: "기존 앱 UI를 예시 결제 데이터로 실행한 오프라인 데모. 실제 결제 수집·AI 추론 시연과 구분합니다." },
] as const;
export type AxSlug = typeof axProjects[number]["slug"];

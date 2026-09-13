export type Profile = {
  name: string;
  role: string;
  headline: string;
  introduction: string;
  strengths: string[];
  focusKeywords: string[];
  currentFocus: string;
};

export const profile: Profile = {
  "name": "이재호 / LEE JAEHO",
  "role": "공공·디지털 서비스 기획자",
  "headline": "공공자료를 분석하고, 소프트웨어 프로젝트의 요구사항 작성과 화면 구현을 맡았습니다.",
  "introduction": "부산참여연대에서 2021년 5월부터 2025년 2월까지 의정활동 평가보고서 작성, 예산·결산 분석과 행정사무감사 시민의제 실무를 맡았습니다. 이후 SSAFY에서 구독 관리·길안내·화상 게임·공연 추천 서비스를 기획하고 Android·웹 화면을 구현했습니다.",
  "strengths": [
    "의회 회의록과 예산·결산 자료를 검토해 보고서와 시민의제 자료를 작성했습니다.",
    "애낌과 부산이음길의 요구사항·화면명세를 구현 상태에 맞춰 갱신했습니다.",
    "화면의 선택 상태, API 요청 순서와 저장 실패 처리를 직접 구현했습니다."
  ],
  "focusKeywords": [
    "공공자료 분석",
    "요구사항",
    "화면명세",
    "접근성",
    "Android·웹",
    "API 연동"
  ],
  "currentFocus": "서비스 기획과 APM 직무를 준비하고 있습니다. 사용자 조사와 화면 구현 경험을 바탕으로, 필요한 기능과 완료 조건을 구체적으로 다루는 일을 하고 싶습니다."
};

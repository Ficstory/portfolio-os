# daydream 레퍼런스 기반 `/public-digital/` 개편 적용계획

작성일: 2026-06-09  
대상 페이지: `http://localhost:3000/public-digital/`  
목표 직무: 공공 디지털 서비스 기획자  
참고 레퍼런스: <https://www.withdaydream.com/>, <https://www.withdaydream.com/method>

## 1. 목적

이 문서는 withdaydream.com의 포트폴리오/서비스 소개 형식을 참고해, 현재 포트폴리오 사이트의 **공공 디지털 서비스 기획자 트랙만** 개편하기 위한 실행 계획이다.

이번 개편의 대상은 `/public-digital/` 페이지다. `/pm`, `/policy`, `/assembly`, `/`, `/resume`, `/projects/[slug]`의 기존 정보구조와 톤은 이번 작업 범위에 포함하지 않는다.

핵심 목표는 단순 프로젝트 나열형 페이지를 넘어서, 지원자가 공공 문제를 어떤 방식으로 읽고, 사용자 요구와 서비스 요구사항으로 번역하며, 개발 협업 가능한 산출물로 정리하는지를 보여주는 **방법론 중심 포트폴리오**로 바꾸는 것이다.

## 2. daydream 사이트 형식 분석

daydream 사이트는 작업물 갤러리형 포트폴리오가 아니다. 구조적으로는 다음에 가깝다.

- 문제 정의형 랜딩
- 운영모델 소개
- 전문성 방법론
- 케이스 스터디
- 플레이북/라이브러리
- 신뢰 증거

홈페이지는 "SEO가 어렵다"는 문제를 먼저 제시한 뒤, 전문가와 AI 에이전트, 운영 루프를 결합한 해결 방식을 설명한다. Method 페이지는 자신들의 접근법을 단계와 원칙으로 분해한다. 케이스 스터디는 개별 작업물을 나열하기보다, 문제를 어떻게 구조화했고 어떤 방식으로 결과를 만들었는지를 설명한다.

따라서 이 레퍼런스에서 가져올 것은 시각적 장식보다 다음의 설득 구조다.

- "나는 무엇을 만들었는가"보다 "나는 어떤 방식으로 문제를 해결하는가"를 먼저 보여준다.
- 케이스 스터디는 방법론의 증거로 배치한다.
- 실무자가 실제로 묻는 질문을 섹션으로 만들고, 그 질문에 대한 접근법을 보여준다.
- 전문성을 일회성 프로젝트가 아니라 반복 가능한 운영모델로 설명한다.
- 문서, 체크리스트, 브리프, 프레임워크를 라이브러리처럼 축적해 보인다.

## 3. 공공 디지털 서비스 기획자 포트폴리오에 맞춘 변환 원칙

daydream의 SEO/그로스 언어를 그대로 가져오면 안 된다. 공공 디지털 서비스 기획자 포트폴리오에서는 다음처럼 번역해야 한다.

| daydream 요소 | `/public-digital/` 적용 방식 |
| --- | --- |
| SEO is hard to win | 공공 서비스는 사용자, 행정 절차, 접근성, 정보 구조가 엉키면 쉽게 실패한다 |
| AI agents + experts | 공공자료 분석 + 사용자 흐름 설계 + 서비스 요구사항 문서화 + 개발 협업 |
| Growth operating model | 공공 디지털 서비스 기획 운영모델 |
| Keyword opportunity | 시민 문제, 정책 자료, 민원, 현장 이슈에서 서비스 기회 찾기 |
| Technical SEO | 접근성, 정보 구조, 화면 흐름, 신청/이용 절차 개선 |
| Content velocity | PRD, 요구사항정의서, 화면명세, 정책 브리프를 빠르게 구조화하는 역량 |
| Case studies | 부산이음길, AEKKIM, 공공자료 분석 경험을 문제-판단-산출물-증빙으로 정리 |
| Playbooks | 공공 서비스 진단 체크리스트, 요구사항 템플릿, 접근성 UX 분석 노트 |

개편 후 페이지는 "공공 서비스를 직접 운영했다"는 식으로 과장하면 안 된다. 지원자의 실제 강점은 공공 문제를 읽고, 서비스 기획 언어와 개발 협업 문서로 옮긴 경험이다.

## 4. 이번 작업 범위

### 포함

- `/public-digital/` 페이지의 정보구조 개편
- 공공 디지털 서비스 기획자용 Hero 문구 개선
- daydream식 운영모델 섹션 추가
- 실무 질문형 섹션 추가
- 공공 디지털 서비스 기획 방법론 섹션 추가
- 부산이음길 중심의 케이스 스터디 배치 강화
- 문서/증빙 라이브러리 섹션 추가
- `/public-digital/` 페이지에서만 보이는 CTA, 증빙, 주의 문구 정리

### 제외

- `/pm` 페이지 개편
- `/policy` 페이지 개편
- `/assembly` 페이지 개편
- 홈 데스크톱 OS 메타포 개편
- 전체 디자인 시스템 전면 개편
- 프로젝트 상세 페이지 전면 개편
- 검증되지 않은 정량 성과 추가
- 백엔드 기능, CMS, 연락처 폼 추가

## 5. 현재 코드 기준 적용 위치

현재 `/public-digital/`는 다음 흐름으로 렌더링된다.

```txt
src/app/public-digital/page.tsx
└─ TrackLandingPage trackId="publicDigital"
   ├─ TrackHero
   ├─ TrackCaseSection
   └─ TrackProofPanel
```

관련 파일:

- `src/app/public-digital/page.tsx`
- `src/components/tracks/TrackLandingPage.tsx`
- `src/components/tracks/TrackHero.tsx`
- `src/components/tracks/TrackCaseSection.tsx`
- `src/components/tracks/TrackProofPanel.tsx`
- `src/components/tracks/trackLandingModel.ts`
- `src/lib/portfolioTrack.ts`
- `src/data/projects.ts`
- `src/data/careerCases.ts`

권장 방식은 기존 공용 트랙 컴포넌트를 무리하게 바꾸지 않고, `publicDigital` 전용 섹션 데이터를 별도 파일로 만들고 `/public-digital/`에서만 렌더링하는 것이다.

추천 신규 파일:

```txt
src/data/publicDigitalMethod.ts
src/components/tracks/PublicDigitalEvidenceStrip.tsx
src/components/tracks/PublicDigitalOperatingModel.tsx
src/components/tracks/PublicDigitalQuestionSection.tsx
src/components/tracks/PublicDigitalMethodSection.tsx
src/components/tracks/PublicDigitalEvidenceLibrary.tsx
src/components/tracks/PublicDigitalFinalCta.tsx
```

공유 컴포넌트를 수정해야 한다면 `track.id === "publicDigital"` 조건으로만 새 섹션이 나타나게 한다.

## 6. 목표 정보구조

개편 후 `/public-digital/`는 다음 순서가 적합하다.

```txt
1. Hero
2. Evidence Strip
3. Operating Model
4. Public Service Questions
5. Method Framework
6. Case Studies
7. Evidence Library
8. Proof / Caution
9. Final CTA
```

현재 구조가 `Hero -> Case Studies -> Proof`라면, 개편 후에는 `Hero -> 방법론 -> 질문 -> 사례 -> 증빙`의 설득 흐름으로 바뀐다.

## 7. 섹션별 상세 설계

### 7.1 Hero

목적: 방문자가 5초 안에 "이 사람은 공공 문제를 디지털 서비스 요구사항으로 번역하는 기획자"라고 이해하게 한다.

권장 H1:

```txt
공공 문제를 사용자 흐름과 서비스 요구사항으로 번역하는 기획자
```

권장 설명:

```txt
조례·예산·의정 자료를 읽고 쟁점을 구조화한 경험을 바탕으로, 접근성·행정 절차·사용자 요구를 PRD, 화면 흐름, API 협업 기준으로 옮깁니다.
```

권장 CTA:

- `대표 사례 보기`
- `운영모델 보기`
- `이력서 보기`

주의:

- "공공 서비스를 혁신했다" 같은 성과 단정 표현 금지
- "정책을 개선했다" 같은 권한 과장 금지
- 실제 산출물과 판단 과정을 중심으로 표현

### 7.2 Evidence Strip

daydream의 고객 로고/성과 수치 영역을 포트폴리오용 신뢰 근거 스트립으로 바꾼다.

추천 항목:

```txt
공공자료 분석
PRD·요구사항정의서
접근성 서비스 흐름
화면명세·API 협업
정책 브리프 작성
Android/Web 구현 이해
```

이 섹션은 숫자 과시가 아니라 "어떤 증거 묶음이 있는 사람인가"를 압축해서 보여주는 역할이다.

### 7.3 Operating Model

이 섹션이 daydream 적용의 핵심이다. 개인 포트폴리오이지만, 본인의 반복 가능한 업무 방식을 운영모델처럼 제시한다.

추천 5단계:

```txt
1. Public Context
공공자료, 정책 문서, 현장 이슈에서 문제의 제도적 맥락을 파악합니다.

2. User Framing
시민, 담당자, 이해관계자의 관점에서 실제 사용 문제를 분리합니다.

3. Service Requirements
문제를 요구사항, 화면 흐름, 기능 기준, 접근성 조건으로 번역합니다.

4. Delivery Alignment
개발자가 구현할 수 있도록 PRD, 화면명세, API 협업 기준으로 정리합니다.

5. Evidence & Iteration
문서 산출물, 프로토타입, 피드백, 지표를 기준으로 개선 방향을 잡습니다.
```

각 카드에는 다음 필드를 권장한다.

- 단계명
- 한 문장 설명
- 산출물
- 관련 증빙

### 7.4 Public Service Questions

daydream의 "실무 질문에 답하는 섹션"을 공공 디지털 서비스 기획자용으로 바꾼다.

추천 질문:

```txt
Q1. 이 문제가 정말 디지털 서비스로 풀 문제인가?
Q2. 사용자는 행정 절차의 어느 지점에서 막히는가?
Q3. 이동약자·저시력자·정보취약계층의 조건은 기능으로 어떻게 바뀌는가?
Q4. 정책 목표와 사용자 편의가 충돌할 때 무엇을 우선할 것인가?
Q5. MVP에 반드시 들어가야 할 기능과 나중에 미룰 기능은 무엇인가?
Q6. 개발팀이 오해하지 않도록 요구사항을 어떻게 고정할 것인가?
Q7. 출시 후 어떤 지표와 피드백으로 개선할 것인가?
```

각 질문은 다음 구조로 렌더링한다.

```txt
질문
내 접근
주요 산출물
관련 프로젝트/경력 증빙
```

예시:

```txt
질문: 사용자는 행정 절차의 어느 지점에서 막히는가?
내 접근: 신청 전 정보 탐색, 신청 중 입력 부담, 신청 후 상태 확인을 분리해 봅니다.
산출물: 사용자 여정 지도, 서비스 블루프린트, 화면 흐름도
증빙: 부산이음길 접근성 경로 흐름, 부산참여연대 공공자료 분석 경험
```

### 7.5 Method Framework

daydream의 Method 페이지를 `/public-digital/` 안에 압축해 넣는 섹션이다.

추천 프레임:

```txt
Discovery
공공자료, 민원, 정책 문서, 현장 문제를 읽습니다.

Definition
사용자 문제, 행정 제약, 이해관계자 요구를 분리합니다.

Translation
문제를 요구사항, 화면 흐름, 기능 기준으로 바꿉니다.

Specification
PRD, 화면명세, API 협업 기준, 접근성 조건을 문서화합니다.

Pilot
프로토타입, 시연 흐름, MVP 범위로 검증합니다.

Improvement
피드백, 사용성 문제, 운영 지표를 바탕으로 다음 개선안을 만듭니다.
```

이 섹션은 화려한 타임라인보다, 공공 서비스 기획 산출물의 흐름이 명확히 보이도록 구성한다.

### 7.6 Case Studies

기존 `TrackCaseSection`을 유지하되, `/public-digital/`에서는 케이스 카드가 운영모델의 증거로 읽히게 해야 한다.

권장 우선순위:

1. 부산이음길
   - 공공 접근성 문제를 요구사항과 화면 흐름으로 번역한 대표 사례
   - 이동약자, 저시력자, 접근성 시설, 안전/최단 경로, TTS/STT를 연결

2. AEKKIM
   - 요구사항정의서, 화면명세, API 협업 기준을 맞춘 PM형 협업 사례
   - 공공성은 낮지만 개발 협업 문서화 역량 증빙으로 사용

3. 웃지마게임
   - 설문, 사용자 검증, MVP 피봇 경험
   - 소재보다 의사결정 과정만 강조

4. Play Pick
   - 데이터 구조화와 서비스 탐색 흐름 보조 사례
   - 우선순위는 낮음

각 카드에서 강조할 필드:

- 문제
- 내 판단
- 산출물
- 협업 방식
- 증빙
- 표현 주의

### 7.7 Evidence Library

daydream의 Library를 공공 디지털 기획자용 산출물 라이브러리로 바꾼다.

추천 항목:

```txt
공공 서비스 요구사항정의서 샘플
접근성 사용자 흐름 분석
정책 이슈 → 서비스 요구사항 변환 노트
행정 절차 UX 진단 체크리스트
PRD / 화면명세 / API 협업 기준 예시
정책 브리프형 문제정의 문서
```

공개가 어려운 자료는 `sanitized`, `internal` 상태를 표시한다.

추천 표시 방식:

```txt
공개 가능
익명화 필요
내부 증빙
```

### 7.8 Proof / Caution

현재 `TrackProofPanel`은 유지할 수 있다. 다만 문구는 더 전략적으로 조정한다.

Proof Focus 추천:

```txt
부산이음길 PRD·요구사항정의서
접근성 화면 흐름과 음성 UX 설계
부산참여연대 공공자료 분석 경험
AEKKIM 요구사항·화면명세 변경 이력
정책 브리프/질의자료형 문서 작성 경험
```

Caution 추천:

```txt
정책 성과처럼 보이는 표현은 피하고, 실제 산출물과 기획 판단 중심으로 설명합니다.
운영기관처럼 보이는 표현은 쓰지 않고, 프로젝트 내 역할과 협업 범위를 명확히 합니다.
검증되지 않은 정량 성과는 반복 노출하지 않습니다.
```

### 7.9 Final CTA

목적은 채용 담당자가 다음 행동을 하기 쉽게 하는 것이다.

추천 CTA:

- `부산이음길 사례 보기`
- `이력서 보기`
- `메일 보내기`

문구:

```txt
공공 문제를 서비스 요구사항으로 바꾸는 과정을 더 자세히 보고 싶다면, 부산이음길 사례와 이력서 요약을 함께 확인해 주세요.
```

## 8. 데이터 모델 제안

신규 파일 `src/data/publicDigitalMethod.ts` 예시:

```ts
export type PublicDigitalOperatingStep = {
  title: string;
  summary: string;
  deliverables: string[];
  evidence: string[];
};

export type PublicDigitalQuestion = {
  question: string;
  approach: string;
  deliverables: string[];
  evidence: string[];
};

export type PublicDigitalMethodPhase = {
  title: string;
  description: string;
  output: string;
};

export type PublicDigitalLibraryItem = {
  title: string;
  type: "brief" | "prd" | "flow" | "checklist" | "case-note";
  summary: string;
  visibility: "public" | "sanitized" | "internal";
};
```

데이터는 컴포넌트 내부에 하드코딩하지 말고, 이 파일에서 관리한다.

## 9. 디자인 방향

현재 사이트의 디자인 시스템을 크게 바꾸지 않는다.

권장:

- 흰색/밝은 회색 기반
- `sky` 계열은 공공 디지털/서비스 강조
- `green` 계열은 증빙/가능성
- `coral` 계열은 주의/리스크
- 카드 radius는 8px 이하
- 섹션은 full-width band 또는 넓은 unframed layout
- 문서형 요소는 표, 체크리스트, 브리프 미리보기 형태 사용

피할 것:

- SaaS 랜딩처럼 과한 마케팅 문구
- 카드 안의 카드 중첩
- 보라/파랑 그라데이션 위주의 장식
- 검증되지 않은 성과 수치
- 정책 결정권자처럼 보이는 표현

## 10. 검증 기준

구현 후 다음을 확인한다.

- `http://localhost:3000/public-digital/`에서 새 섹션이 보이는가
- `/pm`, `/policy`, `/assembly`의 기존 구조가 의도치 않게 바뀌지 않았는가
- 모바일 폭에서 문장과 버튼이 겹치지 않는가
- `npm run lint`가 통과하는가
- 가능하면 `npm run build`가 통과하는가
- 공공 디지털 서비스 기획자 메시지가 PM/정책지원관/국회보좌관 메시지와 섞이지 않는가
- 검증되지 않은 숫자나 과장 표현이 없는가

## 11. 구현 우선순위

### 1순위

`/public-digital/`에 운영모델, 실무 질문, 방법론 섹션을 추가한다.

### 2순위

Hero와 Proof/Caution 문구를 공공 디지털 서비스 기획자 중심으로 정리한다.

### 3순위

Evidence Library를 추가한다.

### 4순위

부산이음길 프로젝트 카드가 대표 사례로 읽히도록 카드 문구와 배치를 조정한다.

### 5순위

모바일/데스크톱 시각 검증 후 spacing, line-height, wrapping 문제를 수정한다.

## 12. 구현 프롬프트 파일

구현 프롬프트는 별도 파일로 분리한다. 프롬프트 본문은 계획 내용을 반복하지 않고, 이 계획서를 먼저 읽고 `/public-digital/`만 작업하라는 실행 지시만 담는다.

프롬프트 파일:

```txt
docs/2026-06-09_public_digital_implementation_prompt.md
```

## 13. 최종 판단

withdaydream.com의 레퍼런스는 공공 디지털 서비스 기획자 포트폴리오에 적용할 수 있다. 다만 사이트의 외형을 복제하는 것이 아니라, "전문성이 작동하는 방식"을 먼저 제시하는 구조를 가져와야 한다.

이 프로젝트에서는 `/public-digital/`만 daydream식 방법론 중심 구조로 개편하고, PM/정책지원관/국회보좌관 트랙은 별도 직무 논리에 맞게 유지하는 것이 가장 안전하다.

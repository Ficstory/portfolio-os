# Portfolio Track Blueprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `ficstory.dev/`는 기존 통합 OS형 허브로 유지하고, 지원 직무별 URL인 `/public-digital/`, `/pm/`, `/policy/`, `/assembly/`에서 서로 다른 설득 논리와 콘텐츠 순서를 가진 포트폴리오 화면을 제공한다.

**Architecture:** Next.js App Router 기반 정적 사이트에서 단일 데이터 소스와 공통 트랙 렌더러를 사용한다. 프로젝트형 트랙은 `projects.ts`를 재정렬하고, 정책·의정형 트랙은 새 `careerCases.ts` 데이터를 중심으로 문서형 화면을 렌더링한다. `/`는 기존 OS 경험을 유지하되 직무별 트랙 링크를 제공하는 통합 허브로만 보강한다.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, existing contract tests with `node --test`, ESLint, static metadata APIs

---

## 1. 배경과 핵심 판단

현재 포트폴리오는 “Portfolio OS” 경험을 중심으로 구성되어 있다. 이 형식은 개성과 탐색 경험은 좋지만, 정책지원관·국회 보좌관·공공 디지털 서비스기획·PM 지원을 하나의 첫 화면에서 모두 설득하기에는 진입 비용이 크다.

따라서 루트는 유지하고, 지원서에 넣는 링크를 직무별로 분리한다.

```txt
ficstory.dev/
통합 허브 / 기존 OS형 포트폴리오 유지

ficstory.dev/public-digital/
공공·디지털 서비스기획 지원용

ficstory.dev/pm/
주니어 PM / 서비스기획 / APM 지원용

ficstory.dev/policy/
정책지원관 지원용

ficstory.dev/assembly/
국회 보좌관 지원용
```

중요한 원칙은 “같은 사이트 복제”가 아니라 “같은 데이터 소스를 직무별로 다르게 배치”하는 것이다. 프로젝트 상세와 이력 데이터는 한 곳에서 관리하고, 트랙별 페이지는 진입 문장, 섹션 순서, 강조 근거만 다르게 렌더링한다.

## 2. 트랙별 설득 논리

### 2.1 `/` 통합 허브

**목적:** 직접 지원 링크가 아닌 일반 방문, 명함, 검색, 우연 방문자를 받는 기본 진입점.

**유지할 것:**

- 기존 OS형 잠금화면과 데스크톱 탐색 경험
- About, Case Studies, Skills, Resume, Contact 폴더 구조
- 프로젝트 상세 라우트
- 이력서 라우트

**보강할 것:**

- 트랙 링크 섹션 또는 창을 추가한다.
- 사용자가 직접 직무 트랙을 고를 수 있게 한다.
- 루트에서 특정 직무를 강하게 주장하지 않는다.

**루트 핵심 문장:**

```txt
공공 경험과 소프트웨어 프로젝트 경험을 연결해, 문제를 문서·화면·서비스 흐름으로 정리하는 이재호의 통합 포트폴리오입니다.
```

### 2.2 `/public-digital/` 공공·디지털 서비스기획

**목적:** 공공기관, 공공 SaaS, GovTech, 시민 서비스, 디지털 전환 관련 서비스기획 직무에 보낼 링크.

**설득 논리:**

```txt
공공 문제를 이해한다
→ 사용자·시민 맥락을 구조화한다
→ 요구사항·화면 흐름·기능 기준으로 옮긴다
→ 개발팀과 협업 가능한 산출물로 만든다
```

**첫 화면에서 보여야 하는 정체성:**

```txt
공공 문제를 사용자 요구와 서비스 요구사항으로 번역하는 공공·디지털 서비스기획자
```

**섹션 순서:**

```txt
1. Hero: 공공 문제 → 디지털 서비스 요구사항
2. Core Evidence: 부산참여연대 공공자료 분석 경험
3. Case Study 1: 부산이음길
4. Case Study 2: AEKKIM
5. Supporting Case: 웃지마게임
6. Skills: 문제정의, 요구사항, 화면/API 이해, 문서화
7. Resume / Contact
```

**프로젝트 순서:**

```txt
1. busan-eumgil
2. aekkim
3. smile-game
4. play-pick
```

**표현 주의:**

- 정책 성과처럼 과장하지 않는다.
- 검증되지 않은 수치를 반복하지 않는다.
- 개발자 포트폴리오처럼 기술 스택을 전면에 세우지 않는다.
- Play Pick은 배포 URL 검증 전까지 보조 사례로만 둔다.

### 2.3 `/pm/` 주니어 PM / 서비스기획 / APM

**목적:** IT 서비스기획, 주니어 PM, APM, 프로덕트 운영 보조 직무에 보낼 링크.

**설득 논리:**

```txt
사용자 문제를 정의한다
→ 요구사항과 화면 흐름을 정리한다
→ MVP 범위와 우선순위를 잡는다
→ 팀이 같은 기준으로 구현하도록 문서와 회의 기준을 남긴다
```

**첫 화면에서 보여야 하는 정체성:**

```txt
요구사항, 화면 흐름, MVP 범위, 팀 협업 기준을 정리하는 주니어 PM/APM
```

**섹션 순서:**

```txt
1. Hero: 문제정의·요구사항·MVP 범위
2. Case Study 1: AEKKIM
3. Case Study 2: 부산이음길
4. Case Study 3: 웃지마게임
5. Supporting Case: Play Pick
6. PM Artifacts: 요구사항정의서, 화면명세서, 회의록, 테스트 계획
7. Resume / Contact
```

**프로젝트 순서:**

```txt
1. aekkim
2. busan-eumgil
3. smile-game
4. play-pick
```

**표현 주의:**

- 공공 경력은 배경으로 두고, 팀 프로젝트 산출물과 협업 기준을 앞세운다.
- “기술을 깊게 한다”보다 “기술 제약을 이해하고 협업 기준을 맞춘다”를 강조한다.
- AEKKIM은 팀장/PM, 문서 변경 이력, FE/API 연동 기준을 중심으로 설명한다.

### 2.4 `/policy/` 정책지원관

**목적:** 지방의회 정책지원관, 정책보좌, 의정자료 작성, 정책 조사·분석 직무에 보낼 링크.

**설득 논리:**

```txt
조례·예산·행감·지역 현안을 읽는다
→ 쟁점을 구조화한다
→ 의원·부서·시민이 사용할 수 있는 문서로 만든다
→ 질의, 보도자료, 정책 제안, 회의 자료로 연결한다
```

**첫 화면에서 보여야 하는 정체성:**

```txt
조례·예산·행정사무감사·지역 의제를 분석해 실행 가능한 정책 문서로 정리하는 정책 실무자
```

**섹션 순서:**

```txt
1. Hero: 정책자료 분석과 의정지원 문서화
2. Career Summary: 부산참여연대 3년 10개월
3. Career Case 1: 의정감시와 지방의회 모니터링
4. Career Case 2: 조례·예산·행정사무감사 자료 분석
5. Career Case 3: 청년정책·지역 의제 공론화
6. Career Case 4: 공무국외출장·의회 감시
7. Writing Proof: 보도자료, 질의서, 논평, 회의자료
8. Digital Literacy: SSAFY와 서비스 프로젝트는 보조 역량
9. Resume / Contact
```

**프로젝트 배치:**

정책지원관 트랙에서는 개발 프로젝트를 상단에 두지 않는다. 부산이음길, AEKKIM, 웃지마게임은 “디지털 이해와 협업 가능성”을 보여주는 하단 보조 섹션으로 둔다.

**표현 주의:**

- “앱을 만들었다”가 아니라 “자료를 읽고 정책 문서로 구조화했다”가 핵심이다.
- 정책지원관 채용자는 기술 스택보다 문서력, 이슈 이해, 지방의회 업무 적합성을 본다.
- 부산참여연대 경력을 프로젝트처럼 포장하지 않는다. 경력 케이스로 정리한다.

### 2.5 `/assembly/` 국회 보좌관

**목적:** 국회의원실 보좌진, 입법·정책 보좌, 상임위 자료 조사, 메시지·질의 작성 업무에 보낼 링크.

**설득 논리:**

```txt
공공 이슈를 빠르게 조사한다
→ 법안·예산·상임위·지역 현안 관점으로 쟁점을 나눈다
→ 질의·브리핑·보도자료·메시지 초안으로 정리한다
→ 일정과 이슈 변화에 맞춰 우선순위를 조정한다
```

**첫 화면에서 보여야 하는 정체성:**

```txt
공공 이슈를 조사하고 입법·상임위·질의·메시지 자료로 구조화할 수 있는 보좌 실무자
```

**섹션 순서:**

```txt
1. Hero: 이슈 조사와 의정 메시지 구조화
2. Career Summary: 부산참여연대 의정감시 실무
3. Career Case 1: 지방의회 감시와 쟁점 정리
4. Career Case 2: 조례·예산·행감 기반 자료 분석
5. Career Case 3: 보도자료·논평·질의형 문서 작성
6. Career Case 4: 청년·지역·공공 의제 대응
7. Work Style: 빠른 조사, 문서화, 일정 대응, 커뮤니케이션
8. Digital Literacy: IT·AI 이슈 이해 가능성
9. Resume / Contact
```

**프로젝트 배치:**

국회 보좌관 트랙에서는 소프트웨어 프로젝트를 더 아래로 둔다. 디지털 프로젝트는 “AI·플랫폼·공공 디지털 이슈를 이해할 수 있는 보조 근거”로만 쓴다.

**표현 주의:**

- 국회 보좌관 트랙은 OS UI보다 문서형 레이아웃이 우선이다.
- 기술 프로젝트 카드가 앞에 오면 직무 적합성이 흐려진다.
- “정책 전문가”처럼 과장하지 않고 “실무형 조사·문서화 가능자”로 쓴다.

## 3. SEO와 검색 노출 정책

루트 `/`만 검색 노출의 기본 페이지로 둔다. 직무별 트랙은 지원서에 직접 첨부하는 링크로 운용한다.

```txt
/                  index, canonical self
/public-digital/   noindex, canonical /
/pm/               noindex, canonical /
/policy/           noindex, canonical /
/assembly/         noindex, canonical /
```

이 정책의 이유:

- 같은 인물과 같은 사례가 여러 URL에서 반복 노출되는 중복 검색 문제를 줄인다.
- 채용자가 검색으로 엉뚱한 트랙에 들어오는 가능성을 줄인다.
- 지원하는 직무에 맞는 URL을 직접 보낼 수 있다.

## 4. 파일 구조 계획

### 4.1 생성할 파일

```txt
src/data/careerCases.ts
정책·의정 경력 케이스 데이터. 부산참여연대 경험을 프로젝트가 아니라 career case로 관리한다.

src/data/careerCases.contract.test.mjs
career case id, 필수 필드, 증빙 표현 주의사항을 검증한다.

src/components/tracks/TrackLandingPage.tsx
직무별 트랙 페이지의 공통 레이아웃을 렌더링한다.

src/components/tracks/TrackHero.tsx
트랙별 역할, 헤드라인, 소개, 핵심 역량, CTA를 렌더링한다.

src/components/tracks/TrackCaseSection.tsx
프로젝트형 케이스와 경력형 케이스를 섹션 단위로 렌더링한다.

src/components/tracks/CareerCaseCard.tsx
정책·의정 경력 케이스 카드를 렌더링한다.

src/components/tracks/TrackProofPanel.tsx
트랙별 증빙 자료 목록과 표현 주의사항을 렌더링한다.

src/components/tracks/TrackLinkPanel.tsx
루트 OS 허브에서 직무별 트랙 링크를 보여준다.

src/app/public-digital/layout.tsx
공공·디지털 서비스기획 트랙 metadata와 robots 정책을 정의한다.

src/app/public-digital/page.tsx
publicDigital 트랙을 렌더링한다.

src/app/policy/layout.tsx
정책지원관 트랙 metadata와 robots 정책을 정의한다.

src/app/policy/page.tsx
policy 트랙을 렌더링한다.

src/app/assembly/layout.tsx
국회 보좌관 트랙 metadata와 robots 정책을 정의한다.

src/app/assembly/page.tsx
assembly 트랙을 렌더링한다.

src/components/tracks/trackLandingModel.contract.test.mjs
트랙별 섹션 순서와 대표 케이스 노출 규칙을 검증한다.
```

### 4.2 수정할 파일

```txt
src/lib/portfolioTrack.ts
기존 default, pm 트랙을 default, publicDigital, pm, policy, assembly로 확장한다.

src/lib/portfolioTrack.contract.test.mjs
새 트랙 id, path, noindex, projectOrder, careerCaseOrder를 검증한다.

src/app/pm/layout.tsx
pm metadata를 새 트랙 모델 기준으로 정리한다.

src/app/pm/page.tsx
pm 트랙을 공통 TrackLandingPage로 렌더링한다.

src/app/page.tsx
기존 OS형 홈은 유지하되 트랙 링크 진입점을 추가한다.

src/components/desktop/DesktopShell.tsx
OS 허브 안에서 TrackLinkPanel을 열 수 있도록 폴더 또는 창 항목을 추가한다.

src/components/mobile/MobileHome.tsx
모바일에서도 직무별 트랙 링크를 확인할 수 있게 한다.

src/data/navigation.ts
루트 OS에서 Track Links 또는 Career Tracks 항목을 추가한다.

src/data/folders.ts
트랙 링크 창이 폴더/앱 형태로 열릴 수 있게 항목을 추가한다.

src/components/folders/AboutWindow.tsx
루트 통합 소개에서 특정 직무 하나를 단정하지 않도록 문구를 완화한다.

src/components/folders/ProjectsWindow.tsx
루트에서는 통합 케이스 탐색으로 유지하고, 직무 트랙별 정렬은 TrackLandingPage에서 처리한다.

src/app/sitemap.ts
새 라우트를 포함하되 noindex 트랙은 검색 목적이 아니라 직접 접근 가능 route로만 둔다.

src/lib/seo.ts
base metadata와 트랙별 metadata helper를 추가한다.
```

## 5. 데이터 모델 설계

### 5.1 트랙 타입

`src/lib/portfolioTrack.ts`의 핵심 타입은 다음 구조로 확장한다.

```ts
import type { Profile } from "@/data/profile";

export type PortfolioTrackId =
  | "default"
  | "publicDigital"
  | "pm"
  | "policy"
  | "assembly";

export type PortfolioTrackPath =
  | "/"
  | "/public-digital"
  | "/pm"
  | "/policy"
  | "/assembly";

export type PortfolioTrackKind = "osHub" | "serviceCase" | "careerDocument";

export type TrackSectionId =
  | "hero"
  | "careerSummary"
  | "careerCases"
  | "projectCases"
  | "pmArtifacts"
  | "writingProof"
  | "digitalLiteracy"
  | "skills"
  | "resumeContact";

export type PortfolioTrack = {
  id: PortfolioTrackId;
  label: string;
  path: PortfolioTrackPath;
  kind: PortfolioTrackKind;
  noIndex: boolean;
  canonicalPath: "/";
  profile: Profile;
  projectOrder: string[];
  careerCaseOrder: string[];
  sectionOrder: TrackSectionId[];
  proofFocus: string[];
  cautionNotes: string[];
};
```

### 5.2 경력 케이스 타입

`src/data/careerCases.ts`는 정책지원관과 국회 보좌관 트랙의 핵심 데이터가 된다.

```ts
export type CareerCaseId =
  | "public-participation"
  | "council-monitoring"
  | "ordinance-budget-audit"
  | "youth-policy-agenda"
  | "official-trip-monitoring"
  | "policy-writing";

export type CareerCase = {
  id: CareerCaseId;
  title: string;
  summary: string;
  context: string;
  role: string[];
  workHighlights: string[];
  outputs: string[];
  relevance: {
    publicDigital: string;
    pm: string;
    policy: string;
    assembly: string;
  };
  caution: string[];
};
```

### 5.3 경력 케이스 초안 데이터

초안 데이터는 검증된 표현만 사용한다. 검증되지 않은 수치나 외부 성과는 넣지 않는다.

```ts
export const careerCases: CareerCase[] = [
  {
    id: "public-participation",
    title: "부산참여연대 지방자치본부 실무",
    summary:
      "2021년 5월부터 2025년 2월까지 부산참여연대 지방자치본부에서 간사에서 팀장 역할까지 수행하며 지방의회와 지역 공공 의제를 다뤘습니다.",
    context:
      "지방자치, 의정감시, 청년정책, 예산·조례·행정사무감사 자료를 시민사회 관점에서 읽고 외부에 전달 가능한 문서로 구조화해야 했습니다.",
    role: ["간사", "팀장", "자료 조사", "의제 정리", "문서 작성"],
    workHighlights: [
      "조례·예산·의정 자료를 읽고 쟁점을 분리했습니다.",
      "지역 의제를 회의 자료, 보도자료, 질의형 문서로 정리했습니다.",
      "복잡한 공공 이슈를 시민과 이해관계자가 읽을 수 있는 언어로 바꿨습니다.",
    ],
    outputs: ["회의자료", "보도자료", "의정감시 자료", "정책 의제 정리"],
    relevance: {
      publicDigital:
        "공공 문제의 맥락을 읽고 디지털 서비스 요구사항으로 번역하는 기반 경험입니다.",
      pm: "비정형 자료를 협업 가능한 문서로 정리한 경험입니다.",
      policy: "정책지원관 직무의 자료 조사, 쟁점 정리, 문서화와 직접 연결됩니다.",
      assembly:
        "의정 이슈를 빠르게 파악하고 질의·메시지 자료로 구조화할 수 있는 근거입니다.",
    },
    caution: [
      "정책 성과를 단정하지 않고 수행한 조사·정리·문서화 업무 중심으로 표현합니다.",
      "확인되지 않은 수치를 대표 성과로 사용하지 않습니다.",
    ],
  },
  {
    id: "council-monitoring",
    title: "의정감시와 지방의회 모니터링",
    summary:
      "지방의회 활동과 공공 의제를 모니터링하며 쟁점, 이해관계, 후속 질문을 정리했습니다.",
    context:
      "의회 활동은 회의록, 조례, 예산, 행정사무감사, 언론 보도 등 여러 자료에 흩어져 있어 핵심 쟁점을 재구성해야 했습니다.",
    role: ["자료 조사", "회의 모니터링", "쟁점 정리", "질의 초안 정리"],
    workHighlights: [
      "회의와 자료에서 반복되는 쟁점을 추출했습니다.",
      "시민사회 관점에서 질문 가능한 항목으로 재구성했습니다.",
      "보도자료와 회의 논의에 사용할 수 있는 문장으로 정리했습니다.",
    ],
    outputs: ["모니터링 메모", "질의형 쟁점 정리", "보도자료 초안"],
    relevance: {
      publicDigital:
        "공공 사용자의 문제를 행정·제도 맥락과 함께 이해하는 근거입니다.",
      pm: "복잡한 자료를 팀이 이해할 수 있는 기준으로 정리하는 능력과 연결됩니다.",
      policy: "의정지원 문서 작성과 정책 쟁점 정리에 직접 연결됩니다.",
      assembly: "상임위·국정감사·지역 현안 자료 조사 방식과 유사한 기반 경험입니다.",
    },
    caution: [
      "국회 업무를 직접 수행했다고 쓰지 않습니다.",
      "지방의회 모니터링 경험을 국회 보좌 업무의 유사 경험으로만 연결합니다.",
    ],
  },
  {
    id: "ordinance-budget-audit",
    title: "조례·예산·행정사무감사 자료 분석",
    summary:
      "조례, 예산, 행정사무감사 자료를 읽고 공공 의제의 쟁점과 질문 지점을 정리했습니다.",
    context:
      "정책 문서는 형식과 용어가 복잡해 시민, 활동가, 외부 이해관계자가 바로 이해하기 어렵습니다.",
    role: ["자료 분석", "쟁점 분류", "문서 요약", "질의 포인트 정리"],
    workHighlights: [
      "정책 자료의 항목을 쟁점별로 나눴습니다.",
      "예산과 조례의 문제 제기 지점을 문장화했습니다.",
      "행정사무감사에서 확인해야 할 질문의 방향을 정리했습니다.",
    ],
    outputs: ["쟁점 요약", "질의 포인트", "회의자료", "보도자료 근거 문장"],
    relevance: {
      publicDigital:
        "공공 데이터를 기능 요구사항으로 바꾸기 전 문제 구조를 파악하는 능력입니다.",
      pm: "복잡한 요구와 제약을 분해하는 역량과 연결됩니다.",
      policy: "정책지원관의 조례·예산·행감 자료 지원 업무와 가장 직접 연결됩니다.",
      assembly:
        "입법·예산·감사 관련 이슈 리서치와 질의 자료 작성의 기반 경험입니다.",
    },
    caution: [
      "분석한 정확한 건수는 별도 증빙이 있을 때만 사용합니다.",
      "정책 결정권자처럼 표현하지 않고 실무 분석자로 표현합니다.",
    ],
  },
  {
    id: "youth-policy-agenda",
    title: "청년정책·지역 의제 공론화",
    summary:
      "청년정책과 지역 공공 의제를 조사하고 시민사회에서 논의 가능한 문서와 메시지로 정리했습니다.",
    context:
      "청년·지역 의제는 당사자 경험, 행정 자료, 언론 이슈가 함께 얽혀 있어 문제를 단순 구호가 아니라 실행 가능한 쟁점으로 나눠야 했습니다.",
    role: ["의제 조사", "당사자 관점 정리", "문서 작성", "메시지 구성"],
    workHighlights: [
      "지역 의제를 당사자 문제와 제도 문제로 나눠 정리했습니다.",
      "논의 가능한 질문과 요구사항 형태로 바꿨습니다.",
      "외부에 전달 가능한 문서와 메시지로 구성했습니다.",
    ],
    outputs: ["의제 정리 문서", "회의자료", "보도자료 또는 메시지 초안"],
    relevance: {
      publicDigital:
        "시민의 실제 문제를 서비스 요구사항으로 바꾸는 감각과 연결됩니다.",
      pm: "사용자 맥락을 제품 문제로 바꾸는 문제정의 경험입니다.",
      policy: "정책지원관의 지역 의제 조사와 정책자료 작성에 연결됩니다.",
      assembly: "지역구 현안과 청년 의제 대응 역량을 보여주는 보조 근거입니다.",
    },
    caution: [
      "당사자 대표성을 과장하지 않습니다.",
      "정책 성과보다 조사·정리·공론화 과정 중심으로 씁니다.",
    ],
  },
  {
    id: "official-trip-monitoring",
    title: "공무국외출장·의회 감시",
    summary:
      "공공기관과 의회의 책임성 이슈를 모니터링하고, 시민이 이해할 수 있는 문제 제기 문장으로 정리했습니다.",
    context:
      "공무국외출장과 의회 감시 이슈는 절차, 예산, 목적, 결과보고 등 여러 기준을 함께 봐야 합니다.",
    role: ["자료 확인", "절차 검토", "문제 제기 정리", "공개 메시지 작성"],
    workHighlights: [
      "공개 자료를 기준으로 절차와 쟁점을 확인했습니다.",
      "시민 눈높이에서 문제가 되는 지점을 문장화했습니다.",
      "공개 메시지와 후속 질문으로 이어질 수 있게 정리했습니다.",
    ],
    outputs: ["자료 검토 메모", "문제 제기 문장", "보도자료 근거"],
    relevance: {
      publicDigital:
        "공공 서비스의 투명성과 책임성 문제를 이해하는 배경 경험입니다.",
      pm: "정책·제도 제약을 읽고 서비스 범위에 반영하는 감각과 연결됩니다.",
      policy: "의회와 행정의 책임성 이슈를 다루는 정책지원 실무와 연결됩니다.",
      assembly: "감사·질의·자료 요구 관점의 이슈 정리 능력을 보여줍니다.",
    },
    caution: [
      "감사 권한을 수행한 것처럼 쓰지 않습니다.",
      "시민사회 모니터링과 문제 제기 문서화 경험으로 표현합니다.",
    ],
  },
  {
    id: "policy-writing",
    title: "보도자료·질의서·정책문서 작성",
    summary:
      "복잡한 공공 이슈를 외부 이해관계자가 읽을 수 있는 보도자료, 질의형 문서, 회의자료로 정리했습니다.",
    context:
      "정책 실무에서는 자료를 많이 읽는 것만큼 핵심 쟁점을 짧고 명확한 문장으로 바꾸는 능력이 중요합니다.",
    role: ["문서 작성", "쟁점 요약", "메시지 구성", "회의자료 정리"],
    workHighlights: [
      "자료의 핵심 근거와 주장 문장을 분리했습니다.",
      "질의형 문장과 보도자료형 문장을 구분해 작성했습니다.",
      "회의에서 논의할 수 있는 항목으로 문서를 정리했습니다.",
    ],
    outputs: ["보도자료", "질의형 문서", "회의자료", "정책 의제 요약"],
    relevance: {
      publicDigital:
        "서비스기획 문서에서도 문제, 근거, 요구사항을 명확히 나누는 기반입니다.",
      pm: "PRD와 회의록 작성의 문장력과 구조화 능력으로 연결됩니다.",
      policy: "정책지원관 직무의 핵심 증빙입니다.",
      assembly: "국회 보좌진의 질의·브리핑·메시지 작성과 직접 연결되는 경험입니다.",
    },
    caution: [
      "작성물 원문을 공개할 수 없는 경우에는 문서 유형과 역할만 설명합니다.",
      "비공개 자료나 조직 내부 자료는 노출하지 않습니다.",
    ],
  },
];
```

## 6. 컴포넌트 설계

### 6.1 `TrackLandingPage`

책임:

- 트랙 id를 받아 해당 트랙의 profile, projectOrder, careerCaseOrder, sectionOrder를 로드한다.
- 트랙 종류에 따라 프로젝트형 화면과 경력 문서형 화면을 같은 레이아웃 규칙으로 배치한다.
- 직무별 CTA와 증빙 패널을 렌더링한다.

예상 props:

```ts
type TrackLandingPageProps = {
  trackId: PortfolioTrackId;
};
```

렌더링 규칙:

```txt
serviceCase 트랙
Hero → projectCases → skills → proofPanel → resumeContact

careerDocument 트랙
Hero → careerSummary → careerCases → writingProof/digitalLiteracy → proofPanel → resumeContact

osHub 트랙
루트 기존 UI를 사용하므로 TrackLandingPage를 직접 쓰지 않는다.
```

### 6.2 `TrackHero`

책임:

- 직무명, 한 줄 포지션, 소개 문단, 핵심 역량 3개, 키워드를 표시한다.
- CTA는 `Case Studies`, `Resume`, `Contact` 또는 `Career Cases`, `Resume`, `Contact`로 트랙별로 달라진다.

텍스트 크기 규칙:

- 문서형 트랙에서는 과한 hero scale을 쓰지 않는다.
- 첫 viewport에서 다음 섹션의 일부가 보이게 한다.
- 정책지원관/국회 보좌관 트랙은 카드형 장식보다 문서형 밀도를 우선한다.

### 6.3 `CareerCaseCard`

책임:

- 경력 케이스의 `summary`, `context`, `role`, `workHighlights`, `outputs`, `relevance[trackId]`, `caution`을 표시한다.
- 정책/국회 트랙에서는 `relevance.policy` 또는 `relevance.assembly`를 핵심 문장으로 쓴다.
- 공공디지털/PM 트랙에서는 career case를 보조 근거로 사용할 때 `relevance.publicDigital` 또는 `relevance.pm`을 쓴다.

### 6.4 `TrackProofPanel`

책임:

- 트랙별로 보여야 하는 증빙 우선순위를 안내한다.
- 포트폴리오에 과장되기 쉬운 표현을 caution으로 분리한다.

트랙별 증빙 예:

```txt
publicDigital
- 부산이음길 PRD
- 요구사항명세서
- 발표자료
- 시연영상
- 공공자료 분석 경력 요약

pm
- AEKKIM 요구사항정의서
- 화면명세서 변경 이력
- README
- FE 테스트 계획
- 회의록

policy
- 보도자료
- 질의형 문서
- 조례·예산·행감 자료 분석 예시
- 의정감시 활동 요약

assembly
- 이슈 브리프
- 질의 초안형 문서
- 보도자료/논평
- 의정감시 활동 요약
```

## 7. 작업 순서

### Task 1: 트랙 모델 확장

**Files:**

- Modify: `src/lib/portfolioTrack.ts`
- Modify: `src/lib/portfolioTrack.contract.test.mjs`

- [ ] **Step 1: `portfolioTrack.contract.test.mjs`에 새 트랙 기대값을 먼저 추가한다.**

테스트에 포함할 기대값:

```js
const expectedTracks = [
  ["default", "/", false],
  ["publicDigital", "/public-digital", true],
  ["pm", "/pm", true],
  ["policy", "/policy", true],
  ["assembly", "/assembly", true],
];
```

- [ ] **Step 2: 테스트를 실행해 실패를 확인한다.**

Run:

```bash
node --test src/lib/portfolioTrack.contract.test.mjs
```

Expected:

```txt
FAIL because publicDigital, policy, assembly are not present in portfolioTracks
```

- [ ] **Step 3: `PortfolioTrackId`, `PortfolioTrack`, `portfolioTracks`를 확장한다.**

반영할 project order:

```ts
publicDigital: ["busan-eumgil", "aekkim", "smile-game", "play-pick"]
pm: ["aekkim", "busan-eumgil", "smile-game", "play-pick"]
policy: ["busan-eumgil", "aekkim", "smile-game", "play-pick"]
assembly: ["busan-eumgil", "aekkim", "smile-game", "play-pick"]
```

반영할 career case order:

```ts
publicDigital: [
  "public-participation",
  "ordinance-budget-audit",
  "youth-policy-agenda",
]
pm: [
  "policy-writing",
  "public-participation",
]
policy: [
  "public-participation",
  "council-monitoring",
  "ordinance-budget-audit",
  "youth-policy-agenda",
  "official-trip-monitoring",
  "policy-writing",
]
assembly: [
  "council-monitoring",
  "ordinance-budget-audit",
  "policy-writing",
  "youth-policy-agenda",
  "official-trip-monitoring",
]
```

- [ ] **Step 4: 테스트를 다시 실행해 통과를 확인한다.**

Run:

```bash
node --test src/lib/portfolioTrack.contract.test.mjs
```

Expected:

```txt
PASS
```

### Task 2: 경력 케이스 데이터 추가

**Files:**

- Create: `src/data/careerCases.ts`
- Create: `src/data/careerCases.contract.test.mjs`

- [ ] **Step 1: 필수 career case id 테스트를 먼저 작성한다.**

테스트 기대값:

```js
const expectedIds = [
  "public-participation",
  "council-monitoring",
  "ordinance-budget-audit",
  "youth-policy-agenda",
  "official-trip-monitoring",
  "policy-writing",
];
```

- [ ] **Step 2: 테스트를 실행해 실패를 확인한다.**

Run:

```bash
node --test src/data/careerCases.contract.test.mjs
```

Expected:

```txt
FAIL because src/data/careerCases.ts does not exist
```

- [ ] **Step 3: `careerCases.ts`를 생성하고 5.3의 초안 데이터를 넣는다.**

필수 필드:

```txt
id
title
summary
context
role
workHighlights
outputs
relevance
caution
```

- [ ] **Step 4: 테스트를 다시 실행해 통과를 확인한다.**

Run:

```bash
node --test src/data/careerCases.contract.test.mjs
```

Expected:

```txt
PASS
```

### Task 3: 트랙별 profile 문구 정리

**Files:**

- Modify: `src/lib/portfolioTrack.ts`
- Optionally read: `src/data/profile.ts`

- [ ] **Step 1: 각 트랙의 role/headline/introduction/strengths/focusKeywords/currentFocus를 분리한다.**

트랙별 role:

```txt
default: 통합 포트폴리오
publicDigital: 공공·디지털 서비스기획자
pm: 주니어 서비스기획자 / APM
policy: 정책지원관 지원자
assembly: 국회 보좌 실무 지원자
```

- [ ] **Step 2: 각 트랙 headline을 첫 화면에서 바로 읽히는 문장으로 작성한다.**

사용할 headline:

```txt
publicDigital
공공 문제를 사용자 요구와 서비스 요구사항으로 번역하는 공공·디지털 서비스기획자입니다.

pm
요구사항, 화면 흐름, MVP 범위, 팀 협업 기준을 정리하는 주니어 PM/APM입니다.

policy
조례·예산·행정사무감사·지역 의제를 분석해 실행 가능한 정책 문서로 정리하는 정책 실무자입니다.

assembly
공공 이슈를 조사하고 입법·상임위·질의·메시지 자료로 구조화할 수 있는 보좌 실무자입니다.
```

- [ ] **Step 3: 통합 루트 default profile은 특정 직무 하나로 고정하지 않는다.**

default headline:

```txt
공공 경험과 소프트웨어 프로젝트 경험을 연결해, 문제를 문서·화면·서비스 흐름으로 정리합니다.
```

### Task 4: 공통 트랙 랜딩 컴포넌트 생성

**Files:**

- Create: `src/components/tracks/TrackLandingPage.tsx`
- Create: `src/components/tracks/TrackHero.tsx`
- Create: `src/components/tracks/TrackCaseSection.tsx`
- Create: `src/components/tracks/CareerCaseCard.tsx`
- Create: `src/components/tracks/TrackProofPanel.tsx`
- Create: `src/components/tracks/trackLandingModel.contract.test.mjs`

- [ ] **Step 1: `trackLandingModel.contract.test.mjs`에서 트랙별 첫 번째 대표 콘텐츠를 검증한다.**

기대값:

```js
const expectedFirstEvidence = {
  publicDigital: "busan-eumgil",
  pm: "aekkim",
  policy: "public-participation",
  assembly: "council-monitoring",
};
```

- [ ] **Step 2: 테스트를 실행해 실패를 확인한다.**

Run:

```bash
node --test src/components/tracks/trackLandingModel.contract.test.mjs
```

Expected:

```txt
FAIL because track landing model is not implemented
```

- [ ] **Step 3: 모델 helper를 구현한다.**

helper 이름:

```ts
export function getTrackLandingModel(trackId: PortfolioTrackId) {
  return {
    track,
    profile,
    orderedProjects,
    orderedCareerCases,
    firstEvidenceId,
  };
}
```

- [ ] **Step 4: `TrackLandingPage`는 helper 결과만 받아 렌더링한다.**

렌더링 구조:

```tsx
<main>
  <TrackHero track={track} profile={profile} />
  <TrackCaseSection
    track={track}
    projects={orderedProjects}
    careerCases={orderedCareerCases}
  />
  <TrackProofPanel track={track} />
</main>
```

- [ ] **Step 5: 테스트를 다시 실행해 통과를 확인한다.**

Run:

```bash
node --test src/components/tracks/trackLandingModel.contract.test.mjs
```

Expected:

```txt
PASS
```

### Task 5: `/public-digital/` 라우트 추가

**Files:**

- Create: `src/app/public-digital/layout.tsx`
- Create: `src/app/public-digital/page.tsx`

- [ ] **Step 1: `layout.tsx`에 noindex metadata를 작성한다.**

metadata 내용:

```ts
export const metadata = {
  title: "이재호 | 공공·디지털 서비스기획 포트폴리오",
  description:
    "공공 문제를 사용자 요구, 요구사항, 화면 흐름, 기능 기준으로 번역하는 공공·디지털 서비스기획 포트폴리오.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://ficstory.dev/",
  },
};
```

- [ ] **Step 2: `page.tsx`에서 `TrackLandingPage`에 `publicDigital`을 전달한다.**

코드 형태:

```tsx
import { TrackLandingPage } from "@/components/tracks/TrackLandingPage";

export default function PublicDigitalPage() {
  return <TrackLandingPage trackId="publicDigital" />;
}
```

- [ ] **Step 3: 빌드 전 route 타입 오류를 확인한다.**

Run:

```bash
cmd /c npm run lint
```

Expected:

```txt
No ESLint errors
```

### Task 6: `/pm/` 라우트를 새 공통 트랙 화면으로 전환

**Files:**

- Modify: `src/app/pm/layout.tsx`
- Modify: `src/app/pm/page.tsx`

- [ ] **Step 1: `layout.tsx` metadata를 PM 전용으로 유지하되 canonical은 `/`로 둔다.**

title:

```txt
이재호 | Junior PM / Service Planning Portfolio
```

description:

```txt
요구사항, 화면 흐름, MVP 범위, 팀 협업 기준을 정리하는 주니어 PM/APM 포트폴리오.
```

- [ ] **Step 2: `page.tsx`에서 `TrackLandingPage trackId="pm"`을 렌더링한다.**

코드 형태:

```tsx
import { TrackLandingPage } from "@/components/tracks/TrackLandingPage";

export default function PmPage() {
  return <TrackLandingPage trackId="pm" />;
}
```

- [ ] **Step 3: PM 트랙 첫 번째 프로젝트가 AEKKIM인지 테스트한다.**

Run:

```bash
node --test src/lib/portfolioTrack.contract.test.mjs
```

Expected:

```txt
PASS with pm projectOrder[0] === "aekkim"
```

### Task 7: `/policy/` 라우트 추가

**Files:**

- Create: `src/app/policy/layout.tsx`
- Create: `src/app/policy/page.tsx`

- [ ] **Step 1: `layout.tsx` metadata를 정책지원관 전용으로 작성한다.**

metadata:

```ts
export const metadata = {
  title: "이재호 | 정책지원관 포트폴리오",
  description:
    "조례·예산·행정사무감사·지역 의제를 분석해 정책 문서와 의정지원 자료로 구조화하는 정책지원관 지원 포트폴리오.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://ficstory.dev/",
  },
};
```

- [ ] **Step 2: `page.tsx`에서 `TrackLandingPage trackId="policy"`를 렌더링한다.**

코드 형태:

```tsx
import { TrackLandingPage } from "@/components/tracks/TrackLandingPage";

export default function PolicyPage() {
  return <TrackLandingPage trackId="policy" />;
}
```

- [ ] **Step 3: 정책지원관 트랙에서 개발 프로젝트보다 career case가 먼저 노출되는지 테스트한다.**

Run:

```bash
node --test src/components/tracks/trackLandingModel.contract.test.mjs
```

Expected:

```txt
PASS with policy firstEvidenceId === "public-participation"
```

### Task 8: `/assembly/` 라우트 추가

**Files:**

- Create: `src/app/assembly/layout.tsx`
- Create: `src/app/assembly/page.tsx`

- [ ] **Step 1: `layout.tsx` metadata를 국회 보좌관 전용으로 작성한다.**

metadata:

```ts
export const metadata = {
  title: "이재호 | 국회 보좌 실무 포트폴리오",
  description:
    "공공 이슈를 조사하고 입법·상임위·질의·메시지 자료로 구조화할 수 있는 보좌 실무 지원 포트폴리오.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://ficstory.dev/",
  },
};
```

- [ ] **Step 2: `page.tsx`에서 `TrackLandingPage trackId="assembly"`를 렌더링한다.**

코드 형태:

```tsx
import { TrackLandingPage } from "@/components/tracks/TrackLandingPage";

export default function AssemblyPage() {
  return <TrackLandingPage trackId="assembly" />;
}
```

- [ ] **Step 3: 국회 보좌관 트랙에서 의정감시 경력 케이스가 첫 증빙인지 테스트한다.**

Run:

```bash
node --test src/components/tracks/trackLandingModel.contract.test.mjs
```

Expected:

```txt
PASS with assembly firstEvidenceId === "council-monitoring"
```

### Task 9: 루트 OS 허브에 트랙 링크 추가

**Files:**

- Create: `src/components/tracks/TrackLinkPanel.tsx`
- Modify: `src/data/navigation.ts`
- Modify: `src/data/folders.ts`
- Modify: `src/components/desktop/DesktopShell.tsx`
- Modify: `src/components/mobile/MobileHome.tsx`

- [ ] **Step 1: `TrackLinkPanel`에 네 개 직무 트랙 링크를 렌더링한다.**

링크:

```txt
공공·디지털 서비스기획 → /public-digital/
주니어 PM/APM → /pm/
정책지원관 → /policy/
국회 보좌관 → /assembly/
```

- [ ] **Step 2: 루트 OS 폴더 또는 Dock 항목 이름은 `Career Tracks`로 둔다.**

설명:

```txt
지원 직무별로 정리한 포트폴리오 링크
```

- [ ] **Step 3: 모바일 홈에서도 같은 링크를 노출한다.**

모바일 노출 위치:

```txt
About 요약 아래, Case Studies 목록 위
```

- [ ] **Step 4: 루트가 특정 직무 트랙으로 자동 리다이렉트되지 않는지 확인한다.**

Run:

```bash
cmd /c npm run build
```

Expected:

```txt
Build output includes /
Build output includes /public-digital
Build output includes /pm
Build output includes /policy
Build output includes /assembly
```

### Task 10: 프로젝트 상세 페이지의 직무 관점 보강

**Files:**

- Modify: `src/data/projects.ts`
- Modify: `src/components/projects/ProjectDetail.tsx`
- Modify: `src/components/folders/projects/projectInspectorModel.ts`
- Modify: `src/components/folders/projects/projectInspectorModel.contract.test.mjs`

- [ ] **Step 1: 프로젝트 데이터에 `trackRelevance` 필드를 추가하는 테스트를 먼저 작성한다.**

예상 타입:

```ts
trackRelevance: {
  publicDigital: string;
  pm: string;
  policy: string;
  assembly: string;
}
```

- [ ] **Step 2: 프로젝트별 relevance를 작성한다.**

예:

```txt
busan-eumgil.publicDigital
공공 이동 문제를 접근성 요구사항과 Android 서비스 흐름으로 바꾼 사례입니다.

aekkim.pm
요구사항정의서, 화면명세서, API 연동 기준을 맞춘 PM형 협업 사례입니다.

smile-game.pm
설문과 피드백을 바탕으로 MVP 방향을 조정한 사용자 검증 사례입니다.

play-pick.publicDigital
공연 콘텐츠 데이터를 서비스에서 활용 가능한 구조로 정리한 보조 사례입니다.
```

- [ ] **Step 3: 정책/국회 relevance는 보조 문장으로 작성한다.**

예:

```txt
busan-eumgil.policy
정책지원관 트랙에서는 디지털 공공서비스 이해를 보여주는 보조 사례로 사용합니다.

aekkim.assembly
국회 보좌관 트랙에서는 IT·플랫폼 이슈를 이해할 수 있는 보조 근거로만 사용합니다.
```

- [ ] **Step 4: 프로젝트 상세에는 현재 route의 track context가 없으면 기본 relevance를 숨긴다.**

루트 `/projects/[slug]` 직접 접근에서는 과한 직무별 문장을 보여주지 않고 기존 공통 설명을 유지한다.

### Task 11: 이력서 요약과 트랙 페이지 문구의 충돌 제거

**Files:**

- Modify: `src/content/resume-summary.ts`
- Modify: `src/components/folders/ResumeWindow.tsx`
- Modify: `src/app/resume/page.tsx`

- [ ] **Step 1: 공통 이력서 요약은 하나의 직무로 단정하지 않는 문장으로 완화한다.**

권장 headline:

```txt
공공정책 분석 3년 10개월과 SSAFY SW·AI 프로젝트 경험을 연결해, 문제를 문서·화면·서비스 흐름으로 정리하는 지원자입니다.
```

- [ ] **Step 2: 트랙 페이지에서는 공통 resume summary를 그대로 끌어오되, 트랙별 hero에서 직무명을 해결한다.**

규칙:

```txt
Resume page = 통합 이력 요약
Track page = 직무별 포지셔닝
Project detail = 사례 상세
```

### Task 12: sitemap과 robots 정리

**Files:**

- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/lib/seo.ts`

- [ ] **Step 1: sitemap에 새 route를 포함한다.**

routes:

```txt
/
/public-digital
/pm
/policy
/assembly
/resume
/projects/busan-eumgil
/projects/aekkim
/projects/smile-game
/projects/play-pick
```

- [ ] **Step 2: metadata의 robots noindex가 layout별로 적용되는지 확인한다.**

확인 대상:

```txt
/public-digital/
/pm/
/policy/
/assembly/
```

- [ ] **Step 3: `seo.ts`에 트랙별 title/description helper를 추가한다.**

helper 형태:

```ts
export function getTrackMetadata(trackId: PortfolioTrackId) {
  const track = resolvePortfolioTrack(trackId);

  return {
    title: `이재호 | ${track.label}`,
    description: track.profile.headline,
    robots: {
      index: !track.noIndex,
      follow: !track.noIndex,
    },
    alternates: {
      canonical: "https://ficstory.dev/",
    },
  };
}
```

### Task 13: 콘텐츠 검수 규칙 추가

**Files:**

- Create: `docs/portfolio-track-content-rules.md`

- [ ] **Step 1: 과장 금지 규칙을 문서화한다.**

규칙:

```txt
1. 검증되지 않은 수치를 대표 성과로 쓰지 않는다.
2. 부산참여연대 경력을 개발 프로젝트처럼 포장하지 않는다.
3. 정책지원관/국회 보좌관 트랙에서는 기술 스택을 상단에 두지 않는다.
4. Play Pick은 라이브 URL 검증 전까지 배포 성공 사례로 쓰지 않는다.
5. PM 트랙에서는 공공 경력보다 요구사항·화면명세·협업 산출물을 앞세운다.
6. 공공디지털 트랙에서는 정책 문제와 디지털 서비스 요구사항의 연결을 앞세운다.
```

- [ ] **Step 2: 트랙별 금지 표현을 추가한다.**

예:

```txt
정책지원관
금지: 정책을 직접 결정했다
허용: 정책 자료와 쟁점을 조사·정리했다

국회 보좌관
금지: 국회 실무를 수행했다
허용: 지방의회 의정감시 경험을 바탕으로 국회 보좌 실무와 유사한 조사·문서화 역량을 갖췄다

PM
금지: 프로덕트 전체를 총괄했다
허용: 팀 프로젝트에서 요구사항, 화면명세, 구현 범위 조율을 맡았다
```

### Task 14: 통합 검증

**Files:**

- Verify all modified files

- [ ] **Step 1: contract tests를 실행한다.**

Run:

```bash
node --test
```

Expected:

```txt
All contract tests pass
```

- [ ] **Step 2: lint를 실행한다.**

Run:

```bash
cmd /c npm run lint
```

Expected:

```txt
No ESLint errors
```

- [ ] **Step 3: production build를 실행한다.**

Run:

```bash
cmd /c npm run build
```

Expected:

```txt
Build succeeds
Route list includes /public-digital, /pm, /policy, /assembly
```

- [ ] **Step 4: 로컬 서버에서 route smoke test를 수행한다.**

Run:

```bash
cmd /c npm run start
```

확인 URL:

```txt
http://localhost:3000/
http://localhost:3000/public-digital/
http://localhost:3000/pm/
http://localhost:3000/policy/
http://localhost:3000/assembly/
```

Expected:

```txt
각 URL이 200 응답을 반환한다.
/pm/ 첫 사례는 AEKKIM이다.
/policy/ 첫 주요 근거는 부산참여연대 경력이다.
/assembly/ 첫 주요 근거는 의정감시 경력이다.
직무별 트랙은 noindex metadata를 가진다.
```

## 8. 구현하지 않는 범위

이번 계획에서 구현하지 않는 항목:

```txt
/solutions/ 별도 route
/sales/ 별도 route
지원서 자동 생성 기능
AI Chat 기반 직무별 자기소개 생성
서버 저장형 연락처 폼
외부 CMS 연동
직무별 PDF 자동 생성
```

Solutions Consultant와 Technical Sales는 현재 핵심 지원 전략이 아니므로 별도 URL을 만들지 않는다. 필요하면 자기소개서나 면접 답변에서 보조 각도로만 사용한다. GovTech/SaaS 솔루션 기획 지원이 실제로 늘어나면 그때 `/solutions/`를 별도 계획으로 추가한다.

## 9. 최종 완료 기준

완료로 볼 수 있는 상태:

```txt
1. / 루트는 기존 통합 OS 허브로 유지된다.
2. /public-digital/은 공공·디지털 서비스기획자처럼 읽힌다.
3. /pm/은 주니어 PM/APM처럼 읽힌다.
4. /policy/는 정책지원관용 문서형 포트폴리오처럼 읽힌다.
5. /assembly/는 국회 보좌 실무 지원용 문서형 포트폴리오처럼 읽힌다.
6. 정책/국회 트랙에서 개발 프로젝트가 상단을 차지하지 않는다.
7. 공공디지털 트랙에서는 부산이음길이 1순위, PM 트랙에서는 AEKKIM이 1순위로 배치된다.
8. Play Pick은 과장되지 않고 보조 사례로 유지된다.
9. 모든 트랙은 같은 데이터 소스를 사용한다.
10. node --test, npm run lint, npm run build가 통과한다.
```

## 10. 권장 구현 순서 요약

```txt
1. portfolioTrack 모델 확장
2. careerCases 데이터 추가
3. 트랙별 profile 문구 정리
4. TrackLandingPage 공통 컴포넌트 생성
5. /public-digital 추가
6. /pm 공통 트랙 화면으로 전환
7. /policy 추가
8. /assembly 추가
9. 루트 OS 허브에 트랙 링크 추가
10. 프로젝트 상세의 직무 관점 보강
11. resume summary 문구 충돌 제거
12. sitemap, robots, seo 정리
13. 콘텐츠 검수 규칙 문서화
14. contract test, lint, build, route smoke test
```

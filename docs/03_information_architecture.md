# 정보 구조와 콘텐츠 설계

## 1. 정보 구조 원칙

- 첫 화면은 잠금화면형 랜딩으로 구성한다.
- 입장 이후의 콘텐츠는 데스크톱 폴더 메타포를 사용한다.
- MVP는 `About Me`, `Projects`, `Skills`, `Resume`, `Contact` 5개 핵심 폴더로 제한한다.
- 블로그와 노트는 2차 기능으로 분리한다.
- 콘텐츠는 한국어로 작성한다.

## 2. 전체 구조

```txt
Portfolio Site
├─ Lock Screen Landing
└─ Desktop Workspace
   ├─ About Me
   ├─ Projects
   │  ├─ Project 01
   │  ├─ Project 02
   │  └─ Project 03
   ├─ Skills
   ├─ Resume
   └─ Contact
```

## 3. 라우팅 구조

Next.js 기준 권장 라우팅은 다음과 같다.

```txt
/
├─ 잠금화면 랜딩과 데스크톱 앱 셸을 포함하는 단일 진입점
├─ /projects/[slug]
│  └─ 프로젝트 상세 직접 접근과 SEO용 정적 페이지
└─ /resume
   └─ 이력서 요약 직접 접근과 SEO용 정적 페이지
```

데스크톱 UI 안에서는 창으로 콘텐츠를 보여주되, 프로젝트 상세와 이력서 요약은 직접 URL 접근도 가능해야 한다. 이렇게 하면 인터랙티브 포트폴리오 경험과 SEO 요구를 모두 만족할 수 있다.

## 4. 폴더별 콘텐츠

### 4.1 About Me

목적: 방문자가 포트폴리오 주인의 방향성과 강점을 빠르게 이해한다.

포함 콘텐츠:

- 이름
- 직무: 프론트엔드 개발자
- 한 줄 소개
- 핵심 강점 3개
- 관심 분야
- 현재 집중하고 있는 기술 또는 문제
- 짧은 성장 서사

권장 구조:

```txt
About Me
├─ Profile Card
├─ Core Strengths
├─ Current Focus
└─ Personal Keywords
```

### 4.2 Projects

목적: 대표 프로젝트 3개를 가장 중요한 평가 콘텐츠로 보여준다.

포함 콘텐츠:

- 대표 프로젝트 3개
- 프로젝트별 썸네일
- 프로젝트별 핵심 기술
- 개인 역할
- 결과 또는 성과

목록 구조:

```txt
Projects
├─ Featured Project Card 01
├─ Featured Project Card 02
└─ Featured Project Card 03
```

상세 구조:

```txt
Project Detail
├─ Hero Summary
├─ Problem
├─ My Role
├─ Tech Stack
├─ Implementation
├─ Troubleshooting
├─ Result
├─ Links
└─ Media
```

### 4.3 Skills

목적: 기술을 단순 나열하지 않고 실제 사용 맥락과 연결한다.

카테고리:

- Frontend
- State Management
- Styling
- Tooling
- Collaboration
- AI Workflow

기술 카드 필드:

- 기술명
- 사용 수준
- 사용 프로젝트
- 사용 맥락

### 4.4 Resume

목적: PDF 다운로드 전에 핵심 이력 정보를 웹에서 빠르게 보여준다.

포함 콘텐츠:

- 한 줄 소개
- 핵심 역량 3개
- 대표 프로젝트 3개 요약
- 기술 스택 요약
- 교육, 활동, 수상 요약
- PDF 다운로드 버튼

PDF 정책:

- 파일 경로: `public/resume/resume.pdf`
- 버튼 문구: `이력서 PDF 다운로드`
- 새 탭 열기와 직접 다운로드 중 하나를 제공하고, 브라우저 기본 동작을 존중한다.

### 4.5 Contact

목적: 연락과 외부 프로필 이동을 제공한다.

포함 콘텐츠:

- 이메일
- GitHub
- 블로그
- 선택 링크: LinkedIn, Notion, Velog

MVP에서는 서버 저장형 연락처 폼을 제공하지 않는다.

## 5. 2차 기능 정보 구조

블로그와 노트는 MVP 이후 `Notes` 폴더로 추가한다.

```txt
Notes
├─ Troubleshooting
├─ Retrospective
├─ Frontend Notes
└─ AI Workflow Notes
```

2차 기능은 Spotlight 검색, 태그 필터, MDX 렌더링과 연결한다.

## 6. 콘텐츠 데이터 모델

### 6.1 Folder

```ts
type FolderId = "about" | "projects" | "skills" | "resume" | "contact";

type FolderItem = {
  id: FolderId;
  title: string;
  description: string;
  icon: string;
  defaultWindowSize: {
    width: number;
    height: number;
  };
};
```

### 6.2 Project

```ts
type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  valueStatement: string;
  role: string[];
  stack: string[];
  problem: string;
  implementationHighlights: string[];
  troubleshooting: string[];
  result: string[];
  links: {
    github?: string;
    demo?: string;
    article?: string;
  };
  thumbnail: string;
  media: string[];
  contentPath: string;
};
```

### 6.3 Skill

```ts
type SkillCategory =
  | "frontend"
  | "state"
  | "styling"
  | "tooling"
  | "collaboration"
  | "ai";

type Skill = {
  name: string;
  category: SkillCategory;
  level: "used" | "comfortable" | "strong";
  description: string;
  relatedProjects: string[];
};
```

### 6.4 Resume Summary

```ts
type ResumeSummary = {
  headline: string;
  strengths: string[];
  projectHighlights: {
    projectId: string;
    summary: string;
  }[];
  techSummary: string[];
  educationAndActivities: string[];
  pdfPath: string;
};
```

## 7. 콘텐츠 작성 기준

- 프로젝트 제목은 기능명이 아니라 가치 중심 문장으로 작성한다.
- 성과는 가능한 경우 수치 또는 구체적 변화로 작성한다.
- 기술 스택은 사용한 이유와 연결한다.
- 트러블슈팅은 문제, 원인, 해결, 배운 점 순서로 작성한다.
- 과장된 표현과 검증되지 않은 수치를 사용하지 않는다.

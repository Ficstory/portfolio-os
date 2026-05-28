# 구현 작업 순서와 병행 프롬프트

## 1. 사용 방법

이 문서는 `portfolio-os` MVP를 여러 스레드에서 빠르게 구현하기 위한 실행 지휘 문서다. 각 프롬프트는 다른 스레드에 그대로 붙여넣을 수 있게 작성했다.

작업자는 다음 규칙을 지킨다.

- FE 코드만 수정한다.
- BE, DB, 서버 API, CMS, 서버 저장형 연락처 폼은 구현하지 않는다.
- 블로그/노트는 MVP 내부 라우트나 핵심 폴더로 만들지 않는다.
- UI와 콘텐츠는 한국어로 작성한다.
- Apple UI를 그대로 복제하지 않고 감성적인 macOS풍만 참고한다.
- 작업 완료 전 `npm run lint`와 `npm run build`를 실행한다.
- 같은 파일을 수정하는 프롬프트는 병행하지 않는다.

## 2. 전체 실행표

```txt
현재 상태
  - Next.js 초기 세팅 완료
  - docs 문서 완료
  - main == origin/main

1차 단독 작업
  Prompt 1. Foundation 계약 정리

Prompt 1 완료 후 병행 가능
  Prompt 2. 디자인 토큰과 전역 스타일
  Prompt 3. 정적 콘텐츠 데이터
  Prompt 4. Lock Screen UI

Prompt 2, 3, 4 완료 후 단독 작업
  Prompt 5. Desktop Store와 Window Manager

Prompt 5 완료 후 병행 가능
  Prompt 6. Desktop Shell, Dock, Menu Bar
  Prompt 7. 핵심 폴더 창
  Prompt 8. 프로젝트 상세 컴포넌트와 라우트

Prompt 6, 7, 8 완료 후 병행 가능
  Prompt 9. Resume 직접 라우트
  Prompt 10. 모바일 레이아웃
  Prompt 11. SEO, OG, 접근성 마감

마지막 단독 작업
  Prompt 12. 통합 QA와 배포 준비
```

## 3. 병행 실행 그룹

| 그룹 | 실행 조건 | 병행 가능 프롬프트 | 병행 이유 |
| --- | --- | --- | --- |
| Group A | Prompt 1 완료 후 | Prompt 2, 3, 4 | CSS, 데이터, LockScreen이 파일 충돌 없이 분리된다. |
| Group B | Prompt 5 완료 후 | Prompt 6, 7, 8 | 데스크톱 셸, 폴더 창, 프로젝트 상세가 서로 다른 컴포넌트 영역이다. |
| Group C | Prompt 6, 7, 8 완료 후 | Prompt 9, 10, 11 | Resume route, 모바일, SEO가 분리되어 있다. |

## 4. 공통 완료 보고 형식

각 스레드는 작업 완료 후 수행한 프롬프트 번호, 실제 변경 파일 전체, 구현 요약, `npm run lint` 결과, `npm run build` 결과, 다음 프롬프트가 알아야 할 계약 변경 또는 리스크를 보고한다.

## Prompt 1. Foundation 계약 정리

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 MVP 구현의 기반 계약을 고정하는 단독 선행 작업이다.

실행 조건:
- 현재 브랜치는 `main` 기준이다.
- 이 프롬프트는 다른 프롬프트보다 먼저 완료되어야 한다.
- 이 작업이 끝나기 전 Prompt 2~12를 시작하지 않는다.

참조 문서:
- docs/01_requirements_spec.md
- docs/03_information_architecture.md
- docs/05_component_design.md

수정/생성 파일:
- 생성: src/lib/cn.ts
- 생성: src/types/portfolio.ts
- 생성: src/data/folders.ts
- 생성: src/data/navigation.ts

구현 요구:
1. `src/lib/cn.ts`를 만든다.
   - `clsx`와 `tailwind-merge`를 조합한 `cn(...inputs)` 유틸을 export한다.
   - 다른 컴포넌트에서 `import { cn } from "@/lib/cn"`로 사용할 수 있어야 한다.

2. `src/types/portfolio.ts`를 만든다.
   - 다음 타입을 export한다.
   - `FolderId = "about" | "projects" | "skills" | "resume" | "contact"`
   - `WindowId = FolderId | \`project-${string}\``
   - `ThemeMode = "light" | "dark" | "system"`
   - `SkillCategory = "frontend" | "state" | "styling" | "tooling" | "collaboration" | "ai"`
   - `FolderItem`, `NavigationItem`, `Project`, `Skill`, `ResumeSummary`, `ExternalLinks`
   - `Project`는 `problem`, `role`, `stack`, `implementationHighlights`, `troubleshooting`, `result`, `links`, `thumbnail`, `media` 필드를 반드시 가진다.

3. `src/data/folders.ts`를 만든다.
   - About Me, Projects, Skills, Resume, Contact 5개만 등록한다.
   - Notes, Blog는 등록하지 않는다.
   - 각 폴더는 `id`, `title`, `description`, `iconName`, `defaultWindowSize`를 가진다.

4. `src/data/navigation.ts`를 만든다.
   - 내부 navigation은 About, Projects, Skills, Resume, Contact만 포함한다.
   - 외부 링크 자리로 GitHub, Blog, Email 타입을 허용하되 실제 값은 Prompt 3에서 관리한다.

금지 사항:
- UI 컴포넌트를 구현하지 않는다.
- `src/app/page.tsx`를 수정하지 않는다.
- 블로그/노트 내부 라우트를 만들지 않는다.
- 서버 API를 만들지 않는다.

검증:
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `chore: 구현 기반 타입과 유틸 추가`

완료 보고:
- 생성한 타입 목록
- 폴더 ID 계약
- lint/build 결과
```

## Prompt 2. 디자인 토큰과 전역 스타일

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 디자인 시스템을 전역 CSS와 토큰으로 구현하는 작업이다.

실행 조건:
- Prompt 1 완료 후 시작한다.
- Prompt 3, Prompt 4와 병행 가능하다.
- 이 작업은 `src/app/globals.css` 중심으로만 진행한다.

참조 문서:
- docs/04_design_system.md
- docs/05_component_design.md

수정/생성 파일:
- 수정: src/app/globals.css

구현 요구:
1. light theme CSS 변수를 정의한다.
   - `--color-bg: #eef2f7`
   - `--color-wallpaper-start: #dde7f3`
   - `--color-wallpaper-end: #f7e7e2`
   - `--color-surface: rgba(255, 255, 255, 0.72)`
   - `--color-surface-strong: rgba(255, 255, 255, 0.9)`
   - `--color-border: rgba(70, 82, 102, 0.18)`
   - `--color-text: #1f2937`
   - `--color-text-muted: #667085`
   - `--color-accent: #4f8fd9`
   - `--color-accent-soft: #dcebff`
   - `--color-coral: #e98b74`
   - `--color-green: #5dae8b`

2. dark theme CSS 변수를 정의한다.
   - `[data-theme="dark"]` 또는 `.dark` 전략 중 하나를 사용한다.
   - dark 값은 docs/04_design_system.md의 값을 따른다.

3. 전역 base 스타일을 정리한다.
   - body font는 `Pretendard, Inter, system-ui, sans-serif` 순서로 지정한다.
   - `letter-spacing`은 음수로 지정하지 않는다.
   - `html`, `body`는 100% 높이를 갖는다.
   - selection 색상과 focus-visible outline을 명확하게 지정한다.

4. 공통 utility class를 추가한다.
   - `.wallpaper`
   - `.glass-surface`
   - `.window-shadow`
   - `.dock-shadow`
   - `.text-muted`

5. reduced motion 대응을 추가한다.
   - `@media (prefers-reduced-motion: reduce)`에서 animation, transition duration을 최소화한다.

금지 사항:
- 컴포넌트 파일을 수정하지 않는다.
- Tailwind 설정 파일을 새로 만들지 않는다.
- 단일 보라색/파란색 계열로만 보이는 팔레트를 만들지 않는다.

검증:
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `style: 포트폴리오 디자인 토큰 추가`

완료 보고:
- 적용한 theme 전략
- 추가한 utility class
- lint/build 결과
```

## Prompt 3. 정적 콘텐츠 데이터

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 MVP 화면이 사용할 정적 콘텐츠 데이터를 만드는 작업이다.

실행 조건:
- Prompt 1 완료 후 시작한다.
- Prompt 2, Prompt 4와 병행 가능하다.
- 이 작업은 데이터와 콘텐츠 파일만 수정한다.

참조 문서:
- docs/01_requirements_spec.md
- docs/03_information_architecture.md
- docs/05_component_design.md

수정/생성 파일:
- 생성: src/data/profile.ts
- 생성: src/data/projects.ts
- 생성: src/data/skills.ts
- 생성: src/data/links.ts
- 생성: src/content/resume-summary.ts
- 생성: src/content/projects/project-01.mdx
- 생성: src/content/projects/project-02.mdx
- 생성: src/content/projects/project-03.mdx

구현 요구:
1. `profile.ts`를 만든다.
   - 이름은 실제 값이 없으면 `"프론트엔드 개발자"`로 둔다.
   - headline은 `"사용자 경험을 화면의 구조로 설계하고, 문제를 제품의 형태로 구현합니다."`를 사용한다.
   - strengths는 3개로 제한한다.
   - focusKeywords는 4~6개로 제한한다.

2. `projects.ts`를 만든다.
   - 대표 프로젝트는 정확히 3개다.
   - id와 slug는 다음 값을 사용한다.
     - `portfolio-os`
     - `frontend-collaboration`
     - `problem-solving-archive`
   - 실제 프로젝트 정보가 없으므로 과장 없는 샘플 콘텐츠를 사용한다.
   - 각 프로젝트는 같은 구조를 가진다.
   - `links` 값이 없으면 빈 객체로 두고 UI에서 숨길 수 있게 한다.

3. `skills.ts`를 만든다.
   - 카테고리는 frontend, state, styling, tooling, collaboration, ai를 모두 포함한다.
   - 각 기술은 `name`, `category`, `level`, `description`, `relatedProjects`를 가진다.
   - level은 `"used" | "comfortable" | "strong"` 중 하나만 사용한다.

4. `links.ts`를 만든다.
   - github, blog, email 필드를 가진다.
   - 실제 값이 없으면 다음 안전한 값으로 둔다.
     - github: `https://github.com/Ficstory`
     - blog: `""`
     - email: `mailto:`

5. `resume-summary.ts`를 만든다.
   - headline, strengths, projectHighlights, techSummary, educationAndActivities, pdfPath를 가진다.
   - pdfPath는 `/resume/resume.pdf`로 둔다.

6. 프로젝트 MDX 3개를 만든다.
   - 각 파일은 프로젝트 상세 구조를 Markdown heading으로 가진다.
   - 섹션 순서: 문제 정의, 내 역할, 기술 스택, 주요 구현, 트러블슈팅, 성과, 링크

금지 사항:
- UI 컴포넌트를 수정하지 않는다.
- 실제 이력이나 성과를 과장하지 않는다.
- 대표 프로젝트를 4개 이상 만들지 않는다.
- 블로그/노트 내부 콘텐츠를 만들지 않는다.

검증:
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `data: 포트폴리오 정적 콘텐츠 추가`

완료 보고:
- 생성한 데이터 파일
- 프로젝트 3개 slug
- lint/build 결과
```

## Prompt 4. Lock Screen UI

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 첫 화면을 잠금화면형 랜딩으로 구현하는 작업이다.

실행 조건:
- Prompt 1 완료 후 시작한다.
- Prompt 2, Prompt 3과 병행 가능하다.
- Prompt 3 데이터가 아직 없을 수 있으므로 이 프롬프트에서는 LockScreen 내부 기본 문구를 사용한다.

참조 문서:
- docs/01_requirements_spec.md
- docs/02_functional_spec.md
- docs/04_design_system.md

수정/생성 파일:
- 생성: src/components/lock-screen/LockScreen.tsx
- 수정: src/app/page.tsx

구현 요구:
1. `LockScreen`은 client component로 만든다.
   - `use client`를 사용한다.
   - Motion for React를 사용한다.
   - 현재 시간과 날짜를 표시한다.
   - 시간은 1분 단위로 갱신한다.
   - 날짜는 한국어 형식으로 표시한다.

2. 화면 구성:
   - 전체 화면 wallpaper 배경
   - 중앙 또는 하단 중앙에 시간, 날짜, headline
   - headline: `"사용자 경험을 화면의 구조로 설계하고, 문제를 제품의 형태로 구현합니다."`
   - 버튼 문구: `"포트폴리오 입장"`
   - 하단 quick link: GitHub, Resume, Email

3. 상호작용:
   - 버튼 클릭 시 unlock 상태가 true가 된다.
   - Enter 키 입력 시 unlock 상태가 true가 된다.
   - unlock 후에는 데스크톱 임시 화면을 표시한다.
   - 임시 화면 문구는 `"Desktop workspace 준비 중"`으로 둔다.

4. 접근성:
   - 입장 버튼은 실제 button 요소다.
   - quick link는 접근 가능한 텍스트를 가진다.
   - 키보드 focus ring이 보여야 한다.

5. 모션:
   - unlock 전환은 opacity와 scale만 사용한다.
   - reduced motion 환경에서는 scale 없이 opacity만 사용한다.

금지 사항:
- DesktopShell, WindowManager를 구현하지 않는다.
- 데이터 파일을 수정하지 않는다.
- 실제 비밀번호 입력 UI를 만들지 않는다.

검증:
- Enter 키로 입장 동작이 실행된다.
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: 잠금화면 랜딩 구현`

완료 보고:
- LockScreen 동작 요약
- page.tsx 연결 방식
- lint/build 결과
```

## Prompt 5. Desktop Store와 Window Manager

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 데스크톱 창 상태 관리와 공통 창 프레임을 구현하는 단독 선행 작업이다.

실행 조건:
- Prompt 2, Prompt 3, Prompt 4가 완료된 뒤 시작한다.
- Prompt 6, Prompt 7, Prompt 8보다 먼저 완료되어야 한다.
- 이 작업 중에는 DesktopShell, 폴더 창, 프로젝트 상세 컴포넌트를 구현하지 않는다.

참조 문서:
- docs/02_functional_spec.md
- docs/05_component_design.md

수정/생성 파일:
- 생성: src/stores/desktopStore.ts
- 생성: src/components/desktop/AppWindow.tsx
- 생성: src/components/desktop/WindowManager.tsx

구현 요구:
1. `desktopStore.ts`를 만든다.
   - Zustand를 사용한다.
   - 상태:
     - `hasUnlocked: boolean`
     - `activeWindowId: WindowId | null`
     - `windows: DesktopWindow[]`
   - 액션:
     - `unlock()`
     - `openWindow(id: WindowId, title?: string)`
     - `closeWindow(id: WindowId)`
     - `focusWindow(id: WindowId)`
     - `moveWindow(id: WindowId, position: { x: number; y: number })`
   - 같은 id의 창은 중복 생성하지 않는다.
   - 새로 열리거나 focus된 창은 가장 높은 z-index를 갖는다.

2. `AppWindow.tsx`를 만든다.
   - client component다.
   - props: id, title, position, size, zIndex, isActive, children
   - titlebar, 닫기 버튼, content 영역을 가진다.
   - 닫기 버튼은 `aria-label="창 닫기"`를 가진다.
   - pointer drag로 위치 이동을 지원한다.
   - 창 최소화/최대화/리사이즈는 구현하지 않는다.

3. `WindowManager.tsx`를 만든다.
   - 현재는 window id에 따라 임시 콘텐츠를 렌더링한다.
   - Prompt 7에서 실제 폴더 창으로 교체할 수 있도록 switch 구조를 만든다.
   - 빈 windows 상태에서는 아무것도 렌더링하지 않는다.

금지 사항:
- DesktopShell을 수정하지 않는다.
- FolderWindow를 구현하지 않는다.
- 모바일 레이아웃을 구현하지 않는다.

검증:
- 같은 id를 두 번 `openWindow`해도 창이 하나만 유지되는 로직인지 코드로 확인한다.
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: 데스크톱 창 관리 구현`

완료 보고:
- store 공개 API
- AppWindow 지원 기능과 보류 기능
- lint/build 결과
```

## Prompt 6. Desktop Shell, Dock, Menu Bar

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 입장 후 보이는 데스크톱 UI 뼈대를 구현하는 작업이다.

실행 조건:
- Prompt 5 완료 후 시작한다.
- Prompt 7, Prompt 8과 병행 가능하다.
- store 내부 구현은 수정하지 말고 Prompt 5의 공개 API만 사용한다.

참조 문서:
- docs/02_functional_spec.md
- docs/04_design_system.md
- docs/05_component_design.md

수정/생성 파일:
- 생성: src/components/desktop/DesktopShell.tsx
- 생성: src/components/desktop/MenuBar.tsx
- 생성: src/components/desktop/DesktopIconGrid.tsx
- 생성: src/components/desktop/DesktopIcon.tsx
- 생성: src/components/desktop/Dock.tsx
- 수정: src/app/page.tsx

구현 요구:
1. `DesktopShell`을 만든다.
   - wallpaper 배경을 사용한다.
   - 상단 MenuBar, 중앙 DesktopIconGrid, 하단 Dock, WindowManager를 배치한다.
   - hasUnlocked가 true일 때 보여지도록 page.tsx와 연결한다.

2. `MenuBar`를 만든다.
   - 좌측: `Portfolio OS`
   - 중앙 또는 좌측 보조: 활성 창 이름
   - 우측: 현재 시간, 테마 토글 자리
   - 실제 테마 토글 기능은 Prompt 11에서 마감해도 된다.

3. `DesktopIconGrid`와 `DesktopIcon`을 만든다.
   - folders 데이터를 사용한다.
   - 더블클릭으로 창을 연다.
   - Enter 또는 Space로 창을 연다.
   - 아이콘 라벨은 최대 2줄로 제한한다.

4. `Dock`을 만든다.
   - 내부 항목: About, Projects, Resume, Contact
   - 외부 항목: GitHub
   - 내부 항목 클릭 시 openWindow를 호출한다.
   - 열린 창이 있는 내부 항목에는 indicator를 표시한다.

금지 사항:
- WindowManager 내부 switch를 실제 폴더 창으로 바꾸지 않는다.
- 프로젝트 상세 라우트를 만들지 않는다.
- 모바일 레이아웃을 만들지 않는다.

검증:
- About, Projects, Skills, Resume, Contact 아이콘이 보인다.
- Dock 내부 항목 클릭 시 창 임시 콘텐츠가 열린다.
- 키보드로 폴더 실행이 가능하다.
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: 데스크톱 셸과 Dock 구현`

완료 보고:
- DesktopShell 구조
- Dock 항목
- lint/build 결과
```

## Prompt 7. 핵심 폴더 창

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 About, Projects, Skills, Resume, Contact 폴더 창 콘텐츠를 구현하는 작업이다.

실행 조건:
- Prompt 5 완료 후 시작한다.
- Prompt 6, Prompt 8과 병행 가능하다.
- WindowManager 연결은 최소 변경만 한다.

참조 문서:
- docs/02_functional_spec.md
- docs/03_information_architecture.md
- docs/05_component_design.md

수정/생성 파일:
- 생성: src/components/folders/AboutWindow.tsx
- 생성: src/components/folders/ProjectsWindow.tsx
- 생성: src/components/folders/SkillsWindow.tsx
- 생성: src/components/folders/ResumeWindow.tsx
- 생성: src/components/folders/ContactWindow.tsx
- 수정: src/components/desktop/WindowManager.tsx

구현 요구:
1. `AboutWindow`:
   - profile 데이터를 사용한다.
   - 한 줄 소개, 핵심 강점 3개, 현재 집중 키워드를 표시한다.

2. `ProjectsWindow`:
   - projects 데이터 3개를 표시한다.
   - 카드에는 title, summary, role, stack 일부를 보여준다.
   - 상세 route 연결은 Prompt 8에서 하므로 여기서는 기본 목록만 구현한다.

3. `SkillsWindow`:
   - skills 데이터를 category별로 그룹화한다.
   - 기술명, level, description을 표시한다.

4. `ResumeWindow`:
   - resume summary 데이터를 사용한다.
   - 웹 요약본과 PDF 다운로드 버튼을 표시한다.
   - PDF가 아직 없어도 UI가 깨지지 않게 한다.

5. `ContactWindow`:
   - GitHub, 블로그, 이메일 링크를 표시한다.
   - 서버 저장형 연락처 폼은 만들지 않는다.

6. `WindowManager`:
   - id가 about/projects/skills/resume/contact일 때 위 컴포넌트를 렌더링한다.
   - `project-${slug}`는 Prompt 8에서 처리할 수 있도록 임시 콘텐츠를 유지한다.

금지 사항:
- `src/app/projects/[slug]/page.tsx`를 만들지 않는다.
- ProjectDetail 컴포넌트를 만들지 않는다.
- DesktopShell 레이아웃을 수정하지 않는다.

검증:
- 5개 폴더 창이 각각 빌드 가능한 컴포넌트로 연결된다.
- 프로젝트 개수는 3개만 표시된다.
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: 핵심 포트폴리오 폴더 창 구현`

완료 보고:
- 구현한 폴더 창 목록
- WindowManager 연결 방식
- lint/build 결과
```

## Prompt 8. 프로젝트 상세 컴포넌트와 라우트

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 대표 프로젝트 3개의 상세 보기와 직접 접근 라우트를 구현하는 작업이다.

실행 조건:
- Prompt 5 완료 후 시작한다.
- Prompt 6, Prompt 7과 병행 가능하다.
- ProjectsWindow는 Prompt 7 작업 영역이므로 수정하지 않는다.

참조 문서:
- docs/02_functional_spec.md
- docs/03_information_architecture.md

수정/생성 파일:
- 생성: src/components/projects/ProjectCard.tsx
- 생성: src/components/projects/ProjectDetail.tsx
- 생성: src/components/projects/ProjectMetaPanel.tsx
- 생성: src/app/projects/[slug]/page.tsx

구현 요구:
1. `ProjectCard`:
   - title, summary, valueStatement, stack, role을 표시한다.
   - 카드 전체가 링크 또는 버튼 역할을 할 수 있도록 접근성을 고려한다.

2. `ProjectMetaPanel`:
   - 역할, 기술 스택, 링크, 미디어 목록을 요약 표시한다.
   - 링크가 없는 항목은 버튼을 렌더링하지 않는다.

3. `ProjectDetail`:
   - 섹션 순서:
     1. 프로젝트 한 줄 가치
     2. 문제 정의
     3. 내 역할
     4. 기술 스택
     5. 주요 구현
     6. 트러블슈팅
     7. 성과와 배운 점
     8. 링크와 미디어
   - 긴 텍스트는 읽기 좋은 폭을 유지한다.

4. `/projects/[slug]`:
   - `generateStaticParams`를 사용해 3개 프로젝트 slug를 정적 생성한다.
   - 존재하지 않는 slug는 `notFound()`로 처리한다.
   - metadata title과 description을 프로젝트 데이터에서 만든다.

금지 사항:
- ProjectsWindow를 수정하지 않는다.
- Resume route를 만들지 않는다.
- MDX parser를 새로 도입하지 않는다. 현재는 TypeScript 데이터 기반으로 상세를 렌더링한다.

검증:
- 3개 slug가 모두 build에 포함된다.
- 존재하지 않는 slug 처리 코드가 있다.
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: 프로젝트 상세 페이지 구현`

완료 보고:
- 생성한 route
- ProjectDetail 섹션 구조
- lint/build 결과
```

## Prompt 9. Resume 직접 라우트

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 이력서 웹 요약 직접 접근 페이지를 구현하는 작업이다.

실행 조건:
- Prompt 6, Prompt 7, Prompt 8 완료 후 시작한다.
- Prompt 10, Prompt 11과 병행 가능하다.

참조 문서:
- docs/01_requirements_spec.md
- docs/03_information_architecture.md

수정/생성 파일:
- 생성: src/app/resume/page.tsx
- 생성: public/resume/.gitkeep

구현 요구:
1. `/resume` 페이지를 만든다.
   - resume summary 데이터를 사용한다.
   - ResumeWindow와 같은 정보 구조를 따른다.
   - 한 줄 소개, 핵심 역량, 프로젝트 요약, 기술 요약, 교육/활동 요약을 표시한다.

2. PDF 처리:
   - 실제 PDF 파일이 아직 없으므로 `public/resume/.gitkeep`을 추가한다.
   - 다운로드 버튼은 보이되 `"PDF 준비 중"` 상태를 명확히 표시한다.
   - 나중에 `public/resume/resume.pdf`가 들어오면 같은 경로로 활성화할 수 있게 구조를 둔다.

3. SEO:
   - resume page metadata title과 description을 설정한다.

금지 사항:
- 서버에서 PDF 존재 여부를 확인하지 않는다.
- 파일 업로드 기능을 만들지 않는다.
- Contact form을 만들지 않는다.

검증:
- `/resume` route가 build에 포함된다.
- PDF가 없어도 build가 실패하지 않는다.
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: 이력서 요약 페이지 구현`

완료 보고:
- Resume page 구조
- PDF 준비 상태 처리 방식
- lint/build 결과
```

## Prompt 10. 모바일 레이아웃

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 모바일에서 데스크톱 UI를 무리하게 강제하지 않는 탐색 레이아웃을 구현하는 작업이다.

실행 조건:
- Prompt 6, Prompt 7, Prompt 8 완료 후 시작한다.
- Prompt 9, Prompt 11과 병행 가능하다.

참조 문서:
- docs/01_requirements_spec.md
- docs/04_design_system.md
- docs/05_component_design.md

수정/생성 파일:
- 생성: src/components/mobile/MobileHome.tsx
- 생성: src/components/mobile/MobileSection.tsx
- 수정: src/components/desktop/DesktopShell.tsx
- 수정: src/app/globals.css

구현 요구:
1. `MobileHome`:
   - 768px 미만에서 폴더 카드 리스트를 보여준다.
   - About, Projects, Skills, Resume, Contact에 접근 가능해야 한다.
   - 카드는 최소 40px 이상의 터치 영역을 가진다.

2. `MobileSection`:
   - 모바일 상세를 전체 화면 문서형 레이아웃으로 표시한다.
   - hover가 없어도 모든 정보가 보인다.

3. `DesktopShell` 반응형 처리:
   - desktop UI는 `md` 이상에서 우선 표시한다.
   - 모바일에서는 드래그 창 조작을 핵심 상호작용으로 사용하지 않는다.

4. CSS:
   - 360px 폭에서 텍스트와 버튼이 겹치지 않게 한다.
   - viewport width 기반 font-size 계산을 사용하지 않는다.

금지 사항:
- 프로젝트 데이터 구조를 바꾸지 않는다.
- Desktop Store API를 바꾸지 않는다.
- SEO 파일을 수정하지 않는다.

검증:
- 360px, 768px, 1440px 기준으로 레이아웃을 확인한다.
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: 모바일 포트폴리오 레이아웃 구현`

완료 보고:
- 모바일 전환 기준
- 모바일에서 접근 가능한 섹션
- lint/build 결과
```

## Prompt 11. SEO, OG, 접근성 마감

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 MVP의 검색/공유 메타데이터와 접근성 마감을 구현하는 작업이다.

실행 조건:
- Prompt 6, Prompt 7, Prompt 8 완료 후 시작한다.
- Prompt 9, Prompt 10과 병행 가능하다.

참조 문서:
- docs/01_requirements_spec.md
- docs/02_functional_spec.md
- docs/04_design_system.md

수정/생성 파일:
- 생성: src/lib/seo.ts
- 수정: src/app/layout.tsx
- 생성: src/app/sitemap.ts
- 생성: src/app/robots.ts
- 생성: public/og/portfolio-og.svg

구현 요구:
1. `src/lib/seo.ts`:
   - siteName, siteDescription, baseUrl, ogImage 경로를 export한다.
   - baseUrl은 실제 도메인이 없으므로 `https://portfolio-os.vercel.app`로 둔다.

2. `layout.tsx` metadata:
   - 한국어 title과 description을 설정한다.
   - Open Graph title, description, image를 설정한다.
   - Twitter card를 설정한다.

3. `sitemap.ts`:
   - `/`
   - `/resume`
   - `/projects/portfolio-os`
   - `/projects/frontend-collaboration`
   - `/projects/problem-solving-archive`
   - 위 경로를 포함한다.

4. `robots.ts`:
   - 전체 allow
   - sitemap 경로 제공

5. OG 이미지:
   - `public/og/portfolio-og.svg`를 만든다.
   - 텍스트는 `Portfolio OS`와 한국어 설명을 포함한다.
   - Apple 로고나 macOS UI를 복제하지 않는다.

6. 접근성 점검:
   - 아이콘 버튼에 aria-label이 있는지 확인한다.
   - focus-visible이 숨겨지지 않았는지 확인한다.
   - reduced motion 전역 규칙이 있는지 확인한다.

금지 사항:
- 외부 이미지 다운로드를 하지 않는다.
- 실제 도메인이 확정된 것처럼 문서화하지 않는다.
- 모바일 레이아웃을 수정하지 않는다.

검증:
- `npm run lint`
- `npm run build`

권장 커밋 메시지:
- `feat: SEO와 접근성 마감`

완료 보고:
- 추가한 metadata
- sitemap 경로
- 접근성 점검 결과
- lint/build 결과
```

## Prompt 12. 통합 QA와 배포 준비

```md
너는 `portfolio-os` 프로젝트의 FE 개발자다. 지금 작업은 MVP 구현 전체를 검증하고 배포 준비 상태로 만드는 마지막 단독 작업이다.

실행 조건:
- Prompt 1~11이 모두 완료된 뒤 시작한다.
- 이 작업은 병행하지 않는다.

참조 문서:
- docs/01_requirements_spec.md
- docs/02_functional_spec.md
- docs/07_consistency_test.md

수정/생성 파일:
- 필요 시 docs/07_consistency_test.md
- 필요 시 README.md

작업 내용:
1. 정적 검증:
   - `npm run lint`
   - `npm run build`

2. 기능 수동 점검:
   - 잠금화면이 첫 화면으로 표시된다.
   - 버튼 클릭으로 데스크톱에 진입한다.
   - Enter 키로 데스크톱에 진입한다.
   - About, Projects, Skills, Resume, Contact 폴더가 열린다.
   - 같은 폴더를 여러 번 열어도 중복 창이 생기지 않는다.
   - 프로젝트 상세 3개 route가 접근 가능하다.
   - `/resume` route가 접근 가능하다.
   - 모바일 폭에서 핵심 콘텐츠 접근이 가능하다.

3. 요구사항 매핑:
   - REQ-001부터 REQ-020까지 구현 여부를 확인한다.
   - 누락이 있으면 구현하거나 `docs/07_consistency_test.md`에 리스크로 기록한다.

4. 배포 준비:
   - `main`과 `origin/main` 동기화 상태를 확인한다.
   - Vercel 배포에 필요한 환경 변수가 없는지 확인한다.
   - README가 없으면 프로젝트 설명, 실행 방법, 배포 방법을 작성한다.

금지 사항:
- QA 중 새 기능을 임의로 추가하지 않는다.
- 블로그/노트 MVP 제외 정책을 바꾸지 않는다.
- BE 기능을 추가하지 않는다.

검증:
- `npm run lint` 통과
- `npm run build` 통과
- 수동 점검 결과 기록

권장 커밋 메시지:
- `chore: MVP 검증 및 배포 준비`

완료 보고:
- lint/build 결과
- 수동 점검 결과
- 남은 리스크
- push 여부
```

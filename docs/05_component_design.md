# 컴포넌트 설계서

## 1. 설계 원칙

- 컴포넌트는 화면 메타포 단위로 분리한다.
- 상태 관리는 UI 상태와 콘텐츠 데이터를 분리한다.
- 대표 프로젝트 3개와 이력서 요약은 정적 데이터로 관리한다.
- 창 관리 로직은 `WindowManager`와 Zustand store에 집중시킨다.
- 모바일 레이아웃은 데스크톱 창 컴포넌트를 억지로 재사용하지 않고 별도 표현 컴포넌트를 둔다.

## 2. 권장 폴더 구조

```txt
src
├─ app
│  ├─ page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ projects
│  │  └─ [slug]
│  │     └─ page.tsx
│  └─ resume
│     └─ page.tsx
├─ components
│  ├─ desktop
│  │  ├─ DesktopShell.tsx
│  │  ├─ DesktopIcon.tsx
│  │  ├─ DesktopIconGrid.tsx
│  │  ├─ Dock.tsx
│  │  ├─ MenuBar.tsx
│  │  ├─ WindowManager.tsx
│  │  └─ AppWindow.tsx
│  ├─ lock-screen
│  │  └─ LockScreen.tsx
│  ├─ folders
│  │  ├─ AboutWindow.tsx
│  │  ├─ ProjectsWindow.tsx
│  │  ├─ SkillsWindow.tsx
│  │  ├─ ResumeWindow.tsx
│  │  └─ ContactWindow.tsx
│  ├─ projects
│  │  ├─ ProjectCard.tsx
│  │  ├─ ProjectDetail.tsx
│  │  └─ ProjectMetaPanel.tsx
│  ├─ mobile
│  │  ├─ MobileHome.tsx
│  │  └─ MobileSection.tsx
│  └─ ui
│     ├─ IconButton.tsx
│     ├─ ThemeToggle.tsx
│     └─ Tooltip.tsx
├─ content
│  ├─ projects
│  │  ├─ project-01.mdx
│  │  ├─ project-02.mdx
│  │  └─ project-03.mdx
│  └─ resume-summary.ts
├─ data
│  ├─ folders.ts
│  ├─ navigation.ts
│  ├─ projects.ts
│  ├─ skills.ts
│  ├─ profile.ts
│  └─ links.ts
├─ stores
│  ├─ desktopStore.ts
│  └─ themeStore.ts
└─ lib
   ├─ seo.ts
   └─ cn.ts
```

## 3. 컴포넌트 책임

| 컴포넌트 | 책임 | 관련 기능 |
| --- | --- | --- |
| `LockScreen` | 잠금화면 랜딩 표시와 입장 이벤트 처리 | FEAT-001, FEAT-002 |
| `DesktopShell` | 데스크톱 전체 레이아웃 구성 | FEAT-003 |
| `MenuBar` | 상단 메뉴, 현재 시간, 테마 토글 표시 | FEAT-007, FEAT-012 |
| `DesktopIconGrid` | 바탕화면 폴더 아이콘 목록 배치 | FEAT-004 |
| `DesktopIcon` | 단일 폴더 아이콘, 실행 이벤트 처리 | FEAT-004, FEAT-014 |
| `Dock` | 주요 폴더와 외부 링크 바로가기 | FEAT-006 |
| `WindowManager` | 열린 창 렌더링, z-index 순서 관리 | FEAT-005 |
| `AppWindow` | 공통 창 프레임, titlebar, drag, close | FEAT-005 |
| `AboutWindow` | 자기소개 콘텐츠 표시 | CON-001 |
| `ProjectsWindow` | 프로젝트 3개 목록 표시 | FEAT-008 |
| `ProjectCard` | 프로젝트 요약 카드 표시 | FEAT-008 |
| `ProjectDetail` | 프로젝트 상세 콘텐츠 표시 | FEAT-008 |
| `ProjectMetaPanel` | 역할, 기간, 기술, 링크 표시 | FEAT-008 |
| `SkillsWindow` | 기술 카테고리와 기술 카드 표시 | FEAT-010 |
| `ResumeWindow` | 이력서 요약과 PDF 다운로드 | FEAT-009 |
| `ContactWindow` | 이메일, GitHub, 블로그 링크 표시 | FEAT-011 |
| `MobileHome` | 모바일 전용 앱 런처형 홈 | FEAT-013 |
| `MobileSection` | 모바일 전용 섹션 상세 | FEAT-013 |
| `ThemeToggle` | 테마 전환 | FEAT-012 |
| `Tooltip` | 아이콘 버튼 설명 제공 | FEAT-014 |
| `data/navigation.ts` | MVP 폴더와 외부 링크 범위 제한 | FEAT-017 |

## 4. 상태 설계

### 4.1 Desktop Store

```ts
type WindowId = "about" | "projects" | "skills" | "resume" | "contact" | `project-${string}`;

type DesktopWindow = {
  id: WindowId;
  title: string;
  type: "folder" | "project" | "resume" | "contact";
  isOpen: boolean;
  zIndex: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};

type DesktopState = {
  hasUnlocked: boolean;
  activeWindowId: WindowId | null;
  windows: DesktopWindow[];
  unlock: () => void;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, position: DesktopWindow["position"]) => void;
};
```

### 4.2 Theme Store

```ts
type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
};
```

## 5. Props 설계

### 5.1 AppWindow

```ts
type AppWindowProps = {
  id: WindowId;
  title: string;
  initialSize: {
    width: number;
    height: number;
  };
  children: React.ReactNode;
};
```

### 5.2 DesktopIcon

```ts
type DesktopIconProps = {
  id: FolderId;
  label: string;
  description: string;
  icon: React.ReactNode;
  onOpen: (id: FolderId) => void;
};
```

### 5.3 ProjectCard

```ts
type ProjectCardProps = {
  project: Project;
  onOpen: (projectId: string) => void;
};
```

## 6. 데이터 흐름

```txt
data/*.ts
  -> DesktopIconGrid, Dock, Folder Windows

content/projects/*.mdx
  -> ProjectDetail

desktopStore
  -> DesktopShell
  -> WindowManager
  -> AppWindow

themeStore
  -> ThemeToggle
  -> document class or data-theme
```

## 7. 접근성 설계

- `LockScreen` 입장 버튼은 `button` 요소를 사용한다.
- `DesktopIcon`은 button 역할을 가지며 Enter와 Space로 실행된다.
- `AppWindow`는 제목과 연결된 landmark 또는 dialog 성격의 컨테이너를 사용한다.
- 닫기 버튼은 `aria-label="창 닫기"` 형식으로 제공한다.
- Dock 아이콘에는 tooltip과 접근 가능한 이름을 제공한다.
- 모바일에서는 모든 콘텐츠를 일반 문서 흐름으로 읽을 수 있게 한다.

## 8. 테스트 관점

- `LockScreen` 버튼 클릭 시 `hasUnlocked`가 true가 되는지 확인한다.
- 같은 폴더를 두 번 실행해도 중복 창이 생기지 않는지 확인한다.
- 새 창이 열릴 때 활성 창과 z-index가 갱신되는지 확인한다.
- Resume 창에서 PDF 링크가 올바른 경로를 가리키는지 확인한다.
- reduced motion 설정에서 scale 애니메이션이 제거되는지 확인한다.
- 모바일 폭에서 Desktop window 대신 모바일 섹션 레이아웃이 표시되는지 확인한다.
- 기본 navigation 데이터에 Notes, Blog 내부 폴더가 포함되지 않는지 확인한다.
- API client 또는 서버 저장형 연락처 폼 컴포넌트가 생성되지 않는지 확인한다.

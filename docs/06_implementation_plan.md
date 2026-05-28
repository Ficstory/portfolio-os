# 데스크톱형 포트폴리오 MVP 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 잠금화면형 랜딩에서 데스크톱 포트폴리오로 진입하고, 대표 프로젝트 3개와 이력서 요약을 탐색할 수 있는 FE 중심 MVP를 구현한다.

**Architecture:** Next.js App Router 기반 정적 사이트로 구성한다. 잠금화면, 데스크톱 셸, 창 관리, 콘텐츠 창을 분리하고, 열린 창과 테마 상태는 Zustand에서 관리한다.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Motion for React, Zustand, MDX 또는 Markdown, Vercel

---

## 1. 구현 단위

| Task | 결과물 |
| --- | --- |
| Task 1 | Next.js 프로젝트 초기 세팅 |
| Task 2 | 디자인 토큰과 전역 스타일 |
| Task 3 | 정적 콘텐츠 데이터 |
| Task 4 | 잠금화면 랜딩 |
| Task 5 | 데스크톱 셸 |
| Task 6 | 창 관리 store와 WindowManager |
| Task 7 | 핵심 폴더 창 |
| Task 8 | 프로젝트 목록과 상세 |
| Task 9 | 이력서 요약과 PDF 다운로드 |
| Task 10 | 모바일 레이아웃 |
| Task 11 | SEO와 OG |
| Task 12 | 접근성, 성능, 정합성 검증 |

## 2. Task 1: Next.js 프로젝트 초기 세팅

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

**Steps:**

- [ ] Next.js, React, TypeScript 프로젝트를 생성한다.
- [ ] Tailwind CSS, Motion for React, Zustand, lucide-react를 설치한다.
- [ ] `src` 기반 구조를 사용한다.
- [ ] `npm run dev`, `npm run build`, `npm run lint` 스크립트를 구성한다.
- [ ] 초기 페이지는 `LockScreen` 자리만 렌더링한다.

**Verification:**

- `npm run dev` 실행 시 로컬 페이지가 열린다.
- `npm run build`가 성공한다.

## 3. Task 2: 디자인 토큰과 전역 스타일

**Files:**

- Create: `src/app/globals.css`
- Create: `src/lib/cn.ts`

**Steps:**

- [ ] `04_design_system.md`의 컬러 토큰을 CSS 변수로 정의한다.
- [ ] light/dark theme용 `data-theme` 또는 class 전략을 정한다.
- [ ] 기본 폰트, 배경, focus ring, selection 스타일을 정의한다.
- [ ] glass surface, window shadow, Dock shadow utility를 만든다.

**Verification:**

- light/dark theme에서 텍스트 대비가 유지된다.
- focus ring이 버튼과 링크에 표시된다.

## 4. Task 3: 정적 콘텐츠 데이터

**Files:**

- Create: `src/data/folders.ts`
- Create: `src/data/navigation.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/skills.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/links.ts`
- Create: `src/content/resume-summary.ts`
- Create: `src/content/projects/project-01.mdx`
- Create: `src/content/projects/project-02.mdx`
- Create: `src/content/projects/project-03.mdx`

**Steps:**

- [ ] `03_information_architecture.md`의 데이터 모델을 TypeScript 타입으로 옮긴다.
- [ ] 대표 프로젝트 3개 데이터를 등록한다.
- [ ] Resume 웹 요약 데이터를 등록한다.
- [ ] 외부 링크는 `links.ts`에서 한 번만 관리한다.
- [ ] MVP 내부 navigation에는 About Me, Projects, Skills, Resume, Contact만 등록한다.

**Verification:**

- 프로젝트 배열 길이가 3인지 확인한다.
- 각 프로젝트가 `problem`, `role`, `stack`, `troubleshooting`, `result` 필드를 가진다.
- Resume PDF 경로가 `public/resume/resume.pdf`를 가리킨다.
- `navigation.ts`에 Notes 또는 Blog 내부 폴더가 없는지 확인한다.

## 5. Task 4: 잠금화면 랜딩

**Files:**

- Create: `src/components/lock-screen/LockScreen.tsx`

**Steps:**

- [ ] 시간과 날짜를 표시한다.
- [ ] 한국어 자기소개 문장을 표시한다.
- [ ] `포트폴리오 입장` 버튼을 제공한다.
- [ ] GitHub, Resume, Email quick links를 표시한다.
- [ ] Enter 키로도 입장할 수 있게 한다.
- [ ] Motion으로 unlock 전환을 적용한다.

**Verification:**

- 버튼 클릭 시 Desktop으로 전환된다.
- Enter 키로도 전환된다.
- reduced motion 설정에서 과한 scale 애니메이션이 실행되지 않는다.

## 6. Task 5: 데스크톱 셸

**Files:**

- Create: `src/components/desktop/DesktopShell.tsx`
- Create: `src/components/desktop/MenuBar.tsx`
- Create: `src/components/desktop/DesktopIconGrid.tsx`
- Create: `src/components/desktop/DesktopIcon.tsx`
- Create: `src/components/desktop/Dock.tsx`

**Steps:**

- [ ] wallpaper 배경을 구성한다.
- [ ] 상단 Menu Bar를 배치한다.
- [ ] 바탕화면 폴더 아이콘을 배치한다.
- [ ] 하단 Dock을 배치한다.
- [ ] Dock과 DesktopIcon이 같은 `openWindow` 동작을 사용하게 한다.

**Verification:**

- About, Projects, Skills, Resume, Contact 아이콘이 표시된다.
- Dock에서 내부 항목과 외부 링크가 구분된다.
- 모바일 폭에서는 DesktopShell 대신 MobileHome 진입을 준비한다.

## 7. Task 6: 창 관리 store와 WindowManager

**Files:**

- Create: `src/stores/desktopStore.ts`
- Create: `src/components/desktop/WindowManager.tsx`
- Create: `src/components/desktop/AppWindow.tsx`

**Steps:**

- [ ] `hasUnlocked`, `activeWindowId`, `windows` 상태를 정의한다.
- [ ] `unlock`, `openWindow`, `closeWindow`, `focusWindow`, `moveWindow` 액션을 구현한다.
- [ ] 중복 창 생성을 방지한다.
- [ ] 새로 열린 창은 가장 높은 z-index를 갖게 한다.
- [ ] AppWindow에 titlebar, close button, drag 영역을 구현한다.

**Verification:**

- 같은 폴더를 여러 번 열어도 창이 하나만 유지된다.
- 창을 클릭하면 최상위로 올라온다.
- 닫기 버튼을 누르면 창이 닫힌다.

## 8. Task 7: 핵심 폴더 창

**Files:**

- Create: `src/components/folders/AboutWindow.tsx`
- Create: `src/components/folders/ProjectsWindow.tsx`
- Create: `src/components/folders/SkillsWindow.tsx`
- Create: `src/components/folders/ResumeWindow.tsx`
- Create: `src/components/folders/ContactWindow.tsx`

**Steps:**

- [ ] AboutWindow에 profile 데이터를 렌더링한다.
- [ ] ProjectsWindow에 프로젝트 3개 목록을 렌더링한다.
- [ ] SkillsWindow에 기술 카테고리와 사용 맥락을 렌더링한다.
- [ ] ResumeWindow에 웹 요약본과 PDF 다운로드 버튼을 렌더링한다.
- [ ] ContactWindow에 외부 링크와 이메일을 렌더링한다.

**Verification:**

- 각 폴더 창이 요구된 콘텐츠를 포함한다.
- Resume PDF 버튼이 정확한 정적 경로를 사용한다.
- 외부 링크는 새 탭으로 열린다.

## 9. Task 8: 프로젝트 목록과 상세

**Files:**

- Create: `src/components/projects/ProjectCard.tsx`
- Create: `src/components/projects/ProjectDetail.tsx`
- Create: `src/components/projects/ProjectMetaPanel.tsx`
- Create: `src/app/projects/[slug]/page.tsx`

**Steps:**

- [ ] ProjectCard는 제목, 요약, 역할, 기술 태그, 썸네일을 표시한다.
- [ ] ProjectDetail은 문제 정의, 내 역할, 기술 스택, 구현 내용, 트러블슈팅, 성과, 링크, 미디어를 표시한다.
- [ ] 프로젝트 카드를 클릭하면 프로젝트 상세 창 또는 상세 route로 이동한다.
- [ ] `/projects/[slug]` 직접 접근 페이지를 제공한다.

**Verification:**

- 프로젝트 3개 모두 상세 접근이 가능하다.
- 각 프로젝트 상세가 같은 섹션 순서를 따른다.
- slug가 없는 경우 not found 처리를 한다.

## 10. Task 9: 이력서 요약과 PDF 다운로드

**Files:**

- Create: `src/app/resume/page.tsx`
- Add: `public/resume/resume.pdf`

**Steps:**

- [ ] ResumeWindow와 `/resume` 페이지가 같은 resume summary 데이터를 사용한다.
- [ ] PDF 다운로드 버튼을 제공한다.
- [ ] PDF 파일이 없을 때 버튼 비활성화 상태를 제공한다.

**Verification:**

- ResumeWindow와 `/resume`의 내용이 일치한다.
- PDF 링크가 404를 내지 않는다.

## 11. Task 10: 모바일 레이아웃

**Files:**

- Create: `src/components/mobile/MobileHome.tsx`
- Create: `src/components/mobile/MobileSection.tsx`

**Steps:**

- [ ] 768px 미만에서는 폴더 카드 리스트를 표시한다.
- [ ] 모바일 상세는 전체 화면 문서형 레이아웃으로 표시한다.
- [ ] Dock hover에 의존하는 정보를 제거한다.

**Verification:**

- 360px 폭에서 텍스트와 버튼이 겹치지 않는다.
- 모든 핵심 폴더에 모바일에서 접근 가능하다.

## 12. Task 11: SEO와 OG

**Files:**

- Modify: `src/app/layout.tsx`
- Create: `src/lib/seo.ts`
- Add: `public/og/portfolio-og.png`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Steps:**

- [ ] 기본 metadata를 정의한다.
- [ ] 프로젝트 상세별 title과 description을 정의한다.
- [ ] OG 이미지를 제공한다.
- [ ] sitemap과 robots를 제공한다.

**Verification:**

- 홈, 프로젝트 상세, 이력서 페이지에 title과 description이 있다.
- OG 이미지 경로가 유효하다.

## 13. Task 12: 접근성, 성능, 정합성 검증

**Files:**

- Modify: 구현된 관련 파일 전체

**Steps:**

- [ ] 키보드만으로 LockScreen, DesktopIcon, Dock, Window close를 조작한다.
- [ ] reduced motion 설정에서 전환이 단순화되는지 확인한다.
- [ ] 프로젝트 데이터가 정확히 3개인지 확인한다.
- [ ] 블로그와 노트가 MVP 핵심 메뉴에 노출되지 않는지 확인한다.
- [ ] 이미지 크기와 lazy loading을 점검한다.
- [ ] Lighthouse 기준으로 접근성, SEO, 성능을 점검한다.

**Verification:**

- `npm run build` 성공
- `npm run lint` 성공
- 모바일 수동 확인 완료
- 요구사항 `REQ-001`부터 `REQ-020`까지 구현 매핑 완료

## 14. 구현 중 지켜야 할 범위

- BE 기능을 추가하지 않는다.
- 서버 저장형 연락처 폼을 구현하지 않는다.
- 블로그와 노트는 MVP에서 제외한다.
- Apple 로고, Finder 아이콘, 실제 macOS 신호등 버튼을 그대로 복제하지 않는다.
- 한국어 콘텐츠를 기본으로 유지한다.

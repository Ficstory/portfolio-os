# Brittany Chiang 포트폴리오 사이트 분석 리포트

- 조사 대상: https://brittanychiang.com/#projects
- 조사일: 2026-06-04
- 조사 방식: HTML 텍스트 추출, Chrome 렌더링 캡처, computed style 수집, desktop/mobile viewport 비교, hover/modal 인터랙션 관찰
- 로컬 캡처/JSON: `analysis-assets/brittany-chiang/`

## 1. 한 줄 요약

Brittany Chiang의 포트폴리오는 "접근성, 픽셀 퍼펙트 UI, 디자인 시스템 역량을 가진 프론트엔드 엔지니어"라는 메시지를 단일 페이지 내러티브와 별도 프로젝트 아카이브로 증명하는 사이트다. 장식은 적고, 어두운 slate 배경 위에 Inter 기반 타이포그래피, teal 포인트 컬러, 촘촘한 리스트형 카드, 미세한 hover 모션을 사용한다.

## 2. 정보 구조

### 전체 페이지 구조

| 구분 | URL/앵커 | 역할 | 핵심 메시지 |
| --- | --- | --- | --- |
| 홈/메인 | `/` | 자기소개, 경력, 대표 프로젝트, 글 목록을 한 흐름으로 보여주는 핵심 페이지 | 접근성 높은 웹 경험을 만드는 프론트엔드 엔지니어 |
| About | `/#about` | 정체성과 현재 역할 설명 | 접근성, 디테일, 디자인과 엔지니어링의 접점 |
| Experience | `/#experience` | 경력 타임라인 | 디자인 시스템, 제품 품질, 접근성 실무 경험 |
| Projects | `/#projects` | 대표 작업 4개 | 실전 결과물, 기술 스택, 외부 검증 |
| Writing | `/#writing` | 글/아티클 | 기술적 사고와 커뮤니티/지식 공유 |
| Archive | `/archive` | 전체 프로젝트 테이블 | 연도별 작업 이력의 폭과 지속성 |
| Resume PDF | `/resume.pdf` | 이력서 다운로드/열람 | 사이트보다 압축된 공식 이력 |

### 핵심 IA 판단

Evidence:
- 홈은 단일 페이지이고, 좌측 내비게이션은 `About`, `Experience`, `Projects` 세 앵커로 이동한다.
- `/archive`는 `All Projects`라는 별도 페이지이며 5개 컬럼(`Year`, `Project`, `Made at`, `Built with`, `Link`)으로 구성된 프로젝트 테이블이다.
- 렌더링 기준 `/archive` 테이블은 46개 프로젝트 행을 가진다.

Inference:
- 메인 페이지는 "선별된 신뢰 증거"를 보여주고, 아카이브는 "긴 작업 이력 전체"를 보여주는 보조 증거 페이지로 설계됐다.
- 방문자가 먼저 정체성, 경력, 대표 프로젝트를 훑고, 더 깊이 보고 싶을 때 아카이브/이력서로 이동하는 구조다.

## 3. 페이지별 메시지와 보여주는 방식

### 3.1 홈 사이드바/히어로

홈 첫 화면의 좌측은 고정된 프로필 영역이다.

- 이름: Brittany Chiang
- 역할: Frontend Engineer
- 짧은 태그라인: 접근성 있고 픽셀 단위로 정돈된 웹 경험을 만든다는 메시지
- 내비게이션: About / Experience / Projects
- 소셜 링크: GitHub, LinkedIn, CodePen, Instagram, Goodreads

보여주는 방식:
- desktop에서는 좌측 48% 영역이 sticky로 고정되고, 오른쪽 52% 콘텐츠만 스크롤된다.
- 이름은 48px/700의 가장 큰 텍스트로 첫 시선 고정 역할을 한다.
- 내비게이션은 긴 선+대문자 라벨 구조다. 활성 섹션은 선 길이가 32px에서 64px로 커지고 라벨 색이 밝아진다.
- 모바일에서는 좌측 고정 구조가 사라지고, 이름/역할/태그라인/소셜 링크가 상단에 쌓인다. 섹션 내비게이션은 숨겨진다.

메시지 해석:
- "나는 어떤 사람인가"보다 "어떤 품질의 웹을 만드는가"를 먼저 말한다.
- 소셜 링크는 설명 없이 아이콘만 사용해, 텍스트 밀도를 낮추고 전문 포트폴리오 톤을 유지한다.

### 3.2 About

About 섹션의 메시지는 세 겹으로 구성된다.

1. 프론트엔드 엔지니어로서 접근성, 픽셀 퍼펙트 UI, 디테일 중심의 사용자 경험을 만든다.
2. 현재 Klaviyo의 컴포넌트 라이브러리/디자인 시스템 팀에서 컴포넌트, 툴링, 패턴, 접근성 기반을 다룬다.
3. Apple, Starry, Upstatement 등 이전 경험과 온라인 강의 제작 이력을 통해 폭넓은 환경을 경험했다.

보여주는 방식:
- 긴 자기소개를 카드로 감싸지 않고, 오른쪽 본문 영역에 문단형 텍스트로 배치한다.
- 핵심 회사명과 강의 링크만 밝은 색 링크로 강조한다.
- 마지막에는 취미와 게임 관련 짧은 이스터에그를 넣어, 전문성 중심 톤 안에 인간적인 캐릭터를 추가한다.

Inference:
- About은 "개인 소개"라기보다 "엔지니어링 철학 + 현재 전문성 + 신뢰 가능한 경력"을 조합한 포지셔닝 문장이다.

### 3.3 Experience

Experience는 연도/기간, 직무, 회사, 설명, 기술 태그로 구성된 타임라인이다.

주요 항목:
- 2024 - Present: Klaviyo, Senior Frontend Engineer, Accessibility
- 2018 - 2024: Upstatement, Lead Engineer / Senior Engineer / Engineer
- 2017: Apple, UI Engineer Co-op
- 2016 - 2017: Scout Studio
- 2016: Starry
- 2015: MullenLowe U.S.

보여주는 방식:
- desktop에서는 8컬럼 grid를 사용한다. 왼쪽 2컬럼은 기간, 오른쪽 6컬럼은 내용이다.
- 기술 스택은 rounded pill 형태로 표시한다.
- 각 경력 항목 전체가 hover 가능한 영역처럼 동작한다. hover 시 배경 레이어가 생기고, 제목 링크가 teal로 바뀌며, 외부 링크 아이콘이 우상단 방향으로 살짝 이동한다.
- 같은 리스트의 비활성 sibling은 opacity 50%로 낮아지고 hover된 항목은 100%로 유지된다.

메시지 해석:
- 시간순 경력 나열이지만, 각 설명은 "무엇을 만들었는가"보다 "어떤 품질과 책임을 맡았는가"에 초점이 있다.
- 접근성, 디자인 시스템, cross-functional 협업, 제품 전반에 쓰이는 컴포넌트 같은 표현이 반복되어 전문 분야를 선명하게 만든다.

### 3.4 Projects

사용자가 준 URL의 핵심 앵커다. 대표 프로젝트 4개가 표시된다.

| 프로젝트 | 보여주는 메시지 | 시각 구성 |
| --- | --- | --- |
| Build a Spotify Connected App | API 기반 앱 제작을 가르치는 강의 제작 경험 | 강의 마케팅 카드 썸네일 + 설명 |
| Spotify Profile | Spotify 개인 데이터 시각화 웹앱 | 앱 화면 썸네일 + 설명 + React/Express/API/Heroku 태그 |
| Halcyon Theme | 개발자 도구용 dark blue 테마 | 에디터 화면 썸네일 + 설치 수 지표 |
| brittanychiang.com v4 | 이전 포트폴리오 자체가 오픈소스 레퍼런스였다는 증거 | v4 히어로 썸네일 + Gatsby/Styled Components/Netlify 태그 |

보여주는 방식:
- 각 프로젝트는 이미지 2컬럼, 텍스트 6컬럼 구조다.
- 이미지 크기는 desktop 관측 기준 약 140x79px, 16:9 비율이다.
- 제목은 외부 링크로 연결되며, hover 시 teal 색상으로 바뀐다.
- 일부 프로젝트에는 GitHub stars나 installs 같은 외부 검증 수치가 붙는다.
- 마지막 CTA는 `View Full Project Archive`로, 대표 프로젝트에서 전체 작업 목록으로 확장된다.

Inference:
- 대표 프로젝트 선정은 "제품/앱", "교육", "개발 도구", "포트폴리오 자체"를 섞어 역량 범위를 보여준다.
- 큰 프로젝트 케이스스터디보다, 짧은 고밀도 리스트로 "많이 만들고 오래 유지한 사람"이라는 신뢰를 만든다.

### 3.5 Writing

Writing은 글 4개를 연도와 썸네일로 보여준다.

주제:
- AI 관련 글
- 접근성 pitfalls 글
- WordPress Multisite와 Algolia 검색 통합
- headless mobile app CMS 구축

보여주는 방식:
- 프로젝트 카드보다 더 압축된 리스트다.
- 썸네일, 연도, 제목만으로 구성되어 본문 설명은 거의 없다.
- 주제가 접근성, 검색, CMS, AI로 분산되어 있어 실무 사고의 폭을 보여준다.

### 3.6 Footer

Footer는 제작 도구와 기술 스택을 작게 공개한다.

확인된 메시지:
- Figma에서 느슨하게 설계
- VS Code로 코딩
- Next.js와 Tailwind CSS로 제작
- Vercel 배포
- Inter typeface 사용

보여주는 방식:
- 본문보다 작은 14px 텍스트와 muted 색상으로 배치한다.
- 자기 홍보가 아니라 제작 크레딧처럼 처리해 전체 톤을 해치지 않는다.

### 3.7 Archive

`/archive`는 전체 프로젝트 목록 페이지다.

Evidence:
- 페이지 제목은 `All Projects`.
- desktop 기준 컬럼은 `Year`, `Project`, `Made at`, `Built with`, `Link`.
- 렌더링된 테이블 행은 46개다.
- 첫 행은 2023년 Emerson Collective, 마지막 구간은 2015년 작업까지 내려간다.

보여주는 방식:
- desktop은 넓은 테이블이다. 프로젝트명, 제작처, 기술 스택, 외부 링크를 한 줄씩 비교할 수 있다.
- mobile에서는 `Year`와 `Project` 중심으로 축약되어 보이며, 외부 링크 가능 프로젝트는 제목 옆 화살표로 표시된다.
- 메인 페이지와 동일한 dark slate 배경, teal 링크, Inter 폰트를 유지한다.

Inference:
- Archive는 상세 설명보다 누적량, 연속성, 기술 폭을 보여주는 페이지다.
- 메인 프로젝트 섹션이 선별된 "대표작"이라면 Archive는 "검증 가능한 작업 이력 DB"에 가깝다.

## 4. 디자인 시스템 분석

### 4.1 컬러

| 용도 | 관측값 | 설명 |
| --- | --- | --- |
| 페이지 배경 | `#0f172a` / `rgb(15, 23, 42)` | Tailwind `slate-900`, 전체 dark canvas |
| 주요 텍스트 | `#e2e8f0` / `rgb(226, 232, 240)` | 이름, 제목, 활성 내비게이션 |
| 본문 텍스트 | `#94a3b8` / `rgb(148, 163, 184)` | 긴 설명, 일반 텍스트 |
| 보조 텍스트 | `#64748b` / `rgb(100, 116, 139)` | 비활성 nav, 날짜, footer |
| 링크 hover/accent | `#5eead4` / `rgb(94, 234, 212)` | teal accent |
| 기술 태그 배경 | `rgba(45, 212, 191, 0.1)` | 낮은 채도의 teal pill |
| 카드 hover 배경 | `rgba(30, 41, 59, 0.5)` | slate-800 반투명 |
| spotlight | `rgba(29, 78, 216, 0.15)` | 마우스 주변 blue glow |
| skip link | `#eab308` / `rgb(234, 179, 8)` | 접근성용 focus link |

색상 성격:
- 전체적으로 dark slate + teal accent의 개발자 포트폴리오 문법이다.
- 강조 색은 많이 쓰지 않는다. 링크 hover, 기술 태그, back link, 일부 인터랙션에만 제한적으로 사용한다.
- 배경이 어둡지만 본문 대비가 충분하고, 흰색 대신 slate-200을 사용해 눈부심을 줄인다.

### 4.2 폰트와 타이포그래피

Evidence:
- CSS는 Next/font 방식의 `@font-face`로 Inter를 로드한다.
- 실제 콘텐츠 컨테이너는 `font-sans`와 `--font-inter` 변수를 통해 Inter 계열을 사용한다.
- CSS에는 font feature settings `"ss03", "cv02", "cv11"`이 선언되어 있다.

관측된 주요 크기:

| 요소 | Desktop | Mobile | Weight/Line-height |
| --- | --- | --- | --- |
| H1 이름 | 48px | 36px | 700 / 1.0~1.1 |
| 역할 H2 | 20px | 18px | 500 / 28px |
| 본문 | 16px | 16px | 400 / 24~26px |
| 섹션 라벨 | 14px | 14px | 700 / uppercase / tracking-widest |
| 카드 제목 | 16px | 16px | 500 / 20~22px |
| 설명/메타 | 14px | 14px | 400~600 / 20px |
| 기술 태그 | 12px | 12px | 500 / 20px |
| Archive H1 | 48px | 36px | 700 |

디자인 해석:
- 타이포 스케일이 크지 않다. H1만 강하고 나머지는 리스트 가독성을 위해 16px 전후로 유지한다.
- uppercase + wide tracking은 섹션 라벨과 nav에만 사용해 구조 신호를 만든다.
- 제목의 `tracking-tight`은 Inter의 큰 글자에서 단단한 인상을 준다.

### 4.3 레이아웃

Desktop:
- 전체 컨테이너는 max-width 1280px, 수평 중앙 정렬이다.
- 큰 화면에서 `header` 48%, `main` 52%의 2열 구조다.
- `header`는 sticky, top 0, max-height 100vh이며 내부를 위/아래로 분산 배치한다.
- 1440x900 캡처 기준 main 콘텐츠 폭은 약 607px다.
- 섹션 간 하단 여백은 desktop에서 크게 잡혀 있다. About, Experience, Projects가 각각 넓은 호흡으로 이어진다.

Mobile:
- 390px viewport에서는 단일 컬럼이다.
- 상단에 이름/역할/태그라인/소셜 아이콘이 먼저 나오고, 이후 About부터 세로 흐름으로 배치된다.
- 각 섹션 제목은 sticky header로 바뀐다. 배경은 `rgba(15, 23, 42, 0.75)`이고 backdrop blur가 들어가 스크롤 중 구분이 된다.
- desktop nav는 숨겨지고, anchor 이동보다 자연 스크롤 중심 경험이 된다.

Archive:
- desktop은 5컬럼 테이블로 비교/스캔에 최적화되어 있다.
- mobile은 정보량을 줄여 Year/Project 중심으로 표시한다. 긴 기술 스택은 작은 화면 첫 화면에서는 보이지 않도록 우선순위가 낮아진다.

### 4.4 이미지와 아이콘

- 프로젝트와 글에는 Next image 최적화 경로(`/_next/image`)가 사용된다.
- 프로젝트 썸네일은 16:9 비율, object-cover, 2px border, 둥근 모서리다.
- hover 시 이미지 border가 `rgba(226,232,240,0.1)`에서 `rgba(226,232,240,0.3)`으로 밝아진다.
- 외부 링크는 텍스트 옆 arrow-up-right SVG로 표시한다.
- 소셜 링크는 텍스트 라벨을 시각적으로 숨기고 SVG 아이콘만 보여준다. 접근성 라벨은 aria-label/title로 보완되어 있다.

## 5. 애니메이션과 인터랙션

### 5.1 기본 transition

전역적으로 anchor/button에 150ms transition이 적용된다.

- 대상: color, background-color, border-color, opacity, box-shadow, transform, filter, backdrop-filter 등
- easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- reduced motion 환경에서는 일부 transition을 제거하는 `motion-reduce:transition-none` 패턴이 있다.

### 5.2 Spotlight gradient

화면 위에 pointer-events-none 레이어가 깔리고, radial gradient가 마우스 위치 주변을 은은하게 밝히는 방식이다.

관측값:
- `600px circle`
- color: `rgba(29, 78, 216, 0.15)`
- 끝 지점: `transparent 80%`
- transition duration: 300ms

효과:
- 배경 자체는 거의 단색이지만, 마우스 움직임에 따라 subtle한 depth가 생긴다.
- 장식 이미지를 쓰지 않고도 페이지가 정적으로 죽어 보이지 않게 만든다.

### 5.3 내비게이션 active/hover

Projects 앵커 로드 시:
- `Projects` 항목이 active class를 가진다.
- indicator width는 32px에서 64px로 커진다.
- nav text color는 muted slate에서 `#e2e8f0`로 밝아진다.

hover 시:
- 비활성 항목도 같은 방식으로 선이 길어지고 텍스트가 밝아진다.

### 5.4 경력/프로젝트/글 카드 hover

대표 카드 hover 관측값:
- overlay background: `rgba(30, 41, 59, 0.5)`
- inset top shadow: `rgba(148, 163, 184, 0.1) 0px 1px 0px 0px inset`
- drop-shadow: 약한 10px/4px 그림자 조합
- title link: `#e2e8f0`에서 `#5eead4`로 변경
- external arrow: `translateX(4px), translateY(-4px)`
- image border: opacity 0.1에서 0.3으로 증가
- sibling list item: hover된 항목 외 opacity 50%

효과:
- 카드 전체를 큰 박스로 만들지 않고, hover 때만 배경 레이어가 나타난다.
- 리스트형 UI의 밀도는 유지하면서도 현재 보는 항목에 초점이 생긴다.

### 5.5 텍스트 이스터에그

About 마지막 문장 일부에는 글자 단위 hover 효과가 있다.

관측값:
- 각 글자가 75ms duration으로 이동/색상 변경
- delay는 50ms부터 300ms까지 staggered
- desktop에서는 커서 이미지도 바뀐다.

효과:
- 사이트 전체가 차갑고 전문적인 톤이지만, 작은 개인적 장난으로 캐릭터를 남긴다.

### 5.6 Time travel 모달

화면 오른쪽 하단의 Tardis GIF 버튼을 누르면 이전 사이트 버전으로 이동하는 모달이 열린다.

관측 내용:
- 버튼 aria label은 `Click to time travel`.
- 모달 텍스트는 다른 버전 사이트를 보러 과거로 돌아가라는 메시지다.
- v1, v2, v3, v4 링크 카드가 포털 안에 배치된다.
- overlay는 `DialogOverlay portal`이며 전체 화면을 덮는다.
- open animation은 `fadeIn 0.7s cubic-bezier(0, 0, 0.2, 1)`.
- close animation은 CSS상 `fadeOut 0.5s cubic-bezier(0.4, 0, 1, 1)`.
- 포털 내부에는 `wobble` keyframe이 있고, 회전/hue-rotate/filter/box-shadow로 움직이는 원형 효과를 만든다.

해석:
- 메인 포트폴리오의 미니멀한 톤과 달리, 숨은 모달은 의도적으로 장난스럽고 시각적이다.
- 오래된 포트폴리오 버전까지 보여주는 것은 작업 이력의 연속성을 강조한다.

## 6. 접근성 관찰

Evidence:
- `Skip to Content` 링크가 있고, focus 시 화면 안으로 들어오는 구조다.
- 소셜 아이콘과 외부 링크에는 aria-label이 들어가 있다.
- 섹션에는 `aria-label`이 있다.
- 이미지에는 alt 텍스트가 있다.
- `prefers-reduced-motion` 대응 클래스가 일부 적용되어 있다.

Inference:
- 본인이 접근성과 디자인 시스템을 강조하는 메시지와 실제 구현이 어느 정도 일치한다.
- 단, 본 리포트는 자동/수동 관찰 중심이며 WCAG 전체 검사는 수행하지 않았다.

## 7. 벤치마킹 포인트

이 사이트에서 참고할 만한 점:

1. 첫 화면에서 정체성을 과장하지 않고 "무엇을 잘 만드는가"를 명확히 말한다.
2. 대표 프로젝트는 적게 보여주고, 전체 이력은 Archive로 분리한다.
3. 카드가 아니라 리스트를 사용해 포트폴리오를 실무자 이력서처럼 빠르게 스캔하게 만든다.
4. hover 애니메이션은 작지만 일관된다. 색상, 선 길이, 외부 링크 화살표, 카드 배경이 같은 규칙으로 움직인다.
5. 모바일에서는 desktop nav를 억지로 유지하지 않고, sticky section heading으로 문맥을 보존한다.
6. Footer에서 제작 도구와 기술 스택을 투명하게 밝히며, 포트폴리오 자체도 하나의 작업물로 만든다.
7. 숨은 time travel 모달로 이전 버전 포트폴리오를 연결해 장기적인 성장 서사를 만든다.

주의할 점:

1. dark slate + teal 조합은 개발자 포트폴리오에서 흔하기 때문에 그대로 복제하면 개성이 약해질 수 있다.
2. 본문 밀도가 높아 비전공자/채용 담당자에게는 첫 인상이 차갑게 느껴질 수 있다.
3. 큰 프로젝트 설명이나 과정 중심 case study가 필요한 직무에는 이 구조만으로는 부족할 수 있다.
4. nav가 desktop에만 보이므로 모바일에서는 CTA나 섹션 이동성이 상대적으로 약하다.

## 8. 조사 산출물

대표 캡처:
- `analysis-assets/brittany-chiang/home-desktop-1440x900-viewport.png`
- `analysis-assets/brittany-chiang/projects-anchor-desktop-1440x900-viewport.png`
- `analysis-assets/brittany-chiang/archive-desktop-1440x900-viewport.png`
- `analysis-assets/brittany-chiang/home-mobile-390x844-viewport.png`
- `analysis-assets/brittany-chiang/archive-mobile-390x844-viewport.png`
- `analysis-assets/brittany-chiang/home-desktop-time-travel-modal.png`

계산 스타일/DOM 데이터:
- `analysis-assets/brittany-chiang/combined-summary.json`
- `analysis-assets/brittany-chiang/home-desktop-1440x900.json`
- `analysis-assets/brittany-chiang/projects-anchor-desktop-1440x900.json`
- `analysis-assets/brittany-chiang/archive-desktop-1440x900.json`
- `analysis-assets/brittany-chiang/time-travel-modal.json`

## 9. 근거 출처

- Homepage: https://brittanychiang.com/
- Projects anchor: https://brittanychiang.com/#projects
- Project archive: https://brittanychiang.com/archive
- Resume PDF: https://brittanychiang.com/resume.pdf
- Rendered CSS: https://brittanychiang.com/_next/static/css/1205f04d95fac248.css

## 10. 결론

이 포트폴리오의 핵심은 "화려한 랜딩 페이지"가 아니라 "고밀도 실무 신뢰"다. 첫 화면의 고정 프로필은 정체성을 계속 붙잡고, 오른쪽 리스트는 경력과 결과물을 빠르게 누적한다. 색상, 폰트, 모션은 모두 같은 목적을 따른다. 방문자가 오래 읽지 않아도 접근성, 디자인 시스템, 프론트엔드 품질, 장기적인 제작 이력이라는 네 가지 메시지를 즉시 파악하게 만든다.

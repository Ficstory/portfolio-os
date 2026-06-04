# leeboa.com 포트폴리오 사이트 분석 리포트

- 대상: [https://www.leeboa.com/](https://www.leeboa.com/)
- 조사일: 2026-06-04
- 조사 방식: Chrome 렌더링 기준으로 데스크톱 1440x1100, 모바일 390x844 뷰포트를 캡처하고, DOM 텍스트, 링크, 이미지, 계산 스타일, CSS 키프레임, 프로젝트 탭/상세 라우트를 수집했다.
- 캡처/크롤링 산출물: `analysis-assets/`

## 1. 전체 구조

사이트는 React 기반 SPA로 보이며, 주요 진입 라우트는 `Home`, `Project`, `About` 3개다. `Project` 하위에는 개인/팀/업무 프로젝트 상세 페이지가 별도 라우트로 연결된다.

| 구분 | 라우트 | 역할 |
| --- | --- | --- |
| Home | `/` | 포트폴리오 첫인상, 핵심 가치 키워드, Project/About 안내 |
| Project | `/project` | 개인/팀/업무 프로젝트 목록, 기술 필터, 상세 진입 |
| About | `/about` | 자기소개, 사진 콜라주, 기술 스택, 연락 CTA |
| Project detail | `/project/personal/*`, `/project/team/*`, `/project/work/*` | 각 프로젝트의 기능, 기술, 기여도, 링크, 기록 정리 |

공통 UI는 상단 햄버거 메뉴, 꽃 모양 홈 로고, `See on GitHub` 버튼, 하단 연락처/깃허브/푸터 네비게이션으로 구성된다. 푸터는 모든 페이지에서 반복되며 이메일, GitHub, Home/Project/About 이동 링크, `©2024 LeeBoa. All Rights Reserved.`를 보여준다.

## 2. 공통 네비게이션과 메뉴

상단 헤더는 좌측 햄버거, 좌측 꽃 로고, 우측 분홍색 GitHub CTA로 단순하게 구성되어 있다. 헤더 자체는 얇고 가볍지만, 메뉴를 열면 강한 시각적 전환이 생긴다.

데스크톱 메뉴 오버레이는 화면 전체를 민트색으로 덮고, 왼쪽에 `HOME`, `PROJECT`, `ABOUT`을 매우 큰 영문 타이포로 세로 배치한다. 오른쪽에는 흑백 이미지가 들어간 `ABOUT ME` 카드와 연락처/블로그 패널이 함께 나온다. 모바일 메뉴는 보조 패널을 제거하고, 세 개 메뉴만 중앙에 크게 배치한다.

관찰한 상호작용:

- 햄버거는 열릴 때 X 아이콘으로 전환된다.
- 데스크톱 메뉴 링크는 hover 시 원형 stroke가 그려지는 `drawCircle` 계열 효과를 사용한다.
- 꽃 로고는 hover 시 회전 애니메이션이 적용된다.
- 푸터 링크 텍스트는 hover 시 위로 말려 올라가는 rolling text 효과가 있다.

관련 캡처:

| 화면 | 파일 |
| --- | --- |
| 데스크톱 메뉴 | `analysis-assets/menu-desktop.png` |
| 모바일 메뉴 | `analysis-assets/menu-mobile.png` |

## 3. Home 페이지

### 핵심 메시지

Home의 첫 화면은 포트폴리오의 기술적 방향을 직접적인 문장보다 큰 키워드로 전달한다. 화면에 가장 크게 보이는 메시지는 `INTUITIVE UI`, `USER ENGAGEMENT`, `PERFORMANCE`, `IMPROVEMENT`다. 즉, 직관적인 UI, 사용자 참여, 성능 개선을 중시하는 프론트엔드 개발자라는 인상을 먼저 만든다.

그 아래에는 검은색 레트로 터미널 형태의 큰 박스가 있고, 안쪽에는 `HELLO WORLD`, `BOA PORTFOLIO` 성격의 문구가 녹색 픽셀/레트로 스타일로 표시된다. 첫 화면의 분위기는 일반적인 이력서형 포트폴리오보다 그래픽/모션 중심이다.

`OVERVIEW` 섹션은 Project와 About으로 이어지는 안내 역할을 한다. 메시지의 요지는 다음과 같다.

- Project 페이지에서는 개인, 팀, 실무 프로젝트 결과와 문제 해결 과정, 공부 기록, 구현 기능을 확인할 수 있다.
- About 페이지에서는 경험, 가치관, 앞으로의 프론트엔드 개발 방향을 소개한다.
- 하단에는 `Project`, `About` 두 개의 큰 이동 카드가 배치된다.

### 보여주는 방식

데스크톱에서는 초대형 영문 타이포를 좌/중/우로 어긋나게 배치해 리듬을 만든다. 노트북 이미지, 분홍색 아령 이미지, 민트색 점이 키워드 사이에 들어가서 장난스럽지만 과하게 복잡하지 않은 포인트를 만든다.

모바일에서는 같은 키워드가 화면 폭에 맞춰 훨씬 작게 재배치된다. 노트북과 아령 이미지는 유지되며, `OVERVIEW` 아래에는 캐릭터/스프라이트 이미지와 설명문이 세로로 나온다.

### 애니메이션

Home에서 관찰된 주요 모션은 다음과 같다.

- 히어로 텍스트는 GSAP/ScrollTrigger 성격의 등장 모션을 사용한다.
- 노트북 이미지는 좌우로 살짝 흔들리는 회전 애니메이션을 반복한다.
- 아령 이미지는 위아래로 둥둥 떠 있는 애니메이션을 반복한다.
- 민트색 점은 squash/bounce 느낌으로 움직인다.
- 레트로 박스 안쪽은 타이핑/스프라이트 기반 표현을 사용한다.
- `OVERVIEW`의 안내 카드 hover 시 배경 이미지와 화살표 원형 버튼 상태가 바뀌고, 설명 텍스트 opacity가 올라간다.

참고: 데스크톱 Headless Chrome 캡처에서는 `OVERVIEW` 본문 일부가 스크롤 타이밍에 따라 opacity 0 상태로 남는 현상이 재현됐다. DOM과 모바일 화면에서는 해당 메시지가 확인되므로, 실제 브라우저에서 스크롤 트리거 타이밍을 한 번 더 검증하는 편이 좋다.

관련 캡처:

| 화면 | 파일 |
| --- | --- |
| Home 데스크톱 | `analysis-assets/home-desktop.png` |
| Home 모바일 | `analysis-assets/home-mobile.png` |

## 4. Project 페이지

### 핵심 메시지

Project 페이지의 상단 메시지는 다양한 웹/앱 프로젝트를 React, Next.js, TypeScript, JavaScript, React Native로 제작했다는 점을 강조한다. 페이지는 프로젝트를 단순 나열하지 않고 `PERSONAL`, `TEAM`, `WORK` 3개 탭으로 분류한다.

탭 선택에 따라 카드 목록과 필터가 바뀐다.

| 탭 | 표시 프로젝트 | 필터 |
| --- | --- | --- |
| PERSONAL | Hello, Money / Favorite Countries / Pokedex / Portfolio | React, Next.js, TypeScript |
| TEAM | @GATHER_HERE / BIGBUN / ITFIT | React, Next.js, TypeScript |
| WORK | AMIPHARM / HANNAH / SUGARCOACH / SNAPCOMPANY | JavaScript, React Native |

### 보여주는 방식

상단에는 큰 `MY PROJECT` 타이포와 모자 이미지가 배치된다. 탭은 표 형태의 얇은 선 박스 안에 라디오 버튼처럼 보이도록 구성되어 있고, 선택된 탭은 검은색 작은 사각 표시로 상태를 보여준다.

프로젝트 목록은 데스크톱에서 2열 카드 그리드, 모바일에서 1열 카드 리스트로 보여준다. 각 카드는 프로젝트 미리보기 이미지, 제목, 짧은 설명을 담고 있으며, 이미지 영역과 제목 모두 상세 페이지 링크로 동작한다.

### 필터 동작

필터 버튼을 누르면 현재 탭 안에서 해당 기술을 가진 프로젝트만 남는다.

예시:

- PERSONAL + React: Hello, Money / Favorite Countries / Portfolio
- PERSONAL + Next.js: Pokedex
- PERSONAL + TypeScript: Favorite Countries / Pokedex / Portfolio

### 프로젝트 카드 요약

| 분류 | 카드 제목 | 카드 메시지 요약 |
| --- | --- | --- |
| Personal | Hello, Money | 지출 관리와 지출 현황 시각화 앱 |
| Personal | Favorite Countries | 좋아하는 국가를 검색하고 즐겨찾는 웹사이트 |
| Personal | Pokedex | 포켓몬 정보를 탐색하는 도감 |
| Personal | Portfolio | 이 포트폴리오 사이트 자체 |
| Team | @GATHER_HERE | IT 직군 통합 플랫폼 |
| Team | BIGBUN | 대전 빵집 추천 웹사이트 |
| Team | ITFIT | IT 직종 테스트 플랫폼 |
| Work | AMIPHARM | 생명과학 회사 웹사이트 |
| Work | HANNAH | 한나패드 웹사이트 |
| Work | SUGARCOACH | 건강 데이터/식단 관리 앱 일부 기능 |
| Work | SNAPCOMPANY | 마케터용 B2B 관리자 페이지 |

관련 캡처:

| 화면 | 파일 |
| --- | --- |
| Project 데스크톱 | `analysis-assets/project-desktop.png` |
| Project 모바일 | `analysis-assets/project-mobile.png` |
| TEAM 탭 | `analysis-assets/project-state-team.png` |
| WORK 탭 | `analysis-assets/project-state-work.png` |

## 5. Project 상세 페이지

상세 페이지는 공통적으로 뒤로가기 화살표, 프로젝트 제목, 설명 박스, `주요 정보 및 링크 정보`, `프로젝트 기록` 영역으로 구성된다. 설명 박스 안에서는 핵심 기능 키워드를 민트색으로 강조한다. 정보 박스는 기간, 주요 기능, 주요 기술, 기여도, GitHub/URL을 표처럼 보여준다. 기록 영역은 velog 글 링크를 버튼 형태로 제공한다.

### Personal 상세

| 라우트 | 제목 | 메시지/기능 요약 | 기간 | 기술 | 기여도 | 링크/기록 |
| --- | --- | --- | --- | --- | --- | --- |
| `/project/personal/0101` | Hello, Money | 로그인/회원가입 검증, 토큰 저장, 지출 데이터 필터링, 월별 지출 그래프, skeleton loading, 지출 항목 CRUD를 설명한다. | 2024.06.09 ~ 2024.06.19 | React, Styled-components, Axios, JWT, JSON | 100% | GitHub, 배포, Axios, 로그인 유지, 프로젝트 기록 |
| `/project/personal/0102` | Favorite Countries | 국가 검색, 즐겨찾기 추가/삭제, 국기 이미지, hover 배경 이미지, Lottie 로딩, 반응형 디자인을 강조한다. | 2024.06 ~ 2024.06 | TypeScript, React, Styled-components, Axios | 100% | GitHub, 회고록, Lottie 사용법 |
| `/project/personal/0103` | Pokedex | 포켓몬 API, Next.js/TypeScript, 무한 스크롤, 카드 flip hover, SSR, 동적 메타데이터, SEO 최적화를 설명한다. | 2024.07 ~ 2024.07 | TypeScript, Next.js, Tailwind CSS | 100% | GitHub, 배포, 동적 메타데이터, 렌더링 방식 |
| `/project/personal/0104` | Portfolio | GSAP 스크롤 애니메이션, 이미지 말풍선 hover, Project/About 선택, 기술 필터, Supabase 연동, 반응형 UI를 설명한다. | 2024.10.16 ~ 2025.01.13 | TypeScript, React, Styled-components, Supabase | 100% | GitHub, 배포, 스프라이트/타이핑 애니메이션, 도메인 연결, 트러블슈팅 |

### Team 상세

| 라우트 | 제목 | 메시지/기능 요약 | 기간 | 기술 | 기여도 | 링크/기록 |
| --- | --- | --- | --- | --- | --- | --- |
| `/project/team/0201` | @gather_here | IT 직군 플랫폼에서 마이페이지, 프로필 이미지 업로드, 닉네임 검증, 콘텐츠 필터링/페이지네이션, 반응형 UI, 공통 컴포넌트를 맡았다고 설명한다. | 2024.07.16 ~ 2024.08.20 | TypeScript, Next.js, Tailwind CSS, Zustand, Context API, Supabase | 25% | GitHub, 트러블슈팅 2건, 회고 |
| `/project/team/0202` | 대빵이 | 대전 빵집 정보 사이트로, Kakao Map API, Supabase 데이터 출력, 기본 이미지 처리, 이미지 랜덤 배치, floating animation을 설명한다. | 2024.07.09 ~ 2024.07.16 | TypeScript, Next.js, Zustand, Axios, Supabase, Tailwind CSS | 25% | GitHub, 애니메이션 구현, Kakao 지도 |
| `/project/team/0203` | ITFIT | IT 직군 테스트 결과에서 TOP 3 직군, Supabase 누적 데이터, 동률 그룹화, 백분율 계산을 구현했다고 설명한다. | 2024.05.31 ~ 2024.06.07 | React, Styled-components, Supabase | 15% | GitHub, TOP3 직군 표시 글 |

### Work 상세

| 라우트 | 제목 | 메시지/기능 요약 | 기간 | 기술 | 기여도 | 링크/기록 |
| --- | --- | --- | --- | --- | --- | --- |
| `/project/work/0301` | Amipham | 생명과학 회사 소개 반응형 웹사이트. 슬라이더, AOS 애니메이션, 게시판, 폼 요소, 전 디바이스 대응을 설명한다. | 2021.04 ~ 2021.04 | JavaScript, jQuery, HTML, CSS | 100% | 서비스 URL |
| `/project/work/0302` | Hannah | 회원가입/로그인/마이페이지 UI, 백엔드 협업, CS 센터/이벤트 탭, table 기반 안내 UI, PC/모바일 대응을 설명한다. | 2020.12 ~ 2021.05 | JavaScript, jQuery, HTML, CSS | 30% | 서비스 URL |
| `/project/work/0303` | SugarCoach | React Native 기반 건강 데이터 앱 일부. SVG 차트, 식단 마커, 식단 CRUD, 배송 API, 배송 상태 progress bar, 주문/배송 필터를 설명한다. | 2025.03 ~ 2024.05 | TypeScript, React Native | 40% | Google Play |
| `/project/work/0304` | SanpCompany | 마케팅 성과 분석용 B2B 관리자 페이지. 전체 퍼블리싱, 공통 UI 시스템, API 기반 화면, 리스트/지표 카드/차트 제작을 설명한다. | 2025.06 ~ 2025.11 | Vue.js, JavaScript, HTML, CSS | 50% | Vue.js 기록 |

## 6. About 페이지

### 핵심 메시지

About 페이지는 개인의 경험과 가치관을 프로젝트보다 감성적으로 보여준다. 상단에는 `About` 제목과 책 이미지가 있으며, 그 아래에는 여행/일상 사진과 짧은 영상이 콜라주처럼 배치된다.

자기소개 메시지의 핵심은 다음과 같다.

- 작은 디테일이 사용자 경험을 풍부하게 만들고 자연스러운 소통을 만든다고 본다.
- 직관적인 상호작용을 통해 사람들이 편하고 즐겁게 쓸 수 있는 서비스를 만들고자 한다.
- 개인의 경험과 기억이 기술로 연결되어 더 나은 서비스를 만들 수 있다고 본다.
- 사용자 피드백과 테스트를 기반으로 개선하고, 팀과 함께 만족할 수 있는 결과물을 만들고자 한다.

### 기술 스택 섹션

`나의 기술들` 섹션은 카드를 가로로 나열한다. 데스크톱에서는 큰 가로 슬라이더처럼 보여 첫 번째 카드가 강조되고, 다음 카드들이 오른쪽으로 이어진다. 모바일에서는 카드가 하나씩 보이며 좌우 화살표로 넘기는 구조다.

| 카드 | 내용 |
| --- | --- |
| 개발 기술 | JavaScript, TypeScript, React, Next.js, Vue.js |
| 스타일링 및 마크업 | HTML5, CSS3, Tailwind CSS, Bootstrap |
| 형상 관리 | Git, SVN |
| 백엔드 서비스 및 배포 | Supabase, Vercel, Cafe24 |

### 연락 CTA

페이지 하단에는 손그림 봉투 이미지와 `Connect with Me` 문구가 들어간 큰 박스가 있다. 전체 박스가 mailto 링크로 동작한다. 데스크톱에서는 넓은 가로 CTA, 모바일에서는 카드형 박스로 보인다.

관련 캡처:

| 화면 | 파일 |
| --- | --- |
| About 데스크톱 | `analysis-assets/about-desktop.png` |
| About 모바일 | `analysis-assets/about-mobile.png` |
| About 기술 섹션 | `analysis-assets/about-skills-desktop.png` |
| About 연락 CTA | `analysis-assets/about-contact-desktop.png` |

## 7. 디자인 시스템 관찰

### 색상

사이트의 전체 배경은 밝은 회색 계열이고, 아주 약한 노이즈 텍스처가 겹쳐져 종이 질감처럼 보인다. 핵심 포인트 컬러는 분홍과 민트다.

| 용도 | 색상 |
| --- | --- |
| 기본 배경 | `#f4f4f8` 계열 |
| 본문/타이포 | black |
| 포인트 핑크 | `#f989b3` |
| 포인트 핑크 hover | `#f76a9c` |
| 포인트 민트 | `#56dfb4` |
| 보조 텍스트 | `#666` 계열 |

색 조합은 흑백 타이포 중심에 분홍/민트 포인트를 얹는 방식이다. 덕분에 페이지가 귀엽고 캐주얼하지만, 메인 텍스트는 검정으로 충분히 강하게 읽힌다.

### 타이포그래피

계산 스타일과 CSS 변수 기준으로 다음 폰트가 사용된다.

| 역할 | 폰트 | 관찰 |
| --- | --- | --- |
| 대형 영문 제목/메뉴 | Exo 2 | `MY PROJECT`, `OVERVIEW`, 메뉴 링크 등에서 강하게 사용 |
| 본문/한국어 | SUIT | 설명문, 버튼, 푸터, 프로젝트 정보 영역 |
| 로딩된 외부 폰트 | Merriweather, Nerko One | 번들/폰트 선언에 있으나 주요 화면에서 지배적으로 보이지 않음 |

데스크톱 대형 제목은 약 134px 수준으로 매우 크다. 모바일에서는 약 54px대로 줄어든다. 본문은 데스크톱 약 20px, 모바일 약 16px 수준이라 읽기성은 대체로 안정적이다.

### 레이아웃

- 기본 콘텐츠 폭은 대략 화면의 88%로 잡혀 있다.
- 선, 얇은 border, 큰 여백을 많이 사용한다.
- 둥근 모서리는 사용하지만 과도하게 둥글지는 않다.
- 프로젝트 목록은 데스크톱 2열, 모바일 1열로 단순하게 반응한다.
- About 기술 카드는 데스크톱에서 가로 슬라이드 성격이 강하고, 모바일에서 명확한 carousel 조작 버튼이 보인다.

### 이미지/그래픽

주요 그래픽은 WebP/GIF 이미지 기반이다. 히어로의 노트북/아령, 검은 레트로 박스, 프로젝트 미리보기, About 사진 콜라주, 봉투 일러스트가 모두 실제 시각 자산으로 구성되어 있다. SVG만으로 구성된 미니멀 포트폴리오가 아니라, 사진과 모션 이미지로 개성을 만든다.

## 8. 애니메이션 상세

사이트 번들에는 GSAP 3.12.5와 ScrollTrigger가 포함되어 있다. CSS와 계산 스타일 기준으로 관찰된 키프레임은 다음과 같다.

| 이름 | 역할 |
| --- | --- |
| `sprite-frames` | 스프라이트 배경 위치를 steps 방식으로 이동 |
| `shake` / `hTTapO` | 민트색 점의 통통 튀는 scale/translate 모션 |
| `drawCircle` | 메뉴 링크 hover 원형 stroke drawing |
| `rotateLogo` | 꽃 로고 회전 |
| `eTYjOB` | 노트북 이미지의 미세한 좌우 흔들림 |
| `lkkowY` | 아령 이미지의 위아래 부유 모션 |

페이지별 모션 성격:

| 영역 | 모션 |
| --- | --- |
| Home hero | 텍스트 등장, 이미지 흔들림/부유, 민트 점 bounce |
| Home terminal | 레트로 타이핑/스프라이트 느낌 |
| Home overview cards | hover 시 배경 이미지, 화살표, 설명 opacity 변화 |
| Header/Menu | 햄버거-X 전환, 풀스크린 민트 오버레이, 메뉴 hover 원형 drawing |
| Project list | 탭/필터 전환, 카드 이미지 hover preview opacity 변화 |
| Project detail | 키워드 민트 강조, 버튼 hover 중심의 약한 인터랙션 |
| About collage | 사진/영상 lazy reveal, opacity transition |
| About skills | 가로 carousel/slider 이동 |
| Footer | 링크 텍스트 rolling transform |

전체적으로 모션은 단순 장식이 아니라 "포트폴리오를 탐색하는 재미"를 만드는 쪽에 쓰인다. 다만 스크롤 트리거가 많은 편이라 캡처/환경에 따라 reveal 상태가 민감하게 달라질 수 있다.

## 9. 반응형 관찰

모바일 전환은 전반적으로 잘 되어 있다.

- Home: 히어로 키워드가 4줄로 압축되고 이미지도 크기에 맞춰 재배치된다.
- Project: 카드가 1열로 바뀌며, 탭과 필터가 좁은 화면에서도 유지된다.
- About: 사진 콜라주가 2열 그리드로 정리되고, 기술 카드는 단일 카드 carousel처럼 보인다.
- Menu: 데스크톱의 보조 정보 패널을 제거하고 메뉴만 남겨 모바일 집중도를 높인다.
- Footer: 연락처와 네비게이션이 세로 흐름에 맞게 재배치된다.

모바일 화면에서 큰 문제는 보이지 않았지만, `Project` 상단의 긴 설명과 탭 영역은 아주 작은 화면에서는 줄바꿈/터치 면적을 추가 확인하는 것이 좋다.

## 10. 콘텐츠/품질 이슈

조사 중 눈에 띈 텍스트/데이터 일관성 문제다.

| 위치 | 관찰 |
| --- | --- |
| Work 카드/상세 | 카드에는 `AMIPHARM`, 상세 제목은 `Amipham`으로 표기가 다르다. 실제 서비스명 기준으로 통일 필요 |
| Work 카드/상세 | 카드에는 `SNAPCOMPANY`, 상세 제목은 `SanpCompany`로 보인다. 오타 가능성 높음 |
| SugarCoach 상세 | 기간이 `2025.03 ~ 2024.05`로 시작/종료 순서가 역전되어 있다 |
| SugarCoach 설명 | "식단 식단 입력"처럼 중복 표현이 있다 |
| Portfolio 카드 설명 | "리엑트" 표기는 "리액트"가 자연스럽다 |
| 상세 기술 표기 | `Typescript`, `Tailwindcss`, `Svn` 등 대소문자 표기가 일관되지 않다. `TypeScript`, `Tailwind CSS`, `SVN`으로 통일 권장 |
| Amipham 설명 | "사용자에게 회사 소개 웹사이트입니다" 문장이 어색하다 |
| Footer | 2026년 기준 사이트 카피라면 copyright 연도 갱신 여부를 검토할 수 있다 |

접근성 측면에서 긍정적인 부분은 햄버거 버튼에 `aria-label`, 이메일/GitHub/푸터 링크에 aria 설명이 붙어 있다는 점이다. 다만 `See on GitHub` 버튼은 글자를 span 단위로 쪼개는 구조라 DOM 텍스트 추출 시 글자가 줄 단위로 분리된다. 화면에는 문제 없어 보이지만, 보조기기 읽기나 텍스트 복사 관점에서는 별도 aria-label을 명확히 주는 편이 안전하다.

## 11. 종합 평가

이 사이트는 "개성 있는 프론트엔드 포트폴리오"라는 목적이 명확하다. 검정 대형 타이포, 민트/핑크 포인트, 노이즈 배경, 사진/스프라이트/hover 모션을 적극적으로 써서 정적인 이력서보다 기억에 남는 인상을 만든다.

강점:

- 첫 화면에서 시각적 정체성이 강하다.
- Project가 개인/팀/실무로 나뉘어 경험 범위가 빠르게 파악된다.
- 상세 페이지가 기능, 기술, 기여도, 기록 링크까지 일관된 형식으로 정리되어 있다.
- 모바일 대응과 메뉴 단순화가 잘 되어 있다.
- 애니메이션이 사이트의 개성을 만드는 데 실질적으로 기여한다.

보완하면 좋은 점:

- 프로젝트명/기간/기술명 표기 오타와 불일치를 먼저 정리하는 것이 좋다.
- Home 데스크톱 `OVERVIEW` reveal은 실제 브라우저에서 재검증할 필요가 있다.
- hover 기반 정보는 모바일에서 일부 의미가 사라질 수 있으므로, 핵심 정보는 hover 없이도 보이게 유지하는 것이 좋다.
- 대형 영문 타이포는 강하지만, SEO/접근성 관점에서 각 페이지의 명확한 `h1` 구조도 점검하는 편이 좋다.
- GitHub CTA처럼 글자 단위로 분해된 UI는 aria-label/스크린리더 텍스트를 명확히 분리하는 것이 좋다.

## 12. 캡처 파일 목록

| 구분 | 파일 |
| --- | --- |
| Home desktop | `analysis-assets/home-desktop.png` |
| Home mobile | `analysis-assets/home-mobile.png` |
| Project desktop | `analysis-assets/project-desktop.png` |
| Project mobile | `analysis-assets/project-mobile.png` |
| About desktop | `analysis-assets/about-desktop.png` |
| About mobile | `analysis-assets/about-mobile.png` |
| Menu desktop | `analysis-assets/menu-desktop.png` |
| Menu mobile | `analysis-assets/menu-mobile.png` |
| Personal details | `analysis-assets/project-personal-0101-desktop.png` ~ `analysis-assets/project-personal-0104-desktop.png` |
| Team details | `analysis-assets/project-team-0201-desktop.png` ~ `analysis-assets/project-team-0203-desktop.png` |
| Work details | `analysis-assets/project-work-0301-desktop.png` ~ `analysis-assets/project-work-0304-desktop.png` |


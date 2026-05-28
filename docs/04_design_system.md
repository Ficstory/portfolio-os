# 디자인 시스템

## 1. 디자인 목표

감성적인 macOS 잠금화면과 데스크톱 UI에서 영감을 받은 포트폴리오 경험을 만든다. 단, Apple UI를 그대로 복제하지 않고 독자적인 컬러, 아이콘, 창 컨트롤, 문구, 배경을 사용한다.

## 2. 디자인 원칙

- 잠금화면에서 첫인상을 만든다.
- 데스크톱 UI는 콘텐츠 탐색을 돕는 도구로 사용한다.
- 포트폴리오의 핵심은 대표 프로젝트 3개가 되도록 시각적 우선순위를 둔다.
- glass, blur, shadow는 감성적 분위기를 만들기 위한 보조 수단으로만 사용한다.
- 모바일에서는 데스크톱 흉내보다 정보 접근성을 우선한다.

## 3. 무드 키워드

- calm
- personal
- polished
- soft glass
- focused portfolio
- desktop workspace

## 4. 컬러 토큰

### 4.1 Light Theme

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--color-bg` | `#EEF2F7` | 기본 배경 |
| `--color-wallpaper-start` | `#DDE7F3` | wallpaper gradient 시작 |
| `--color-wallpaper-end` | `#F7E7E2` | wallpaper gradient 끝 |
| `--color-surface` | `rgba(255, 255, 255, 0.72)` | 창, Dock, Menu Bar |
| `--color-surface-strong` | `rgba(255, 255, 255, 0.9)` | 활성 창 |
| `--color-border` | `rgba(70, 82, 102, 0.18)` | 경계선 |
| `--color-text` | `#1F2937` | 본문 |
| `--color-text-muted` | `#667085` | 보조 텍스트 |
| `--color-accent` | `#4F8FD9` | 주요 액션 |
| `--color-accent-soft` | `#DCEBFF` | 선택 배경 |
| `--color-coral` | `#E98B74` | 보조 강조 |
| `--color-green` | `#5DAE8B` | 성공, 활성 indicator |

### 4.2 Dark Theme

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--color-bg` | `#111827` | 기본 배경 |
| `--color-wallpaper-start` | `#172033` | wallpaper gradient 시작 |
| `--color-wallpaper-end` | `#31253A` | wallpaper gradient 끝 |
| `--color-surface` | `rgba(24, 31, 44, 0.72)` | 창, Dock, Menu Bar |
| `--color-surface-strong` | `rgba(30, 41, 59, 0.92)` | 활성 창 |
| `--color-border` | `rgba(255, 255, 255, 0.16)` | 경계선 |
| `--color-text` | `#F8FAFC` | 본문 |
| `--color-text-muted` | `#B6C2D2` | 보조 텍스트 |
| `--color-accent` | `#8AB7FF` | 주요 액션 |
| `--color-accent-soft` | `rgba(138, 183, 255, 0.18)` | 선택 배경 |
| `--color-coral` | `#F2A390` | 보조 강조 |
| `--color-green` | `#7DD7B0` | 성공, 활성 indicator |

## 5. 타이포그래피

한국어 가독성을 우선한다.

| 용도 | 권장값 |
| --- | --- |
| 기본 폰트 | `Pretendard`, `Inter`, `system-ui`, `sans-serif` |
| 코드 폰트 | `JetBrains Mono`, `Menlo`, `monospace` |
| 잠금화면 시간 | 64px, 700 |
| 잠금화면 소개 | 18px, 500 |
| 창 제목 | 14px, 700 |
| 본문 | 15px, 400 |
| 보조 텍스트 | 13px, 400 |
| 카드 제목 | 16px, 700 |

모바일에서는 잠금화면 시간을 44px로 줄이고, 창 제목과 버튼 텍스트는 최소 13px 이상을 유지한다.

## 6. 간격과 레이아웃

| 토큰 | 값 |
| --- | --- |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |

레이아웃 기준:

- Menu Bar 높이: 32px
- Dock 높이: 72px
- Desktop icon 기본 크기: 76px x 88px
- Desktop window 최소 크기: 320px x 360px
- Project detail 권장 창 크기: 920px x 640px
- 모바일 전환 기준: 768px 미만

## 7. Radius와 Shadow

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `radius-sm` | 6px | 작은 버튼 |
| `radius-md` | 8px | 카드, 입력 |
| `radius-lg` | 14px | 창 |
| `radius-xl` | 22px | Dock, 잠금화면 카드 |

카드는 기본 8px 이하를 우선하고, OS 메타포가 필요한 창과 Dock에만 더 큰 radius를 사용한다.

Shadow:

- 기본 창: `0 24px 80px rgba(15, 23, 42, 0.22)`
- 활성 창: `0 28px 90px rgba(15, 23, 42, 0.32)`
- Dock: `0 18px 48px rgba(15, 23, 42, 0.24)`

## 8. Glass 효과

사용 위치:

- 잠금화면 quick link 영역
- Menu Bar
- Dock
- AppWindow

기준:

- `backdrop-filter: blur(18px)`
- 너무 낮은 대비를 피하기 위해 border와 surface opacity를 함께 사용한다.
- 본문이 긴 프로젝트 상세 영역은 완전 투명한 glass가 아니라 읽기 좋은 solid surface에 가깝게 처리한다.

## 9. 아이콘

- lucide-react 기반 아이콘을 우선 사용한다.
- Apple Finder, Apple 로고, macOS 기본 아이콘을 복제하지 않는다.
- 폴더 아이콘은 단색 또는 soft gradient 커스텀 스타일로 만든다.
- 아이콘만 있는 버튼은 tooltip과 `aria-label`을 제공한다.

권장 아이콘 매핑:

| 항목 | 아이콘 방향 |
| --- | --- |
| About | User, Badge |
| Projects | FolderKanban, PanelsTopLeft |
| Skills | Wrench, Code2 |
| Resume | FileText, Download |
| Contact | Mail, Send |
| GitHub | GitHub 브랜드 아이콘 또는 텍스트 대체 |
| Theme | Sun, Moon |
| Search | Search |

## 10. 모션

Motion for React를 사용한다.

| 패턴 | 방향 |
| --- | --- |
| Unlock | 잠금화면 fade/scale out, Desktop fade in |
| Window open | opacity 0 -> 1, scale 0.96 -> 1 |
| Window close | opacity 1 -> 0, scale 1 -> 0.98 |
| Dock hover | scale 1 -> 1.12 |
| Folder hover | translateY -2px |
| Project card hover | border 강조, thumbnail slight zoom |

모션 시간:

- 빠른 인터랙션: 120ms
- 창 전환: 180ms
- unlock 전환: 500ms

reduced motion:

- scale, parallax, drag inertia를 제거한다.
- opacity 전환만 사용한다.

## 11. 잠금화면 패턴

구성:

- 전체 배경 wallpaper
- 중앙 또는 하단 중앙의 시간과 날짜
- 짧은 소개 문장
- `포트폴리오 입장` 버튼
- 하단 quick links

문구 예시:

```txt
프론트엔드 개발자 포트폴리오
사용자 경험을 화면의 구조로 설계하고, 문제를 제품의 형태로 구현합니다.
```

## 12. 데스크톱 패턴

구성:

- 상단 Menu Bar
- 바탕화면 폴더 아이콘
- 하단 중앙 Dock
- 창 레이어

Desktop icon:

- 아이콘과 라벨이 겹치지 않도록 고정 크기를 둔다.
- 라벨은 최대 2줄까지만 표시한다.

Dock:

- 내부 콘텐츠와 외부 링크를 구분한다.
- 열린 창 indicator를 표시한다.

Window:

- titlebar, close button, content area를 가진다.
- 실제 macOS 신호등 버튼을 그대로 복제하지 않는다.
- 닫기 버튼은 독자적인 원형 또는 아이콘 버튼으로 구현한다.

## 13. 접근성 기준

- focus ring을 명확히 표시한다.
- 버튼과 링크는 최소 40px 터치 영역을 가진다.
- 색상만으로 상태를 전달하지 않는다.
- Dialog 성격의 창은 제목과 설명을 스크린리더에 전달한다.
- 모바일에서 hover에 의존하는 정보를 제공하지 않는다.

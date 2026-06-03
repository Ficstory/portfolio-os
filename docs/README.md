# 포트폴리오 사이트 문서

이 폴더는 감성적인 macOS 잠금화면과 데스크톱 UI를 기반으로 한 개인 포트폴리오 웹앱의 기획, 기능, 디자인, 컴포넌트 설계를 정의한다.

## 문서 목록

- [01_requirements_spec.md](./01_requirements_spec.md): 요구사항 명세서
- [02_functional_spec.md](./02_functional_spec.md): 기능 명세서
- [03_information_architecture.md](./03_information_architecture.md): 정보 구조와 콘텐츠 설계
- [04_design_system.md](./04_design_system.md): 디자인 시스템
- [05_component_design.md](./05_component_design.md): 컴포넌트 설계서
- [06_implementation_plan.md](./06_implementation_plan.md): FE 구현 계획
- [07_consistency_test.md](./07_consistency_test.md): 문서 정합성 테스트 결과
- [track-card-redesign/README.md](./track-card-redesign/README.md): 직무 트랙 카드 분리 구조와 검증 기록

## 현재 확정된 방향

- 첫 화면은 일반 랜딩페이지가 아니라 macOS 또는 Windows 잠금화면에서 영감을 받은 랜딩 화면이다.
- 사용자는 잠금화면형 랜딩에서 포트폴리오에 입장한 뒤 데스크톱 UI를 탐색한다.
- 전체 톤은 감성적인 macOS풍이지만 Apple UI를 그대로 복제하지 않는다.
- 대표 프로젝트는 3개만 1차 공개한다.
- 이력서는 PDF 다운로드와 웹 요약본을 함께 제공한다.
- 블로그와 노트는 2차 기능으로 분리한다.
- 전체 콘텐츠와 UI 문구는 한국어만 사용한다.
- 1차 MVP는 FE 중심 정적 사이트로 구현하며, BE는 필요하지 않다.

## 권장 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion for React
- Zustand
- MDX 또는 Markdown
- JSON 또는 TypeScript 기반 콘텐츠 데이터
- Vercel 배포

## 문서 작성 원칙

- 모든 주요 요구사항은 `REQ-` ID로 추적한다.
- 기능 명세는 요구사항 ID를 참조한다.
- 컴포넌트 설계는 기능 ID와 요구사항 ID를 함께 참조한다.
- 디자인 시스템은 UI 구현 시 사용할 토큰과 패턴을 명확히 정의한다.
- BE 작업이 필요한 경우 FE 구현 계획에 섞지 않고 별도 전달사항으로 분리한다.

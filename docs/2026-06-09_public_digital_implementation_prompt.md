# `/public-digital/` 개편 실행 프롬프트

다음 계획서를 먼저 읽고, 그 내용에 따라 구현해줘.

```txt
docs/2026-06-09_daydream_public_digital_application_plan.md
```

작업 대상은 공공 디지털 서비스 기획자 트랙인 `http://localhost:3000/public-digital/` 하나뿐이다.

범위 제한:

- `/public-digital/`만 개편한다.
- `/pm`, `/policy`, `/assembly`, `/`, `/resume`, `/projects/[slug]`의 정보구조와 메시지는 바꾸지 않는다.
- 공유 컴포넌트를 수정해야 한다면 `track.id === "publicDigital"` 조건으로만 새 섹션이 렌더링되게 한다.
- PM, 정책지원관, 국회보좌관 방향의 문구나 섹션을 섞지 않는다.
- 검증되지 않은 수치, 정책 성과, 운영기관처럼 보이는 표현을 추가하지 않는다.

구현 방식:

- 계획서의 `목표 정보구조`, `섹션별 상세 설계`, `데이터 모델 제안`, `디자인 방향`, `검증 기준`을 기준으로 작업한다.
- 필요한 경우 `src/data/publicDigitalMethod.ts`와 `/public-digital/` 전용 섹션 컴포넌트를 새로 만든다.
- 기존 트랙 공용 구조를 건드릴 때는 다른 직무 트랙에 새 섹션이 노출되지 않도록 방어한다.

검증:

- `npm run lint`
- 가능하면 `npm run build`
- `http://localhost:3000/public-digital/` 데스크톱/모바일 확인
- `/pm`, `/policy`, `/assembly`에 public-digital 전용 섹션이 나타나지 않는지 확인

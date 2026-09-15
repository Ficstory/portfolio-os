# 이마트 매장 안내 데모

기존 Next.js / React / CSS Modules / lucide-react로 만든 모바일 안내 페이지입니다. 기존 페이지와 전역 스타일, 배포 설정, 의존성 선언을 수정하지 않습니다. 모든 운영·요금·행사는 가상 예시이며 두 언어로 고지합니다.

## 주소와 QR

- 기본: https://ficstory.dev/event/emart/
- 중국어: https://ficstory.dev/event/emart/?lang=zh
- 한국어 강제: https://ficstory.dev/event/emart/?lang=ko
- QR: `/event/emart/qr-default.png`, `/event/emart/qr-zh.png`

## 수정

- 안내 데이터와 전체 한국어·간체 번역: `src/app/event/emart/content.ts`
- 상호작용: `src/app/event/emart/EmartGuide.tsx`
- 화면: `src/app/event/emart/emart.module.css`
- 경로와 검색 제외 메타데이터: `src/app/event/emart/page.tsx`

언어 우선순위는 유효한 URL 언어 → 저장된 선택 → 한국어입니다. 버튼으로 바꾸면 localStorage의 `emart-demo-language`에 저장합니다. URL에 lang이 있으면 버튼 선택에 맞춰 갱신합니다. 저장소 접근이 차단되어도 현재 방문의 선택은 동작합니다. 층 상태는 언어와 독립적이며 전환 시 스크롤 위치를 복원합니다.

## 검증

```text
npm run lint
npm run build
npm run start -- --hostname 127.0.0.1 --port 3217
node scripts/check-emart.mjs http://127.0.0.1:3217
node scripts/check-emart.mjs https://ficstory.dev
```

검사 스크립트는 로컬 또는 Codex 번들의 Playwright와 설치된 Chrome을 사용합니다. `EMART_QA_OUTPUT`으로 보고서·스크린샷 경로를 지정합니다. 새 앱 의존성은 없습니다. QR 재생성은 기존 ReportLab/Pillow 환경에서 `python scripts/generate-emart-qr.py`를 실행합니다.

기존 package-lock.json은 npm ci에서 @emnapi/runtime·core 항목 누락 오류가 발생했습니다. 이번 작업에서는 원본을 보존하고 `npm install --package-lock=false --no-audit --no-fund`로 로컬 검증 환경만 준비했습니다. 실제 배포는 기존 Vercel Git 연동의 main 브랜치 방식입니다.

## 제거

`src/app/event/emart/`와 `public/event/emart/`를 제거하고 기존 방식으로 main에 반영하면 페이지와 QR이 함께 사라집니다. 관련 검사·QR 생성 스크립트와 이 문서도 필요에 따라 제거합니다. 기존 프로필 경로는 수정할 필요가 없습니다. 이 데모만 추가한 커밋을 `git revert`하여 재배포해도 됩니다.

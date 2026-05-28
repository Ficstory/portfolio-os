# Portfolio OS

잠금화면과 데스크톱 UI를 통해 About, Projects, Skills, Resume, Contact 콘텐츠를 탐색하는 FE 중심 정적 포트폴리오 사이트입니다. MVP는 백엔드 없이 Next.js 정적 export 결과물로 배포하는 것을 기준으로 합니다.

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion for React
- Zustand

## 실행 방법

```bash
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 검증과 빌드

```bash
npm run lint
npm run build
```

`next.config.ts`는 OCI Object Storage 같은 정적 호스팅 환경을 위해 다음 설정을 사용합니다.

- `output: "export"`
- `images.unoptimized: true`
- `trailingSlash: true`

빌드가 성공하면 정적 배포 산출물은 `out/` 폴더에 생성됩니다.

## OCI Object Storage 정적 배포

1. OCI Object Storage에서 정적 웹 사이트 호스팅용 버킷을 생성합니다.
2. `npm run build`를 실행해 `out/` 폴더를 생성합니다.
3. `out/` 폴더 안의 파일과 폴더를 버킷에 업로드합니다.
4. 버킷의 정적 웹 사이트 설정에서 인덱스 문서를 `index.html`로 지정합니다.
5. 오류 문서가 필요하면 `404.html`을 지정합니다.
6. 실제 공개 URL, 커스텀 도메인, CDN 경로는 생성된 OCI 리소스 값으로 교체합니다.

README에는 실제 tenancy OCID, access key, secret key, 버킷명, 도메인을 기록하지 않습니다.

## 정적 export 제약

- API Route, Middleware, SSR, ISR, 서버 액션을 사용하지 않습니다.
- `/projects/[slug]` 라우트는 `generateStaticParams()`로 정적 상세 경로를 생성합니다.
- 콘텐츠는 `src/data`, `src/content`, `public` 아래의 정적 데이터와 정적 자산을 기준으로 관리합니다.

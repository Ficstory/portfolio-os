# 부산이음길 AI 식별 소개 보강

- 반영 대상: 공통 웹·제출용 PDF, PM 홈·상세·인쇄본, 기존 소문자 PM 홈·상세, 공공디지털·프로젝트 상세, 컴플라이언스 포트폴리오의 부산이음길 소개.
- 2026-10-30 사용자 확인: 부산이음길에서 AI로 볼라드와 단차를 식별했으며, 공모전 신청 서류에 관련 내용이 있다는 설명.
- 공개 저장소 대조: `busaneumgil/busaneumgil`, `develop`, `AI/model_train/step4_colab_yolov11_seg_train.ipynb`. AI Hub 보행 안전 도로 시설물 데이터, YOLOv11m-seg 학습, 볼라드 및 점자블록 클래스 평가·샘플 추론 출력을 확인했다.
- 출처: https://github.com/busaneumgil/busaneumgil/blob/develop/AI/model_train/step4_colab_yolov11_seg_train.ipynb
- 최초 검색에서는 기존 기록이 가리키는 `2026-06-22_부산시_공공데이터AI_창업경진대회_제품서비스개발_신청서_최종작성안.md`를 찾지 못했다. 사용자 재확인 요청 이후 워크스페이스의 `C:/Users/User/Desktop/워크스페이스/profile/tmp/pdfs/busan-eumgil-review/page-07.png`부터 `page-12.png`까지 신청서 페이지 이미지 6개를 찾아 직접 읽었다. 원본 MD/PDF 파일 자체는 이번 검색에서 찾지 못했다.
- 신청서 8쪽: 카카오 로드뷰 기반 점자블록·볼라드 인식, AI Hub 보행 안전 도로 시설물 데이터의 polygon 라벨을 YOLO Segmentation 형식으로 변환, YOLOv11m-seg 파인튜닝 및 부산 로드뷰 캡처로 도메인 보강.
- 신청서 9쪽: Box mAP50 0.858, Mask mAP50 0.860 등 팀의 모델 평가와 로드뷰 탐지 결과 이미지. 확장한 PM 상세 페이지에는 신청서의 팀 평가 수치임을 명시하고 이미지 탐지 평가와 현장 보행 안전성을 구분했다.
- 신청서 11쪽: 부산 신호등·횡단보도 약 10,000개 좌표를 순회하고 지점별 로드뷰를 36도씩 회전해 10장 캡처한 뒤 존재 여부를 판별, 경로 가중치 산출의 기반 데이터 자동 생성. 이 과정을 상세 페이지에 요약했다.
- 단차는 12쪽의 접근성 라벨 표준화 항목에 나타나지만 확인한 AI 기술·서비스 부분의 식별 대상은 점자블록·볼라드다. 최초 사용자 표현을 그대로 반영했던 AI 단차 식별 문구를 신청서에 명시된 볼라드·점자블록으로 수정했다.
- 팀 AI 기능과 본인의 기획·Android 프론트엔드 역할을 구분했다. 개인 모델 개발, 앱 실시간 카메라 탐지, 현장 정확도·이동 효과는 추가하지 않았다.
- 최초 반영은 웹 소개만 수정했다. 이후 사용자의 전반적 반영 요청에 따라 제출용 PDF와 정적 미리보기까지 갱신했다.
- 검증: 변경한 TSX 2개 파일 ESLint 및 `npx tsc --noEmit` 통과. 로컬 브라우저에서 `/portfolio/` 소개 문구, 본문과 푸터 비겹침, 프로젝트 상세 링크 이동 및 `/PM/busan-eumgil/` AI 설명 표시를 확인했다. `git diff --check` 통과.
- 신청서 이미지 대조 후 문구 정정은 변경 TSX 파일 ESLint와 `git diff --check`로 확인했다. 위 브라우저·타입 검증은 최초 보강 시점의 기록이다.

## 전반적 반영

- 공통 `/portfolio/`: 팀의 AI 식별과 경로 가중치용 데이터 생성을 소개에 포함했다.
- `/PM/`, `/PM/busan-eumgil/`: 카드·메타데이터·상세 소개를 갱신하고, 현장 요구 설명 뒤에 로드뷰 수집 → 시설물 식별 → 경로용 데이터의 팀 작업 과정을 추가했다. 개인 역할은 기관 연락·기획·Android 프론트엔드로 유지했다.
- `/PM/print/`: 13장 구성을 유지하며 부산이음길 소개 장표에 팀 AI 데이터 흐름을 넣고, 기여 장표에서 팀과 개인 역할을 구분했다.
- `/pm/`, `/pm/busan-eumgil/`, `/projects/busan-eumgil/`, `/public-digital/`: 기존 버전의 공유 데이터와 상세 설명·공공디지털 카드에 같은 근거를 반영했다. 프로젝트 증빙에는 공개 AI 학습 노트북을 추가했다.
- `/compliance/`: 부산이음길 소개에 팀 AI 데이터 구축을 보강했다. 기존 기관 소통·UX·개인 기여 내용은 유지했다.
- 제출용 `public/portfolio/files/lee-jaeho-portfolio.pdf`: 7쪽, 320×180mm, 820,174바이트. SHA-256 `8864b659a7f8212828998a0fde76a61f218266c46248b055e19612669e733898`.
- `/portfolio/print/`의 7개 WebP를 완성 PDF에서 다시 렌더링했다. 기존 다운로드 URL과 페이지 수는 유지했다. 과거 채용 제출 사본은 변경하지 않았다.

## PDF 재생성

기존 `profile/output/공통_포트폴리오_20261011/make_submission_pdf.py`의 ReportLab 조판을 `scripts/generate-portfolio-pdf.py`로 가져와 현재 저장소의 프로덕션 빌드 HTML·이미지를 읽도록 바꿨다. 전용 폰트는 저장소의 Pretendard에서 변환한다.

1. `npm run build`
2. `python scripts/generate-portfolio-pdf.py` (beautifulsoup4, fonttools, brotli, reportlab, pypdf, Pillow 필요)
3. `output/pdf/common-portfolio/lee-jaeho-portfolio.pdf`를 Poppler로 1600×900 PNG로 렌더링해 7쪽 검수.
4. 검수한 PDF를 공개 파일 경로로 복사하고, 같은 렌더링의 WebP를 `public/portfolio/print/pages/page-01.webp`부터 `page-07.webp`로 저장.

생성용 의존성은 프로젝트 `.codex_tmp/portfolio-pdf/deps`에만 설치했다. 검수·폰트 중간 산출물은 `output/pdf/common-portfolio/qa`에 두고 Git에서 제외했다.

## 검증과 위임

- 최종 변경 TS/TSX 8개 파일 ESLint, `npm run build`의 TypeScript·정적 페이지 생성·TIL 공개정보 검사, `git diff --check` 통과.
- 프로덕션 서버에서 공통·PM·기존 PM·프로젝트 상세·공공디지털·컴플라이언스의 수정 문구를 확인했다. 공공디지털 카드는 링크의 접근성 이름 때문에 AX 요약에 본문이 생략되어 실제 렌더링된 DOM 텍스트로 확인했다.
- 390px 모바일에서 공통·PM 상세의 가로 넘침 없음. 공개 PDF 미리보기 7개 이미지의 로드와 다운로드 경로를 확인했다.
- PDF 7쪽의 한글 텍스트·페이지 크기·페이지 번호·4쪽 AI 문구 확인. 조판 경계 및 본문 넘침 0건. 전 페이지 렌더링과 4쪽 확대 검수.
- PM 인쇄 미리보기의 수정 장표 2개에서 넘침 없음, 본문/푸터 여유 약 33px·29px 확인.
- 카드·기존 상세의 독립적인 4개 파일 편집을 네이티브 작업자에게 위임했다. 요청 모델/effort는 `gpt-6.1-sol`/`medium`; 도구가 실제 실행 메타데이터를 노출하지 않아 런타임은 독립 확인하지 못했다. 변경 파일 ESLint와 공백 검사 통과 후 메인에서 통합·화면 검수했다.
- 운영 배포는 실행하지 않았다.

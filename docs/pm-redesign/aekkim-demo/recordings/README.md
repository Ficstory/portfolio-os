# 애낌 화면별 녹화

2026-09-11. 기존 Android 앱을 전용 에뮬레이터에서 직접 실행·조작한 별도 영상 4개다. 서버 대신 데모 데이터를 연결했다.

| 파일 | 길이 | 촬영한 화면과 동작 |
| --- | --- | --- |
| [01-promotions.mp4](01-promotions.mp4) | 32.77초 | 프로모션 목록 → 묶음 혜택 상세 → 설명 스크롤 → 프로모션·카드 혜택 탭 → 음악·AI 카테고리 |
| [02-mypage.mp4](02-mypage.mp4) | 22.20초 | 프로필 → 체크인 알림 설정 → 혜택 정보 수신 동의 → 앱 정보·계정 메뉴 → 프로필 |
| [03-onboarding-payments.mp4](03-onboarding-payments.mp4) | 31.70초 | 감지된 결제·구독 목록 → 결제일·금액 확인 → 확인이 필요한 결제 상세 → 확인 완료 → 대시보드 |
| [04-onboarding-ai-analysis.mp4](04-onboarding-ai-analysis.mp4) | 15.90초 | 결제 기록 탐색 → 최근 사용 매칭 → 정기결제 정리 → 분석 완료 → 구독 확인 결과 |

각 MP4와 같은 이름의 PNG는 대표 이미지다. `screenshots/`에는 주요 화면 캡처를 보관했다. 영상은 1080×2340, H.264, 30fps, 무음이며 실제 녹화 속도를 유지한다. 원본 화면 녹화의 가변 프레임 간격을 30fps로 변환하고 끝 화면을 2초 유지했다. AI 영상은 앞부분의 앱 재실행·스플래시 구간을 잘라냈다. 길이와 해시는 `capture-manifest.json`에 기록했다.

## 데이터와 촬영 범위

- Compose 화면과 애니메이션, 화면 이동, 설정 변경, 결제 확인·등록 동작은 원본 앱 UI를 사용했다.
- 프로필은 `demo@example.com`, 금액·결제일·추천 혜택은 고정 예시다. 혜택 제목과 설명에도 시연용임을 표시했다.
- **AI 영상은 고정 예시 결과로 분석 화면의 단계를 재현한 것이다. 실제 AI 모델 추론이나 실제 결제 데이터 수집을 실행한 기록은 아니다.**
- 원본 소스에서는 분석 후 결제·구독 확인 화면으로 이동한다. 결제 영상은 이 확인 화면과 검토할 결제 상세를 촬영했다.
- 결제 영상에서 예시 구독 5개를 등록해 월 합계 73,800원이 된 것을 확인했다. 불확실한 웨이브 결제 1건은 검토 대상으로 남는다.
- 데모 앱 패키지는 `com.ssafy.e106.demo`이고 최종 APK에 INTERNET 권한이 없다. 설정과 구독 정보는 프로세스 안의 예시 상태만 변경한다.

## 소스와 재촬영

원본 소스는 `C:/Users/ljh43/OneDrive/Desktop/workspace/SSAFY/프로젝트/3. 특화pjt/S14P21E106/FE`이며 변경하지 않았다. 별도 복사본 `C:/Users/ljh43/AppData/Local/Temp/aekkim-offline-demo-20260911`에서 녹화용 빌드를 만들었다.

1. 원본 FE를 별도 폴더로 복사하고 SDK 위치만 `local.properties`에 지정한다. 비밀 키와 `google-services.json`은 필요 없다.
2. 복사본에 이 폴더의 `extended-offline-demo.patch`를 `git apply --ignore-space-change`로 적용한다. 최초 `offline-demo.patch`의 변경까지 포함하므로 두 패치를 연속 적용하지 않는다.
3. JDK 17 / Android SDK 35로 `gradlew.bat :app:assembleDemo`를 실행한다.
4. Android 16 전용 AVD `AekkimDemo`를 1080×2340, 420dpi, 포트 5560으로 실행하고 데모 APK를 설치한다.
5. `../record-extra-screens.py`를 실행한다. 화면별로 `promotions`, `mypage`, `payments`, `analysis` 인자를 지정할 수도 있다. 스크립트는 전용 AVD와 해상도를 검사한다.

전체 해상도 원본 녹화와 확장 APK는 프로젝트의 `.codex_tmp/aekkim-extra-capture/`에 보관한다. 원본 파일명은 `01-promotions-raw.mp4`, `02-mypage-raw.mp4`, `03-onboarding-payments-raw.mp4`, `04-onboarding-ai-analysis-raw.mp4`, APK는 `aekkim-extended-offline-demo.apk`다. 화면별 조작 시각은 해당 폴더의 `*-timeline.json`에 있다.

재촬영한 원본은 앱 시작 시간에 따라 AI 구간의 앞부분을 다시 확인해 잘라내야 한다. 첫 분석 화면부터 결과 목록의 로고가 모두 표시된 장면까지 사용한다.

## 검증 자료

- 원본 소스 및 확장 파일 SHA-256, APK와 영상 해시: `capture-manifest.json`
- 데모 API 호출 및 크래시 확인용 로그: `capture-log.txt`
- 원본 FE에 대한 패치 적용 가능 검사: `git apply --check --ignore-space-change` 통과. 검사만 수행했다.
- 네 영상 전체 디코딩 검사와 주요 전환 장면 확인.

포트폴리오 페이지의 기존 대표 영상은 이번 별도 녹화 저장 작업에서 교체하지 않았다.

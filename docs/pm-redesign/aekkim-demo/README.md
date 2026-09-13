# 애낌 오프라인 앱 시연

2026-09-11. 기존 Android 앱 소스로 서버 없는 데모 APK를 빌드하고, 전용 Android 에뮬레이터에서 직접 조작해 녹화했다. 초기 목업이나 홍보 영상의 정지 화면을 이어 붙인 결과가 아니다.

**추가 녹화:** 프로모션, 마이페이지, 온보딩 결제 확인, AI 분석 화면은 [recordings/README.md](recordings/README.md)에 별도로 정리했다. 아래 내용과 초기 패치·매니페스트는 최초 대시보드/구독 등록 녹화의 기록이며, 추가 기능은 확장 패치에 포함된다.

## 결과물

- 포트폴리오 미리보기: `public/pm/previews/aekkim.mp4` — 26.75초, 480×1040, 24fps, 무음, 정상 속도.
- 전체 해상도 원본: `.codex_tmp/aekkim-demo-output/aekkim-demo-original.mp4` — 1080×2340.
- 설치 파일: `.codex_tmp/aekkim-demo-output/aekkim-offline-demo.apk` — 별도 패키지 `com.ssafy.e106.demo`.
- 화면 캡처: 이 폴더의 `screenshots/`에 PNG 6장, 각 1080×2340.
- 재현 자료: `offline-demo.patch`, `record-demo.py`, `capture-manifest.json`.

원본 영상과 APK는 용량이 큰 로컬 산출물로 `.codex_tmp/`에 보관하며 Git에는 포함되지 않는다. 웹용 영상과 캡처, 패치는 저장소에서 관리한다.

## 촬영한 동작

1. 기존 구독 3개, 월 합계 54,400원, 검토할 결제 1건이 있는 대시보드.
2. 결제 후보를 열고 9월 15일, 10,900원 내역 확인.
3. 서비스 선택 바텀시트에서 웨이브 선택.
4. 원래 앱의 요금제 자동 매칭 로직이 금액에 맞는 단일 요금제를 골라 등록. 검토 목록은 빈 상태로 전환.
5. 대시보드에서 웨이브 추가, 월 합계 65,300원, 검토 배너 제거 확인.
6. 등록한 구독의 상세 바텀시트에서 스탠다드, 10,900원, 다음 결제일 9월 15일 확인.

새로 등록한 구독의 사용 기록과 추천 혜택은 빈 상태를 그대로 표시한다. 해당 기능의 데이터를 임의로 채워 시연하지 않았다. 화면 상단의 햄스터, 바텀시트 전환, 버튼 반응은 기존 앱 동작이다.

## 실제 앱과 데모의 경계

원본 경로: `C:/Users/ljh43/OneDrive/Desktop/workspace/SSAFY/프로젝트/3. 특화pjt/S14P21E106/FE`.

이 소스를 `C:/Users/ljh43/AppData/Local/Temp/aekkim-offline-demo-20260911`에 복사해서 수정했다. 원본 저장소는 변경하지 않았다. 원본 파일별 SHA-256은 `capture-manifest.json`에 남겼다.

- 기존 Compose 화면, 내비게이션, ViewModel, 서비스 선택 및 등록 로직을 사용했다.
- `demo` 빌드에서 로그인과 초기 인증·외부 SDK 시작을 생략했다.
- OkHttp 인터셉터가 서버 대신 메모리의 예시 응답을 반환한다. 실제 결제 내역 수집이나 AI 탐지, 실서비스 백엔드를 실행한 증거는 아니다.
- 구독 추가는 메모리 상태를 바꿔 다음 조회에 반영된다. 앱 프로세스를 종료하고 다시 실행하면 초기 데이터로 돌아간다.
- 데모 APK의 최종 매니페스트에서 INTERNET 권한을 제거했다. 개인 계정이나 실제 결제 데이터를 사용하지 않았다.
- 촬영 범위 외의 로그인, 프로모션, 사용 분석, 삭제·수정 등 전체 기능 복원은 하지 않았다. 지원하지 않는 API는 데모 오류를 반환한다.

포트폴리오에는 **‘기존 앱 UI를 데모 데이터로 실행한 시연’**으로 표시했다.

## 다시 빌드하고 촬영하기

1. 위 원본 FE를 별도 작업 폴더로 복사한다. `build`, `.gradle`, `local.properties`, `google-services.json`은 복사하지 않는다.
2. 복사한 FE 폴더에서 `git apply --check --ignore-space-change <offline-demo.patch>` 후 `git apply --ignore-space-change <offline-demo.patch>`를 실행한다. Windows 줄바꿈 차이를 허용하는 옵션이다. 원본이 달라졌다면 먼저 패치와 해시를 비교한다.
3. 복사본의 `local.properties`에는 `sdk.dir`만 지정한다. JDK 17, Android SDK 35를 사용해 `gradlew.bat :app:assembleDemo`를 실행한다. 비밀 키나 서버 설정은 필요 없다.
4. 전용 AVD `AekkimDemo`를 1080×2340, 420dpi로 실행한다. 이번 녹화는 SDK의 36.1 Google Play x86_64 시스템 이미지, WHPX, SwiftShader, 포트 5560을 사용했다.
5. `adb -s emulator-5560 install -r app/build/outputs/apk/demo/app-demo.apk` 후 `adb -s emulator-5560 shell am start -n com.ssafy.e106.demo/com.ssafy.e106.app.MainActivity`로 실행한다.
6. 처음 대시보드의 54,400원과 검토 1건이 보이면 `record-demo.py`를 실행한다. 스크립트의 ADB 경로는 현재 PC 기준이며, 같은 화면 크기에서 확인한 좌표로 조작한다. 스크립트는 전용 AVD 이름과 시작 화면을 확인한다.

촬영은 Android `screenrecord`를 28초 제한으로 실행했다. 인코더 초기화 시간을 제외한 저장 영상은 26.75초다. FFmpeg로 크기 축소와 24fps 변환만 적용했고, 화면 합성이나 배속 변경은 하지 않았다.

## 검증

- `:app:assembleDemo` 성공. 최종 APK 설치·실행 성공.
- 대시보드 → 검토 → 서비스 선택 → 등록 → 합계 갱신 → 상세 조회를 실제 UI에서 확인.
- 등록한 결제일 15일 유지와 월 합계 10,900원 증가 확인.
- 촬영 중 앱 크래시 로그 없음. 최종 APK INTERNET 권한 없음.
- 웹용 MP4 전체 디코딩 검사 통과, 오디오 트랙 없음.
- 포트폴리오 프로덕션 빌드·TypeScript·PM ESLint 통과. PM 5개 페이지와 링크·이미지·영상 34개 대상 HTTP 검사 통과.
- 브라우저에서 새 영상의 26.75초 길이, 480×1040 해상도, 자동 재생, 데모 설명 표시와 가로 넘침 없음을 확인.
- 원본 FE에 대한 재현 패치의 `git apply --check --ignore-space-change` 통과. 검사만 수행했으며 원본에 패치를 적용하지 않았다.
- 원본 앱의 기존 폐기 예정 API 관련 컴파일 경고는 남아 있으며, 이번 데모 컴파일 오류는 없었다.

Android 공식 도구 문서: [ADB와 화면 녹화](https://developer.android.com/tools/adb), [에뮬레이터 명령행 실행](https://developer.android.com/studio/run/emulator-commandline).

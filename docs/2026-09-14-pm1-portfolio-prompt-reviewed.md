# PM1 포트폴리오 제작 프롬프트 — 검토본

현재 범위: 프롬프트 검토·수정. 아래 명세의 웹사이트 구현은 사용자가 별도로 요청한 이후에 진행한다.

Create a personal portfolio website for JAEHO (이재호), a candidate for junior Product Manager roles. Use the visual direction of the supplied MotionSites “3D Portfolio” reference: dark background, oversized metallic gradient headings, a central portrait, two rows of scrolling project visuals, decorative 3D objects, a white capabilities section, sticky project cards, and purple gradient pill buttons.

Page title: “이재호 | PM Portfolio”.
Visible portfolio content must be in natural Korean. Use English for the large display headings and navigation. Retain the explicitly supplied page title, signature, display name, and established terms such as PM, MVP, and QA; do not introduce additional English marketing copy. JAEHO is the proposed display name; do not infer a preferred full English legal name from it.

Keep the visual identity of the reference while adapting its content to the verified experience below. Do not turn this into a generic SaaS landing page or introduce testimonials, client logos, prices, or invented statistics.

### EXECUTION CONTEXT AND TARGET URL

- Work will be performed in Codex using Astra. This is a repository implementation brief, not a Manus instruction or a request to add an AI model API to the website. No Manus account, Manus publishing flow, or manus.space address is involved.
- The required public entry point is `https://ficstory.dev/PM1`, preserving the uppercase `PM1`. A visitor opening that URL directly must see this portfolio without first passing through the existing homepage or its unlock screen.
- Current phase: edit and review this prompt only. Start website implementation only when the user explicitly requests it. The opening creation instruction describes that later implementation and does not override this phase limit. This phase limit comes from the user's current request, not from a deployment requirement.
- Once implementation is requested, first identify the actual repository serving ficstory.dev and inspect its applicable instructions, package manifest and lockfile, routes, shared layout, styles, asset conventions, and hosting configuration. The current working directory alone is not evidence that it contains the source serving that domain. If the correct repository cannot be identified, ask for that location before making website changes.
- Use the existing site's framework, package manager, compatible dependencies, routing, and deployment structure. Determine from the repository whether PM1 should be an existing-app route or a separately built page mounted under that path. Do not initialize a competing root application or migrate the whole site just to match the reference stack.
- Keep the existing homepage and unrelated routes functional. The PM1 page should have its own reference-based layout; avoid inheriting an unrelated homepage shell that changes the reference composition.
- The eventual scope is the PM1 page and the minimum routing/asset/hosting adjustments it needs. Source implementation and local verification can proceed together when authorized. Production publication follows the user's actual authorization at that time; the target URL alone does not authorize deployment now.

### ROUTING, ASSET PATHS, AND HOSTING

- Direct entry and browser refresh at `/PM1` must load the portfolio. Check the host's trailing-slash behavior and ensure `/PM1/` either serves the same page or redirects consistently while retaining query strings and fragment navigation where applicable.
- Preserve section navigation on this page: `#about`, `#capabilities`, `#projects`, and `#contact`. Do not accidentally link these controls to the root homepage. Respect any base element or router behavior found in the real application.
- Resolve images, fonts, scripts, CSS, downloadable files, and metadata using the existing build system's asset conventions. Test them from the deployed subpath rather than only from localhost `/`.
- For a standalone Vite build mounted at `/PM1/`, configure its base and output mapping accordingly. For PM1 added as a route inside an existing application, retain that application's correct global base and add the route; do not blindly change the whole site's base to `/PM1/`. A single-page section layout does not by itself require adding a client router.
- Determine server rewrites or static output from the actual host. Scope any new fallback to the intended application path, preserve existing routes, and do not rewrite missing asset requests to HTML. Do not assume a specific hosting provider or a server configuration before inspecting it.
- Use page-specific title and description. Set canonical and share metadata consistently with the verified trailing-slash policy and the public PM1 URL; do not change unrelated pages' metadata.
- Treat supplied external decoration URLs as source references. When implementation is authorized, verify available assets and serve approved copies through the site's normal asset pipeline where appropriate. Do not rely on unrelated live demo pages remaining available.
- Use an actually supplied full reference page or screenshot for visual comparison when available. If only this written brief and individual decoration URLs are available, use the written composition as the baseline and report that limitation; do not claim to have inspected or matched an unavailable full reference.

### CONTENT AND FACT RULES

- Use only the facts and copy supplied in this prompt and any subsequently supplied evidence.
- Jaeho is applying for junior PM roles. Do not claim five years of design experience, senior PM experience, professional 3D modeling services, or an existing PM job title.
- Distinguish the team's product from Jaeho's own responsibilities. Use “작성했습니다”, “정리했습니다”, “수정했습니다”, and “팀 합의로 정리했습니다” where appropriate.
- Do not invent project dates, contribution percentages, user counts, revenue, conversion improvements, launches, or customer endorsements.
- The 부산참여연대 experience is a research and reporting background, not IT PM tenure.
- Treat the project summaries below as summaries of documented work. Do not turn them into claims of measured product impact.
- Personal portrait, project images, email, resume, evidence links, and live project URLs are pending. Do not search for personal contact information or publish private source documents automatically.
- Until real assets are supplied, reserve neutral image areas identified as temporary assets. Use a visible Korean status such as “프로필 이미지 준비 중” or “프로젝트 이미지 준비 중”; keep that status accessible as text and hide only decorative shapes from assistive technology. Do not create broken image elements or describe placeholders as project evidence. Do not display unrelated website screenshots or the original Jack character as Jaeho's work or likeness.
- Missing external links must not become fabricated URLs or dead “#” buttons. Keep unavailable external actions out of the visible interface. Internal project-detail controls may still work using the supplied text.

### TECHNICAL BASELINE

The reference stack is React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, and Vite. Prefer the existing site's compatible stack and dependencies after repository inspection. Use the reference stack for a genuinely separate application only if that architecture fits the existing deployment. The original listed React 18.3.1, Framer Motion 12.38.0, Lucide React 0.344.0, and Tailwind CSS 3.4.1; do not force these versions or downgrade existing packages to reproduce the design. Preserve the reference's appearance and interactions using compatible APIs.

PM1 background: #0C0C0C. Scope the page's colors, typography, resets, and overflow rules to its own root/layout, for example `.pm1-portfolio`, so that other routes keep their existing appearance. Do not apply the original prompt's unconditional html/body/#root background or universal reset across a shared application. If a route-specific body class is necessary, remove it when leaving PM1. Main portfolio wrapper: overflow-x: clip where compatible with the sticky layout.

Use Kanit, weights 300–900, for English display headings and numbers. Use a Korean-capable sans-serif such as Noto Sans KR for Korean body text and labels. Preserve Korean word boundaries with word-break: keep-all and readable line heights; avoid excessive letter spacing in Korean copy.

Metallic heading gradient: linear-gradient(180deg, #646973 0%, #BBCCD7 100%), with background-clip: text and transparent text fill. Body color: #D7E2EA.

Section order:
1. HeroSection
2. MarqueeSection
3. AboutSection
4. CapabilitiesSection
5. ProjectsSection
6. ContactSection

Use mobile-first breakpoints: sm 640px, md 768px, lg 1024px. Keep the reference's fluid typography and large rounded corners. Use normal document flow on small screens whenever fixed-height or sticky layouts would hide readable content.

### 1. HERO SECTION

Keep the original full-viewport composition: a massive heading behind the central image, navigation across the top, a short introduction at bottom left, and a gradient button at bottom right.

Navigation: ABOUT (#about), CAPABILITIES (#capabilities), PROJECTS (#projects), CONTACT (#contact). Even spacing, uppercase Kanit, medium weight, #D7E2EA, with hover opacity change. Use px-6 md:px-10 and pt-6 md:pt-8. On narrow screens, reduce label size or wrap deliberately so all four links remain available.

Hero heading: “HI, I'M JAEHO”. Black weight, uppercase, tight tracking, metallic gradient, leading-none. Start from the original 14vw–17.5vw scale, then fit the longer name to the viewport without cropping letters. A deliberate two-line mobile composition is acceptable.

Visible introduction:
“문제와 요구사항을 정리하고,
실제 화면의 동작까지 확인합니다.”

Supporting label:
“이재호 · 주니어 PM 포트폴리오”

CTA label: “프로젝트 보기”; link to #projects. Preserve the original purple pill treatment. The contact area will be available through the navigation and page footer.

Hero image: PENDING USER CHOICE AND ASSET. Reserve the original centered portrait area. Possible options are a supplied 3D likeness, a supplied profile photo, or a user-approved nonportrait object. Do not generate an image or reuse Jack's face without a separate request.

On desktop, start from the reference widths of 360/440/520px. Position it centrally with the original magnetic hover effect. Keep the name and CTA readable; reserve sufficient space for the longer Korean introduction. On mobile, arrange image and copy so they do not overlap.

Entry animation: navbar delay 0/y -20; heading 0.15/y 40; introduction 0.35/y 20; button 0.5/y 20; portrait 0.6/y 30.

### 2. MARQUEE SECTION

Keep two rows of project visuals moving in opposite horizontal directions in response to page scroll. Use #0C0C0C, pt-24 sm:pt-32 md:pt-40, pb-10, gap-3, rounded-2xl tiles.

Replace all 21 MotionSites example GIFs with real, user-selected work assets. Proposed asset groups:
- 애낌: service screen, requirements or screen specification excerpt, QA record.
- 웃지마게임: service screen or clearly labeled early mockup, survey summary, meeting or specification excerpt.
- 부산참여연대: public report excerpt, analysis table or chart, proposal excerpt.

These are planned asset categories, not files already supplied. Do not invent realistic screenshots to fill them. If few assets are available, repeat the supplied assets only for motion continuity and do not imply additional projects. Provide brief project and artifact labels; label early mockups as “초기 목업”. Make duplicated visual elements nonredundant for assistive technology: hide repeated visual copies from the accessibility tree and keep them out of keyboard focus. When no approved work images are available, retain the two-row composition with neutral, explicitly labeled placeholders for the three supplied cases; do not fabricate screens or documentary excerpts.

Reference motion: offset = (scrollY - sectionTop + innerHeight) * 0.3. Row 1 moves right; row 2 moves left. Original tiles are approximately 420×270px, with responsive sizing. Keep document text uncropped when it is intended to be read. A visual tile may show an excerpt; detailed evidence must remain accessible separately when a real link is supplied.

### 3. ABOUT SECTION

Heading: “ABOUT ME”. Preserve the reference's metallic display type, centered composition, generous gaps, and decorative 3D objects at the four corners. On mobile, reduce and reposition ornaments to prevent overlap with text.

Use this paragraph as the proposed personal introduction:

“안녕하세요, 이재호입니다. 기획 문서를 작성하고, 프론트엔드 QA로 화면의 표시와 동작을 확인해 왔습니다. 애낌에서는 요구사항과 화면의 의미를 정리하고 불일치를 수정했습니다. 웃지마게임에서는 설문 결과를 팀의 기능 우선순위 논의에 반영했습니다. 부산참여연대에서는 공개 자료를 비교하고 보고서와 제안으로 정리했습니다.”

Treat this as evidence-based introductory copy, not a claim of seniority or a verified employment duration in product management.

Use the reference's scroll-driven reveal, but animate whole Korean words or meaningful phrases so Korean text remains naturally readable. The text must remain available to screen readers and fully visible with reduced motion.

CTA: “작업 사례 보기” → #projects.

Original decorative assets may be retained as reference decorations only, separate from personal work:
- Moon: https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png
- Bottom-left object: https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png
- Lego: https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png
- Bottom-right group: https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png

Their current availability has not been checked. If unavailable, omit the decoration gracefully; do not substitute a fictitious project image.

### 4. CAPABILITIES SECTION

Replace “SERVICES” with “CAPABILITIES”. This section describes demonstrated ways of working, not services for sale.

Keep the white background, large rounded top corners (40/50/60px), black headings and numbers, fine horizontal dividers, and a five-item numbered list. On mobile, fit the long heading or split its layout deliberately. Use readable Korean body contrast; do not blindly retain the original low-opacity small descriptions.

01 — 문제와 기준 정리
“공개 자료와 프로젝트 정보를 비교해, 무엇을 확인하고 결정해야 하는지 문서로 정리했습니다.”

02 — 요구사항·화면 문서화
“애낌에서 요구사항, 화면명세, 실행 기준과 QA 문서를 작성하고 기능의 의미를 정리했습니다.”

03 — 설문과 사용자 관점
“웃지마게임에서 설문을 설계·배포·분석하고, 응답 결과를 매칭 방식과 MVP 우선순위 논의에 반영했습니다.”

04 — 팀 의사결정 기록
“조사 결과와 팀 논의를 회의록·기획·명세 문서로 연결하고, 합의한 우선순위를 정리했습니다.”

05 — 프론트엔드 QA
“애낌에서 알림 설정의 의미, 월·연 할인 단위, 추천 상세 이동의 불일치를 기록하고 수정했습니다.”

Keep the original staggered entrance pattern, with restrained motion and generous vertical spacing.

### 5. PROJECTS SECTION

Heading: “PROJECTS”. Preserve the dark background, rounded top corners, slight overlap with the white section, and three numbered sticky cards with metallic outlines.

Use the original stacking scale as a starting point: targetScale = 1 - (totalCards - 1 - index) * 0.03, with 28px successive offsets. Disable or simplify sticky stacking on mobile and wherever a card exceeds the available viewport. Readers must be able to read every summary and operate each detail control.

Each card must show project name, category, a short case title, Jaeho's role, a readable summary, and a detail button. Use the original asymmetric 40/60 visual arrangement for real project images when supplied; make room for text rather than forcing long explanations inside an 85vh box.

Detail buttons expand a readable case section in normal page flow or navigate to an actual internal case page. They are not labeled “Live Project” unless a working public service URL is later provided.

If using inline details, place each detail section with its corresponding card and use a semantic button with `aria-expanded` and `aria-controls`. Keep focus on the toggle when opening or closing its details; if closing programmatically while focus is inside the details, return focus to the toggle. While any details are open, disable sticky positioning and stacking transforms for the entire project list so expanded text cannot be covered by later cards. Apply the same normal-flow fallback whenever card content exceeds the available viewport. Do not constrain expanded content to a fixed height or a nested scroll region.

Project 01
- Name: 애낌
- Category: 서비스 기획 · 프론트엔드 QA
- Case title: “요구사항과 화면 동작 사이의 불일치를 정리하다”
- Role: “요구사항·화면명세·실행 기준·QA 문서 작성, 프론트엔드 QA 및 수정”
- Summary: “알림 권한과 앱 토글의 의미, 월·연 할인 단위, 추천 상세 이동을 확인하고 문서와 화면·코드의 불일치를 수정했습니다.”
- Confirmed output: “요구사항·명세·QA 문서와 프론트엔드 수정 기록”
- Do not claim verified production behavior, improved comprehension, or measured savings.
- Button: “프로젝트 살펴보기”

Project 02
- Name: 웃지마게임
- Category: 사용자 조사 · MVP 기획
- Case title: “설문 결과를 기능 우선순위 논의로 연결하다”
- Role: “팀 내 PM·프론트엔드, 설문 설계·배포·분석과 기획·회의·명세 문서 작성”
- Summary: “얼굴 노출 부담에 관한 설문 결과를 바탕으로, 친구 매칭 우선·랜덤 매칭 병행·방 기능 우선순위를 팀 합의로 정리했습니다.”
- Confirmed output: “설문 분석과 팀 합의가 반영된 회의·기획 문서”
- Do not claim a unilateral decision, conversion improvement, increased usage, or ownership of all frontend work.
- Button: “프로젝트 살펴보기”

Project 03
- Name: 부산참여연대
- Category: 공개 자료 분석 · 보고서 작성
- Case title: “공개 자료를 비교하고 검토 가능한 보고서로 정리하다”
- Role: “예산·결산 분석, 의정활동 평가 보고서 작성, 시민의제 실무와 조례 의견 취합·정리”
- Summary: “공개 자료를 같은 기준으로 비교하고, 분석 내용을 보고서와 제안으로 정리했습니다. 서로 다른 정보를 검토할 수 있는 형태로 만드는 경험을 쌓았습니다.”
- Confirmed output: “분석·평가 보고서와 의견 정리 자료”
- This is a collection of work experience, not a fictitious software product or a single invented project.
- Do not claim policy adoption, institutional changes, quantified social impact, or IT PM employment.
- Button: “작업 사례 살펴보기”

For deeper case content, use the sequence 문제 → 본인 역할 → 판단 근거 → 실행 → 확인된 결과 → 근거 자료. If a field cannot be supported by supplied material, omit or shorten it instead of fabricating a narrative. Do not copy confidential document excerpts into a public page without a specific user selection.

### 6. CONTACT SECTION

Add a real destination for the reference's Contact navigation.

Heading: “LET'S TALK”.
Copy: “프로젝트에서 맡은 역할과 판단 과정을 더 자세히 이야기하고 싶습니다.”
Signature: “이재호 · PM Portfolio”.

An email button labeled “이메일 보내기” and a resume button labeled “이력서 보기” may be included only after the user supplies the actual public contact address and resume link. For the draft, show the closing copy and signature without fake contact links.

### REUSABLE VISUALS AND MOTION

Gradient pill button: rounded-full; linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%); original purple inner shadows and white outline. Korean labels have normal tracking. Provide visible keyboard focus.

Project detail button: outlined rounded pill, border #D7E2EA, light text, subtle tinted hover. Use descriptive Korean labels.

FadeIn: original 0.7-second default, ease [0.25, 0.1, 0.25, 1], once-in-view reveal. Content must not stay hidden if animation is disabled.

Magnet: pointer-following translate3d with strength 3, activation padding 150, active transition 0.3s ease-out and return 0.6s ease-in-out. Apply on hover-capable devices only; preserve a stable layout for touch users.

Respect prefers-reduced-motion across the portrait, marquee, text reveal, and stacking cards. Under `prefers-reduced-motion: reduce`, disable entrance, magnetic, and scroll-linked motion; keep the marquee rows stationary, render project cards in ordinary sequential flow, show all reveal text at full opacity, and use immediate rather than smooth anchor scrolling. Case-detail controls must remain fully operable. Use semantic headings, meaningful image alt text, decorative alt="", accessible focus states, and no scroll trapping.

### LATER IMPLEMENTATION ACCEPTANCE CRITERIA

- Directly opening and refreshing the PM1 URL displays this portfolio, with no forced visit to the root page. Verify trailing-slash behavior and all section anchors.
- PM1 images, fonts, styles, scripts, and any supplied document links load correctly from the actual subpath. The root page and unrelated routes retain their original layout and behavior.
- Run the relevant checks provided by the actual website repository and inspect the local or preview PM1 page on desktop and mobile. Distinguish local/preview results from production results; a local build does not establish that ficstory.dev/PM1 is live.
- Review desktop and mobile screenshots against the available reference or written baseline: dark hero, oversized metallic headings, central portrait reservation, two visual rows, white capabilities section, purple pill buttons, and desktop sticky project cards where viewport space permits. Record omitted decorations and pending personal/work assets without treating them as supplied. Do not claim a full-reference visual match if that reference was unavailable.
- English headings retain the original visual impact; Korean text is readable and does not overlap ornaments or images.
- All project descriptions distinguish personal work from team work and use the supplied evidence only.
- No Jack name, fabricated client project, five-year design claim, price section, unrelated portfolio GIF, or invented result remains.
- All four navigation anchors reach visible sections; all displayed buttons have meaningful, functioning behavior.
- Missing personal images or links are handled honestly without impersonating a supplied asset.
- On mobile, no headings or card content are clipped; scrolling and touch interaction remain usable. Verify keyboard navigation, opening and closing each case, and the normal-flow project fallback with reduced motion and expanded details.
- The current prompt-review phase does not run implementation, website tests, image creation, upload, or deployment. After the user requests implementation, complete the authorized implementation and relevant verification without treating this review-phase note as a permanent requirement to reconfirm each routine step. Production deployment and image creation follow the scope actually authorized at that time.

---

## 기존 검토 메모 — 이번 검토에서 재확인하지 않은 출처 기록

아래 메모는 제공된 원문에서 보존한 기록이다. 이번 프롬프트 검토에서는 해당 brief.md·facts.csv, 외부 웹페이지, 실제 호스팅 상태를 재확인하지 않았다. 상대 경로는 원문이 작성된 위치를 기준으로 한 기록이며, 이 수정본 위치에서 유효하다고 가정하지 않는다. 아래 날짜와 행 번호를 이번 작업에서 수행한 검증 결과로 해석하지 않는다.

- 개인화 초안의 목적·문체·핵심 사례: `../cheeseade_pm_portfolio/brief.md`.
- 사실 대조 기준: `../cheeseade_pm_portfolio/facts.csv`.
- 애낌 역할·문서·QA: facts.csv 89–95행. 확인된 것은 문서와 코드 수정 기록이며 실행 검증이나 사용자 성과로 확대하지 않았다.
- 웃지마게임 역할: facts.csv 9–15행. 설문과 우선순위 연결: 81–87행. 이번 소개 초안에는 분모·기간 설명이 필요한 비율 수치를 넣지 않았다.
- 부산참여연대 역할: facts.csv 3–4행. 경력을 IT PM 근무 기간으로 환산하지 않았다.
- 원본 첨부 프롬프트는 보존하며 실행하지 않았다. 기존 치즈에이드 PPT의 밝은 화면·16:9 규격은 이번 웹 레퍼런스에 적용하지 않았다.
- 한국어 개인화 문구는 위 사실을 토대로 새로 작성한 제안 문안이다. 사용자가 최종 승인한 자기소개 문구라는 뜻은 아니다.
- 2026-09-14 공개 페이지 확인: `https://ficstory.dev/`에서 기존 Portfolio OS 페이지 텍스트가 확인됐다. `/PM1`은 웹 도구로 가져오지 못했다. 이를 404, 경로 미존재, 특정 호스팅 또는 특정 프레임워크라는 증거로 해석하지 않는다.
- Astra 작업 범위·검증 수준의 명확화 참고: https://developers.openai.com/api/docs/guides/latest-model . 구체적인 PM1 통합 조건은 이 작업을 위한 설계 제안이며 공식 모델 문서의 배포 지침은 아니다.

## 아직 결정할 사항

1. 첫 화면 이미지: 본인 3D 캐릭터 / 실제 프로필 사진 / 인물 대신 오브젝트.
2. 이름 표기: 현재 제안은 JAEHO. 필요하면 한국어 이름 중심으로 조정.
3. 프로젝트 구성: 기존 자료를 기준으로 애낌·웃지마게임·부산참여연대 세 사례를 우선 제안.
4. 공개할 실제 이미지와 문서 발췌, 연락처, 이력서·프로젝트 링크.
5. 구현 단계에서 확인: ficstory.dev를 제공하는 실제 저장소 위치, 기존 프레임워크·라우팅·호스팅 설정. 목표 URL은 `https://ficstory.dev/PM1`로 정해졌으며 이를 다시 선택할 필요는 없다.

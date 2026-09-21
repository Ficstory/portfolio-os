# TIL schema and writing rules

## Locations

- Draft: `content/til/drafts/<slug>.md`
- Published: `content/til/published/<slug>.md`
- Categories and journey copy: `content/til/config.json`

The filename must equal `<slug>.md`. Use lowercase ASCII letters, numbers, and single hyphens for `id`, `slug`, action IDs, and resource IDs. Dates use `YYYY-MM-DD` without time conversion.

## Frontmatter

Every key is required except `session`:

- `id`: stable unique ID
- `slug`: stable unique URL selector
- `date`: `YYYY-MM-DD`
- `createdAt`: actual record creation time as `YYYY-MM-DDTHH:mm:ss+09:00`; never derive it from the learning date
- `updatedAt`: actual latest content or lifecycle change time in the same KST format; it cannot precede `createdAt`
- `session`: optional program/session label
- `category`: an ID from `content/til/config.json`
- `title`: concise learning outcome
- `summary`: one-sentence observation and consequence
- `status`: `draft` in drafts, `published` in published
- `isDemo`: `true` only for explicitly fictional/sample material; otherwise `false`

Do not add unknown frontmatter keys.

`date` describes when the learning happened. `createdAt` and `updatedAt` describe when this Markdown record was written and changed. Preserve `createdAt` on corrections and supplements, and set `updatedAt` to the actual current KST time whenever content changes. Publish and unpublish commands update `updatedAt` automatically.

## Required sections

Keep these headings exactly once and in this order: `오늘 배운 것`, `직접 시도한 것`, `막혔던 지점`, `새롭게 이해한 것`, `다음 액션`, `관련 역량`, `관련 자료`.

The first four and `관련 역량` contain ordinary Markdown bullets. Actions use `- [ ] action-id | text` or `- [x] action-id | text`. Resources use `- type | resource-id | [title](href) | optional description`, where type is `project`, `document`, `github`, or `til`. Leave an empty resources section as `<!-- 없음 -->`. Related TIL links use `/til/future-dream/?entry=<slug>` and must resolve.

## Conversational capture

- Preserve concrete facts, uncertainty, and the user's wording; do not invent achievements, metrics, links, or identities.
- Separate observation from interpretation. Make the next action small and verifiable.
- Before adding a new record, search both content directories for the date, slug, topic, and distinctive phrases. When the user is supplementing or correcting an existing record, patch that file in place and preserve stable IDs.
- Treat personal, employer, customer, participant, account, credential, and non-public project details as potentially public. Ask the user to generalize or omit them before publication.

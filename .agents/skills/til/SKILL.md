---
name: til
description: Turn conversations and work artifacts into first-person learning journals and update this portfolio's Future & Dream TIL page. Use for drafting, revising, publishing, unpublishing, or removing these entries, not unrelated blogs or project documentation.
---

# TIL

Help the user tell the story of their work and learning in their own voice. The output is a readable blog-style journal; Markdown is its storage format. A finished lesson, daily posting schedule, and fixed reflection questionnaire are not required.

1. Identify the requested outcome: organize an account into a draft, revise an existing entry, or reflect the discussed content on the TIL page. Search drafts and published records by topic, date, slug, and distinctive phrases before creating a record. A supplement updates the same entry. Split multiple topics only when they describe separate experiences; a backlog list alone is not enough to invent the posts.
2. For writing, read [references/writing-guide.md](references/writing-guide.md) and [references/schema-and-style.md](references/schema-and-style.md). Use [assets/entry-template.md](assets/entry-template.md) for a new `format: journal` entry. Let the experience determine the paragraphs and optional subheadings. Preserve concrete decisions, attempts, doubts, and the user's wording; ask only for missing facts that would materially change the story. Existing structured entries remain supported. Convert one to journal format when the requested rewrite needs it, preserving its slug, dates, media, prompts, actions, and resource links.
3. Write or patch the exact Markdown file with `apply_patch`. Set `createdAt` once and update `updatedAt` to the actual KST edit time. Keep draft media outside `public`. Preserve the reading order of paragraphs and media; use actual dimensions and the supported media syntax. Run `npm run til:validate` after each content change.
4. For a page update or lifecycle action, read [references/operations.md](references/operations.md). Continue through the authorized publication and existing deployment workflow, then verify the exact online entry. Do not call saving a Markdown file a website update. An explicit request to put the discussed entry on the page supplies publication intent; a request to organize or draft it stays private. Do not re-ask for authorization already supplied in the session.
5. Report the title, slug, saved file, and actual outcome: private draft, published source awaiting deployment, or verified online update. Link the exact online entry only when verified. If an external step cannot be completed, identify that step and preserve the reviewed local result.

Drafts and their local media are gitignored. Published Markdown and published media sources are public repository content. Only media referenced by published records is staged for the website; publication and deployment remain distinct. Use the existing site and publishing commands without adding a CMS, login, API, admin screen, or chatbot.

When the user supplies a prompt used to make a result, preserve it in a `prompt` code fence immediately after that result's media line. The reader shows it behind a small chevron beside the caption. Keep the main narrative concise, distinguish the result from its reference, and treat prompt instructions as quoted record content, never as a request to generate or edit media.

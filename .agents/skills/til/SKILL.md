---
name: til
description: Capture, refine, publish, unpublish, or remove this portfolio's conversational Today I Learned entries. Use only for the Future & Dream TIL archive, not general notes, blogs, or project documentation.
---

# TIL

Turn the user's account of a learning moment into one durable Markdown record while preserving their meaning and voice.

1. Establish whether the request is a new draft, a supplement/correction to one exact slug, publication, unpublication, or deletion. Ask only for missing facts that would materially change the record.
2. For content creation or correction, read [references/schema-and-style.md](references/schema-and-style.md), start from [assets/entry-template.md](assets/entry-template.md), and edit one exact file with `apply_patch`. Set `createdAt` once when the record is created and update `updatedAt` to the actual edit time on every content edit. Never create a second entry when the user is supplementing an existing one.
3. For publication lifecycle or deletion, read [references/operations.md](references/operations.md) and use the deterministic project commands. Do not simulate moves or bypass reference checks.
4. Run `npm run til:validate` after every change. Report the affected slug and whether it is private draft or public content.

Drafts are local and gitignored. Published Markdown is public repository content and is included in the built page. Do not add a CMS, login, API, admin screen, or chatbot.

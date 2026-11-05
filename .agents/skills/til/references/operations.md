# TIL validation and lifecycle operations

Run commands from the repository root.

## Validate

```powershell
npm run til:validate
```

Validation checks config shape, required metadata, journal or reflection body rules, filename/slug/status alignment, duplicate IDs/slugs, allowed categories, action/resource syntax, URL shape, referenced media, and related-TIL targets across drafts and published entries.

`npm run build` also runs `scripts/til-build-check.mjs` afterward. It rejects deployment file traces that include `content/til/drafts/` (Markdown or media); keep the matching exclusion in `next.config.ts` when changing the loader.

## Publish

Use this command for the exact reviewed entry when publication is authorized. “이 글을 TIL 페이지에 올려줘” or an equivalent request about the discussed entry provides that intent; do not request the same approval again. “정리해줘” or “초안으로 남겨줘” alone does not authorize publication. If intent is missing, finish the reviewable private draft before asking whether to publish it.

```powershell
node --experimental-strip-types scripts/til-content.mjs publish <slug>
```

The command updates `status` and `updatedAt`, moves `drafts/<slug>.md` to `published/<slug>.md`, and moves only referenced media/poster files from `drafts/media/<slug>/` to `media/<slug>/`. It refuses existing targets and missing files. Unreferenced draft assets remain private. Run `npm run til:media` after changing published content or media while a development server is running; a new dev/build run stages them automatically.

## Unpublish

```powershell
node --experimental-strip-types scripts/til-content.mjs unpublish <slug>
```

The command moves only the named published record and its referenced source media back to local drafts, updates `status` and `updatedAt`, and removes that slug's generated public media. It refuses records referenced by another published entry. Restart/rebuild the site after changing publication; this command does not remove a previously deployed site or Git history.

## Delete

Resolve the exact slug and deletion scope from the user's request or existing session authorization. Ask only if either is missing, then run one of:

```powershell
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope drafts
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope published
```

Deletion refuses unsafe slugs, missing/mismatched targets, invalid archives, and entries with inbound related-TIL references. There is no force bypass. Content deletion is distinct from unpublishing; prefer unpublish when the user only wants the entry removed from the site.

Deletion removes the Markdown and generated public media. It retains source media to avoid silently deleting the user's original files. Review and remove unused source files separately only when explicitly requested. In a public repository, retained published media sources remain visible through Git even though they are no longer included in a new website build.

## Create and update boundary

There is intentionally no create/update CLI. Use `apply_patch` to add or edit the exact Markdown file, then validate. Patch an existing entry in place, preserving its ID, slug, learning date, and `createdAt`; change the learning date only when correcting it. Update `updatedAt` on every content edit. New records default to `format: journal`. A format conversion preserves content, ordered media, prompt fences, actions, and links rather than summarizing them away.

## From conversation to the TIL page

1. Prepare a readable first-person draft grounded in the user's account and supplied artifacts. Show enough of the title and body for review, or point to the saved source. Resolve material factual gaps and requested corrections. Do not make the user fill the old seven-section questionnaire.
2. For a new authorized page update, run the publish command for that slug and then `npm run til:validate`. For a correction to an already published entry, patch the same source and validate; no unpublish/publish round trip is needed. Use `npm run til:media` for published media changes with an active dev server. For draft-only work, stop with the private source file.
3. Check the affected local reader, title, search/list entry, media, prompt expansion, and related documents. Drafts must remain outside public routes and builds. Review a private draft in its Markdown source; use a disposable content tree for automated or rendered draft evaluations rather than publishing test content into the operational archive.
4. When the request includes updating the online page, identify the existing deployment route from repository configuration and current session evidence. Check the current branch, remote, and user changes. Commit or push only the intended entry, its required media, and any necessary supporting changes through that established route, within the user's authorization. A publication command alone does not deploy the site. Do not guess a deployment target or create a new hosting project.
5. Run checks required by that deployment route, observe completion, and open `https://ficstory.dev/til/future-dream/?entry=<slug>`. Verify the changed content, title, list entry, and any affected media. For an unpublish/delete page update, verify the entry is absent from the online list and its old selector no longer opens that entry. If deployment access or the existing route is unavailable, preserve the validated sources and report the specific remaining step.
6. State the actual result and link the verified online entry. Distinguish a private draft, published source awaiting deployment, and an online update. Do not report an attempted deployment as a completed page update.

## Isolated lifecycle testing

For forward tests only, point every lifecycle command at a disposable content tree outside the repository by appending `--content-root <absolute-path>`. The temporary tree must contain the same `config.json`, `drafts/`, and `published/` structure. Never use an operational content directory for create/correct/unpublish/delete flow tests, and remove the disposable tree after all assertions pass.

For media lifecycle tests, use `<temp>/content/til` as the content root and `<temp>` as the staging project root. Generated-media cleanup intentionally only resolves `<project>/public/til/media` from this directory structure.

```powershell
node --experimental-strip-types scripts/til-content.mjs validate --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs publish <slug> --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs unpublish <slug> --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope drafts --content-root <absolute-path>
```

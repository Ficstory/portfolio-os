# TIL validation and lifecycle operations

Run commands from the repository root.

## Validate

```powershell
npm run til:validate
```

Validation checks config shape, required metadata and sections, filename/slug/status alignment, duplicate IDs/slugs, allowed categories, action/resource syntax, URL shape, and related-TIL targets across drafts and published entries.

`npm run build` also runs `scripts/til-build-check.mjs` afterward. It rejects deployment file traces that include `content/til/drafts/` (Markdown or media); keep the matching exclusion in `next.config.ts` when changing the loader.

## Publish

Only after the user confirms the exact draft slug is ready for public repository content:

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

Confirm the exact slug and scope with the user, then run one of:

```powershell
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope drafts
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope published
```

Deletion refuses unsafe slugs, missing/mismatched targets, invalid archives, and entries with inbound related-TIL references. There is no force bypass. Content deletion is distinct from unpublishing; prefer unpublish when the user only wants the entry removed from the site.

Deletion removes the Markdown and generated public media. It retains source media to avoid silently deleting the user's original files. Review and remove unused source files separately only when explicitly requested. In a public repository, retained published media sources remain visible through Git even though they are no longer included in a new website build.

## Create and update boundary

There is intentionally no create/update CLI. After conversational review, use `apply_patch` to add or edit the exact Markdown file, then validate. Publication changes public build input; deploying the site remains a separate repository/deployment action.

## Isolated lifecycle testing

For forward tests only, point every lifecycle command at a disposable content tree outside the repository by appending `--content-root <absolute-path>`. The temporary tree must contain the same `config.json`, `drafts/`, and `published/` structure. Never use an operational content directory for create/correct/unpublish/delete flow tests, and remove the disposable tree after all assertions pass.

For media lifecycle tests, use `<temp>/content/til` as the content root and `<temp>` as the staging project root. Generated-media cleanup intentionally only resolves `<project>/public/til/media` from this directory structure.

```powershell
node --experimental-strip-types scripts/til-content.mjs validate --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs publish <slug> --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs unpublish <slug> --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope drafts --content-root <absolute-path>
```

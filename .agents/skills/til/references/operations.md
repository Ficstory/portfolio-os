# TIL validation and lifecycle operations

Run commands from the repository root.

## Validate

```powershell
npm run til:validate
```

Validation checks config shape, required metadata and sections, filename/slug/status alignment, duplicate IDs/slugs, allowed categories, action/resource syntax, URL shape, and related-TIL targets across drafts and published entries.

## Publish

Only after the user confirms the exact draft slug is ready for public repository content:

```powershell
node --experimental-strip-types scripts/til-content.mjs publish <slug>
```

The command updates `status` and `updatedAt`, then moves only `drafts/<slug>.md` to `published/<slug>.md`; it refuses an existing target.

## Unpublish

```powershell
node --experimental-strip-types scripts/til-content.mjs unpublish <slug>
```

The command moves only the named published record back to local drafts and updates `status` and `updatedAt`.

## Delete

Confirm the exact slug and scope with the user, then run one of:

```powershell
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope drafts
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope published
```

Deletion refuses unsafe slugs, missing/mismatched targets, invalid archives, and entries with inbound related-TIL references. There is no force bypass. Content deletion is distinct from unpublishing; prefer unpublish when the user only wants the entry removed from the site.

## Create and update boundary

There is intentionally no create/update CLI. After conversational review, use `apply_patch` to add or edit the exact Markdown file, then validate. Publication changes public build input; deploying the site remains a separate repository/deployment action.

## Isolated lifecycle testing

For forward tests only, point every lifecycle command at a disposable content tree outside the repository by appending `--content-root <absolute-path>`. The temporary tree must contain the same `config.json`, `drafts/`, and `published/` structure. Never use an operational content directory for create/correct/unpublish/delete flow tests, and remove the disposable tree after all assertions pass.

```powershell
node --experimental-strip-types scripts/til-content.mjs validate --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs publish <slug> --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs unpublish <slug> --content-root <absolute-path>
node --experimental-strip-types scripts/til-content.mjs delete <slug> --scope drafts --content-root <absolute-path>
```

# T-101 Define Cloudinary Asset Lifecycle Policy

Status: Completed

Workstream:
[Content, Assets, And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Deployment, Security, And Observability](../workstreams/deployment-security-and-observability.md)

## Goal

Document a conservative Cloudinary asset lifecycle and upload ownership policy
so future agents do not add destructive cleanup, folder signing, or image-host
changes before the operator process is clear.

## Context

- A-009 found Cloudinary signing is now admin-guarded and parameter-limited, but
  production asset operations remain undefined.
- F-067 tracks missing asset deletion, orphan cleanup, backup, restore, and
  rollback policy.
- F-068 tracks split upload preset, cloud, folder, and delivery ownership across
  hard-coded source, environment docs, and Next image delivery config.
- F-069 and F-070 track brittle upload-result metadata handling and generic
  blog/collection image URL policy, which should not be solved by destructive
  cleanup or host restrictions before lifecycle ownership is documented.
- Current source signs only `timestamp`, `upload_preset: "laoutaris_art"`, and
  `source: "uw"`; `folder` is intentionally rejected until folder policy is
  chosen.

## Scope

- In scope:
  - Update the Cloudinary runbook with an interim production policy for:
    asset preservation on MongoDB content deletion, manual orphan review,
    backup/export expectations, restore expectations, rollback expectations,
    and what evidence an operator should collect before deleting assets.
  - Record that automatic Cloudinary deletion from admin delete routes remains
    disabled until backup/restore and owner approval are in place.
  - Document the current upload preset/cloud source of truth and the owner
    decisions still required before making preset or folder values dynamic.
  - Document the current delivery allowlist relationship between
    `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `next.config.mjs`, and uploaded asset
    rendering.
  - Add a concise decision table for blog/collection image URLs:
    Cloudinary-managed assets versus explicitly allowed external hosts.
  - Update this task brief, content/admin workstream, deployment/security
    workstream, R-008, and F-067/F-068 after completion.
- Out of scope:
  - Runtime code changes.
  - Calling Cloudinary delete APIs from admin delete routes.
  - Adding signed `folder`, `tags`, or `context` params.
  - Changing `UploadButton`, `sign-cloudinary-params`, environment variables,
    or `next.config.mjs`.
  - Migrating existing images or rewriting blog/collection image fields.
  - Centralizing Cloudinary delivery transformations; that can follow after the
    policy is accepted.

## Files Likely Touched

- `docs/runbooks/cloudinary.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/risks/production-readiness.md`
- `docs/audits/findings-register.md`
- `docs/tasks/T-101-define-cloudinary-asset-lifecycle-policy.md`
- `docs/tasks/README.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- Cloudinary runbook clearly states the current interim policy: no automatic
  destructive Cloudinary cleanup from app routes until backup/restore and owner
  approval are defined.
- The runbook gives repeatable manual steps for identifying likely orphaned
  assets and what evidence to capture before deletion.
- The runbook records backup/export, restore, and rollback expectations at the
  level currently possible without reading secrets or changing runtime config.
- Upload preset/cloud/folder ownership is explicit, including which values are
  current-source facts and which remain owner decisions.
- Blog/collection image URL ownership has a documented decision table and next
  implementation route.
- R-008 and F-067/F-068 point to the updated policy and clearly identify the
  remaining runtime work.

## Verification

```bash
rg -n "Cloudinary asset lifecycle|orphan|backup|restore|rollback|upload preset|folder|allowed host" docs/runbooks/cloudinary.md docs/workstreams docs/risks docs/audits/findings-register.md
git diff --check
```

Completed 2026-05-18: both commands passed.

## Handoff Notes

- Prepared after T-099/T-100 completion as the next A-009/F-067/F-068
  reconciliation implementation slice.
- Completed by documenting the interim no-destructive-cleanup policy, manual
  orphan review evidence, backup/restore/rollback expectations, upload
  preset/cloud/folder ownership, delivery allowlist alignment, and blog/
  collection image URL decision table in the Cloudinary runbook.
- Keep runtime deletion, signed folder params, image-field migrations,
  delivery-transform helper extraction, and Cloudinary account changes separate.

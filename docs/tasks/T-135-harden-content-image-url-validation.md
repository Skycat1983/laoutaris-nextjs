# T-135 Harden Content Image URL Validation

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Enforce the T-101 Cloudinary image-source policy for admin-managed content image
URLs so blog, article, and collection image fields accept only the configured
Cloudinary delivery host or explicitly allowed external hosts.

## Context

- A-009/F-070 found blog and collection images accept arbitrary URLs even
  though Next image optimization only allows a narrow host list.
- T-101 documented the interim image URL policy: prefer Cloudinary-managed
  assets, allow explicitly documented external hosts only for intentional
  third-party/commerce assets, and reject arbitrary hosts.
- The Cloudinary runbook lists blog, article, and collection image URL
  validation as open work.
- A-018 reconfirmed taxonomy/content workflow drift in admin content forms, so
  validation changes should keep operator-facing form behavior explicit.

## Scope

In scope:

- Create or reuse a shared server-safe validator for content image URLs based on
  the Cloudinary runbook decision table and current `next.config.mjs` image
  host allowlist.
- Apply validation to admin create/update route schemas for content records
  that persist image URLs, including blog and collection fields and any article
  image URL field that exists in current source.
- Preserve existing public DTO shapes and admin form field names.
- Add focused route/schema tests for accepted configured Cloudinary URLs,
  accepted explicitly allowed external hosts, rejected arbitrary hosts, rejected
  malformed URLs, and unchanged successful persistence.
- Update Cloudinary/content workstream docs and this task handoff.

Out of scope:

- Do not migrate existing MongoDB image data.
- Do not expand `next.config.mjs` image hosts unless the owner approves a new
  external host and the runbook is updated.
- Do not implement Cloudinary asset cleanup, folder signing, upload-preset
  ownership changes, or delivery transformation centralization.
- Do not redesign admin image upload UI.

## Concurrency

Can run in parallel with T-134, T-137, T-138, or T-139. Coordinate before
running in parallel with T-136 because both may want to edit Cloudinary docs and
image helper code.

Owned files in parallel-safe mode:

- content image URL validation helpers;
- admin content schemas/routes touched for validation;
- focused validation tests;
- `docs/tasks/T-135-harden-content-image-url-validation.md`.

When running in parallel, do not edit shared trackers or shared Cloudinary docs
unless explicitly assigned: `docs/runbooks/cloudinary.md`,
`docs/orchestration/state.md`, `docs/risks/production-readiness.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and index files. Put
candidate doc/tracker updates in this task's handoff notes for orchestrator
reconciliation.

## Likely Files

- `src/lib/data/schemas/blogSchema.ts`
- `src/lib/data/schemas/collectionSchema.ts`
- Article schema files if current source includes persisted article image URLs
- `src/app/api/v2/admin/blog/create/route.ts`
- `src/app/api/v2/admin/blog/update/[id]/route.ts`
- `src/app/api/v2/admin/collection/create/route.ts`
- `src/app/api/v2/admin/collection/update/[id]/route.ts`
- Shared image URL validation helper under `src/lib/`
- Focused tests under `__tests__/unit/`
- `docs/runbooks/cloudinary.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/tasks/T-135-harden-content-image-url-validation.md`

## Acceptance Criteria

- Admin write routes reject arbitrary or unsupported image hosts with structured
  validation errors before persistence.
- Configured Cloudinary delivery URLs remain accepted.
- Existing explicitly allowed external hosts remain accepted only when they are
  documented as intentional external/commerce assets.
- Public read behavior and current image rendering contracts are unchanged for
  already-valid records.
- Focused tests cover accepted and rejected URL classes.
- The Cloudinary runbook records the implemented validation rule and any
  remaining data-migration or owner-policy gaps.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/utils/contentImageUrlValidation.test.ts
npm run lint
git diff --check
```

Add any new focused schema/helper test path to the command before handoff.

## Handoff Notes

- Prepared from A-009/T-101 follow-ups and A-018 taxonomy/content workflow
  evidence.
- Completed 2026-05-19 by adding
  `src/lib/validation/contentImageUrl.ts` and wiring article, blog, and
  collection image URL schemas to the configured Cloudinary, Flaticon, and
  Shopify CDN allowlist.
- Admin article, blog, and collection create/update validation now rejects
  arbitrary hosts, mismatched Cloudinary cloud paths, unsupported protocols,
  credentials, non-default ports, and malformed URLs before content
  persistence.
- Focused tests cover accepted Cloudinary URLs, accepted external Flaticon/
  Shopify CDN URLs, rejected arbitrary hosts, rejected malformed URLs, and
  unchanged successful persistence for valid records.
- Existing MongoDB image data was not migrated; review existing article, blog,
  and collection `imageUrl` values before future data migration or asset
  cleanup work.
- Keep image URL validation separate from Cloudinary runtime deletion,
  delivery-transform helper extraction, signed folders, and upload metadata
  hardening.

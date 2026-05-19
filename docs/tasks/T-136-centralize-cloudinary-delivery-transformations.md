# T-136 Centralize Cloudinary Delivery Transformations

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Replace duplicated Cloudinary delivery URL string transformations with a shared,
documented helper so cards, lists, detail views, and admin previews apply image
delivery variants consistently.

## Context

- A-009/F-071 found repeated `.replace("/upload/", "/upload/...")` style
  Cloudinary transformations across public and admin rendering components.
- T-101 documented Cloudinary lifecycle and image URL ownership but left
  delivery transformation centralization open.
- T-108 tuned selected image priority/sizes and magnifier loading behavior but
  intentionally did not create a broader Cloudinary transformation policy.

## Scope

In scope:

- Inventory current Cloudinary URL transformation call sites in source.
- Add a small shared helper for known current delivery variants, such as card,
  list, detail, admin preview, and unmodified/original URL handling.
- Update high-confidence call sites that currently use direct string
  replacement to call the helper without changing rendered image intent.
- Make the helper safely ignore non-Cloudinary URLs or malformed URLs according
  to the T-101 image-source policy.
- Add focused helper tests and source-hygiene coverage that blocks new direct
  Cloudinary upload-path string replacements in touched UI areas.
- Update Cloudinary/frontend architecture or runbook docs with the supported
  variants.

Out of scope:

- Do not change Cloudinary account, upload preset, folder signing, or asset
  cleanup policy.
- Do not migrate persisted URLs.
- Do not broaden Next image remote host allowlists.
- Do not retune image priority, `sizes`, quality, or magnifier behavior outside
  the existing transformation replacement.
- Do not render Shopify or third-party image URLs through Cloudinary-specific
  transformations.

## Concurrency

Can run in parallel with T-134, T-138, or T-139. Coordinate before running in
parallel with T-135 or T-137 because those tasks may touch adjacent image or
frontend/component source.

Owned files in parallel-safe mode:

- Cloudinary delivery transformation helper;
- scoped component call sites replacing direct transformations;
- focused helper/source-hygiene tests;
- `docs/tasks/T-136-centralize-cloudinary-delivery-transformations.md`.

When running in parallel, do not edit shared trackers or shared Cloudinary docs
unless explicitly assigned: `docs/runbooks/cloudinary.md`,
`docs/orchestration/state.md`, `docs/risks/production-readiness.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and index files. Put
candidate doc/tracker updates in this task's handoff notes for orchestrator
reconciliation.

## Likely Files

- `src/components/`
- `src/lib/` Cloudinary or media helper path
- `__tests__/unit/` helper/source-hygiene tests
- `docs/runbooks/cloudinary.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/tasks/T-136-centralize-cloudinary-delivery-transformations.md`

## Acceptance Criteria

- Repeated direct Cloudinary upload-path string replacements in the scoped UI
  files are replaced with the shared helper.
- The helper preserves current transformed URLs for supported current variants.
- Non-Cloudinary URLs are returned unchanged or handled through a documented
  safe fallback.
- Focused tests cover current variant outputs and malformed/non-Cloudinary
  inputs.
- Docs record the helper as the source of truth for Cloudinary delivery
  transformations.

## Verification

```bash
rg -n "\\.replace\\([\"']/?/upload/|/upload/[a-zA-Z0-9_,:-]+/" src/components src/lib
npm test -- --runTestsByPath __tests__/unit/cloudinaryDeliveryTransforms.test.ts __tests__/unit/security/cloudinaryDeliveryTransformSourceHygiene.test.ts
npm run lint
git diff --check
```

Adjust the focused test paths if the implementation uses a different local
test name, and record the final command in this task's handoff notes.

## Handoff Notes

- Prepared from A-009/F-071 and the T-101 Cloudinary runbook open work.
- Keep this as a no-behavior-change helper extraction unless the owner approves
  a separate image delivery redesign.
- Completed 2026-05-19.
- Added `src/lib/images/cloudinaryDelivery.ts` with named variants for current
  card, gallery-list, admin-preview, and blog section delivery transforms.
- Updated scoped direct replacement call sites in cards, blog sections, masonry
  artwork lists, and admin read-list previews to call
  `getCloudinaryDeliveryUrl()`.
- The helper returns non-Cloudinary, mismatched-cloud, malformed, credentialed,
  non-default-port, and `original` URLs unchanged.
- Documented the supported variants in `docs/runbooks/cloudinary.md` and
  recorded completion in `docs/workstreams/content-assets-and-admin-ops.md`.
- Verification:
  `rg -n "\\.replace\\(\\s*['\\\"]/upload/|\\.imageUrl\\.replace\\(\\s*['\\\"]/upload/|secure_url\\.replace\\(\\s*['\\\"]/upload/" src/components src/lib --glob '*.ts' --glob '*.tsx'`
  found no direct upload-path replacement call sites.
- Verification:
  `rg -n "\\.replace\\([\\\"']/?/upload/|/upload/[a-zA-Z0-9_,:-]+/" src/components src/lib`
  still reports pre-existing static Cloudinary asset URLs in hero/icon/sidebar
  constants and hard-coded image sources, but no direct replacement call sites.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/cloudinaryDeliveryTransforms.test.ts __tests__/unit/security/cloudinaryDeliveryTransformSourceHygiene.test.ts`
  passed with 2 suites and 13 tests. The run emitted the existing Node
  `[DEP0040] punycode` warning.
- Verification: `npm run lint` passed with no ESLint warnings or errors.
- Verification: `git diff --check` passed.

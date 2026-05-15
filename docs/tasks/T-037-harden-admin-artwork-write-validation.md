# T-037 Harden Admin Artwork Write Validation

Status: Completed

Workstreams:
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the T-020/T-034 admin write-validation pattern to admin artwork
create/update routes.

## Why Now

T-020 hardened collection writes and T-034 hardened article writes. F-057 still
remains open for artwork and blog create/update routes. Artwork should go next
because it is the core archive entity, feeds public archive browsing, and is
where future Shopify product links attach.

This task addresses:

- [F-057](../audits/findings-register.md): admin create/update validation is
  inconsistent and invalid input often becomes a 500.
- [F-038](../audits/findings-register.md): create/update routes bypass
  validation or return raw documents under typed contracts.
- [R-015](../risks/production-readiness.md): admin input flows still have
  server-side validation gaps.
- [R-006](../risks/production-readiness.md): API validation and response
  contracts remain inconsistent.

## Read First

- [T-020 Harden admin collection write validation](T-020-admin-collection-write-validation.md)
- [T-034 Harden admin article write validation](T-034-harden-admin-article-write-validation.md)
- [A-016 Forms, validation, and input result](../audits/results/A-016-forms-validation-inputs.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [A-003 Data models and transforms result](../audits/results/A-003-data-models-transforms.md)
- [Content/admin workstream](../workstreams/content-assets-and-admin-ops.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/app/api/v2/admin/artwork/create/route.ts`
- `src/app/api/v2/admin/artwork/update/[id]/route.ts`
- `src/lib/data/schemas/artworkSchema.ts`
- `src/lib/data/models/artworkModel.ts`
- `src/lib/api/requireApiAdmin.ts`
- `__tests__/unit/api/adminCollectionRoute.test.ts`
- `__tests__/unit/api/adminArticleRoute.test.ts`

## Scope

In scope:

- Add route-safe artwork create/update schemas, or extend the existing artwork
  schemas, so route parsing uses `safeParse`, trims persisted strings, rejects
  unknown fields, and returns structured `400` field/form errors.
- Use the canonical artwork constants for `decade`, `artstyle`, `medium`, and
  `surface`.
- Keep create image validation aligned with the existing Cloudinary image
  schema.
- Keep update behavior compatible with the current admin update form: allow
  partial artwork field updates and do not require a replacement image unless
  one is actually submitted.
- Use `requireApiAdmin()` for create/update before reading request bodies.
- Ensure artwork create/update owns `dbConnect()` before artwork model work.
- Validate update route params before model writes.
- Persist only allowlisted parsed artwork fields.
- Preserve the session admin user as create `author`; do not accept `author`
  from request bodies.
- Return public-safe `500` errors for persistence failures.
- Add focused route tests, suggested path:
  `__tests__/unit/api/adminArtworkRoute.test.ts`, covering unauthenticated,
  non-admin, invalid JSON, invalid fields, unknown fields, invalid update ID,
  not found, successful create/update, no body read for rejected auth/invalid
  IDs, and public-safe failures.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin blog write routes; T-038 owns that follow-up.
- Do not add the Shopify product-linking workflow or accept generic
  `shopifyProducts` writes through this route hardening slice.
- Do not normalize or migrate stored Shopify product IDs.
- Do not redesign artwork upload/update UI behavior.
- Do not migrate admin artwork read/delete routes.
- Do not settle whether admin action-segment routes are canonical.
- Do not introduce a broad shared admin validation abstraction unless it is
  already clearly needed by this slice.

## Acceptance Criteria

- Invalid artwork create/update input returns real JSON `400` responses instead
  of broad `500` failures.
- Unknown request fields are rejected before persistence.
- Create/update persistence uses only parsed allowlisted fields.
- Unauthenticated and non-admin callers are rejected before body parsing.
- Invalid update IDs are rejected before body parsing or MongoDB artwork writes.
- Existing valid artwork create and update form submissions remain compatible.
- Focused admin artwork route tests, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminArtworkRoute.test.ts
npm run lint
npm run build
```

## Completion

Completed on 2026-05-15.

- Added strict artwork create/update route schemas with trimmed title
  persistence, canonical artwork taxonomy constants, strict top-level unknown
  field rejection, update `id` ObjectId validation, and Cloudinary-image
  validation for create plus optional replacement-image updates.
- Updated admin artwork create/update routes to use `requireApiAdmin()` before
  request body reads, parse JSON safely with `safeParse`, call route-local
  `dbConnect()` before `ArtworkModel` writes, persist only parsed allowlisted
  fields, preserve the session admin user as create `author`, reject generic
  `shopifyProducts` writes, return structured `400` validation responses, keep
  explicit `404` handling, and return public-safe `500` persistence failures.
- Kept the current admin update form compatible by making artwork updates
  partial and not requiring a replacement image unless `image` is submitted.
- Added `__tests__/unit/api/adminArtworkRoute.test.ts` covering unauthenticated
  and non-admin short-circuiting, invalid JSON, invalid fields, unknown fields,
  invalid update IDs before body reads, not found, successful create/update,
  optional replacement-image updates, and public-safe persistence failures.
- Remaining F-057 admin write slice: blog create/update routes in T-038.

Verification run on 2026-05-15:

- `npm test -- --runTestsByPath __tests__/unit/api/adminArtworkRoute.test.ts`
  passed with 17 tests.
- `npm run lint` passed.
- `npm run build` passed. Existing build-time MongoDB, fetcher, branch
  verification, and static-generation logs remain expected noise.

## Escalate

Escalate to the orchestrator if:

- Existing admin artwork update behavior depends on submitting arbitrary fields.
- The current update form cannot be made compatible without redesigning image
  replacement behavior.
- Shopify product-link editing is discovered as an active admin workflow; that
  belongs in a separate F-010/F-012 task.

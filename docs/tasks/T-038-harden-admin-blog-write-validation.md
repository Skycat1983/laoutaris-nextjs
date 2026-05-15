# T-038 Harden Admin Blog Write Validation

Status: Completed

Workstreams:
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the T-020/T-034 admin write-validation pattern to admin blog
create/update routes.

## Why Now

After T-037, blog create/update routes are the last remaining F-057 admin
write-validation slice. The current blog routes still use throwing Zod parses,
read or write model data before route-safe validation in some paths, return raw
validation messages as 500s, and do not consistently own route-local DB setup.

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
- [T-037 Harden admin artwork write validation](T-037-harden-admin-artwork-write-validation.md)
- [A-016 Forms, validation, and input result](../audits/results/A-016-forms-validation-inputs.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [A-003 Data models and transforms result](../audits/results/A-003-data-models-transforms.md)
- [Content/admin workstream](../workstreams/content-assets-and-admin-ops.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/app/api/v2/admin/blog/create/route.ts`
- `src/app/api/v2/admin/blog/update/[id]/route.ts`
- `src/lib/data/schemas/blogSchema.ts`
- `src/lib/data/models/blogModel.ts`
- `src/lib/api/requireApiAdmin.ts`
- `__tests__/unit/api/adminArticleRoute.test.ts`

## Scope

In scope:

- Add route-safe blog create/update schemas, or extend the existing blog
  schemas, so route parsing uses `safeParse`, trims persisted strings, rejects
  unknown fields, and returns structured `400` field/form errors.
- Preserve the fields currently supported by the active create/update blog
  forms: `title`, `subtitle`, `summary`, `text`, `imageUrl`, `displayDate`, and
  `featured`.
- Preserve create/update slug generation from parsed `title`.
- Preserve update slug-conflict behavior with a real conflict response.
- Use `requireApiAdmin()` for create/update before reading request bodies.
- Ensure blog create/update owns `dbConnect()` before blog model work.
- Validate update route params before model reads or writes.
- Parse and validate request bodies before existing-blog lookup or persistence
  work where possible.
- Persist only allowlisted parsed blog fields.
- Preserve the session admin user as create `author`; do not accept `author`
  from request bodies.
- Return public-safe `500` errors for persistence failures.
- Add focused route tests, suggested path:
  `__tests__/unit/api/adminBlogRoute.test.ts`, covering unauthenticated,
  non-admin, invalid JSON, invalid fields, unknown fields, invalid update ID,
  not found, slug conflict, successful create/update, no body read for rejected
  auth/invalid IDs, and public-safe failures.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin artwork write routes; T-037 owns that slice.
- Do not add blog `pinned` or `tags` UI/workflow support unless an active
  existing consumer already submits those fields.
- Do not redesign blog admin forms or operation tab behavior.
- Do not migrate admin blog read/delete routes.
- Do not settle whether admin action-segment routes are canonical.
- Do not introduce a broad shared admin validation abstraction unless it is
  already clearly needed by this slice.

## Acceptance Criteria

- Invalid blog create/update input returns real JSON `400` responses instead of
  broad `500` failures.
- Unknown request fields are rejected before persistence.
- Create/update persistence uses only parsed allowlisted fields.
- Unauthenticated and non-admin callers are rejected before body parsing.
- Invalid update IDs are rejected before body parsing or MongoDB blog reads.
- Existing valid blog create and update form submissions remain compatible.
- Focused admin blog route tests, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminBlogRoute.test.ts
npm run lint
npm run build
```

## Completion

Completed on 2026-05-15.

- Added strict blog create/update route schemas with trimmed persisted strings,
  bounded text fields, route-param ObjectId validation, date coercion, and
  unknown-field rejection.
- Updated admin blog create/update routes to use `requireApiAdmin()` before
  reading request bodies, parse JSON safely with `safeParse`, call route-local
  `dbConnect()` before `BlogModel` work, persist only parsed allowlisted blog
  fields, preserve the session admin user as create `author`, and return
  structured `400`, explicit `404`/`409`, and public-safe `500` responses.
- Preserved create/update slug generation from parsed titles and kept update
  slug-conflict behavior while moving body validation before existing-blog
  reads.
- Added `__tests__/unit/api/adminBlogRoute.test.ts` covering unauthenticated
  and non-admin short-circuiting, invalid JSON, invalid fields, unknown fields,
  invalid update IDs before body reads, not found, slug conflict, successful
  create/update, unchanged-title updates, and public-safe persistence failures.

Verification run on 2026-05-15:

- `npm test -- --runTestsByPath __tests__/unit/api/adminBlogRoute.test.ts`
  passed with 18 tests.
- `npm run lint` passed.
- `npm run build` passed. Existing build-time MongoDB, fetcher,
  branch-verification, and static-generation logs remain expected noise.

## Escalate

Escalate to the orchestrator if:

- Existing admin blog forms submit fields outside the current form schema.
- `pinned` or `tags` must be part of the launch workflow rather than a separate
  F-039 field-contract task.
- Slug uniqueness requires a broader URL/content migration decision.

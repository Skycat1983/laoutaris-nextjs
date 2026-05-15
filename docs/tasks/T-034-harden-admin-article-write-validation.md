# T-034 Harden Admin Article Write Validation

Status: Completed

Workstreams:
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the T-020 admin collection write-validation pattern to admin article
create/update routes.

## Why Now

F-057 remains high-risk after T-020: collection writes are hardened, but article,
artwork, and blog writes still accept uneven input or convert validation
failures into 500s. Article routes are a good next slice because both create
and update are small, share the existing article schema, and can be covered with
focused route tests before moving to artwork and blog.

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
- [A-016 Forms, validation, and input result](../audits/results/A-016-forms-validation-inputs.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [A-003 Data models and transforms result](../audits/results/A-003-data-models-transforms.md)
- [Content/admin workstream](../workstreams/content-assets-and-admin-ops.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/app/api/v2/admin/article/create/route.ts`
- `src/app/api/v2/admin/article/update/[id]/route.ts`
- `src/lib/data/schemas/articleSchema.ts`
- `src/lib/api/requireApiAdmin.ts`
- `__tests__/unit/api/adminCollectionRoute.test.ts`

## Scope

In scope:

- Add route-safe article create/update schemas, or extend the existing article
  schemas, so route parsing uses `safeParse`, trims persisted strings, rejects
  unknown fields, and returns structured `400` field/form errors.
- Use `requireApiAdmin()` for create/update before reading request bodies.
- Ensure article create/update owns `dbConnect()` before article model work.
- Validate update route params before model writes.
- Persist only allowlisted parsed article fields.
- Generate/update the slug only from parsed `title`.
- Preserve the session admin user as the create `author`; do not accept author
  from request bodies.
- Return public-safe `500` errors for persistence failures.
- Add focused route tests, suggested path:
  `__tests__/unit/api/adminArticleRoute.test.ts`, covering unauthenticated,
  non-admin, invalid JSON, invalid fields, unknown fields, invalid update ID,
  not found, successful create/update, and public-safe failures.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin artwork or blog write routes.
- Do not redesign article admin forms or operation tab behavior.
- Do not migrate admin article read/delete routes.
- Do not settle whether admin action-segment routes are canonical.
- Do not introduce a broad shared admin validation abstraction unless it is
  already clearly needed by this slice.

## Acceptance Criteria

- Invalid article create/update input returns real JSON `400` responses instead
  of broad `500` failures.
- Unknown request fields are rejected before persistence.
- Create/update persistence uses only parsed allowlisted fields.
- Unauthenticated and non-admin callers are rejected before body parsing.
- Focused admin article route tests, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts
npm run lint
npm run build
```

## Completion

Completed on 2026-05-15.

- Added strict article create/update route schemas with trimmed strings,
  article/artwork ObjectId validation, model-backed article section/overlay
  enums, and unknown-field rejection.
- Updated admin article create/update routes to use `requireApiAdmin()` before
  body reads, parse JSON safely, call route-local `dbConnect()` before
  `ArticleModel` writes, persist only parsed allowlisted fields, generate/update
  slugs only from parsed titles, preserve the session admin user as create
  `author`, and return structured `400`, explicit `404`, and public-safe `500`
  responses.
- Removed the invalid `collections` section choice from admin article create and
  update forms so the UI no longer offers a value rejected by the Article model
  and route schema.
- Added `__tests__/unit/api/adminArticleRoute.test.ts` covering
  unauthenticated, non-admin, invalid JSON, invalid fields, unknown fields,
  invalid update ID, not found, successful create/update, and public-safe
  persistence failures.
- Remaining F-057 admin write slices: artwork and blog create/update routes.

Verification run on 2026-05-15:

- `npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts`
  passed with 16 tests.
- `npm run lint` passed.
- `npm run build` passed. Existing build-time MongoDB, fetcher, branch
  verification, and static-generation logs remain expected noise.

## Escalate

Escalate to the orchestrator if:

- Existing admin article forms submit fields that conflict with strict route
  schemas.
- Article update must remain partial or full-object only and that choice is not
  clear from existing consumers.
- Transform/DTO mismatches require a broader admin article contract decision.

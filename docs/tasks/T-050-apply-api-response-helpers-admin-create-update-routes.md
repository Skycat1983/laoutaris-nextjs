# T-050 Apply API Response Helpers To Admin Create Update Routes

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the shared API response helpers to admin create/update routes so write
success, not-found, conflict, and internal-failure responses use stable
status-bearing envelopes while preserving the strict validation and allowlisted
persistence behavior established by T-020, T-034, T-037, and T-038.

## Why Now

T-048 and T-049 completed admin read/delete response-helper cleanup. The
remaining admin response-helper slice is create/update. These routes already
use `requireApiAdmin()`, strict route schemas, route-local `dbConnect()`, and
focused validation tests, but they still carry local `errorResponse()` helpers
and direct success `NextResponse.json()` calls. This task finishes the bounded
admin response-helper track before broader field/transform contract cleanup,
Shopify product-linking work, or global logging policy.

This task addresses:

- [F-015](../audits/findings-register.md): API response contracts are uneven
  across public, user, admin, and shop routes.
- [F-036](../audits/findings-register.md): API failures do not consistently
  return real HTTP statuses.
- [F-053](../audits/findings-register.md): API exception responses need stable
  public-safe handling.
- [R-006](../risks/production-readiness.md): API envelopes, statuses, and
  public-safe errors remain inconsistent.

## Read First

- [T-020 Harden admin collection write validation](T-020-admin-collection-write-validation.md)
- [T-034 Harden admin article write validation](T-034-harden-admin-article-write-validation.md)
- [T-037 Harden admin artwork write validation](T-037-harden-admin-artwork-write-validation.md)
- [T-038 Harden admin blog write validation](T-038-harden-admin-blog-write-validation.md)
- [T-048 Apply API response helpers to admin read routes](T-048-apply-api-response-helpers-admin-read-routes.md)
- [T-049 Apply API response helpers to admin delete routes](T-049-apply-api-response-helpers-admin-delete-routes.md)
- `src/lib/api/apiResponse.ts`
- `src/lib/api/admin/create/fetchers.ts`
- `src/lib/api/admin/update/fetchers.ts`
- `__tests__/unit/api/adminCollectionRoute.test.ts`
- `__tests__/unit/api/adminArticleRoute.test.ts`
- `__tests__/unit/api/adminArtworkRoute.test.ts`
- `__tests__/unit/api/adminBlogRoute.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Use shared response helpers where practical in admin create/update routes:
  - `POST /api/v2/admin/article/create`,
  - `PATCH /api/v2/admin/article/update/[id]`,
  - `POST /api/v2/admin/artwork/create`,
  - `PATCH /api/v2/admin/artwork/update/[id]`,
  - `POST /api/v2/admin/blog/create`,
  - `PATCH /api/v2/admin/blog/update/[id]`,
  - `POST /api/v2/admin/collection/create`,
  - `PATCH /api/v2/admin/collection/update/[id]`.
- Preserve `requireApiAdmin()` guard behavior and existing JSON `401`/`403`
  auth envelopes.
- Preserve all existing structured validation `400` response bodies, including
  `fieldErrors` and `formErrors`. Do not replace validation response helpers
  unless the body remains byte-for-byte equivalent in tests.
- Preserve successful create/update contracts and fetcher types:
  `CreateArticleResult`, `UpdateArticleResult`, `CreateArtworkResult`,
  `UpdateArtworkResult`, `CreateBlogResult`, `UpdateBlogResult`,
  `CreateCollectionResult`, and `UpdateCollectionResult`.
- Preserve create `201` statuses and update `200` statuses.
- Preserve normalized admin DTO shaping already present in article, artwork,
  and blog routes, and preserve current collection success shapes.
- Preserve route-local ordering:
  - auth before body reads,
  - param validation before body reads where already implemented,
  - JSON parsing before schema validation,
  - `dbConnect()` before model writes/reads,
  - parsed allowlisted persistence only.
- Replace local non-validation `errorResponse()` helpers and direct success
  responses with `apiErrorResponse()` and `apiSuccessResponse()` where practical.
- Keep real statuses for:
  - invalid JSON and schema failures as `400`,
  - update not-found branches as `404`,
  - blog slug conflicts as `409`,
  - caught internal failures as `500`.
- Ensure caught internal-failure response bodies do not include raw exception
  messages or stack details.
- Preserve Next.js control-flow errors by rethrowing `isNextError(error)` in
  touched route catch blocks where needed.
- Update focused route tests for helper envelopes and private-message
  redaction while preserving the existing validation and persistence coverage.
- Keep route/fetcher parity current if imports or route signatures change.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin read routes covered by T-048.
- Do not change admin delete routes covered by T-049.
- Do not change public, user, shop, enquiry, or Cloudinary routes.
- Do not redesign admin DTOs, schemas, transform/normalization helpers,
  persistence fields, route names, or action-segment conventions.
- Do not add Shopify product ID/admin-linking fields or behavior.
- Do not change collection artwork add/remove semantics, blog slug conflict
  policy, article slug policy, artwork image shape, or author ownership.
- Do not introduce request IDs, monitoring, centralized logging, or broader
  production logging/redaction policy.
- Do not address checkout decisions, Cloudinary upload policy, or the residual
  Next/PostCSS decision.

## Acceptance Criteria

- The eight admin create/update routes in scope use shared response helpers for
  success and non-validation error responses where practical.
- Existing auth, validation, create/update success DTOs, `201`/`200` statuses,
  not-found `404`s, blog slug conflict `409`, DB ordering, and allowlisted
  persistence behavior are preserved.
- Structured validation `400` bodies remain unchanged.
- Internal `500` response bodies are stable and do not include raw thrown error
  messages.
- Focused admin create/update tests, route/fetcher parity if affected, lint,
  and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts __tests__/unit/api/apiResponse.test.ts
npm run lint
npm run build
```

Record any existing build/test noise separately from new failures.

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts __tests__/unit/api/apiResponse.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 6 suites and 76 tests. Lint passed with no
warnings. Build passed; existing MongoDB/static-generation,
branch-verification, link, and fetcher debug log noise appeared during page
generation.

## Completion

Completed on 2026-05-15.

- Migrated admin article, artwork, blog, and collection create/update route
  success responses to `apiSuccessResponse()` while preserving create `201`
  statuses, update `200` statuses, fetcher result types, normalized article,
  artwork, and blog DTO shaping, and current collection success shapes.
- Replaced local non-validation `errorResponse()` helpers with
  `apiErrorResponse()` for update missing-resource `404`s, the blog slug
  conflict `409`, and caught internal `500`s.
- Preserved existing `requireApiAdmin()` guard behavior, JSON `401`/`403` auth
  envelopes, structured validation `400` response bodies, auth/body-read/param
  validation ordering, route-local `dbConnect()` ownership, and allowlisted
  parsed persistence.
- Added `isNextError()` rethrows in touched create/update catch blocks and kept
  internal failure bodies stable without raw thrown messages.
- Updated focused admin create/update tests for helper error envelopes while
  preserving validation, persistence, route/fetcher parity, and private-message
  redaction coverage.

Remaining work: this intentionally did not define global logging/redaction
policy, redesign admin DTOs or field contracts, add Shopify product-linking
behavior, or change admin read/delete routes.

## Handoff Notes

- Keep this limited to admin create/update API response-helper cleanup.
- Favor the helper behavior already proven by T-044 through T-049. Do not add
  new envelope conventions unless the existing helper cannot preserve create
  status or route contracts.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- A route's validation body cannot remain stable while using shared helpers.
- Admin create/update DTO, persistence, slug, or collection artwork semantics
  need a product decision before helper migration can land.
- Stable admin write failures cannot be implemented without a global logging or
  observability decision.

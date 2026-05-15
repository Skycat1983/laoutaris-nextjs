# T-048 Apply API Response Helpers To Admin Read Routes

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the shared API response helpers to admin read routes so list/detail
success, missing-resource, empty-list, and internal-failure responses use the
same status-bearing envelope helpers as the recently migrated public and user
route slices.

## Why Now

T-039 already moved admin read routes to `requireApiAdmin()`, added route-local
DB ownership, and added focused route tests. T-044 through T-047 then proved
the shared response helpers across protected user read routes and public
content/navigation routes. Admin read routes still use direct
`NextResponse.json()` calls across article, artwork, blog, collection, comment,
and user reads. This is the next bounded response-helper slice before admin
delete/write response-helper work, broader logging policy, or field/transform
contract cleanup.

This task addresses:

- [F-015](../audits/findings-register.md): API response contracts are uneven
  across public, user, admin, and shop routes.
- [F-036](../audits/findings-register.md): API failures do not consistently
  return real HTTP statuses.
- [F-053](../audits/findings-register.md): API exception responses need
  public-safe/stable handling.
- [R-006](../risks/production-readiness.md): API envelopes, statuses, and
  public-safe errors remain inconsistent.

## Read First

- [T-039 Migrate admin read routes to shared guard](T-039-migrate-admin-read-routes-shared-guard.md)
- [T-044 Introduce API response helpers for user read routes](T-044-introduce-api-response-helpers-user-read-routes.md)
- [T-047 Apply API response helpers to public navigation routes](T-047-apply-api-response-helpers-public-navigation-routes.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/apiResponse.ts`
- `src/lib/api/admin/read/fetchers.ts`
- `src/lib/api/admin/read/routeValidation.ts`
- `__tests__/unit/api/adminReadRouteGuard.test.ts`
- `__tests__/unit/api/adminUserCommentReadRoute.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Use shared response helpers where practical in admin read routes:
  - `GET /api/v2/admin/article/read`,
  - `GET /api/v2/admin/article/read/[id]`,
  - `GET /api/v2/admin/artwork/read`,
  - `GET /api/v2/admin/artwork/read/[id]`,
  - `GET /api/v2/admin/blog/read`,
  - `GET /api/v2/admin/blog/read/[id]`,
  - `GET /api/v2/admin/collection/read`,
  - `GET /api/v2/admin/collection/read/[id]`,
  - `GET /api/v2/admin/comment/read`,
  - `GET /api/v2/admin/comment/read/[id]`,
  - `GET /api/v2/admin/user/read`,
  - `GET /api/v2/admin/user/read/[id]`.
- Preserve current successful response contracts and fetcher types:
  `ReadArticleListResult`, `ReadArticleResult`, `ReadArtworkListResult`,
  `ReadArtworkResult`, `ReadBlogListResult`, `ReadBlogResult`,
  `ReadCollectionListResult`, `ReadCollectionResult`, `ReadCommentListResult`,
  `ReadCommentResult`, `ReadUserListResult`, and `ReadUserResult`.
- Preserve current transformed frontend/admin DTO behavior. Do not change model
  queries, populate chains, sort order, pagination metadata, or transform calls
  except as needed to route responses through helpers.
- Preserve `requireApiAdmin()` guard behavior and the existing JSON
  `401`/`403` auth envelopes.
- Preserve the existing structured invalid-ID `400` contract from
  `adminReadInvalidIdResponse()`, including `fieldErrors` and `formErrors`.
- Replace remaining direct success/error `NextResponse.json()` calls in the
  touched read routes with `apiSuccessResponse()`, `apiListResponse()`, and
  `apiErrorResponse()` where those helpers can represent the current contract.
- Keep real statuses for:
  - invalid IDs as `400`,
  - empty admin read lists as their current status,
  - missing detail resources as `404`,
  - caught internal failures as `500`.
- Ensure caught internal-failure response bodies do not include raw exception
  messages or stack details.
- Preserve route-local `dbConnect()` ordering from T-039: admin guard and
  invalid-ID checks must still short-circuit before target DB/model work, and
  valid admin reads must connect before model reads.
- Preserve Next.js control-flow errors by rethrowing `isNextError(error)` in
  touched routes where that pattern is present or needed.
- Update focused route tests, primarily:
  `__tests__/unit/api/adminReadRouteGuard.test.ts` and
  `__tests__/unit/api/adminUserCommentReadRoute.test.ts`, covering:
  - representative list success envelopes and metadata,
  - representative detail success envelopes,
  - empty-list and missing-resource statuses,
  - invalid-ID `400` contracts remain unchanged,
  - public-safe internal `500` bodies do not leak private thrown messages,
  - auth guard and DB-before-model ordering remain intact.
- Keep route/fetcher parity current if imports or route signatures change.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin create/update/delete routes.
- Do not change public, user, shop, enquiry, or Cloudinary routes.
- Do not redesign admin read DTOs, pagination, filters, empty-list semantics,
  transform output, route naming, or action-segment conventions.
- Do not replace `adminReadInvalidIdResponse()` unless required to preserve
  behavior.
- Do not introduce request IDs, monitoring, centralized logging, or broader
  production logging/redaction policy.
- Do not address Shopify product ID/admin-linking, checkout decisions,
  Cloudinary upload policy, or the residual Next/PostCSS decision.

## Acceptance Criteria

- The twelve admin read routes in scope use shared response helpers for
  success and error responses where practical.
- Existing `requireApiAdmin()` auth behavior, invalid-ID validation, success
  DTOs, list metadata, and DB-before-model ordering are preserved.
- Missing-resource, empty-list, and internal-failure branches keep real status
  codes and no route relies on body-only `statusCode` fields.
- Internal `500` response bodies are stable and do not include raw thrown error
  messages.
- Focused admin read tests, route/fetcher parity if affected, lint, and build
  pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminUserCommentReadRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Record any existing build/test noise separately from new failures.

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminUserCommentReadRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 3 suites and 43 tests. Lint passed with no
warnings. Build passed; existing MongoDB/static-generation,
branch-verification, link, and fetcher debug log noise appeared during page
generation.

## Completion

Completed on 2026-05-15.

- Migrated admin article, artwork, blog, collection, comment, and user read
  list/detail routes to shared `apiSuccessResponse()`, `apiListResponse()`, and
  `apiErrorResponse()` helpers where practical.
- Preserved `requireApiAdmin()` guard behavior, unchanged invalid-ID `400`
  contracts from `adminReadInvalidIdResponse()`, transformed admin DTOs, list
  metadata, current empty-list `404` semantics, missing-resource `404`
  semantics, and route-local DB-before-model ordering.
- Added `isNextError()` rethrows to touched admin read route catch blocks and
  kept internal `500` bodies stable without raw thrown messages.
- Updated focused admin read route tests for helper error envelopes while
  preserving auth, invalid-ID, success, empty-list, not-found, and DB ordering
  coverage.

Remaining work: this intentionally did not migrate admin create/update/delete
routes, define global logging/redaction policy, redesign admin DTOs or
pagination semantics, or address field/transform contracts and Shopify product
linking.

## Handoff Notes

- Keep this limited to admin read APIs. Admin write/delete response-helper work
  should remain separate.
- Favor the helper behavior already proven by T-044 through T-047. Do not add
  new envelope conventions unless the existing helper cannot represent the
  route contract.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- An admin consumer depends on direct `NextResponse.json()` quirks, body-level
  `statusCode`, or a changed empty-list status for read routes.
- Admin read DTO, pagination, or route naming semantics need a product decision
  before helper migration can land.
- Stable admin failures cannot be implemented without a global logging or
  observability decision.

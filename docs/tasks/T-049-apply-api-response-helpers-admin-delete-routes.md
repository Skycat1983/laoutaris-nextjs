# T-049 Apply API Response Helpers To Admin Delete Routes

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the shared API response helpers to admin delete routes so destructive
success, missing-resource, conflict, validation, and internal-failure responses
use stable status-bearing envelopes while preserving the cascade and transaction
behavior established by T-040.

## Why Now

T-040 moved admin delete routes to `requireApiAdmin()`, added destructive ID
validation, and preserved cascade behavior with focused tests. T-048 then
completed admin read route response-helper cleanup. Admin delete routes still
use direct `NextResponse.json()` responses and a few direct debug logs. This is
a bounded follow-up before admin create/update response-helper work, global
logging policy, or field/transform cleanup.

This task addresses:

- [F-015](../audits/findings-register.md): API response contracts are uneven
  across public, user, admin, and shop routes.
- [F-036](../audits/findings-register.md): API failures do not consistently
  return real HTTP statuses.
- [F-053](../audits/findings-register.md): API exception responses need
  stable public-safe handling and debug-log cleanup.
- [R-006](../risks/production-readiness.md): API envelopes, statuses, and
  public-safe errors remain inconsistent.

## Read First

- [T-040 Migrate admin delete routes to shared guard](T-040-migrate-admin-delete-routes-shared-guard.md)
- [T-048 Apply API response helpers to admin read routes](T-048-apply-api-response-helpers-admin-read-routes.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/apiResponse.ts`
- `src/lib/api/admin/delete/fetchers.ts`
- `src/lib/api/admin/delete/routeValidation.ts`
- `__tests__/unit/api/adminDeleteRouteGuard.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Use shared response helpers where practical in admin delete routes:
  - `DELETE /api/v2/admin/article/delete/[id]`,
  - `DELETE /api/v2/admin/artwork/delete/[id]`,
  - `DELETE /api/v2/admin/blog/delete/[id]`,
  - `DELETE /api/v2/admin/collection/delete/[id]`,
  - `DELETE /api/v2/admin/comment/delete/[id]`,
  - `DELETE /api/v2/admin/user/delete/[id]`.
- Preserve `requireApiAdmin()` guard behavior and the existing JSON
  `401`/`403` auth envelopes.
- Preserve the existing structured invalid-ID `400` contract from
  `adminDeleteInvalidIdResponse()`, including `fieldErrors` and `formErrors`.
- Preserve current successful delete contracts:
  - `success: true`,
  - `data: null`,
  - the route-specific success `message`.
- If the existing `apiSuccessResponse()` helper cannot preserve the delete
  success `message`, either extend the helper in a backward-compatible typed
  way or leave the success response direct and document why. Do not remove
  existing success messages.
- Replace direct error `NextResponse.json()` calls with `apiErrorResponse()`
  where practical while keeping real statuses:
  - invalid IDs as `400`,
  - missing delete targets as `404`,
  - artwork-in-use conflicts as `409`,
  - caught internal failures as `500`.
- Ensure caught internal-failure response bodies do not include raw exception
  messages or stack details.
- Preserve route-local ordering from T-040:
  - auth and invalid-ID checks short-circuit before target DB/model work,
  - valid delete routes call `dbConnect()` before model work,
  - transaction routes still abort, commit, and end sessions correctly.
- Preserve current cascade semantics for artwork, blog, comment, and user
  deletes.
- Preserve Next.js control-flow errors by rethrowing `isNextError(error)` in
  touched routes where needed.
- Remove direct debug `console.log()` calls from touched delete handlers, such
  as deleted-entity logs. Do not define a global logging policy in this task.
- Update focused route tests, primarily
  `__tests__/unit/api/adminDeleteRouteGuard.test.ts`, covering:
  - representative success envelopes preserve `data: null` and messages,
  - invalid-ID `400` bodies remain unchanged,
  - missing-resource `404` statuses and bodies,
  - artwork conflict `409` status and stable body,
  - public-safe internal `500` bodies do not leak private thrown messages,
  - auth, DB-before-model, transaction abort/commit/end, and cascade behavior
    remain intact,
  - touched direct debug logs are not emitted on covered success/not-found
    paths where feasible.
- Keep route/fetcher parity current if imports or route signatures change.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin read routes already covered by T-048.
- Do not change admin create/update routes.
- Do not change public, user, shop, enquiry, or Cloudinary routes.
- Do not redesign delete DTOs, cascade behavior, transaction boundaries,
  route names, or action-segment conventions.
- Do not replace `adminDeleteInvalidIdResponse()` unless required to preserve
  behavior.
- Do not introduce request IDs, monitoring, centralized logging, or broader
  production logging/redaction policy.
- Do not address Shopify product ID/admin-linking, checkout decisions,
  Cloudinary upload policy, or the residual Next/PostCSS decision.

## Acceptance Criteria

- The six admin delete routes in scope use shared response helpers for error
  responses, and for success responses if the helper can preserve route-specific
  messages.
- Existing `requireApiAdmin()` auth behavior, invalid-ID validation, success
  messages, `data: null`, conflict handling, cascade behavior, and transaction
  ordering are preserved.
- Missing-resource, conflict, and internal-failure branches keep real
  `404`/`409`/`500` statuses and no route relies on body-only `statusCode`
  fields.
- Internal `500` response bodies are stable and do not include raw thrown error
  messages.
- Touched route handlers no longer emit direct debug logs.
- Focused admin delete tests, route/fetcher parity if affected, lint, and build
  pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Record any existing build/test noise separately from new failures.

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/api/routeFetcherParity.test.ts __tests__/unit/api/apiResponse.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 3 suites and 36 tests. Lint passed with no
warnings. Build passed; existing MongoDB/static-generation,
branch-verification, link, and fetcher debug log noise appeared during page
generation.

## Completion

Completed on 2026-05-15.

- Extended `apiSuccessResponse()` to preserve optional success messages without
  changing existing success helper callers.
- Migrated admin article, artwork, blog, collection, comment, and user delete
  routes to shared `apiSuccessResponse()` and `apiErrorResponse()` helpers
  where practical.
- Preserved `requireApiAdmin()` guard behavior, unchanged invalid-ID `400`
  contracts from `adminDeleteInvalidIdResponse()`, delete success messages,
  `data: null`, artwork conflict `409`, missing-resource `404`s, cascade
  behavior, transaction abort/commit/end behavior, and DB-before-model ordering.
- Added `isNextError()` rethrows in touched delete route catch blocks while
  keeping transaction cleanup for transaction-backed routes.
- Removed touched direct debug `console.log()` calls from delete handlers and
  kept internal `500` response bodies stable without raw thrown messages.
- Updated focused admin delete/helper tests for helper success messages,
  shared error envelopes, private-message redaction, and no direct debug logs
  in covered success/not-found paths.

Remaining work: this intentionally did not migrate admin create/update routes,
define global logging/redaction policy, redesign delete DTOs or cascade
semantics, or address field/transform contracts and Shopify product linking.

## Handoff Notes

- Keep this limited to admin delete APIs. Admin create/update response-helper
  work should remain separate.
- Favor the helper behavior already proven by T-044 through T-048. Do not add
  new envelope conventions unless the existing helper cannot preserve delete
  success messages.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- An admin consumer depends on direct `NextResponse.json()` quirks or a changed
  success message for delete routes.
- Delete cascade, conflict, or transaction semantics need a product decision
  before helper migration can land.
- Stable admin delete failures cannot be implemented without a global logging or
  observability decision.

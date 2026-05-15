# T-046 Apply API Response Helpers To Public Collection Routes

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the shared API response helpers to public collection routes so collection
list, collection detail, collection artwork list, and collection artwork detail
failures return real status-bearing, public-safe envelopes.

## Why Now

T-044 introduced the shared response helpers, and T-045 proved them on public
artwork/article/blog detail routes. Public collection APIs still mix direct
`NextResponse.json()` calls, body-only `statusCode` fields, debug logging, and
route-local DB/model work without consistent public-safe helper usage. This is a
bounded follow-up before broader public navigation/list semantics or admin route
response-helper work.

This task addresses:

- [F-015](../audits/findings-register.md): API response contracts are uneven
  across public, user, admin, and shop routes.
- [F-024](../audits/findings-register.md): MongoDB-backed API routes need
  explicit route-local DB connection ownership.
- [F-036](../audits/findings-register.md): API failures do not consistently
  return real HTTP statuses.
- [F-053](../audits/findings-register.md): public API exception responses need
  public-safe handling.
- [R-006](../risks/production-readiness.md): API envelopes, statuses, and
  public-safe errors remain inconsistent.

## Read First

- [T-044 Introduce API response helpers for user read routes](T-044-introduce-api-response-helpers-user-read-routes.md)
- [T-045 Apply API response helpers to public content detail routes](T-045-apply-api-response-helpers-public-content-detail-routes.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Deployment/security/observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/apiResponse.ts`
- `src/app/api/v2/public/collection/route.ts`
- `src/app/api/v2/public/collection/[slug]/route.ts`
- `src/app/api/v2/public/collection/[slug]/artwork/route.ts`
- `src/app/api/v2/public/collection/[slug]/artwork/[id]/route.ts`
- `src/lib/api/public/collection/fetchers.ts`
- `__tests__/unit/api/apiResponse.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Use shared response helpers in:
  - `GET /api/v2/public/collection`,
  - `GET /api/v2/public/collection/[slug]`,
  - `GET /api/v2/public/collection/[slug]/artwork`,
  - `GET /api/v2/public/collection/[slug]/artwork/[id]`.
- Preserve current successful response contracts:
  - collection list returns `ApiCollectionListResult` with existing metadata,
  - collection detail returns the current single collection success shape,
  - collection artwork list returns the current populated collection success
    shape,
  - collection artwork detail returns the current populated collection success
    shape.
- Replace body-level `statusCode` failures with actual HTTP response statuses.
- Return real public-safe statuses:
  - missing collection returns `404`,
  - artwork not found in a collection returns `404`,
  - caught non-Next internal failures return `500`,
  - response bodies do not include raw exception messages or stack details.
- Add explicit `dbConnect()` ownership inside the route handler `try` block for
  each touched MongoDB-backed route before model reads.
- Preserve Next.js control-flow errors by rethrowing `isNextError(error)` in
  touched routes where applicable.
- Remove direct route debug logging from the touched collection handlers, such
  as request-received or found-count logs. Do not create a global logging
  policy in this task.
- Add focused route tests, suggested path:
  `__tests__/unit/api/publicCollectionRoutes.test.ts`, covering:
  - list success and public-safe internal failure,
  - collection detail success, missing collection `404`, and public-safe `500`,
  - collection artwork list success, missing collection `404`, and public-safe
    `500`,
  - collection artwork detail missing collection `404`, missing artwork `404`,
    success, and public-safe `500`,
  - no touched route error body leaks a private thrown message,
  - route-local `dbConnect()` happens before model reads on valid requests.
- Keep route/fetcher parity current if imports or route signatures change.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change public navigation routes.
- Do not migrate public article/blog/artwork routes already covered by T-045.
- Do not migrate public search, shop, enquiry, or admin routes.
- Do not redesign collection DTOs, transforms, pagination metadata, empty-list
  semantics, or collection artwork detail semantics.
- Do not add broad query parsing or pagination policy beyond preserving current
  valid behavior.
- Do not introduce request IDs, monitoring, centralized logging, or
  observability tooling.
- Do not address Shopify product ID/admin-linking or checkout decisions.

## Acceptance Criteria

- The four public collection routes in scope use the shared response helpers
  for success and error responses where practical.
- Missing-resource and internal-failure branches return real `404`/`500`
  statuses instead of implicit or body-only status values.
- Public `500` response bodies are stable and do not include raw thrown error
  messages.
- Touched routes explicitly call `dbConnect()` before model reads.
- Touched route handlers no longer emit direct debug logs.
- Focused collection route tests, route/fetcher parity if affected, lint, and
  build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Record any existing build/test noise separately from new failures.

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 2 suites and 15 tests. Lint passed with no
warnings. Build passed; existing `punycode` test warnings and build-time
MongoDB/static-generation, branch-verification, link, and fetcher debug log
noise appeared.

## Completion

Completed on 2026-05-15.

- Migrated collection list, collection detail, collection artwork list, and
  collection artwork detail routes to shared success/error helpers where
  practical.
- Changed missing collection, missing artwork-in-collection, and caught
  non-Next internal failures to real public-safe `404`/`500` responses without
  body-level `statusCode` fields.
- Moved route-local `dbConnect()` calls inside each touched handler's `try`
  block before model reads and preserved Next.js control-flow errors with
  `isNextError()` rethrows.
- Preserved current success contracts: list metadata, transformed populated
  artwork-list collection data, and the existing single/detail collection data
  shapes.
- Removed direct request-received debug logging from the collection list
  handler.
- Added `__tests__/unit/api/publicCollectionRoutes.test.ts` covering success,
  missing-resource `404`s, public-safe internal `500`s, private-message
  redaction, and DB-before-model ordering.

Remaining work: this intentionally did not migrate public navigation, search,
shop, enquiry, admin routes, collection DTO semantics, pagination policy, or
broader logging/redaction and observability policy.

## Handoff Notes

- Keep this limited to public collection APIs. Public navigation and admin
  response-helper migrations should remain separate tasks.
- Favor the helper behavior already proven by T-044 and T-045. Do not add new
  envelope conventions unless the existing helper cannot represent the route
  contract.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- A public client depends on body-level `statusCode` fields or implicit-`200`
  failures for collection routes.
- Collection empty-list or collection artwork detail semantics need a product
  decision before status cleanup can land.
- Public-safe failures cannot be implemented without a global logging/redaction
  policy decision.

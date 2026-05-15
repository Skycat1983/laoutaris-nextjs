# T-047 Apply API Response Helpers To Public Navigation Routes

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the shared API response helpers to public navigation routes so article and
collection navigation failures return real status-bearing, public-safe
envelopes.

## Why Now

T-044 introduced shared response helpers, T-045 proved them on public content
detail routes, and T-046 applied them to public collection content routes.
Public navigation APIs still use direct `NextResponse.json()` responses,
body-only `statusCode` fields, direct debug logging, and uneven route-local
`dbConnect()` ownership. This is the next bounded response-helper slice before
admin response-helper work, broader logging policy, or field/transform contract
cleanup.

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
- [T-046 Apply API response helpers to public collection routes](T-046-apply-api-response-helpers-public-collection-routes.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Deployment/security/observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/apiResponse.ts`
- `src/app/api/v2/public/navigation/articles/[section]/route.ts`
- `src/app/api/v2/public/navigation/collections/route.ts`
- `src/app/api/v2/public/navigation/collections/[slug]/route.ts`
- `src/app/api/v2/public/navigation/collections/[slug]/artworks/route.ts`
- `src/lib/api/public/navigation/fetchers.ts`
- `__tests__/unit/api/apiResponse.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Use shared response helpers in:
  - `GET /api/v2/public/navigation/articles/[section]`,
  - `GET /api/v2/public/navigation/collections`,
  - `GET /api/v2/public/navigation/collections/[slug]`,
  - `GET /api/v2/public/navigation/collections/[slug]/artworks`.
- Preserve current successful response contracts:
  - article navigation returns `ApiArticleNavListResult` with existing metadata,
  - collection navigation list returns `ApiCollectionNavListResult` with
    existing metadata,
  - collection navigation detail returns `ApiCollectionNavItemResult`,
  - collection navigation artworks returns the current populated collection
    success shape.
- Replace body-level `statusCode` failures with actual HTTP response statuses.
- Return real public-safe statuses:
  - missing article navigation items return `404`,
  - missing collection navigation targets return `404`,
  - caught non-Next internal failures return `500`,
  - response bodies do not include raw exception messages or stack details.
- Add explicit `dbConnect()` ownership inside each touched route handler's
  `try` block before model reads where it is missing.
- Preserve Next.js control-flow errors by rethrowing `isNextError(error)` in
  touched routes.
- Remove direct route debug logging from touched navigation handlers, such as
  request-received, found-count, or no-results logs. Do not create a global
  logging policy in this task.
- Add focused route tests, suggested path:
  `__tests__/unit/api/publicNavigationRoutes.test.ts`, covering:
  - article navigation success, no-articles `404`, and public-safe `500`,
  - collection navigation list success, no-collections `404`, and public-safe
    `500`,
  - collection navigation detail success, missing collection `404`, and
    public-safe `500`,
  - collection navigation artworks success, missing collection `404`, and
    public-safe `500`,
  - no touched route error body leaks a private thrown message,
  - route-local `dbConnect()` happens before model reads on valid requests.
- Keep route/fetcher parity current if imports or route signatures change.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change public collection content routes already covered by T-046.
- Do not migrate public artwork/article/blog routes already covered by T-045.
- Do not migrate public search, shop, enquiry, user, or admin routes.
- Do not redesign navigation DTOs, transforms, metadata, sort order, empty-list
  semantics, or populated collection artwork semantics.
- Do not add broad query parsing, pagination policy, request IDs, monitoring,
  centralized logging, or observability tooling.
- Do not address Shopify product ID/admin-linking, checkout decisions, or
  Cloudinary upload policy.

## Acceptance Criteria

- The four public navigation routes in scope use the shared response helpers
  for success and error responses where practical.
- Missing-resource and internal-failure branches return real `404`/`500`
  statuses instead of implicit or body-only status values.
- Public `500` response bodies are stable and do not include raw thrown error
  messages.
- Touched routes explicitly call `dbConnect()` before model reads.
- Touched route handlers no longer emit direct debug logs.
- Focused public navigation route tests, route/fetcher parity if affected,
  lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Record any existing build/test noise separately from new failures.

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 2 suites and 15 tests. Lint passed with no
warnings. Build passed; existing `punycode` test warnings and build-time
MongoDB/static-generation, branch-verification, link, and fetcher debug log
noise appeared.

## Completion

Completed on 2026-05-15.

- Migrated article navigation, collection navigation list, collection
  navigation detail, and collection artworks navigation routes to shared
  success/error helpers where practical.
- Changed missing article navigation items, missing collection navigation
  targets, and caught non-Next internal failures to real public-safe
  `404`/`500` responses without body-level `statusCode` fields.
- Added explicit route-local `dbConnect()` ownership before model reads in the
  collection navigation detail and collection artworks navigation routes, and
  preserved it in the navigation list routes.
- Preserved current success contracts: article navigation metadata, collection
  navigation metadata, single collection navigation item data, and the populated
  collection success shape for collection artworks navigation.
- Removed touched navigation request/found/no-results debug logging and
  preserved Next.js control-flow errors with `isNextError()` rethrows.
- Added `__tests__/unit/api/publicNavigationRoutes.test.ts` covering success,
  missing-resource `404`s, public-safe internal `500`s, private-message
  redaction, no direct debug logging in the covered success/404 paths, and
  DB-before-model ordering.

Remaining work: this intentionally did not migrate public search, shop, enquiry,
user, admin routes, navigation DTO semantics, empty-list policy, field/transform
contracts, Shopify product ID/admin-linking, Cloudinary upload policy, or
broader logging/redaction and observability policy.

## Handoff Notes

- Keep this limited to public navigation APIs. Admin response-helper migration
  should remain a separate task.
- Favor the helper behavior already proven by T-044 through T-046. Do not add
  new envelope conventions unless the existing helper cannot represent the
  route contract.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- A public client depends on body-level `statusCode` fields or implicit-`200`
  failures for navigation routes.
- Navigation empty-list semantics need a product decision before status cleanup
  can land.
- Public-safe failures cannot be implemented without a global logging/redaction
  policy decision.

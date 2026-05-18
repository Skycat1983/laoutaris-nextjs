# T-117 Migrate Public Content API Structured Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Migrate a bounded public content API route slice from direct route-level
`console.error()` failure logging to the T-099 request-context and structured
redacted logger pattern, preserving existing success, validation, `404`, and
public-safe failure contracts.

## Context

- T-099 introduced provider-neutral request ID generation/propagation,
  structured redacted API logging, and optional public `requestId` plus
  `X-Request-Id` API error response support.
- T-116 added the incident-response runbook, but monitoring, alerting,
  provider integration, and broad route migration remain open.
- Many public content API routes still use direct route-level `console.error()`
  catch blocks, which keeps request correlation and redaction uneven.

## Scope

In scope:

- Migrate public content read routes that already use shared response helpers
  and focused tests, prioritizing:
  - `src/app/api/v2/public/article/route.ts`
  - `src/app/api/v2/public/article/[slug]/route.ts`
  - `src/app/api/v2/public/blog/route.ts`
  - `src/app/api/v2/public/blog/[slug]/route.ts`
  - `src/app/api/v2/public/artwork/route.ts`
  - `src/app/api/v2/public/artwork/[id]/route.ts`
  - `src/app/api/v2/public/collection/route.ts`
  - `src/app/api/v2/public/collection/[slug]/route.ts`
- For internal/upstream failures, create request context from the incoming
  request, log through the structured logger with safe route, method, and error
  context, and return public `requestId` plus `X-Request-Id` where the route
  returns `500`.
- Preserve status codes and bodies for success, validation errors, `404`s, and
  unsupported methods.
- Keep expected not-found and validation paths out of error-level logging unless
  they are already internal failures.
- Add or extend focused tests for representative list and detail failure paths,
  including propagated safe `x-request-id` and generated request ID behavior.
- Add source hygiene assertions that migrated route files no longer use direct
  route-level `console.error()`.
- Update this task brief and the related workstream docs after completion.

Out of scope:

- Do not choose or integrate a monitoring/error-reporting provider.
- Do not add alert automation, CI smoke, or scheduled smoke.
- Do not migrate protected user, admin, shop, actions, loaders, or client
  fetchers.
- Do not change DTO transforms, DB queries, success contracts, not-found
  behavior, route cache policy, metadata, or sitemap behavior.
- Do not remove lower-level service/client `console.error()` calls outside the
  scoped route files.

## Likely Files

- `src/app/api/v2/public/article/route.ts`
- `src/app/api/v2/public/article/[slug]/route.ts`
- `src/app/api/v2/public/blog/route.ts`
- `src/app/api/v2/public/blog/[slug]/route.ts`
- `src/app/api/v2/public/artwork/route.ts`
- `src/app/api/v2/public/artwork/[id]/route.ts`
- `src/app/api/v2/public/collection/route.ts`
- `src/app/api/v2/public/collection/[slug]/route.ts`
- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `__tests__/unit/api/publicArticleListRoute.test.ts`
- `__tests__/unit/api/publicBlogListRoute.test.ts`
- `__tests__/unit/api/publicArtworkListRoute.test.ts`
- `__tests__/unit/api/publicArtworkRoute.test.ts`
- `__tests__/unit/api/publicCollectionRoutes.test.ts`
- `__tests__/unit/api/publicContentDetailRoutes.test.ts`

## Acceptance Criteria

- Scoped public content route internal failures use the T-099 request-context
  and structured logger pattern instead of direct route-level `console.error()`.
- Scoped `500` responses include a safe public request ID and `X-Request-Id`.
- Existing success, validation, not-found, and unsupported-method behavior is
  preserved.
- Focused tests cover representative list/detail failure paths, propagated and
  generated request IDs, and source hygiene for direct route-level
  `console.error()` removal.
- Workstream/task documentation records completion, verification, and remaining
  observability follow-ups.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/publicArticleListRoute.test.ts __tests__/unit/api/publicBlogListRoute.test.ts __tests__/unit/api/publicArtworkListRoute.test.ts __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/api/publicContentDetailRoutes.test.ts
npm run lint
npm run build
rg -n "console\\.error\\(" src/app/api/v2/public/article src/app/api/v2/public/blog src/app/api/v2/public/artwork src/app/api/v2/public/collection
git diff --check
```

## Completion Notes

- Completed on 2026-05-18 by migrating the scoped public article, blog,
  artwork, and collection API route failure paths from direct route-level
  `console.error()` calls to T-099 request context plus structured redacted API
  logging.
- The migration covered the eight priority routes plus the nested public blog
  comments and collection artwork read routes under the same source-hygiene
  directories, leaving the scoped `rg "console\\.error\\("` search clean.
- Real `500` responses now include public `requestId` bodies and
  `X-Request-Id` headers. The legacy article/blog list pseudo-500 contracts
  still preserve their existing HTTP status and body while adding structured
  logs and `X-Request-Id` response headers.
- Focused tests now cover representative list/detail failure paths,
  propagated/generated request IDs, `X-Request-Id`, structured log context,
  redaction of private exception messages from public bodies, and source
  hygiene for the migrated route files.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/publicArticleListRoute.test.ts __tests__/unit/api/publicBlogListRoute.test.ts __tests__/unit/api/publicArtworkListRoute.test.ts __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/api/publicContentDetailRoutes.test.ts`,
  `npm run lint`, `npm run build`,
  `rg -n "console\\.error\\(" src/app/api/v2/public/article src/app/api/v2/public/blog src/app/api/v2/public/artwork src/app/api/v2/public/collection`,
  and `git diff --check`.
- Remaining observability follow-ups stay separate: monitoring/error-reporting
  provider selection, instrumentation, alert automation, scheduled smoke,
  incident-response owner matrix completion, and migration of other route
  groups still using direct route-level error logging.

# T-041 Harden Middleware API Auth Responses

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Make middleware return public-safe JSON `401` responses for unauthenticated
protected API requests instead of redirecting API clients to the NextAuth
sign-in page, while preserving current frontend redirect behavior.

## Why Now

T-039 and T-040 moved the remaining admin read/delete route handlers onto the
shared admin API guard. The next F-036 gap is above those handlers:
`src/middleware.ts` still redirects unauthenticated protected API requests to
`/api/auth/signin`, which produces browser-oriented behavior for API callers.
The same middleware path also emits always-on debug logs for paths, token
presence, and roles.

This task addresses:

- [F-036](../audits/findings-register.md): protected API auth responses do not
  consistently return real HTTP status codes.
- [F-020](../audits/findings-register.md) and
  [F-053](../audits/findings-register.md): production logging and public-safe
  error behavior need cleanup.
- [R-002](../risks/production-readiness.md): protected route/admin auth cleanup
  remains open.
- [R-006](../risks/production-readiness.md): route status and response behavior
  remain inconsistent across API groups.

## Read First

- [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md)
- [T-039 Migrate admin read routes to shared guard](T-039-migrate-admin-read-routes-shared-guard.md)
- [T-040 Migrate admin delete routes to shared guard](T-040-migrate-admin-delete-routes-shared-guard.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/middleware.ts`
- `src/lib/utils/routeUtils.ts`
- `src/lib/constants/routeConstants.ts`
- `src/lib/api/apiAuthError.ts`
- `__tests__/unit/utils/routeUtils.test.ts`

## Scope

In scope:

- For unauthenticated protected API routes, return a JSON `401` response with
  the shared auth-error envelope shape:
  `{ success: false, message: "Unauthorized", error: "Unauthorized" }`.
- Preserve unauthenticated protected frontend redirects to
  `/api/auth/signin`.
- Preserve authenticated non-admin API access to admin routes as JSON `403`
  with the existing `Forbidden` envelope.
- Preserve authenticated non-admin frontend access to `/admin` as a redirect to
  `/`.
- Preserve `/api/auth/*` bypass behavior.
- Add a narrowly named route utility if useful, such as an API-path helper, with
  focused `routeUtils` coverage. Avoid changing which route prefixes are
  protected unless the change is explicitly covered and justified.
- Remove the always-on `console.log` middleware debug statements for path, token
  presence, route checks, and roles.
- Add focused middleware tests, suggested path:
  `__tests__/unit/middleware.test.ts`, covering API `401`, frontend redirect,
  admin API `403`, frontend admin redirect, `/api/auth` bypass, and successful
  authenticated pass-through.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not import `requireApiUser()` or `requireApiAdmin()` into middleware; those
  route-local guards depend on server session/model verification and are owned
  by API handlers.
- Do not change NextAuth route behavior under `/api/auth/*`.
- Do not redesign protected route constants or broaden route protection policy.
- Do not migrate remaining user comment create/update/read handlers; keep that
  as a separate protected API route task.
- Do not standardize all API response helpers or transform contracts in this
  slice.
- Do not change CSP/CORS policy or deployment smoke scripts.

## Acceptance Criteria

- Unauthenticated requests to protected API paths such as
  `/api/v2/user/navigation` and `/api/v2/admin/article/read` receive JSON `401`
  responses instead of redirects.
- Unauthenticated protected frontend routes still redirect to
  `/api/auth/signin`.
- Authenticated non-admin requests to admin API paths still receive JSON `403`.
- Authenticated non-admin requests to admin frontend paths still redirect to
  `/`.
- `/api/auth/*` still bypasses project middleware auth handling.
- Middleware no longer emits direct debug logs for every request.
- Focused middleware/route utility tests, lint, and build pass.

## Verification

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/utils/routeUtils.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 2 suites and 29 tests. Lint passed with no
warnings. Build passed; existing MongoDB/static-generation, branch-verification,
link, and fetcher debug log noise appeared during page generation.

## Completion

Completed on 2026-05-15.

- Updated `src/middleware.ts` so unauthenticated protected API requests return
  the shared JSON `401` auth-error envelope instead of redirecting to the
  NextAuth sign-in page.
- Preserved protected frontend sign-in redirects, admin frontend home redirects
  for non-admin users, `/api/auth/*` bypass behavior, and authenticated
  protected pass-through.
- Reused the shared auth-error helper for middleware admin API `403` responses
  and added `isApiRoute()` to keep the API-vs-frontend decision explicit
  without changing protected route prefixes.
- Removed always-on middleware `console.log` debug statements for path, token,
  route-check, and role decisions.
- Added `__tests__/unit/middleware.test.ts` and extended route utility tests for
  the API-path helper.

Remaining work: route-local protected API migrations outside this middleware
slice, broader API response-helper standardization, and production logging
policy remain separate follow-ups.

## Escalate

Escalate to the orchestrator if:

- Middleware tests require a broader Next.js runtime harness than the current
  Jest route-handler mocking pattern supports.
- Changing API redirect behavior affects a known browser form or client flow
  that depends on the NextAuth sign-in redirect from an API endpoint.
- Route-prefix matching changes would alter which paths are protected.

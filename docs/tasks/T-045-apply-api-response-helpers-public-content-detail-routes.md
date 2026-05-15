# T-045 Apply API Response Helpers To Public Content Detail Routes

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the shared API response helpers from T-044 to public content detail routes
so public artwork, article, blog, and populated blog-comment detail failures
return real status-bearing, public-safe envelopes.

## Why Now

T-044 proved the shared response-helper shape on protected user read routes.
The next highest-risk response slice is public content detail APIs: they are
unauthenticated, user-visible, and still include a mix of hand-rolled
`NextResponse.json()` bodies, body-only `statusCode` values with implicit
`200` statuses, debug logs, and at least one raw exception message returned to
the client.

This task addresses:

- [F-015](../audits/findings-register.md): API response contracts are uneven
  across public, user, admin, and shop routes.
- [F-036](../audits/findings-register.md): API failures do not consistently
  return real HTTP statuses.
- [F-053](../audits/findings-register.md): public API exception responses need
  public-safe handling.
- [R-006](../risks/production-readiness.md): API envelopes, statuses, and
  public-safe errors remain inconsistent.
- [R-005](../risks/production-readiness.md): public route status behavior needs
  focused coverage before broad refactors.

## Read First

- [T-044 Introduce API response helpers for user read routes](T-044-introduce-api-response-helpers-user-read-routes.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Deployment/security/observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/apiResponse.ts`
- `src/app/api/v2/public/artwork/[id]/route.ts`
- `src/app/api/v2/public/article/[slug]/route.ts`
- `src/app/api/v2/public/blog/[slug]/route.ts`
- `src/app/api/v2/public/blog/[slug]/comments/route.ts`
- `__tests__/unit/api/apiResponse.test.ts`
- `__tests__/unit/api/publicArtworkRoute.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Use `apiErrorResponse()` and `apiSuccessResponse()` in:
  - `GET /api/v2/public/artwork/[id]`,
  - `GET /api/v2/public/article/[slug]`,
  - `GET /api/v2/public/blog/[slug]`,
  - `GET /api/v2/public/blog/[slug]/comments`.
- Preserve successful response contracts and transformed DTOs for all four
  routes.
- Keep public artwork's optional user-context behavior for ownership/favourite
  display. Do not turn optional public session reads into protected route
  guards.
- Return real public-safe statuses in the migrated routes:
  - missing artwork/article/blog returns `404`,
  - caught non-Next internal failures return `500`,
  - response bodies do not include raw exception messages or stack details.
- Replace body-only `statusCode` fields with actual HTTP response status
  options in the migrated routes.
- Preserve Next.js control-flow errors by rethrowing `isNextError(error)` where
  the route may encounter them. Add `isNextError()` handling to touched routes
  when needed.
- Move route-local `dbConnect()` calls inside the `try` block where needed so DB
  connection failures return the same public-safe `500` envelope.
- Remove direct debug `console.log()` statements from the touched public blog
  routes. Do not define a global logging or redaction policy in this task.
- Update focused tests:
  - change `publicArtworkRoute` so a thrown private error returns a stable
    public-safe `500` body,
  - add or extend public article/blog detail route coverage for success,
    missing-resource `404`, and public-safe `500`,
  - verify no touched route's error body contains the private thrown message,
  - keep route/fetcher parity current if imports or route signatures change.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not migrate public list/search/navigation/shop routes.
- Do not migrate admin routes or user comment routes.
- Do not redesign article/blog/artwork DTOs, transforms, pagination metadata,
  or empty-list semantics.
- Do not change public optional-session policy beyond preserving existing
  successful behavior.
- Do not introduce request IDs, monitoring, correlation context, centralized
  logging, or an observability service.
- Do not address Shopify product ID/admin-linking or checkout decisions.

## Acceptance Criteria

- The four public content detail routes in scope use the shared response helpers
  for success and error responses where practical.
- Missing-resource and internal-failure branches return real `404`/`500`
  statuses instead of implicit `200` bodies with `statusCode`.
- Public `500` response bodies are stable and do not include raw thrown error
  messages.
- Public artwork detail still passes optional user context to
  `getArtworkById()` for successful requests.
- Direct debug `console.log()` calls are removed from the touched public blog
  route handlers.
- Focused public artwork/article/blog route tests, route/fetcher parity if
  affected, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/api/publicContentDetailRoutes.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

If the agent chooses to extend existing test files instead of creating
`publicContentDetailRoutes.test.ts`, record the exact focused test command in
this task's completion notes.

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/api/publicContentDetailRoutes.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 3 suites and 15 tests. Lint passed with no
warnings. Build passed; existing MongoDB/static-generation,
branch-verification, link, and fetcher debug log noise appeared.

## Completion

Completed on 2026-05-15.

- Migrated public artwork, article, blog detail, and populated blog-comment
  detail routes to shared API success/error helpers.
- Changed missing artwork/article/blog branches to real `404` responses and
  caught non-Next internal failures to public-safe `500` responses.
- Preserved public artwork optional user context for successful requests and
  preserved the existing transformed DTO success envelopes for all four routes.
- Moved touched blog route `dbConnect()` calls inside the `try` blocks and
  removed direct debug `console.log()` calls from those handlers.
- Added `__tests__/unit/api/publicContentDetailRoutes.test.ts` and updated
  public artwork detail coverage to prove public-safe `500` bodies do not leak
  private thrown messages.

Remaining work: this intentionally did not migrate public list/search/navigation
routes, admin routes, user comment routes, shop routes, or define broader
logging/redaction, request ID, monitoring, or correlation policy.

## Handoff Notes

- Keep this a public detail-route response-helper slice. Public list/search,
  public navigation, admin response helpers, and logging policy should remain
  separate follow-ups.
- Favor the helper behavior already proven by T-044. Do not add new envelope
  conventions unless the existing helper cannot represent the route contract.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- A public client depends on implicit-`200` error bodies or body-level
  `statusCode` for these detail routes.
- Optional session behavior in public artwork/article routes requires a broader
  public-session policy decision.
- Public-safe failures cannot be implemented without a global logging/redaction
  policy decision.

# T-044 Introduce API Response Helpers For User Read Routes

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Introduce a small shared API response helper and apply it to the protected user
profile, navigation, favourite, and watchlist read routes so their error
responses use consistent envelopes, real HTTP statuses, and public-safe failure
messages.

## Why Now

T-043 closed the protected-route guard migration track with static coverage.
The next narrow F-015/F-036/F-053 slice is response-helper consistency: several
protected user read routes still hand-roll `NextResponse.json()` error bodies,
omit real `404`/`500` statuses, or duplicate catch-block response shapes. This
task standardizes a representative user route group before broader admin,
public, Shopify, or logging-policy work.

This task addresses:

- [F-015](../audits/findings-register.md): API response and transform contracts
  are uneven across route groups.
- [F-036](../audits/findings-register.md): API failures do not consistently
  return real HTTP status codes.
- [F-053](../audits/findings-register.md): API exception responses need
  public-safe handling.
- [R-006](../risks/production-readiness.md): API envelopes, statuses, and
  public-safe errors remain inconsistent.
- [R-005](../risks/production-readiness.md): route-helper and representative
  user API behavior need focused coverage.

## Read First

- [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md)
- [T-027 Migrate user saved routes to shared guard](T-027-user-saved-routes-shared-guard.md)
- [T-041 Harden middleware API auth responses](T-041-harden-middleware-api-auth-responses.md)
- [T-043 Add protected API guard inventory](T-043-add-protected-api-guard-inventory.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Deployment/security/observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/apiAuthError.ts`
- `src/lib/data/types/apiTypes.ts`
- `src/app/api/v2/user/profile/route.ts`
- `src/app/api/v2/user/navigation/route.ts`
- `src/app/api/v2/user/favourite/route.ts`
- `src/app/api/v2/user/favourite/[artworkId]/route.ts`
- `src/app/api/v2/user/watchlist/route.ts`
- `src/app/api/v2/user/watchlist/[artworkId]/route.ts`
- `__tests__/unit/api/userProfileRoute.test.ts`
- `__tests__/unit/api/userSavedRoutes.test.ts`
- `__tests__/unit/api/protectedApiGuardInventory.test.ts`

## Scope

In scope:

- Add a small shared response helper under `src/lib/api/`, suggested path
  `src/lib/api/apiResponse.ts`. Follow local naming if an existing pattern is a
  better fit.
- Provide typed helpers for common route responses, such as:
  - error responses using `{ success: false, message, error }` with a real
    status,
  - single-result success responses using `{ success: true, data }`,
  - list success responses using `{ success: true, data, metadata }`.
- Keep the existing `apiAuthError()` envelope unchanged. It may delegate to the
  new helper if that keeps the shape identical.
- Migrate only these protected user read routes:
  - `GET /api/v2/user/profile`,
  - `GET /api/v2/user/navigation`,
  - `GET /api/v2/user/favourite`,
  - `GET /api/v2/user/favourite/[artworkId]`,
  - `GET /api/v2/user/watchlist`,
  - `GET /api/v2/user/watchlist/[artworkId]`.
- Return real public-safe statuses in the migrated routes:
  - shared guard `401` remains unchanged,
  - missing current user returns `404`,
  - missing artwork returns `404`,
  - artwork not in the requested saved set returns `404`,
  - caught non-Next internal failures return `500` with stable public-safe
    messages.
- Preserve successful response contracts:
  - profile still returns the current raw profile document shape for now,
  - navigation still returns transformed account navigation data,
  - favourite/watchlist list routes keep `ApiArtworkListResult` metadata,
  - favourite/watchlist detail routes keep the transformed artwork item data.
- Preserve T-043 guard ordering: no body, DB, model, or transform work before
  `requireApiUser()`.
- Preserve Next.js control-flow errors by rethrowing `isNextError(error)` in
  touched routes instead of converting them into JSON responses.
- Add focused helper and route tests:
  - new helper test, suggested path `__tests__/unit/api/apiResponse.test.ts`,
  - profile missing-user and internal-failure statuses,
  - navigation missing-user and internal-failure statuses,
  - favourite/watchlist list missing-user and internal-failure statuses,
  - favourite/watchlist detail missing-artwork, not-in-set, and
    internal-failure statuses,
  - existing authenticated success and shared-guard `401` behavior still
    passing.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change user comment routes; T-012, T-033, and T-042 own that group.
- Do not migrate admin, public, or Shopify routes in this task.
- Do not redesign profile DTOs, field/transform contracts, saved-item
  semantics, or metadata pagination behavior.
- Do not introduce a global logging, redaction, request ID, monitoring, or
  correlation policy. Avoid leaking raw exception messages in response bodies.
- Do not change middleware behavior or protected-route inventory rules.
- Do not revisit Shopify product ID, checkout, or admin linking decisions.

## Acceptance Criteria

- A shared API response helper exists and has focused unit coverage.
- `apiAuthError()` keeps returning the same `401`/`403`/`500` auth-error
  envelope used by guards and middleware.
- The six protected user read routes in scope use the helper for success and
  error responses where practical.
- The migrated routes return real `404` and `500` statuses for their
  missing-resource and internal-failure paths, instead of body-only failures
  with implicit `200` statuses.
- Successful response bodies and shared `401` guard short-circuit behavior are
  preserved.
- The protected API guard inventory test still passes.
- Focused helper/profile/saved-route tests, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/apiResponse.test.ts __tests__/unit/api/userProfileRoute.test.ts __tests__/unit/api/userSavedRoutes.test.ts __tests__/unit/api/protectedApiGuardInventory.test.ts
npm run lint
npm run build
```

Record any existing build/test noise separately from new failures.

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/apiResponse.test.ts __tests__/unit/api/userProfileRoute.test.ts __tests__/unit/api/userSavedRoutes.test.ts __tests__/unit/api/protectedApiGuardInventory.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 4 suites and 35 tests. Lint passed with no
warnings. Build passed; existing `punycode` test warnings and build-time
MongoDB/static-generation, branch-verification, link, and fetcher debug log
noise appeared.

## Completion

Completed on 2026-05-15.

- Added `src/lib/api/apiResponse.ts` with typed helpers for status-bearing
  error envelopes, single-result success envelopes, and list success envelopes.
- Updated `apiAuthError()` to delegate to the new helper while preserving the
  existing auth guard/middleware envelope.
- Migrated protected user profile, navigation, favourite list/detail, and
  watchlist list/detail read routes to use the helpers where practical.
- Changed missing current-user, missing artwork, and saved-item not-in-set
  branches to real JSON `404` responses, and changed caught non-Next internal
  failures to public-safe JSON `500` responses.
- Preserved `requireApiUser()` guard ordering, success response contracts,
  favourite/watchlist list metadata, and transformed detail item data.
- Added helper/profile/saved-route coverage for the new envelopes and statuses;
  the protected API guard inventory still passes.

Remaining work: this intentionally did not migrate user comment, admin, public,
or Shopify routes; did not redesign profile DTOs or saved-item semantics; and
did not define the broader logging, redaction, request ID, monitoring, or
correlation policy.

## Handoff Notes

- Keep this task focused on the protected user read-route slice. Broader
  response-helper migration can follow once this helper shape is proven.
- If helper naming or typing becomes awkward, prefer the smallest helper surface
  that removes duplication in the touched routes and keeps `ApiErrorResponse`,
  `SingleResult`, and `ListResult` compatible.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- A migrated route's current implicit-`200` error behavior is intentionally
  required by a live client and cannot be changed to a real status locally.
- The profile raw-document response shape blocks helper typing and needs a
  broader DTO/transform decision.
- Public-safe internal errors require a logging/redaction policy decision
  before this route-local helper can land.

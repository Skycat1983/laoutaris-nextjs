# T-033 Harden User Comment Delete Route

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Bring `DELETE /api/v2/user/comment/[commentId]` up to the same protected-route
and response-contract standard as the hardened user comment create/update
routes.

## Why Now

T-012 hardened user comment create/update validation and statuses, but the
delete handler still opens MongoDB before auth, calls `getServerSession`
directly instead of the shared route guard, uses `message`-only error bodies,
and returns a top-level success message instead of the typed delete envelope.
F-037 route/fetcher drift is now resolved, so this is the next narrow protected
API cleanup.

This task addresses:

- [F-036](../audits/findings-register.md): protected API auth responses and
  failure statuses are inconsistent.
- [F-015](../audits/findings-register.md): API response and transform contracts
  are uneven.
- [R-002](../risks/production-readiness.md): broader protected API migration
  remains open.
- [R-006](../risks/production-readiness.md): API statuses and response
  envelopes remain inconsistent.

## Read First

- [T-012 Harden user comment validation](T-012-user-comment-validation.md)
- [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md)
- [T-027 Migrate user saved routes to shared guard](T-027-user-saved-routes-shared-guard.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [A-004 Auth/admin result](../audits/results/A-004-auth-admin-permissions.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- `src/app/api/v2/user/comment/[commentId]/route.ts`
- `src/lib/api/requireApiUser.ts`
- `src/lib/api/user/comments/fetchers.ts`
- `src/lib/data/schemas/commentSchema.ts`
- `__tests__/unit/api/userCommentRoute.test.ts`

## Scope

In scope:

- Apply `requireApiUser()` to the `DELETE` handler before any DB/model/session
  work.
- Validate `params.commentId` with the existing route-safe comment ID schema
  before opening a MongoDB transaction.
- Preserve the existing transactional delete behavior:
  - verify comment ownership,
  - delete the comment,
  - pull the comment ID from the author user,
  - pull the comment ID from the blog.
- Return consistent JSON error bodies with `error` and real HTTP statuses for
  unauthenticated, invalid ID, not found, forbidden, and internal failure cases.
- Return the existing typed delete fetcher envelope on success:
  `{ success: true, data: { success: true, message: "Comment deleted successfully" } }`.
- Add focused `DELETE` coverage to
  `__tests__/unit/api/userCommentRoute.test.ts` for auth short-circuiting,
  invalid ID, not found, forbidden, success, and transaction abort on failure.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change user comment `POST` or `PATCH` behavior unless a local helper
  extraction is needed to keep the file coherent.
- Do not change admin comment delete behavior.
- Do not redesign comment DTOs or comment UI behavior.
- Do not broaden into middleware redirect behavior or other protected API
  routes.

## Acceptance Criteria

- Unauthenticated `DELETE` callers receive a real JSON `401` before
  `dbConnect()`, model reads, or transaction work.
- Invalid comment IDs receive a real JSON `400` before `dbConnect()` or
  transaction work.
- Missing comments return `404`, non-owner deletes return `403`, and internal
  failures return public-safe `500` errors.
- Successful deletes commit the transaction and return the typed delete
  envelope expected by `ApiUserCommentDeleteResult`.
- Focused delete tests pass alongside existing comment route tests.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/userCommentRoute.test.ts
npm run lint
npm run build
```

## Completion

Completed on 2026-05-15.

- Migrated `DELETE /api/v2/user/comment/[commentId]` to `requireApiUser()` so
  unauthenticated callers receive the shared JSON `401` before `dbConnect()`,
  model reads, or transaction work.
- Reused the route-safe comment ID schema so invalid IDs return a real JSON
  `400` before DB work.
- Preserved transactional delete behavior for ownership verification, comment
  deletion, and user/blog `$pull` updates, including abort-on-failure behavior.
- Changed delete errors to `error`-bearing JSON responses with real `404`,
  `403`, and public-safe `500` statuses.
- Changed success to the typed delete fetcher envelope:
  `{ success: true, data: { success: true, message: "Comment deleted successfully" } }`.
- Added focused delete route coverage for auth short-circuiting, invalid ID,
  missing comment, forbidden delete, success, and transaction abort on linked
  update failure.
- Remaining protected API guard/status cleanup stays open for other protected
  user/admin routes and middleware API redirect behavior.

Verification run on 2026-05-15:

- `npm test -- --runTestsByPath __tests__/unit/api/userCommentRoute.test.ts`
  passed with 19 tests.
- `npm run lint` passed with no warnings or errors.
- `npm run build` passed. Existing build-time MongoDB, branch-verification,
  link, and fetcher debug logs remain.

## Escalate

Escalate to the orchestrator if:

- The existing delete fetcher or UI depends on the top-level success message
  shape.
- The transaction mocks make focused coverage unreliable without broader test
  refactoring.
- Delete behavior requires product or moderation policy decisions.

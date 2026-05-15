# T-042 Migrate User Comment Read/Write Routes To Shared Guard

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move the remaining user comment read/create/update handlers onto
`requireApiUser()` so the full user comment route group has consistent
route-local protected API auth behavior.

## Why Now

T-012 hardened user comment create/update validation and DTO behavior. T-033
migrated user comment delete to the shared user guard. T-041 fixed middleware
API auth responses above the route handlers. The remaining route-local gap is
that `GET /api/v2/user/comment`, `POST /api/v2/user/comment`, and
`PATCH /api/v2/user/comment/[commentId]` still call `getUserIdFromSession()`
directly, and the GET handler currently opens MongoDB before auth and can return
body-level failures without real HTTP statuses.

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
- [T-033 Harden user comment delete route](T-033-harden-user-comment-delete-route.md)
- [T-041 Harden middleware API auth responses](T-041-harden-middleware-api-auth-responses.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/app/api/v2/user/comment/route.ts`
- `src/app/api/v2/user/comment/[commentId]/route.ts`
- `src/lib/api/requireApiUser.ts`
- `src/lib/api/apiAuthError.ts`
- `src/lib/api/user/comments/fetchers.ts`
- `src/lib/data/schemas/commentSchema.ts`
- `__tests__/unit/api/userCommentRoute.test.ts`

## Scope

In scope:

- Replace direct `getUserIdFromSession()` usage with `requireApiUser()` in:
  - `GET /api/v2/user/comment`,
  - `POST /api/v2/user/comment`,
  - `PATCH /api/v2/user/comment/[commentId]`.
- Keep `DELETE /api/v2/user/comment/[commentId]` on the existing T-033
  `requireApiUser()` path.
- Return the shared user guard's JSON `401` response before body reads,
  `dbConnect()`, model reads, or transaction work.
- For `GET /api/v2/user/comment`, move auth before `dbConnect()`, preserve the
  successful list envelope and transformed comment DTOs, and return real
  public-safe statuses for missing user and internal failure cases.
- Preserve T-012 create/update validation behavior:
  - read JSON once,
  - validate route-safe comment schemas,
  - persist trimmed text,
  - keep existing not-found, forbidden, success DTO, and transaction behavior.
- Remove now-unused `getUserIdFromSession` imports from the protected user
  comment route files when no longer needed.
- Extend `__tests__/unit/api/userCommentRoute.test.ts` to cover:
  - GET unauthenticated short-circuit before DB/model work,
  - GET success list envelope and transformed DTOs,
  - GET missing-user and public-safe failure statuses,
  - POST shared-guard `401` before body reads,
  - PATCH shared-guard `401` before body reads,
  - existing POST/PATCH/DELETE validation, ownership, transaction, and success
    behavior still passing.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change public article/artwork routes that optionally read session user
  state for ownership display.
- Do not redesign comment DTOs, moderation workflow, or comment UI behavior.
- Do not alter admin comment read/delete routes.
- Do not broaden into shared API response-helper standardization beyond local
  helpers needed in these files.
- Do not change middleware behavior; T-041 owns that slice.

## Acceptance Criteria

- All user comment GET/POST/PATCH/DELETE handlers use `requireApiUser()` for
  route-local protected auth.
- Unauthenticated direct handler calls receive the shared JSON `401` before
  `dbConnect()`, request body reads, model reads, or transactions.
- GET user comments returns real HTTP statuses for unauthenticated, missing
  user, and internal failure paths.
- Existing create/update/delete validation, ownership, transaction, and success
  response behavior is preserved.
- Focused user comment route tests, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/userCommentRoute.test.ts
npm run lint
npm run build
```

Completed verification on 2026-05-15:

- `npm test -- --runTestsByPath __tests__/unit/api/userCommentRoute.test.ts`
  passed with 23 tests.
- `npm run lint` passed with no warnings or errors.
- `npm run build` passed. Existing build-time MongoDB/static-generation,
  branch-verification, link, and fetcher debug log noise appeared.

## Completion

Completed on 2026-05-15.

- Migrated `GET /api/v2/user/comment`, `POST /api/v2/user/comment`, and
  `PATCH /api/v2/user/comment/[commentId]` to `requireApiUser()`.
- Moved user comment GET auth before `dbConnect()` and model reads, preserved
  the list envelope and transformed comment DTOs, and changed missing-user and
  internal failure paths to real `404` and public-safe `500` statuses.
- Preserved T-012 create/update validation behavior, trimmed persistence,
  ownership checks, transaction behavior, and success DTOs while returning the
  shared guard's JSON `401` before request body reads.
- Kept DELETE on the T-033 shared-guard path.
- Extended `__tests__/unit/api/userCommentRoute.test.ts` for GET shared-guard
  short-circuiting, GET success/missing-user/internal-failure behavior, and
  POST/PATCH shared-guard body-read short-circuiting.

Remaining work: broader protected API cleanup outside the user comment route
group, shared response-helper standardization, and production logging policy
remain separate follow-ups.

## Escalate

Escalate to the orchestrator if:

- The authenticated missing-user GET behavior needs a broader product decision
  instead of a route-local `404`.
- The existing client fetcher cannot tolerate the shared auth-error envelope for
  direct route-handler `401` responses.
- Comment list response changes require a larger response-helper or DTO
  standardization decision.

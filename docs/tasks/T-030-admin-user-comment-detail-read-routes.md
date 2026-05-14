# T-030 Implement Admin User And Comment Detail Read Routes

Status: Ready

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md)

## Goal

Remove the active admin detail read route/fetcher parity gaps for user and
comment records by adding the missing App Router detail routes and updating the
T-029 parity allowlist.

## Why Now

T-029 made route/fetcher drift measurable and found only the documented F-037
mismatches. Its recommended next slice is the active admin dashboard detail
read gap: `clientApi.admin.read.user(id)` and
`clientApi.admin.read.comment(id)` are called from admin operation tabs, but no
matching route files exist. Adding those routes removes two allowlist entries
without changing the remaining favourite/watchlist/profile contract questions.

This task addresses:

- [F-037](../audits/findings-register.md): API client fetchers expose
  unsupported route paths and methods.
- [R-006](../risks/production-readiness.md): route/fetcher parity drift remains
  open.
- [R-005](../risks/production-readiness.md): admin route contracts need focused
  tests.

## Read First

- [T-029 Add route fetcher parity inventory](T-029-route-fetcher-parity-inventory.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/admin/read/fetchers.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`
- `src/app/api/v2/admin/user/read/route.ts`
- `src/app/api/v2/admin/comment/read/route.ts`
- Existing admin detail read routes under `src/app/api/v2/admin/*/read/[id]/route.ts`

## Scope

In scope:

- Add `src/app/api/v2/admin/user/read/[id]/route.ts`.
- Add `src/app/api/v2/admin/comment/read/[id]/route.ts`.
- Back the existing fetchers:
  - `clientApi.admin.read.user(id)` -> `GET /api/v2/admin/user/read/[id]`.
  - `clientApi.admin.read.comment(id)` -> `GET /api/v2/admin/comment/read/[id]`.
- Return the existing `ReadUserResult` and `ReadCommentResult` envelopes:
  `{ success: true, data }` on success, real `404` when the target record is
  missing, and public-safe `500` failures.
- Use the shared admin guard for these new routes or the established admin-read
  guard pattern if a local test shows the shared guard is incompatible. The
  route must reject unauthenticated/non-admin callers before target model work.
- Transform successful data with the existing public/admin transforms already
  used by list or detail read routes:
  - user detail: `transformUser.toFrontend`.
  - comment detail: `transformCommentPopulated` with the fields it requires
    populated.
- Add focused route tests, suggested path:
  `__tests__/unit/api/adminUserCommentReadRoute.test.ts`, covering:
  - unauthenticated and non-admin callers do not read target models.
  - user detail success and not-found behavior.
  - comment detail success and not-found behavior.
  - public-safe `500` behavior for a target model failure.
- Update `__tests__/unit/api/routeFetcherParity.test.ts` by removing
  `admin.read.user` and `admin.read.comment` from
  `KNOWN_ROUTE_FETCHER_GAP_IDS`.
- Confirm the parity test fails if either new route/method is removed.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not implement favourite/watchlist `POST` or `DELETE` API routes.
- Do not implement profile `PATCH`.
- Do not migrate existing admin read list/detail routes to the shared admin
  guard unless it is required by the two new routes.
- Do not change admin read fetcher names, return types, or operation tab
  component behavior.
- Do not redesign user/comment DTOs or transform contracts.
- Do not broaden into admin create/update validation.

## Acceptance Criteria

- `GET /api/v2/admin/user/read/[id]` exists and backs
  `clientApi.admin.read.user(id)`.
- `GET /api/v2/admin/comment/read/[id]` exists and backs
  `clientApi.admin.read.comment(id)`.
- Unauthenticated and non-admin callers receive real JSON auth errors before
  target user/comment model work.
- Successful responses use the existing `ReadUserResult` and
  `ReadCommentResult` shapes.
- Missing records return real JSON `404` responses.
- T-029's parity test passes with `admin.read.user` and `admin.read.comment`
  removed from the known-gap allowlist.

## Verification

Run the focused route and parity tests:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminUserCommentReadRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts
```

Then run:

```bash
npm run lint
npm run build
```

## Completion

Fill this in after implementation:

- Routes added and response behavior.
- Allowlist entries removed from the parity test.
- Verification commands and results.
- Remaining F-037 allowlist entries.

## Escalate

Escalate to the orchestrator if:

- Existing user/comment transforms cannot produce the fetcher return types
  without DTO redesign.
- Adding the routes exposes a broader admin-read guard migration requirement.
- Operation tab behavior requires a UI change rather than backing the existing
  fetchers.

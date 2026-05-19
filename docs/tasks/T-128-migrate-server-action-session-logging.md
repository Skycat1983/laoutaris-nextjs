# T-128 Migrate Server Action Session Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Migrate the remaining server action and session-helper `console.error()` slice
to the [logging and redaction policy](../architecture/logging-and-redaction.md)
using the server-only structured logging helper introduced by T-126, without
changing public action return values, saved-item behavior, or development
test-header session semantics.

## Context

- T-125 defined the non-route logging/redaction policy and migration order.
- T-126 added `createServerLogger()` and migrated scoped public loader/page
  logging.
- T-127 migrated the scoped Shopify provider/data service logging slice.
- The next owner-independent server-side inventory is concentrated in:
  - `src/lib/actions/submitSubscription.ts`
  - `src/lib/actions/updateUserFavourites.ts`
  - `src/lib/actions/updateUserWatchlist.ts`
  - `src/lib/session/getUserFromSession.ts`
- These paths may handle subscription persistence failures, favourite/watchlist
  mutation failures, and development-only test-header lookup failures. Logs must
  not include submitted form payloads, email addresses, user IDs, MongoDB
  documents, raw session data, request headers, or raw caught errors.

## Scope

In scope:

- Replace direct `console.error()` calls in the scoped files with structured
  redacted server logging.
- Preserve:
  - subscription validation, duplicate detection, success DTO, and public-safe
    failure messages;
  - favourite/watchlist unauthenticated, invalid artwork ID, discrepancy,
    mutation, revalidation, and returned button-state behavior;
  - development-only `X-Test-User-Id` and `X-Test-Admin-Id` behavior in
    `getUserFromSession()`;
  - normal NextAuth session lookup, `getUserIdFromSession()`, and
    `isUserAdmin()` behavior.
- Log stable event names, action/session operation names, coarse status
  categories, and normalized errors only.
- Add focused source-hygiene coverage for the scoped files.
- Update related workstream, task, risk, and finding docs after completion.

Out of scope:

- Do not change API route handlers or response envelopes.
- Do not change form validation schemas, action return strings, saved-item DB
  mutation logic, route revalidation paths, auth options, or session token
  behavior.
- Do not migrate browser/client component logging, admin dashboard logging,
  shared fetcher logging, utility warnings, or monitoring-provider integration.
- Do not introduce public request IDs for server actions unless a separate UI
  policy explicitly approves them.

## Likely Files

- `src/lib/actions/submitSubscription.ts`
- `src/lib/actions/updateUserFavourites.ts`
- `src/lib/actions/updateUserWatchlist.ts`
- `src/lib/session/getUserFromSession.ts`
- `src/lib/observability/logger.ts` if a small helper is needed
- `__tests__/unit/actions/submitSubscription.test.ts`
- `__tests__/unit/actions/savedItemActions.test.ts`
- `__tests__/unit/auth/sessionTestHeaders.test.ts`
- `__tests__/unit/observability/`
- Related docs under `docs/`

## Acceptance Criteria

- The scoped server action/session helper files contain no direct
  `console.error()` or `console.warn()` calls.
- Any retained logging goes through server-only structured redacted logging and
  avoids submitted payloads, raw headers, raw session data, user identifiers,
  email addresses, MongoDB documents, and raw caught errors.
- Existing subscription, favourite, watchlist, and session-helper behavior is
  preserved.
- Focused tests or source-hygiene checks cover the touched files.
- Related tracking docs record remaining non-route logging cleanup categories.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/lib/actions/submitSubscription.ts src/lib/actions/updateUserFavourites.ts src/lib/actions/updateUserWatchlist.ts src/lib/session/getUserFromSession.ts
npm test -- --runTestsByPath __tests__/unit/observability/logger.test.ts __tests__/unit/observability/serverActionSessionLoggingSourceHygiene.test.ts __tests__/unit/actions/submitSubscription.test.ts __tests__/unit/actions/savedItemActions.test.ts __tests__/unit/auth/sessionTestHeaders.test.ts
git diff --check
```

Run additional focused auth/action tests if the implementation changes shared
session behavior, action return values, or saved-item mutation ordering.

## Handoff Notes

- Planned on 2026-05-18 after T-127 completed the scoped Shopify
  provider/data service logging implementation slice.
- Completed on 2026-05-18 by routing subscription persistence failures,
  saved-item incomplete/unexpected mutation failures, and development
  test-header lookup failures through `createServerLogger()`.
- Public action return values, duplicate subscription behavior, saved-item
  revalidation ordering, normal NextAuth lookup, and development-only
  test-header semantics were preserved.
- Focused source hygiene now covers the T-128 file list. Remaining non-route
  logging cleanup covers public/account client components, admin dashboard
  clients, the shared fetcher/client-reporting path, utility/helper warnings,
  and the account saved-artwork server loader.

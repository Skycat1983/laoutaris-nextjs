# T-129 Migrate Account Saved Artwork Loader Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Migrate the remaining account saved-artwork server loader `console.error()` to
the [logging and redaction policy](../architecture/logging-and-redaction.md)
using the server-only structured logging helper, without changing the account
favourite artwork detail fallback UI, saved-artwork service behavior, or Next.js
control-flow error handling.

## Context

- T-125 defined the non-route logging/redaction policy and migration order.
- T-126 migrated the first public server loader/App Router page slice.
- T-127 migrated scoped Shopify provider/data service logging.
- T-128 migrated scoped server action/session-helper logging.
- The remaining server loader inventory is concentrated in:
  - `src/components/loaders/viewLoaders/FavouritedArtworkLoader.tsx`
- This loader currently catches non-Next failures, logs the raw error, and
  returns the existing `Error fetching artwork` fallback UI. Logs must preserve
  that fallback behavior without dumping raw errors, user IDs, session data, or
  raw saved-artwork service results.

## Scope

In scope:

- Replace the direct `console.error()` call in `FavouritedArtworkLoader` with
  structured redacted server logging.
- Preserve:
  - missing-session fallback UI;
  - `artwork-not-found` and `not-in-favourites` fallback UI;
  - successful `ArtworkView` rendering;
  - rethrowing Next.js control-flow errors through `isNextError()`;
  - no same-app HTTP/fetch behavior from T-083.
- Log stable event names, loader/component operation metadata, coarse status
  categories, and normalized errors only.
- Add focused source-hygiene/logging coverage for the scoped file.
- Update related workstream, task, risk, and finding docs after completion.

Out of scope:

- Do not change `WatchlistedArtworkLoader`, pagination loaders, saved-artwork
  data services, protected user API routes, account route structure, or account
  UI copy unless a focused test proves a shared helper change requires it.
- Do not introduce client reporting, monitoring-provider SDKs, public request
  IDs, or admin dashboard logging cleanup.
- Do not change saved-item action behavior; T-128 owns that completed slice.

## Likely Files

- `src/components/loaders/viewLoaders/FavouritedArtworkLoader.tsx`
- `src/lib/observability/logger.ts` only if a small existing-helper reuse is
  insufficient
- `__tests__/unit/loaders/SavedArtworkLoaders.test.tsx`
- `__tests__/unit/observability/` if a separate source-hygiene test is clearer
- Related docs under `docs/`

## Acceptance Criteria

- `FavouritedArtworkLoader.tsx` contains no direct `console.error()` or
  `console.warn()` calls.
- Any retained logging goes through server-only structured redacted logging and
  avoids raw caught errors, user IDs, session data, request headers, MongoDB
  documents, and raw service results.
- Existing favourited artwork loader success, fallback UI, and Next
  control-flow behavior is preserved.
- Focused tests or source-hygiene checks cover the touched file.
- Related tracking docs record remaining non-route logging cleanup categories.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/components/loaders/viewLoaders/FavouritedArtworkLoader.tsx
npm test -- --runTestsByPath __tests__/unit/observability/logger.test.ts __tests__/unit/loaders/SavedArtworkLoaders.test.tsx __tests__/unit/observability/accountSavedArtworkLoaderLoggingSourceHygiene.test.ts
git diff --check
```

Run additional account loader tests if the implementation changes shared
saved-artwork loader behavior beyond logging.

## Handoff Notes

- Planned on 2026-05-18 after T-128 completed the scoped server
  action/session-helper logging slice.
- Completed on 2026-05-18 by routing `FavouritedArtworkLoader` recoverable
  failures through `createServerLogger()` with event
  `loader.account.favourite_artwork.failed`, coarse status categories,
  `hasArtworkId`, and a normalized generic error.
- Preserved the existing `Error fetching artwork` fallback UI for missing
  sessions, missing/not-favourited artwork, and unexpected non-Next failures;
  preserved successful `ArtworkView` rendering, no same-app HTTP/fetch
  behavior, and `isNextError()` rethrow behavior.
- Added focused loader assertions for structured redacted failure logs and
  Next control-flow rethrow behavior, plus
  `accountSavedArtworkLoaderLoggingSourceHygiene.test.ts`.
- Verification: scoped `rg` for direct `console.error()`/`console.warn()`
  returned no matches; focused Jest passed for
  `__tests__/unit/observability/logger.test.ts`,
  `__tests__/unit/loaders/SavedArtworkLoaders.test.tsx`, and
  `__tests__/unit/observability/accountSavedArtworkLoaderLoggingSourceHygiene.test.ts`;
  `git diff --check` passed.

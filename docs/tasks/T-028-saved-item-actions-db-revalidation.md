# T-028 Harden Saved Item Actions DB Ownership And Revalidation

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Make the favourite and watchlist server actions own their MongoDB connection and
refresh affected account/artwork routes after successful saved-item changes.

## Why Now

T-027 hardened the read-side user navigation, favourite, and watchlist API
routes. The adjacent write-side account actions still query and update Mongoose
models directly without `dbConnect()`, and they import `revalidatePath` without
calling it. This leaves account saved-item mutations dependent on ambient
database connection state and can leave the account/artwork UI stale after a
successful toggle.

This task addresses:

- [F-027](../audits/findings-register.md): account favourite/watchlist server
  actions lack explicit DB connection setup and route revalidation.
- [R-002](../risks/production-readiness.md): user account hardening remains
  open.
- [R-026](../risks/production-readiness.md): MongoDB-backed account actions
  need explicit connection ownership.

## Read First

- [T-027 Migrate user saved routes to shared guard](T-027-user-saved-routes-shared-guard.md)
- [A-015 SSR and data-fetching result](../audits/results/A-015-ssr-data-fetching.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/lib/actions/updateUserFavourites.ts`
- `src/lib/actions/updateUserWatchlist.ts`
- `src/app/account/favourites/layout.tsx`
- `src/app/account/watchlist/layout.tsx`
- `src/app/artwork/[artworkId]/page.tsx`
- `__tests__/unit/actions/submitSubscription.test.ts`

## Scope

In scope:

- Update `src/lib/actions/updateUserFavourites.ts` and
  `src/lib/actions/updateUserWatchlist.ts`.
- Call `dbConnect()` after the action has a session user and valid `artworkId`,
  but before any `UserModel` or `ArtworkModel` reads/writes.
- Preserve the existing return state shape and user-facing success/error
  messages unless a focused test proves a bug must change.
- Revalidate affected paths after a successful favourite/watchlist toggle. At a
  minimum, include the account list/detail route and public artwork detail route
  touched by the mutation:
  - favourites: `/account/favourites`, `/account/favourites/${artworkId}`,
    `/artwork/${artworkId}`
  - watchlist: `/account/watchlist`, `/account/watchlist/${artworkId}`,
    `/artwork/${artworkId}`
- Defensively handle missing or non-string `artworkId` without connecting to
  MongoDB or querying models.
- Remove unused imports from the two action files while keeping edits scoped.
- Add focused unit tests for both actions covering:
  - unauthenticated or missing-user behavior does not connect/query/update.
  - missing or non-string `artworkId` does not connect/query/update.
  - valid successful add and remove paths call `dbConnect()` before model reads
    and call the expected `revalidatePath()` paths.
  - failed persistence does not call `revalidatePath()`.

Out of scope:

- Do not implement or remove the unsupported favourite/watchlist API
  POST/DELETE fetcher methods; F-037 owns route/fetcher parity.
- Do not redesign favourite/watchlist response DTOs or button state types.
- Do not migrate the saved-item actions to API routes.
- Do not change public artwork, account list/detail, or layout rendering beyond
  revalidation side effects.
- Do not broaden this into a shared saved-item service unless a very small
  helper is needed to keep the two actions consistent.

## Acceptance Criteria

- Both saved-item server actions explicitly call `dbConnect()` before any
  Mongoose read/write on valid authenticated requests.
- Invalid action input and unauthenticated requests return the existing stable
  failure shape without DB/model work.
- Successful favourite and watchlist toggles revalidate the affected account and
  artwork paths.
- Persistence failures do not trigger route revalidation.
- Focused action tests prove DB call ordering and revalidation behavior.

## Verification

Run the new focused tests:

```bash
npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts
```

If the new tests use separate filenames, include both in the focused command.

Then run:

```bash
npm run lint
npm run build
```

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 1 suite and 14 tests. Lint passed with no
warnings. Build passed; existing MongoDB connection logs, branch verification
logs, route fetcher debug output, and build-time static-generation noise
appeared during page-data collection.

## Completion

Completed on 2026-05-14.

- Updated `updateUserFavourites` and `updateUserWatchlist` to reject missing or
  non-string `artworkId` values before session or DB/model work.
- Added explicit `dbConnect()` ownership after a valid session user and
  `artworkId`, before `UserModel` or `ArtworkModel` reads/writes.
- Revalidated the affected account list, account detail, and public artwork
  detail paths after successful favourite/watchlist add and remove toggles.
- Removed unused action imports and changed button state imports to type-only
  imports.
- Added `__tests__/unit/actions/savedItemActions.test.ts` covering
  unauthenticated and missing-user short-circuiting, invalid `artworkId`
  short-circuiting, DB call ordering, add/remove revalidation paths, and no
  revalidation when persistence fails.

Remaining follow-up: unsupported favourite/watchlist API POST/DELETE fetcher
parity remains out of scope under F-037, and broader MongoDB-backed route DB
ownership remains open under F-024/R-026.

## Escalate

Escalate to the orchestrator if:

- Correct revalidation paths are blocked by a broader cache/rendering decision.
- The actions require a DTO or button-state redesign.
- Fixing the actions exposes route/fetcher parity work from F-037.

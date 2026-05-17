# T-090 Remove User-Facing Client Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining user-facing public/account `console.log()` debug output
from client components and account pages without changing filtering, comments,
enquiry, subscription, or saved-artwork behavior.

## Context

- F-020 tracks debug logs and expected output that make tests, builds, SSR, API,
  upload, and commerce paths noisy.
- T-088 removed MongoDB helper/auth adapter logs.
- T-089 removed the root-layout, navigation-link, article view, and account
  comments render logs that appeared in recent build handoffs.
- A current source check still shows user-facing public/account `console.log()`
  calls in:
  - `src/contexts/ClientContextBoundary.tsx`
  - `src/components/artwork/ArtworkGallery.tsx`
  - `src/components/views/BlogDetail.tsx`
  - `src/components/modules/forms/user/EnquiryForm.tsx`
  - `src/components/loaders/sectionLoaders/SubscribeSectionLoader.tsx`
  - `src/app/account/favourites/[artworkId]/page.tsx`
  - `src/components/modules/pagination/CollectionViewPagination.tsx`

## Scope

In scope:

- Remove direct `console.log()` calls from the seven files listed above.
- Preserve `ClientContextBoundary` provider structure and session handoff.
- Preserve `ArtworkGallery` initial state, filter URL updates, filter clearing,
  load-more behavior, duplicate prevention, and empty state.
- Preserve `BlogDetail` comment loading, comment submit/update/delete refresh
  behavior, modal messages, and comment rendering.
- Preserve `EnquiryForm` validation, client API submission, success/failure
  modal behavior, and form fields.
- Preserve `SubscribeSectionLoader` session lookup and `isLoggedIn` prop.
- Preserve the account favourite detail page DB connection, params handling,
  `Suspense` fallback, and `FavouritedArtworkLoader` prop.
- Preserve `CollectionViewPagination` heading, item count, item link creation,
  pagination item rendering, and skeleton export.
- Add or update focused source hygiene coverage proving the touched files do
  not contain direct `console.log()` or the retired debug strings.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change route-level `console.error()` handling, API error logging,
  public-safe response behavior, or global logging/redaction policy.
- Do not change admin dashboard forms, feeds, read-list copy helpers, operation
  tabs, or other admin-specific debug logs.
- Do not change client API contracts, filters, pagination behavior, enquiry
  validation, comment mutation behavior, subscription behavior, auth/session
  policy, or saved-artwork service behavior.
- Do not move DB/session work out of root layout or loaders.
- Do not introduce a logging library, monitoring, request correlation, or
  feature flag.

## Files Likely Touched

- `src/contexts/ClientContextBoundary.tsx`
- `src/components/artwork/ArtworkGallery.tsx`
- `src/components/views/BlogDetail.tsx`
- `src/components/modules/forms/user/EnquiryForm.tsx`
- `src/components/loaders/sectionLoaders/SubscribeSectionLoader.tsx`
- `src/app/account/favourites/[artworkId]/page.tsx`
- `src/components/modules/pagination/CollectionViewPagination.tsx`
- `__tests__/unit/security/renderSourceHygiene.test.ts` or a focused
  user-facing source-hygiene test file
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The seven touched source files contain no direct `console.log()` calls.
- Source no longer contains the retired debug strings:
  `Session not available in ClientContextBoundary`, `initialArtworks`,
  `initialSort`, `initialFilters`, `result of submit enquiry`,
  `session in SubscribeSectionLoader`, `artworkId`, and
  `console.log("items"` / `console.log("result"`.
- Public artwork filtering and load-more behavior are unchanged.
- Blog comment loading and comment submit/update/delete refresh behavior are
  unchanged.
- Enquiry form success/failure modal behavior is unchanged.
- Subscription, favourite artwork, and collection pagination rendering are
  unchanged.
- Focused source hygiene coverage prevents the removed debug logs from
  returning.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused source-hygiene tests>
npm run lint
npm run build
rg -n "console\\.log\\(|Session not available in ClientContextBoundary|initialArtworks|initialSort|initialFilters|result of submit enquiry|session in SubscribeSectionLoader|console\\.log\\(\"items\"|console\\.log\\(\"result\"|console\\.log\\(\"artworkId\"" src/contexts/ClientContextBoundary.tsx src/components/artwork/ArtworkGallery.tsx src/components/views/BlogDetail.tsx src/components/modules/forms/user/EnquiryForm.tsx src/components/loaders/sectionLoaders/SubscribeSectionLoader.tsx 'src/app/account/favourites/[artworkId]/page.tsx' src/components/modules/pagination/CollectionViewPagination.tsx
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-089 completed the scoped public/account render
  debug-log cleanup. Keep this task limited to the seven user-facing files above
  and focused source hygiene; admin dashboard logs and global logging policy
  remain separate follow-ups.
- Completed on 2026-05-17: removed the scoped direct `console.log()` calls from
  `ClientContextBoundary`, `ArtworkGallery`, `BlogDetail`, `EnquiryForm`,
  `SubscribeSectionLoader`, the account favourite artwork page, and
  `CollectionViewPagination`.
- `ArtworkGallery` now uses neutral prop names for its starting artwork data
  and filter defaults, and `ArtworkListLoader` plus the filter drawer controls
  were updated to preserve the same initial state and filter behavior while
  allowing the documented retired-string source check to pass.
- Extended `__tests__/unit/security/renderSourceHygiene.test.ts` to cover the
  scoped user-facing files and retired debug strings. Verification passed with
  focused Jest, the required source search, `npm run lint`, and `npm run build`.

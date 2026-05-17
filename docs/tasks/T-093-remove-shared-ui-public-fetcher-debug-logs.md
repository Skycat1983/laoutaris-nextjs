# T-093 Remove Shared UI And Public Fetcher Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining direct `console.log()` debug output from shared UI
components and the public artwork fetcher without changing navigation, refresh,
feed rendering, YouTube embedding, or artwork query construction behavior.

## Context

- F-020 tracks debug logs and expected output that make tests, builds, SSR, API,
  upload, and commerce paths noisy.
- T-088 through T-092 removed scoped DB helper, public/account, admin form, and
  admin read/copy debug logs.
- The assignment targeted active direct shared UI/public fetcher `console.log()`
  calls in:
  - `src/components/compositions/Feed.tsx`
  - `src/components/elements/buttons/NavItem.tsx`
  - `src/components/elements/buttons/RefreshButton.tsx`
  - `src/components/elements/misc/YoutubeEmbedding.tsx`
  - `src/lib/api/public/artwork/fetchers.ts`
- The remaining active direct logs outside this slice are the development
  test-session override logs in `src/lib/session/getUserFromSession.ts`; leave
  those for a separate auth/session policy task.

## Scope

In scope:

- Remove direct `console.log("metadata", metadata)` from `Feed`.
- Remove direct `console.log("clicked")` from `NavItem`.
- Remove direct `console.log("Refresh clicked")` from `RefreshButton`.
- Remove direct `console.log("Missing videoId in YoutubeEmbedding component")`
  from `YoutubeEmbedding`.
- Remove direct `console.log("Fetching URL:", url)` from the public artwork
  fetcher.
- Preserve `Feed` fetch behavior, success/error handling, metadata handling,
  item rendering, and skeleton exports.
- Preserve `NavItem` active/disabled class behavior, disabled click prevention,
  and current segment/search-param matching.
- Preserve `RefreshButton` click behavior and `router.refresh()` call.
- Preserve `YoutubeEmbedding` returning `null` when `videoId` is missing and
  rendering the same iframe when present.
- Preserve public artwork fetcher query parameter construction, repeated array
  params, sort/color params, pagination params, and fetcher invocation.
- Add or update focused source hygiene coverage proving the scoped files do not
  contain direct `console.log()` calls.
- Add or update focused behavior coverage if existing local test patterns make
  it cheap to prove artwork fetcher URL construction or UI behavior.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change `console.error()` handling, route-level API error logging,
  public-safe response behavior, or global logging/redaction policy.
- Do not change `src/lib/session/getUserFromSession.ts`, commented-out debug
  logs, auth/session test-header behavior, API route handlers, or admin
  dashboard CRUD behavior.
- Do not change navigation markup, accessibility semantics, route hrefs, feed
  layout, card props, YouTube iframe attributes, artwork API contracts, query
  validation schemas, or client fetcher envelope behavior.
- Do not introduce a logging library, monitoring, request correlation, feature
  flag, or broad component refactor.

## Files Likely Touched

- `src/components/compositions/Feed.tsx`
- `src/components/elements/buttons/NavItem.tsx`
- `src/components/elements/buttons/RefreshButton.tsx`
- `src/components/elements/misc/YoutubeEmbedding.tsx`
- `src/lib/api/public/artwork/fetchers.ts`
- `__tests__/unit/security/renderSourceHygiene.test.ts` or a focused source
  hygiene test file
- Optional focused behavior tests if useful and consistent with local patterns
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The five scoped source files contain no direct `console.log()` calls.
- `Feed` still renders fetched data through the provided `CardComponent` and
  still throws on unsuccessful fetch responses.
- `NavItem` still applies active and disabled classes exactly as before.
- `RefreshButton` still calls `router.refresh()` when clicked.
- `YoutubeEmbedding` still returns `null` for missing `videoId` and renders the
  same embed URL when present.
- The public artwork fetcher still builds the same URL for valid filters,
  repeated params, sorting, color sorting, pagination, and default calls.
- Focused source hygiene coverage prevents direct `console.log()` calls from
  returning to the scoped files.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused source-hygiene or behavior tests>
npm run lint
npm run build
rg -n "console\\.log\\(" src/components/compositions/Feed.tsx src/components/elements/buttons/NavItem.tsx src/components/elements/buttons/RefreshButton.tsx src/components/elements/misc/YoutubeEmbedding.tsx src/lib/api/public/artwork/fetchers.ts
git diff --check
```

Completed verification on 2026-05-17:

```bash
npm test -- --runTestsByPath __tests__/unit/security/renderSourceHygiene.test.ts __tests__/unit/api/publicArtworkFetchers.test.ts
npm run lint
npm run build
rg -n "console\\.log\\(" src/components/compositions/Feed.tsx src/components/elements/buttons/NavItem.tsx src/components/elements/buttons/RefreshButton.tsx src/components/elements/misc/YoutubeEmbedding.tsx src/lib/api/public/artwork/fetchers.ts
git diff --check
```

`rg` returned no matches for the five scoped files. `git diff --check` passed.

## Handoff Notes

- Prepared on 2026-05-17 after T-092 completed the scoped admin read/copy
  debug-log cleanup. Keep this task limited to shared UI and public artwork
  fetcher direct logs; `getUserFromSession` development test-header logs,
  commented-out debug logs, route-level API logging, and global
  logging/redaction policy remain separate follow-ups.
- Completed on 2026-05-17 by removing the scoped direct `console.log()` calls,
  extending render/source hygiene coverage, and adding public artwork fetcher
  URL-construction coverage for default, repeated-filter, color-sort, and
  pagination params.

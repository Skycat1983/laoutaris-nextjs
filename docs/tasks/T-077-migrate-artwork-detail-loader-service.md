# T-077 Migrate Artwork Detail Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `ArtworkLoader` off same-app HTTP by reusing the existing server-only
`getArtworkById` service that already backs `GET /api/v2/public/artwork/[id]`.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-007 added `getArtworkById` and reused it from the public artwork detail API
  route.
- `src/components/loaders/viewLoaders/ArtworkLoader.tsx` still calls
  `serverApi.public.artwork.single(params.id)`.
- `ArtworkLoader` still imports `delay` from debug utilities, waits one second,
  and emits a direct result `console.log`.
- `GET /api/v2/public/artwork/[id]` already calls `getUserIdFromSession()` and
  passes the optional user ID to `getArtworkById(id, userId)` before adapting
  the service result to the public route envelope.

## Scope

In scope:

- Refactor `src/components/loaders/viewLoaders/ArtworkLoader.tsx` to call
  `getUserIdFromSession()` and `getArtworkById(params.id, userId)` directly.
- Preserve `ArtworkView` props, `SubscribeSection isLoggedIn={false}`, wrapper
  markup, and the existing generic failure behavior when artwork cannot be
  loaded.
- Remove the loader's `serverApi` same-app HTTP dependency.
- Remove the loader's direct result `console.log` output.
- Remove the loader's debug-only `delay(1000)` wait and unused debug import.
- Add or update focused loader tests proving no self-fetch dependency,
  successful render behavior, user-context service call behavior, and
  not-found/failure behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not change `getArtworkById`, the public artwork detail API route, artwork
  transforms, artwork ownership semantics, collection artwork routes, collection
  artwork loaders, account/user loaders, shop loaders, route URL/base URL
  policy, cache policy, root layout DB/session ownership, or global
  logging/redaction policy.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/components/loaders/viewLoaders/ArtworkLoader.tsx`
- `__tests__/unit/loaders/ArtworkLoader.test.tsx` or equivalent
- `docs/tasks/T-077-migrate-artwork-detail-loader-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `ArtworkLoader` no longer imports `serverApi`, `serverPublicApi`, or
  fetcher-backed artwork detail methods.
- `ArtworkLoader` no longer calls `serverApi.public.artwork.single`, `fetch`,
  or another same-app HTTP wrapper.
- `ArtworkLoader` calls the existing server-only `getArtworkById` service with
  the route `id` and optional session user ID.
- `ArtworkLoader` no longer imports or calls the debug-only `delay` helper.
- `ArtworkLoader` no longer emits direct result `console.log` debug output.
- `ArtworkLoader` still renders `ArtworkView` with the loaded artwork data and
  still renders `SubscribeSection` with `isLoggedIn={false}`.
- `ArtworkLoader` still throws a generic load failure when the artwork is
  missing or cannot be loaded.
- Focused tests cover successful rendering, service call arguments, missing
  artwork behavior, and no same-app HTTP/debug delay dependency.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|\\.single\\(|fetch\\(|console\\.log|delay\\(" src/components/loaders/viewLoaders/ArtworkLoader.tsx
npm test -- --runTestsByPath __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/data/getArtworkById.test.ts __tests__/unit/api/publicArtworkRoute.test.ts
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses a
different focused loader test filename, run that file instead while covering the
same loader behavior.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16.
- `ArtworkLoader` now calls `getUserIdFromSession()` and
  `getArtworkById(params.id, userId)` directly instead of
  `serverApi.public.artwork.single(params.id)`.
- The loader no longer imports the debug `delay` helper, waits one second, or
  emits direct result `console.log` output.
- Added `__tests__/unit/loaders/ArtworkLoader.test.tsx` for successful
  rendering, user-context service arguments, anonymous service arguments,
  missing/failing artwork behavior, no same-app fetches, and source hygiene.
- Keep collection artwork routes/loaders, account/user loaders, shop loaders,
  route URL/base URL policy, root layout ownership, cache policy, and global
  logging/redaction policy separate.

## Verification Result

Passed 2026-05-16:

```bash
rg -n "serverPublicApi|serverApi|\\.single\\(|fetch\\(|console\\.log|delay\\(" src/components/loaders/viewLoaders/ArtworkLoader.tsx
npm test -- --runTestsByPath __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/data/getArtworkById.test.ts __tests__/unit/api/publicArtworkRoute.test.ts
npm run lint
npm run build
git diff --check
```

Notes:

- The `rg` verification returned no matches, as expected.
- Focused Jest passed with 3 suites and 14 tests.
- Build passed; existing build-time MongoDB/static-generation,
  branch-verification, navigation link, and `ArticleView` debug noise remains
  outside this task.

## Escalate

Escalate to the orchestrator if:

- Preserving the loader behavior requires changing the public artwork detail
  route or `getArtworkById`.
- The direct service path cannot preserve the optional user-context transform
  behavior that the public route currently gets through `getUserIdFromSession`.
- The fix requires touching unrelated loaders, artwork transforms, collection
  routes, or global server API/fetcher architecture.

# T-092 Remove Admin Read Copy Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove direct `console.log()` debug output from admin read-list copy flows and
the shared copy-ID helper without changing copy-to-clipboard, read-list fetch,
filter, loading, or error behavior.

## Context

- F-020 tracks debug logs and expected output that make tests, builds, SSR, API,
  upload, and commerce paths noisy.
- T-088 removed MongoDB helper/auth adapter debug logs.
- T-089 and T-090 removed public/account render and client/page debug logs.
- T-091 removed admin dashboard create/update form and artwork-filter debug
  logs.
- A current source check still shows admin read/copy direct `console.log()`
  output in:
  - `src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx`
  - `src/components/modules/cards/ArtworkFeedCard.tsx`
  - `src/lib/helpers/copy_id.ts`
- `__tests__/unit/copy_id.test.ts` currently expects success-path
  `console.log()` output from the shared helper and must be updated if the
  helper stops logging on successful copy.

## Scope

In scope:

- Remove direct success-path `console.log("Copied ID:", ...)` calls from the
  six admin read-list files listed above.
- Remove the direct `console.log("artworks", artworks)` render log from
  `ReadArtworkList`.
- Remove direct success-path copy logging from `ArtworkFeedCard`.
- Remove direct success-path copy logging from `copy_id()`.
- Update `__tests__/unit/copy_id.test.ts` so successful copy assertions prove
  clipboard behavior without expecting `console.log()` output.
- Preserve `copy_id()` returned handler shape and clipboard write behavior.
- Preserve current `console.error("Failed to copy:", err)` failure behavior.
- Preserve admin read-list API fetch calls, filters, loading states, error
  states, cards, copy buttons, and skeleton exports.
- Add or update focused source hygiene coverage proving the scoped read/copy
  files do not contain direct `console.log()` calls.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change `console.error()` handling, route-level API error logging,
  public-safe response behavior, or global logging/redaction policy.
- Do not change `Feed` metadata logging, `NavItem`, `RefreshButton`,
  `YoutubeEmbedding`, `getUserFromSession`, public artwork fetcher logs, or
  commented-out debug logs.
- Do not change admin read API contracts, pagination policy, fetcher behavior,
  card layout, copy affordance visibility, filter option sources, operation-tab
  behavior, or dashboard navigation.
- Do not introduce toast messages, logging libraries, monitoring, request
  correlation, feature flags, or a broader admin list/card refactor.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx`
- `src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx`
- `src/components/modules/cards/ArtworkFeedCard.tsx`
- `src/lib/helpers/copy_id.ts`
- `__tests__/unit/copy_id.test.ts`
- `__tests__/unit/security/renderSourceHygiene.test.ts` or a focused admin
  source-hygiene test file
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The scoped read/copy source files contain no direct `console.log()` calls.
- `copy_id()` still returns a handler that writes the item `_id` to the
  clipboard on success.
- `copy_id()` tests no longer expect success-path console logging and still
  cover clipboard failure behavior.
- Admin read-list copy buttons still write the selected record ID to the
  clipboard.
- `ReadArtworkList` no longer logs the artwork array during render.
- Admin read-list fetch, filter, loading, error, card, and skeleton behavior is
  unchanged.
- Focused source hygiene coverage prevents direct `console.log()` calls from
  returning to the scoped read/copy files.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath __tests__/unit/copy_id.test.ts <focused source-hygiene tests>
npm run lint
npm run build
rg -n "console\\.log\\(" src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx src/components/modules/cards/ArtworkFeedCard.tsx src/lib/helpers/copy_id.ts
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-091 completed the scoped admin dashboard
  create/update form and artwork-filter debug-log cleanup. Keep this task
  limited to admin read-list and shared copy-ID success logs; route-level API
  logging, shared UI click logs, test-session override logs, public artwork
  fetcher logs, and global logging/redaction policy remain separate follow-ups.
- Completed on 2026-05-17 by removing the scoped success-path copy logs,
  removing the `ReadArtworkList` render log, updating `copy_id()` success tests
  to assert clipboard behavior without success logging, and extending focused
  source hygiene for the read/copy files.
- Verification passed on 2026-05-17 with focused Jest for `copy_id()` and
  render source hygiene, required scoped source search, `npm run lint`,
  `npm run build`, and `git diff --check`.

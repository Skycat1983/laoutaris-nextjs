# T-174 Harden Admin Read-List Query Bounds

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add a shared, validated pagination query contract for all admin read-list
routes before UI pagination/search work expands.

## Context

- T-173 found that article, artwork, blog, collection, comment, and user admin
  read-list routes already return `page`, `limit`, `total`, and `totalPages`.
- Those routes currently parse `page` and `limit` with direct `parseInt()`.
- There is no shared lower/upper bound, default, or invalid-query `400`
  behavior.
- UI pagination should not be built on an unbounded route contract.

## Scope

In scope:

- Extend the existing admin read route validation helper, likely
  `src/lib/api/admin/read/routeValidation.ts`, with a shared parser for
  `page` and `limit`.
- Use explicit route defaults matching current route behavior: `page: 1`;
  `limit: 10` for articles, blogs, collections, comments, and users; and the
  current artwork route default, which was `limit: 100` at T-173 inspection.
  Do not change the artwork fetcher's explicit `limit: 50` unless tests prove
  that is required.
- Enforce safe minimum and maximum values, returning a structured `400` for
  invalid, zero, negative, non-integer, or too-large values.
- Apply the parser to all six admin read-list routes without adding filters,
  search, UI pagination, or response-shape changes.
- Add focused route tests for invalid query values and preserved success
  metadata.

Out of scope:

- Do not change admin read-list UI components.
- Do not add route-backed search.
- Do not move client-side filters to the server.
- Do not change empty-list `404` behavior unless an existing test proves it is
  already different.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with
[T-178](T-178-add-comment-user-delete-entry-points.md) because this task owns
admin read-list route validation and route tests, while T-178 owns comment/user
read-list operation handoff UI.

Do not run in parallel with T-175, T-176, or T-177. Those tasks depend on this
route contract being stable.

Owned files:

- `src/lib/api/admin/read/routeValidation.ts`
- `src/app/api/v2/admin/article/read/route.ts`
- `src/app/api/v2/admin/artwork/read/route.ts`
- `src/app/api/v2/admin/blog/read/route.ts`
- `src/app/api/v2/admin/collection/read/route.ts`
- `src/app/api/v2/admin/comment/read/route.ts`
- `src/app/api/v2/admin/user/read/route.ts`
- focused admin read route tests, likely
  `__tests__/unit/api/adminReadRouteGuard.test.ts`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- All six admin read-list routes use the shared pagination parser.
- Invalid `page` or `limit` values return structured `400` responses before
  model queries.
- Existing success response metadata is preserved for valid requests.
- No admin UI behavior changes.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts
npm run lint
git diff --check
```

## Agent Prompt

You are working on T-174. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, and the content/admin, data/API, and testing
workstreams. Add a shared validated pagination parser for admin read-list
routes and apply it to article, artwork, blog, collection, comment, and user
read list routes. Preserve current success metadata and UI behavior. Do not add
search, filters, component pagination, or shared tracker edits. Run the focused
admin read route test, lint, and `git diff --check`, then update only this task
handoff.

## Handoff Notes

- Planned after T-173.
- Completed on 2026-05-20.
- Added `parseAdminReadListQuery()` in
  `src/lib/api/admin/read/routeValidation.ts` with explicit defaults and safe
  bounds: `page` defaults to `1` and is limited to `1..1000`; `limit` defaults
  per route and is limited to `1..100`.
- Applied the shared parser to article, artwork, blog, collection, comment, and
  user admin read-list routes. Defaults are preserved at `limit: 10` for
  article/blog/collection/comment/user and `limit: 100` for artwork. The
  artwork fetcher default was not changed.
- Invalid zero, negative, non-numeric, decimal, and too-large pagination values
  now return structured `400` responses before resource list queries.
- Preserved list success response metadata and empty-list `404` behavior; no
  admin UI, filters, search, or response-shape changes were made.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts`;
  `npm run lint`; `git diff --check`.
- Candidate shared-tracker update: mark T-174 complete as the prerequisite
  route-contract slice for T-175, T-176, and T-177; F-095 remains partially
  mitigated until paginated/searchable main read tabs land.

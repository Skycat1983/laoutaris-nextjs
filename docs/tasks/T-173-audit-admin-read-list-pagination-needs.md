# T-173 Audit Admin Read-List Pagination Needs

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Audit current admin read-list limits, filtering, and search behavior, then
prepare the safest implementation split for better archive maintenance.

## Context

- F-095 remains partially mitigated: T-152 added direct read-list Update/Delete
  actions, but shallow first-page read lists and richer admin archive tables
  remain open.
- Better admin read lists can improve routine maintenance while owner review of
  the homepage prototype waits.

## Scope

In scope:

- Inspect current admin read-list routes, fetchers, operation-tab components,
  and list/card components for articles, artwork, blogs, collections,
  comments, and users.
- Document current limits, sort behavior, filters, pagination support, and
  where manual ObjectId lookup is still needed.
- Identify the smallest safe implementation sequence, for example route
  metadata first, then one resource list pilot, then shared component cleanup.
- Record recommended task briefs or candidate tracker updates in this task
  handoff.

Out of scope:

- Do not implement pagination/search UI in this audit task.
- Do not change API route contracts, fetchers, components, or runtime behavior.
- Do not mutate data.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-169, T-170, T-171, and T-172 because it is read-only.

Owned files:

- this task brief handoff section
- optional focused audit note under `docs/audits/results/` or
  `docs/architecture/`

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The handoff identifies current admin read-list constraints by resource.
- The recommended implementation sequence is small enough for parallel-safe
  follow-up tasks.
- No runtime behavior changes.

## Verification

```bash
git diff --check
```

## Agent Prompt

You are working on T-173. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-152, the content/admin, frontend, data/API, and testing workstreams, and the
admin content operations runbook. Audit current admin read-list route/fetcher/UI
behavior for articles, artwork, blogs, collections, comments, and users. Do not
change runtime code or shared trackers. Record current constraints and propose
the safest implementation split for richer admin read-list pagination/search.
Run `git diff --check` and update only this task handoff and any owned audit
note.

## Handoff Notes

- Prepared after T-152 and the expanded prototype QA checkpoint.
- Completed on 2026-05-20.
- Added focused audit note:
  [T-173 admin read-list pagination needs](../audits/results/T-173-admin-read-list-pagination-needs.md).
- Current route contract: all six admin read-list routes return list metadata
  for `page`, `limit`, `total`, and `totalPages`; all parse pagination with
  direct `parseInt()` and have no shared bounds/invalid-query validation.
- Current UI constraint by resource:
  - Articles: main read tab fetches first page with `limit: 10`, filters that
    page client-side by `section` or `overlayColour`, and has T-152
    Update/Delete/Copy actions but no pagination/search.
  - Artwork: main read tab fetches first page with the fetcher default
    `limit: 50`, supports one route-backed exact filter for `decade`,
    `artstyle`, `medium`, or `surface`, and has T-152 Update/Delete/Copy
    actions but no pagination/search or explicit filter reset.
  - Blogs: main read tab fetches first page with `limit: 10`, derives year
    options from only that page, filters that page client-side by `featured` or
    year, and has T-152 Update/Delete/Copy actions but no pagination/search.
  - Collections: main read tab fetches first page with `limit: 10` and has
    T-152 Update/Delete/Copy actions but no filters, pagination, or search.
  - Comments: main read tab fetches first page with `limit: 10` and only
    exposes Copy ID; delete still requires manual ObjectId lookup.
  - Users: main read tab fetches first page with `limit: 10` and only exposes
    Copy ID; delete still requires manual ObjectId lookup.
- Existing right-side admin feed tabs already consume route metadata and render
  simple previous/next pagination at `limit: 10`, but feed cards are passive
  overview cards and generally only support copying IDs, not update/delete
  handoff.
- Recommended implementation split:
  1. Add shared admin read-list pagination query parsing/bounds and route tests.
  2. Pilot metadata-driven main read-tab pagination on blogs or collections.
  3. Move current first-page client filters to route-backed query params.
  4. Add route-backed search after pagination/filter contracts are stable.
  5. Extract shared read-list shell only after one covered pilot proves the
     states.
  6. Add comments/users read-list-to-delete handoff as a separate destructive
     workflow slice.
- Candidate shared-tracker updates: keep F-095 partially mitigated; add
  follow-ups for admin read-list query contracts, paginated/searchable main
  read tabs, and focused route/component tests.
- Verification: `git diff --check`.

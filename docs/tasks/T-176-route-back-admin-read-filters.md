# T-176 Route-Back Admin Read Filters

Status: Planned

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Move existing first-page admin read filters to route-backed query params so
filtered results and pagination describe the same dataset.

## Context

- Depends on [T-175](T-175-pilot-admin-blog-read-pagination.md).
- T-173 found that blog and article read tabs filter only the current first page
  in the browser, which hides matching records on later pages.
- The route contract should own filtering before counting and pagination.

## Scope

In scope:

- Start with blog filters unless inspection of T-175 makes article safer.
- Add route-backed query params for existing visible filters only, such as blog
  `featured` and year or article `section`.
- Update the matching fetcher and read-list tab so filter changes reset to page
  1 and consume route metadata from the filtered query.
- Add route tests proving `countDocuments(query)` and page metadata follow the
  filter.
- Add focused component coverage proving the UI sends route-backed filters and
  does not filter only the first page client-side.

Out of scope:

- Do not add new filter concepts.
- Do not add search.
- Do not extract a shared read-list shell.
- Do not change all resource tabs in one pass.
- Do not edit shared trackers while running in parallel.

## Concurrency

Do not run this task until T-175 is complete and reconciled. This task should
not run in parallel with T-177 because search should build on the finalized
filter/query shape.

Owned files:

- the selected admin read-list route and fetcher, expected to be blog first
- the selected read-list component, expected to be `ReadBlogList`
- focused route and component tests for the selected resource
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The selected filter is applied by the route before pagination and counting.
- The UI page controls and metadata reflect filtered results.
- The selected read tab no longer relies on first-page-only client filtering for
  that filter.
- Existing update/delete/copy handoff still works.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/adminArchiveEntryPoints.test.tsx
npm run lint
git diff --check
```

Adjust focused test paths if narrower files are added.

## Agent Prompt

You are working on T-176. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, and T-175's handoff. Move the selected existing
admin read-list filter from first-page client filtering to route-backed query
params, preferably on the blog read tab unless T-175's handoff says otherwise.
Keep the change to one resource. Preserve pagination metadata and
Update/Delete/Copy handoff. Do not add search, new filters, shared read-list
extraction, other resources, or shared tracker edits. Run focused route and
component tests, lint, and `git diff --check`, then update only this task
handoff.

## Handoff Notes

- Planned after T-173.

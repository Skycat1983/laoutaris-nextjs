# T-177 Pilot Admin Read Search

Status: Planned

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add one route-backed admin read-list search pilot after pagination and filter
contracts are stable.

## Context

- Depends on [T-176](T-176-route-back-admin-read-filters.md).
- T-173 found `ReadListParams` already includes `search?: string`, but no admin
  read fetcher sends it and no admin read route reads it.
- Search should be added after pagination and filters are stable so counts,
  pages, and visible results all agree.

## Scope

In scope:

- Add search to one low-risk resource, preferably the same blog pilot unless
  T-176 recommends collections instead.
- Search safe public-ish fields only, such as title and slug for blog or
  collection records.
- Bound and trim the search query. Return structured `400` for invalid
  overlong input if the shared parser pattern supports it.
- Update the matching fetcher and read tab to send the search query and reset
  to page 1 when it changes.
- Add route and component tests for matched results, no-results state, metadata,
  and preserved card actions.

Out of scope:

- Do not add site-wide public search scope changes.
- Do not search private user account data.
- Do not add search across all admin resources in this first pilot.
- Do not extract a shared read-list shell.
- Do not edit shared trackers while running in parallel.

## Concurrency

Do not run this task until T-176 is complete and reconciled. This task should
not run in parallel with any other task touching the selected read-list route,
fetcher, or component.

Owned files:

- the selected admin read-list route and fetcher
- the selected read-list component
- focused route and component tests for the selected resource
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- One admin read list supports route-backed search with pagination metadata.
- Search input is bounded and does not include private fields.
- No-results, loading, error, and card action states remain clear.
- Other resource read lists remain unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/adminArchiveEntryPoints.test.tsx
npm run lint
git diff --check
```

Adjust focused test paths if narrower files are added.

## Agent Prompt

You are working on T-177. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-173, the T-173 audit result, and T-176's handoff. Add a route-backed search
pilot to one admin read list only, preferably the same resource used by the
pagination/filter pilot. Search only safe public-ish fields, keep the query
bounded, preserve pagination metadata and card actions, and do not touch public
search scope or private user data. Do not extract a shared shell or edit shared
trackers. Run focused route and component tests, lint, and `git diff --check`,
then update only this task handoff.

## Handoff Notes

- Planned after T-173.

# T-207 Document Route Fallback Patterns

Status: Deferred

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Document the accepted route loading/fallback pattern by route type and replace
the remaining generic inline `/project/aims` loading copy with an accepted
stable fallback.

## Context

- A-005/F-110 found route and component loading states are present but not
  consistently route-local or semantically aligned.
- Current App Router loading files are limited to root
  `src/app/loading.tsx` and admin feed
  `src/app/admin/dashboard/@feed/loading.tsx`.
- Public pages mostly use hand-placed Suspense fallbacks such as
  `ArtworkViewSkeleton`, `BlogDetailSkeleton`, `ArticleViewSkeleton`,
  `SubnavSkeleton`, and pagination skeletons.
- Detail pages also use JSON-LD Suspense boundaries with `fallback={null}`.
  Those are acceptable only for invisible metadata/script output and should be
  documented separately from visible route-content fallbacks.
- `/project/aims` still uses a blue inline `Loading...` fallback around its
  desktop image Suspense boundary. A-005 called this out as the remaining
  generic inline loading copy to replace.

## Scope

In scope:

- Add a concise route loading/fallback pattern section to
  `docs/architecture/rendering-and-data-fetching.md`.
- Cover at least these route types:
  - route-level App Router `loading.tsx` files,
  - public detail primary-content Suspense fallbacks,
  - route layout navigation/pagination Suspense fallbacks,
  - invisible JSON-LD/metadata Suspense boundaries where `fallback={null}` is
    intentional,
  - client follow-up loading states, which should stay visible and local to
    the client interaction rather than being route-loading placeholders.
- Replace the `/project/aims` blue inline `Loading...` fallback with a stable
  accepted fallback that preserves layout. Prefer an existing skeleton or a
  small route-local neutral visual placeholder over user-facing generic copy.
- Add focused coverage or a source invariant proving `/project/aims` no longer
  uses the generic inline loading copy and that the route fallback pattern is
  documented.

Out of scope:

- Do not redesign `/project/aims`, change article copy/images, or alter its
  mobile/desktop layout beyond the fallback replacement.
- Do not add new broad `loading.tsx` files or refactor existing public detail
  Suspense boundaries.
- Do not change JSON-LD output, not-found/error behavior, route cache policy,
  client fetch retry states, account navigation, homepage prototypes, or
  framed-preview behavior.
- Do not run broad browser automation unless the fallback replacement is
  layout-sensitive enough to need a targeted screenshot.

## Concurrency

Run this task alone with other work touching route fallback architecture docs,
`src/app/project/aims/page.tsx`, or tests/source invariants for public route
fallbacks.

Owned files:

- `docs/architecture/rendering-and-data-fetching.md`
- `src/app/project/aims/page.tsx`
- focused route fallback source-hygiene or page tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- `docs/architecture/rendering-and-data-fetching.md` describes the accepted
  route loading/fallback pattern by route type.
- The docs distinguish visible route-content fallbacks from intentional
  invisible JSON-LD `fallback={null}` boundaries.
- `/project/aims` no longer contains the blue inline `Loading...` fallback.
- Focused coverage fails if the generic `/project/aims` fallback returns or if
  the route fallback pattern documentation is removed.
- Existing route cache, landmark/heading, and project page behavior remain
  unchanged outside the fallback replacement.

## Verification

```bash
rg -n 'bg-blue-500|Loading\\.\\.\\.' src/app/project/aims/page.tsx
npm test -- --runTestsByPath __tests__/unit/publicLandmarksHeadings.test.ts __tests__/unit/publicRouteCachePolicy.test.ts
npm run lint
git diff --check
```

Add any new focused fallback-pattern test path to the Jest command before
handoff. The `rg` command should return no matches for the retired fallback in
`src/app/project/aims/page.tsx`.

## Agent Prompt

You are working on T-207. Read `AGENTS.md`, `docs/README.md`, the A-005 result,
F-110 in `docs/audits/findings-register.md`, and the frontend/testing
workstreams. Document the accepted route loading/fallback pattern in
`docs/architecture/rendering-and-data-fetching.md`, then replace only the
generic blue inline `Loading...` fallback in `src/app/project/aims/page.tsx`
with an accepted stable fallback. Add focused coverage or a source invariant
for the documentation and `/project/aims` cleanup. Do not redesign the project
page, change route cache/not-found/error behavior, alter JSON-LD output, add
broad loading files, or touch unrelated A-005 follow-ups. Run the verification
commands plus any new focused fallback-pattern test, then update this handoff
with candidate tracker updates.

## Handoff Notes

- Prepared after T-206 resolved F-109 account subnav mounting.
- Deferred by the orchestrator on 2026-05-22 after priority review. This is a
  low-value polish/documentation task compared with open commerce, search,
  compliance, monitoring, and asset-lifecycle work. Do not assign unless route
  fallback polish is explicitly prioritized.

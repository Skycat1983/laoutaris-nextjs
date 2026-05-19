# T-146 Preserve Sorted Blog Loading

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Preserve the active blog sort when sorted blog pages load additional results or
render pagination state.

## Context

- A-017/F-100 found `BlogListLoader` computes `prev` and `next` links for
  sorted blog pages, but `BlogListView` does not render or forward them.
- `BlogSectionContinuous` loads follow-up pages through
  `clientApi.public.blog.multiple` without forwarding the active `sortby`,
  causing sorted pages to drift after the first page.
- T-076 moved blog list loading onto the shared server-only `getBlogList`
  service; this task should keep that service path intact.

## Scope

In scope:

- Pass the active `sortby` from `BlogListLoader` into `BlogListView` and then
  into `BlogSectionContinuous` for sorted lists.
- Include `sortby` in follow-up client blog requests made by
  `BlogSectionContinuous`.
- Decide whether existing `prev`/`next` links should be rendered for sorted
  list pages or explicitly removed from the loader/view contract; keep the
  decision narrow and documented in this task handoff.
- Add focused tests proving sorted follow-up requests preserve `sortby` and
  loader/view props remain coherent.

Out of scope:

- Do not redesign blog list layout, blog cards, or section taxonomy.
- Do not change `getBlogList` sorting semantics unless a type contract blocks
  forwarding the already-supported sort value.
- Do not change public search, artwork browse parsing, main navigation
  fallbacks, or visible breadcrumbs.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-144 and T-145 because it owns only blog list
loader/view/continuous-loading behavior and focused tests.

Owned files:

- `src/components/loaders/viewLoaders/BlogListLoader.tsx`
- `src/components/views/BlogListView.tsx`
- `src/components/sections/BlogSectionContinuous.tsx`
- focused blog loader/view/continuous-loading tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/loaders/viewLoaders/BlogListLoader.tsx`
- `src/components/views/BlogListView.tsx`
- `src/components/sections/BlogSectionContinuous.tsx`
- `__tests__/unit/loaders/BlogListLoader.test.tsx`
- `__tests__/unit/views/BlogListView.test.tsx`
- `__tests__/unit/sections/BlogSectionContinuous.test.tsx`
- `docs/tasks/T-146-preserve-sorted-blog-loading.md`

## Acceptance Criteria

- Sorted blog pages preserve the active `sortby` when loading later pages.
- Loader/view props either render or intentionally retire the existing
  pagination link contract; no unused pagination props remain without a handoff
  note.
- Existing unsorted grouped blog lists keep their current behavior.
- Focused tests cover sorted and unsorted behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/views/BlogListView.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx
git diff --check
```

Adjust the component test path if the project already has a better existing
test surface for `BlogSectionContinuous`.

## Handoff Notes

- Prepared after T-141/T-142 reconciliation from A-017/F-100.
- Keep blog pagination UI redesign and broader discovery copy out of this
  implementation slice.
- Implemented: `BlogListLoader` now forwards the active `sortby` to
  `BlogListView`; `BlogListView` forwards sorted page, has-more, and sort state
  to `BlogSectionContinuous`; follow-up client blog requests include `sortby`
  when present.
- Pagination decision: keep and render the existing `prev`/`next` contract for
  sorted single-list pages through `BlogsViewPagination`. Grouped unsorted blog
  lists keep their existing section-only layout without pagination controls.
- Focused tests were added for loader props, view handoff/pagination behavior,
  sorted continuous loading, and unsorted continuous loading.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/views/BlogListView.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx`
  and `git diff --check`.
- Candidate shared tracker updates: mark T-146 complete in the frontend routes
  and testing workstreams. No risk or findings-register update is needed.

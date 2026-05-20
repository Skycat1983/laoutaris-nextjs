# T-154 Validate Public Taxonomy Sections

Status: Completed

Workstream:
[Data Models And API](../workstreams/data-models-and-api.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add route-local runtime validation for public article and collection section
parameters using canonical taxonomy constants.

## Context

- F-103 found collection schemas accept section values that are hidden from
  admin create/update workflows, while public article/collection list and
  article-navigation section parameters can pass raw or compile-time-only
  values into services.
- `ARTICLE_SECTION_OPTIONS` and `COLLECTION_SECTIONS` are the current canonical
  constants.
- This task should validate current public boundaries without deciding a larger
  i18n or taxonomy relabeling policy.

## Scope

In scope:

- Validate public article list/navigation `section` parameters before service
  calls.
- Validate public collection list/navigation `section` parameters before
  service calls where a route or loader accepts a section-like value.
- Return current public-safe invalid-query behavior for API routes and safe
  fallback/not-found behavior for pages/loaders.
- Add focused tests for invalid section rejection/fallback and preserved valid
  section behavior.
- Document candidate follow-up if hidden collection sections still need an
  owner launch policy.

Out of scope:

- Do not change the allowed taxonomy values without an explicit owner policy.
- Do not add translated labels or i18n behavior.
- Do not redesign admin collection section controls.
- Do not edit blog pinned/tag controls owned by T-153.
- Do not edit visible breadcrumb components owned by T-155.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-153 and T-155 because it owns public taxonomy
runtime validation and focused API/loader tests.

Owned files:

- public article/collection route handlers and loaders that accept section
  values
- shared section parsing helpers if needed under `src/lib/data/schemas/` or
  `src/lib/constants/`
- focused public route/loader tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/app/api/v2/public/article/route.ts`
- `src/app/api/v2/public/navigation/articles/[section]/route.ts`
- `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx`
- `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx`
- `src/lib/data/services/getArticleNavigationList.ts`
- `src/lib/data/services/getCollectionList.ts`
- focused tests under `__tests__/unit/api/`, `__tests__/unit/loaders/`, or
  `__tests__/unit/data/`
- `docs/tasks/T-154-validate-public-taxonomy-sections.md`

## Acceptance Criteria

- Invalid public article section input cannot reach article list/navigation
  service queries.
- Invalid public collection section input cannot reach collection list service
  queries.
- Valid current sections continue to render and return data as before.
- Focused tests cover invalid and valid behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicArticleListRoute.test.ts __tests__/unit/loaders/BiographySectionLoader.test.tsx __tests__/unit/loaders/CollectionSectionLoader.test.tsx
git diff --check
```

Adjust the exact test list to match the files touched, and run `npm run lint`.

## Handoff Notes

- Prepared after T-150 through T-152 reconciliation.
- 2026-05-20: Added canonical constant-backed runtime validation for public
  article list `section`, article navigation `[section]`, and collection list
  `section` inputs before service calls. Invalid values now return public-safe
  `400` validation responses and focused route tests prove the service layer is
  not reached. Existing valid article and collection section behavior remains
  covered by the public route/loader tests.
- Verification: `npm test -- --runTestsByPath
  __tests__/unit/api/publicArticleListRoute.test.ts
  __tests__/unit/api/publicNavigationRoutes.test.ts
  __tests__/unit/api/publicCollectionRoutes.test.ts
  __tests__/unit/loaders/BiographySectionLoader.test.tsx
  __tests__/unit/loaders/CollectionSectionLoader.test.tsx` passed;
  `npm run lint` passed; `git diff --check` passed.
- Candidate shared-tracker update: mark the runtime-validation part of F-103
  mitigated while leaving owner launch policy and i18n label decisions separate
  if they remain undecided.

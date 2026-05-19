# T-133 Remove Admin Dashboard Client Console Errors

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining admin dashboard client `console.error()`/
`console.warn()` calls without changing admin CRUD form behavior, feed/list
loading behavior, delete confirmations, document-reader behavior, upload
handling, copy attempts, validation display, or operator-visible failure UI.

## Context

- T-126 through T-132 completed the public server/provider/action/loader,
  public/account client, shared fetcher, and low-value utility/helper non-route
  logging cleanup slices.
- The remaining non-route direct `console.error()`/`console.warn()` inventory,
  after excluding API-v2 route handlers and the approved structured logger
  sink, is concentrated in admin dashboard clients.
- A source inventory on 2026-05-19 found 37 direct admin dashboard
  `console.error()` calls across 28 files:
  - `src/components/features/adminDashboard/DocumentReader.tsx`
  - `src/components/features/adminDashboard/crudForms/create/CreateArticleForm.tsx`
  - `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
  - `src/components/features/adminDashboard/crudForms/create/CreateArtworkWithUpload.tsx`
  - `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
  - `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx`
  - `src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
  - `src/components/features/adminDashboard/feeds/ArticleFeed.tsx`
  - `src/components/features/adminDashboard/feeds/ArtworkFeed.tsx`
  - `src/components/features/adminDashboard/feeds/BlogFeed.tsx`
  - `src/components/features/adminDashboard/feeds/CollectionFeed.tsx`
  - `src/components/features/adminDashboard/feeds/CommentFeed.tsx`
  - `src/components/features/adminDashboard/feeds/UserFeed.tsx`
  - `src/components/features/adminDashboard/operationTabs/ArticleOperations.tsx`
  - `src/components/features/adminDashboard/operationTabs/ArtworkOperations.tsx`
  - `src/components/features/adminDashboard/operationTabs/BlogOperations.tsx`
  - `src/components/features/adminDashboard/operationTabs/CollectionOperations.tsx`
  - `src/components/features/adminDashboard/operationTabs/CommentOperations.tsx`
  - `src/components/features/adminDashboard/operationTabs/UserOperations.tsx`
- Until a monitoring provider/client reporting helper is approved, admin client
  code should rely on existing operator-visible state and generic failure UI,
  not browser console output.

## Scope

In scope:

- Remove direct `console.error()` and `console.warn()` calls from
  `src/components/features/adminDashboard/**`.
- Preserve existing admin dashboard behavior:
  - CRUD create/update form success and failure paths;
  - form validation display and submitted field handling;
  - upload-result processing behavior;
  - read-list copy attempts;
  - operation-tab delete behavior and confirmation flows;
  - feed loading, empty, and failure states;
  - document-reader loading and failure states.
- Add focused source-hygiene coverage for the admin dashboard client file set.
- Add or update behavior tests only where removing console output could
  accidentally alter existing visible UI or state handling.
- Update related workstream, risk, finding, architecture, and orchestration
  docs after completion.

Out of scope:

- Do not install or design a browser monitoring provider.
- Do not add a generic client reporting SDK/helper.
- Do not change API route contracts, admin fetcher contracts, validation
  schemas, form field names, delete semantics, upload metadata rules, or
  dashboard navigation.
- Do not remove the approved structured logger sink in
  `src/lib/observability/logger.ts`.

## Likely Files

- `src/components/features/adminDashboard/`
- `__tests__/unit/security/renderSourceHygiene.test.ts`
- Existing focused admin dashboard tests where behavior is already covered
- Related docs under `docs/`

## Acceptance Criteria

- `src/components/features/adminDashboard/**` contains no direct
  `console.error()` or `console.warn()` calls.
- Admin dashboard forms, feeds, read lists, operation tabs, document reader,
  copy attempts, and upload handling preserve their existing visible behavior.
- Raw caught errors, validation objects, submitted form values, uploaded asset
  metadata, user records, API response bodies, document content, and copied IDs
  are not logged from admin client code.
- Focused source-hygiene coverage guards the admin dashboard client file set.
- Related tracking docs record that the non-route direct console cleanup is
  clear except the approved structured logger sink and any future discoveries.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/components/features/adminDashboard
npm test -- --runTestsByPath __tests__/unit/security/renderSourceHygiene.test.ts __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx
git diff --check
```

Run any additional focused admin form/feed/list/operation tests added or
touched by the implementation.

## Handoff Notes

- Planned on 2026-05-19 after T-132 completed the shared fetcher and
  low-value utility/helper cleanup. This is the remaining known non-route
  direct console cleanup category from F-081/R-019.
- Completed on 2026-05-19 by removing direct `console.error()`/
  `console.warn()` calls from admin dashboard CRUD forms, read lists, feeds,
  operation tabs, upload handling, and `DocumentReader`.
- Existing admin behavior is preserved by relying on current form errors,
  loading resets, modal failure UI, silent copy attempts, and existing
  success/fallback state instead of browser console output.
- `__tests__/unit/security/renderSourceHygiene.test.ts` now recursively guards
  `src/components/features/adminDashboard/**` against direct
  `console.error()`/`console.warn()` calls.
- Verification: the scoped admin dashboard source search returned no matches;
  `npm test -- --runTestsByPath __tests__/unit/security/renderSourceHygiene.test.ts __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx`
  passed; `git diff --check` passed.

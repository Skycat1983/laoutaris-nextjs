# T-054 Align Article Section Options

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Implement the first F-039 field-matrix follow-up by making admin article section
UI options derive from the shared article section constants and adding focused
regression coverage that articles cannot use the stale `"collections"` section.

## Why Now

T-053 created the authoritative field contract matrix and identified article
`section` as the lowest-risk runtime alignment slice. The model and route
schemas already agree that articles can only use `"artwork"`, `"biography"`,
and `"project"` through `ARTICLE_SECTION_OPTIONS`; the remaining drift is the
admin article filter's hardcoded `"collections"` option. Collections are
separate model/routes and must not be reintroduced as article sections.

This task addresses:

- [F-039](../audits/findings-register.md): required and optional field
  contracts disagree across Mongoose models, Zod schemas, and TypeScript types.
- [R-006](../risks/production-readiness.md): field contracts and transform
  outputs remain inconsistent.
- [R-015](../risks/production-readiness.md): input flows have residual
  validation and persistence gaps.

## Read First

- [Data field contracts](../architecture/data-field-contracts.md)
- [A-003 result](../audits/results/A-003-data-models-transforms.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/lib/constants/articleConstants.ts`
- `src/lib/data/schemas/articleSchema.ts`
- `src/lib/data/models/articleModel.ts`
- `src/components/features/adminDashboard/inputs/ArticleFilterDropdowns.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateArticleForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx`
- `__tests__/unit/api/adminArticleRoute.test.ts`

## Scope

In scope:

- Replace hardcoded article section option lists in admin article filtering with
  `ARTICLE_SECTION_OPTIONS`.
- Keep authoritative article sections exactly `"artwork"`, `"biography"`, and
  `"project"`.
- Ensure `"collections"` is not presented as an article section option in admin
  article filtering.
- Add focused regression coverage proving:
  - `createArticleSchema` and `updateArticleRouteBodySchema` reject
    `section: "collections"` for articles,
  - admin article filter options are derived from `ARTICLE_SECTION_OPTIONS` and
    do not include `"collections"`.
- Preserve collection routes, collection navigation, collection model/schema
  behavior, and search type `"collections"`.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change collection model, collection routes, public collection
  navigation, or search `"collections"` behavior.
- Do not change article route response helpers, auth guards, DB ownership, or
  create/update persistence behavior except where tests need to assert existing
  schema rejection.
- Do not implement the blog `imageUrl`/`pinned`/`tags` contract work from
  T-055.
- Do not implement the user `password` optional credentials/OAuth work from
  T-056.
- Do not add Shopify, Cloudinary, logging, or Next/PostCSS changes.

## Acceptance Criteria

- Admin article filtering uses shared article section constants rather than a
  local literal list containing `"collections"`.
- Focused tests prove `"collections"` is rejected as an article section by
  article create/update schemas.
- Focused tests prove admin article filter section options match
  `ARTICLE_SECTION_OPTIONS` and do not include `"collections"`.
- Existing article create/update route behavior remains unchanged except for
  stronger regression coverage around the already-invalid section value.
- Collection and search `"collections"` behavior is untouched.

## Verification

Completed:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/data/articleSectionContracts.test.ts
npm run lint
npm run build
```

All commands passed on 2026-05-15. Build retained existing MongoDB,
static-generation, branch-verification, link, and fetcher debug log noise.

## Handoff Notes

- `ArticleFilterDropdowns.tsx` now exports `ARTICLE_FILTER_OPTIONS`, with
  `section` derived directly from `ARTICLE_SECTION_OPTIONS` and
  `overlayColour` from `ARTICLE_OVERLAY_COLOUR_OPTIONS`.
- Added `__tests__/unit/data/articleSectionContracts.test.ts` to prove article
  create/update schemas reject `section: "collections"` and the admin filter
  section options match `ARTICLE_SECTION_OPTIONS`.
- Kept this as the article `section` slice only. Blog `imageUrl`/`pinned`/`tags`
  and user `password` field-contract alignment remain for later tasks.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- A product/content decision is needed to add a new article section beyond
  `ARTICLE_SECTION_OPTIONS`.
- Removing `"collections"` from article filtering would break a current admin
  workflow that is not represented by collection routes.

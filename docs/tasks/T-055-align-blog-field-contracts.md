# T-055 Align Blog Field Contracts

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Implement the F-039 blog field-contract slice by aligning blog `imageUrl`,
`pinned`, and `tags` behavior across the Mongoose model, route schemas,
allowlisted admin create/update persistence, and focused tests.

## Why Now

T-053 created the authoritative field contract matrix. T-054 completed the
low-risk article `section` follow-up. The next runtime F-039 slice is blog
field alignment:

- `imageUrl` is required by route schemas, TypeScript types, and public UI, but
  the Mongoose model still allows it to be absent.
- `pinned` is stored with a model default and appears in filter types, but admin
  route schemas currently reject it.
- `tags` is typed and modeled as `BLOG_TAGS`, but has no model default and is
  rejected by route schemas.

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
- `src/lib/constants/blogConstants.ts`
- `src/lib/data/models/blogModel.ts`
- `src/lib/data/schemas/blogSchema.ts`
- `src/app/api/v2/admin/blog/create/route.ts`
- `src/app/api/v2/admin/blog/update/[id]/route.ts`
- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `__tests__/unit/api/adminBlogRoute.test.ts`

## Scope

In scope:

- Make `BlogModel.imageUrl` required so persisted blog entries match route,
  type, and public UI expectations.
- Add blog `pinned` to the route-safe blog field contract:
  - create input may omit it and should normalize/default to `false`,
  - create input may explicitly provide a boolean,
  - update input may optionally provide a boolean replacement.
- Add blog `tags` to the route-safe blog field contract:
  - create input may omit it and should normalize/default to `[]`,
  - create input may explicitly provide a `BLOG_TAGS` array,
  - update input may optionally provide a replacement `BLOG_TAGS` array,
  - invalid tag values should return structured validation `400`s before
    persistence.
- Add a model default of `[]` for `tags`.
- Preserve existing create/update validation for title, subtitle, summary,
  text, imageUrl, displayDate, featured, invalid JSON, slug conflicts,
  auth/DB ordering, public-safe `500`s, and response-helper envelopes.
- Keep admin create/update visible form controls unchanged unless a minimal
  hidden/default form value is required by the existing form/schema integration.
  Do not add a UI tag editor or pinned control in this task.
- Update focused admin blog tests for:
  - missing `imageUrl` remains invalid at the route boundary,
  - valid create omitting `pinned`/`tags` persists `pinned: false` and
    `tags: []`,
  - valid create/update can persist explicit `pinned` and `tags`,
  - invalid tags are rejected before model reads/writes,
  - unknown fields remain rejected.
- Update this task, the field contract doc if implementation clarifies any
  detail, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not add visible admin controls for editing pinned status or tags.
- Do not change public blog filtering behavior, blog list sorting, or public
  blog route envelopes.
- Do not change article section contracts covered by T-054.
- Do not change user `password` credentials/OAuth behavior reserved for T-056.
- Do not add Shopify, Cloudinary upload-policy, logging, or Next/PostCSS
  changes.

## Acceptance Criteria

- Blog model/schema/type behavior follows the T-053 recommendation:
  - `imageUrl` is required for persisted blogs,
  - `pinned` is optional input and persisted as a non-null boolean defaulting to
    `false`,
  - `tags` is optional input and persisted as a normalized `BlogTag[]`
    defaulting to `[]`.
- Admin blog create/update routes persist only parsed allowlisted fields,
  including explicit `pinned` and `tags` values.
- Invalid tags and missing/invalid image URLs return structured validation
  `400`s before persistence.
- Existing admin blog success/error envelopes, auth ordering, DB ordering,
  slug-conflict behavior, and public-safe failures are preserved.
- No visible admin UI workflow, public filter behavior, Shopify, Cloudinary, or
  logging behavior is changed.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminBlogRoute.test.ts
npm run lint
npm run build
```

If a focused schema/model contract test is added, include it in the Jest command
and update this task's handoff notes.

## Handoff Notes

- Completed on 2026-05-15.
- `BlogModel.imageUrl` is now required, and `BlogModel.tags` defaults to `[]`.
- Admin blog route schemas now accept/default create `pinned: false` and
  `tags: []`, accept explicit create/update replacements, and reject invalid
  tag values before blog model reads/writes.
- Admin create/update persistence remains allowlisted to parsed fields, now
  including `pinned` and `tags`.
- Existing visible admin blog forms were left unchanged.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/adminBlogRoute.test.ts`,
  `npm run lint`, and `npm run build`. Build retained existing
  MongoDB/static-generation, branch-verification, link, and fetcher debug log
  noise.

## Escalate

Escalate to the orchestrator if:

- Existing production data appears to include blogs without `imageUrl` and a
  migration/backfill decision is needed before making the model field required.
- Adding `pinned` or `tags` to route schemas requires visible admin workflow
  decisions.
- Public blog filtering semantics need to change to make these fields useful.

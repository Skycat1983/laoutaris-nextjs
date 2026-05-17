# T-091 Remove Admin Dashboard Form Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove direct `console.log()` debug output from admin dashboard create/update
form and artwork-filter components without changing admin validation, upload,
submit, update, or filter behavior.

## Context

- F-020 tracks debug logs and expected output that make tests, builds, SSR, API,
  upload, and commerce paths noisy.
- T-088 removed MongoDB helper/auth adapter debug logs.
- T-089 removed high-noise public/account render debug logs.
- T-090 removed the remaining scoped user-facing public/account client/page
  debug logs.
- The pre-task source check showed direct admin dashboard form/filter
  `console.log()` calls in:
  - `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
  - `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx`
  - `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
  - `src/components/features/adminDashboard/inputs/ArtworkFilterDropdowns.tsx`

## Scope

In scope:

- Remove direct `console.log()` calls from the seven files listed above.
- Preserve `CreateBlogForm` and `UpdateBlogForm` validation and submit
  behavior.
- Preserve `CreateArtworkForm` submission, image upload state handoff,
  persisted payload shape, success/error behavior, and submit disabled state.
- Preserve `UpdateArtworkForm`, `UpdateArticleForm`, `UpdateBlogForm`, and
  `UpdateCollectionForm` initial value handling, validation, submit/update
  behavior, and success/error behavior.
- Preserve `ArtworkFilterDropdowns` selection behavior and filter-change
  callbacks.
- Add or update focused source hygiene coverage proving the touched admin
  dashboard files do not contain direct `console.log()` calls.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change `console.error()` handling, API error logging, public-safe
  response behavior, or global logging/redaction policy.
- Do not change admin read-list copy-ID logs, `ReadArtworkList` artwork logs,
  shared copy helpers, `Feed`, `NavItem`, `RefreshButton`,
  `YoutubeEmbedding`, `getUserFromSession`, or public artwork fetcher logs.
- Do not change admin API contracts, route validation schemas, Cloudinary
  upload widget behavior, Shopify product-link workflow, operation-tab
  behavior, or dashboard navigation.
- Do not introduce a logging library, monitoring, request correlation, feature
  flag, or broader admin-form refactor.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `src/components/features/adminDashboard/inputs/ArtworkFilterDropdowns.tsx`
- `__tests__/unit/security/renderSourceHygiene.test.ts` or a focused admin
  source-hygiene test file
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The seven touched admin dashboard source files contain no direct
  `console.log()` calls.
- Admin create/update form validation and submit/update behavior are unchanged.
- `CreateArtworkForm` still preserves upload state, request payload construction,
  loading/disabled behavior, and success/error handling.
- `ArtworkFilterDropdowns` still updates selected values and emits the same
  filter-change callbacks.
- Focused source hygiene coverage prevents direct `console.log()` calls from
  returning to the scoped admin dashboard files.
- Read-list copy behavior, shared helper behavior, route-level API logging, and
  global logging policy remain untouched.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused source-hygiene tests>
npm run lint
npm run build
rg -n "console\\.log\\(" src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx src/components/features/adminDashboard/inputs/ArtworkFilterDropdowns.tsx
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-090 completed the scoped user-facing
  public/account debug-log cleanup. Keep this task limited to admin dashboard
  create/update form and filter dropdown direct logs; read-list copy logs,
  shared helpers, route-level API error logging, and global logging/redaction
  policy remain separate follow-ups.
- Completed on 2026-05-17 by removing the scoped direct `console.log()` calls
  from the listed admin dashboard create/update forms and artwork filter
  dropdowns while preserving existing validation, upload-state handoff,
  submit/update, success/error, and filter callback behavior.
- Focused source-hygiene coverage was added to
  `__tests__/unit/security/renderSourceHygiene.test.ts` for the seven scoped
  admin dashboard files.
- Verification passed with focused Jest for
  `__tests__/unit/security/renderSourceHygiene.test.ts`, the required scoped
  source search, `npm run lint`, `npm run build`, and `git diff --check`.

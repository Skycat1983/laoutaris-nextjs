# A-011 Admin Content Operations Result

Status: Completed

Audit goal: [A-011 Admin content operations](../goals.md#a-011-admin-content-operations)

Workstream: [Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md)

## Summary

Admin content operations are materially stronger than the original audit stub
suggested: every current admin API route uses the shared `requireApiAdmin()`
guard, create/update routes for article, artwork, blog, and collection now use
strict route schemas, delete routes validate destructive IDs before model work,
Cloudinary signing is admin-guarded and parameter-limited, and the artwork
forms expose the Shopify product-link workflow with explicit product
verification.

The remaining production gaps are operational workflow gaps: destructive user
deletion can remove the current or last admin without a recovery workflow,
delete confirmations do not tell operators which related records will be
cascaded or preserved, relationship integrity for article/collection artwork
links still relies on client-side lookups rather than route-local existence
checks, form failures are often swallowed in the dashboard, list/read workflows
remain ID-copy/manual and shallow, and there is no dedicated operator runbook
for repeatable create/update/delete steps.

## Scope Inspected

- Required docs:
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md#a-011-admin-content-operations`
  - `docs/audits/results/README.md`
  - `docs/workstreams/content-assets-and-admin-ops.md`
  - `docs/runbooks/auth.md`
  - `docs/runbooks/database.md`
- Related prior audits and policy docs:
  - `docs/audits/results/A-004-auth-admin-permissions.md`
  - `docs/audits/results/A-009-cloudinary-assets.md`
  - `docs/audits/results/A-016-forms-validation-inputs.md`
  - `docs/runbooks/cloudinary.md`
  - `docs/architecture/data-field-contracts.md`
  - `docs/architecture/routes-and-api.md`
  - `docs/risks/production-readiness.md`
- Admin page and dashboard shell:
  - `src/app/admin/page.tsx`
  - `src/app/admin/dashboard/layout.tsx`
  - `src/app/admin/dashboard/@main/[segment]/page.tsx`
  - `src/app/admin/dashboard/@feed/page.tsx`
  - `src/components/layouts/admin/AdminSidebar.tsx`
  - `src/components/modules/tabs/AdminCrudTabs.tsx`
  - `src/components/features/adminDashboard/adminSegmentConfig.tsx`
- Admin workflow components:
  - `src/components/features/adminDashboard/DocumentReader.tsx`
  - `src/components/features/adminDashboard/crudForms/create/`
  - `src/components/features/adminDashboard/crudForms/update/`
  - `src/components/features/adminDashboard/crudForms/read/`
  - `src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx`
  - `src/components/features/adminDashboard/operationTabs/`
  - `src/components/features/adminDashboard/feeds/`
  - `src/components/features/adminDashboard/inputs/ShopifyProductLinksInput.tsx`
- Admin APIs and fetchers:
  - 28 admin route handlers under `src/app/api/v2/admin/`
  - `src/lib/api/admin/create/fetchers.ts`
  - `src/lib/api/admin/read/fetchers.ts`
  - `src/lib/api/admin/update/fetchers.ts`
  - `src/lib/api/admin/delete/fetchers.ts`
- Data dependencies:
  - `src/lib/data/models/artworkModel.ts`
  - `src/lib/data/models/articleModel.ts`
  - `src/lib/data/models/blogModel.ts`
  - `src/lib/data/models/collectionModel.ts`
  - `src/lib/data/schemas/artworkSchema.ts`
  - `src/lib/data/schemas/articleSchema.ts`
  - `src/lib/data/schemas/blogSchema.ts`
  - `src/lib/data/schemas/collectionSchema.ts`
- Focused tests searched or inspected:
  - `__tests__/unit/api/adminArticleRoute.test.ts`
  - `__tests__/unit/api/adminArtworkRoute.test.ts`
  - `__tests__/unit/api/adminBlogRoute.test.ts`
  - `__tests__/unit/api/adminCollectionRoute.test.ts`
  - `__tests__/unit/api/adminDeleteRouteGuard.test.ts`
  - `__tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx`
  - `__tests__/unit/security/renderSourceHygiene.test.ts`

## Commands Run

- `git status --short`: confirmed many unrelated dirty files already exist in
  the worktree; this audit edit is scoped to this result file.
- `sed -n '1,260p' docs/README.md`: read canonical docs index.
- `sed -n '1,260p' docs/audits/goals.md`: read A-011 goal and expected output.
- `sed -n '1,220p' docs/audits/README.md`: read audit workflow and shared-file
  ownership rules.
- `sed -n '1,260p' docs/workstreams/content-assets-and-admin-ops.md`: read
  assigned workstream, current facts, backlog, acceptance criteria, and next
  action.
- `sed -n '1,260p' docs/runbooks/auth.md` and
  `sed -n '1,280p' docs/runbooks/database.md`: read required runbooks.
- `sed -n '1,320p' docs/audits/results/A-009-cloudinary-assets.md` and
  `sed -n '1,340p' docs/audits/results/A-016-forms-validation-inputs.md`:
  checked already-audited Cloudinary and input-validation scope to avoid
  duplicating reconciled findings.
- `rg --files src/app/admin src/components/features/adminDashboard src/app/api/v2/admin src/lib/api/admin src/lib/data/models src/lib/data/schemas __tests__ docs/runbooks docs/architecture docs/tasks | sort`:
  inventoried admin UI, API, schema/model, test, and doc surfaces.
- `find src/app/api/v2/admin -name route.ts -print | sort`: listed the 28
  current admin route handlers.
- `rg --files-without-match "requireApiAdmin" src/app/api/v2/admin -g route.ts`:
  returned no files, confirming the current admin route set has route-local
  shared admin guards.
- `rg -n "clientApi\\.admin|clientAdminApi|admin\\.|method:|fetch\\(|delete|Delete|confirm" src/components/features/adminDashboard src/lib/api/admin src/lib/api/core src/app/admin -S`:
  mapped dashboard client workflows to admin fetchers.
- `rg -n "export async function (GET|POST|PUT|PATCH|DELETE)|requireApiAdmin|isValidObjectId|safeParse|findByIdAndDelete|deleteMany|findByIdAndUpdate|Model\\.create|\\.save\\(|\\$pull|\\$set|startSession|transaction" src/app/api/v2/admin src/lib/data -S`:
  inspected guard, validation, persistence, and destructive-route patterns.
- `rg -n "Cloudinary|cloudinary|asset|image|upload|delete|public_id|signature|backup|metadata|secure_url|next/image" -S --glob '!node_modules/**' --glob '!\\.next/**' .`:
  rechecked upload/image operation context.
- `rg -n "cloudinary\\.uploader|delete_resources|destroy\\(|deleteResource|orphan|backup|restore|rollback" src/app/api/v2/admin src/components/features/adminDashboard src/components/elements/buttons docs/runbooks -S`:
  confirmed runtime admin delete paths still do not perform destructive
  Cloudinary cleanup; Cloudinary runbook owns the interim preservation policy.
- `rg -n "TODO|Not Available|Read User Component|Read Comment Component|onSuccess|error|Failed to|return;|pagination|page|limit" src/components/features/adminDashboard src/app/api/v2/admin -S`:
  found WIP dashboard operation gaps, silent failure paths, pagination surfaces,
  and disabled create/update operations.
- Targeted `nl -ba` reads of the files listed in Scope Inspected: gathered
  line-level evidence for findings.
- `nl -ba src/app/api/v2/admin/artwork/delete/[id]/route.ts` without quoting
  the bracketed path failed under zsh glob expansion; the command was rerun
  with quoted bracket paths.
- `git diff --check -- docs/audits/results/A-011-admin-content-operations.md`:
  passed with no whitespace errors.
- `npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx`:
  passed, 6 suites and 124 tests. The run emitted Node's existing `[DEP0040]`
  `punycode` deprecation warning.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Admin user deletion can remove the current admin or the last admin account, and the admin recovery process is still not documented. | The dashboard exposes user deletion through `adminSegmentConfig` (`src/components/features/adminDashboard/adminSegmentConfig.tsx:62-71`) and `UserOperations.handleDelete()` calls `clientApi.admin.delete.user(userInfo._id)` without self-delete or role-count checks (`src/components/features/adminDashboard/operationTabs/UserOperations.tsx:34-50`). The route authenticates the caller but then deletes the target user after related comment/favourite/watchlist cleanup (`src/app/api/v2/admin/user/delete/[id]/route.ts:26-33`, `src/app/api/v2/admin/user/delete/[id]/route.ts:49-103`). The confirmation only displays username and role (`src/components/features/adminDashboard/operationTabs/UserOperations.tsx:66-77`; `src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx:30-45`). The auth runbook still lists admin bootstrap and recovery as open work (`docs/runbooks/auth.md`). | Add route-level protections against deleting the current admin and against deleting the last admin unless an owner-approved recovery path exists. Document admin bootstrap/recovery, then cover self-delete, last-admin, non-admin, and successful non-critical user deletion with focused route tests. |
| High | Destructive admin actions are hard deletes with cascade behavior, but the operator workflow does not preview cascades, require backup evidence, or record an audit trail before deletion. | The shared confirmation text is generic for every resource (`src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx:27-45`). Blog deletion removes associated comments and pulls them from users (`src/app/api/v2/admin/blog/delete/[id]/route.ts:54-80`). User deletion deletes the user's comments and pulls favourites/watchlist references from artwork (`src/app/api/v2/admin/user/delete/[id]/route.ts:59-103`). Comment deletion pulls references from user and blog records (`src/app/api/v2/admin/comment/delete/[id]/route.ts:44-69`). Artwork deletion blocks when an article references the artwork and otherwise removes it from collections (`src/app/api/v2/admin/artwork/delete/[id]/route.ts:43-63`). Database backup guidance exists only as generic expectations before destructive admin changes (`docs/runbooks/database.md`), while the content workstream backlog still says to document admin content workflows and confirm delete behavior (`docs/workstreams/content-assets-and-admin-ops.md:117-154`). | Add an admin delete runbook and UI/route contract for cascade previews by resource type. At minimum, show related counts before confirmation, require operator backup/review notes for production deletes, and log a redacted audit event with actor, resource, cascade summary, and request ID. |
| Medium | Article and collection relationship integrity still depends on client-side lookups; the admin API validates ObjectId shape but does not verify referenced artworks exist before persisting relationships. | Article create starts from a dashboard artwork lookup (`src/components/features/adminDashboard/operationTabs/ArticleOperations.tsx:70-84`), but the route only parses `createArticleRouteSchema` and persists `artwork` directly (`src/app/api/v2/admin/article/create/route.ts:105-143`). Article update lets the UI fetch a replacement artwork (`src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx:64-90`), but the route only safe-parses `artwork` and `$set`s the payload (`src/app/api/v2/admin/article/update/[id]/route.ts:118-145`). Collection update fetches artwork in the UI before adding (`src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx:74-95`), but the route only validates IDs and pushes them into `collection.artworks` (`src/app/api/v2/admin/collection/update/[id]/route.ts:56-74`, `src/app/api/v2/admin/collection/update/[id]/route.ts:101-126`). None of these routes imports or queries `ArtworkModel` for referenced-ID existence. | Add route-local existence checks for article `artwork`, collection `artworksToAdd`, and collection `artworksToRemove` semantics before persistence. Return structured `400` or `404` field errors for dangling references and add route tests for missing-but-valid ObjectIds. |
| Medium | Dashboard create/update forms often swallow API failures and do not surface route field errors to operators; collection create also ignores its success callback. | Server routes now return structured validation errors, for example `Invalid collection input` with `fieldErrors`/`formErrors` (`src/app/api/v2/admin/collection/create/route.ts:26-60`) and equivalent create/update patterns for article/artwork/blog. The client forms generally catch and `return` without showing the route error (`src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx:69-80`, `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx:63-80`, `src/components/features/adminDashboard/crudForms/create/CreateArticleForm.tsx:59-68`, `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx:84-96`, `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx:54-68`, `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx:58-73`, and `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx:103-121`). `CreateCollectionForm` accepts `onSuccess` but never calls it after a successful create (`src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx:35-77`), so `CollectionOperations.handleSuccess()` is bypassed for the create tab (`src/components/features/adminDashboard/operationTabs/CollectionOperations.tsx:68-72`). | Introduce a small admin form error adapter that maps API `fieldErrors` to React Hook Form errors and displays form-level/server failures. Fix `CreateCollectionForm` to call `onSuccess()` after successful persistence. Add focused component tests for successful collection create and a representative server-validation failure. |
| Medium | Archive maintenance still relies on manual ObjectId copy/paste and shallow read lists, which makes update/delete workflows brittle as content grows. | Update/delete operations begin with `DocumentReader`, which only accepts an Object ID (`src/components/features/adminDashboard/DocumentReader.tsx:19-27`, `src/components/features/adminDashboard/DocumentReader.tsx:47-63`). The main read tabs hard-code first-page fetches and have no pagination controls: article/blog/collection/user/comment lists request `page: 1, limit: 10` (`src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx:28-57`, `src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx:28-66`, `src/components/features/adminDashboard/crudForms/read/ReadCollectionList.tsx:19-39`, `src/components/features/adminDashboard/crudForms/read/ReadUserList.tsx:15-33`, `src/components/features/adminDashboard/crudForms/read/ReadCommentList.tsx:15-35`), while artwork defaults to the fetcher default with filters but no UI pagination (`src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx:23-44`). The side feed has pagination (`src/components/features/adminDashboard/feeds/ArticleFeed.tsx:20-67`; `src/components/elements/pagination/FeedPagination.tsx:19-57`) but is separate from update/delete forms and still requires copying IDs. | Replace the manual ID workflow with a paginated/searchable admin management table or link the feed/list cards directly into update/delete actions. Preserve the existing ID reader as an escape hatch, but make normal maintenance possible without hidden first-page limits. |
| Medium | Visible blog operations do not expose all persisted workflow fields, so operators cannot manage pinned status or tags from the dashboard. | `BlogModel` stores `pinned` and `tags` (`src/lib/data/models/blogModel.ts:11-14`, `src/lib/data/models/blogModel.ts:37-41`), and route schemas accept/default both fields (`src/lib/data/schemas/blogSchema.ts:88-91`, `src/lib/data/schemas/blogSchema.ts:118-140`). The current create/update forms expose `displayDate`, `imageUrl`, title/subtitle/summary/text, and `featured`, but not pinned or tags (`src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx:87-248`; `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx:86-251`). The data-field contract explicitly says visible pinned/tag controls remain a separate content decision (`docs/architecture/data-field-contracts.md`). | Decide whether pinned posts and tags are launch-scope admin workflows. If yes, add controlled form fields using `BLOG_TAGS` and route-tested persistence. If not, document the intentional omission in the content operations runbook so operators know these fields are system/default-managed. |
| Medium | There is no dedicated operator runbook for admin content CRUD and archive maintenance steps. | Required runbooks cover auth, database backup expectations, and Cloudinary lifecycle policy, but source/doc search found no runbook that tells an operator how to create, update, delete, verify, or recover artwork, article, blog, collection, comment, or user admin content. The content workstream acceptance criteria require documented admin add/update steps, destructive action behavior, Cloudinary upload and MongoDB backup processes, and Shopify dependencies (`docs/workstreams/content-assets-and-admin-ops.md:155-161`), while the backlog still includes "Document admin content workflows for each content type" and "Add operator runbooks for non-Shopify artwork and content operations" (`docs/workstreams/content-assets-and-admin-ops.md:117-154`). | Create `docs/runbooks/admin-content-operations.md` covering per-resource create/update/delete steps, required IDs, dependency checks, Shopify link verification, Cloudinary upload expectations, backup/export preconditions, delete cascade behavior, failure recovery, and post-change smoke checks. |

## Findings Register Updates

- Not updated directly because this audit is in concurrent discovery mode.
  Candidate rows for reconciliation:
  - `A-011` / High / Admin user deletion can remove the current or last admin
    account without a documented recovery path.
  - `A-011` / High / Destructive admin hard deletes lack operator-visible
    cascade previews, backup gates, and audit trail ownership.
  - `A-011` / Medium / Article and collection relationship writes can persist
    valid-looking but dangling artwork references because route-local existence
    checks are missing.
  - `A-011` / Medium / Admin dashboard forms swallow create/update API errors,
    and collection create does not call its success callback.
  - `A-011` / Medium / Archive maintenance is manual ObjectId copy/paste with
    shallow unpaginated read tabs.
  - `A-011` / Medium / Blog pinned/tag fields are persisted and route-supported
    but not visible dashboard workflows.
  - `A-011` / Medium / Admin content CRUD and archive maintenance lack a
    dedicated operator runbook.

## Risks Updated

- Not updated directly. Candidate risk changes:
  - Update `R-002` for the admin user deletion self/last-admin and recovery
    gap.
  - Update `R-005` for missing dashboard workflow coverage beyond route tests
    and the current Shopify product-link form tests.
  - Update `R-007` or create a content-operations risk for destructive
    MongoDB/content maintenance steps that need backup gates, cascade previews,
    and rollback evidence.
  - Keep non-artwork image URL/upload policy under existing `R-008`; A-011
    reconfirmed the operator workflow impact but A-009/T-101 already own the
    Cloudinary lifecycle and image-field policy.

## Workstream Updates

- Not updated directly. Candidate backlog additions for
  `docs/workstreams/content-assets-and-admin-ops.md`:
  - Add self-delete and last-admin protections to admin user deletion.
  - Add cascade preview and backup/audit requirements for destructive admin
    deletes by resource type.
  - Server-verify article and collection referenced artwork IDs before
    persistence.
  - Surface admin form API errors and fix collection create success callback
    behavior.
  - Replace manual ObjectId-only maintenance with paginated/searchable
    update/delete entry points.
  - Decide and document blog pinned/tag operator workflow.
  - Create an admin content operations runbook.

## Completion Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read canonical instructions and docs before audit. | Read `docs/README.md`, audit workflow docs, A-011 goal, result-format docs, content/admin workstream, auth runbook, and database runbook. | Complete |
| Audit admin CRUD workflows. | Inspected admin dashboard segment config, tabs, DocumentReader, create/read/update/delete forms, operation tabs, feeds, fetchers, and route handlers. Findings cover manual ID workflows, form failure handling, missing collection success callback, and hidden blog pinned/tag operations. | Complete |
| Audit destructive actions. | Inspected delete UI, article/artwork/blog/collection/comment/user delete routes, cascade behavior, route guard coverage, Cloudinary preservation policy, and database backup docs. Findings cover user deletion risk and cascade/backup/audit gaps. | Complete |
| Audit content dependencies. | Inspected article/artwork/collection relationships, route schemas, route persistence, UI lookup behavior, and delete conflict/cascade behavior. Finding covers missing route-local referenced-artwork existence checks. | Complete |
| Audit operator steps. | Searched runbooks and workstream docs for admin content workflow guidance. Finding covers missing admin content operations runbook. | Complete |
| Audit archive maintenance needs. | Inspected read lists, feed pagination, copy-ID controls, and update/delete entry points. Finding covers shallow/manual maintenance workflow. | Complete |
| Avoid duplicating already-reconciled adjacent audits. | Read A-004, A-009, and A-016 results; Cloudinary image lifecycle and generic validation gaps are referenced as existing context rather than refiled wholesale. | Complete |
| Preserve shared-file ownership. | Findings register, risk, and workstream updates are listed as candidates only. | Complete |
| Produce expected result file. | This file is the expected output: `docs/audits/results/A-011-admin-content-operations.md`. | Complete |

## Next Action

Reconcile the candidate A-011 findings into the findings register, risks, and
content/admin backlog. The first implementation slice should protect admin user
deletion from self-delete and last-admin lockout, because it is a high-impact
destructive action with an unresolved recovery process.

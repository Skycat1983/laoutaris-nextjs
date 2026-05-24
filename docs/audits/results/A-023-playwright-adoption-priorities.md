# A-023 Playwright Adoption Priorities

Status: Completed

Audit goal: identify where this project would most benefit from Playwright, and
prioritize candidate browser checks without adding the dependency.

Workstream: [Testing and quality](../../workstreams/testing-and-quality.md),
with related work in [Frontend routes and components](../../workstreams/frontend-routes-and-components.md),
[Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md),
[Shopify commerce](../../workstreams/shopify-commerce.md), and
[Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md).

## Summary

Playwright would add the most value as a small browser-smoke layer, not as a
broad discovery tool. The strongest candidates are journeys where current Jest,
source-hygiene, route-handler, and `npm run smoke:public` checks cannot prove
real browser behavior: credentialed auth/admin flows, lazy mobile/search drawers,
responsive public browsing, multi-step admin dashboard operations, and Shopify
handoff/product enquiry behavior. Adoption should wait for a scoped task that
names the first journeys, fixture data, secret handling, command/CI posture, and
artifact budget.

## Scope Inspected

- `package.json`
- `docs/runbooks/testing.md`
- `docs/runbooks/deployment.md`
- `docs/runbooks/admin-content-operations.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `scripts/smoke-public-routes.mjs`
- `.github/workflows/public-smoke.yml`
- `src/middleware.ts`
- `src/app/admin/dashboard/layout.tsx`
- `src/app/admin/dashboard/@main/[segment]/page.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx`
- `src/components/modules/search/SearchDrawer.tsx`
- `src/components/artwork/ArtworkGallery.tsx`
- `src/components/compositions/ShopProductGallery.tsx`
- `src/components/sections/BlogSectionContinuous.tsx`
- `src/components/modules/forms/user/SignInForm.tsx`
- `src/components/modules/forms/user/ContactForm.tsx`
- `src/components/features/adminDashboard/adminSegmentConfig.tsx`
- `src/components/modules/tabs/AdminCrudTabs.tsx`
- `src/components/features/adminDashboard/operationTabs/ArtworkOperations.tsx`
- `src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx`
- `src/components/features/adminDashboard/inputs/ShopifyProductLinksInput.tsx`
- `src/components/elements/buttons/UploadButton.tsx`
- Focused tests under `__tests__/unit/` for auth, public browsing, admin delete,
  upload button, public navigation, and shop product detail behavior.

## Commands Run

- `sed -n '1,220p' docs/audits/README.md`: reviewed audit workflow.
- `sed -n '1,220p' docs/audits/goals.md`: reviewed existing audit index.
- `sed -n '1,220p' docs/audits/results/README.md`: reviewed result format.
- `sed -n '1,220p' docs/templates/audit-result.md`: reviewed required result sections.
- `sed -n ... docs/workstreams/*.md docs/runbooks/*.md`: reviewed relevant workstream and runbook context.
- `rg --files src/app src/components __tests__ scripts .github/workflows`: inventoried routes, components, tests, scripts, and workflows.
- `rg -n "Playwright|Puppeteer|smoke:public|signIn\\(|admin/dashboard|MobileNavDrawer|Search|Drawer|ShopProductGallery|ArtworkGallery|Continuous|Delete|UploadButton|onlineStoreUrl|Preview Frame|keyboard|focus|aria|modal|dialog" src __tests__ scripts docs/tasks package.json .github/workflows`: found browser-interaction and existing-coverage evidence.
- Targeted `nl -ba ... | sed -n ...` reads for the source and test files listed in scope.

No browser automation, runtime app server, or test suite was run. This audit is
source- and documentation-based by design.

## Prioritization

| Priority | Candidate Playwright area | Why Playwright helps | Existing evidence | First scoped check | Preconditions and artifact budget |
| --- | --- | --- | --- | --- | --- |
| P0 | Adoption scaffold and command policy | This must exist before any dependency is added, otherwise agents can over-capture traces, screenshots, DOM, console logs, and network data. | `package.json` has no Playwright/e2e script. `docs/runbooks/testing.md` now states Playwright is not baseline and requires scoped route, fixture, secret, command, and artifact planning. | Add a docs/task-only adoption plan before installing Playwright. Limit the first suite to at most three journeys. | No traces or videos by default. Screenshots only on named assertion failure. Console/network capture filtered to expected signal. |
| P1 | Credentialed auth and admin smoke | Current automated smoke is unauthenticated; real browser sign-in, cookies, redirects, role denial, admin access, and sign-out are deployment-critical browser behavior. | `scripts/smoke-public-routes.mjs:290-305` checks only sign-in shell, sign-out shell, and unauthenticated admin denial. `src/middleware.ts:26-42` owns unauthenticated and non-admin redirects. `docs/runbooks/deployment.md` requires credentialed outcomes but keeps secrets out of docs. `SignInForm` submits through `signIn("credentials", { redirect: false })` in `src/components/modules/forms/user/SignInForm.tsx:37-71`, with mocked unit coverage in `__tests__/unit/forms/SignInForm.test.tsx:93-133`. | With owner-approved smoke accounts, visit `/sign-in`, submit non-admin credentials, verify `/admin/dashboard/articles` is denied, sign out, submit admin credentials, verify dashboard heading and `/admin/dashboard/articles` render. | Requires private smoke-account handling outside repo/chat/logs. Do not record usernames, passwords, CSRF tokens, cookies, screenshots containing credentials, or raw NextAuth payloads. |
| P1 | Public mobile shell: lazy nav drawer and search drawer | Source/unit tests confirm labels and lazy imports, but they do not prove real drawer focus, portal/inert behavior, viewport layout, keyboard escape, or hydration. | `MobileNavDrawer` lazy-loads its body only after opening in `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx:13-49`. `SearchDrawer` does the same in `src/components/modules/search/SearchDrawer.tsx:8-45`. Existing coverage is partly source-level in `__tests__/unit/publicSearchNavigationAccessibility.test.tsx:103-149`. | At a mobile viewport, load `/`, open/close navigation, open search, submit a query, verify the URL reaches `/search?q=...`, and ensure no overlap blocks primary content. | Use one mobile viewport and one route. Capture one failure screenshot only if layout/focus assertion fails. No DOM dump. |
| P1 | Public archive browse/filter and load-more | The archive UX depends on client state, URL mutation, drawers, Masonry layout, IntersectionObserver, fetch retries, and responsive grid behavior. Jest covers mocked slices but not real browser composition. | `ArtworkGallery` pushes filter state to `/artwork?...` and fetches filtered data in `src/components/artwork/ArtworkGallery.tsx:69-115`, then loads more pages in `src/components/artwork/ArtworkGallery.tsx:144-188`. Error-state tests mock the drawer/filter and IntersectionObserver in `__tests__/unit/publicBrowsingClientErrorStates.test.tsx:231-312`. | Visit `/artwork`, open filters, apply one backed filter/sort, assert URL query changes and visible cards update or stable empty state appears. Optionally trigger one load-more path if the approved dataset has enough records. | Requires approved stable fixture records or deterministic seeded local data. Limit to one filter and one pagination assertion. |
| P2 | Admin dashboard read-to-update/delete handoff | Admin operations are multi-component, role-protected, and operator-critical. Unit tests verify pieces, but Playwright can prove the actual dashboard route, tabs, read-list handoff, document reader, preview, evidence gate, and modal state compose in a browser. | Admin dashboard composes sidebar/main/feed in `src/app/admin/dashboard/layout.tsx:12-24`, maps segments to CRUD operations in `src/components/features/adminDashboard/adminSegmentConfig.tsx:21-84`, and switches operations through `AdminCrudTabs` in `src/components/modules/tabs/AdminCrudTabs.tsx:48-164`. Delete preview/evidence gating lives in `src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx:372-478` with unit coverage in `__tests__/unit/forms/adminDeleteConfirmation.test.tsx:155-289`. | With admin smoke auth and seeded non-production data, visit `/admin/dashboard/blogs`, search/read a fixture, click Delete from read list, verify preview loads, Confirm Delete is disabled until evidence is filled, then cancel. | Start as preview/cancel only. Do not perform destructive production deletes. Sanitized fixture IDs only; screenshots disabled unless UI assertion fails. |
| P2 | Shopify product handoff and product enquiry context | Product detail has browser-specific external-link behavior, contact navigation, and optional frame-preview modal. Jest proves DOM attributes, but not new-tab handling, contact-page defaults after navigation, or modal focus/layout. | Product detail renders hosted Shopify purchase links with `target="_blank"` and enquiry fallback in `src/app/shop/products/[productHandle]/page.tsx:171-209`. Contact defaults persist product context in `src/components/modules/forms/user/ContactForm.tsx:34-65`. Unit coverage verifies the purchase link and fallback in `__tests__/unit/shopProductDetailPage.test.tsx:185-236`. | Visit an approved product detail. Assert hosted purchase CTA uses the Shopify URL without following it, click contact link, verify `/project/contact?product=...` and prefilled subject/message. For print products, open and close `Preview Frame Options`. | Requires an approved product handle and no checkout automation. Do not enter payment, shipping, customer, or Shopify checkout data. |
| P2 | Public shop filters and sorting | Shop list behavior is client-side for filters and sorting, with fetch state and reset behavior; Playwright can prove real selects/checkboxes, result count, and responsive grid. | `ShopProductGallery` owns filter fetch, sort state, loading overlay, error retry, and reset behavior in `src/components/compositions/ShopProductGallery.tsx:33-235`. Current tests cover unsupported controls and sort logic, but not browser fetch/URL/layout composition. | Visit `/shop/products`, toggle one product-type filter and one sort mode, assert visible product count/order or stable empty state. | Requires stable Shopify/MongoDB fixture data or mocked local test seed. Do not inspect broad network logs; assert only the product API response status if needed. |
| P3 | Blog continuous loading and comment modal behavior | Infinite scroll and comment modals are real browser behaviors, but current coverage already mocks the key state transitions, making this useful after higher-priority public/admin checks. | `BlogSectionContinuous` uses `useInfiniteScroll` and renders retry UI in `src/components/sections/BlogSectionContinuous.tsx:31-57` and `src/components/sections/BlogSectionContinuous.tsx:118-142`. Existing tests cover mocked intersection and blog/comment failure states in `__tests__/unit/publicBrowsingClientErrorStates.test.tsx:209-229` and `__tests__/unit/publicBrowsingClientErrorStates.test.tsx:314-343`. | Visit `/blog?sortby=latest`, scroll to one next-page load, assert additional posts or expected no-more state. | Only after a stable data fixture exists. No full-page screenshots unless visual regression is the named goal. |
| P3 | Cloudinary upload widget launch | This is genuinely browser-only because it relies on a third-party widget, but it is cross-origin and artifact-heavy. It should not be in the first Playwright suite unless admin upload is the assigned production concern. | `UploadButton` mounts `CldUploadWidget` with `uploadPreset`, `signatureEndpoint`, sources, and `onSuccess` in `src/components/elements/buttons/UploadButton.tsx:18-50`. Unit tests mock the widget and cover config/open/success forwarding in `__tests__/unit/uploadButton.test.tsx:66-118`. | If assigned, verify the admin upload button becomes enabled and invokes the Cloudinary widget shell in a non-production environment. | No iframe DOM scraping, no third-party full-page screenshots, no real production uploads without owner approval. |
| P3 | Prototype visual QA for `/prototype/home` and `/prototype/frame` | Playwright screenshots can help visual review, but prototypes are not production smoke and screenshots can consume context quickly. | Prototype tasks already note targeted browser checks when available and no broad traces/videos. The frame/product modal has component tests under `__tests__/unit/components/FramedPrintPreview*.test.tsx`. | One named viewport screenshot for a specific prototype section or frame state when a design task requires visual evidence. | One route, one viewport, one clipped screenshot if possible. Summarize observation instead of storing or pasting image output. |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Credentialed auth/admin smoke is the highest-value Playwright candidate, but it is blocked until smoke accounts and secret-handling are approved. | `scripts/smoke-public-routes.mjs:290-305` is unauthenticated; `docs/runbooks/deployment.md` requires credentialed sign-in/admin outcomes; `src/middleware.ts:26-42` owns browser redirects. | Create a scoped Playwright adoption task for credentialed auth/admin smoke after owner-approved admin and non-admin smoke accounts exist. |
| High | Lazy public mobile navigation and search drawer behavior is only partially proven by source/unit tests, not by a real browser. | `MobileNavDrawer` and `SearchDrawer` lazy-load drawer bodies after open; existing test `__tests__/unit/publicSearchNavigationAccessibility.test.tsx:103-149` checks source labels/lazy boundaries. | Make mobile nav/search the first public no-secret browser smoke if credentialed smoke accounts are unavailable. |
| Medium | Public archive and shop browsing have enough client-side state to justify browser checks, but only after fixture records are named. | `ArtworkGallery` controls query-push/filter/load-more state; `ShopProductGallery` controls fetch/filter/sort/loading/error state; tests mock those seams. | Add a public browse smoke with one `/artwork` filter journey and one `/shop/products` filter/sort journey using approved fixture records. |
| Medium | Admin read-to-update/delete handoff is high-risk operator behavior, but Playwright should start with preview/cancel only. | Dashboard layout, segment config, tab state, document-reader handoff, and delete evidence gate compose across multiple client/server modules. | Add a non-destructive admin dashboard browser smoke after credentialed admin smoke is working and seeded data is available. |
| Medium | Shopify product handoff and enquiry context are browser-visible commerce paths that should be smoke-tested without automating checkout. | Product detail renders Shopify hosted purchase and contact fallback; contact form defaults product context; unit tests validate attributes but not browser navigation/new-tab behavior. | Add one product-detail journey that asserts the external Shopify URL without following checkout and verifies contact-page product context. |
| Low | Cloudinary widget and prototype screenshot checks are valid but should remain task-specific because they are artifact-heavy or external-service-sensitive. | Upload widget is mocked in unit tests; prototype routes have design-review tasks and existing component coverage. | Keep these out of the baseline Playwright suite unless a task explicitly assigns them. |

## Recommended First Playwright Suite

If the owner/orchestrator decides to adopt Playwright, start with one of these
two tracks:

1. Credentialed-first track, if smoke accounts exist:
   - `/sign-in` non-admin sign-in and admin denial.
   - `/sign-in` admin sign-in and `/admin/dashboard/articles` access.
   - Sign-out and protected-route denial after sign-out.

2. Public-first track, if smoke accounts do not exist:
   - Mobile `/` navigation drawer open/close.
   - Mobile `/` search drawer submit to `/search?q=<query>`.
   - `/artwork` one backed filter or sort journey.

Keep the first suite out of scheduled CI until flake, fixture, and artifact
behavior are known locally and in one manual workflow run.

## Places Playwright Should Not Replace Existing Checks

- API response envelopes, validation, route/fetcher parity, and DB ownership:
  keep these in Jest route/service tests.
- Data transforms, Shopify DTO mapping, metadata/structured data, sitemap,
  robots, cache policy, and client/server import boundaries: keep these in
  focused Jest/source tests.
- Public route status checks with no browser interaction: keep using
  `npm run smoke:public`.
- Broad accessibility crawling or full-page visual snapshots: narrow to a named
  component, route, selector, and expected observation before using Playwright.

## Findings Register Updates

Candidate rows for a future reconciliation pass:

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| F-PW-001 | High | Candidate | Credentialed auth/admin deployment smoke needs browser automation once owner-approved smoke accounts exist. | Testing, auth/admin, deployment workstreams; risks R-005, R-028. |
| F-PW-002 | High | Candidate | Public mobile navigation/search drawer behavior needs one real-browser smoke because current coverage is source/unit only. | Testing and frontend workstreams; risk R-005. |
| F-PW-003 | Medium | Candidate | Public archive/shop interactive browse flows would benefit from fixture-backed browser smoke after stable records are named. | Testing, frontend, Shopify workstreams; risk R-005. |
| F-PW-004 | Medium | Candidate | Admin dashboard read-to-delete preview/cancel handoff should be browser-smoked non-destructively after auth smoke exists. | Testing, auth/admin, content/admin workstreams; risks R-002, R-005, R-007. |
| F-PW-005 | Medium | Candidate | Shopify hosted-purchase/contact-context handoff should be browser-smoked without entering checkout. | Testing and Shopify workstreams; risks R-001, R-005, R-018. |

## Risks Updated

- None. This audit did not edit shared risk trackers.
- Candidate risk links are listed in Findings Register Updates for orchestrator
  review.

## Workstream Updates

- None. This audit did not edit shared workstream briefs.
- The testing runbook already contains the Playwright adoption discipline that
  future tasks should follow.

## Next Action

Create a scoped Playwright adoption task only if the owner/orchestrator accepts
one of the recommended first-suite tracks. The task should name no more than
three journeys, the required fixture records or smoke accounts, the command and
CI posture, and the artifact policy before any dependency is installed.

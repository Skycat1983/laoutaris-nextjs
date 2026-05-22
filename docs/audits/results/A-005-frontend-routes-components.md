# A-005 Frontend Routes And Component Boundaries Result

Status: Completed

Audit goal: [A-005 Frontend routes and component boundaries](../goals.md#a-005-frontend-routes-and-component-boundaries)

Workstream: [Frontend routes and components](../../workstreams/frontend-routes-and-components.md)

## Summary

The current frontend has moved substantially toward the intended App Router
shape: public pages use server pages/loaders for initial data, client components
own interaction, same-app HTTP has been removed from many route-critical
loaders, public search and artwork query parsing now use shared schemas, and the
recursive client/server import-boundary guard passed for the current client
runtime graph.

The remaining production risks are not broad architectural unknowns; they are
specific boundary and state gaps. Public detail routes do not share one
not-found/error contract, some noncritical loaders silently remove whole page
sections, client-side follow-up fetch failures are not visible to users, mixed
component barrels remain available to server callers, and the account subnav
loader that was preserved in T-081 is currently commented out of the account
layout.

## Scope Inspected

- Required docs:
  - [docs/README.md](../../README.md)
  - [docs/audits/goals.md#a-005-frontend-routes-and-component-boundaries](../goals.md#a-005-frontend-routes-and-component-boundaries)
  - [docs/audits/README.md](../README.md)
  - [docs/audits/results/README.md](README.md)
  - [docs/workstreams/frontend-routes-and-components.md](../../workstreams/frontend-routes-and-components.md)
  - [docs/architecture/system-overview.md](../../architecture/system-overview.md)
  - [docs/architecture/routes-and-api.md](../../architecture/routes-and-api.md)
  - [docs/architecture/rendering-and-data-fetching.md](../../architecture/rendering-and-data-fetching.md)
  - [docs/runbooks/testing.md](../../runbooks/testing.md)
  - [docs/risks/production-readiness.md](../../risks/production-readiness.md)
- Prior overlapping frontend audits:
  - [A-010 performance, SEO, and accessibility](A-010-performance-seo-accessibility.md)
  - [A-017 search, navigation, and content discovery](A-017-search-navigation-discovery.md)
- App Router pages, layouts, loading/error files, redirects, metadata, and
  public/account/admin route composition under `src/app`.
- Server loaders under `src/components/loaders`.
- Shared views, sections, cards, navigation, filters, search, pagination,
  product gallery, artwork gallery, and account/admin route components under
  `src/components`.
- Client component entries, local runtime imports, mixed barrels, server-only
  services, route fallback files, and current unit tests related to route
  loaders and import boundaries.

## Commands Run

- `pwd`
- `git status --short`
- `sed -n` reads for required docs, A-005 result file, A-010/A-017 prior
  results, and linked architecture/runbook/risk docs.
- `rg --files src/app | rg '/(page|layout|loading|error|not-found|template|robots|sitemap)\.(tsx|ts)$'`
- `rg --files src/components/loaders src/components/views src/components/compositions src/components/modules src/components/layouts | sort`
- `rg -l "^[\"']use client[\"']" src/app src/components | sort`
- `rg -n "<Suspense|fallback=|dynamic =|notFound\(|redirect\(" src/app src/components/loaders -g '*.tsx' -g '*.ts'`
- `rg -n "fetch\(|clientApi\.public|clientApi\.user|clientApi\.admin|router\.push\(" src/components src/app -g '*.tsx' -g '*.ts'`
- `rg -n "catch \{|return null|throw new Error\(|error =|No .*found|Failed to" src/components/loaders src/app -g '*.tsx' -g '*.ts'`
- `rg -n "from ['\"]@/components/(views|sections|loaders/viewLoaders|loaders/componentLoaders|elements/buttons|modules/cards)['\"]" src/app src/components -g '*.tsx' -g '*.ts'`
- `rg -n "export \*|export \{.*\} from|server-only|serverApi|serverPublicApi|NEXT_PUBLIC_BASE_URL|VERCEL_URL" src/app src/components src/lib -g '*.ts' -g '*.tsx'`
- `find src/app -name 'not-found.tsx' -o -name 'not-found.ts'`
- Targeted `nl -ba ...` reads on files cited below.
- `npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts` - passed, with Node's existing `punycode` deprecation warning.
- `git diff --check` - passed.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Public detail routes do not share a reliable not-found/error contract. | There are no route-local `not-found.tsx` files under `src/app`; only root `src/app/error.tsx` and `src/app/loading.tsx` plus `src/app/admin/dashboard/@feed/loading.tsx` exist. Standalone artwork validates malformed IDs with `notFound()` (`src/app/artwork/[artworkId]/page.tsx:36-43`) but `ArtworkLoader` throws `Failed to fetch artwork` when `getArtworkById` returns no data (`src/components/loaders/viewLoaders/ArtworkLoader.tsx:12-24`). Biography/project article detail throws through `ArticleLoader` for missing article or navigation (`src/components/loaders/viewLoaders/ArticleLoader.tsx:87-94`). Collection-scoped artwork does not call `notFound()`; `CollectionArtworkLoader` converts non-`found` results into an error and then returns `null` (`src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx:20-46`), so the route can resolve with a blank main area. Product detail does use `notFound()` for a missing Shopify product (`src/app/shop/products/[productHandle]/page.tsx:96-104`). | Define and implement route-type contracts for detail pages: malformed params, valid-but-missing content, upstream failure, and optional related-content failure. Add route-local not-found UI where public details call `notFound()`, and make article/artwork/collection-artwork loaders return 404 behavior for missing content instead of generic errors or blank output. |
| Medium | Home and section loaders can silently remove visible sections after data failures or empty results. | `Home` wraps collection, project, biography, subscribe, and blog sections in Suspense skeletons (`src/components/views/Home.tsx:29-74`), but `BiographySectionLoader`, `CollectionsSectionLoader`, and `BlogSectionLoader` catch non-Next failures, log server events, and return `null` (`src/components/loaders/sectionLoaders/BiographySectionLoader.tsx:16-31`, `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx:15-32`, `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx:20-34`). The skeleton disappears once the loader resolves to `null`, leaving no user-facing empty or retry state. | Decide which home sections are route-critical and which can degrade. For noncritical sections, render a compact unavailable/empty state that preserves page structure; for critical archive sections, surface a route-level error or documented fallback. Add focused tests for loader failure output rather than only service-call behavior. |
| Medium | Client-side follow-up fetch failures are swallowed or not displayed, leaving stale route state. | `ArtworkGallery` catches filter and load-more failures and only keeps the current artwork list visible (`src/components/artwork/ArtworkGallery.tsx:38-92`, `src/components/artwork/ArtworkGallery.tsx:102-142`). `ShopProductGallery` directly fetches `/api/v2/public/shop/products` and catches failures without displaying an error (`src/components/compositions/ShopProductGallery.tsx:83-132`). `BlogSectionContinuous` receives an `error` value from `useInfiniteScroll` but never renders it (`src/components/sections/BlogSectionContinuous.tsx:31-57`, `src/hooks/useInfiniteScroll.ts:18-65`). | Standardize client fetch state for browse/filter/infinite-scroll components: keep stale data when useful, but expose a visible retry/error message and keep URL/filter state consistent. Prefer `clientApi.public.*` wrappers over ad hoc `fetch()` for public route clients unless a component has a documented reason to bypass them. |
| Medium | Mixed component barrels still exist and are used by server callers, so future client conversions can reintroduce boundary risk even though the current client graph is guarded. | The boundary test explicitly treats mixed barrels such as `src/components/views/index.ts`, `src/components/sections/index.ts`, `src/components/elements/buttons/index.ts`, and `src/components/modules/cards/index.ts` as client-unsafe. The focused guard passed for current client entries, but server routes/loaders still import those barrels: `ArtworkLoader` imports from `@/components/sections` and `@/components/views` (`src/components/loaders/viewLoaders/ArtworkLoader.tsx:1-2`), `CollectionArtworkLoader` imports from `@/components/views` (`src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx:1`), `/project/contact` imports `ArticleLoader` from `@/components/loaders/viewLoaders` (`src/app/project/contact/page.tsx:1-4`), and collection/blog layouts import `SubscribeSection` from `@/components/sections` (`src/app/collections/[slug]/layout.tsx:3-8`; `src/app/blog/layout.tsx:1`). | Continue replacing mixed barrel value imports with direct file imports in route and loader code. Keep or expand the import-boundary guard, but do not rely on it as the only control because a server component can later become a client entry and pull a broad barrel with it. |
| Medium | The account subnav loader is tested and documented, but the account layout does not mount it. | The frontend workstream says T-081 preserved account subnav links, disabled states, and first favourite/watchlist segment behavior. `AccountSubnavLoader` still builds settings, favourites, watchlist, comments, cart, and orders links (`src/components/loaders/componentLoaders/AccountSubnavLoader.tsx:13-84`), and its unit test verifies those links plus no same-app fetches (`__tests__/unit/loaders/AccountSubnavLoader.test.tsx:47-211`). However `src/app/account/layout.tsx` imports `AccountSubnavLoader` and `SubnavSkeleton`, then comments out the Suspense block that would render it (`src/app/account/layout.tsx:1-18`). | Decide whether account subnavigation is still part of the account UX. If yes, restore the Suspense-mounted loader and add a layout-level test or source invariant so it stays mounted. If no, remove the unused loader/import/test claims and update the workstream facts. |
| Low | Route and component loading states are present but not consistently route-local or semantically aligned. | The only App Router loading files are root `src/app/loading.tsx` and admin feed `src/app/admin/dashboard/@feed/loading.tsx`; route-specific public pages instead use hand-placed Suspense fallbacks such as `ArtworkViewSkeleton`, `BlogDetailSkeleton`, and `ArticleViewSkeleton`. `/project/aims` still uses an inline `Loading...` fallback with a blue block (`src/app/project/aims/page.tsx:105-106`), while detail JSON-LD Suspense boundaries use `fallback={null}` across article, blog, artwork, collection artwork, and product detail routes. | Keep route-local Suspense where it is intentional, but document the pattern by route type and replace generic inline loading copy with shared skeletons or stable fallback components. Add browser checks only for layout-sensitive route states. |

## Findings Register Updates

Shared trackers are orchestrator-owned in concurrent audit mode, so this audit
does not edit `docs/audits/findings-register.md` directly.

Candidate findings for reconciliation:

| Source | Severity | Suggested finding | Evidence | Suggested routing |
| --- | --- | --- | --- | --- |
| A-005 | High | Public detail routes need a consistent not-found/error contract. | No route-local `not-found.tsx`; `src/app/artwork/[artworkId]/page.tsx:36-43`; `src/components/loaders/viewLoaders/ArtworkLoader.tsx:12-24`; `src/components/loaders/viewLoaders/ArticleLoader.tsx:87-94`; `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx:20-46`; `src/app/shop/products/[productHandle]/page.tsx:96-104`. | Frontend routes/components; Architecture refactor; R-005/R-012. |
| A-005 | Medium | Home section loaders silently drop sections on failures or empty data. | `src/components/views/Home.tsx:29-74`; `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx:16-31`; `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx:15-32`; `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx:20-34`. | Frontend routes/components; Testing/quality; R-005. |
| A-005 | Medium | Client browse/filter/infinite-scroll fetch failures need visible user states. | `src/components/artwork/ArtworkGallery.tsx:38-92`; `src/components/artwork/ArtworkGallery.tsx:102-142`; `src/components/compositions/ShopProductGallery.tsx:83-132`; `src/components/sections/BlogSectionContinuous.tsx:31-57`; `src/hooks/useInfiniteScroll.ts:18-65`. | Frontend routes/components; Data/API; Testing/quality. |
| A-005 | Medium | Mixed component barrels remain in server callers despite the current client graph guard passing. | `src/components/loaders/viewLoaders/ArtworkLoader.tsx:1-2`; `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx:1`; `src/app/project/contact/page.tsx:1-4`; `src/app/collections/[slug]/layout.tsx:3-8`; `src/app/blog/layout.tsx:1`; `__tests__/unit/security/clientServerImportBoundary.test.ts`. | Frontend routes/components; Architecture refactor; R-010/R-025. |
| A-005 | Medium | Account subnav is preserved by loader/tests but not mounted in the account layout. | `src/app/account/layout.tsx:1-18`; `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx:13-84`; `__tests__/unit/loaders/AccountSubnavLoader.test.tsx:47-211`. | Frontend routes/components; Auth/admin/account UX; Testing/quality. |
| A-005 | Low | Route loading states need a documented public-route fallback pattern. | `src/app/loading.tsx`; `src/app/admin/dashboard/@feed/loading.tsx`; `src/app/project/aims/page.tsx:105-106`; route-local Suspense usage in public detail pages. | Frontend routes/components; Testing/quality. |

## Risks Updated

None directly. Candidate risk updates for reconciliation:

- Update R-005 with missing focused coverage for route-level not-found/error
  behavior, section-loader failure output, client filter failure states, and the
  account layout/subnav integration.
- Keep R-025 mitigated for the current client graph, but cross-link a frontend
  cleanup finding for mixed component barrels that remain in server callers.
- Cross-link R-012 for public detail route error/not-found semantics because
  loader behavior and route cache/rendering contracts are linked.

## Workstream Updates

None directly. Candidate workstream updates for reconciliation:

- Mark A-005 completed in `docs/audits/goals.md` and
  `docs/audits/results/README.md`.
- Add frontend backlog items for:
  - Public detail route not-found/error contracts.
  - Home section loader empty/failure states.
  - Visible client fetch failure states for artwork, shop, and blog follow-up
    loads.
  - Direct-import cleanup for mixed component barrels still used in server
    routes/loaders.
  - Account subnav mounting decision and layout-level coverage.
- Document the accepted loading/empty/error pattern by route type once the
  route contracts are chosen.

## Completion Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read canonical instructions and docs before audit. | Read AGENTS instructions from the prompt, docs index, audit workflow/result docs, A-005 goal, frontend workstream, system overview, routes/API architecture, rendering/data-fetching architecture, testing runbook, production risks, and overlapping A-010/A-017 results. | Complete |
| Audit page, loader, and client component patterns. | Inspected App Router pages/layouts/loading/error files, server loaders, public/account/admin route components, Suspense usage, redirects, `notFound()`, and client fetch paths. | Complete |
| Audit shared component boundaries and barrel risks. | Inspected client entries, current mixed barrels, direct import usage, server-only service markers, and the recursive import-boundary guard. | Complete |
| Audit loading, empty, not-found, and error states. | Inspected root/route loading files, public detail loaders/pages, home section loaders, search/artwork/shop empty states, client catch paths, and route-local Suspense fallbacks. | Complete |
| Audit responsive route behavior from source. | Inspected public layout/navigation split, artwork/shop grids, admin dashboard layout, and route/component classes where relevant. No broad browser captures were taken because the assignment is source audit and browser automation discipline favors targeted checks only when layout behavior must be proven visually. | Complete |
| Verify current client/server import-boundary guard. | `npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts` passed. | Complete |
| Preserve shared-file ownership. | Shared findings, risk, workstream, goal, and result-index updates are listed as candidates only. | Complete |
| Produce expected result file. | This file is the expected output: `docs/audits/results/A-005-frontend-routes-components.md`. | Complete |

## Next Action

Reconcile A-005 into the findings register, then start with the public detail
route not-found/error contract because it affects artwork, collection-scoped
artwork, biography/project articles, blog detail, and product detail behavior.

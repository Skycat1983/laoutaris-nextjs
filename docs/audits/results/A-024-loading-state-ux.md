# A-024 Loading State UX Result

Status: Completed

Audit goal: ad hoc user-requested audit of route, initial-load, and in-page
loading states.

Workstream:
[Frontend routes and components](../../workstreams/frontend-routes-and-components.md),
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md),
and [Testing and quality](../../workstreams/testing-and-quality.md).

## Summary

The app has a solid set of localized loading states for several known async
boundaries: home sections, public detail content, navigation subnavs,
pagination, account pages, admin read lists, artwork/shop/blog follow-up loads,
forms, and upload buttons. The main UX gap is route traversal. Many dynamic
public routes still rely on the root generic spinner or no segment-specific
pending UI, so a click can appear to do nothing while server data, route code,
or search results are prepared. A second gap is interaction-level navigation:
search forms, artwork hero filters, and some account menu links trigger
navigation without pending feedback or, in a few cases, bypass App Router
client navigation entirely.

## Scope Inspected

- Required docs:
  - [docs/README.md](../../README.md)
  - [docs/audits/README.md](../README.md)
  - [docs/audits/goals.md](../goals.md)
  - [docs/workstreams/frontend-routes-and-components.md](../../workstreams/frontend-routes-and-components.md)
  - [docs/workstreams/architecture-refactor-and-code-health.md](../../workstreams/architecture-refactor-and-code-health.md)
  - [docs/architecture/system-overview.md](../../architecture/system-overview.md)
  - [docs/architecture/rendering-and-data-fetching.md](../../architecture/rendering-and-data-fetching.md)
- Prior overlapping work:
  - [A-005 frontend routes/components](A-005-frontend-routes-components.md)
  - [A-015 SSR/data fetching](A-015-ssr-data-fetching.md)
  - [A-022 Next.js feature utilization](A-022-nextjs-feature-utilization.md)
  - [T-204 public browsing client fetch error states](../../tasks/T-204-add-public-browsing-client-fetch-error-states.md)
  - [T-207 route fallback patterns](../../tasks/T-207-document-route-fallback-patterns.md)
- Official Next.js docs consulted:
  - <https://nextjs.org/docs/app/api-reference/file-conventions/loading>
  - <https://nextjs.org/docs/app/getting-started/linking-and-navigating>
- Source areas:
  - App Router routes, layouts, `loading.tsx`, `error.tsx`, and
    `not-found.tsx` files under `src/app`.
  - Server loaders under `src/components/loaders`.
  - Public browsing, search, shop, account navigation, admin dashboard, form,
    spinner, skeleton, and infinite-scroll components under `src/components`.
  - Loading-state tests under `__tests__`.

## Commands Run

- `pwd && rg --files docs | sed -n '1,160p'`: confirmed repo and docs surface.
- `sed -n ... docs/...`: read required docs, workstream briefs, prior audit
  results, task briefs, and the audit-result template.
- `rg -n "loading|fallback|skeleton|spinner|pending|Suspense" docs/...`: found
  prior loading-state findings and completed follow-ups.
- `find src/app -name loading.tsx -o -name error.tsx -o -name not-found.tsx -o -name template.tsx | sort`:
  inventoried route fallback files.
- `rg -n "<Suspense|fallback=|PageLoading|Skeleton|Spinner|loading|isLoading|pending|useTransition|useLinkStatus|router.push|router.replace|prefetch" src/app src/components src/hooks src/contexts`:
  inventoried source loading and navigation patterns.
- Targeted `sed -n` and `nl -ba` reads for the files cited below.
- `rg -n "publicRouteFallbackPatterns|PageLoading|MainNavSkeleton|Searchbar|SearchDrawerBody|FilterableArtworks|ArtworkGallery|ShopProductGallery|BlogSectionContinuous|loading" __tests__`:
  inventoried focused test coverage.
- No Jest, lint, build, or browser commands were run because this was a static
  audit and no runtime source changed.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Dynamic public route traversal lacks route-specific instant loading coverage for the routes most likely to feel frozen. | The only global public route loading file is `src/app/loading.tsx:1-8`, which delegates to generic `PageLoading`. `src/app/artwork/page.tsx:50-63` renders `ArtworkListLoader` without a route-local Suspense fallback or `src/app/artwork/loading.tsx`. `src/app/shop/products/page.tsx:22-70` renders the banner and then `ShopProductsLoader` without a segment loading file. `src/app/search/page.tsx:163-201` awaits `getPublicSearchResults()` before rendering results and has no `src/app/search/loading.tsx`. `src/app/blog/page.tsx:21-23` is better because it wraps `BlogListLoader` in a section skeleton. Official Next docs describe `loading.tsx` as the file convention for immediate segment loading UI during navigation. | Add route-family loading shells for the highest-latency dynamic routes first: `/artwork`, `/search`, `/shop/products`, and then selected detail routes if navigation still feels inert. Prefer route-shaped skeletons that preserve header/layout context over a full-screen generic spinner. Keep the existing nested detail skeletons where they already work. |
| Medium | Programmatic and custom navigations often provide no pending feedback, and a few internal navigations bypass App Router client transitions. | `Searchbar` calls `router.push()` on submit with no pending state or disabled submit state (`src/components/elements/inputs/Searchbar.tsx:12-24`, `:39-45`). `SearchDrawerBody` closes the drawer and calls `router.push()` without pending feedback (`src/components/modules/search/SearchDrawerBody.tsx:21-32`). The home artwork filter hero uses `window.location.href` for internal artwork search navigation in both variants (`src/components/modules/hero/slides/FilterableArtworks.tsx:102-108`, `:156-162`), causing a document navigation instead of App Router navigation. Account dropdown menu items use raw `<a href>` for internal `/account/settings`, `/sign-in`, and signup routes (`src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx:68-90`, `:97-119`, `:125-147`). | Replace internal `window.location.href` and raw anchor navigation with `Link` or App Router navigation. For current Next 14, wrap submit-driven `router.push()` calls in a local pending state or `useTransition`, disable repeated submits, and render a compact status indicator. Revisit `useLinkStatus` only during a future Next upgrade where it is available in the installed version. |
| Medium | Existing spinner/loading indicators are not consistently accessible or layout-preserving. | `PageLoading` renders a full-viewport spinner plus visible generic `Loading...` copy (`src/components/animations/PageLoading.tsx:4-10`), which conflicts with the documented public route preference for route-shaped skeletons. `Spinner` renders a Lucide loader in a plain `span` without `role="status"`, `aria-live`, or hidden accessible text (`src/components/elements/misc/Spinner.tsx:38-49`). `ShopProductGallery` overlays `Loading...` without marking the product grid busy (`src/components/compositions/ShopProductGallery.tsx:201-207`). `MasonryLayout` renders a border spinner for infinite scroll with no status text or `role="status"` (`src/components/layouts/public/MasonryLayout.tsx:103-108`). `SubmitButton` does disable while pending, but also uses generic `Loading...` copy (`src/components/elements/buttons/SubmitButton.tsx:22-34`). | Add a small loading-status primitive with `role="status"`, `aria-live="polite"`, optional visually hidden text, and support for `aria-busy` on affected content regions. Convert public route fallbacks to skeletons where possible, and reserve spinner-only states for small localized actions. |
| Medium | Admin dashboard parallel routes only have a feed loading file; the main segment has no matching route-level pending UI. | The dashboard layout renders both `main` and `feed` parallel slots (`src/app/admin/dashboard/layout.tsx:3-24`). `src/app/admin/dashboard/@feed/loading.tsx:1-5` renders `FeedSkeleton`, but there is no `src/app/admin/dashboard/@main/loading.tsx`. The main segment page swaps the CRUD tab surface directly (`src/app/admin/dashboard/@main/[segment]/page.tsx:8-25`). `src/app/admin/dashboard/@main/default.tsx:1-6` imports loading components but returns `null`. | Add an `@main/loading.tsx` skeleton that preserves the segment heading and tab/body geometry while admin segment code or data is loading. Remove stale unused loading imports from `@main/default.tsx` when implementing that slice. |
| Low | Existing test coverage protects local loading states, but it does not exercise route-transition pending behavior under delayed server responses. | `__tests__/unit/publicRouteFallbackPatterns.test.ts:7-31` is a source invariant for docs and `/project/aims` fallback cleanup. `__tests__/unit/publicBrowsingClientErrorStates.test.tsx` and `__tests__/unit/sections/BlogSectionContinuous.test.tsx` cover client follow-up failure/loading states. There is no focused browser or component test that clicks from navigation/search into `/artwork`, `/search`, or `/shop/products` while the route response is delayed and asserts that a segment fallback appears. | Add a narrow Playwright or component-level navigation test for one public route transition after route-specific loading files exist. Keep it targeted: one delayed route, one assertion that the skeleton/status is visible, one assertion that final content replaces it. |

## Positive Coverage To Preserve

- Home sections already use section-shaped Suspense skeletons in
  `src/components/views/Home.tsx`.
- Public details already use primary-content skeletons for artwork, collection
  artwork, blog detail, biography, and project article routes.
- Biography, collections, account subnav, and collection/account pagination
  layouts use local Suspense skeletons.
- T-204 added visible retry/error states for artwork filter/load-more, shop
  filtering, and blog continuous-loading follow-up failures.
- Admin read lists and feeds render skeletons while their client fetches are
  pending.
- Forms and upload controls generally disable repeated actions while pending.

## Findings Register Updates

Reconciled on 2026-05-24 into F-118 through F-122 in
`docs/audits/findings-register.md`.

| Source | Severity | Finding | Routing |
| --- | --- | --- | --- |
| A-024 | High | Dynamic public route transitions need segment-specific loading shells for artwork, search, and shop product browsing. | Frontend routes/components; Architecture refactor; Testing/quality |
| A-024 | Medium | Programmatic search/artwork/account navigations need pending feedback and should avoid full document navigation for internal routes. | Frontend routes/components |
| A-024 | Medium | Shared spinner/loading primitives need accessible status semantics and better public-route layout preservation. | Frontend routes/components; Testing/quality |
| A-024 | Medium | Admin dashboard `@main` parallel route needs a matching loading skeleton. | Frontend routes/components; Auth/admin/account UX |
| A-024 | Low | Route-transition loading behavior needs a targeted browser or component navigation check after implementation. | Testing/quality |

## Risks Updated

None. Risk updates were left out of Phase 0 because the work is now routed
through F-118 to F-122 and the frontend/testing workstream backlogs first.

## Workstream Updates

- Updated [frontend routes and components](../../workstreams/frontend-routes-and-components.md)
  with A-024 facts, backlog entries, implementation order, and next action.
- Updated [testing and quality](../../workstreams/testing-and-quality.md) with
  focused loading-state coverage expectations and route-transition check
  timing.

## Implementation Progress

- 2026-05-24 Phase 1 completed: added a shared `LoadingStatus` component,
  upgraded `Spinner`, `PageLoading`, and `SubmitButton` to expose accessible
  status semantics, and converted the public shop product overlay, artwork
  masonry follow-up loader, and blog follow-up loader away from generic or
  status-less loading UI. Focused Jest coverage was added for the shared
  primitive and converted public loaders. Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/components/loadingStatus.test.tsx __tests__/unit/components/masonryLayoutLoadingStatus.test.tsx __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx`,
  `git diff --check`, and `npm run lint`.
- 2026-05-24 Phase 2 completed: added route-local loading shells for
  `/artwork` and `/search` through `src/app/artwork/loading.tsx`,
  `src/app/search/loading.tsx`, and a shared
  `PublicRouteLoadingShells` skeleton component. The shells preserve artwork
  filter/masonry and search results geometry while exposing accessible loading
  statuses. Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/publicRouteLoadingShells.test.tsx`,
  `git diff --check`, and `npm run lint`.

## Next Action

Add the `/shop/products` route-shaped loading shell. After those shells are in
place, make `Searchbar`, `SearchDrawerBody`, and the home artwork filter hero
expose pending feedback while preserving App Router client navigation.

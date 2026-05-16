# Frontend Routes And Components Workstream

Status: Active

Goal: stabilize public pages, component composition, responsive behavior, and
Next.js server/client component boundaries.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Testing runbook](../runbooks/testing.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-017 Search, navigation, and content discovery](../audits/goals.md#a-017-search-navigation-and-content-discovery)
- [A-010 Performance, SEO, and accessibility](../audits/goals.md#a-010-performance-seo-and-accessibility)

## Blocks

- Public UX production polish.
- Safe refactors across shared component modules.
- Shop and archive route hardening.

## Related Code Areas

- `src/app/`
- `src/components/views/`
- `src/components/layouts/`
- `src/components/modules/`
- `src/components/compositions/`
- `src/components/loaders/`
- `src/components/shadcn/`

## Current Facts

- The app uses App Router server components for pages and loader components.
- Public route groups include home, artwork, collections, biography, blog,
  project, search, and shop.
- Shared card, navigation, filter, and loader modules are reused across routes.
- Historical shop notes identify barrel exports as a client bundle risk.
- A-013 and A-015 found client components importing server/model modules or
  broad barrels that can cross client/server boundaries.
- A-015 found public loaders handle error, empty, and not-found states
  inconsistently.
- A-001 found visible shop filter, pagination, and sorting controls whose UI
  behavior is not backed consistently by API data.
- A-002 found public list APIs have inconsistent empty-state semantics and that
  public search omitted pagination metadata; T-021 now honors the public search
  fetcher's `type` parameter.
- A-016 found legacy search, auth, and comment controls that need accessible
  labels or button semantics, and confirmed public search/filter UI relies on
  API query parsing that is not yet bounded server-side. T-021 bounded the
  public search route/page query parser; T-035 bounded artwork browse filters;
  T-036 bounded shop browse filters.
- T-013 fixed the sign-in credential field labels and converted the sign-in and
  sign-up modal switches from clickable spans to buttons.
- T-019 removed the stale `/protected` App Router page and protected-route
  constant; no documented frontend workflow owned that route.
- T-021 updated the `/search` page so its initial server render uses direct
  server data access and bounded query parsing instead of same-app HTTP.
- T-035 validates public artwork browse query params before the artwork list
  service receives them; existing valid frontend filter behavior was preserved.
- T-036 validates public shop browse query params at the API boundary while
  preserving existing valid shop filter UI behavior.
- T-060 removed public shop controls that were visible but not backed by API
  behavior: colour/dimension filters and hard-coded pagination.
- T-061 replaced public shop default type sorting that read product titles with
  metadata-based sorting from Shopify `productType`.
- T-067 removed direct debug logging, polling, and widget DOM/iframe inspection
  from the admin Cloudinary upload button without changing upload widget
  behavior.
- T-068 removed direct public shop gallery and loader debug logging, and the
  loader no longer tells public users to check the console on product-loading
  failures.

## Backlog

- Map server and client component boundaries for public routes.
- Identify barrel exports used from client components.
- Replace client component value imports from server APIs, Mongoose model
  barrels, and broad mixed client/server barrels with client-safe APIs, shared
  frontend types, or direct imports.
- Audit loading, error, not found, and empty states on public pages.
- Define loader error contracts by route type: public detail pages, section
  loaders, route-critical fetches, and empty archive views.
- Stabilize responsive behavior for artwork, collections, shop, and search.
- Audit search, navigation, breadcrumbs, filters, and content discovery paths.
- Align public empty, not-found, and search-result states with the data/API
  route contracts once A-002 empty-list and search metadata semantics are chosen.
- Align any future shop pagination or server-side sorting UI with backed API
  behavior before exposing new controls.
- Replace clickable search icons, unlabeled drawer triggers, and icon-only
  comment actions with accessible controls when each flow is refactored.
- Decide the i18n/frontend language direction before pruning unused translation
  UI.
- Add smoke-level tests for high-value public pages.

## Acceptance Criteria

- Public routes render predictable loading, empty, and error states.
- Client components avoid importing server-only dependencies.
- Route-level data fetching patterns are consistent and documented.
- Shared component changes have targeted tests or smoke coverage.

## Verification

```bash
npm test
npm run build
```

Use browser checks for layout-sensitive changes.

## Progress

- Documentation scaffold created.
- 2026-05-14: Reconciled A-001, A-013, A-014, and A-015 frontend findings into
  `docs/audits/findings-register.md`, production risks, and this backlog.
- 2026-05-14: Reconciled A-002 public list/search semantics into F-049 and this
  backlog.
- 2026-05-14: Reconciled A-016 search/query and accessibility findings into
  F-060 and F-062.
- 2026-05-14: Completed the T-013 sign-in accessibility slice with visible
  credential labels, field error relationships, and keyboard-accessible modal
  switch buttons.
- 2026-05-14: T-019 removed the stale `/protected` frontend route and added
  focused route utility coverage that it is no longer protected.
- 2026-05-14: Prepared T-021 to harden public search query handling and move
  `/search` initial server rendering off same-app HTTP.
- 2026-05-14: Completed T-021; `/search` now parses bounded query params,
  displays stable invalid-query states, and gets initial results from
  `getPublicSearchResults` instead of `serverApi.public.search.search(...)`.
- 2026-05-15: Prepared T-035 to bound public artwork browse query params while
  preserving existing valid filter behavior.
- 2026-05-15: Completed T-035 without changing artwork filter UI behavior; the
  API route now normalizes valid filter/sort/color/pagination params and rejects
  invalid public query values before service work.
- 2026-05-15: Prepared T-036 as an API-boundary slice for shop browse query
  params. It should keep existing valid shop filter UI behavior unchanged and
  escalate only if the UI sends values outside canonical constants.
- 2026-05-15: Completed T-036 without changing shop filter UI behavior; the API
  route now normalizes valid shop listing filters and rejects invalid public
  query values before MongoDB or Shopify work.
- 2026-05-16: Prepared T-060 as the first focused F-013 shop UI alignment
  slice. It removes visible colour/dimension filters and placeholder pagination
  that are not backed by API behavior while preserving backed shop filters,
  product-type checkboxes, result count, and sort controls.
- 2026-05-16: Completed T-060; `ShopFilters` no longer renders unsupported
  colour/dimension selects, `ShopResultsBar` no longer renders fake pagination,
  and focused component tests prove backed controls remain available.
- 2026-05-16: Prepared T-061 as the next shop UI/data-contract alignment slice.
  It should stop default shop type sorting from reading product titles and use
  explicit Shopify product metadata instead.
- 2026-05-16: Completed T-061; `ShopProductGallery` now sorts the default
  type view from explicit Shopify `productType` metadata, keeps unknown types
  last, and preserves existing price/title sort behavior.
- 2026-05-16: Completed T-067 as a focused frontend/admin component cleanup
  slice for `UploadButton` debug logging. It preserves the current
  `CldUploadWidget` props, loading/open behavior, and success callback.
- 2026-05-16: Prepared T-068 as a focused public shop frontend cleanup for
  `ShopProductGallery` and `ShopProductsLoader` debug logs while preserving
  backed filter, sort, loading, and empty-state behavior.
- 2026-05-16: Completed T-068; `ShopProductGallery` and `ShopProductsLoader`
  no longer emit direct `console.log` output during normal rendering,
  filtering, or sorting, and the loader failure state now uses neutral
  retry/contact copy while focused component/source tests preserve behavior.
- 2026-05-16: Prepared T-070 as a route-critical frontend loader migration.
  `CollectionsSubnavLoader` should use a shared server-only collection
  navigation service instead of `serverPublicApi` while rendering the same
  `Subnav` links.

## Next Agent Action

Assign T-070:
`/task effort: high details: docs/tasks/T-070-migrate-collections-subnav-loader-service.md`

Keep real pagination, checkout/cart, remaining Shopify product transform fields,
and admin product-linking separate.

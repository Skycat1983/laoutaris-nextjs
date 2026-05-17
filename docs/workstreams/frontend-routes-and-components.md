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
- T-070 moved `CollectionsSubnavLoader` to the shared server-only
  `getCollectionNavigationList` service while preserving rendered `Subnav`
  link construction.
- T-071 moved `BiographySubnavLoader` and `MainNavLoader` to shared server-only
  navigation services while preserving rendered `Subnav` and `MainNav` links.
- T-072 moved the biography default redirect page and `ArticleLoader`
  navigation path to `getArticleNavigationList` while preserving redirect and
  previous/next link behavior.
- T-073 moved the collection redirect pages to server-only collection
  navigation services while preserving redirect target paths.
- T-074 moved `ArticleLoader`'s populated article detail data to
  `getArticleBySlugPopulated` while preserving `ArticleView` props, optional
  form rendering, and previous/next navigation.
- T-075 moved `BlogDetailLoader` to shared server-only blog detail services
  while preserving `BlogDetail` props and `showComments` behavior.
- T-076 moved `BlogListLoader` and `BlogSectionLoader` to a shared server-only
  blog list service while preserving blog list/section props and current sort
  behavior.
- T-077 moved `ArtworkLoader` to the existing server-only artwork detail
  service while preserving `ArtworkView` props, the subscribe section, and
  generic load-failure behavior.
- T-078 moved `CollectionArtworkLoader` and
  `CollectionArtworksPaginationLoader` to shared server-only collection artwork
  services while preserving selected artwork rendering and pagination links.
- T-079 moved `BiographySectionLoader` to the shared server-only
  `getArticleList` service while preserving `BiographySection` props and
  fallback behavior.
- T-080 moved `CollectionSectionLoader` to the shared server-only
  `getCollectionList` service while preserving `CollectionSection` props and
  fallback behavior.
- T-081 moved `AccountSubnavLoader` to a shared server-only account navigation
  service while preserving account subnav links, disabled states, and first
  favourite/watchlist segment behavior.
- T-083 moved the account favourites/watchlist list and detail loaders to
  shared server-only saved-artwork services while preserving saved-item
  pagination links and `ArtworkView` props.
- T-084 moved `UserSettingsLoader` and `UserCommentsLoader` to shared
  server-only profile/comment services while preserving account settings props,
  comment view props, and focused loader failure behavior.
- T-085 moved `ShopProductsLoader` to shared server-only `getShopProductList`
  service logic while preserving `ShopProductGallery` props, backed shop filter
  inputs, and the neutral loader failure UI.
- T-086 replaced the remaining hard-coded same-app origins in `LogoutForm`,
  `MobileNavDrawer`, and the `/project` redirect with relative app paths while
  preserving current account drawer labels, order, and disabled states.
- T-087 removed the stale account favourites `serverApi` import and commented
  old self-fetch block while preserving the current redirect to
  `/account/settings`.
- T-089 removed direct render `console.log()` output from root layout,
  `Subnav`, `ArticleView`, `DesktopArticleView`, and `UserCommentsView` while
  preserving layout, navigation, article, and account comments behavior.
- T-090 removed remaining scoped user-facing public/account `console.log()`
  output from `ClientContextBoundary`, `ArtworkGallery`, `BlogDetail`,
  `EnquiryForm`, `SubscribeSectionLoader`, the account favourite artwork page,
  and `CollectionViewPagination` while preserving the current public/account
  behavior.
- T-091 removed direct `console.log()` output from the scoped admin dashboard
  create/update forms and artwork filter dropdowns while preserving current
  dashboard validation, upload, submit/update, and filter behavior.
- T-092 removed success-path `console.log()` output from scoped admin read-list
  copy flows, `ArtworkFeedCard`, and the shared `copy_id()` helper while
  preserving copy-to-clipboard, read-list fetch, filter, loading, error, card,
  and skeleton behavior.
- T-093 removed direct `console.log()` output from shared UI components and
  the public artwork fetcher while preserving feed rendering, navigation
  active/disabled behavior, refresh behavior, YouTube embed behavior, and
  artwork query URL construction.
- T-095 removed stale commented `console.log()` snippets from the session
  provider, collection section, main navigation, and admin content layout while
  preserving rendering behavior. Full-source source-hygiene coverage now keeps
  `src` free of direct or commented `console.log()` calls.

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
- 2026-05-16: Completed T-070; `CollectionsSubnavLoader` now calls
  `getCollectionNavigationList` directly, no longer imports `serverPublicApi`,
  and remains covered by focused loader tests for link construction and no
  same-app fetches.
- 2026-05-16: Prepared T-071 as the next route-critical frontend loader
  migration. It should remove article-navigation same-app HTTP from
  `BiographySubnavLoader` and `MainNavLoader` while preserving link labels,
  path formats, and existing nav component behavior.
- 2026-05-16: Completed T-071; `BiographySubnavLoader` now calls
  `getArticleNavigationList("biography")` directly, and `MainNavLoader` now
  calls `getArticleNavigationList("biography")` plus
  `getCollectionNavigationList()` directly while preserving link labels and
  path formats.
- 2026-05-16: Prepared T-072 as the next article-navigation frontend migration.
  It should remove navigation same-app HTTP from `src/app/biography/page.tsx`
  and `ArticleLoader` while preserving the default redirect and previous/next
  article links.
- 2026-05-16: Completed T-072; the biography default page now redirects from
  the ordered server-only article navigation service, and `ArticleLoader` now
  builds previous/next links from `getArticleNavigationList(section)` while
  preserving `ArticleView` props and article detail fetching.
- 2026-05-16: Completed T-073; `/collections` now redirects from
  `getCollectionNavigationList`, and `/collections/[slug]` now redirects from
  `getCollectionNavigationItem` without same-app navigation HTTP or slug debug
  logging.
- 2026-05-16: Completed T-074 as the next route-critical frontend migration;
  `ArticleLoader` now calls `getArticleBySlugPopulated` for article detail data
  and `getArticleNavigationList(section)` for previous/next navigation, with
  no same-app HTTP dependency and unchanged `ArticleView` props.
- 2026-05-16: Completed T-075 as the next route-critical frontend migration;
  `BlogDetailLoader` now calls `getBlogBySlugWithAuthor` or
  `getBlogBySlugWithComments` directly, no longer imports `serverPublicApi`,
  no longer emits direct result `console.log` output, and preserves both
  comments and non-comments `BlogDetail` props.
- 2026-05-16: Prepared T-076 as the next blog frontend migration. It should
  remove blog list same-app HTTP from `BlogListLoader` and `BlogSectionLoader`
  while preserving grouped list data, single-sort list data, pagination link
  construction, and section card rendering.
- 2026-05-16: Completed T-076; `BlogListLoader` and `BlogSectionLoader` now
  call `getBlogList` directly, no longer import `serverApi` or
  `serverPublicApi` for blog lists, and preserve grouped list data,
  single-sort list data, pagination link construction, and section card
  rendering.
- 2026-05-16: Prepared T-077 as the next route-critical frontend loader
  migration. It should remove artwork detail same-app HTTP from
  `ArtworkLoader` while preserving `ArtworkView` props, the subscribe section,
  and generic load-failure behavior.
- 2026-05-16: Completed T-077; `ArtworkLoader` now calls
  `getArtworkById(params.id, userId)` directly after reading optional session
  user context, no longer imports `serverApi`, no longer waits on `delay`, and
  no longer logs direct artwork load results.
- 2026-05-16: Prepared T-078 as the next route-family frontend migration. It
  should remove collection artwork same-app HTTP from
  `CollectionArtworkLoader` and `CollectionArtworksPaginationLoader` while
  preserving selected artwork rendering, collection artwork pagination links,
  and existing non-Next failure fallback behavior.
- 2026-05-16: Completed T-078; `CollectionArtworkLoader` now calls
  `getCollectionArtwork(slug, artworkId)` directly, and
  `CollectionArtworksPaginationLoader` now calls
  `getCollectionWithArtworks(slug)` directly while preserving selected artwork
  props, pagination link construction, heading text, and null fallback behavior
  for non-Next loading failures.
- 2026-05-16: Prepared T-079 as the next frontend section-loader migration. It
  should remove article list same-app HTTP from `BiographySectionLoader` while
  preserving `BiographySection` props and null fallback behavior for non-Next
  loading failures.
- 2026-05-16: Completed T-079; `BiographySectionLoader` now calls
  `getArticleList({ section: "biography" })` directly, no longer imports
  `serverPublicApi`, and preserves `BiographySection` props plus null fallback
  behavior for non-Next loading failures.
- 2026-05-16: Prepared T-080 as the next frontend section-loader migration. It
  should remove collection list same-app HTTP from `CollectionSectionLoader`
  while preserving `CollectionSection` props and null fallback behavior for
  non-Next loading failures.
- 2026-05-16: Completed T-080; `CollectionSectionLoader` now calls
  `getCollectionList({ section: "collections", limit: 9 })` directly, no
  longer imports `serverApi`, and preserves `CollectionSection` props plus null
  fallback behavior for non-Next loading failures.
- 2026-05-17: Prepared T-081 as the next frontend loader migration. It should
  remove user navigation same-app HTTP from `AccountSubnavLoader` while
  preserving account subnav link labels, order, paths, disabled states, and
  first favourite/watchlist segment behavior.
- 2026-05-17: Completed T-081; `AccountSubnavLoader` now reads the current
  session user ID and calls `getOwnUserNavigation` directly, no longer imports
  `serverApi`, and preserves account subnav labels, order, paths, disabled
  states, first favourite/watchlist segment links, and cart/orders disabled
  behavior.
- 2026-05-17: Completed T-083; `FavouritesPaginationLoader`,
  `WatchlistPaginationLoader`, `FavouritedArtworkLoader`, and
  `WatchlistedArtworkLoader` now read the current session user ID and call
  shared saved-artwork services directly, no longer import `serverApi`, and
  preserve saved-item pagination headings, account saved-item links,
  `ArtworkView` props, and focused failure behavior.
- 2026-05-17: Completed T-084; `UserSettingsLoader` and
  `UserCommentsLoader` now read the current session user ID and call shared
  profile/comment read services directly, no longer import `serverApi`, and
  preserve account settings props, `UserCommentsView` props, and focused
  unauthorized/missing-user/failure behavior.
- 2026-05-17: Completed T-085; `ShopProductsLoader` now validates converted
  `initialFilters` through the shared shop product query schema and calls
  `getShopProductList` directly, no longer reads `NEXT_PUBLIC_BASE_URL`, no
  longer falls back to localhost, and no longer calls same-app `fetch()` for
  initial products.
- 2026-05-17: Prepared T-086 to remove hard-coded localhost app origins from
  logout navigation, mobile auth links, and the `/project` redirect while
  preserving current labels, ordering, disabled states, and redirect targets.
- 2026-05-17: Completed T-086; logout success navigation now pushes `/`, the
  mobile drawer's Sign Up and Log In account links use `/api/auth/signin`, and
  `/project` redirects to `/project/about` without an origin.
- 2026-05-17: Prepared T-087 to remove the stale account favourites
  `serverApi` import/commented self-fetch block while preserving the current
  redirect to `/account/settings`.
- 2026-05-17: Completed T-087; `src/app/account/favourites/page.tsx` now only
  imports `redirect`, keeps the `/account/settings` redirect, and carries no
  stale server-wrapper self-fetch code.
- 2026-05-17: Prepared T-089 to remove direct render `console.log()` calls from
  root layout, `Subnav`, `ArticleView`, `DesktopArticleView`, and
  `UserCommentsView` while preserving layout, navigation, article, and account
  comments behavior.
- 2026-05-17: Completed T-089; root layout, `Subnav`, `ArticleView`,
  `DesktopArticleView`, and `UserCommentsView` no longer emit direct render
  `console.log()` output, and focused source-hygiene coverage prevents the
  retired branch verification, link, article, title, and comments debug strings
  from returning.
- 2026-05-17: Prepared T-090 to remove remaining user-facing public/account
  `console.log()` output from `ClientContextBoundary`, `ArtworkGallery`,
  `BlogDetail`, `EnquiryForm`, `SubscribeSectionLoader`, the account favourite
  artwork page, and `CollectionViewPagination` while preserving behavior.
- 2026-05-17: Completed T-090; the scoped user-facing public/account files no
  longer emit direct `console.log()` output. `ArtworkGallery` now receives
  neutral starting-data/default prop names from `ArtworkListLoader` while
  preserving initial filters, sorting, filter clearing, load-more behavior,
  duplicate prevention, and empty-state rendering.
- 2026-05-17: Prepared T-091 to remove direct `console.log()` output from
  scoped admin dashboard create/update forms and artwork filter dropdowns while
  preserving current dashboard validation, upload, submit/update, and filter
  behavior.
- 2026-05-17: Completed T-091; the scoped admin dashboard create/update form
  and artwork filter files no longer emit direct `console.log()` output, and
  focused source-hygiene coverage prevents those logs from returning.
- 2026-05-17: Prepared T-092 to remove success-path `console.log()` output
  from scoped admin read-list copy flows, `ArtworkFeedCard`, and the shared
  `copy_id()` helper while preserving copy-to-clipboard, read-list fetch,
  filter, loading, error, card, and skeleton behavior.
- 2026-05-17: Completed T-092; the scoped admin read-list copy flows,
  `ArtworkFeedCard`, and shared `copy_id()` helper no longer emit success-path
  `console.log()` output, and `ReadArtworkList` no longer logs artwork arrays
  during render.
- 2026-05-17: Prepared T-093 to remove direct `console.log()` output from
  shared UI components and the public artwork fetcher while preserving feed
  rendering, navigation active/disabled behavior, refresh behavior, YouTube
  embed behavior, and artwork query URL construction.
- 2026-05-17: Completed T-093; `Feed`, `NavItem`, `RefreshButton`,
  `YoutubeEmbedding`, and the public artwork fetcher no longer emit direct
  `console.log()` output, and focused coverage preserves artwork fetcher URL
  construction.
- 2026-05-17: Prepared T-095 to remove stale commented `console.log()` snippets
  from the session provider, collection section, main navigation, and admin
  content layout paths while preserving rendering behavior.
- 2026-05-17: Completed T-095 by removing stale commented `console.log()`
  snippets from the session provider, collection section, main navigation, and
  admin content layout paths while preserving rendering behavior. Full-source
  source-hygiene coverage now keeps `src` free of direct or commented
  `console.log()` calls.

## Next Agent Action

Pick the next scoped frontend/source cleanup from the remaining open findings
and risks.

Do not reassign T-081, T-082, T-083, T-084, T-085, T-086, T-087, T-088,
T-089, T-090, T-091, T-092, T-093, T-094, or T-095 unless a regression is
opened.

Keep favourite/watchlist server actions, broader account navigation, user
comment mutations, profile editing, real pagination, checkout/cart, remaining
Shopify product transform fields, visible admin product-linking UI, client
fetcher behavior beyond the scoped public artwork fetcher, test-session
override logs, root-layout DB/session ownership, and broad route-builder
centralization separate.

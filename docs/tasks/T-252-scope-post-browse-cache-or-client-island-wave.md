# T-252 Scope Post-Browse Cache Or Client-Island Wave

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Decide whether the next A-022 efficiency task should continue F-111 cache work
after the completed blog and artwork browse proofs, or pause route-cache work
for a scoped F-115 provider/client-island optimization.

## Context

- T-233, T-238, and T-239 completed the accepted biography, collections, and
  sitemap freshness proofs.
- T-241 through T-247 completed the staged blog cache proofs while keeping blog
  routes dynamic and comments/API reads direct.
- T-249 and T-251 completed the bounded `/artwork` browse cache proofs for
  unfiltered `mostRecent` pages 1-5, limit 10.
- Remaining F-111 candidates are higher risk: artwork detail splitting,
  collection-scoped artwork detail, page 6-plus or filtered artwork browse
  variants, public search, shop listing/detail, route-level ISR, generated
  params, cache tags, and mutation revalidation.
- F-115 remains partially mitigated after T-236 lazy-loaded the mobile search
  and navigation drawer bodies, but broader root provider/modal ownership was
  deferred as cross-cutting.

## Scope

In scope:

- Review source, tests, and docs for these candidate next tracks:
  - split cacheable artwork detail metadata/JSON-LD or primary data from
    session-aware visible detail rendering
  - split collection-scoped artwork detail reads from dynamic membership and
    Shopify-linked rendering
  - extend `/artwork` browse caching to page 6-plus or filtered variants
  - define public search as explicitly request-time or identify a bounded
    non-arbitrary cache proof
  - define shop listing/detail cache policy or keep commerce routes dynamic
  - scope an F-115 provider/client-island task after T-236
- Compare candidates by user impact, freshness risk, key cardinality,
  personalization/session risk, Shopify or external-service coupling,
  mutation revalidation needs, route-cache policy changes, testability, and
  blast radius.
- Decide whether to:
  - create one bounded F-111 runtime task,
  - create one F-115 provider/client-island scoping or runtime task,
  - create a docs-only policy task for a high-risk surface before runtime work,
  - or pause this efficiency track.
- Prepare exactly one follow-up task brief if the boundary is clear.
- Update this task brief with the decision, rejected candidates, and next
  assignment pointer.

Out of scope:

- Do not edit runtime source, tests, route segment config, cache wrappers,
  query parsers, data services, providers, package files, Playwright setup, or
  CI workflows.
- Do not add `unstable_cache`, route-level ISR, `generateStaticParams()`,
  cache tags, `revalidatePath()`, `revalidateTag()`, provider moves, Shopify
  fetch changes, public API caching, or mutation revalidation in this task.
- Do not cache user/session state, saved-item ownership, admin/account routes,
  comments, public browser follow-up fetches, arbitrary search terms, checkout
  or cart behavior, or mutation responses.
- Do not extend artwork browse caching beyond T-251 unless this task creates a
  separate bounded follow-up.

## Concurrency

Run after T-251. Do not run in parallel with public artwork detail/browse,
public search, shop routes, cached service wrappers, provider/client-island,
route-cache policy, saved-item action, Shopify product-link, or related test
runtime edits.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally one new follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if the selected next action
  changes

Do not edit runtime source in this task.

## Acceptance Criteria

- The scoping pass compares remaining F-111 cache candidates and the F-115
  provider/client-island option with concrete source/test evidence.
- The decision identifies one recommended next assignment or explicitly says to
  pause the efficiency track.
- Any selected implementation plan defines route/component family, included
  reads or client islands, excluded behavior, stale window or bundle target,
  cache key/route policy/provider shape, direct/dynamic fallbacks, and required
  tests.
- The decision explicitly addresses saved-item/session personalization,
  Shopify freshness, query-cardinality risk, mutation revalidation, and
  provider/modal blast radius where relevant.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted source/test reads, `rg` searches, and current architecture
documentation. Run `npm run build` only if fresh route-output or bundle
evidence is needed to make the decision.

## Handoff Notes

- Findings: F-111 and F-115.
- Risk: R-012.
- Depends on: T-251.
- This task is intentionally docs-only because the remaining efficiency work is
  riskier than the completed fixed public list proofs.

## Source And Test Review

- `/artwork` browse caching is now limited by source and tests to fixed
  unfiltered `mostRecent` pages 1-5, limit 10, `filterMode: "ALL"`, no
  taxonomy filters, and no `sortColor`. `ArtworkListLoader` sends any page
  6-plus, non-default limit, filtered, `filterMode: "ANY"`, non-default sort,
  or color-proximity shape back to direct `getArtworkList()` reads.
- `getArtworkList()` still supports page values up to 1000, limits up to 50,
  taxonomy arrays, `mostPopular`, `mostFeatured`, and arbitrary valid hex
  `colorProximity` values. That makes the remaining browse variants materially
  higher-cardinality than the completed fixed wrappers.
- Standalone artwork detail is explicitly dynamic. Metadata and structured data
  call `getArtworkById(id)` without a user ID, but visible detail rendering
  calls `getUserIdFromSession()` and then `getArtworkById(id, userId)` so
  saved-item ownership remains request-time. The visible loader also resolves
  optional Shopify product links through `getArtworkShopProducts()`.
- Collection-scoped artwork detail is explicitly dynamic. Metadata, structured
  data, and visible rendering all use `getCollectionArtwork(slug, artworkId)`,
  and visible rendering then resolves optional Shopify product links. Collection
  membership is primary route content, not only related metadata.
- `/search` remains explicitly dynamic. `q` is length-bounded but arbitrary,
  page can reach 1000, and results span MongoDB-backed articles, blogs,
  collections, artworks, and Shopify products through `getShopProductList()`.
- `/shop/products` and `/shop/products/[productHandle]` remain explicitly
  dynamic. Listing reads MongoDB artwork product links and fans out to Shopify
  by product ID; detail reads Shopify by handle, availability, hosted purchase
  URL, price/variant metadata, and optional MongoDB linked artwork/book artwork
  context.
- Shopify Storefront fetches already use a one-hour production `next.revalidate`
  policy in `shopifyClient`. Layering a non-`fetch` service cache over shop
  routes would need a commerce policy for availability, hosted URL fallback,
  price/variant freshness, unavailable products, and linked-artwork degradation.
- Root layout still wraps the global modal, header, page content, and footer in
  `ClientContextBoundary`. That client boundary mounts `SessionProvider` and
  `GlobalFeaturesProvider`; `GlobalFeaturesProvider` combines modal state with
  language state. T-236 lazy-loaded mobile drawer bodies but did not move root
  providers.
- `useGlobalFeatures()` consumers remain broad: global `Modal`, saved-item
  buttons, blog detail comments, account navigation, auth/contact/enquiry/logout
  forms, admin operation tabs, comment cards, and the currently unused
  `TranslatedContent` language consumer. `useSession()` consumers include
  mobile nav drawer body, account navigation, auth forms, and comment cards.
- Existing tests guard the selected boundaries:
  `getCachedArtworkListData.test.ts`, `ArtworkListLoader.test.tsx`,
  `ArtworkLoader.test.tsx`, `CollectionArtworkLoader.test.tsx`,
  `getCollectionArtwork.test.ts`, `searchPage.test.tsx`,
  `getPublicSearchResults.test.ts`, `ShopProductsLoader.test.tsx`,
  `getShopProductList.test.ts`, `shopProductDetailPage.test.tsx`,
  `shopifyClientTransform.test.ts`, and `publicRouteCachePolicy.test.ts`.

## Candidate Comparison

| Candidate | User impact | Freshness and key risk | Personalization, Shopify, or mutation risk | Testability and blast radius | Decision |
| --- | --- | --- | --- | --- | --- |
| Split artwork detail metadata/JSON-LD or primary data from visible detail rendering | Medium. Detail pages can repeat primary MongoDB reads for metadata, JSON-LD, and body rendering. | Medium. ObjectId keys are stable, but not-found behavior, owner edits, and cache lifetime need a detail-specific policy. | High if blurred into visible rendering: saved-item ownership is session-derived, and visible detail resolves Shopify product links. Saved-item mutations must not require public detail cache revalidation. | Good focused coverage exists, but the implementation boundary is subtle. | Defer. Do not make it the next runtime task without a dedicated detail-data policy. |
| Split collection-scoped artwork detail reads | Medium. It could reduce repeated slug/artwork membership reads. | Medium-high. Keys include slug plus artwork ID, and stale collection membership changes would affect primary page content. | Optional Shopify product-link reads stay dynamic, and collection membership is central to the route. | Good service/loader coverage exists, but blast radius includes collection detail semantics. | Defer until standalone detail splitting is proven or a collection membership freshness policy is accepted. |
| Extend `/artwork` browse caching to page 6-plus | Low-medium. Deep unfiltered archive pages may be visited, but the hot public path is already covered through page 5. | Medium. Fixed page wrappers would still be finite, but adding deeper pages mostly increases cache surface without evidence of repeated demand. | Low for unfiltered `mostRecent`, but artwork creates/updates can shift deep pages and widen stale archive windows. | Easy to test, but marginal value after T-251. | Reject for the next wave. Need traffic or owner priority before deeper page wrappers. |
| Extend `/artwork` browse caching to filtered or non-default variants | Medium. Filtered archive browsing is user-facing. | High. Filter arrays, page 1-1000, limit 1-50, `filterMode`, and arbitrary `sortColor` create a large practical key space; `mostPopular` can shift after saved-item mutations. | `mostPopular` is mutation-sensitive; arbitrary color searches should stay direct. | Testable, but policy and dispatcher complexity would grow sharply. | Reject for now. Keep filtered and non-default variants direct. |
| Public search cache proof | Medium. Search spans several content families and can be expensive. | High. Arbitrary `q`, type filters, page variants, and mixed result sources make stale behavior difficult to explain. | Shopify product results depend on commerce freshness via `getShopProductList()`. | Parser/page/service tests exist, but a safe cache key policy is not clear. | Reject. Keep public search request-time. |
| Shop listing/detail cache policy or runtime cache | Medium. Commerce pages can repeat reads. | High. Availability, hosted purchase URL, price/variant fields, unavailable products, and linked artwork context are commerce-sensitive. | Shopify fetch already has production revalidation; adding service caching risks double freshness policy and checkout-adjacent stale data. | Good tests exist, but blast radius is commerce-facing. | Reject as runtime work. A future commerce-cache policy task must precede implementation. |
| F-115 provider/client-island follow-up after T-236 | Medium. T-236 reduced the root layout client chunk, but shared first-load route totals stayed effectively flat and root providers remain global. | No route-cache risk. The risk is UI/provider ownership rather than stale data. | Cross-cutting: modal, session, saved-item intent, auth forms, comments, account, admin operation tabs, and unused language state share global context paths. | Needs careful scoping before runtime moves; build evidence plus focused behavior/source tests can bound it. | Select next as a scoping task, not runtime implementation. |

## Decision

Pause F-111 runtime cache expansion and create
[T-253 Scope root provider and modal client-island split](T-253-scope-root-provider-modal-client-island-split.md)
as the next A-022 efficiency assignment.

This is a pause on runtime cache work, not a closure of F-111. The completed
F-111 proofs now cover the low-risk fixed public list and redirect surfaces:
biography, collections, sitemap, blog primary/default/sorted bounded reads, and
unfiltered `/artwork` pages 1-5. The remaining F-111 candidates all require a
policy decision before code because they involve personalized detail rendering,
collection membership freshness, arbitrary query cardinality, commerce data, or
mutation-sensitive ordering.

The selected follow-up should stay docs-only. It should inventory the current
post-T-236 provider/client-island shape, compare root modal/provider split
options, and choose at most one later runtime task. It should explicitly define
provider shape, included client islands, excluded account/admin/auth/comment
behavior, required tests, and whether fresh build output is needed before any
runtime provider move.

## Rejected Or Deferred Work

- Artwork detail caching is deferred until a detail-specific policy separates
  cacheable public primary reads from visible saved-item/session rendering and
  optional Shopify product-link reads.
- Collection-scoped artwork detail caching is deferred because collection
  membership is primary content and needs its own freshness decision.
- `/artwork` page 6-plus caching is deferred until traffic, owner priority, or
  another concrete signal justifies the additional fixed wrappers.
- Filtered artwork browse caching remains deferred because query-cardinality and
  mutation-sensitive sort risk are materially higher than the completed fixed
  `mostRecent` list proofs.
- Public search stays request-time because arbitrary terms, type/page variants,
  and mixed MongoDB/Shopify freshness make stale behavior hard to explain.
- Shop listing/detail route caching stays deferred until a commerce-specific
  cache policy addresses Shopify's existing fetch revalidation, availability,
  hosted purchase URL fallback, prices/variants, unavailable products, and
  linked-artwork degradation.

## Completion Notes

- Completed 2026-05-24 as a docs-only scoping task.
- No runtime source, tests, route segment config, cache wrappers, query parsers,
  data services, providers, package files, Playwright setup, or CI workflows
  were changed.
- Created T-253 as the selected F-115 scoping follow-up.
- Updated the task index and relevant workstream next-agent-action sections to
  route the next A-022 efficiency assignment through T-253.
- Verification passed: `git diff --check`.

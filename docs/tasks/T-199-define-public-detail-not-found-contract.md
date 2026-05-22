# T-199 Define Public Detail Not-Found Contract

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Define the public detail route not-found/error contract before implementation
changes across artwork, collection-scoped artwork, article, blog, and product
detail routes.

## Context

- A-005 found public detail routes do not share one reliable not-found/error
  contract.
- Standalone artwork validates malformed IDs in the page but can throw generic
  loader errors when valid IDs are missing.
- Article and blog detail loaders can throw through route rendering for missing
  primary content.
- Collection-scoped artwork can return `null` for non-`found` service results,
  causing a blank main area.
- Product detail already calls `notFound()` for missing Shopify products.
- Changing all detail routes at once has broad UX and cache/rendering impact, so
  the contract should be recorded before runtime implementation tasks are split.

## Scope

In scope:

- Document the accepted behavior for each public detail route family:
  - malformed route params;
  - valid-but-missing primary content;
  - upstream/service failures;
  - optional related-content failures.
- Decide whether route-local `not-found.tsx` files, a shared public not-found
  view, or route-specific not-found UI should be used.
- Decide where `notFound()` should be called: page, route-local loader, shared
  service result mapping, or a narrow wrapper.
- Identify the first implementation slice and any later slices needed for
  articles/blogs, artwork, collection-scoped artwork, and Shopify products.
- Add candidate task briefs or handoff notes for the first implementation slice
  without changing runtime behavior.

Out of scope:

- Do not change route/page/loader/component runtime behavior in this task.
- Do not add route-local `not-found.tsx` files yet.
- Do not change metadata, JSON-LD, sitemap, cache policy, product enquiry, saved
  artwork behavior, comments, or Shopify fetching.
- Do not resolve home section loader, client follow-up fetch, mixed barrel, or
  account subnav findings.

## Concurrency

Run this task alone with other work that touches public detail route contracts
or architecture docs. It can run in parallel with framed-preview review or
owner-decision docs that do not touch these files.

Owned files:

- `docs/architecture/rendering-and-data-fetching.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/tasks/T-199-define-public-detail-not-found-contract.md`
- optional next implementation task brief if prepared

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, and index files unless explicitly
assigned. List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The public detail route not-found/error contract is recorded in a durable
  architecture or workstream doc.
- The contract distinguishes missing primary content from upstream failures and
  optional related-content failures.
- The first runtime implementation slice is clearly scoped and assignable.
- No runtime behavior changes are made.

## Verification

```bash
rg -n "notFound|not-found|missing primary|upstream failure|public detail" docs/architecture docs/workstreams/frontend-routes-and-components.md docs/tasks/T-199-define-public-detail-not-found-contract.md
git diff --check
```

## Accepted Contract

Recorded in
[Rendering and data fetching](../architecture/rendering-and-data-fetching.md#public-detail-not-found-and-error-contract).

- Malformed canonical params should return `notFound()` before expensive data
  access. The currently canonical syntactic route params are MongoDB artwork
  IDs in `/artwork/[artworkId]` and `/collections/[slug]/[artworkId]`.
  Slugs and Shopify product handles remain opaque path segments unless a later
  accepted schema makes them stricter.
- Valid params with missing primary content should return `notFound()`.
  Primary content is the artwork, collection plus selected artwork membership,
  article, blog post, or Shopify product named by the URL.
- Upstream/service failures while loading primary content should throw through
  the App Router error boundary after structured server logging where the route
  or loader owns logging. Provider/database/transform failures should not be
  converted into 404s.
- Optional related-content failures should degrade without changing route
  status. Related Shopify product links, article navigation, comments, linked
  archive artwork, book artwork cards, framed-preview eligibility data, and
  structured data should not make a found primary detail page 404.
- Shared data services must not call `notFound()` because they also back API
  routes. The route page, server loader, or a narrow route-local wrapper should
  map service results to App Router control flow.
- Public detail not-found UI should use a shared view/component with
  route-local `not-found.tsx` files supplying route-appropriate labels and
  return links.

## Implementation Slices

First assignable runtime slice:

- Implement the accepted contract for `/artwork/[artworkId]` and
  `/collections/[slug]/[artworkId]` only.
- Add the shared public detail not-found component/view and route-local
  `not-found.tsx` files for those two route families.
- Keep standalone artwork's malformed ObjectId guard and add the same
  canonical ObjectId validation to collection-scoped artwork before
  `getCollectionArtwork()` can construct a MongoDB `ObjectId`.
- Map `getArtworkById()` returning `null` and `getCollectionArtwork()` statuses
  of `collection-not-found` or `artwork-not-found` to `notFound()`.
- Preserve optional Shopify product-link degradation and existing route cache
  policy, metadata helpers, JSON-LD Suspense behavior, saved artwork behavior,
  and visible artwork layout.
- Add focused tests for malformed IDs, valid-but-missing primary content,
  upstream failures, and optional product-link degradation for these route
  families.

Later slices:

- Convert biography/project article and blog detail loaders so missing primary
  articles or blog posts call `notFound()`, while article navigation and
  comment-related failures degrade for found primary content.
- Revisit Shopify product detail after the shared not-found UI exists. Missing
  Shopify products already call `notFound()`; this later slice should only
  align route-local not-found UI and focused coverage unless a regression is
  found.

## Agent Prompt

You are working on T-199. Read `AGENTS.md`, `docs/README.md`, the A-005 result,
the frontend and architecture workstreams, and
`docs/architecture/rendering-and-data-fetching.md`. Define the public detail
route not-found/error contract for artwork, collection-scoped artwork, article,
blog, and Shopify product detail pages. Do not change runtime source or tests.
Record the contract durably, identify the first implementation slice, run the
verification commands, and update this handoff with candidate tracker updates.

## Handoff Notes

- Prepared from A-005/F-105 as the first follow-up because inconsistent public
  detail not-found/error behavior is the highest-severity frontend audit
  finding.
- Completed as a documentation-only task on 2026-05-22. Runtime source and
  tests were not changed.
- Updated
  [Rendering and data fetching](../architecture/rendering-and-data-fetching.md#public-detail-not-found-and-error-contract)
  with the durable public detail not-found/error contract.
- Updated
  [Frontend routes and components](../workstreams/frontend-routes-and-components.md)
  so the next agent action is the first runtime slice for standalone and
  collection-scoped artwork detail routes.
- Candidate tracker updates for the orchestrator: mark F-105/T-199 contract
  definition complete in shared trackers, keep the implementation finding open
  until the artwork, collection-scoped artwork, article/blog, and product
  runtime slices are complete, and add or prepare a new runtime task for the
  first artwork detail implementation slice if a separate task file is desired.
- Reconciled by the orchestrator on 2026-05-22: T-200 was created as the first
  runtime implementation slice for standalone and collection-scoped artwork
  detail routes, then completed later the same day.

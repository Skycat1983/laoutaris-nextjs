# Rendering And Data Fetching

This document tracks the intended server-side rendering and data-fetching
strategy for the app. It is partially implemented through narrow proof routes,
but remains a staged migration target rather than a fully implemented
architecture contract.

## Current Position

- The app uses Next.js 14 App Router.
- Some pages and loader components are server-rendered.
- Some interactivity is handled by client components.
- Project owner reports that server-side rendering has been attempted but has
  not yet been successfully established as a reliable, consistent pattern.

## Desired Direction

Public archive and commerce pages should prefer server-rendered initial data
when it improves reliability, SEO, shareability, or first load behavior. Client
components should be used for interaction after initial render, such as filters,
sort controls, forms, drawers, and account actions.

## Accepted Server Data Pattern

[ADR 0004](../decisions/0004-server-data-access-ownership.md) accepts direct
server data-access services as the canonical server-side pattern. Server loaders,
API routes, and server actions should share server-only services that own
MongoDB/Shopify reads, transforms, and typed domain results. API routes remain
HTTP adapters for browser clients and external callers. Server loaders and
server actions should not fetch this same Next.js app through absolute HTTP URLs.

Implemented proof slices:

- `src/lib/data/services/getArtworkById.ts` is shared by the public artwork
  detail API and shop product detail archive-context reads.
- `src/lib/data/services/getArtworkList.ts` is shared by
  `ArtworkListLoader` and `GET /api/v2/public/artwork`, so the initial
  `/artwork` server render no longer self-fetches the same app for its artwork
  list.

## Patterns To Audit

- Page-level data fetching in `src/app/**/page.tsx`.
- Server loader components under `src/components/loaders/`.
- Client compositions that fetch after mount.
- API routes used only to support server-renderable page data.
- Cache and revalidation behavior for MongoDB and Shopify reads.
- Error, loading, empty, and not-found states.

## Open Questions

- Which routes must be fully server-rendered for production launch?
- Which routes can remain client-interactive after a server-rendered shell?
- What cache and revalidation policy should Shopify reads use?
- Which service result shape should become the standard across public, user, and
  admin data services?
- What test strategy proves SSR behavior without brittle implementation checks?

## Reconciled Audit Findings

[A-015](../audits/results/A-015-ssr-data-fetching.md) confirmed that the app has
the desired high-level shape for several public routes: server pages and
loaders provide initial data, then client components handle interaction.

The remaining production blockers are tracked through the
[architecture refactor workstream](../workstreams/architecture-refactor-and-code-health.md),
[production risks](../risks/production-readiness.md), and
[ADR 0004](../decisions/0004-server-data-access-ownership.md):

- Some server loaders and server API wrappers still self-fetch the same app over
  absolute HTTP URLs until migrated to the ADR 0004 service pattern.
- Several MongoDB-backed API routes and account server actions lack explicit DB
  connection ownership.
- The root layout performs DB/session work globally, which blocks route-specific
  cache and rendering policy.
- Cache/revalidation behavior is inconsistent across MongoDB-backed public data,
  user/admin data, and Shopify reads.

Track discovery in
[A-015 SSR and data-fetching strategy](../audits/goals.md#a-015-ssr-and-data-fetching-strategy)
and implementation work in
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md).

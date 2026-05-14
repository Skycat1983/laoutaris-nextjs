# Rendering And Data Fetching

This document tracks the intended server-side rendering and data-fetching
strategy for the app. It is currently a planning target, not a verified
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
- What test strategy proves SSR behavior without brittle implementation checks?

## Reconciled Audit Findings

[A-015](../audits/results/A-015-ssr-data-fetching.md) confirmed that the app has
the desired high-level shape for several public routes: server pages and
loaders provide initial data, then client components handle interaction.

The production blockers are now tracked through the
[architecture refactor workstream](../workstreams/architecture-refactor-and-code-health.md),
[production risks](../risks/production-readiness.md), and
[ADR 0004](../decisions/0004-server-data-access-ownership.md):

- Server loaders and server API wrappers self-fetch the same app over absolute
  HTTP URLs.
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

# 0004 - Server Data Access Ownership

Status: Accepted

Date: 2026-05-14

## Context

[A-013](../audits/results/A-013-architecture-refactor-scope.md) and
[A-015](../audits/results/A-015-ssr-data-fetching.md) found that server loaders
and server API wrappers currently fetch the same Next.js app over absolute HTTP
URLs while API routes, loaders, actions, and the root layout also share MongoDB
connection responsibilities. This blocks reliable SSR tests, cache policy, and
route ownership decisions.

## Decision

Use direct server data-access services as the canonical server-side pattern.

Server loaders, API routes, and server actions that run inside the Next.js
runtime should call typed server-only data services instead of fetching this same
app over absolute HTTP URLs. API route handlers remain the public HTTP boundary:
they should parse requests, enforce request-level auth, call the same server data
services, and translate service results into `NextResponse` envelopes. Browser
client components should continue to use client API fetchers for interactive
reads and writes.

The ownership split is:

- Route boundaries own URL/search-param parsing, redirects, `notFound()` calls,
  and request/session context.
- Server data services own MongoDB connection setup, model queries, Shopify
  server calls when needed, transforms, and typed domain results.
- API routes are HTTP adapters over those services, not the only server-side way
  to reach app data.
- Server actions call services directly after validating action input and auth
  context.
- `serverApi`, `serverPublicApi`, `serverUserApi`, and `serverAdminApi` were
  deprecated for same-app SSR and server actions, then removed by T-087 after
  route-critical callers were migrated. New server-side code should continue to
  use server-only data services; browser client components should continue to
  use the client API wrappers and route-specific fetcher factories.

A deliberate internal HTTP layer is rejected for ordinary same-app server reads.
It would require header forwarding, absolute base URL ownership, deployment
domain handling, cache policy, and integration tests for a network hop that the
server runtime does not need. Internal HTTP is allowed only as a documented
exception when the call truly crosses a runtime or service boundary.

The first implementation proof should be narrow: migrate one route, preferably
`/artwork`, by extracting the artwork list read into a server data service,
calling it from both `ArtworkListLoader` and the existing public artwork API
route, and adding tests that prove the server loader no longer requires a live
`localhost:3000` app.

## Consequences

- Same-app HTTP self-fetching should be removed from server loaders and server
  actions over staged route migrations.
- API routes remain useful for browser clients and external callers, but should
  share service logic with server-rendered routes instead of duplicating query
  code.
- MongoDB connection ownership moves to the service or shared service wrapper
  for MongoDB-backed reads and writes, rather than relying on the root layout or
  incidental earlier route work.
- Route-specific cache and dynamic rendering policy can now be documented and
  applied at the page/loader/API adapter boundary.
- The refactor still needs a proof route and tests before broad migration across
  public, account, admin, and Shopify data flows.

# 0004 - Server Data Access Ownership

Status: Proposed

Date: 2026-05-14

## Context

[A-013](../audits/results/A-013-architecture-refactor-scope.md) and
[A-015](../audits/results/A-015-ssr-data-fetching.md) found that server loaders
and server API wrappers currently fetch the same Next.js app over absolute HTTP
URLs while API routes, loaders, actions, and the root layout also share MongoDB
connection responsibilities. This blocks reliable SSR tests, cache policy, and
route ownership decisions.

## Decision

Pending owner/orchestrator decision before broad implementation.

The decision should choose one canonical pattern:

- Direct server data-access services used by loaders, API routes, and server
  actions.
- A deliberate internal HTTP layer with one shared server fetcher, auth/header
  forwarding rules, base URL ownership, cache policy, and tests.

Until this ADR is accepted, broad rewrites of loaders, server fetchers, or API
route data flow should wait. Narrow proof-of-concept work may be used to inform
the decision if it is recorded in the
[architecture refactor workstream](../workstreams/architecture-refactor-and-code-health.md).

## Consequences

- The rendering and data-fetching refactor has a named decision gate.
- Work can still proceed on audits, tests, route inventories, and small proofs.
- Production SSR/cache work remains blocked until this ADR is accepted.

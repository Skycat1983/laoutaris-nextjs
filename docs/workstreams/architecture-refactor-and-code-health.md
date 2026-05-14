# Architecture Refactor And Code Health Workstream

Status: Active

Goal: identify and execute structural refactors that make the app easier to
scale, safer to test, and simpler for agents to modify without carrying unused
or inconsistent code forward.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-013 Architecture refactor scope](../audits/goals.md#a-013-architecture-refactor-scope)
- [A-014 Unused code and dependency pruning](../audits/goals.md#a-014-unused-code-and-dependency-pruning)
- [A-015 SSR and data-fetching strategy](../audits/goals.md#a-015-ssr-and-data-fetching-strategy)

## Blocks

- Safe large-scale refactors.
- Reliable server-side rendering strategy.
- Dead-code pruning without accidental behavior loss.
- Stable reusable patterns for future Shopify and admin work.

## Related Code Areas

- `src/app/`
- `src/components/`
- `src/lib/`
- `src/hooks/`
- `src/contexts/`
- `package.json`
- `__tests__/`

## Current Facts

- The app already uses Next.js App Router and server components in some routes.
- Loader, view, composition, module, and element patterns exist but need
  ownership boundaries and consistency checks.
- Historical shop notes show that client/server import boundaries have already
  caused runtime problems.
- Project owner reports that server-side rendering and testing have been
  attempted but are not yet successfully established as reliable patterns.
- Root and component-level code likely contains WIP, historical, or unused paths
  that should be audited before pruning.
- A-013, A-014, and A-015 are complete and reconciled.
- [ADR 0004](../decisions/0004-server-data-access-ownership.md) is accepted:
  server loaders, API routes, and server actions should share direct
  server-only data-access services instead of same-app HTTP fetches.
- A-002 found the admin API action-segment convention is not documented as
  canonical.
- A-007 found production URL construction is hard-coded and inconsistent across
  server fetchers, shop loaders, and redirects.

## Backlog

- Implement a narrow `/artwork` proof route for
  [ADR 0004](../decisions/0004-server-data-access-ownership.md): extract the
  artwork list read into a server-only data service, call it from both
  `ArtworkListLoader` and the existing public artwork API route, and add tests
  proving server rendering does not require a live `localhost:3000` app.
- After the proof route passes, migrate route-critical loaders off same-app HTTP
  in small slices and retire `serverApi` usage from server loaders/actions.
- Define client-safe and server-only import rules, including direct-import rules
  for barrels that can pull server-only dependencies into client components.
- Ensure every MongoDB-backed API route and server action reaches the database
  only through a service or shared wrapper that calls `dbConnect()`.
- Move route-neutral DB/session work out of the root layout so dynamic rendering
  and cache policy can be owned by the routes that need them.
- Document route-specific cache/revalidation policy for public archive,
  authenticated, admin, and Shopify data.
- Consolidate taxonomy/filter option sources across constants, schemas, public
  filters, admin forms, and shop filters.
- Centralize app route builders, API route builders, and auth path constants;
  remove hard-coded localhost/same-app absolute routes.
- Document whether admin action-segment API routes are canonical, or open an ADR
  for migration to resource-oriented routes before mixing conventions.
- Create a staged pruning task for A-014 high-confidence unused leaf files, WIP
  variants, unused barrels, starter assets, and import cleanup, with
  verification before deletion.
- Open a separate dependency cleanup task for A-014 package candidates so
  `package.json` and lockfile changes are reviewed together.

## Acceptance Criteria

- Architecture refactor scope is documented with priority and risk.
- Dead-code candidates are listed with evidence before removal.
- Rendering and data-fetching patterns are documented and linked from relevant
  workstreams.
- Refactors preserve public behavior and improve testability.
- Deleted code has verification evidence or a clear reason it is unreachable.

## Verification

```bash
npm test
npm run build
npm run lint
```

Use targeted import/reference searches for pruning tasks.

## Progress

- Workstream created to make architecture refactor, pruning, SSR, and scalable
  patterns first-class production-readiness scope.
- 2026-05-14: A-013, A-014, and A-015 findings reconciled into
  `docs/audits/findings-register.md`, production risks,
  [ADR 0004](../decisions/0004-server-data-access-ownership.md), and this
  backlog.
- 2026-05-14: [ADR 0004](../decisions/0004-server-data-access-ownership.md)
  accepted direct server data-access services as the canonical pattern for
  loaders, API routes, and server actions. No runtime code was changed in the
  decision task.
- 2026-05-14: Reconciled A-002/A-007 architecture-adjacent findings into F-030
  and F-050, production risks, and this backlog.

## Next Agent Action

Implement the `/artwork` server data-access proof route with tests before
applying the pattern across loaders, API routes, actions, and cache policy.

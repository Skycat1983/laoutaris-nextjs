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
- T-007 completed a small ADR 0004-aligned slice for the shop product detail
  page: linked artwork now uses a server-only artwork-by-ID data service shared
  by the public artwork detail API route and product detail page.
- T-014 created T-015 to audit the Next major migration surface before package
  edits, including App Router, middleware, image optimization, server-side
  rendering, Node runtime, and verification risks.
- T-015 inventoried the Next 14 -> 16 code risk: synchronous App Router
  `params`/`searchParams`, synchronous `cookies()`/`headers()` usage,
  `middleware.ts` -> `proxy.ts`, custom webpack config under Turbopack default,
  `next/image` default changes, and lint/tooling migration.
- T-018 completed the broader `/artwork` list proof route for ADR 0004:
  `ArtworkListLoader` and `GET /api/v2/public/artwork` now share the
  server-only `getArtworkList` data service instead of relying on same-app HTTP
  for the initial artwork list.
- T-021 applied the ADR 0004 service-adapter pattern to public search:
  `/search` and `GET /api/v2/public/search` now share the server-only
  `getPublicSearchResults` service instead of relying on same-app HTTP for the
  initial search render.
- T-022 completed the package-focused cleanup for confirmed-unused direct
  dependency candidates, keeping lockfile churn out of source-pruning tasks.
  A-014 source-file pruning remains a separate follow-up.
- The 2026-05-14 Vercel bcrypt incident showed another root-layout ownership
  problem: at incident time `src/app/layout.tsx` imported `authOptions`, which
  eagerly imported the credentials authorize path and native bcrypt for every
  public page render.
- T-023 completed the auth import-boundary slice: root-layout/session auth
  imports no longer load credentials password verification or native bcrypt
  unless a credentials authorize flow is running.

## Backlog

- Use the completed T-007, T-018, and T-021 proof routes as templates to migrate
  remaining route-critical loaders off same-app HTTP in small slices and retire
  `serverApi` usage from server loaders/actions.
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
- Use T-015's inventory before any future Next major package edit; especially
  convert async request APIs, middleware/proxy, and fetch/cache behavior in a
  package-owner implementation task after the owner accepts a stable target.

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
- 2026-05-14: Prepared T-007 to remove one same-app HTTP path from Shopify
  product detail without broadening into the full `/artwork` list migration.
- 2026-05-14: Completed T-007; added `getArtworkById` as a server-only
  MongoDB/transform helper, reused it from the public artwork detail API route,
  and removed `/shop/products/[productHandle]` linked artwork same-app HTTP.
- 2026-05-14: T-014 added T-015 as a Next major migration preflight audit so
  framework/runtime architecture risks are scoped before dependency edits.
- 2026-05-14: Completed T-015; it found no accepted stable Next target that
  clears both residual advisories yet, and documented the App Router,
  middleware/proxy, headers/cookies, image, webpack/Turbopack, lint, caching,
  and verification surfaces for the future migration.
- 2026-05-14: Prepared T-018 to extract the public artwork list query into a
  shared server-only data service used by both `ArtworkListLoader` and
  `GET /api/v2/public/artwork`.
- 2026-05-14: Completed T-018; added `getArtworkList`, refactored the public
  artwork list API route and `ArtworkListLoader` to share it, removed the
  loader's same-app HTTP dependency, and added focused service/API/loader tests.
- 2026-05-14: Prepared T-021 to migrate public search to a server-only service
  and T-022 to handle unused dependency cleanup separately from source
  refactors.
- 2026-05-14: Completed T-021; added `getPublicSearchResults`, refactored the
  public search API route and `/search` page to share it, removed the search
  page's same-app HTTP dependency, and added focused service/API/page tests.
- 2026-05-14: Completed T-022 by removing unused direct dependencies from the
  manifest and lockfile while leaving A-014 runtime/source pruning for a later
  staged task.
- 2026-05-14: Recorded the Vercel bcrypt native trace incident as new evidence
  for root-layout blast radius and prepared T-023 to lazy/decouple credentials
  bcrypt imports from public session reads.
- 2026-05-14: Completed T-023 by lazy-loading the credentials authorize
  implementation inside the NextAuth credentials provider, keeping bcrypt out of
  normal root-layout public imports, and adding focused auth/root-layout
  import-boundary tests.
- 2026-05-16: Prepared T-069 as a no-behavior-change cleanup for shared fetcher
  and server API URL-helper debug logs. It intentionally preserves same-app HTTP
  and base URL construction while leaving the next ADR 0004 migration separate.
- 2026-05-16: Completed T-069; shared fetcher and server API URL-helper direct
  `console.log` debug output and stale URL debug blocks are removed, with
  focused source hygiene and fetcher behavior coverage. Same-app HTTP and base
  URL construction remain intentionally unchanged for later ADR 0004 slices.
- 2026-05-16: Prepared T-070 as the next focused ADR 0004/F-021 migration. It
  moves `CollectionsSubnavLoader` off same-app HTTP by sharing collection
  navigation data access with the public collection navigation route.

## Next Agent Action

Assign T-070:
`/task effort: high details: docs/tasks/T-070-migrate-collections-subnav-loader-service.md`

Keep broader root-layout session/cache refactors separate from the completed
T-023 import-boundary mitigation. Prepare a later A-014 source pruning task for
unused leaf files, WIP variants, barrels, and starter assets. If Next dependency
work takes priority, wait for owner/orchestrator acceptance of a Next target,
then use
[T-015 Audit Next Major Migration Preflight](../tasks/T-015-next-major-migration-preflight.md)
as the migration inventory for the package implementation task.

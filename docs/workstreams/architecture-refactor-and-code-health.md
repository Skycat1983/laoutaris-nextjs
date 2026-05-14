# Architecture Refactor And Code Health Workstream

Status: Planned

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

## Backlog

- Audit current route, loader, server component, and client component patterns.
- Identify modules, components, hooks, dependencies, constants, and docs that are
  unused or superseded.
- Define a preferred server-side rendering and data-fetching pattern for public,
  admin, account, and shop routes.
- Define import and barrel-export rules for server-safe and client-safe modules.
- Identify duplicated patterns that should become shared utilities or be
  intentionally kept local.
- Create a staged pruning plan with verification commands before deleting code.
- Update architecture docs and ADRs before executing broad refactors.

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

## Next Agent Action

Start with [A-013 Architecture refactor scope](../audits/goals.md#a-013-architecture-refactor-scope),
then use A-014 and A-015 to split pruning and rendering strategy into separate
evidence-backed result files.

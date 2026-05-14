# Frontend Routes And Components Workstream

Status: Planned

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

## Backlog

- Map server and client component boundaries for public routes.
- Identify barrel exports used from client components.
- Audit loading, error, not found, and empty states on public pages.
- Stabilize responsive behavior for artwork, collections, shop, and search.
- Audit search, navigation, breadcrumbs, filters, and content discovery paths.
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

## Next Agent Action

Inspect public page and loader patterns, then document the preferred server page
plus loader plus client interaction pattern in an architecture note.

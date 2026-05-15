# T-035 Bound Public Artwork Browse Query

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Add route-bound validation and bounds for public artwork browse query
parameters before they reach MongoDB query construction.

## Why Now

T-021 hardened public search, but F-060 remains open for artwork browse and shop
browse. `/api/v2/public/artwork` still casts raw search params to filter and
sort types, parses `page`/`limit` with unbounded `parseInt`, and passes those
values into `getArtworkList`. This is a narrow public-route hardening slice
that preserves the ADR 0004 artwork-list service pattern from T-018.

This task addresses:

- [F-060](../audits/findings-register.md): artwork browse and shop browse query
  parsing and bounds remain incomplete.
- [R-006](../risks/production-readiness.md): API validation contracts remain
  inconsistent.
- [R-015](../risks/production-readiness.md): public input flows still have
  validation gaps.

## Read First

- [T-018 Create artwork list server data service proof](T-018-artwork-list-server-data-proof.md)
- [T-021 Harden public search query service](T-021-public-search-query-service.md)
- [A-016 Forms, validation, and input result](../audits/results/A-016-forms-validation-inputs.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- `src/app/api/v2/public/artwork/route.ts`
- `src/lib/data/services/getArtworkList.ts`
- `src/lib/constants/artworkConstants.ts`
- `src/lib/data/schemas/searchSchema.ts`
- `__tests__/unit/api/publicArtworkListRoute.test.ts`
- `__tests__/unit/data/getArtworkList.test.ts`

## Scope

In scope:

- Add a route-safe parser/schema for artwork list search params that:
  - defaults `filterMode` to `ALL`,
  - defaults `sortBy` to `mostRecent`,
  - validates `filterMode` and `sortBy` against existing artwork constants,
  - validates repeated filter values against existing decade, artstyle, medium,
    and surface options,
  - validates `sortColor` as a hex color when present,
  - bounds `page` to a positive integer,
  - bounds `limit` to a sane maximum.
- Return real JSON `400` validation errors before `getUserIdFromSession()` or
  `getArtworkList()` when query params are invalid.
- Preserve current defaults and successful result envelope.
- Keep `getArtworkList` as the shared server-only service; do not reintroduce
  route-local MongoDB query work.
- Add focused route tests for valid parsing, defaults, invalid enum/filter
  values, invalid color, invalid pagination, and bounded limits.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change shop browse query handling; create a separate task after this
  artwork slice lands.
- Do not change artwork filter UI behavior unless a broken submitted value is
  discovered.
- Do not change MongoDB query semantics for valid existing filters.
- Do not redesign color-proximity sorting beyond validating `sortColor`.

## Acceptance Criteria

- Invalid public artwork browse query params return real JSON `400` responses
  and do not call the session helper or artwork service.
- Valid query params are normalized before being passed to `getArtworkList`.
- Existing default artwork browse behavior is preserved.
- Focused artwork route/service tests, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicArtworkListRoute.test.ts __tests__/unit/data/getArtworkList.test.ts
npm run lint
npm run build
```

## Completion

Completed on 2026-05-15:

- Added `src/lib/data/schemas/artworkListQuerySchema.ts` for route-safe public
  artwork browse query parsing. It validates `filterMode`, `sortBy`, repeated
  `decade`/`artstyle`/`medium`/`surface` filters, optional hex `sortColor`, and
  bounded positive integer `page`/`limit` values before any session or artwork
  service work.
- Preserved current defaults: `filterMode` defaults to `ALL`, `sortBy` defaults
  to `mostRecent`, `page` defaults to `1`, `limit` defaults to `10`, and absent
  filter arrays normalize to `[]`. `limit` is capped at `50` and `page` at
  `1000`.
- Updated `GET /api/v2/public/artwork` to return structured JSON `400`
  validation responses with `fieldErrors`/`formErrors` and to call
  `getUserIdFromSession()` plus `getArtworkList()` only after query validation
  succeeds.
- Exported the existing artwork filter/sort option arrays from
  `artworkConstants` so the route parser uses the canonical constants.
- Expanded `__tests__/unit/api/publicArtworkListRoute.test.ts` for valid
  parsing, defaults, invalid enum values, invalid repeated filters, invalid hex
  color, invalid pagination, limit bounding, and invalid-query short-circuiting
  before session/service calls.
- Remaining F-060 follow-up: shop browse query parsing and bounds are still out
  of scope and should be handled in a separate task.

Verification completed:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicArtworkListRoute.test.ts __tests__/unit/data/getArtworkList.test.ts
npm run lint
npm run build
```

All commands passed. Build still emitted the existing MongoDB/fetcher/static
generation log noise documented by prior tasks.

## Escalate

Escalate to the orchestrator if:

- Current frontend filters send values outside the documented artwork constants.
- A bounded `limit` value breaks expected public browse behavior.
- Color-proximity sorting needs broader product or UX decisions.

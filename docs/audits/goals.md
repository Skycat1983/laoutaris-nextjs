# Audit Goals

This is the canonical list of audit goals. Link agents to a specific audit ID
when assigning discovery work.

## Audit Index

| ID | Goal | Workstream | Result |
| --- | --- | --- | --- |
| A-001 | [Shopify commerce readiness](#a-001-shopify-commerce-readiness) | [Shopify commerce](../workstreams/shopify-commerce.md) | [Result](results/A-001-shopify-commerce.md) |
| A-002 | [Public, user, and admin API contracts](#a-002-public-user-and-admin-api-contracts) | [Data models and API](../workstreams/data-models-and-api.md) | [Result](results/A-002-api-contracts.md) |
| A-003 | [Data models, schemas, and transforms](#a-003-data-models-schemas-and-transforms) | [Data models and API](../workstreams/data-models-and-api.md) | [Result](results/A-003-data-models-transforms.md) |
| A-004 | [Auth, admin, and permission boundaries](#a-004-auth-admin-and-permission-boundaries) | [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md) | [Result](results/A-004-auth-admin-permissions.md) |
| A-005 | [Frontend routes and component boundaries](#a-005-frontend-routes-and-component-boundaries) | [Frontend routes and components](../workstreams/frontend-routes-and-components.md) | [Result](results/A-005-frontend-routes-components.md) |
| A-006 | [Testing and quality baseline](#a-006-testing-and-quality-baseline) | [Testing and quality](../workstreams/testing-and-quality.md) | [Result](results/A-006-testing-quality-baseline.md) |
| A-007 | [Deployment and environment readiness](#a-007-deployment-and-environment-readiness) | [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md) | [Result](results/A-007-deployment-environment.md) |
| A-008 | [Security headers, CORS, and logging](#a-008-security-headers-cors-and-logging) | [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md) | [Result](results/A-008-security-headers-cors-logging.md) |
| A-009 | [Cloudinary and asset operations](#a-009-cloudinary-and-asset-operations) | [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md) | [Result](results/A-009-cloudinary-assets.md) |
| A-010 | [Performance, SEO, and accessibility](#a-010-performance-seo-and-accessibility) | [Frontend routes and components](../workstreams/frontend-routes-and-components.md) | [Result](results/A-010-performance-seo-accessibility.md) |
| A-011 | [Admin content operations](#a-011-admin-content-operations) | [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md) | [Result](results/A-011-admin-content-operations.md) |
| A-012 | [Documentation and handoff quality](#a-012-documentation-and-handoff-quality) | [All workstreams](../workstreams/README.md) | [Result](results/A-012-documentation-knowledge-base.md) |
| A-013 | [Architecture refactor scope](#a-013-architecture-refactor-scope) | [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md) | [Result](results/A-013-architecture-refactor-scope.md) |
| A-014 | [Unused code and dependency pruning](#a-014-unused-code-and-dependency-pruning) | [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md) | [Result](results/A-014-unused-code-dependency-pruning.md) |
| A-015 | [SSR and data-fetching strategy](#a-015-ssr-and-data-fetching-strategy) | [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md) | [Result](results/A-015-ssr-data-fetching.md) |
| A-016 | [Forms, validation, and user input](#a-016-forms-validation-and-user-input) | [Data models and API](../workstreams/data-models-and-api.md) | [Result](results/A-016-forms-validation-inputs.md) |
| A-017 | [Search, navigation, and content discovery](#a-017-search-navigation-and-content-discovery) | [Frontend routes and components](../workstreams/frontend-routes-and-components.md) | [Result](results/A-017-search-navigation-discovery.md) |
| A-018 | [Translations, copy, and content taxonomy](#a-018-translations-copy-and-content-taxonomy) | [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md) | [Result](results/A-018-translations-content-taxonomy.md) |
| A-019 | [Dependencies and supply chain](#a-019-dependencies-and-supply-chain) | [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md) | [Result](results/A-019-dependencies-supply-chain.md) |
| A-020 | [Privacy, consent, and commerce compliance](#a-020-privacy-consent-and-commerce-compliance) | [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md) | [Result](results/A-020-privacy-consent-commerce-compliance.md) |
| A-021 | [Observability and incident response](#a-021-observability-and-incident-response) | [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md) | [Result](results/A-021-observability-incident-response.md) |
| A-022 | [Next.js feature utilization](#a-022-nextjs-feature-utilization) | [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md) | [Result](results/A-022-nextjs-feature-utilization.md) |
| A-023 | [Playwright adoption priorities](#a-023-playwright-adoption-priorities) | [Testing and quality](../workstreams/testing-and-quality.md) | [Result](results/A-023-playwright-adoption-priorities.md) |
| A-024 | [Loading state UX coverage](#a-024-loading-state-ux-coverage) | [Frontend routes and components](../workstreams/frontend-routes-and-components.md) | [Result](results/A-024-loading-state-ux.md) |
| A-025 | [Codebase progress and trajectory recalibration](#a-025-codebase-progress-and-trajectory-recalibration) | [All workstreams](../workstreams/README.md) | [Result](results/A-025-codebase-trajectory-recalibration.md) |
| A-026 | [Tracker alignment snapshot](#a-026-tracker-alignment-snapshot) | [All workstreams](../workstreams/README.md) | [Result](results/A-026-tracker-alignment-snapshot.md) |
| A-027 | [Verification gate snapshot](#a-027-verification-gate-snapshot) | [Testing and quality](../workstreams/testing-and-quality.md) | [Result](results/A-027-verification-gate-snapshot.md) |
| A-028 | [Public archive and Shopify runtime hotspot scan](#a-028-public-archive-and-shopify-runtime-hotspot-scan) | [Frontend routes and components](../workstreams/frontend-routes-and-components.md), [Shopify commerce](../workstreams/shopify-commerce.md) | [Result](results/A-028-public-shopify-hotspots.md) |
| A-029 | [Admin, auth, and operations hotspot scan](#a-029-admin-auth-and-operations-hotspot-scan) | [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md), [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md), [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md) | [Result](results/A-029-admin-auth-ops-hotspots.md) |
| A-030 | [Admin delete integrity snapshot](#a-030-admin-delete-integrity-snapshot) | [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md), [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md) | [Result](results/A-030-admin-delete-integrity.md) |
| A-031 | [Admin content controls snapshot](#a-031-admin-content-controls-snapshot) | [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md), [Shopify commerce](../workstreams/shopify-commerce.md) | [Result](results/A-031-admin-content-controls.md) |
| A-032 | [Auth and protected boundary snapshot](#a-032-auth-and-protected-boundary-snapshot) | [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md), [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md) | [Result](results/A-032-auth-protected-boundaries.md) |
| A-033 | [Deployment, monitoring, and smoke snapshot](#a-033-deployment-monitoring-and-smoke-snapshot) | [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md), [Testing and quality](../workstreams/testing-and-quality.md) | [Result](results/A-033-deployment-monitoring-smoke.md) |
| A-034 | [Current Jest failure triage](#a-034-current-jest-failure-triage) | [Testing and quality](../workstreams/testing-and-quality.md) | [Result](results/A-034-current-jest-failure-triage.md) |
| A-035 | [Build-time external dependency map](#a-035-build-time-external-dependency-map) | [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md), [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md) | [Result](results/A-035-build-external-dependency-map.md) |

## A-001 Shopify Commerce Readiness

Status: Completed

Goal: audit whether Shopify listing, detail, artwork linking, product metadata,
filtering, sorting, and future checkout handoff are ready for production work.

Read first:

- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [Shopify commerce architecture](../architecture/shopify-commerce.md)
- [Shopify operations runbook](../runbooks/shopify-operations.md)

Expected output: [results/A-001-shopify-commerce.md](results/A-001-shopify-commerce.md)

## A-002 Public, User, And Admin API Contracts

Status: Completed

Goal: inventory API routes, response shapes, status codes, validation behavior,
and route-group conventions.

Read first:

- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Routes and API architecture](../architecture/routes-and-api.md)

Expected output: [results/A-002-api-contracts.md](results/A-002-api-contracts.md)

## A-003 Data Models, Schemas, And Transforms

Status: Completed

Goal: confirm schemas, Mongoose models, TypeScript types, and transform functions
agree on required fields, optional fields, and frontend data contracts.

Read first:

- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Database runbook](../runbooks/database.md)

Expected output: [results/A-003-data-models-transforms.md](results/A-003-data-models-transforms.md)

## A-004 Auth, Admin, And Permission Boundaries

Status: Completed

Goal: audit protected routes, admin APIs, user ownership checks, session helpers,
NextAuth configuration, and middleware behavior.

Read first:

- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Auth runbook](../runbooks/auth.md)

Expected output: [results/A-004-auth-admin-permissions.md](results/A-004-auth-admin-permissions.md)

## A-005 Frontend Routes And Component Boundaries

Status: Completed

Goal: audit page/loader/client component patterns, shared component boundaries,
barrel import risks, loading states, empty states, error states, and responsive
route behavior.

Read first:

- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- [System overview](../architecture/system-overview.md)

Expected output: [results/A-005-frontend-routes-components.md](results/A-005-frontend-routes-components.md)

## A-006 Testing And Quality Baseline

Status: Completed

Goal: establish the current test, build, and lint baseline and identify missing
coverage needed before production refactoring, including the gap between prior
testing attempts and a reliable verification baseline.

Read first:

- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Testing runbook](../runbooks/testing.md)

Expected output: [results/A-006-testing-quality-baseline.md](results/A-006-testing-quality-baseline.md)

## A-007 Deployment And Environment Readiness

Status: Completed

Goal: audit deployment assumptions, environment variables, build behavior,
production configuration, and smoke-check requirements.

Read first:

- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Deployment runbook](../runbooks/deployment.md)
- [Environment variables runbook](../runbooks/environment.md)

Expected output: [results/A-007-deployment-environment.md](results/A-007-deployment-environment.md)

## A-008 Security Headers, CORS, And Logging

Status: Completed

Goal: audit CSP, CORS headers, middleware logging, API logging, exposed secrets,
and production-safe error behavior.

Read first:

- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Production-readiness risks](../risks/production-readiness.md)

Expected output: [results/A-008-security-headers-cors-logging.md](results/A-008-security-headers-cors-logging.md)

## A-009 Cloudinary And Asset Operations

Status: Completed

Goal: audit Cloudinary upload signing, image metadata, delivery configuration,
asset deletion behavior, and backup expectations.

Read first:

- [Content, assets, and admin operations workstream](../workstreams/content-assets-and-admin-ops.md)
- [Cloudinary runbook](../runbooks/cloudinary.md)

Expected output: [results/A-009-cloudinary-assets.md](results/A-009-cloudinary-assets.md)

## A-010 Performance, SEO, And Accessibility

Status: Completed

Goal: audit public route performance risks, image behavior, metadata, semantic
HTML, keyboard accessibility, and shop/artwork discovery signals.

Read first:

- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- [Deployment runbook](../runbooks/deployment.md)

Expected output: [results/A-010-performance-seo-accessibility.md](results/A-010-performance-seo-accessibility.md)

## A-011 Admin Content Operations

Status: Completed

Goal: audit admin CRUD workflows, destructive actions, content dependencies,
operator steps, and archive maintenance needs.

Read first:

- [Content, assets, and admin operations workstream](../workstreams/content-assets-and-admin-ops.md)
- [Auth runbook](../runbooks/auth.md)
- [Database runbook](../runbooks/database.md)

Expected output: [results/A-011-admin-content-operations.md](results/A-011-admin-content-operations.md)

## A-012 Documentation And Handoff Quality

Status: Completed

Goal: audit whether the documentation system lets a new agent identify context,
goals, dependencies, results, risks, and next actions without chat history.

Read first:

- [Docs entry point](../README.md)
- [Workstreams](../workstreams/README.md)
- [Audit results](results/README.md)

Expected output: [results/A-012-documentation-knowledge-base.md](results/A-012-documentation-knowledge-base.md)

## A-013 Architecture Refactor Scope

Status: Completed

Goal: audit current architecture boundaries and identify refactor scope for
scalable patterns, module ownership, import safety, data flow, and future
feature work.

Read first:

- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [System overview](../architecture/system-overview.md)
- [Routes and API architecture](../architecture/routes-and-api.md)

Expected output: [results/A-013-architecture-refactor-scope.md](results/A-013-architecture-refactor-scope.md)

## A-014 Unused Code And Dependency Pruning

Status: Completed

Goal: audit unused components, hooks, utilities, constants, dependencies, WIP
modules, historical files, and superseded patterns before any pruning occurs.

Read first:

- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Testing runbook](../runbooks/testing.md)

Expected output: [results/A-014-unused-code-dependency-pruning.md](results/A-014-unused-code-dependency-pruning.md)

## A-015 SSR And Data-Fetching Strategy

Status: Completed

Goal: audit server-side rendering, loader components, route data fetching,
client-side fetches, cache behavior, and prior unsuccessful SSR attempts so the
project can adopt a reliable rendering pattern.

Read first:

- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)
- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)

Expected output: [results/A-015-ssr-data-fetching.md](results/A-015-ssr-data-fetching.md)

## A-016 Forms, Validation, And User Input

Status: Completed

Goal: audit all public, user, and admin input flows for validation consistency,
error handling, sanitization, accessibility, and API persistence behavior.

Read first:

- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Routes and API architecture](../architecture/routes-and-api.md)

Expected output: [results/A-016-forms-validation-inputs.md](results/A-016-forms-validation-inputs.md)

## A-017 Search, Navigation, And Content Discovery

Status: Completed

Goal: audit whether users can reliably find artworks, collections, blog content,
biography pages, and shop products through search, navigation, breadcrumbs,
filters, and related-content paths.

Read first:

- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- [Routes and API architecture](../architecture/routes-and-api.md)

Expected output: [results/A-017-search-navigation-discovery.md](results/A-017-search-navigation-discovery.md)

## A-018 Translations, Copy, And Content Taxonomy

Status: Completed

Goal: audit translation sources, copy constants, content labels, category fields,
taxonomy consistency, and public/admin text conventions.

Read first:

- [Content, assets, and admin operations workstream](../workstreams/content-assets-and-admin-ops.md)
- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)

Expected output: [results/A-018-translations-content-taxonomy.md](results/A-018-translations-content-taxonomy.md)

## A-019 Dependencies And Supply Chain

Status: Completed

Goal: audit dependencies, lockfile health, unused packages, package purpose,
known vulnerability exposure, and supply-chain risk before production launch.

Read first:

- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)

Expected output: [results/A-019-dependencies-supply-chain.md](results/A-019-dependencies-supply-chain.md)

## A-020 Privacy, Consent, And Commerce Compliance

Status: Completed

Goal: audit personal-data collection points, account data, contact/subscription
flows, comments, cookies/session behavior, policy-page gaps, and Shopify commerce
handoff assumptions. This audit should identify issues for legal or owner review
instead of making legal conclusions.

Read first:

- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Shopify commerce workstream](../workstreams/shopify-commerce.md)

Expected output: [results/A-020-privacy-consent-commerce-compliance.md](results/A-020-privacy-consent-commerce-compliance.md)

## A-021 Observability And Incident Response

Status: Completed

Goal: audit logging, error reporting, monitoring, alert ownership, incident
triage, rollback readiness, and what information operators need when production
failures occur.

Read first:

- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Deployment runbook](../runbooks/deployment.md)

Expected output: [results/A-021-observability-incident-response.md](results/A-021-observability-incident-response.md)

## A-022 Next.js Feature Utilization

Status: Completed

Goal: audit how well the app is using Next.js App Router features, rendering
and cache controls, middleware/proxy behavior, image/font optimization,
metadata/discovery conventions, instrumentation hooks, and client/server
component efficiency.

Read first:

- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)
- [Production-readiness risks](../risks/production-readiness.md)

Expected output: [results/A-022-nextjs-feature-utilization.md](results/A-022-nextjs-feature-utilization.md)

## A-023 Playwright Adoption Priorities

Status: Completed

Goal: identify where this project would most benefit from Playwright and
prioritize candidate browser checks without adding the dependency.

Read first:

- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)

Expected output: [results/A-023-playwright-adoption-priorities.md](results/A-023-playwright-adoption-priorities.md)

## A-024 Loading State UX Coverage

Status: Completed

Goal: audit initial load, route traversal, Suspense fallback, skeleton, spinner,
and user-action loading states to identify UX gaps where navigation or async
work appears frozen.

Read first:

- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)

Expected output: [results/A-024-loading-state-ux.md](results/A-024-loading-state-ux.md)

## A-025 Codebase Progress And Trajectory Recalibration

Status: Superseded

Goal: superseded umbrella audit for recalibrating codebase progress and
trajectory. Do not assign this goal directly.

Why superseded: the original cross-workstream scope was too large for a single
agent context. Use the smaller follow-up audits instead:

- [A-026 Tracker alignment snapshot](#a-026-tracker-alignment-snapshot)
- [A-027 Verification gate snapshot](#a-027-verification-gate-snapshot)
- [A-028 Public archive and Shopify runtime hotspot scan](#a-028-public-archive-and-shopify-runtime-hotspot-scan)
- [A-030 Admin delete integrity snapshot](#a-030-admin-delete-integrity-snapshot)
- [A-031 Admin content controls snapshot](#a-031-admin-content-controls-snapshot)
- [A-032 Auth and protected boundary snapshot](#a-032-auth-and-protected-boundary-snapshot)
- [A-033 Deployment, monitoring, and smoke snapshot](#a-033-deployment-monitoring-and-smoke-snapshot)

Expected output: [results/A-025-codebase-trajectory-recalibration.md](results/A-025-codebase-trajectory-recalibration.md)

## A-026 Tracker Alignment Snapshot

Status: Completed

Goal: create a compact docs-only snapshot of whether orchestration state,
audit indexes, result statuses, findings, risks, workstreams, and task pointers
agree on what is active, complete, blocked, and next.

Read first:

- [Current orchestration state](../orchestration/state.md)
- [Orchestrator guide](../orchestration/orchestrator-guide.md)
- [Audit results index](results/README.md)
- [Findings register](findings-register.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [Workstreams index](../workstreams/README.md)
- [Tasks index](../tasks/README.md)

Scope:

- Audit documentation consistency only. Do not deep-read runtime source unless a
  tracker claim cannot be interpreted without one targeted file read.
- Identify stale next-action pointers, missing result/index entries, completed
  tasks still listed as active, active risks without an owner/blocker note, and
  findings that appear unreconciled or duplicated.
- Produce candidate tracker edits for the orchestrator rather than editing
  shared trackers.

Concurrency expectations:

- This audit can run concurrently with A-027, A-028, and A-030 through A-033.
- The assigned agent owns only
  [results/A-026-tracker-alignment-snapshot.md](results/A-026-tracker-alignment-snapshot.md).
- Do not edit `findings-register.md`, risk docs, workstream briefs, task briefs,
  or orchestration state unless the orchestrator explicitly assigns a follow-up
  reconciliation task.

Verification:

- Use `git status --short`, `rg`, `find`, and targeted doc reads.
- Do not run full test/build commands; that belongs to A-027.

Expected output: [results/A-026-tracker-alignment-snapshot.md](results/A-026-tracker-alignment-snapshot.md)

Completion expectations:

- Set the result status to `Completed`.
- List the top tracker mismatches and candidate edits needed.
- Recommend the single next orchestration cleanup action, if any.

## A-027 Verification Gate Snapshot

Status: Completed

Goal: determine the current reliability of project verification commands and
release gates without changing code, dependencies, or CI.

Read first:

- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Testing runbook](../runbooks/testing.md)
- [Deployment runbook](../runbooks/deployment.md)
- [Environment variables runbook](../runbooks/environment.md)
- [Production-readiness risks](../risks/production-readiness.md)
- `package.json`
- `.github/workflows/`

Scope:

- Inspect package scripts, CI workflows, smoke scripts, TypeScript gate status,
  lint/build/test expectations, and release-verification docs.
- Run only the commands needed to establish a current baseline, summarizing
  failures by class instead of pasting long logs.
- Identify missing gates, flaky or environment-coupled gates, and places where a
  passing local command is not yet part of CI or release discipline.
- Do not fix tests, add CI jobs, change dependencies, or update package scripts.

Concurrency expectations:

- This audit can run concurrently with A-026, A-028, and A-030 through A-033.
- The assigned agent owns only
  [results/A-027-verification-gate-snapshot.md](results/A-027-verification-gate-snapshot.md).
- Candidate findings and workstream updates stay in the result file.

Verification:

- Suggested commands: `git status --short`, `npm test`, `npm run lint`,
  `npm run build`, `npx tsc --noEmit --pretty false --skipLibCheck`, and any
  existing env/smoke command that is clearly local and non-destructive.
- If a command is skipped or fails for environment reasons, record the reason
  and impact on confidence.
- Do not use browser automation, traces, screenshots, or full log dumps.

Expected output: [results/A-027-verification-gate-snapshot.md](results/A-027-verification-gate-snapshot.md)

Completion expectations:

- Set the result status to `Completed`.
- Provide a concise pass/fail/blocked table for verification commands.
- Recommend the next one or two quality-gate tasks only if evidence supports
  them.

## A-028 Public Archive And Shopify Runtime Hotspot Scan

Status: Completed

Goal: inspect the current public archive, search/browse, shop listing, Shopify
product detail, product enquiry, and product-detail mockup trajectory to identify
the most important owner-facing runtime gaps.

Read first:

- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [Shopify commerce architecture](../architecture/shopify-commerce.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [T-261 Build shop product sale gallery mockup](../tasks/T-261-build-shop-product-sale-gallery-mockup.md)

Scope:

- Inspect representative source and tests for public artwork browsing/detail,
  search, blog or collection discovery only where it affects archive browsing,
  shop products, Shopify hosted purchase handoff, product enquiry context, and
  the current product-detail mockup path.
- Identify owner-facing defects, stale task assumptions, missing tests, commerce
  boundary risks, and unclear next implementation choices.
- Do not inspect admin/auth/ops broadly; those belong to A-030 through A-033.
- Do not implement UI changes, add tests, run checkout, or use browser
  automation unless a single targeted source claim cannot be resolved otherwise.

Concurrency expectations:

- This audit can run concurrently with A-026, A-027, and A-030 through A-033.
- The assigned agent owns only
  [results/A-028-public-shopify-hotspots.md](results/A-028-public-shopify-hotspots.md).
- Candidate findings and workstream updates stay in the result file.

Verification:

- Use `git status --short`, `rg`, targeted file reads, and narrow tests only if
  a specific hotspot needs confirmation.
- Prefer source/test evidence over broad runtime exploration.
- Do not collect screenshots, traces, full DOM dumps, or large browser logs.

Expected output: [results/A-028-public-shopify-hotspots.md](results/A-028-public-shopify-hotspots.md)

Completion expectations:

- Set the result status to `Completed`.
- Identify the top public/shop runtime gaps and the smallest coherent follow-up
  tasks.
- State whether T-261 still appears to be the right next implementation target,
  should be narrowed, or should wait behind a prerequisite.

## A-029 Admin, Auth, And Operations Hotspot Scan

Status: Superseded

Goal: superseded hotspot scan for admin, auth, and operations. Do not assign
this goal directly.

Why superseded: an attempted A-029 run exceeded available context before
writing the result file. The final output suggests the scan expanded across
delete integrity, admin dashboard operations, auth boundaries, Cloudinary
controls, and deployment/monitoring. Use smaller follow-up audits instead:

- [A-030 Admin delete integrity snapshot](#a-030-admin-delete-integrity-snapshot)
- [A-031 Admin content controls snapshot](#a-031-admin-content-controls-snapshot)
- [A-032 Auth and protected boundary snapshot](#a-032-auth-and-protected-boundary-snapshot)
- [A-033 Deployment, monitoring, and smoke snapshot](#a-033-deployment-monitoring-and-smoke-snapshot)

Recovered context from the aborted run: the agent reported a possible delete
path hotspot where artwork deletion previews explicitly preserve affected user
favourite/watchlist records, while the destructive route removes artwork from
collections but not from users. A-030 should verify whether this is harmless
preserved history or an operator-facing data integrity gap.

Expected output: [results/A-029-admin-auth-ops-hotspots.md](results/A-029-admin-auth-ops-hotspots.md)

## A-030 Admin Delete Integrity Snapshot

Status: Completed

Goal: verify the admin destructive delete path for articles, artwork, blogs,
collections, comments, and users, with special focus on whether artwork delete
correctly handles affected user favourite/watchlist references.

Read first:

- [Content, assets, and admin operations workstream](../workstreams/content-assets-and-admin-ops.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Admin content operations runbook](../runbooks/admin-content-operations.md)
- [Database runbook](../runbooks/database.md)
- [Production-readiness risks](../risks/production-readiness.md)

Scope:

- Inspect admin delete preview routes, destructive delete routes, cascade/audit
  helpers, delete confirmation UI only where it affects route contract, user
  saved-artwork loaders/actions, and focused tests for delete behavior.
- Confirm whether preserved user favourites/watchlist references after artwork
  deletion are intentional, harmless, surfaced to users safely, or a data
  integrity gap requiring cleanup or UI handling.
- Do not inspect general admin form controls, auth boundaries, Cloudinary
  upload, deployment, or monitoring; those belong to A-031 through A-033.
- Do not run destructive operations or modify runtime code.

Concurrency expectations:

- This audit can run concurrently with A-031, A-032, and A-033.
- The assigned agent owns only
  [results/A-030-admin-delete-integrity.md](results/A-030-admin-delete-integrity.md).
- Candidate findings and workstream updates stay in the result file.

Verification:

- Use `git status --short`, `rg`, targeted source/test/doc reads, and narrow
  non-destructive tests only if needed to confirm route/loader behavior.
- Do not use browser automation, screenshots, traces, broad logs, or production
  data mutation.

Expected output: [results/A-030-admin-delete-integrity.md](results/A-030-admin-delete-integrity.md)

Completion expectations:

- Set the result status to `Completed`.
- State whether the saved-artwork preservation behavior is accepted, unclear, or
  a concrete data integrity issue.
- Recommend one coherent follow-up task if a fix or documented decision is
  needed.

## A-031 Admin Content Controls Snapshot

Status: Completed

Goal: inspect admin dashboard content-operation controls for articles, artwork,
blogs, collections, users, comments, Shopify product links, and Cloudinary
uploads to identify focused operator-facing gaps.

Read first:

- [Content, assets, and admin operations workstream](../workstreams/content-assets-and-admin-ops.md)
- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [Admin content operations runbook](../runbooks/admin-content-operations.md)
- [Cloudinary runbook](../runbooks/cloudinary.md)
- [Shopify commerce architecture](../architecture/shopify-commerce.md)
- [Production-readiness risks](../risks/production-readiness.md)

Scope:

- Inspect admin dashboard segment config, CRUD tabs, document reader/read-list
  handoff, create/update/delete form controls, Shopify product-link controls,
  Cloudinary upload/signing controls, and focused tests.
- Identify operator-facing UI/control gaps, stale assumptions, missing
  validation/error-surface coverage, and unclear next implementation choices.
- Do not inspect destructive delete cascade integrity beyond UI control
  handoff; that belongs to A-030.
- Do not inspect auth/session boundaries or deployment/monitoring; those belong
  to A-032 and A-033.
- Do not implement UI changes or upload/delete assets.

Concurrency expectations:

- This audit can run concurrently with A-030, A-032, and A-033.
- The assigned agent owns only
  [results/A-031-admin-content-controls.md](results/A-031-admin-content-controls.md).
- Candidate findings and workstream updates stay in the result file.

Verification:

- Use `git status --short`, `rg`, targeted source/test/doc reads, and narrow
  component/source tests only if needed.
- Do not use browser automation, screenshots, full DOM dumps, uploads, or
  destructive operations.

Expected output: [results/A-031-admin-content-controls.md](results/A-031-admin-content-controls.md)

Completion expectations:

- Set the result status to `Completed`.
- Identify the top admin control gaps and the smallest coherent follow-up task,
  if any.

## A-032 Auth And Protected Boundary Snapshot

Status: Completed

Goal: inspect auth/session, middleware, protected API/admin route guards, role
boundaries, and client/server import-boundary checks to identify focused
security or architecture gaps.

Read first:

- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Auth runbook](../runbooks/auth.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Production-readiness risks](../risks/production-readiness.md)

Scope:

- Inspect NextAuth configuration/import boundaries, middleware matcher behavior,
  protected API guard inventory, admin/user route guard patterns, role/session
  tests, and client/server import-boundary tests.
- Identify guard drift, uncovered role behavior, import-boundary regressions, or
  unclear auth runbook gaps.
- Do not inspect admin UI controls, delete cascade behavior, Cloudinary uploads,
  or deployment monitoring unless directly necessary to understand an auth
  boundary.
- Do not change auth code, rotate credentials, or collect secrets/tokens.

Concurrency expectations:

- This audit can run concurrently with A-030, A-031, and A-033.
- The assigned agent owns only
  [results/A-032-auth-protected-boundaries.md](results/A-032-auth-protected-boundaries.md).
- Candidate findings and workstream updates stay in the result file.

Verification:

- Use `git status --short`, `rg`, targeted source/test/doc reads, and narrow
  non-secret tests only if needed.
- Do not use browser automation, cookies, tokens, screenshots, or broad logs.

Expected output: [results/A-032-auth-protected-boundaries.md](results/A-032-auth-protected-boundaries.md)

Completion expectations:

- Set the result status to `Completed`.
- Identify the top auth/protected-boundary gaps and whether each is
  agent-actionable or owner/platform-blocked.

## A-033 Deployment, Monitoring, And Smoke Snapshot

Status: Completed

Goal: inspect deployment, monitoring/error-reporting, logging posture, public
smoke automation, credentialed smoke requirements, and incident ownership gaps
without changing runtime code or CI.

Read first:

- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Deployment runbook](../runbooks/deployment.md)
- [Environment variables runbook](../runbooks/environment.md)
- [Incident response runbook](../runbooks/incident-response.md)
- [Monitoring and error reporting architecture](../architecture/monitoring-and-error-reporting.md)
- [ADR 0005 monitoring decision](../decisions/0005-monitoring-provider-decision.md)
- [Production-readiness risks](../risks/production-readiness.md)
- `package.json`
- `.github/workflows/`

Scope:

- Inspect monitoring/instrumentation status, logging/source-map posture,
  smoke scripts/workflows, deployment runbook requirements, environment variable
  ownership, incident role blockers, and related tests.
- Identify which gaps are agent-actionable and which are blocked on owner,
  platform, provider, credential, or policy decisions.
- Do not inspect admin UI, delete integrity, or auth guard internals except for
  smoke/deployment requirements.
- Do not add monitoring providers, edit workflows, collect logs, expose secrets,
  or run credentialed smoke.

Concurrency expectations:

- This audit can run concurrently with A-030, A-031, and A-032.
- The assigned agent owns only
  [results/A-033-deployment-monitoring-smoke.md](results/A-033-deployment-monitoring-smoke.md).
- Candidate findings and workstream updates stay in the result file.

Verification:

- Use `git status --short`, `rg`, targeted source/test/doc reads, package script
  inspection, and non-secret local commands only if needed.
- Do not use browser automation, screenshots, traces, full logs, cookies,
  tokens, or secret values.

Expected output: [results/A-033-deployment-monitoring-smoke.md](results/A-033-deployment-monitoring-smoke.md)

Completion expectations:

- Set the result status to `Completed`.
- Identify the top deployment/monitoring/smoke gaps and mark each as
  agent-actionable, owner-blocked, platform-blocked, or policy-blocked.

## A-034 Current Jest Failure Triage

Status: Planned

Goal: classify the current full `npm test` failures under the pinned repo
runtime into small fixable slices without changing runtime or test source.

Read first:

- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Testing runbook](../runbooks/testing.md)
- [A-027 Verification gate snapshot](results/A-027-verification-gate-snapshot.md)
- `package.json`

Scope:

- Run the minimum commands needed to identify the current failing Jest suites
  and failure classes under Node `22.14.0` / npm `10.9.2`.
- Separate assertion drift, timeout/performance failures, sandbox/socket
  artifacts, and genuinely unclear failures.
- Do not fix test code, implementation code, package scripts, or CI.
- Do not paste full Jest logs; summarize failing suites, representative error
  lines, and likely owners.

Concurrency expectations:

- This audit can run concurrently with implementation tasks that do not edit
  broad test configuration. If another task is actively editing a failing test
  file, record that possible race in the result.
- The assigned agent owns only
  [results/A-034-current-jest-failure-triage.md](results/A-034-current-jest-failure-triage.md).

Verification:

- Use pinned runtime via `source ~/.nvm/nvm.sh && nvm use 22.14.0`.
- Suggested command: `npm test`, followed by targeted reruns only for failure
  classes that need confirmation.
- If sandbox socket restrictions affect a suite, record that class separately.

Expected output: [results/A-034-current-jest-failure-triage.md](results/A-034-current-jest-failure-triage.md)

Completion expectations:

- Set the result status to `Completed`.
- Produce a table of failing suites, failure class, likely owner/workstream, and
  smallest recommended follow-up task.

## A-035 Build-Time External Dependency Map

Status: Planned

Goal: map why `npm run build` needs external MongoDB/network access during
static generation and identify the smallest safe mitigation or release-evidence
policy.

Read first:

- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)
- [Deployment runbook](../runbooks/deployment.md)
- [Environment variables runbook](../runbooks/environment.md)
- [A-027 Verification gate snapshot](results/A-027-verification-gate-snapshot.md)

Scope:

- Identify the routes and data paths that perform live MongoDB/network reads
  during `next build` static generation.
- Distinguish intentional static/ISR generation from accidental build-time live
  data coupling.
- Recommend either a concrete code mitigation, a route-rendering/cache decision,
  or a documented release-evidence policy.
- Do not change route rendering, cache policy, data services, or deployment
  docs in this audit.

Concurrency expectations:

- This audit can run concurrently with most implementation tasks, but record any
  active edits to route rendering/data fetching files that could affect build
  evidence.
- The assigned agent owns only
  [results/A-035-build-external-dependency-map.md](results/A-035-build-external-dependency-map.md).

Verification:

- Prefer source and build-output evidence. Do not use broad browser automation.
- If running `npm run build`, record whether it ran with or without external
  network access and summarize only the relevant route/error lines.

Expected output: [results/A-035-build-external-dependency-map.md](results/A-035-build-external-dependency-map.md)

Completion expectations:

- Set the result status to `Completed`.
- List the build-time external dependency paths and the recommended next task or
  release policy update.

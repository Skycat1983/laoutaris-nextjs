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
| A-024 | [Loading state UX coverage](#a-024-loading-state-ux-coverage) | [Frontend routes and components](../workstreams/frontend-routes-and-components.md) | [Result](results/A-024-loading-state-ux.md) |

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

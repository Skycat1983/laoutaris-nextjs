# Production-Readiness Risks

This is the canonical tracker for known production risks. Add risks when a gap is
found and remove them only when the mitigation is complete and verified.

| ID | Severity | Area | Risk | Mitigation Status | Owner |
| --- | --- | --- | --- | --- | --- |
| R-001 | High | Shopify | Checkout handoff and first-release purchase scope are not documented while product detail shows purchase UI. | Open: decide checkout scope through F-009 and the Shopify commerce workstream. | Unassigned |
| R-002 | High | Auth/Admin | Stale `/protected`, legacy auth/session cleanup, broader admin guard migration, and bootstrap/recovery remain open. | Partially mitigated: T-002 resolved F-042 credentials role persistence, T-003 resolved F-043 stable ownership helpers, and T-005 added a route-local guard to the Cloudinary signing endpoint; resolve remaining F-044, F-045, and F-032 work through the auth workstream. | Unassigned |
| R-003 | High | Deployment | Production environment variable inventory, ownership, rotation guidance, and legacy/platform variable decisions are incomplete. | Open: A-007 complete; resolve F-047 and F-046 through the deployment workstream and environment runbook. | Unassigned |
| R-004 | Medium | Security | CSP and API CORS policy appear broad and need production review. | Open: review in deployment workstream. | Unassigned |
| R-005 | Medium | Quality | Test coverage is narrow for APIs, auth, Shopify, SSR/data-fetching, deployment smoke checks, transforms, and admin flows. | Open: A-002, A-003, A-004, A-006, A-007, and A-015 confirm the gap; expand testing through F-016 and related workstream tasks. | Unassigned |
| R-006 | High | Data/API | API response envelopes, HTTP statuses, route/fetcher parity, validation, field contracts, and transform outputs are inconsistent across route groups. | Partially mitigated: T-004 standardized the public single Shopify product route; resolve F-015, F-036, F-037, F-038, F-039, F-040, F-041, F-049, and F-050 through the data/API workstream. | Unassigned |
| R-007 | Medium | Operations | MongoDB backup, migration, and rollback procedures are not fully documented. | Open: database runbook. | Unassigned |
| R-008 | High | Assets/Security | Cloudinary upload signing lacks production-ready upload policy, environment documentation, and asset lifecycle policy. | Partially mitigated: T-005 added admin/API guard, request validation, missing-secret handling, and tests for the signing route; resolve remaining F-044 and F-041 policy/documentation work through auth, content/assets, deployment, and A-009. | Unassigned |
| R-009 | Low | Docs | Historical root shop notes are useful but not canonical. | Open: F-035 keeps consolidation pending before deletion. | Unassigned |
| R-010 | High | Architecture | Architecture refactor scope, ownership boundaries, and scalable patterns are now audited but not implemented. | Open: A-013 complete; follow F-021, F-022, F-023, F-030, and the architecture workstream. | Unassigned |
| R-011 | Medium | Code health | Unused code, dependencies, WIP modules, and superseded patterns may obscure production risks. | Open: A-014 complete; execute staged pruning through F-031 and F-034. | Unassigned |
| R-012 | High | Rendering | Server-side rendering and data-fetching patterns rely on self-HTTP, unclear cache policy, and global root layout DB/session work. | Open: ADR 0004 accepted direct server data-access services; implement the proof route and resolve F-021, F-025, F-026 before broad refactors. | Unassigned |
| R-013 | High | Quality | Testing has been attempted but is not yet proven as a reliable safety net for production refactors. | Open: A-006 complete; F-003, F-016, F-018, and F-019 routed to the testing workstream. | Unassigned |
| R-014 | Medium | Process | Future audit findings can duplicate or conflict without reconciliation before implementation. | Updated: A-001, A-002, A-003, A-004, A-006, A-007, A-012, A-013, A-014, and A-015 reconciled on 2026-05-14; keep process for future audits. | Unassigned |
| R-015 | Medium | Forms/Data | User-input flows and validation are not yet audited end to end. | Open: A-016. | Unassigned |
| R-016 | Medium | Discovery | Search, navigation, taxonomy, and content discovery are not yet audited as a full user journey. | Open: A-017 and A-018. | Unassigned |
| R-017 | Medium | Dependencies | Dependency health and supply-chain risk are not yet fully audited, and A-014 found unused direct dependency candidates. | Open: A-019 remains pending; F-034 requires a package-focused cleanup. | Unassigned |
| R-018 | High | Compliance | Privacy, consent, and commerce compliance gaps are not yet inventoried for owner/legal review. | Open: A-020. | Unassigned |
| R-019 | Medium | Observability/Ops | Monitoring, alerting, incident response, rollback ownership, smoke evidence, and production logging policy are not yet defined. | Open: A-007 added smoke/rollback/logging evidence; A-021 remains pending; resolve F-020 and F-048 through deployment and testing. | Unassigned |
| R-020 | High | Shopify | Product detail pages fetch linked artwork from a non-existent artwork API path. | Open: fix F-008 in the Shopify and architecture workstreams. | Unassigned |
| R-021 | High | Admin/Shopify | Admin Shopify product-linking workflow and validation are missing. | Open: resolve F-010 through Shopify and content/admin workstreams. | Unassigned |
| R-022 | High | Security | A Shopify credential-like value remains in source comments and may require verification or rotation. | Open: A-007 confirmed the value is still present; resolve F-011 through deployment/security and Shopify workstreams. | Unassigned |
| R-023 | Medium | Data/Shopify | Shopify product IDs are documented as numeric but not validated, normalized, or migrated. | Partially mitigated: T-004 validates numeric IDs for the public single-product route; admin writes, existing data, and migration/normalization remain open under F-012. | Unassigned |
| R-024 | High | Deployment/Quality | Build verification is coupled to external Google Fonts and live MongoDB/environment access. | Open: A-007 found sandbox build failure on MongoDB DNS/egress and external-access build success that still used live MongoDB; resolve F-019 through testing, deployment, and environment runbooks. | Unassigned |
| R-025 | High | Architecture | Client/server import boundaries can pull server-only or model modules into client components. | Open: resolve F-022 through architecture and frontend workstreams. | Unassigned |
| R-026 | High | Data/API | MongoDB-backed API routes and account actions can access models without explicit service or wrapper DB connection ownership. | Open: A-002 expanded the route inventory; resolve F-024 and F-027 through data/API, architecture, and auth workstreams. | Unassigned |
| R-027 | High | Deployment/Security | Server-only secrets can be exposed through Next config `env`. | Partially mitigated: T-001 removed `MONGO_URI` from `next.config.mjs`; add a guard against future server-only env exposure before closing. | Unassigned |
| R-028 | Medium | Deployment/Ops | Deployment runtime, Vercel project settings, smoke checks, and rollback steps are not pinned or repeatable. | Open: resolve F-048 through deployment and testing workstreams. | Unassigned |

## Owner Rule

The orchestrator is the default owner for `Unassigned` risks until a specific
owner is recorded.

## Update Rules

- Keep each risk short and actionable.
- Link detailed work to the relevant workstream.
- Add a new row when a task uncovers unresolved production risk.
- Mark mitigation status with evidence when closing a risk.

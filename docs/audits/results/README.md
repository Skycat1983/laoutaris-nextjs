# Audit Results

This directory is the canonical home for audit findings.

Each planned audit has a stable result file. Agents should update the matching
file instead of creating scattered notes.

## Result Index

| ID | Result File | Status |
| --- | --- | --- |
| A-001 | [Shopify commerce](A-001-shopify-commerce.md) | Completed |
| A-002 | [API contracts](A-002-api-contracts.md) | Completed |
| A-003 | [Data models and transforms](A-003-data-models-transforms.md) | Completed |
| A-004 | [Auth, admin, and permissions](A-004-auth-admin-permissions.md) | Completed |
| A-005 | [Frontend routes and components](A-005-frontend-routes-components.md) | Not started |
| A-006 | [Testing and quality baseline](A-006-testing-quality-baseline.md) | Completed |
| A-007 | [Deployment and environment](A-007-deployment-environment.md) | Completed |
| A-008 | [Security headers, CORS, and logging](A-008-security-headers-cors-logging.md) | Completed |
| A-009 | [Cloudinary and assets](A-009-cloudinary-assets.md) | Not started |
| A-010 | [Performance, SEO, and accessibility](A-010-performance-seo-accessibility.md) | Not started |
| A-011 | [Admin content operations](A-011-admin-content-operations.md) | Not started |
| A-012 | [Documentation and handoff quality](A-012-documentation-knowledge-base.md) | Completed |
| A-013 | [Architecture refactor scope](A-013-architecture-refactor-scope.md) | Completed |
| A-014 | [Unused code and dependency pruning](A-014-unused-code-dependency-pruning.md) | Completed |
| A-015 | [SSR and data-fetching strategy](A-015-ssr-data-fetching.md) | Completed |
| A-016 | [Forms, validation, and user input](A-016-forms-validation-inputs.md) | Completed |
| A-017 | [Search, navigation, and content discovery](A-017-search-navigation-discovery.md) | Not started |
| A-018 | [Translations, copy, and content taxonomy](A-018-translations-content-taxonomy.md) | Not started |
| A-019 | [Dependencies and supply chain](A-019-dependencies-supply-chain.md) | Completed |
| A-020 | [Privacy, consent, and commerce compliance](A-020-privacy-consent-commerce-compliance.md) | Not started |
| A-021 | [Observability and incident response](A-021-observability-incident-response.md) | Not started |

## Result Format

Use [../../templates/audit-result.md](../../templates/audit-result.md) when
creating new audit result files.

Required sections:

- Status
- Audit goal
- Summary
- Scope inspected
- Commands run
- Findings
- Findings register updates
- Risks updated
- Workstream updates
- Next action

After filling a result file, list any candidate findings under the result's
`Findings Register Updates` section. In concurrent audit mode, the orchestrator
or assigned reviewer should copy accepted findings into
[../findings-register.md](../findings-register.md) and reconcile them through
[../reconciliation.md](../reconciliation.md).

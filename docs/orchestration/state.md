# Current Orchestration State

Last updated: 2026-05-14

## Current Priority

Sequence the first implementation slices from the reconciled high-severity
auth, API, data, and deployment findings.

## Active Phase

Audit reconciliation and implementation sequencing.

## Current Facts

- `AGENTS.md` is the first-read operating guide for all agents.
- `docs/README.md` is the canonical documentation index.
- Workstream briefs exist for production-readiness implementation areas.
- Audit goals and result files exist for discovery work.
- Architecture refactor, unused-code pruning, SSR/data-fetching, and testing
  reliability are first-class audit and workstream concerns.
- This orchestration guide now defines how a successor agent should take over.
- Audit reconciliation now has a dedicated findings register and review process.
- Orchestrator-assigned goals must start with `/goal` and include `effort:
  high` or `effort: xhigh`.
- Orchestrator assignments must be one-line pointers to canonical docs, not
  large prompt blocks.
- Because assignments are one-line pointers, the linked details doc must be
  complete before commissioning an agent.
- Concurrent audit agents should assume they are not alone in the repo and should
  keep edits scoped to assigned result files unless told otherwise.
- Completed audits A-001, A-006, A-012, A-013, A-014, and A-015 have been
  reconciled into the findings register, risk tracker, workstream backlogs, and
  required process/ADR/runbook docs.
- [ADR 0004](../decisions/0004-server-data-access-ownership.md) is accepted and
  chooses direct server data-access services over same-app HTTP self-fetching for
  server loaders, API routes, and server actions.
- Completed audits A-002, A-003, A-004, and A-007 have been reconciled into the
  findings register, risk tracker, and workstream backlogs.
- T-001, T-002, T-003, and T-004 are complete. T-001 removed `MONGO_URI`
  exposure from Next config, T-002 persisted credentials roles into JWT/session
  state, T-003 made stable `session.user.id` the protected-read ownership
  source, and T-004 standardized the public single Shopify product API contract.

## Active Audits

None currently active.

Completed and reconciled:

- [A-001 Shopify commerce readiness](../audits/results/A-001-shopify-commerce.md)
- [A-006 Testing and quality baseline](../audits/results/A-006-testing-quality-baseline.md)
- [A-012 Documentation and handoff quality](../audits/results/A-012-documentation-knowledge-base.md)
- [A-013 Architecture refactor scope](../audits/results/A-013-architecture-refactor-scope.md)
- [A-014 Unused code and dependency pruning](../audits/results/A-014-unused-code-dependency-pruning.md)
- [A-015 SSR and data-fetching strategy](../audits/results/A-015-ssr-data-fetching.md)
- [A-002 Public, user, and admin API contracts](../audits/results/A-002-api-contracts.md)
- [A-003 Data models, schemas, and transforms](../audits/results/A-003-data-models-transforms.md)
- [A-004 Auth, admin, and permission boundaries](../audits/results/A-004-auth-admin-permissions.md)
- [A-007 Deployment and environment readiness](../audits/results/A-007-deployment-environment.md)

## Recommended Next Audits

Good follow-up audits after the first high-risk implementation slices are
assigned:

1. [A-008 Security headers, CORS, and logging](../audits/goals.md#a-008-security-headers-cors-and-logging)
2. [A-016 Forms, validation, and user input](../audits/goals.md#a-016-forms-validation-and-user-input)
3. [A-019 Dependencies and supply chain](../audits/goals.md#a-019-dependencies-and-supply-chain)

## Open Coordination Tasks

- Use `/goal effort: high` by default when commissioning audit work; reserve
  `effort: xhigh` for broad, ambiguous, or high-risk cross-cutting audits.
- Update and review the relevant details doc first, then commission agents with a
  one-line `/goal` or `/task` pointer.
- Keep future audit result status in sync with `docs/audits/goals.md` and
  `docs/audits/results/README.md`.
- Keep [findings-register.md](../audits/findings-register.md) in sync with
  future completed audit results.
- Convert future completed audit findings into workstream backlog items before
  assigning implementation work.
- Keep A-002, A-003, A-004, and A-007 reconciled findings linked when assigning
  implementation work.
- Add ADRs when architecture or process decisions become settled.
- Keep High severity risks visible and linked to active work.
- Resolve or escalate owner decisions captured in the findings register:
  checkout scope, admin Shopify linking, i18n scope, auth/session pruning, and
  Shopify credential verification.
- Resolve or escalate the new A-002/A-007 decisions: admin API route convention,
  legacy/env variable status, smoke/rollback ownership, and Cloudinary upload
  preset ownership.

## Next Orchestrator Action

Commission
[T-005 Harden Cloudinary Signing API Guard](../tasks/T-005-cloudinary-signing-api-guard.md)
as the next auth/security implementation slice. Preserve the
`next-cloudinary` top-level `signature` response contract while adding the
route-local admin guard, validation, and tests.

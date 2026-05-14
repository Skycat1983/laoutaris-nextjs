# Current Orchestration State

Last updated: 2026-05-14

## Current Priority

Commission the next non-overlapping implementation slices while escalating the
residual Next/PostCSS owner decision.

## Active Phase

Implementation commissioning and high-risk follow-up sequencing.

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
- T-001 through T-016 are complete. They removed `MONGO_URI` exposure from Next
  config, persisted credentials roles into JWT/session state, made stable
  `session.user.id` the protected-read ownership source, standardized the
  public single Shopify product API contract, hardened the Cloudinary signing
  route guard and validation, added the server-only Next config env guard,
  replaced product-detail linked artwork self-fetching with a server-only data
  path, and replaced the product detail `Add to Cart` placeholder with a
  first-release enquiry handoff. The latest batch removed registration
  credential logs and the Shopify token-shaped source comment, hardened public
  enquiry validation, patched the current-major production dependency baseline,
  hardened user comment create/update validation, repaired the active sign-in
  flow, split residual dependency advisories into explicit follow-up tasks,
  completed the Next major migration preflight, and upgraded bcrypt to 6.0.0.
- Completed audits A-008, A-016, and A-019 have been reconciled into the
  findings register, risk tracker, workstream backlogs, result files, and task
  briefs.
- T-015 found no accepted stable Next target that clears both residual
  Next/PostCSS advisories: stable `next@16.2.6` still bundles vulnerable
  `postcss@8.4.31`, while canary `16.3.0-canary.6+` clears isolated audit
  output but requires explicit owner acceptance.
- T-016 removed the bcrypt production advisory path, removed helper credential
  logging, and verified bcrypt 6 hash compatibility.
- T-017, T-018, and T-019 are ready for the next implementation batch.
- The highest current blockers are residual Next/PostCSS production advisories,
  owner confirmation of whether the removed Shopify value requires rotation,
  admin create/update validation, subscription validation, public search/browse
  query bounds, the `/artwork` ADR 0004 proof route, and the remaining
  auth/session pruning decisions.

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
- [A-008 Security headers, CORS, and logging](../audits/results/A-008-security-headers-cors-logging.md)
- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)

## Recommended Next Audits

Good follow-up audits after the next implementation batch is assigned or
completed:

1. [A-009 Cloudinary and asset operations](../audits/goals.md#a-009-cloudinary-and-asset-operations)
2. [A-020 Privacy, consent, and commerce compliance](../audits/goals.md#a-020-privacy-consent-and-commerce-compliance)
3. [A-021 Observability and incident response](../audits/goals.md#a-021-observability-and-incident-response)

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
- Keep A-002, A-003, A-004, A-007, A-008, A-016, and A-019 reconciled findings
  linked when assigning implementation work.
- Add ADRs when architecture or process decisions become settled.
- Keep High severity risks visible and linked to active work.
- Resolve or escalate owner decisions captured in the findings register:
  checkout scope, admin Shopify linking, i18n scope, auth/session pruning,
  Shopify credential verification/rotation, residual Next/PostCSS dependency
  risk, and public enquiry/commercial contact ownership.
- Resolve or escalate the new A-002/A-007 decisions: admin API route convention,
  legacy/env variable status, smoke/rollback ownership, and Cloudinary upload
  preset ownership.

## Next Orchestrator Action

Commission the next batch with one-line task pointers:

```text
/task effort: high details: docs/tasks/T-018-artwork-list-server-data-proof.md
/task effort: high details: docs/tasks/T-017-subscription-validation.md
/task effort: high details: docs/tasks/T-019-legacy-auth-session-pruning.md
```

These tasks have disjoint primary write scopes. T-018 owns the artwork list API,
loader, and new data service; T-017 owns the subscription action/schema/tests;
T-019 owns legacy auth/session pruning and `/protected`. Keep package edits out
of this batch unless a task explicitly escalates.

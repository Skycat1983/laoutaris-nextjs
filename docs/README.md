# Laoutaris Production-Readiness Docs

This is the canonical documentation entry point for the Laoutaris Art Gallery
production-readiness refactor.

The app is a Next.js 14 App Router site for the Joseph Laoutaris art archive. It
uses MongoDB for archive data, Cloudinary for artwork media, NextAuth for user
accounts and admin access, and an early Shopify Storefront API integration for
future artwork, print, and book sales.

## Start Here For Agents

1. Read [../AGENTS.md](../AGENTS.md).
2. For audit or reconciliation work, start from
   [audits/goals.md](audits/goals.md), the assigned result file, or
   [audits/reconciliation.md](audits/reconciliation.md).
3. For implementation work, choose the relevant workstream from
   [workstreams/README.md](workstreams/README.md).
4. Follow the linked dependencies before editing.
5. Update the workstream brief and any affected architecture, runbook, decision,
   or risk docs before handoff.

## Documentation Map

- [Workstreams](workstreams/README.md): active refactor plans, progress, and task
  handoff points.
- [Audits](audits/README.md): linkable audit goals and a canonical home for
  audit results, findings reconciliation, and review status.
- [Orchestration](orchestration/README.md): coordinator role guide, takeover
  checklist, and current orchestration state.
- [Architecture](architecture/README.md): durable maps of routes, data flow,
  integrations, and module boundaries.
- [Runbooks](runbooks/README.md): repeatable setup, verification, deployment,
  Shopify, MongoDB, Cloudinary, and auth operations.
- [Decisions](decisions/README.md): accepted technical decisions and rationale.
- [Risks](risks/production-readiness.md): known production gaps, severity, and
  mitigation status.
- [Templates](templates/README.md): reusable formats for new docs.
- [Archive](archive/README.md): historical notes that have not yet been fully
  consolidated or removed.

## Current Refactor Phase

Status: documentation system established, implementation refactor not yet
started.

Primary goal: make the project safe for production hardening by creating clear
agent handoff boundaries before changing runtime behavior.

Current default workstream order:

1. [Shopify commerce](workstreams/shopify-commerce.md)
2. [Architecture refactor and code health](workstreams/architecture-refactor-and-code-health.md)
3. [Testing and quality](workstreams/testing-and-quality.md)
4. [Deployment, security, and observability](workstreams/deployment-security-and-observability.md)
5. [Data models and API](workstreams/data-models-and-api.md)
6. [Auth, admin, and permissions](workstreams/auth-admin-and-permissions.md)
7. [Frontend routes and components](workstreams/frontend-routes-and-components.md)
8. [Content, assets, and admin operations](workstreams/content-assets-and-admin-ops.md)

This order is a default, not a blocker. If a production risk becomes urgent,
update the relevant workstream and risk doc before switching focus.

## Repo Facts

- Framework: Next.js 14 App Router.
- Language: TypeScript with `strict` enabled.
- Styling: Tailwind CSS and shadcn/ui components.
- Database: MongoDB with Mongoose models plus a raw MongoDB client for NextAuth.
- Auth: NextAuth with credentials, GitHub, and Google providers.
- Commerce: Shopify Storefront API via GraphQL.
- Media: Cloudinary.
- Tests: Jest with unit tests and a small integration test surface.

## Canonical Tracking Rules

- Workstream briefs are the progress tracker.
- Audit goals and results live under `docs/audits/`.
- Audit findings must be reconciled before they become implementation work.
- Orchestrator state lives under `docs/orchestration/`.
- ADRs are the decision history.
- Risk docs are the unresolved production concern tracker.
- Root historical shop notes are not canonical; their durable facts should be
  consolidated into the docs tree.
- Chat summaries are not a source of truth.

## Verification Baseline

Use these commands as the default project-level checks:

```bash
npm test
npm run build
npm run lint
```

Run narrower tests first when a change is isolated, then use broader checks when
shared behavior, routes, auth, or build configuration are touched.

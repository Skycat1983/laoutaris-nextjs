# Workstreams

Workstream briefs are the primary handoff unit for production-readiness work.
They should be specific enough that an agent can start from the brief, read its
dependencies, and make progress without relying on prior chat context.

Discovery work should start from [audit goals](../audits/goals.md), then write
findings to [audit results](../audits/results/README.md). Implementation work
should start from the relevant workstream brief.

## Active Workstreams

| Workstream | Status | Purpose |
| --- | --- | --- |
| [Shopify commerce](shopify-commerce.md) | Active | Make product browsing, product details, and artwork-to-Shopify linking production-ready. |
| [Architecture refactor and code health](architecture-refactor-and-code-health.md) | Active | Scope structural refactors, dead-code pruning, SSR/data-fetching patterns, and scalable conventions. |
| [Data models and API](data-models-and-api.md) | Active | Harden schemas, transforms, API contracts, and error handling. |
| [Auth, admin, and permissions](auth-admin-and-permissions.md) | Active | Secure user, admin, and protected route behavior. |
| [Frontend routes and components](frontend-routes-and-components.md) | Planned | Stabilize public route UX, component boundaries, and client/server imports. |
| [Testing and quality](testing-and-quality.md) | Active | Establish reliable automated checks for refactoring. |
| [Deployment, security, and observability](deployment-security-and-observability.md) | Active | Prepare environment, headers, logs, monitoring, and deployment checks. |
| [Content, assets, and admin operations](content-assets-and-admin-ops.md) | Planned | Make content, image, and admin data operations repeatable. |

## Updating A Workstream

When working in a brief:

- Change `Status` when the work moves from planned to active, blocked, or done.
- Append completed work to `Progress`.
- Keep `Backlog` ordered by the next practical task.
- Keep `Next agent action` as a single concrete instruction.
- Move durable discoveries into architecture, runbook, decision, or risk docs.

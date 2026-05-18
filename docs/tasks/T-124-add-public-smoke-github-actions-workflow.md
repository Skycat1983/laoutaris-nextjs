# T-124 Add Public Smoke GitHub Actions Workflow

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add a repo-owned GitHub Actions workflow for the existing unauthenticated public
smoke script so `npm run smoke:public` can be run from CI manually and, after a
safe public base URL is configured, on a schedule.

## Context

- T-025 made deployment smoke repeatable and added `npm run smoke:public`.
- T-114 extended the smoke script to cover `/robots.txt` and `/sitemap.xml`.
- A-021/F-083 found the smoke script useful but not CI-gated or scheduled, and
  this repo currently has no `.github` workflow directory.
- T-123 left provider-specific monitoring and alert automation blocked on
  owner/platform approval. Public smoke automation can proceed separately
  because it uses unauthenticated public routes and non-secret route inputs.

## Scope

In scope:

- Add a GitHub Actions workflow that:
  - can be started with `workflow_dispatch` and a required `base_url` input;
  - can be scheduled once repository variable `SMOKE_BASE_URL` is configured;
  - uses Node `22.14.0` and `npm ci`;
  - runs `npm run smoke:public` against the selected base URL;
  - passes through existing non-secret optional smoke variables when present:
    `SMOKE_TIMEOUT_MS`, `SMOKE_SEARCH_QUERY`, `SMOKE_ARTWORK_ID`,
    `SMOKE_COLLECTION_SLUG`, `SMOKE_COLLECTION_ARTWORK_ID`, `SMOKE_BLOG_SLUG`,
    `SMOKE_PRODUCT_HANDLE`, and `SMOKE_MISSING_PRODUCT_HANDLE`.
- Keep the workflow unauthenticated: no credentials sign-in, admin session,
  Vercel log inspection, or provider alerting.
- Document the workflow in deployment/testing runbooks, including how to
  configure repository variables safely and how to interpret skipped optional
  detail checks.
- Update this task brief and related workstream/finding/risk/orchestration docs
  after completion.

Out of scope:

- Do not add secret-based credential/admin smoke.
- Do not add Vercel API/log access or deployment rollback automation.
- Do not install or configure a monitoring provider.
- Do not change the smoke script's route assertions unless required by the
  workflow wiring.
- Do not store production URLs, product handles, slugs, IDs, credentials, or
  tokens in source.

## Likely Files

- `.github/workflows/public-smoke.yml`
- `docs/runbooks/deployment.md`
- `docs/runbooks/testing.md`
- `docs/tasks/T-124-add-public-smoke-github-actions-workflow.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- The workflow can run manually with a supplied public base URL.
- The workflow has a clear path for scheduled runs using repository variable
  `SMOKE_BASE_URL` without committing URLs or secrets.
- The workflow uses the pinned project runtime/install baseline.
- Runbooks explain setup, variable ownership, limitations, and failure
  interpretation.
- F-083/R-028 record that unauthenticated public smoke is now CI-accessible,
  while credential/admin smoke, Vercel log inspection, alerting, and provider
  monitoring remain separate.

## Verification

```bash
npm run smoke:public -- --help
git diff --check
```

If the workflow is added, inspect the YAML for `workflow_dispatch`, the schedule
behavior, Node `22.14.0`, `npm ci`, and no secret references. A live GitHub
Actions run is not required unless the repo is connected and the owner provides
a public base URL.

## Handoff Notes

- Planned on 2026-05-18 after T-123 completed the monitoring provider decision
  plan and left provider-specific monitoring blocked on owner/platform
  approval.
- Completed on 2026-05-18 by adding
  `.github/workflows/public-smoke.yml` for unauthenticated public smoke runs.
  Manual runs require a `base_url` input. Scheduled runs use repository variable
  `SMOKE_BASE_URL` and skip with a notice until that non-secret variable is
  configured.
- The workflow uses Node `22.14.0`, `npm ci`, and the existing
  `npm run smoke:public` script. It passes through the optional non-secret
  `SMOKE_*` route input repository variables without adding secrets,
  credentialed smoke, Vercel log access, rollback automation, or provider
  alerting.
- Runbooks now document setup, safe repository variable ownership, skipped
  optional detail checks, and the unauthenticated-only workflow limitations.
- Verification passed with `npm run smoke:public -- --help`, `git diff
  --check`, and targeted workflow inspection for `workflow_dispatch`,
  `schedule`, Node `22.14.0`, `npm ci`, and absence of secret references. No
  live GitHub Actions run was performed because no owner-provided public base
  URL was supplied for this task.

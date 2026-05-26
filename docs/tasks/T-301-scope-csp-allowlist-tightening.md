# T-301 Scope CSP Allowlist Tightening

Status: Completed

Workstreams:

- [Deployment, Security, And Observability](../workstreams/deployment-security-and-observability.md)

## Goal

Create a current-source CSP allowlist tightening plan without changing runtime
headers.

## What This Does

This task inventories the current security header/CSP configuration and the
source hosts required by active Cloudinary, Shopify, YouTube, font, media,
image, form, frame, and connection usage. It should produce a scoped plan for a
future CSP implementation task, including which directives can be tightened now
and which need owner/platform decisions.

## Why This Exists

R-004 remains partially mitigated: baseline headers exist, but the production
CSP still keeps broad allowances. A careful source-backed inventory is the next
safe step before editing headers because an over-tightened CSP could break
admin uploads, Shopify handoff, embedded media, image delivery, or auth flows.

## Parallel Assignment Rules

This task is safe to run in parallel with T-302 and T-303 because it should not
edit shared trackers or runtime code. During the parallel run, update only this
task file and the new result artifact. List candidate updates for
`docs/tasks/README.md`, workstreams, findings, risks, and orchestration state in
the handoff notes for the orchestrator to reconcile.

## Scope

In scope:

- Read the current header/CSP configuration in `next.config.mjs`.
- Search source and docs for externally loaded resources and security-relevant
  integrations, including Cloudinary, Shopify, YouTube, Google/Next fonts,
  auth providers, uploads, media, images, forms, frames, and public smoke.
- Create `docs/audits/results/T-301-csp-allowlist-tightening-scope.md` with:
  - current directives and broad allowances;
  - current source evidence for each required host or scheme;
  - candidate tighter directives;
  - risks, unknowns, and owner/platform decisions;
  - a proposed implementation/test split.
- Note whether dynamic per-origin CORS, HSTS, CSP reporting, or monitoring
  should stay separate.

Out of scope:

- Do not edit `next.config.mjs`, middleware, route handlers, CSP headers, CORS,
  HSTS, monitoring providers, environment variables, CI, or runtime source.
- Do not remove any currently allowed host or scheme.
- Do not make owner/platform decisions about monitoring, Vercel, auth provider
  domains, Shopify policy URLs, or production launch posture.

## Concurrency

This task owns only:

- `docs/tasks/T-301-scope-csp-allowlist-tightening.md`
- `docs/audits/results/T-301-csp-allowlist-tightening-scope.md`

Do not edit shared trackers or indexes during the parallel run.

## Completion Contract

- Mark this task `Status: Completed` only after the result artifact is written
  and verification passes.
- Record exact source-search commands and any assumptions.
- Include candidate tracker/workstream updates in handoff notes rather than
  editing shared trackers.

## Acceptance Criteria

- The plan identifies the current CSP/header posture and all currently required
  external host categories with source evidence.
- It separates safe future header changes from owner/platform-dependent
  decisions.
- It recommends a narrow implementation/test task without changing runtime
  behavior.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 as one of three parallel-safe scoping tasks after
  T-300 completed the A-014 source-pruning sequence.
- Completed on 2026-05-26 with
  [T-301 CSP Allowlist Tightening Scope](../audits/results/T-301-csp-allowlist-tightening-scope.md).
  No runtime headers, CORS, HSTS, monitoring, environment variables, CI,
  middleware, or route handlers were changed.
- The result recommends a future report-only CSP implementation/test slice
  before enforcement. It keeps dynamic per-origin CORS, HSTS, CSP reporting,
  monitoring provider wiring, OAuth provider console decisions, Shopify
  checkout/policy decisions, and YouTube privacy-mode decisions separate.
- Candidate shared tracker updates for `docs/tasks/README.md`, the
  deployment/security workstream, F-052/R-004, and orchestration state are
  listed in the result artifact for orchestrator reconciliation.

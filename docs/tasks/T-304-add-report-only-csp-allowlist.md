# T-304 Add Report-Only CSP Allowlist

Status: Completed

Workstreams:

- [Deployment, Security, And Observability](../workstreams/deployment-security-and-observability.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add a report-only tightened CSP allowlist while preserving the current enforced
CSP.

## What This Does

This task uses the T-301 source inventory to add a
`Content-Security-Policy-Report-Only` header with narrower source directives.
The existing enforced `Content-Security-Policy` header must remain unchanged
during this observation phase.

## Why This Exists

T-301 found that R-004 can safely move forward only through a report-only CSP
step first. Cloudinary upload widget internals, inline script/style behavior,
and media/source usage need evidence before enforcing a stricter policy.

## Parallel Assignment Rules

This task can run in parallel with T-305 and T-306. It owns security header
configuration and focused deployment-header tests only. Do not edit shared
trackers, workstreams, task index, or orchestration state while running in
parallel; list candidate shared updates in the handoff.

## Scope

In scope:

- Use
  [T-301 CSP Allowlist Tightening Scope](../audits/results/T-301-csp-allowlist-tightening-scope.md)
  as the source of truth for candidate directives.
- Add a report-only CSP header in `next.config.mjs` or a small local helper used
  by `next.config.mjs`.
- Preserve the current enforced CSP header exactly unless a test needs to be
  made more explicit about that invariant.
- Include the T-301 candidate host categories for Cloudinary delivery,
  Cloudinary upload widget hosts, Shopify CDN images, YouTube embeds, Flaticon,
  `next/font` runtime behavior, and current inline style/script allowances.
- Update focused security-header tests to assert:
  - the enforced CSP remains the current broad policy;
  - the report-only CSP exists;
  - the report-only CSP narrows broad `https:`, `data:`, `blob:`, and
    `'unsafe-eval'` behavior where T-301 said it was safe to observe first.

Out of scope:

- Do not enforce the tightened CSP.
- Do not add HSTS, CSP report endpoints, monitoring provider wiring, alerting,
  dynamic per-origin CORS, environment variables, CI changes, or browser
  automation.
- Do not remove Cloudinary widget, YouTube, Shopify CDN, Flaticon, or current
  inline style/script compatibility allowances from the enforced policy.
- Do not make owner/legal/platform decisions about YouTube privacy mode, OAuth
  provider domains, Shopify policy URLs, canonical deployment domain, HSTS
  preload, or monitoring posture.

## Concurrency

This task owns:

- `next.config.mjs`
- `__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts`
- `docs/tasks/T-304-add-report-only-csp-allowlist.md`

Leave unrelated dirty files and shared trackers alone.

## Files Likely Touched

- `next.config.mjs`
- `__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts`
- `docs/tasks/T-304-add-report-only-csp-allowlist.md`

## Completion Contract

- Mark this task `Status: Completed` only after implementation and verification
  are complete.
- Record the exact report-only directives added.
- State that the enforced CSP remains unchanged.
- List candidate shared tracker updates for orchestrator reconciliation.

## Acceptance Criteria

- A report-only CSP header is emitted alongside the current enforced CSP.
- Tests prove the enforced policy remains unchanged and the report-only policy
  reflects the T-301 candidate allowlist.
- HSTS, dynamic CORS, CSP reporting endpoint/provider, monitoring, and owner
  decisions remain separate.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/nextConfigSecurityHeaders.test.ts
npm run build
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 after T-301 completed the CSP allowlist scoping pass.
- Completed on 2026-05-26.
- Added `Content-Security-Policy-Report-Only` globally in `next.config.mjs`
  alongside the existing enforced `Content-Security-Policy`.
- The enforced CSP remains unchanged:
  `default-src 'self' https: data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com; style-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com; img-src 'self' data: https: blob:; font-src 'self' data: https://widget.cloudinary.com https://upload-widget.cloudinary.com; connect-src 'self' data: https: blob:; media-src 'self' data: https: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'`.
- Report-only directives added:
  `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com; img-src 'self' data: blob: https://res.cloudinary.com https://cdn-icons-png.flaticon.com https://cdn.shopify.com; font-src 'self' data: https://widget.cloudinary.com https://upload-widget.cloudinary.com; connect-src 'self' https://api.cloudinary.com https://widget.cloudinary.com https://upload-widget.cloudinary.com; style-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com; script-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://www.youtube.com https://www.youtube-nocookie.com; media-src 'self' blob: https://res.cloudinary.com`.
- Focused tests now assert the enforced CSP exact string, report-only header
  presence, and report-only narrowing of broad `https:`, `data:`, `blob:`, and
  `'unsafe-eval'` allowances where T-301 scoped observation as safe.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/deployment/nextConfigSecurityHeaders.test.ts`,
  `npm run build`, and
  `git diff --check`.
- Candidate shared tracker updates for orchestrator reconciliation:
  mark T-304 completed in `docs/tasks/README.md`; add a deployment/security
  workstream note that report-only CSP observation is now configured; add a
  testing workstream note that focused header tests lock the enforced/report-only
  split; update R-004/F-052 notes to say stricter CSP remains report-only and
  still needs evidence before enforcement.

# T-096 Harden Baseline Security Headers And API CORS

Status: Completed

Workstream:
[Deployment, Security, And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the invalid global API CORS credential wildcard pairing and add a
minimal, production-safe baseline of security headers without changing app
runtime behavior or attempting the full strict CSP allowlist migration.

## Context

- A-008/F-052 found `next.config.mjs` applies global API CORS with
  `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Credentials: true`,
  and `Access-Control-Allow-Headers: *`.
- Browser same-origin app calls do not need permissive CORS headers, and
  wildcard origin plus credentials is not a valid credentialed CORS policy.
- The global CSP is broad and still needs a future production allowlist task,
  but it also lacks low-risk hardening directives such as `object-src`,
  `base-uri`, `form-action`, and `frame-ancestors`.
- T-095 completed the direct/commented `console.log()` cleanup stream; route
  logging and broader production logging/redaction policy remain separate.

## Scope

- In scope:
  - Update `next.config.mjs` header configuration for the current app.
  - Remove the invalid wildcard-origin plus credentialed CORS combination from
    the `/api/:path*` header rule.
  - Prefer a conservative same-origin baseline: do not invent dynamic origin
    reflection inside `next.config.mjs`.
  - If any global API CORS header is retained, it must avoid credentials with
    wildcard origin and must avoid `Access-Control-Allow-Headers: *`.
  - Add baseline hardening headers to `/:path*`, including
    `X-Content-Type-Options`, `Referrer-Policy`, and a conservative
    `Permissions-Policy`.
  - Add low-risk CSP hardening directives:
    `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and
    `frame-ancestors 'self'`.
  - Preserve the existing Cloudinary, Shopify CDN, YouTube, image, font,
    media, and connection allowances unless focused evidence proves a removal
    is safe.
  - Add focused static tests that import the Next config, evaluate
    `headers()`, and prove the above invariants.
  - Update this task brief, the deployment/security workstream, the testing
    workstream, and relevant risk/finding notes after completion.
- Out of scope:
  - Full strict CSP allowlist design or removal of current `https:`,
    `'unsafe-inline'`, or `'unsafe-eval'` allowances.
  - CSP report-only rollout, reporting endpoint, alerting, or monitoring.
  - Dynamic per-origin CORS middleware or per-route CORS policy.
  - HSTS rollout, which depends on deployment-domain ownership.
  - Route-level API error logging, `console.error()` policy, or the broader
    production logging/redaction policy.
  - Cloudinary upload preset/folder/lifecycle policy.

## Files Likely Touched

- `next.config.mjs`
- `__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts`
- `docs/tasks/T-096-harden-baseline-security-headers-cors.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- `next.config.mjs` no longer sends
  `Access-Control-Allow-Credentials: true` together with
  `Access-Control-Allow-Origin: *`.
- No global API CORS rule sends `Access-Control-Allow-Headers: *`.
- Baseline hardening headers are present for app routes:
  `X-Content-Type-Options: nosniff`, a non-empty `Referrer-Policy`, and a
  conservative `Permissions-Policy`.
- The CSP includes `object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`, and `frame-ancestors 'self'`.
- Existing required external-source allowances for current Cloudinary widget,
  Cloudinary images, Shopify CDN images, YouTube embeds, fonts, media, and
  connections are preserved unless explicitly documented with focused evidence.
- Focused tests lock the header invariants so the invalid CORS pairing and
  missing hardening directives cannot regress silently.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/nextConfigSecurityHeaders.test.ts
npm run lint
npm run build
rg -n "Access-Control-Allow-Credentials|Access-Control-Allow-Headers.*\\*" next.config.mjs
git diff --check
```

Completed verification on 2026-05-17:

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/nextConfigSecurityHeaders.test.ts
npm run lint
npm run build
rg -n "Access-Control-Allow-Credentials|Access-Control-Allow-Headers.*\\*" next.config.mjs
git diff --check
```

The required `rg` command returned no matches.

## Handoff Notes

- Prepared after T-095 closed the direct/commented `console.log()` cleanup
  stream and left F-052/R-004 as the next focused deployment/security risk.
- Keep this as a baseline hardening slice; do not expand it into full CSP,
  dynamic CORS, HSTS, monitoring, or logging-policy work.
- Completed on 2026-05-17 by removing the global `/api/:path*` CORS header
  rule from `next.config.mjs`, adding `X-Content-Type-Options`,
  `Referrer-Policy`, conservative `Permissions-Policy`, and CSP
  `object-src`, `base-uri`, `form-action`, and `frame-ancestors` directives
  while preserving the existing broad Cloudinary, Shopify CDN, YouTube, image,
  font, media, and connection allowances. Added focused static Next config
  tests so wildcard credential CORS, wildcard allowed request headers, missing
  hardening headers, and removed allowances cannot regress silently.

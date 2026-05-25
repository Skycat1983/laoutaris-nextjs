# T-005 Harden Cloudinary Signing API Guard

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

## Goal

Make `POST /api/v2/admin/sign-cloudinary-params` locally admin-guarded,
request-validated, and tested while preserving the response shape required by
`next-cloudinary`.

## Compatibility Constraint

The installed `next-cloudinary` upload helper calls the signature endpoint and
passes `result.signature` to the Cloudinary widget. Do not remove the top-level
`signature` field from successful responses unless the upload integration is
changed away from `signatureEndpoint`.

If this task adds a shared API success envelope, make it additive, for example
by returning top-level `signature` plus `success: true` and `data: { signature }`.

## Why Now

This is the next high-risk auth/security slice after T-002, T-003, and T-004.
The endpoint lives under `/api/v2/admin`, signs caller-provided Cloudinary
parameters, and is currently the only admin route without a route-local admin
check.

It addresses:

- [F-044](../audits/findings-register.md): Cloudinary signing bypasses standard
  admin/API/upload controls.
- [F-036](../audits/findings-register.md): protected API auth responses do not
  consistently return real HTTP status codes.
- [R-002](../risks/production-readiness.md): Cloudinary admin signing guard
  remains open.
- [R-008](../risks/production-readiness.md): Cloudinary upload signing lacks
  production-ready admin/API controls.
- [A-002](../audits/results/A-002-api-contracts.md): API contract evidence for
  the raw signing route.
- [A-004](../audits/results/A-004-auth-admin-permissions.md): auth/admin
  evidence for the missing local guard.
- [A-007](../audits/results/A-007-deployment-environment.md): deployment
  evidence for missing Cloudinary environment ownership.

## Read First

- [Auth workstream](../workstreams/auth-admin-and-permissions.md)
- [Content/assets/admin workstream](../workstreams/content-assets-and-admin-ops.md)
- [Deployment/security workstream](../workstreams/deployment-security-and-observability.md)
- [Cloudinary runbook](../runbooks/cloudinary.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [A-004 auth/admin result](../audits/results/A-004-auth-admin-permissions.md)

## Scope

In scope:

- Add a small reusable API admin guard or auth response helper if it keeps the
  implementation clear.
- Return JSON 401 for unauthenticated API callers and JSON 403 for authenticated
  non-admin callers.
- Use stable session identity and role behavior established by T-002 and T-003.
- Apply the route-local guard to
  `POST /api/v2/admin/sign-cloudinary-params`.
- Validate request JSON before signing:
  - body must be a JSON object.
  - `paramsToSign` must be a non-null plain object.
  - reject arrays and primitive `paramsToSign` values.
- Check `CLOUDINARY_API_SECRET` before signing and return a public-safe
  misconfiguration error if it is missing.
- Preserve `next-cloudinary` compatibility by keeping `signature` at the
  top-level of successful responses.
- Remove or gate directly related upload/signing debug logs only where it is
  low risk and covered by the task.
- Add focused tests for unauthenticated, non-admin, invalid body, missing
  secret, and successful signing behavior.
- Update this task and affected workstream progress after completion.

Out of scope:

- Do not refactor every admin API route to the new guard.
- Do not remove `/protected` or legacy auth/session files.
- Do not define the full Cloudinary upload policy, folder allow-list, preset
  ownership, or asset lifecycle rules in this task.
- Do not change public artwork image payloads or Cloudinary image transforms.
- Do not change the upload widget UX beyond preserving current behavior.
- Do not record secret values in docs or tests.

## Files Likely Touched

- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
- Optional helper under `src/lib/api/` or `src/lib/session/`
- `src/components/elements/buttons/UploadButton.tsx` only for directly related
  low-risk debug-log cleanup
- Focused tests under `__tests__/unit/`
- `docs/tasks/T-005-cloudinary-signing-api-guard.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/runbooks/cloudinary.md` if the response compatibility or remaining
  policy gap needs to be documented

## Concurrency

You are not alone in the repo. Keep edits scoped to the signing route, a small
reusable helper if needed, focused tests, and directly related docs. Do not
combine this with broad admin API guard migration, Cloudinary policy design, or
image transform cleanup.

## Acceptance Criteria

- Unauthenticated requests receive HTTP 401 JSON.
- Authenticated non-admin requests receive HTTP 403 JSON.
- Invalid request bodies receive HTTP 400 JSON and do not sign anything.
- Missing `CLOUDINARY_API_SECRET` receives a public-safe non-2xx JSON error.
- Successful admin requests sign the provided params with
  `CLOUDINARY_API_SECRET`.
- Successful responses still include top-level `signature` for
  `next-cloudinary` compatibility.
- Focused tests cover the guard, validation, configuration, and success paths.

## Completion Notes

- Completed on 2026-05-14.
- Added `requireApiAdmin()` for API route handlers that need stable session ID,
  session role, and persisted database role verification with JSON 401/403
  responses.
- Applied the guard to `POST /api/v2/admin/sign-cloudinary-params`.
- Added request JSON validation for the body and `paramsToSign` plain object.
- Added a public-safe missing `CLOUDINARY_API_SECRET` response before signing.
- Successful responses now return `success: true`, top-level `signature`, and
  `data: { signature }` to preserve `next-cloudinary` compatibility while
  adding a success envelope.
- Added focused tests in
  `__tests__/unit/api/cloudinarySigningRoute.test.ts`.

Remaining out-of-scope work:

- Define allowed Cloudinary params, folder/preset policy, asset lifecycle, and
  environment ownership in the content/assets and deployment workstreams.
- Migrate other admin API routes to the new guard only through a separate
  scoped task.

## Verification

Run the narrowest relevant tests first, then the project checks:

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm test
npm run lint
npm run build
```

Completed verification:

```bash
npm test -- --runTestsByPath __tests__/unit/api/cloudinarySigningRoute.test.ts
npm test
npm run lint
npm run build
```

Notes:

- `npm test` passed all 12 suites and 119 tests. Existing `dateUtils`
  invalid-date console output remains noisy.
- `npm run build` passed, while still showing the known live MongoDB/session/page
  data and debug-log coupling tracked elsewhere.

If `npm run build` surfaces the known live MongoDB or external network coupling,
record the exact output and reference R-024/F-019 instead of expanding this
task.

## Escalate

Escalate to the orchestrator if:

- Preserving the top-level `signature` conflicts with a proposed shared API
  envelope.
- The route guard requires changing NextAuth provider behavior.
- Tests need shared NextAuth route-handler infrastructure that would affect
  multiple auth tasks.
- Another agent is editing the Cloudinary signing route, upload button, or auth
  session helpers concurrently.

# T-066 Harden Cloudinary Signing Params

Status: Completed

Workstreams:
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Complete the next focused F-044 Cloudinary upload-security slice by restricting
`POST /api/v2/admin/sign-cloudinary-params` to an explicit signing parameter
allowlist that supports the current admin upload widget.

## Context

- T-005 added route-local admin guarding, body shape validation, missing-secret
  handling, and focused tests for the Cloudinary signing route.
- Before this task, F-044/F-054 remained partially open because the route still
  signed any caller-provided plain-object `paramsToSign`.
- T-065 documented Cloudinary env variables and confirmed
  `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is not currently read from
  `process.env`.
- `src/components/elements/buttons/UploadButton.tsx` currently uses
  `CldUploadWidget` with hard-coded `uploadPreset="laoutaris_art"`,
  `signatureEndpoint="/api/v2/admin/sign-cloudinary-params"`, `multiple:
  false`, `maxFiles: 1`, and `maxFileSize: 10000000`.

## Scope

In scope:

- Define a route-local allowlist for Cloudinary params that may be signed for
  the current admin upload widget.
- Reject unknown signing params with a structured `400` response before calling
  `cloudinary.utils.api_sign_request`.
- Validate allowed param value types enough to prevent signing arrays, nested
  arbitrary objects, or unsafe primitive shapes unless the current widget
  demonstrably requires them.
- Preserve `requireApiAdmin()` auth behavior, existing public-safe missing
  secret behavior, and the `next-cloudinary` compatible top-level
  `signature` success field.
- Add or update focused route tests for accepted current-widget signing params,
  rejected unknown params, rejected invalid allowed-param value shapes, and
  preserved 401/403/body-shape/missing-secret/success behavior.
- Update the Cloudinary runbook with the allowed signing params and the
  remaining upload-preset/folder/asset-lifecycle decisions.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not change Cloudinary credentials or environment variables.
- Do not change the upload preset ownership model.
- Do not change admin upload UI behavior unless a tiny compatibility adjustment
  is required by the new signing contract.
- Do not implement Cloudinary asset deletion, backup, lifecycle, folder
  migration, or transformation policy.
- Do not run a browser/widget smoke unless the implementation changes the
  widget request shape and targeted unit coverage is insufficient.

## Files Likely Touched

- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
- `__tests__/unit/api/cloudinarySigningRoute.test.ts`
- `docs/runbooks/cloudinary.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- The signing route signs only allowlisted Cloudinary params.
- Unknown params and invalid value shapes return `400` before signing.
- Admin auth, public-safe config failure, and top-level signature compatibility
  are preserved.
- Focused route tests cover accepted and rejected signing params.
- Cloudinary runbook documents the allowlist and remaining policy gaps.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/cloudinarySigningRoute.test.ts
npm run lint
npm run build
```

If the implementation changes the upload widget request shape, add the narrowest
additional component or integration check that proves the widget still targets
the signing endpoint correctly.

## Handoff Notes

- Completed 2026-05-16.
- `POST /api/v2/admin/sign-cloudinary-params` now validates `paramsToSign`
  against a route-local allowlist before reading `CLOUDINARY_API_SECRET` or
  calling `cloudinary.utils.api_sign_request`.
- The allowlist supports the current admin upload widget with required
  `timestamp`, exact `upload_preset: "laoutaris_art"`, and exact
  `source: "uw"`. Unknown keys such as `folder`, arrays, nested objects,
  booleans, unsafe timestamp strings, and unexpected preset/source values return
  structured `400` responses before signing.
- Existing `requireApiAdmin()` 401/403 behavior, public-safe missing-secret
  handling, and top-level `signature` compatibility were preserved.
- Focused route coverage was expanded for accepted current-widget params,
  unknown params, invalid allowed-param shapes, auth/body-shape/missing-secret,
  and success behavior.
- Cloudinary upload preset ownership, signed folder policy, asset lifecycle,
  deletion, backup, and rollback remain separate owner/orchestrator decisions.
- Verification run: `npm test -- --runTestsByPath
  __tests__/unit/api/cloudinarySigningRoute.test.ts`, `npm run lint`, `npm run
  build`, and `git diff --check`. Build passed with the existing
  MongoDB/static-generation and fetcher debug-log noise already tracked by the
  workstreams.

## Escalate

Escalate to the orchestrator if:

- The current upload widget requires signing broad or nested params that would
  effectively keep arbitrary signing behavior.
- Choosing allowed folders, upload presets, or transformation policies requires
  owner decisions beyond the current hard-coded widget behavior.
- Browser/widget verification becomes necessary and would require large logs,
  screenshots, or traces.

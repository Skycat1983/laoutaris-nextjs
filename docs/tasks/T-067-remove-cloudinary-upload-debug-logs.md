# T-067 Remove Cloudinary Upload Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove always-on debug logging from the admin Cloudinary upload button while
preserving the current upload widget configuration and success behavior.

## Context

- F-020 tracks debug logs and expected noisy output across tests, builds, SSR,
  API, upload, and commerce paths.
- T-066 hardened the Cloudinary signing route for the current admin widget
  request shape. This task should not change that request shape.
- Before this task, `src/components/elements/buttons/UploadButton.tsx` logged
  on mount, polled Cloudinary availability, logged widget render props,
  inspected DOM/iframe state after open, logged click state, and logged
  abort/close/error callbacks.
- There is no accepted global logging/redaction framework yet, so this task
  should remove the direct debug output rather than introduce a new logger.

## Scope

In scope:

- Remove direct `console.log`, `console.warn`, and `console.error` calls from
  `UploadButton`.
- Remove the Cloudinary availability polling interval and DOM/iframe inspection
  debug block.
- Preserve `CldUploadWidget`, `uploadPreset="laoutaris_art"`,
  `signatureEndpoint="/api/v2/admin/sign-cloudinary-params"`, existing widget
  options, the loading/disabled button behavior, and `onUploadSuccess(result)`.
- Keep error, abort, close, and open callbacks only if they still serve a
  behavior purpose after debug logging is removed.
- Add or extend focused source/component coverage proving `UploadButton` has no
  direct console usage. If practical, also preserve coverage for widget props
  and the success callback behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not define the global production logging/redaction, monitoring, or
  request-correlation policy.
- Do not change Cloudinary signing params, upload preset ownership, folder
  policy, asset lifecycle, backup, deletion, or rollback behavior.
- Do not redesign the upload UI or change admin dashboard workflow.
- Do not add browser/widget smoke checks unless the implementation changes
  behavior in a way that source or component tests cannot prove.
- Do not touch T-059 or Shopify product-link audit execution.

## Files Likely Touched

- `src/components/elements/buttons/UploadButton.tsx`
- `__tests__/unit/security/credentialSourceHygiene.test.ts` or a new focused
  source/component test
- `docs/tasks/T-067-remove-cloudinary-upload-debug-logs.md`
- `docs/tasks/README.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `UploadButton` contains no direct `console.log`, `console.warn`, or
  `console.error` calls.
- The Cloudinary availability polling interval and DOM/iframe debug inspection
  are removed.
- The upload button still renders through `CldUploadWidget` with the existing
  preset, signing endpoint, options, loading label, disabled state, and open
  behavior.
- Successful uploads still call `onUploadSuccess(result)` with the widget
  result.
- Focused tests or source hygiene checks fail if direct console logging returns
  to `UploadButton`.

## Verification

Run:

```bash
rg -n "console\\.(log|warn|error)" src/components/elements/buttons/UploadButton.tsx
npm test -- --runTestsByPath __tests__/unit/security/credentialSourceHygiene.test.ts
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses a
different focused test file, run that file instead of or in addition to the
source hygiene test.

Completed verification:

```bash
rg -n "console\\.(log|warn|error)" src/components/elements/buttons/UploadButton.tsx
npm test -- --runTestsByPath __tests__/unit/security/credentialSourceHygiene.test.ts __tests__/unit/uploadButton.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` check returned no matches. Focused tests passed with 2 suites and 7
tests. Lint, build, and `git diff --check` passed. Build retained the existing
MongoDB/static-generation/fetcher console noise tracked under F-020.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16 by removing direct upload-button debug logs, availability
  polling, DOM/iframe inspection, and debug-only widget callbacks while
  preserving the Cloudinary widget preset, signing endpoint, options,
  loading/disabled button behavior, open behavior, and success callback.
- Added focused source hygiene and component coverage in
  `__tests__/unit/security/credentialSourceHygiene.test.ts` and
  `__tests__/unit/uploadButton.test.tsx`.
- Keep broader logging/redaction policy under F-020/F-053/R-019.
- Keep Cloudinary preset/folder/lifecycle policy under F-044/R-008.

## Escalate

Escalate to the orchestrator if:

- Removing a callback changes required `next-cloudinary` widget behavior.
- A proper fix requires deciding a global logging framework or redaction policy.
- Widget verification requires broad browser captures, large screenshots, DOM
  dumps, traces, videos, or full console logs.

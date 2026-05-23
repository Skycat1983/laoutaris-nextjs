# T-230 Fix Client Import Boundary Regression

Status: Planned

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make the current `clientServerImportBoundary` guard pass again by removing the
client runtime import path from `SignUpForm` into the broad server/mixed
constants barrel.

## Context

- A-022 found the targeted import-boundary test currently fails.
- `src/components/modules/forms/user/SignUpForm.tsx` imports
  `ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_NAME` and
  `ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_FIELD_VALUE` from `@/lib/constants`.
- The broad `@/lib/constants` barrel currently reaches server/model and mixed
  component barrel modules that must not be in a client runtime graph.
- T-137 and T-205 are completed guard/cleanup tasks; this task repairs a new
  regression, not a broad barrel redesign.

## Scope

In scope:

- Replace the `SignUpForm` broad constants import with a direct client-safe
  import, preferably from the existing account privacy acknowledgement constants
  module if it has no server-only imports.
- If a tiny client-safe constants barrel is needed, keep it narrow and avoid
  importing or re-exporting mixed/server constants from it.
- Keep registration behavior, privacy acknowledgement field names/values,
  validation, modal behavior, and copy unchanged.
- Add or update focused source-hygiene coverage only if the existing guard does
  not clearly protect the fixed path.

Out of scope:

- Do not delete or reorganize the broad constants barrel.
- Do not refactor registration actions, validation schemas, auth flows, policy
  copy, or modal layout.
- Do not start middleware, cache, ISR, or provider-island work in this task.

## Concurrency

Run this before other A-022 implementation tasks if practical because it fixes
an already-red architecture guard. It can run in parallel with T-231 only if the
agents do not edit the same files and neither edits shared trackers.

Owned files:

- `src/components/modules/forms/user/SignUpForm.tsx`
- a narrow constants module under `src/lib/constants/` if needed
- `__tests__/unit/security/clientServerImportBoundary.test.ts` only if the
  source invariant needs a clearer assertion
- focused sign-up/privacy acknowledgement tests if imports or field contracts
  change

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files
unless explicitly assigned.

## Acceptance Criteria

- `SignUpForm` no longer imports runtime values from `@/lib/constants`.
- The client runtime import graph does not reach `src/lib/constants/index.ts`,
  Mongoose/model modules, data-service modules, transforms barrels, or mixed
  component barrels.
- Sign-up privacy acknowledgement field names and values remain unchanged.
- The existing failing import-boundary test is green without weakening the
  guard.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/forms/SignUpFormPrivacy.test.tsx
npm run build
```

## Handoff Notes

- Finding: F-112.
- Risk: R-025.
- Next task after this passes: T-231 middleware matcher narrowing.

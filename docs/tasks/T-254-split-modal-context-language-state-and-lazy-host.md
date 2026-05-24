# T-254 Split Modal Context Language State And Lazy Host

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reduce the post-T-236 root modal/provider client cost without moving runtime
provider ownership or changing auth/session semantics.

## Context

- T-253 completed the root provider/modal client-island scoping pass.
- Root layout still wraps the global modal, header, route content, and footer in
  `ClientContextBoundary`.
- `ClientContextBoundary` still mounts `SessionProvider` and
  `GlobalFeaturesProvider` globally.
- `GlobalFeaturesProvider` combines active modal state with language state, but
  the only source consumer of language is the currently unreferenced
  `TranslatedContent` component.
- `Modal` is root-mounted and eagerly imports the `@headlessui/react` dialog
  implementation even though no modal is visible until user intent.
- T-236 reduced the root layout chunk from `35,174` to `27,772` bytes
  uncompressed by lazy-loading mobile drawer bodies. Shared first-load route
  totals stayed effectively flat.

## Scope

In scope:

- Split unused language state out of the active root modal/global feature
  provider path.
- Keep modal state available globally at the existing root boundary.
- Keep `SessionProvider` global and unchanged.
- Preserve the existing modal behavior for public saved-item intent buttons,
  blog comments, auth/contact/enquiry/logout forms, account navigation, admin
  operation tabs, and comment cards.
- Replace the eager root modal dialog presentation with a small modal host that
  lazy-loads the dialog body/presentation only after modal intent.
- Preserve `openModal(content, onClose)`, `closeModal()`, and
  `setModalContent(...)` semantics.
- Add or update focused source/behavior coverage for modal provider shape,
  existing modal consumers, and client/server import boundaries.
- Run a build and compare the root layout client chunk against the T-236
  `27,772` byte baseline.

Out of scope:

- Do not move `ClientContextBoundary`.
- Do not move `SessionProvider`, change session/auth semantics, or add
  route-local session providers.
- Do not move modal provider ownership below the root.
- Do not change saved-item server actions, account routes, admin dashboard
  behavior, comment mutation behavior, contact/enquiry form payloads, shop
  behavior, cache policy, route segment config, package files, Playwright setup,
  or CI workflows.
- Do not delete broad unused components or hooks beyond removing unused
  language state from the active root provider path.
- Do not add a new state-management library.

## Concurrency

Run after T-253. Do not run in parallel with root layout/provider/modal edits,
auth/session component refactors, saved-item action edits, account/admin
navigation edits, comment UI edits, contact/enquiry form edits, cache-policy
runtime work, or package edits.

Owned files:

- `src/contexts/ClientContextBoundary.tsx`
- `src/contexts/GlobalFeaturesContext.tsx` or a modal-only replacement under
  `src/contexts/`
- `src/hooks/useModal.ts`
- `src/components/modules/modal/Modal.tsx`
- optional colocated modal host/body files under `src/components/modules/modal/`
- focused affected tests under `__tests__/unit/`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Implementation Notes

- Prefer the smallest provider shape that keeps the current modal API available
  to all existing consumers.
- It is acceptable to keep the `useGlobalFeatures()` export temporarily as a
  modal-only compatibility hook if that avoids a broad consumer rename. If the
  hook is renamed, update tests and consumers mechanically in the same task.
- The lazy modal host should not require the full `@headlessui/react` dialog
  implementation in the initial root layout chunk before any modal opens.
- Do not use `ssr: false` or a dynamic import shape that changes visible modal
  behavior after `openModal()` beyond a short first-load delay.
- If Next retains the dialog implementation in the root/shared chunk, preserve
  behavior and record the evidence instead of broadening the task.

## Acceptance Criteria

- `SessionProvider` remains global in `ClientContextBoundary`.
- Modal state remains globally available from the existing root provider
  boundary.
- Active root provider state no longer includes unused language state.
- `TranslatedContent` is either decoupled from the active root modal provider
  path or explicitly left as an unreferenced/deferred language path with no
  root-provider cost.
- Existing modal consumers keep their visible behavior:
  unauthenticated saved-item prompts, blog comment notifications, auth form
  switching, contact/enquiry submission messages, logout modal callbacks,
  account navigation messages, admin operation messages, and comment-card error
  messages.
- The root layout client chunk is below `26,000` bytes uncompressed, or the
  task handoff explains why Next retained modal code despite the split.
- No cache, route segment, auth/session, saved-action, account/admin/comment,
  contact/enquiry, shop, package, or browser-automation behavior is changed.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/forms/ContactEnquiryNotice.test.tsx __tests__/unit/forms/contactFormProductContext.test.tsx __tests__/unit/commentActionAccessibility.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/publicBrowsingClientErrorStates.test.tsx __tests__/unit/adminArchiveEntryPoints.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts
npm run build
git diff --check
```

Use targeted source searches for `useGlobalFeatures`, `useLanguage`,
`TranslatedContent`, `SessionProvider`, `next/dynamic`, `@headlessui/react`,
`.next/static/chunks/app/layout-*.js`, and the relevant public route first-load
rows.

## Handoff Notes

- Finding: F-115.
- Related finding: F-111.
- Risk: R-012.
- Depends on: T-253.
- T-253 selected this as the next runtime task because it keeps session and
  modal ownership global while removing unused root-provider state and deferring
  the modal dialog implementation until user intent.
- Completed on 2026-05-24. `GlobalFeaturesProvider` is now modal-only while
  preserving the `useGlobalFeatures()` compatibility hook and existing
  `openModal(content, onClose)`, `closeModal()`, and `setModalContent(...)`
  behavior.
- `TranslatedContent` now owns its deferred `useLanguage()` state directly, so
  the active root modal provider path no longer carries unused language state.
- The root-mounted `Modal` is now a small intent-gated host. It lazy-loads
  `ModalDialog` through `React.lazy`/`Suspense` only after modal intent, and
  `ModalDialog` owns the `@headlessui/react` dialog/panel/transition imports.
- Build evidence: `.next/static/chunks/app/layout-b0c26cf58907374a.js` is
  `27,498` bytes uncompressed versus the T-236 `27,772` byte baseline. The
  modal dialog presentation is split to `.next/static/chunks/1053...js`, and
  targeted search found no `@headlessui/react`, `DialogPanel`, modal transition
  class, or modal overlay strings in the root layout chunk. The task did not
  reach the aspirational `26,000` byte target because the remaining root layout
  chunk is dominated by existing root/header client code outside this task's
  ownership, not retained modal dialog code.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/modalProviderLazyHost.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/forms/ContactEnquiryNotice.test.tsx __tests__/unit/forms/contactFormProductContext.test.tsx __tests__/unit/commentActionAccessibility.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/publicBrowsingClientErrorStates.test.tsx __tests__/unit/adminArchiveEntryPoints.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts`,
  `npm run build`, `git diff --check`, targeted source searches, and root
  layout/lazy chunk byte checks.

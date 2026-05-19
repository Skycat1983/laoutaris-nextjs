# T-131 Remove Account User Client Console Errors

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining non-admin account/user client `console.error()` slice
without adding a monitoring provider or changing visible contact, comment,
logout, account navigation, owner comment action, or client error-boundary
behavior.

## Context

- T-130 completed the first public browsing client console-error cleanup slice.
- The remaining non-route inventory is now concentrated in admin dashboard
  clients, low-value utilities/helpers, shared fetcher/client reporting, and a
  smaller account/user client slice.
- This task handles the smaller account/user slice before the larger admin
  dashboard cleanup:
  - `src/components/modules/forms/user/ContactForm.tsx`
  - `src/components/modules/forms/user/CommentForm.tsx`
  - `src/components/modules/forms/user/LogoutForm.tsx`
  - `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
  - `src/components/modules/cards/CommentCard.tsx`
  - `src/components/modules/error/ErrorBoundary.tsx`
- These components already have user-visible form state, button state, modals,
  or fallback UI. Do not introduce a browser reporting abstraction until the
  monitoring/client-reporting decision is approved.

## Scope

In scope:

- Remove direct `console.error()` calls from the scoped account/user client
  files.
- Preserve:
  - contact enquiry submit success/failure modal behavior and form reset
    behavior;
  - comment form submit/reset behavior;
  - logout loading state, modal behavior, and account redirect behavior;
  - account nav dropdown session-aware disabled/sign-in/sign-out behavior;
  - comment-card owner edit/delete loading state, callbacks, and failure
    modals;
  - error-boundary fallback behavior on window error events.
- Add focused source-hygiene coverage for the scoped files.
- Add or update focused behavior tests where removing console output could
  accidentally swallow existing user-visible state or callbacks.
- Update related workstream, task, risk, and finding docs after completion.

Out of scope:

- Do not implement a monitoring provider, client reporting SDK, or generic
  browser reporting wrapper.
- Do not change admin dashboard clients, shared `createFetcher()`, utility or
  helper warnings, public browsing clients already handled by T-130, API route
  contracts, server actions, auth/session internals, or form validation schemas.
- Do not log raw form values, comments, session data, user IDs, API response
  bodies, or caught errors from browser code.

## Likely Files

- `src/components/modules/forms/user/ContactForm.tsx`
- `src/components/modules/forms/user/CommentForm.tsx`
- `src/components/modules/forms/user/LogoutForm.tsx`
- `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
- `src/components/modules/cards/CommentCard.tsx`
- `src/components/modules/error/ErrorBoundary.tsx`
- `__tests__/unit/observability/`
- Existing or new focused component behavior tests under `__tests__/unit/`
- Related docs under `docs/`

## Acceptance Criteria

- The scoped account/user client files contain no direct `console.error()` or
  `console.warn()` calls.
- Existing user-visible success/failure UI, fallback UI, loading state,
  callbacks, and navigation behavior are preserved.
- No raw form values, comments, session data, user identifiers, API response
  bodies, or caught errors are logged from the scoped browser code.
- Focused source-hygiene coverage guards the scoped file list.
- Related tracking docs record remaining non-route logging cleanup categories:
  admin dashboard clients, shared fetcher/client reporting, and utility/helper
  warnings.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/components/modules/forms/user/ContactForm.tsx src/components/modules/forms/user/CommentForm.tsx src/components/modules/forms/user/LogoutForm.tsx src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx src/components/modules/cards/CommentCard.tsx src/components/modules/error/ErrorBoundary.tsx
npm test -- --runTestsByPath __tests__/unit/security/renderSourceHygiene.test.ts
git diff --check
```

Run any new or existing focused tests added for contact, comment, logout,
account nav, comment-card, or error-boundary behavior if touched beyond
source-hygiene cleanup.

## Handoff Notes

- Planned on 2026-05-18 after T-130 completed the public browsing client
  console-error cleanup slice.
- Completed on 2026-05-18 by removing direct browser `console.error()` calls
  from the scoped contact/comment/logout/account-nav/comment-card/error-boundary
  files without adding a monitoring provider or changing visible failure state.
- Added
  `__tests__/unit/observability/accountUserClientLoggingSourceHygiene.test.ts`
  and `__tests__/unit/accountUserClientErrorStates.test.tsx`.
- Remaining non-route logging cleanup categories are admin dashboard clients,
  shared fetcher/client reporting, and utility/helper warnings.
- Verification passed:
  `rg -n "console\\.(error|warn)\\(" ...scoped files`,
  `npm test -- --runTestsByPath __tests__/unit/observability/accountUserClientLoggingSourceHygiene.test.ts __tests__/unit/accountUserClientErrorStates.test.tsx`,
  `npm test -- --runTestsByPath __tests__/unit/security/renderSourceHygiene.test.ts`,
  `npm test -- --runTestsByPath __tests__/unit/forms/contactFormProductContext.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/commentActionAccessibility.test.tsx`,
  and `git diff --check`.

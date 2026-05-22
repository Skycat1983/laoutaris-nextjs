# T-215 Add Account Privacy Acknowledgement And Manual Request Handoff

Status: Completed

Workstream:
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Mitigate the next high-risk R-018/F-074 account compliance gap by requiring
owner-approved privacy/terms acknowledgement for account creation and replacing
the inert delete-account control with a manual privacy request handoff.

## Context

- T-212 recorded owner approval for account privacy acknowledgement and manual
  privacy request handling before self-service delete/export.
- T-213 added `/privacy` and `/terms`.
- T-214 completed newsletter consent/source/unsubscribe and left account flows
  separate.
- A-020/F-074 found credentials signup collects email/password/username with no
  terms/privacy acknowledgement, OAuth profile persistence exists, and the
  visible delete-account button is inert while deletion is admin-only.
- Current account UI includes `SignUpForm`, `SignInForm`, account nav links to
  NextAuth sign-in, and `LogoutForm` with a `Delete Account` button that has no
  handler.

## Scope

In scope:

- Add owner-approved privacy/terms acknowledgement copy with links to
  `/privacy` and `/terms` on credentials signup.
- Require acknowledgement before credentials registration succeeds.
- Persist account acknowledgement metadata for new credentials users, including
  privacy version, terms version, accepted timestamp, and source surface.
- Add a visible acknowledgement notice to app-controlled OAuth/provider sign-in
  entry points. If the current `/api/auth/signin` default provider page is still
  reachable, replace it with an app-owned sign-in page or otherwise ensure
  OAuth continuation presents the same privacy/terms notice before provider
  sign-in.
- Persist acknowledgement metadata for new OAuth-created users through the
  adapter path, using an OAuth-specific source surface, without changing role,
  watchlist, favourites, or session behavior.
- Replace the inert account delete button with a manual privacy request
  handoff to hlaoutaris@gmail.com, covering delete, export, and correction
  requests without performing self-service deletion/export.
- Add focused coverage for credentials acknowledgement validation, persisted
  credentials metadata, OAuth adapter-created metadata, sign-in/sign-up notice
  rendering, and manual privacy request UI.
- Update this task handoff and list candidate shared-tracker updates.

Out of scope:

- Do not implement self-service account deletion, data export, correction
  workflow persistence, admin fulfilment queues, or deletion cascades.
- Do not change credentials password validation, credentials sign-in semantics,
  role propagation, session shape, middleware behavior, saved artwork behavior,
  comment behavior, or account navigation semantics beyond the approved
  notices/manual request handoff.
- Do not add newsletter, comment, contact/enquiry, Shopify policy URL, social
  URL, or jurisdiction-specific legal work.
- Do not inspect production users or record private user data in docs, tests,
  logs, or public responses.

## Concurrency

Run this task alone with other work touching auth forms, registration actions,
user model/adapter fields, account settings/logout UI, NextAuth sign-in page
configuration, or auth/account tests.

Owned files:

- `src/components/modules/forms/user/SignUpForm.tsx`
- `src/components/modules/forms/user/SignInForm.tsx` or app-owned sign-in
  route files selected by the implementation
- `src/components/modules/forms/user/LogoutForm.tsx`
- `src/lib/actions/processRegistration.ts`
- `src/lib/actions/registerUser.ts`
- `src/lib/data/models/userModel.ts`
- `src/lib/db/adapter.ts`
- focused auth/account tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/modules/forms/user/SignUpForm.tsx`
- `src/components/modules/forms/user/SignInForm.tsx`
- `src/components/modules/forms/user/LogoutForm.tsx`
- `src/lib/actions/processRegistration.ts`
- `src/lib/actions/registerUser.ts`
- `src/lib/data/models/userModel.ts`
- `src/lib/db/adapter.ts`
- `src/lib/config/authOptions.ts`
- optional app-owned sign-in page file(s)
- focused auth/account tests
- `docs/tasks/T-215-add-account-privacy-acknowledgement-manual-request.md`

## Acceptance Criteria

- Credentials signup visibly links to `/privacy` and `/terms` and requires
  acknowledgement before `processRegistration` registers a user.
- Successful credentials registration persists owner-approved privacy/terms
  acknowledgement metadata without changing existing email/password/username
  validation or duplicate/auth error behavior.
- OAuth/provider sign-in entry points visible from the app present a
  privacy/terms acknowledgement notice before provider continuation.
- New OAuth-created users persist acknowledgement metadata through the adapter
  path while preserving existing `username`, `role`, `watchlist`, `favourites`,
  `createdAt`, and `updatedAt` defaults.
- The account delete control is no longer inert; it provides a clear manual
  privacy request handoff to hlaoutaris@gmail.com for delete/export/correction
  requests and does not perform self-service deletion/export.
- No private account data, credentials, OAuth profile payloads, or policy
  acknowledgement metadata values are logged or exposed in public errors.
- Focused tests cover the changed auth/account behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/actions/processRegistration.test.ts __tests__/unit/actions/registerUser.test.ts __tests__/unit/db/dbHelpers.test.ts __tests__/unit/forms/SignUpFormPrivacy.test.tsx __tests__/unit/forms/AuthProviderSignInButtons.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/middleware.test.ts __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts
npm run lint
npm run build
git diff --check
```

## Agent Prompt

You are working on T-215. Read `AGENTS.md`, `docs/README.md`, F-074 in
`docs/audits/findings-register.md`, R-018 in
`docs/risks/production-readiness.md`,
`docs/prototypes/compliance-owner-decision-packet.md`, T-213 for the completed
privacy/terms routes, T-214 for the completed newsletter consent slice, and the
auth/frontend/data/deployment/testing workstreams. Implement owner-approved
account privacy/terms acknowledgement for credentials signup and OAuth/provider
entry, persist acknowledgement metadata for new users, and replace the inert
delete-account control with a manual privacy request handoff to
hlaoutaris@gmail.com. Keep the scope limited to account acknowledgement and
manual request handoff. Do not implement self-service deletion/export,
admin fulfilment queues, newsletter/comment/contact/Shopify policy work,
social URLs, jurisdiction-specific claims, or private user-data inspection.
Run the verification commands, add focused auth/account coverage, then update
this handoff with what changed and list candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-214 completed newsletter
  consent/source metadata and unsubscribe behavior.
- This is the next high-risk R-018/F-074 slice. It should address account
  acknowledgement and manual privacy request handoff only; self-service account
  privacy actions and broader retention/deletion workflows remain separate.
- Completed on 2026-05-22 by adding account privacy/terms acknowledgement
  constants and metadata helpers using the 2026-05-22 owner approval v1 policy
  versions.
- Credentials signup now renders a required acknowledgement checkbox with
  `/privacy` and `/terms` links. `processRegistration` blocks registration when
  acknowledgement is missing and passes acknowledgement metadata to
  `registerUser`; `registerUser` persists it on new credentials users.
- `UserModel` now accepts optional `accountPrivacyAcknowledgement` metadata for
  new users while keeping historical users valid. `CustomMongoDBAdapter`
  persists OAuth-specific acknowledgement metadata for new provider-created
  users while preserving existing adapter defaults for username, role,
  watchlist, favourites, and timestamps.
- Added an app-owned `/sign-in` route and configured NextAuth to use it as the
  sign-in page. The route includes provider sign-in controls with a visible
  privacy/terms notice before continuing to GitHub or Google. Protected
  frontend redirects, account navigation links, mobile navigation links, and the
  public smoke sign-in shell now target `/sign-in`.
- Replaced the inert account `Delete Account` button with an email handoff to
  hlaoutaris@gmail.com for deletion, export, and correction requests. The UI
  explicitly states that the control does not perform self-service deletion or
  export.
- Added focused coverage in
  `__tests__/unit/actions/processRegistration.test.ts`,
  `__tests__/unit/actions/registerUser.test.ts`,
  `__tests__/unit/forms/SignUpFormPrivacy.test.tsx`,
  `__tests__/unit/forms/AuthProviderSignInButtons.test.tsx`, updated
  `__tests__/unit/db/dbHelpers.test.ts`,
  `__tests__/unit/accountUserClientErrorStates.test.tsx`,
  `__tests__/unit/navigationRelativeUrls.test.tsx`,
  `__tests__/unit/middleware.test.ts`, and
  `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/actions/processRegistration.test.ts __tests__/unit/actions/registerUser.test.ts __tests__/unit/db/dbHelpers.test.ts __tests__/unit/forms/SignUpFormPrivacy.test.tsx __tests__/unit/forms/AuthProviderSignInButtons.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/middleware.test.ts __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`,
  `npm run lint`, `npm run build`, and `git diff --check`. The focused Jest run
  emitted the existing dependency `punycode` deprecation warning.

Candidate shared-tracker updates for orchestration:

- `docs/tasks/README.md`: mark T-215 Completed with the account
  acknowledgement, app-owned sign-in notice, OAuth metadata, and manual privacy
  request handoff summary.
- `docs/audits/findings-register.md`: update F-074 from Converted to resolved
  or mitigated for account signup/OAuth acknowledgement and the manual
  delete/export/correction request handoff.
- `docs/risks/production-readiness.md`: update R-018 to record T-215
  completion while keeping comment posting/moderation notice,
  contact/enquiry retention notice, Shopify policy target URLs, real social
  URLs, jurisdiction/audience input, and future self-service privacy workflows
  open.
- `docs/workstreams/auth-admin-and-permissions.md`: record required
  credentials acknowledgement, OAuth adapter metadata, `/sign-in`, and manual
  privacy request handoff as complete for this slice.
- `docs/workstreams/frontend-routes-and-components.md`: record the credentials
  signup acknowledgement UI, OAuth provider notice, account navigation target
  changes, and manual privacy request UI.
- `docs/workstreams/data-models-and-api.md`: record the optional user
  acknowledgement metadata schema and new-user persistence behavior.
- `docs/workstreams/deployment-security-and-observability.md`: record the
  public-safe manual request handoff and app-owned sign-in redirect/smoke
  target.
- `docs/workstreams/testing-and-quality.md`: record the focused registration,
  adapter, sign-up/provider UI, account privacy handoff, middleware, navigation,
  and smoke coverage added for T-215.

Orchestrator reconciliation:

- Reconciled on 2026-05-22 after completion. Shared trackers now mark T-215
  complete, F-074 partially mitigated, and R-018 still open for comments,
  contact/enquiry, Shopify policy target URLs, real social URLs, jurisdiction
  or audience-specific legal claims, and future self-service privacy workflows.
- Prepared T-216 as the next R-018 slice for public comment posting notice and
  manual moderation/removal request handoff.

# T-214 Add Newsletter Consent Source And Unsubscribe

Status: Completed

Workstream:
[Data Models And API](../workstreams/data-models-and-api.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Mitigate the next high-risk R-018/F-073 newsletter compliance gap by requiring
approved newsletter consent, storing consent/source metadata for new
subscribers, and adding a public unsubscribe path.

## Context

- T-212 recorded owner approval for newsletter consent/source/unsubscribe
  implementation scoping.
- T-213 added `/privacy`, `/terms`, and footer legal links, so newsletter form
  copy can now link to approved policy routes.
- A-020/F-073 found that newsletter submission currently persists email only.
  `SubscriberModel` has `unsubscribed`, but no consent text version, source
  metadata, unsubscribe token, endpoint, or UI.
- `SubscribeForm` posts to `submitSubscription` through `useFormState`.
- Current subscriber tests live in
  `__tests__/unit/actions/submitSubscription.test.ts`.
- Do not add newsletter sender integration, email delivery, historical
  subscriber backfill, or private subscriber data inspection.

## Scope

In scope:

- Add owner-approved newsletter consent copy near `SubscribeForm`, with links
  to `/privacy` and `/terms`.
- Require an explicit consent control before subscription submission succeeds.
- Store consent/source metadata for new subscriber records, including an
  implementation-owned consent text/version constant, consent acceptance time,
  source path, and unsubscribe token or equivalent public unsubscribe
  identifier.
- Keep existing email validation, normalization, duplicate handling, and
  public-safe failure messages.
- Add a public unsubscribe route/page/process that marks a subscriber
  unsubscribed using the generated identifier without exposing private
  subscriber data.
- Add focused coverage for validation, persisted metadata, duplicate behavior,
  unsubscribe success, invalid unsubscribe input, and source hygiene so logs do
  not contain subscriber emails, tokens, or private data.
- Update this task handoff and list candidate shared-tracker updates.

Out of scope:

- Do not send newsletter emails or integrate an email service.
- Do not backfill historical subscriber records or inspect production
  subscriber data.
- Do not add account privacy request flows, signup/OAuth acknowledgement
  storage, comment notices, contact/enquiry notices, Shopify policy URLs, social
  URLs, or jurisdiction-specific legal claims.
- Do not record IP addresses, user agents, cookies, or analytics identifiers
  unless a separate owner/legal decision explicitly approves that data.
- Do not expose unsubscribe tokens or subscriber emails in logs, UI, tests, or
  docs beyond safe placeholders.

## Concurrency

Run this task alone with other work touching subscriber schema/model/action,
subscription UI, unsubscribe routes, or subscription tests.

Owned files:

- `src/lib/data/models/subscribersModel.ts`
- `src/lib/data/schemas/subscriberSchema.ts`
- `src/lib/data/types/subscriberTypes.ts`
- `src/lib/actions/submitSubscription.ts`
- `src/components/modules/forms/user/SubscribeForm.tsx`
- unsubscribe route/page files selected by the implementation
- focused subscription/unsubscribe tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/lib/data/models/subscribersModel.ts`
- `src/lib/data/schemas/subscriberSchema.ts`
- `src/lib/data/types/subscriberTypes.ts`
- `src/lib/actions/submitSubscription.ts`
- `src/components/modules/forms/user/SubscribeForm.tsx`
- new unsubscribe route/page file(s)
- `__tests__/unit/actions/submitSubscription.test.ts`
- focused unsubscribe route/page test(s)
- `docs/tasks/T-214-add-newsletter-consent-source-unsubscribe.md`

## Acceptance Criteria

- Newsletter form visibly explains the approved newsletter consent scope and
  links to `/privacy` and `/terms`.
- Subscription submission fails with a stable public validation message when
  explicit consent is missing.
- New subscriber records persist normalized email, `unsubscribed: false`,
  consent version/text source, consent acceptance timestamp, source path, and a
  public unsubscribe identifier.
- Duplicate subscriber behavior remains stable and does not create additional
  records.
- Public unsubscribe behavior marks the matching subscriber unsubscribed and
  handles missing/invalid/unknown identifiers with public-safe output.
- No subscriber email, unsubscribe token, or private submission data appears in
  logs, test names, docs, or public error responses beyond safe placeholders.
- Existing subscription validation and logging tests remain covered.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/actions/submitSubscription.test.ts
npm run lint
npm run build
git diff --check
```

Add any focused unsubscribe route/page test command used by the implementation
before handoff.

## Agent Prompt

You are working on T-214. Read `AGENTS.md`, `docs/README.md`, F-073 in
`docs/audits/findings-register.md`, R-018 in
`docs/risks/production-readiness.md`,
`docs/prototypes/compliance-owner-decision-packet.md`, T-213 for the completed
privacy/terms route slice, and the data/frontend/deployment/testing
workstreams. Implement owner-approved newsletter consent/source metadata and a
public unsubscribe path. Keep the scope limited to newsletter subscription and
unsubscribe. Do not add email sender integration, historical subscriber
backfill, account privacy flows, signup/OAuth acknowledgement storage, comment
notices, contact/enquiry notices, Shopify policy URLs, social URLs,
jurisdiction-specific claims, or private subscriber-data inspection. Run the
verification commands, add focused unsubscribe coverage, then update this
handoff with what changed and list candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-213 completed public
  privacy/terms routes and footer legal links.
- This is the next high-risk R-018/F-073 slice because it addresses newsletter
  consent/source metadata and unsubscribe behavior without touching account,
  comment, contact, or commerce policy workflows.
- Completed on 2026-05-22 by adding explicit newsletter consent to
  `SubscribeForm`, linking the consent copy to `/privacy` and `/terms`, and
  submitting the route-local source path through a hidden form field.
- `submitSubscription` now requires consent, preserves existing email
  validation/normalization and duplicate behavior, stores consent
  version/text/source metadata, consent acceptance time, sanitized source path,
  `unsubscribed: false`, `unsubscribedAt: null`, and a generated public
  unsubscribe identifier for new subscriber records.
- Added `/newsletter/unsubscribe` with a public-safe unsubscribe form. The
  unsubscribe action validates the public identifier, marks matching subscriber
  records unsubscribed, records `unsubscribedAt`, and returns the same
  public-safe invalid/expired message for missing, malformed, or unknown
  identifiers.
- Added focused coverage in
  `__tests__/unit/actions/submitSubscription.test.ts`,
  `__tests__/unit/forms/SubscribeFormConsent.test.tsx`, and
  `__tests__/unit/pages/NewsletterUnsubscribePage.test.tsx` for missing
  consent, persisted consent/source metadata, duplicate stability, source path
  hygiene, unsubscribe success, invalid/unknown unsubscribe input, public-safe
  failure messages, and redacted logging.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/actions/submitSubscription.test.ts __tests__/unit/pages/NewsletterUnsubscribePage.test.tsx __tests__/unit/forms/SubscribeFormConsent.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check`.

Candidate shared-tracker updates for orchestration:

- `docs/tasks/README.md`: mark T-214 Completed with a summary of newsletter
  consent/source metadata and public unsubscribe behavior.
- `docs/audits/findings-register.md`: update F-073 from Converted to resolved
  or mitigated for the newsletter consent/source/unsubscribe scope.
- `docs/risks/production-readiness.md`: update R-018 to record T-214
  completion while keeping account privacy, contact/comment notices, Shopify
  policy URLs, real social URLs, and jurisdiction/audience follow-ups open.
- `docs/workstreams/data-models-and-api.md`: record subscriber consent/source
  fields, generated public unsubscribe identifiers, and unsubscribe action
  behavior as complete.
- `docs/workstreams/frontend-routes-and-components.md`: record newsletter form
  consent copy/links and `/newsletter/unsubscribe` as complete.
- `docs/workstreams/deployment-security-and-observability.md`: record the
  public-safe unsubscribe logging behavior and note that broader compliance
  workflows remain separate.
- `docs/workstreams/testing-and-quality.md`: record the focused subscription,
  unsubscribe, page, and form coverage added for T-214.
- Orchestrator reconciliation completed on 2026-05-22: shared finding, risk,
  orchestration, task-index, and workstream trackers now mark T-214 complete;
  F-073 is resolved; and T-215 is prepared as the next account
  acknowledgement/manual privacy request handoff slice.

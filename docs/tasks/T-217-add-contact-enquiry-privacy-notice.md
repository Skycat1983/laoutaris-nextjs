# T-217 Add Contact Enquiry Privacy Notice

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Mitigate the remaining R-018/F-076 contact compliance gap by adding
owner-approved privacy and retention notice copy to contact/product enquiry
surfaces without changing enquiry persistence or operator workflows.

## Context

- T-100 preserved normalized Shopify product handles in `/project/contact`
  enquiry submissions.
- T-213 added public `/privacy` and `/terms`.
- T-214, T-215, and T-216 completed newsletter, account, and comment notice
  slices. Do not revisit those flows.
- A-020/F-076 found contact and product enquiry flows collect personal data
  without a visible privacy/retention notice. Product context persistence is
  already partially mitigated by T-100.
- Current active contact surfaces include `ContactForm` on `/project/contact`,
  including product enquiry prefill from `?product=...`. `EnquiryForm` is also
  available from artwork information tabs and posts through the same public
  enquiry API.

## Scope

In scope:

- Add visible owner-approved privacy/retention notice copy to active contact
  and enquiry forms that submit to the public enquiry API.
- Link the notice to `/privacy` and `/terms`.
- State that submitted name, email, subject/message, and any product or artwork
  context are used to respond to the enquiry.
- Include the manual privacy/legal contact handoff to hlaoutaris@gmail.com for
  questions, correction, or deletion requests.
- Preserve existing contact/enquiry validation, submit payloads, product handle
  preservation, success/error modal behavior, and draft retry behavior.
- Add focused coverage for the visible notice, policy links, owner contact
  email, product-context wording, and preserved submit payload.
- Update this task handoff and list candidate shared-tracker updates.

Out of scope:

- Do not add stored notice-version fields, retention timestamps, request
  persistence, operator/admin display changes, email delivery changes, schema
  or API route changes, deletion automation, or response-time promises.
- Do not change newsletter, account, comment, Shopify policy URL, social URL,
  or jurisdiction-specific legal behavior.
- Do not inspect production enquiries, users, emails, comments, or private
  account data.

## Concurrency

Run this task alone with other work touching contact/enquiry forms, public
enquiry API/client behavior, product enquiry handoff copy, or contact-form
tests.

Owned files:

- `src/components/modules/forms/user/ContactForm.tsx`
- `src/components/modules/forms/user/EnquiryForm.tsx` if it is currently
  rendered and submits to the public enquiry API
- focused contact/enquiry form tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/modules/forms/user/ContactForm.tsx`
- `src/components/modules/forms/user/EnquiryForm.tsx`
- `__tests__/unit/forms/ContactEnquiryNotice.test.tsx` or an existing focused
  contact-form test if one is more appropriate
- `__tests__/unit/forms/contactFormProductContext.test.tsx`
- `__tests__/unit/accountUserClientErrorStates.test.tsx`
- `docs/tasks/T-217-add-contact-enquiry-privacy-notice.md`

## Acceptance Criteria

- Contact/product enquiry UI includes visible privacy/retention notice copy.
- Artwork enquiry UI includes the same notice if the active form is currently
  rendered from artwork information tabs.
- The notice links to `/privacy` and `/terms`.
- The notice states that submitted contact details, message content, and any
  product or artwork context are used to respond to the enquiry.
- The notice provides a manual privacy/legal handoff to hlaoutaris@gmail.com
  without promising response timing, deletion automation, or self-service
  workflows.
- Existing product handle normalization/preservation, form validation, submit
  payload shape, success/error modal behavior, and failed-request draft retry
  behavior are preserved.
- Focused tests cover the notice and guard against breaking the current contact
  submit contract.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/ContactEnquiryNotice.test.tsx __tests__/unit/forms/contactFormProductContext.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx
npm run lint
npm run build
git diff --check
```

If an existing test path is reused instead of
`__tests__/unit/forms/ContactEnquiryNotice.test.tsx`, update this verification
section in the handoff with the exact command that passed.

Completed on 2026-05-22.

## Agent Prompt

You are working on T-217. Read `AGENTS.md`, `docs/README.md`, F-076 in
`docs/audits/findings-register.md`, R-018 in
`docs/risks/production-readiness.md`,
`docs/prototypes/compliance-owner-decision-packet.md`, T-100 for product
enquiry context preservation, T-213 for the completed privacy/terms routes,
and T-214 through T-216 for completed newsletter/account/comment compliance
slices. Add the owner-approved contact/product enquiry privacy and retention
notice near active contact/enquiry form submit surfaces. Preserve existing
validation, submit payloads, product handle context, modal behavior, and draft
retry behavior. Do not add stored notice fields, schema/API changes,
operator/admin workflows, retention automation, email delivery changes,
newsletter/account/comment/Shopify/social work, or jurisdiction-specific legal
claims. Run focused tests plus lint, build, and `git diff --check`, then
update this handoff with what changed and list candidate shared-tracker
updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-216 completed public
  comment posting notice and manual moderation/removal/correction handoff.
- This is the next R-018/F-076 slice. It should add notice and manual privacy
  handoff only; enquiry schema changes, retained notice metadata, operator
  display changes, request persistence, and retention automation remain
  separate.
- Completed on 2026-05-22 by adding a shared contact/enquiry privacy notice
  component and rendering it near the submit controls in `ContactForm` and the
  active artwork `EnquiryForm`.
- The notice states that submitted name, email, subject, message, and any
  product or artwork context are used to respond to the enquiry and manage the
  manual enquiry record. It links to `/privacy` and `/terms` and provides
  `hlaoutaris@gmail.com` for privacy or legal questions, correction, or
  deletion requests.
- Existing contact and artwork enquiry validation, submit payloads, product
  handle preservation, success/error modal behavior, contact reset-after-API
  response behavior, and failed-request draft retry behavior were preserved.
- Added focused coverage in
  `__tests__/unit/forms/ContactEnquiryNotice.test.tsx` for the contact and
  artwork enquiry notice, policy links, manual email handoff, product/artwork
  context wording, and preserved contact/artwork submit payloads.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/forms/ContactEnquiryNotice.test.tsx __tests__/unit/forms/contactFormProductContext.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check`. Jest emitted the
  existing dependency `punycode` deprecation warning.

Candidate shared-tracker updates for orchestration:

- `docs/tasks/README.md`: mark T-217 Completed with the contact/product and
  artwork enquiry privacy notice summary.
- `docs/audits/findings-register.md`: update F-076 from partially mitigated to
  resolved or mitigated for the visible notice/manual handoff slice while
  keeping stored notice metadata, operator workflow changes, and retention
  automation separate.
- `docs/risks/production-readiness.md`: update R-018 to record T-217
  completion while keeping Shopify policy target URLs, real social URLs,
  future self-service privacy workflows, future comment moderation/reporting
  workflows if desired, and jurisdiction/audience-specific legal claims open.
- `docs/workstreams/frontend-routes-and-components.md`: record the shared
  contact/artwork enquiry privacy notice, policy links, and manual email
  handoff.
- `docs/workstreams/data-models-and-api.md`: note that T-217 made no enquiry
  schema, API, persistence, stored notice metadata, or operator workflow
  changes.
- `docs/workstreams/deployment-security-and-observability.md`: record the
  manual contact/enquiry privacy/legal handoff under R-018 compliance.
- `docs/workstreams/testing-and-quality.md`: record the focused
  `ContactEnquiryNotice.test.tsx` coverage and adjacent product-context/client
  error-state verification.

Orchestrator reconciliation:

- Reconciled on 2026-05-22 after completion. Shared trackers now mark T-217
  complete, F-076 resolved for the visible notice/product-context scope, and
  R-018 still open for footer placeholder social cleanup, Shopify policy target
  URLs, real social URLs, future self-service privacy workflows, future comment
  moderation/reporting workflows if desired, and jurisdiction or
  audience-specific legal claims.
- Prepared T-218 as the next decision-light R-018/F-104 slice for removing
  footer `href="#"` social placeholders and refreshing stale copyright text
  without inventing real social URLs.

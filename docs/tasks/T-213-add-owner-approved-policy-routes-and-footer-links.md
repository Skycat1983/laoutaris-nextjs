# T-213 Add Owner Approved Policy Routes And Footer Links

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the first owner-approved R-018 runtime compliance slice by adding
public privacy and terms routes plus footer legal links, using only the
approved owner identity/contact and current factual app behavior.

## Context

- T-212 prepared the compliance owner decision packet and the owner approved
  its recommendations on 2026-05-22.
- Heron Laoutaris is the developer and owner of the artwork/gallery content.
- hlaoutaris@gmail.com is the approved legal/privacy contact recipient.
- Owner approval v1 is effective for implementation scoping on 2026-05-22.
- The approved first runtime slice is:
  - `/privacy`;
  - `/terms`;
  - cookie/session/third-party disclosure within `/privacy` unless a later
    task explicitly splits it;
  - footer links to approved legal routes.
- Launch jurisdiction/audience assumptions, final legal copy beyond factual
  owner-approved implementation copy, Shopify-hosted policy target URLs, and
  real social account URLs were not supplied. Do not invent them.

## Scope

In scope:

- Add a public `/privacy` route with factual, owner-approved copy covering the
  current implemented data surfaces: account registration, OAuth sign-in,
  newsletter subscription, contact/product enquiries, comments, saved artwork
  lists, admin-managed user/comment records, NextAuth sessions, Cloudinary,
  Shopify product data and hosted purchase handoff, and YouTube embeds.
- Add a public `/terms` route with factual, owner-approved copy that describes
  archive use, account/comment expectations, artwork/content ownership, and the
  Shopify-hosted purchase boundary without adding payment, shipping, refund,
  guarantee, or buyer-protection promises.
- Use Heron Laoutaris and hlaoutaris@gmail.com as the legal/privacy contact
  owner on the pages.
- Display the owner approval version/effective date in a restrained way, using
  2026-05-22 / owner approval v1.
- Add footer links to `/privacy` and `/terms` using the existing footer
  component/pattern.
- Add focused tests or source checks for route rendering and footer links using
  the repo's existing test patterns.
- Update this task handoff and list candidate shared-tracker updates.

Out of scope:

- Do not add jurisdiction-specific legal claims or audience assumptions.
- Do not add a separate `/cookies` route unless existing app conventions make
  that safer and the privacy page still links to it.
- Do not add newsletter consent fields, unsubscribe tokens/routes, account
  privacy request flows, signup/OAuth acknowledgement storage, comment
  moderation workflows, contact/enquiry retention fields, admin display changes,
  app-owned checkout/cart, Shopify policy URL wiring, or real social URLs.
- Do not change Shopify product detail purchase behavior, search result copy,
  shared commerce banners, payment/shipping/refund wording, or buyer-protection
  claims.
- Do not record private customer, subscriber, enquiry, user, or comment data in
  code or docs.

## Concurrency

Run this task alone with other work touching public layout/footer components,
policy routes, shared legal copy, or public route tests.

Owned files:

- new privacy/terms route files selected by the implementation;
- the existing footer component/pattern;
- focused route/footer tests;
- this task brief handoff section.

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- the current footer component or layout file after inspection
- focused page/footer tests following existing patterns
- `docs/tasks/T-213-add-owner-approved-policy-routes-and-footer-links.md`

## Acceptance Criteria

- `/privacy` renders without authentication and identifies Heron Laoutaris and
  hlaoutaris@gmail.com as the owner/legal/privacy contact.
- `/privacy` factually covers the current data, cookie/session, OAuth,
  Cloudinary, Shopify, and YouTube surfaces without jurisdiction-specific legal
  claims.
- `/terms` renders without authentication and factually covers archive use,
  account/comment expectations, content ownership, and the Shopify-hosted
  purchase boundary.
- Footer legal links route to `/privacy` and `/terms`.
- No placeholder social links, Shopify policy URLs, consent flows,
  unsubscribe/account privacy behavior, app-owned checkout/cart, or commerce
  assurance claims are added.
- Focused verification covers the new routes and footer link presence.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PolicyPages.test.tsx
npm run lint
npm run build
git diff --check
```

Completed on 2026-05-22.

## Agent Prompt

You are working on T-213. Read `AGENTS.md`, `docs/README.md`, R-018 in
`docs/risks/production-readiness.md`,
`docs/prototypes/compliance-owner-decision-packet.md`, and the deployment/
frontend/testing workstreams. Implement the first owner-approved compliance
runtime slice by adding `/privacy`, `/terms`, and footer links using Heron
Laoutaris and hlaoutaris@gmail.com as the approved owner/contact details. Keep
copy factual and based on current implemented behavior. Do not add
jurisdiction-specific claims, Shopify policy URLs, social URLs, consent fields,
unsubscribe/account privacy flows, comment moderation workflows, contact
retention fields, app-owned checkout/cart, or commerce assurance claims. Run
the verification commands, add focused route/footer coverage, then update this
handoff with what changed and list candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after the T-212 owner approval
  response was recorded.
- This is the first runtime compliance slice after owner approval. It
  intentionally handles only public policy routes and footer links; data,
  consent, unsubscribe, account, comment, contact, Shopify policy URL, and
  social-link work remain separate.
- Completed on 2026-05-22 by adding public `/privacy` and `/terms` App Router
  pages with route metadata, owner approval version display, Heron Laoutaris /
  hlaoutaris@gmail.com contact details, factual current-behavior privacy copy,
  cookie/session/third-party disclosure, terms/account/comment expectations,
  artwork/content ownership language, and Shopify-hosted purchase boundary
  language.
- Added footer legal links to `/privacy` and `/terms` in the existing footer
  component without adding social URLs, Shopify policy URLs, consent flows,
  unsubscribe behavior, account privacy actions, comment moderation workflows,
  app-owned checkout/cart behavior, or commerce assurance claims.
- Added focused route/footer coverage in
  `__tests__/unit/pages/PolicyPages.test.tsx` for page rendering, owner/contact
  details, approved version display, covered privacy surfaces, Shopify boundary
  copy, footer link targets, metadata, and source checks against
  jurisdiction-specific labels and unsupported commerce assurances.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PolicyPages.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check`. The build emitted
  the existing Browserslist caniuse-lite freshness notice.

Candidate shared-tracker updates for orchestration:

- `docs/tasks/README.md`: mark T-213 Completed with a summary of the new public
  policy routes and footer legal links.
- `docs/workstreams/deployment-security-and-observability.md`: record T-213 as
  completed; R-018 still has consent, unsubscribe, account privacy,
  contact/comment notices, Shopify policy URL, real social URL, and
  jurisdiction/audience follow-ups.
- `docs/workstreams/frontend-routes-and-components.md`: record T-213 footer
  legal links and public policy routes as complete while keeping form notices,
  account privacy UI, third-party consent UI, Shopify policy URLs, and social
  target cleanup separate.
- `docs/workstreams/testing-and-quality.md`: record the focused
  `PolicyPages.test.tsx` coverage for `/privacy`, `/terms`, and footer legal
  links.
- `docs/risks/production-readiness.md`: update R-018 from "T-213 prepared" to
  "T-213 completed" and keep the remaining compliance gaps listed.
- Orchestrator reconciliation completed on 2026-05-22: shared finding, risk,
  orchestration, task-index, and workstream trackers now mark T-213 complete;
  F-077 is resolved; F-072 is partially mitigated; and T-214 is prepared as the
  next newsletter consent/source/unsubscribe slice.

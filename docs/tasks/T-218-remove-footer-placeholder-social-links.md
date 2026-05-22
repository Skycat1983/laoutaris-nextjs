# T-218 Remove Footer Placeholder Social Links

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Content Assets And Admin Ops](../workstreams/content-assets-and-admin-ops.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Mitigate the remaining decision-light R-018/F-104 footer cleanup gap by
removing placeholder social links and refreshing stale copyright text without
inventing real social account URLs.

## Context

- A-018/F-104 found the footer renders Facebook/Twitter/Instagram anchors with
  `href="#"` and a fixed `© 2024` string.
- T-209 removed unsupported commerce assurance copy.
- T-213 added footer legal links to `/privacy` and `/terms`.
- T-212's owner-approved response sheet allows legal links and says social
  target wiring waits for real owner-managed social URLs. It also says to
  remove or hide placeholder social targets until real URLs are supplied.
- Real social URLs, Shopify policy target URLs, and jurisdiction/audience
  legal claims are still not supplied and must not be invented.

## Scope

In scope:

- Remove or hide the footer social-link anchors that currently point to `#`.
- Preserve footer contact information and the existing `/privacy` and `/terms`
  legal links.
- Refresh stale static copyright text so it is current-year based or otherwise
  owner-approved and no longer fixed at 2024.
- Add focused coverage or source-hygiene checks proving footer `href="#"`
  placeholder social links do not return and the footer does not render stale
  2024-only copyright text.
- Update this task handoff and list candidate shared-tracker updates.

Out of scope:

- Do not add real social links, social icons, new social route targets, or
  placeholder social copy.
- Do not add Shopify policy target URLs, sale/refund/shipping policy pages,
  checkout/cart behavior, jurisdiction-specific legal claims, newsletter,
  account, comment, or contact/enquiry behavior.
- Do not redesign the footer, security banner, global layout, or navigation
  beyond the minimal placeholder cleanup.

## Concurrency

Run this task alone with other work touching the footer, layout shell,
policy-page/footer tests, or shared security banner/footer copy.

Owned files:

- `src/components/modules/footer/Footer.tsx`
- focused footer/policy tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/modules/footer/Footer.tsx`
- `__tests__/unit/pages/PolicyPages.test.tsx` or a new focused footer test
- `docs/tasks/T-218-remove-footer-placeholder-social-links.md`

## Acceptance Criteria

- Footer no longer renders Facebook, Twitter, or Instagram anchors with
  `href="#"`.
- Footer does not introduce replacement placeholder social links or invented
  social URLs.
- Footer still renders contact details and `/privacy` plus `/terms` legal
  links.
- Footer copyright text is no longer stale/fixed to 2024.
- Focused tests or source checks cover the footer social-placeholder and
  copyright behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PolicyPages.test.tsx
npm run lint
npm run build
git diff --check
```

If a new focused footer test is created instead of reusing
`PolicyPages.test.tsx`, update this verification section in the handoff with
the exact command that passed.

## Agent Prompt

You are working on T-218. Read `AGENTS.md`, `docs/README.md`, F-104 in
`docs/audits/findings-register.md`, R-018 in
`docs/risks/production-readiness.md`,
`docs/prototypes/compliance-owner-decision-packet.md`, and T-209/T-213 for the
completed commerce copy and footer legal-link slices. Remove or hide the footer
social anchors that point to `#` and refresh the stale fixed 2024 copyright
text. Preserve footer contact details and `/privacy`/`/terms` legal links. Do
not invent social URLs, add Shopify policy URLs, redesign the footer, change
security banner copy, or touch newsletter/account/comment/contact behavior.
Run focused footer tests plus lint, build, and `git diff --check`, then update
this handoff with what changed and list candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-217 completed the
  contact/product and artwork enquiry notice slice.
- This is the next decision-light R-018/F-104 slice. It should remove the dead
  social placeholders and stale copyright only; real social URL wiring,
  Shopify policy target URLs, and jurisdiction/audience-specific legal claims
  remain blocked on owner-supplied values.
- Completed on 2026-05-22. Removed the footer's `Follow Us`
  Facebook/Twitter/Instagram placeholder anchors instead of inventing social
  targets or adding replacement placeholder copy.
- Preserved the footer contact details and existing `/privacy` plus `/terms`
  legal links.
- Replaced the fixed `© 2024` footer text with a render-time current-year
  copyright string.
- Extended `__tests__/unit/pages/PolicyPages.test.tsx` so the footer coverage
  now asserts contact/legal links remain, no `href="#"` placeholder anchor is
  rendered, Facebook/Twitter/Instagram links are absent, the current-year
  copyright renders, the stale 2024-only copyright does not render, and the
  footer source does not reintroduce placeholder social links.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PolicyPages.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check`. The focused Jest
  run emitted the existing Node `punycode` deprecation warning.

Candidate shared-tracker updates for orchestration:

- `docs/audits/findings-register.md`: mark F-104 resolved for the footer
  placeholder social-link and stale-copyright cleanup scope.
- `docs/risks/production-readiness.md`: update R-018 from "T-218 planned" to
  "T-218 completed" while keeping Shopify policy target URLs, real social
  URLs, future self-service privacy workflows, future moderation/reporting
  workflows, and jurisdiction/audience-specific legal claims as remaining
  owner-input-dependent gaps.
- `docs/tasks/README.md`: mark T-218 Completed with a short footer cleanup
  summary.
- `docs/workstreams/frontend-routes-and-components.md`: record that the footer
  no longer renders dead social placeholder links and the legal links/contact
  details remain intact.
- `docs/workstreams/content-assets-and-admin-ops.md`: record completion of the
  A-018 footer copy cleanup slice while leaving real social account ownership
  pending.
- `docs/workstreams/deployment-security-and-observability.md`: record this
  R-018 decision-light footer cleanup as complete and leave remaining legal/
  commerce targets blocked on supplied URLs or owner/legal input.
- `docs/workstreams/testing-and-quality.md`: record the expanded
  `PolicyPages.test.tsx` footer source/render coverage.

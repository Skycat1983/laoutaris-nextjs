# T-219 Record Remaining Compliance Owner Inputs

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Record the remaining R-018 owner-input blockers and recommended decisions
before assigning any further compliance runtime work.

## Context

- T-212 through T-218 completed the owner-approved, jurisdiction-neutral
  privacy/terms, footer legal link, newsletter, account acknowledgement,
  comment notice, contact/enquiry notice, and footer placeholder cleanup
  slices.
- The remaining R-018 items are not safe to implement by inference: Shopify
  policy target URLs, real social URLs, launch jurisdiction/audience
  assumptions, future account self-service privacy workflows, and future
  comment moderation/reporting workflows.
- The owner previously approved recommendations generally and identified
  Heron Laoutaris / hlaoutaris@gmail.com as owner/privacy contact, but the
  actual URLs and launch-scope values remain unsupplied.

## Scope

In scope:

- Update `docs/prototypes/compliance-owner-decision-packet.md` with a concise
  remaining-inputs section that lists each unresolved R-018 input, the
  recommended default, and the implementation implication.
- Update R-018 and relevant workstreams to show that further runtime compliance
  work is blocked on owner-supplied values or explicit opt-in decisions.
- Preserve the completed status of T-212 through T-218 and avoid reopening
  completed runtime slices.
- Add no runtime behavior.

Out of scope:

- Do not invent Shopify policy URLs, social URLs, jurisdiction/audience claims,
  self-service privacy workflows, or comment moderation/reporting workflows.
- Do not change footer, policy pages, forms, auth, comments, Shopify product
  behavior, schemas, APIs, or tests except documentation references if needed.
- Do not inspect production customer, subscriber, user, enquiry, or comment
  data.

## Recommended Owner Inputs To Record

1. Shopify policy target URLs
   - Recommendation: leave Shopify policy links absent until real Shopify
     hosted policy URLs exist.
   - Implication: the app can keep factual Shopify-hosted handoff copy, but it
     must not link to placeholder sale, shipping, return, refund, tax, or
     cancellation policy pages.

2. Real social URLs
   - Recommendation: keep footer social links hidden until owner-managed
     account URLs are supplied.
   - Implication: T-218's no-placeholder footer state remains correct; adding
     social links later is a small footer-only task once URLs are known.

3. Launch jurisdiction and audience assumptions
   - Recommendation: keep current policy copy jurisdiction-neutral until legal
     counsel or owner supplies specific launch scope.
   - Implication: do not add GDPR/CCPA/consumer-law labels, age-gated audience
     claims, tax/sale terms, or region-specific rights language yet.

4. Account self-service privacy workflows
   - Recommendation: keep the current manual hlaoutaris@gmail.com request
     path until the owner explicitly approves self-service delete/export/
     correction scope, retention rules, identity verification, and fulfilment
     process.
   - Implication: no account deletion/export automation or request queue should
     be assigned yet.

5. Comment moderation/reporting workflows
   - Recommendation: keep the current manual hlaoutaris@gmail.com moderation
     handoff until the owner explicitly approves report buttons, moderation
     states, admin queue ownership, retention behavior, and response process.
   - Implication: no report UI, moderation-state schema, admin workflow, or
     request persistence should be assigned yet.

## Files Likely Touched

- `docs/prototypes/compliance-owner-decision-packet.md`
- `docs/risks/production-readiness.md`
- relevant workstream briefs
- `docs/tasks/T-219-record-remaining-compliance-owner-inputs.md`

## Acceptance Criteria

- Remaining R-018 blockers are listed in the decision packet with
  recommendation and implementation implication.
- R-018 clearly states that further runtime compliance work is blocked on
  owner-supplied URLs or explicit opt-in decisions.
- Workstream next-action sections no longer imply a decision-light R-018
  runtime task is ready after T-218.
- No runtime files are changed.

## Verification

```bash
git diff --check
rg -n "T-218 is prepared|T-218 planned|T-218 should|T-219" docs/orchestration/state.md docs/tasks/README.md docs/audits/findings-register.md docs/risks/production-readiness.md docs/workstreams docs/prototypes/compliance-owner-decision-packet.md docs/tasks/T-219-record-remaining-compliance-owner-inputs.md
```

## Agent Prompt

You are working on T-219. Read `AGENTS.md`, `docs/README.md`, R-018 in
`docs/risks/production-readiness.md`,
`docs/prototypes/compliance-owner-decision-packet.md`, and T-212 through T-218
for the completed R-018 compliance slices. This is a docs-only owner-input
recording task. Add a concise remaining-inputs section to the decision packet
covering Shopify policy URLs, real social URLs, launch jurisdiction/audience
scope, future account self-service privacy workflows, and future comment
moderation/reporting workflows. For each item, include the recommendation and
implementation implication. Update R-018 and relevant workstream next actions
to make clear that further runtime compliance work is blocked on owner-supplied
values or explicit opt-in decisions. Do not change runtime code, tests, policy
page behavior, forms, auth, comments, Shopify behavior, schemas, or APIs. Run
the verification commands and update this handoff with the result.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-23 after T-218 completed the final
  decision-light footer cleanup slice.
- This task should not ask agents to implement any runtime compliance behavior.
  Its purpose is to stop the remaining blocked R-018 items from being inferred
  or reopened without owner-supplied inputs.
- Completed on 2026-05-23 by adding a Remaining Owner Inputs section to
  `docs/prototypes/compliance-owner-decision-packet.md` for Shopify policy
  target URLs, real social URLs, launch jurisdiction/audience assumptions,
  account self-service privacy workflows, and comment moderation/reporting
  workflows.
- R-018 now states that further runtime compliance work is blocked on
  owner-supplied URLs or explicit opt-in decisions.
- No runtime files, tests, policy page behavior, forms, auth, comments,
  Shopify behavior, schemas, or APIs were changed.
- Verification passed: `git diff --check` and the T-219 tracker-reference
  search.

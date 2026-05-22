# T-212 Prepare Compliance Owner Decision Packet

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Auth, Admin, And Permissions](../workstreams/auth-admin-and-permissions.md),
[Shopify Commerce](../workstreams/shopify-commerce.md)

## Goal

Prepare an owner/legal decision packet for the open R-018 privacy, consent,
third-party disclosure, and commerce-policy gaps before any runtime policy
pages, consent fields, unsubscribe behavior, or account privacy flows are
implemented.

## Context

- A-020 completed the privacy, consent, and commerce compliance audit and found
  missing public policy pages, newsletter consent/source and unsubscribe gaps,
  account privacy/self-service gaps, comment posting/moderation notice gaps,
  contact/enquiry notice gaps, third-party disclosure gaps, and commerce policy
  gaps.
- T-100 already preserved Shopify product context in contact enquiries.
- T-209 removed unsupported commerce assurance claims from shared public banner
  copy.
- T-208 added a Shopify-hosted purchase handoff, but app-owned checkout/cart,
  payment, shipping, refund, fulfilment, and buyer-protection policy remain out
  of scope.
- The next compliance step needs owner/legal-approved decisions and content
  boundaries. Agents must not invent policy text, legal requirements, retention
  promises, sale terms, or consent language.

## Scope

In scope:

- Create an owner-facing decision packet under `docs/prototypes/` or
  `docs/runbooks/` that summarizes the R-018 launch decisions in plain
  language.
- Cover at least:
  - privacy policy route/content owner;
  - cookie/session and third-party service disclosure;
  - terms of use route/content owner;
  - sale, shipping, returns/refunds, payment, and hosted-Shopify handoff
    policy boundaries;
  - newsletter consent/source metadata and unsubscribe expectations;
  - contact/enquiry retention notice;
  - comment posting, username display, moderation/reporting, and deletion
    expectations;
  - account signup/OAuth privacy acknowledgement and self-service/manual
    privacy request expectations;
  - footer/legal link targets and placeholder social-link cleanup ownership.
- Use A-020 evidence and current mitigations from T-100, T-208, T-209, T-210,
  and T-211.
- Prepare follow-up implementation task candidates for owner-approved policy
  pages/links, newsletter consent/unsubscribe, comment/contact notices, account
  privacy actions, and third-party disclosure.
- Update this task brief and linked workstreams after completion.

Out of scope:

- Do not write launch policy text as if it were legally approved.
- Do not create runtime public policy pages.
- Do not add consent checkboxes, subscriber fields, unsubscribe tokens, account
  deletion/export flows, comment moderation features, or footer link runtime
  changes.
- Do not change checkout/cart, Shopify purchase handoff, product detail, shop
  listing behavior, public search, or commerce claims.
- Do not inspect or record secret values, private customer data, subscriber
  records, enquiry records, user records, or comment records.

## Concurrency

This task is docs-only and can run in parallel with implementation work that
does not edit the same docs. If assigned in parallel, this task owns:

- the new owner decision packet;
- `docs/tasks/T-212-prepare-compliance-owner-decision-packet.md`.

Leave shared trackers to orchestrator reconciliation unless explicitly
assigned: `docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate shared-tracker updates in this task's handoff notes.

## Files Likely Touched

- `docs/prototypes/compliance-owner-decision-packet.md` or another clearly
  named decision-packet doc approved by local docs conventions.
- `docs/prototypes/README.md` if a prototypes packet is added there.
- `docs/tasks/T-212-prepare-compliance-owner-decision-packet.md`

## Acceptance Criteria

- The decision packet is owner-facing, concise, and does not make legal
  conclusions.
- Each open A-020/R-018 decision has a clear owner question, implementation
  dependency, and example of what cannot be implemented until approved.
- The packet distinguishes current implemented behavior from future approved
  behavior.
- Follow-up task candidates are scoped narrowly enough for later assignment.
- No runtime code, policy pages, consent fields, account privacy behavior, or
  commerce behavior changes are made.

## Verification

```bash
rg -n "privacy|cookie|terms|unsubscribe|consent|retention|third-party|shipping|refund|returns|payment|moderation|account" docs/prototypes docs/tasks/T-212-prepare-compliance-owner-decision-packet.md
rg -n "password|secret|token|license|private key|access token" docs/prototypes docs/tasks/T-212-prepare-compliance-owner-decision-packet.md
git diff --check
```

The second `rg` command may find generic warning text such as `access token`
only if it is clearly not a secret value. Do not commit private values.

## Agent Prompt

You are working on T-212. Read `AGENTS.md`, `docs/README.md`, A-020 in
`docs/audits/results/A-020-privacy-consent-commerce-compliance.md`, R-018 in
`docs/risks/production-readiness.md`, and the deployment/frontend/data/auth/
Shopify workstreams. Prepare an owner-facing compliance decision packet that
turns the A-020/R-018 gaps into clear owner/legal questions and later
implementation candidates. Do not write approved legal policy copy, create
runtime policy pages, add consent fields, implement unsubscribe/account privacy
flows, change comments/contact/shop behavior, or record secret/private data.
Run the verification commands, then update this handoff with what changed and
candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-211 completed and F-098
  was reconciled as resolved.
- This is the next owner-independent step because R-018 is high severity but
  implementation requires owner/legal decisions before runtime changes.
- Completed on 2026-05-22. Added
  [Compliance Owner Decision Packet](../prototypes/compliance-owner-decision-packet.md)
  as an owner/legal review packet for privacy policy, cookie/session and
  third-party disclosure, terms, commerce policy boundaries, newsletter
  consent/source/unsubscribe, contact/enquiry retention notice, comment
  posting/moderation/deletion expectations, account signup/OAuth privacy
  acknowledgements, account privacy request handling, and footer legal/social
  cleanup.
- Updated [Prototypes](../prototypes/README.md) so the decision packet is
  discoverable from the prototype owner-review index.
- No runtime policy pages, footer links, consent fields, unsubscribe tokens,
  account privacy flows, comment/contact/shop behavior, commerce claims, or
  private data inspection were added.
- Shared trackers and workstream briefs already have unrelated/concurrent dirty
  edits in this worktree, so this task did not edit
  `docs/workstreams/*`, `docs/audits/findings-register.md`,
  `docs/risks/production-readiness.md`, `docs/orchestration/state.md`, or
  `docs/tasks/README.md`.
- Verification:
  - `rg -n "privacy|cookie|terms|unsubscribe|consent|retention|third-party|shipping|refund|returns|payment|moderation|account" docs/prototypes docs/tasks/T-212-prepare-compliance-owner-decision-packet.md`
    passed and returned the expected decision-packet/task references plus
    existing prototype review references to commerce-copy guardrails.
  - `rg -n "password|secret|token|license|private key|access token" docs/prototypes docs/tasks/T-212-prepare-compliance-owner-decision-packet.md`
    returned only generic guardrail/task-language matches: "unsubscribe
    tokens", "secrets", "tokens", and existing task-scope warnings. No secret
    values or private records were added.
  - `git diff --check` passed.
  - Extra `git diff --no-index --check /dev/null ...` checks against the new
    decision packet and untracked T-212 task brief emitted no whitespace
    errors.
- Candidate shared-tracker updates for orchestrator reconciliation:
  - `docs/workstreams/deployment-security-and-observability.md` can record
    T-212 complete and point R-018 implementation work to the decision packet.
  - `docs/workstreams/frontend-routes-and-components.md` can keep footer/legal
    links, form notices, account privacy UI, and third-party embed disclosure
    blocked until the packet's owner/legal decisions are answered.
  - `docs/workstreams/data-models-and-api.md` can keep newsletter
    consent/source fields, unsubscribe routes, retention fields, and account
    privacy actions blocked pending the packet.
  - `docs/workstreams/auth-admin-and-permissions.md` can point account
    signup/OAuth acknowledgement and self-service/manual privacy request work
    to the packet.
  - `docs/workstreams/shopify-commerce.md` can point sale/payment/shipping/
    refund/returns policy boundaries and app-owned checkout/cart decisions to
    the packet.
  - `docs/risks/production-readiness.md` can mention T-212 as the prepared
    owner/legal decision handoff while R-018 remains open until approvals and
    runtime implementation are complete.
  - `docs/tasks/README.md` can mark T-212 completed after shared tracker
    reconciliation.
- Orchestrator reconciliation completed on 2026-05-22: shared risk,
  orchestration, task-index, and workstream trackers now mark T-212 complete
  and route follow-up runtime compliance work through owner/legal review of the
  decision packet.
- Post-review refinement completed on 2026-05-22 after owner-readiness review:
  the packet now asks for baseline legal/publisher identity, launch
  jurisdiction/audience scope, legal/privacy contact recipient, approver, and
  effective/version date. The response sheet now captures route or Shopify
  target URL, link placement, notice/acknowledgement source, required stored
  fields, approver, effective/version date, and launch/counsel/source/surface
  guardrails before implementation tasks are created.
- Owner response recorded on 2026-05-22: Heron Laoutaris is the developer and
  owner of the artwork/gallery content; hlaoutaris@gmail.com is the legal and
  privacy contact recipient; all recommendations in the packet are approved
  for implementation scoping. The packet still flags launch
  jurisdiction/audience assumptions, final legal copy, Shopify policy target
  URLs, and real social URLs as values not to invent.

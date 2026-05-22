# T-216 Add Comment Posting Notice And Moderation Handoff

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Mitigate the next R-018/F-075 comment compliance gap by adding an
owner-approved public comment posting notice and manual moderation/removal
request handoff without building a moderation workflow.

## Context

- T-212 recorded owner approval for comment posting notice and manual
  moderation/removal request scoping.
- T-213 added public `/privacy` and `/terms`.
- T-215 completed account privacy/terms acknowledgement and manual privacy
  request handoff; this task should not revisit account flows.
- A-020/F-075 found public comment forms and displays expose user-generated
  text and usernames without a posting notice, moderation/reporting workflow,
  or documented deletion/retention expectation.
- Current blog comments render through `BlogDetail`, `CommentForm`, and
  existing comment cards. The form posts user-entered comment text for the
  current blog slug.

## Scope

In scope:

- Add visible owner-approved notice copy near the public comment posting
  surface explaining that submitted comments and usernames may be shown publicly
  on the blog post.
- Link the notice to `/privacy` and `/terms`.
- Include a manual moderation/removal/privacy request handoff to
  hlaoutaris@gmail.com for comment removal, correction, or moderation concerns.
- Preserve existing comment submission, validation, owner edit/delete controls,
  blog detail loading, and comment display behavior.
- Add focused coverage for the visible notice, policy links, manual request
  address, and preservation of the existing comment submit contract.
- Update this task handoff and list candidate shared-tracker updates.

Out of scope:

- Do not add moderation states, report buttons, admin queues, request
  persistence, notification emails, pseudonym fields, schema/API changes, or
  retention/deletion automation.
- Do not change account acknowledgement, account privacy request handling,
  newsletter consent/unsubscribe, contact/enquiry notice, Shopify policy URLs,
  footer social URLs, or jurisdiction-specific legal copy.
- Do not inspect production comments, users, or private account data.

## Concurrency

Run this task alone with other work touching public blog comments, comment
forms/cards, comment actions/routes, or comment-related tests.

Owned files:

- `src/components/modules/forms/user/CommentForm.tsx`
- focused comment form or blog detail tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/modules/forms/user/CommentForm.tsx`
- `src/components/views/BlogDetail.tsx` only if the notice must live outside
  the form component to match existing layout
- `__tests__/unit/forms/CommentFormNotice.test.tsx` or an existing focused
  comment-form test if one is more appropriate
- `__tests__/unit/publicBrowsingClientErrorStates.test.tsx` only if the
  `CommentForm` mock needs updated visible copy expectations
- `docs/tasks/T-216-add-comment-posting-notice-moderation-handoff.md`

## Acceptance Criteria

- Public comment posting UI includes visible notice copy before or beside the
  submit control.
- The notice clearly states that submitted comment text and the user's display
  name/username may be public on the blog post.
- The notice links to `/privacy` and `/terms`.
- The notice provides a manual comment moderation/removal/correction handoff to
  hlaoutaris@gmail.com without implying self-service deletion, guaranteed
  moderation timing, or automated workflow support.
- Existing comment validation, submission payload, retry behavior, and form
  reset after successful submission are preserved.
- Existing owner-only comment edit/delete controls and comment card display
  behavior are unchanged.
- Focused tests cover the notice and guard against breaking the current comment
  submit contract.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/CommentFormNotice.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/publicBrowsingClientErrorStates.test.tsx
npm run lint
npm run build
git diff --check
```

If an existing test path is reused instead of
`__tests__/unit/forms/CommentFormNotice.test.tsx`, update this verification
section in the handoff with the exact command that passed.

Completed on 2026-05-22.

## Agent Prompt

You are working on T-216. Read `AGENTS.md`, `docs/README.md`, F-075 in
`docs/audits/findings-register.md`, R-018 in
`docs/risks/production-readiness.md`,
`docs/prototypes/compliance-owner-decision-packet.md`, T-213 for the completed
privacy/terms routes, T-215 for the completed account acknowledgement slice,
and the frontend/auth/data/deployment/testing workstreams. Add the
owner-approved public comment posting notice and manual moderation/removal
request handoff near the comment posting surface. Keep existing comment
submission, validation, owner edit/delete controls, and public display
behavior unchanged. Do not add moderation workflows, report buttons, schema/API
changes, retention automation, account/newsletter/contact/Shopify/social
work, or jurisdiction-specific legal claims. Run focused tests plus lint,
build, and `git diff --check`, then update this handoff with what changed and
list candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-215 completed account
  acknowledgement/manual privacy request behavior.
- This is the next R-018/F-075 slice. It should add notice and manual handoff
  only; real moderation/reporting workflows, request persistence, retention
  automation, and schema/API changes remain separate.
- Completed on 2026-05-22 by adding a visible comment posting notice inside
  `CommentForm`, near the existing submit control. The notice states that
  submitted comment text and the user's display name or username may appear
  publicly on the blog post.
- The notice links to `/privacy` and `/terms` and provides the approved manual
  handoff address, `hlaoutaris@gmail.com`, for comment removal, correction, or
  moderation concerns. It does not add moderation states, report buttons,
  request persistence, guaranteed timing, or deletion/retention automation.
- Existing comment validation, submit callback shape, successful reset, retry
  behavior, blog detail loading, comment display, and owner edit/delete controls
  were preserved.
- Added focused coverage in
  `__tests__/unit/forms/CommentFormNotice.test.tsx` for the notice copy, policy
  links, manual request email link, moderation/removal/correction wording, and
  the existing submit payload/reset contract.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/forms/CommentFormNotice.test.tsx`,
  `npm test -- --runTestsByPath __tests__/unit/forms/CommentFormNotice.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/publicBrowsingClientErrorStates.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check`. Jest emitted the
  existing dependency `punycode` deprecation warning. The build emitted the
  existing Browserslist caniuse-lite freshness notice.

Candidate shared-tracker updates for orchestration:

- `docs/tasks/README.md`: mark T-216 Completed with the comment posting notice
  and manual moderation/removal/correction handoff summary.
- `docs/audits/findings-register.md`: update F-075 from Converted to partially
  mitigated or resolved for the public posting notice and manual request
  handoff slice, while keeping real moderation/reporting workflows, request
  persistence, retention automation, and any schema/API changes separate.
- `docs/risks/production-readiness.md`: update R-018 to record T-216
  completion while keeping contact/enquiry notice, Shopify policy target URLs,
  real social URLs, jurisdiction/audience input, future self-service privacy
  workflows, and any future comment moderation/reporting workflow open.
- `docs/workstreams/frontend-routes-and-components.md`: record the visible
  comment posting notice, `/privacy` and `/terms` links, and manual email
  handoff in the public blog comment form.
- `docs/workstreams/auth-admin-and-permissions.md`: note that owner edit/delete
  controls were preserved and no moderation/admin workflow was added.
- `docs/workstreams/data-models-and-api.md`: note that T-216 made no schema,
  API, persistence, or moderation-state changes.
- `docs/workstreams/deployment-security-and-observability.md`: record the
  manual comment moderation/removal/correction handoff under R-018 compliance.
- `docs/workstreams/testing-and-quality.md`: record the focused
  `CommentFormNotice.test.tsx` coverage and adjacent client error-state
  verification.

Orchestrator reconciliation:

- Reconciled on 2026-05-22 after completion. Shared trackers now mark T-216
  complete, F-075 partially mitigated, and R-018 still open for
  contact/enquiry notice, Shopify policy target URLs, real social URLs, future
  self-service privacy workflows, future comment moderation/reporting
  workflows if desired, and jurisdiction or audience-specific legal claims.
- Prepared T-217 as the next R-018 slice for contact/product enquiry privacy
  and retention notice.

# T-171 Audit Existing Content Image URLs

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Run a read-only audit of existing article, blog, and collection image URLs
against the current allowed-host policy.

## Context

- T-135 enforces the current allowed-host policy for new admin-managed article,
  blog, and collection image URL writes.
- Existing records may predate that validation.
- The owner expects artwork images to be preserved, so this task should focus
  on identifying compatibility/rendering risk, not deleting assets.

## Scope

In scope:

- Inspect existing code and data-access patterns for article, blog, and
  collection image URLs.
- Add or run a read-only audit script if a safe local pattern exists.
- Report counts and examples by category: accepted Cloudinary, accepted
  external allowlist host, missing/empty where allowed, malformed URL,
  unsupported host, or mismatched Cloudinary cloud/path.
- Do not record private data or secrets. Keep examples limited to public image
  host/path evidence where safe.
- Write a concise result under `docs/audits/results/` or a focused
  `docs/data-quality/` report.

Out of scope:

- Do not mutate MongoDB records.
- Do not delete, rename, or transform Cloudinary assets.
- Do not change validation policy or `next.config.mjs`.
- Do not change public rendering.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-169, T-170, T-172, and T-173 if agents avoid shared
tracker edits. If live database access is unavailable, record the blocked
state and the exact command/env needed.

Owned files:

- optional read-only audit script under `scripts/` if needed
- focused audit result/report under `docs/audits/results/` or
  `docs/data-quality/`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The handoff states whether existing article/blog/collection image URLs appear
  compatible with the current policy.
- Any unsupported or malformed records are summarized without private data.
- No data or asset mutation occurs.

## Verification

```bash
git diff --check
```

Run the read-only audit command if environment access is available. Record
unavailable environment access as a blocker, not a failure.

## Agent Prompt

You are working on T-171. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-101, T-135, the Cloudinary runbook, the content/admin workstream, and the
data/API workstream. Perform a read-only audit of existing article, blog, and
collection image URLs against the current allowed-host policy. Do not mutate
MongoDB records, delete Cloudinary assets, change validation policy, edit
runtime rendering, or edit shared trackers. Keep evidence concise and sanitized.
Run `git diff --check`, plus any safe read-only audit command available, and
update only this task handoff and its owned report/script files.

## Handoff Notes

- Prepared after the owner clarified artwork images are unlikely to be deleted.
- Completed 2026-05-20 with a read-only MongoDB audit script:
  `scripts/audit-content-image-urls.mjs`.
- Result written to
  `docs/audits/results/T-171-content-image-url-audit.md`.
- Audited 7 article, 17 blog, and 6 collection records. All 30 existing
  `imageUrl` values use the configured Cloudinary delivery path
  `https://res.cloudinary.com/dzncmfirr/**`.
- No accepted external allowlist URLs, missing/empty values, malformed URLs,
  unsupported hosts, or mismatched Cloudinary cloud/path values were found.
- Initial sandboxed audit attempt failed with DNS refusal for the configured
  MongoDB Atlas SRV host; the same read-only command passed with network
  approval after loading `MONGO_URI` from local `.env`.
- Orchestrator follow-up hardened the read-only script's failure logging so
  connection-string details are redacted from audit command errors.
- Verification: `node scripts/audit-content-image-urls.mjs` passed;
  `node --check scripts/audit-content-image-urls.mjs` passed;
  `git diff --check` passed; no-index whitespace checks for the new T-171 files
  produced no warnings.
- Candidate shared tracker update: the content/admin backlog item to review
  existing blog, article, and collection image URLs against the T-135 policy can
  be marked reconciled to the result report. No findings-register or
  production-risk item is needed.

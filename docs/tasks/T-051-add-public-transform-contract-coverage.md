# T-051 Add Public Transform Contract Coverage

Status: Ready

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Add focused tests and fixes for the public transform extender drift identified
in F-040 so blog read time, collection first artwork, user ownership, and
comment ownership state return stable frontend-safe values.

## Why Now

T-044 through T-050 completed the staged API response-helper cleanup across
protected user reads, public content, public collection/navigation, and admin
read/delete/create/update routes. The next bounded data/API risk is transform
contract drift: it is concrete, testable, and independent of Shopify product
linking, Cloudinary upload policy, and global production logging decisions.

This task addresses:

- [F-015](../audits/findings-register.md): API response and transform contracts
  are uneven across route groups.
- [F-040](../audits/findings-register.md): public transform extenders can emit
  defaults or `undefined` values that conflict with frontend contracts.
- [R-005](../risks/production-readiness.md): production-critical transform
  coverage remains narrow.
- [R-006](../risks/production-readiness.md): field contracts and transform
  outputs remain inconsistent.

## Read First

- [A-003 result](../audits/results/A-003-data-models-transforms.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/lib/transforms/createTransformer.ts`
- `src/lib/transforms/transformHelpers.ts`
- `src/lib/transforms/blog/transformBlog.ts`
- `src/lib/transforms/comment/transformComment.ts`
- `src/lib/transforms/user/transformUser.ts`
- `src/lib/constants`
- `src/lib/data/types`

## Scope

In scope:

- Add focused unit coverage for public transform contracts, preferably under a
  new transform-specific test file such as
  `__tests__/unit/transforms/publicTransformContracts.test.ts`.
- Cover and fix the F-040 cases:
  - `transformBlog.toFrontend()` and populated blog transforms should expose a
    real `readTime` derived from blog text instead of the default/missing value.
  - `transformCollection.toFrontend()` should expose a stable
    `firstArtworkId` value that does not become `undefined` for empty
    collections. Align with the existing navigation transform convention unless
    the frontend type requires a narrower decision.
  - Public user transforms should pass through the `isOwner` extender when a
    `userId` is supplied, without exposing sensitive user fields.
  - Comment transforms, including populated comments and comments nested under
    populated blogs, should preserve caller `userId` context so `isOwner`
    reflects the active user.
- Preserve existing sensitive-field filtering in all touched transforms.
- Prefer existing transform helper and constant patterns over new abstractions.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not build the full F-039 field matrix in this task.
- Do not change admin write validation, route response helpers, route/fetcher
  parity, or protected API guards.
- Do not change artwork image sanitization, Cloudinary upload policy, or
  color-proximity `similarityScore` typing from F-041.
- Do not add Shopify product ID/admin-linking behavior.
- Do not introduce global logging/redaction policy.
- Do not change public route success envelopes unless transform outputs require
  route tests to prove the same DTO contract is preserved.

## Acceptance Criteria

- Focused transform tests fail on the current F-040 drift and pass after the
  fix.
- Blog public transforms return deterministic `readTime` for text-bearing
  posts.
- Collection public transforms never emit `undefined` for `firstArtworkId`.
- Public user and comment transforms compute `isOwner` from the supplied
  `userId` while preserving sensitive-field filtering.
- Populated blog/comment transform paths keep the same user-context ownership
  behavior as direct transforms.
- No unrelated route, Shopify, Cloudinary, logging, or field-matrix behavior is
  changed.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/transforms/publicTransformContracts.test.ts
npm run lint
npm run build
```

If an existing test file is used instead of the suggested new path, update the
focused Jest command in this task and in the handoff notes.

## Handoff Notes

- Keep this limited to public transform contract behavior and focused coverage.
- If a type contract is ambiguous, document the smallest local decision in this
  task and escalate broader field-matrix work for a follow-up.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- Fixing a transform requires changing persisted schema fields or public route
  envelope shapes.
- `firstArtworkId` requires a product decision that conflicts with existing
  frontend or navigation types.
- Ownership-state fixes require auth/session policy changes outside transform
  caller context.

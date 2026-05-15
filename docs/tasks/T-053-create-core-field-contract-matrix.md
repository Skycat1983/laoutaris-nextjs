# T-053 Create Core Field Contract Matrix

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Create an authoritative field contract matrix for the remaining F-039
model/schema/type drift so later implementation tasks can align article, blog,
and user field behavior without re-litigating required versus optional fields.

## Why Now

T-051 and T-052 resolved the focused public transform contract slices from
A-003. The next data/API blocker is F-039: required and optional fields still
disagree across Mongoose models, Zod route schemas, TypeScript types, auth
adapter behavior, and admin forms. This needs a compact durable matrix before
implementation because the known mismatches cross code boundaries:

- article `section`,
- blog `imageUrl`, `pinned`, and `tags`,
- user `password`.

This task addresses:

- [F-039](../audits/findings-register.md): required and optional field
  contracts disagree across Mongoose models, Zod schemas, and TypeScript types.
- [R-006](../risks/production-readiness.md): field contracts and transform
  outputs remain inconsistent.
- [R-015](../risks/production-readiness.md): input flows still have residual
  validation and persistence gaps.

## Read First

- [A-003 result](../audits/results/A-003-data-models-transforms.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/lib/data/models/articleModel.ts`
- `src/lib/data/schemas/articleSchema.ts`
- `src/lib/data/types/articleTypes.ts`
- `src/lib/data/models/blogModel.ts`
- `src/lib/data/schemas/blogSchema.ts`
- `src/lib/data/types/blogTypes.ts`
- `src/lib/data/models/userModel.ts`
- `src/lib/data/schemas/userSchema.ts`
- `src/lib/data/types/userTypes.ts`
- `src/lib/db/adapter.ts`
- Admin article/blog create/update forms and route schemas touched by T-034 and
  T-038.

## Scope

In scope:

- Create a durable architecture/data contract doc, preferably
  `docs/architecture/data-field-contracts.md`.
- Add the new doc to [docs/architecture/README.md](../architecture/README.md)
  and any other canonical index that should expose it.
- Build a matrix for the known F-039 drift:
  - article `section`,
  - blog `imageUrl`,
  - blog `pinned`,
  - blog `tags`,
  - user `password`.
- For each field, record:
  - Mongoose model requirement/default behavior,
  - Zod/admin route schema behavior,
  - TypeScript type behavior,
  - relevant UI/form/auth adapter behavior,
  - current production risk,
  - recommended authoritative contract,
  - exact follow-up implementation task candidate.
- Make the recommendations small and implementation-ready. Prefer preserving
  existing public/admin behavior unless the docs or code clearly show a safer
  contract.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change runtime model, schema, transform, route, auth, or form code in
  this task.
- Do not implement article/blog/user field contract fixes yet.
- Do not expand into Shopify product-link fields, Cloudinary image fields,
  response-helper contracts, route/fetcher parity, logging policy, or
  Next/PostCSS decisions.
- Do not create broad field matrices for every persisted entity unless needed
  to explain one of the known F-039 fields.

## Acceptance Criteria

- A new durable field contract doc exists and is linked from the architecture
  docs.
- The doc covers article `section`, blog `imageUrl`/`pinned`/`tags`, and user
  `password` with model, schema, type, UI/auth, risk, recommendation, and
  follow-up columns.
- Recommendations are concrete enough for the orchestrator to commission the
  next implementation task without additional audit work.
- F-039 remains open unless the task only documents and does not implement the
  actual code alignment.
- No runtime behavior is changed.

## Verification

Run:

```bash
git diff --check
```

Runtime tests are not required for a docs-only matrix. If implementation code is
changed despite the scope, stop and split that work into a separate task.

## Handoff Notes

- Keep this documentation-first. The goal is to unblock the next implementation
  task, not to fix all field contracts in one pass.
- Call out any recommendation that needs owner/orchestrator approval before code
  changes.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- The code contradicts A-003 and a recommendation would change public/admin
  behavior materially.
- User `password` handling requires an auth/product decision rather than a local
  type/schema alignment.
- Blog or article field behavior cannot be decided without owner content-policy
  input.

## Outcome

Completed on 2026-05-15.

- Created [data-field-contracts.md](../architecture/data-field-contracts.md)
  as the durable F-039 matrix for article `section`, blog `imageUrl`/`pinned`/
  `tags`, and user `password`.
- Linked the matrix from [Architecture](../architecture/README.md).
- F-039 remains open because this task documented the contracts only and did not
  change runtime model, schema, type, route, form, or auth code.
- Follow-up implementation candidates are:
  - T-054: align article section UI constants and regression coverage.
  - T-055: align blog `imageUrl`, `pinned`, and `tags` model/schema/route
    contracts.
  - T-056: align user password optional credentials/OAuth behavior.

Verification:

```bash
git diff --check
```

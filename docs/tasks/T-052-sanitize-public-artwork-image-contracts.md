# T-052 Sanitize Public Artwork Image Contracts

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Fix the F-041 public artwork image contract so public artwork transforms do not
expose persistence-only Cloudinary fields, color-proximity metadata is typed and
documented in code, and Cloudinary color validation matches the persisted color
shape.

## Why Now

T-051 resolved the focused F-040 public transform extender drift. At assignment
time, the next bounded transform/data slice was F-041: `transformArtwork`
bypassed the existing image sanitizer, public artwork payloads could expose
`image.public_id`, the color-proximity path injected an undocumented
`image.similarityScore`, and the Cloudinary image schema accepted loose color
arrays. This stayed in the same data/API and asset-contract area without mixing
in Shopify product-linking, Cloudinary upload policy, global logging, or the
broader F-039 field matrix.

This task addresses:

- [F-015](../audits/findings-register.md): API response and transform contracts
  are uneven across public, user, admin, and shop routes.
- [F-041](../audits/findings-register.md): public artwork image payloads bypass
  Cloudinary sanitization and include undocumented image fields.
- [R-005](../risks/production-readiness.md): production-critical transform and
  input persistence coverage remains narrow.
- [R-006](../risks/production-readiness.md): field contracts and transform
  outputs remain inconsistent.
- [R-008](../risks/production-readiness.md): Cloudinary asset boundaries need
  production-ready hardening.

## Read First

- [A-003 result](../audits/results/A-003-data-models-transforms.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Content, assets, and admin operations workstream](../workstreams/content-assets-and-admin-ops.md)
- `src/lib/transforms/artwork/transformArtwork.ts`
- `src/lib/transforms/artwork/transformImage.ts`
- `src/lib/data/types/cloudinaryTypes.ts`
- `src/lib/data/types/artworkTypes.ts`
- `src/lib/data/schemas/cloudinarySchema.ts`
- `src/lib/data/services/getArtworkList.ts`
- `__tests__/unit/transforms/publicTransformContracts.test.ts`
- `__tests__/unit/data/getArtworkList.test.ts`
- `__tests__/unit/api/publicArtworkListRoute.test.ts`
- `__tests__/unit/api/publicArtworkRoute.test.ts`
- `__tests__/unit/api/adminArtworkRoute.test.ts`

## Scope

In scope:

- Add focused coverage for public artwork image contracts, preferably under a
  new transform-specific test file such as
  `__tests__/unit/transforms/publicArtworkImageContracts.test.ts`.
- Ensure `transformArtwork.toFrontend()` and `transformArtworkPopulated()` use
  the existing Cloudinary image sanitizer so public artwork payloads do not
  include `image.public_id`.
- Preserve all public-safe image fields currently needed by frontend artwork
  views: `secure_url`, `bytes`, `pixelHeight`, `pixelWidth`, `format`,
  `hexColors`, and `predominantColors`.
- Make the color-proximity `similarityScore` behavior explicit and typed:
  either preserve it as an optional public image metadata field without exposing
  `public_id`, or remove it from the public transform output if no consumer
  depends on it. Document the local decision in this task's handoff notes.
- Tighten `cloudinaryImageSchema` color arrays from `z.any()` to the existing
  `{ color: string; percentage: number }` shape used by Mongoose and
  `ColourInfo`.
- Update focused tests affected by stricter image/color validation, especially
  public artwork list/detail and admin artwork route tests if their fixtures
  need valid color objects.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change Cloudinary upload signing policy, allowed upload params, folder
  rules, upload preset ownership, asset lifecycle policy, or environment
  runbooks.
- Do not change admin artwork create/update business fields beyond image schema
  validation needed for the existing image DTO.
- Do not add Shopify product ID/admin-linking behavior.
- Do not build the broader F-039 field matrix.
- Do not change API response-helper envelopes, protected route guards, or
  route/fetcher parity rules.
- Do not redesign artwork color sorting, pagination, or filtering behavior.

## Acceptance Criteria

- Public artwork transform tests prove `image.public_id` is omitted from direct
  and populated artwork frontend DTOs.
- Public artwork image DTOs still include the existing frontend image fields
  needed by views.
- Color-proximity list behavior is covered with an explicit typed decision for
  `similarityScore`.
- Cloudinary image schema rejects malformed color entries and accepts valid
  `{ color, percentage }` objects.
- Existing public/admin artwork route tests use valid image fixtures and still
  pass.
- No unrelated Shopify, upload-policy, logging, or field-matrix behavior is
  changed.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/transforms/publicArtworkImageContracts.test.ts __tests__/unit/data/getArtworkList.test.ts __tests__/unit/api/publicArtworkListRoute.test.ts __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts
npm run lint
npm run build
```

If an existing test file is used instead of the suggested new transform test
path, update the focused Jest command in this task and in the handoff notes.

## Handoff Notes

- Completed on 2026-05-15.
- `transformArtwork.toFrontend()` now sanitizes nested Cloudinary image data via
  `transformImage`, so direct and populated public artwork DTOs omit
  `image.public_id` while preserving `secure_url`, `bytes`, `pixelHeight`,
  `pixelWidth`, `format`, `hexColors`, and `predominantColors`.
- `similarityScore` is preserved as optional public-only image metadata for
  color-proximity sorted artwork lists. It is typed on the public image DTO and
  intentionally remains outside persisted Cloudinary image validation.
- `cloudinaryImageSchema` now validates `hexColors`,
  `predominantColors.cloudinary`, and `predominantColors.google` as strict
  `{ color: string; percentage: number }` objects instead of `z.any()`.
- Added
  `__tests__/unit/transforms/publicArtworkImageContracts.test.ts` for the
  focused public artwork image and Cloudinary color schema contract.
- Keep this limited to public artwork image contract behavior and schema shape
  validation.
- Recorded decision: `similarityScore` is preserved as typed optional public
  image metadata and excluded from persisted image validation.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Verification Results

Passed on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/transforms/publicArtworkImageContracts.test.ts __tests__/unit/data/getArtworkList.test.ts __tests__/unit/api/publicArtworkListRoute.test.ts __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts
npm run lint
npm run build
```

Build retained existing MongoDB/static-generation, branch-verification, link,
and fetcher debug log noise.

## Escalate

Escalate to the orchestrator if:

- Public frontend views or route consumers require `image.public_id`.
- Color-proximity behavior cannot be preserved without changing public route
  envelope or pagination contracts.
- Tightening Cloudinary image validation requires a broader upload-policy
  decision.

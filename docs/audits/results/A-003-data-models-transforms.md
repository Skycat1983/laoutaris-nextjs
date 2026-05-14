# A-003 Data Models, Schemas, And Transforms Result

Status: Completed

Audit goal: [A-003 Data models, schemas, and transforms](../goals.md#a-003-data-models-schemas-and-transforms)

Workstream: [Data models and API](../../workstreams/data-models-and-api.md)

## Summary

Schemas, Mongoose models, TypeScript types, transforms, and route-facing
contracts do not yet agree strongly enough for production refactoring. The main
risks are inconsistent required/optional fields, route handlers bypassing Zod
schemas and transform functions, and frontend result types that imply
transformed data while some handlers return raw Mongoose documents.

The existing Jest suite passes, but it does not cover the high-risk model/schema
or transform contracts found in this audit.

## Scope Inspected

- Documentation entry points:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md`
  - `docs/audits/results/README.md`
  - `docs/workstreams/README.md`
  - `docs/workstreams/data-models-and-api.md`
  - `docs/runbooks/database.md`
  - `src/lib/db/README.md`
- Core data code:
  - `src/lib/data/models/`
  - `src/lib/data/schemas/`
  - `src/lib/data/types/`
  - `src/lib/transforms/`
  - `src/lib/constants/*DocumentConstants.ts`
  - `src/lib/constants/*Constants.ts`
- Route and client contract samples:
  - `src/app/api/v2/admin/article/**`
  - `src/app/api/v2/admin/artwork/**`
  - `src/app/api/v2/admin/blog/**`
  - `src/app/api/v2/admin/collection/**`
  - `src/app/api/v2/admin/comment/read/route.ts`
  - `src/app/api/v2/admin/user/read/route.ts`
  - `src/app/api/v2/public/artwork/**`
  - `src/app/api/v2/public/blog/**`
  - `src/app/api/v2/public/enquiry/route.ts`
  - `src/app/api/v2/user/comment/**`
  - `src/app/api/v2/user/profile/route.ts`
  - `src/lib/api/admin/create/fetchers.ts`
  - `src/lib/api/admin/read/fetchers.ts`
  - `src/lib/api/admin/update/fetchers.ts`
  - `src/lib/api/public/enquiry/fetchers.ts`
  - `src/lib/api/user/comments/fetchers.ts`
  - `src/lib/api/user/profile/fetchers.ts`

## Commands Run

- `find src/lib/data -maxdepth 4 -type f | sort`
- `find src/lib/transforms -maxdepth 4 -type f | sort`
- `find src/app/api/v2 -maxdepth 5 -type f | sort`
- `find src/lib/api -maxdepth 4 -type f | sort`
- `wc -l src/lib/data/schemas/*.ts src/lib/data/models/*.ts src/lib/data/types/*.ts src/lib/transforms/**/*.ts src/lib/transforms/*.ts`
- `rg -n "create[A-Za-z]+Schema|update[A-Za-z]+Schema|apiUpdate|parse\\(|safeParse\\(" src/app/api/v2 src/lib/data/schemas src/lib/api/admin src/lib/api/user src/lib/api/public`
- `rg -n "transform[A-Za-z]+\\(|toFrontend\\(|transformAdmin|data: [A-Za-z]|satisfies (Create|Update|Read|Api).*Result" src/app/api/v2 src/lib/api`
- `rg -n "shopifyProducts|productId|ShopifyProductLink" src docs --glob '*.ts' --glob '*.tsx' --glob '*.md'`
- `rg -n "similarityScore" src docs --glob '*.ts' --glob '*.tsx' --glob '*.md'`
- Targeted `nl -ba` reads of the files listed in scope.
- `npm test -- --runInBand`:
  - Passed: 9 suites, 95 tests.
  - Note: `dateUtils` invalid-date tests intentionally emitted console errors.

## Findings

| Severity | Finding | Evidence | Candidate follow-up |
| --- | --- | --- | --- |
| High | Required and optional fields are not consistently defined across Mongoose models, Zod schemas, and TypeScript types. | Article form validation accepts `section: "collections"` in `src/lib/data/schemas/articleSchema.ts:9`, but the Mongoose enum only accepts `artwork`, `biography`, and `project` in `src/lib/data/models/articleModel.ts:37-41`. `BlogEntryBase` requires `imageUrl`, `pinned`, and `tags` in `src/lib/data/models/blogModel.ts:4-15`; the Mongoose schema makes `imageUrl` optional and gives `pinned` a default while leaving `tags` optional in `src/lib/data/models/blogModel.ts:30-41`; blog create/update schemas omit `pinned` and `tags` in `src/lib/data/schemas/blogSchema.ts:3-45`. `UserBase.password` is required in `src/lib/data/models/userModel.ts:3-8`, the Mongoose schema allows it to be absent in `src/lib/data/models/userModel.ts:19-22`, and the auth adapter creates OAuth users without a password in `src/lib/db/adapter.ts:13-21`. | Create one field matrix per persisted entity and decide which layer is authoritative. Feed Mongoose enums and Zod schemas from shared constants where possible. Make optional fields optional in TypeScript, or make Mongoose/API validation enforce them before persistence. |
| High | Several admin write routes expose schema files and typed fetchers, but the server handlers bypass those schemas and return raw Mongoose documents under transformed result types. | `updateArticleSchema`, `updateArtworkSchema`, `updateCollectionSchema`, `createCollectionSchema`, `createCommentSchema`, and `updateCommentSchema` are exported in `src/lib/data/schemas/`, but `rg` found server-side parsing only in article create, artwork create, blog create, and blog update. Article update directly `$set`s request JSON in `src/app/api/v2/admin/article/update/[id]/route.ts:26-35`; artwork update does the same in `src/app/api/v2/admin/artwork/update/[id]/route.ts:25-31`; collection create and update use raw request bodies in `src/app/api/v2/admin/collection/create/route.ts:27-40` and `src/app/api/v2/admin/collection/update/[id]/route.ts:25-53`. The corresponding fetchers type create/update responses as `Admin*` results in `src/lib/api/admin/create/fetchers.ts:15-18` and `src/lib/api/admin/update/fetchers.ts:16-19`, while the routes return untransformed model instances. | Require every admin create/update route to parse a route-local or shared Zod schema, enable Mongoose validators on updates when using `findByIdAndUpdate`, and return a documented transform result rather than raw documents. |
| High | User/comment/enquiry frontend contracts claim transformed shapes, but some route handlers return raw or differently shaped data. | Profile fetchers expect `SingleResult<OwnUserFrontend>` in `src/lib/api/user/profile/fetchers.ts:1-5`; the profile route returns `UserModel.findById(userId).select("-password")` directly in `src/app/api/v2/user/profile/route.ts:25-37`, so `favouritedCount`, `watchlistCount`, and `commentCount` from `transformOwnUser` are not produced. Comment create/update fetchers expect `CommentFrontendPopulated` in `src/lib/api/user/comments/fetchers.ts:6-8`; the create route returns raw `comment[0]` in `src/app/api/v2/user/comment/route.ts:155-158`, and the update route returns a populated Mongoose document in `src/app/api/v2/user/comment/[commentId]/route.ts:63-72`. The enquiry fetcher declares `SingleResult<{ success: true; message: string }>` in `src/lib/api/public/enquiry/fetchers.ts:1-4`, while the route returns `data: enquiry` in `src/app/api/v2/public/enquiry/route.ts:20-24`. | Route responses should be typed from the actual transform/output function used by the route. Add route tests for profile, comment create/update, and enquiry so mismatched `data` shapes fail before runtime. |
| Medium | Public transform extension fields are not reliable. | Blog frontend types include `readTime` via `EXTENDED_PUBLIC_BLOG_FIELDS` in `src/lib/constants/publicDocumentConstants.ts:90-98`, but `extendBlogFields` returns only `commentCount` in `src/lib/transforms/transformHelpers.ts:50-53`, leaving every blog `readTime` at the default `0`. Collection frontend types require `firstArtworkId: string` in `src/lib/constants/publicDocumentConstants.ts:120-129`, but `extendCollectionFields` returns `doc.artworks[0]?.toString()` in `src/lib/transforms/transformHelpers.ts:56-63`, which overrides the default with `undefined` for empty collections. Public user fields define an `isOwner` extender in `src/lib/constants/publicDocumentConstants.ts:171-182`, but `transformUser` does not pass it to `createTransformer` in `src/lib/transforms/user/transformUser.ts:10-15`, so public users always receive the default `isOwner: false`. Populated comments also lose owner state because callers omit `userId` in `src/app/api/v2/public/blog/[slug]/comments/route.ts:45-46` and `src/app/api/v2/user/comment/route.ts:65-68`, while `extendCommentFields` compares `doc.author.toString()` to the user ID in `src/lib/transforms/transformHelpers.ts:66-69`. | Add focused unit tests for each transformer. Make extenders return complete non-null values where the frontend type requires them, pass extenders consistently, and pass `userId` through populated comment/blog transforms. |
| Medium | Artwork image contracts have a sanitizer type/function, but public artwork transforms bypass it and expose persistence-only Cloudinary fields plus an undocumented route-only field. | `CloudinaryImageSanitized` omits `public_id` in `src/lib/data/types/cloudinaryTypes.ts:37-49`, and `transformImage` implements that sanitizer in `src/lib/transforms/artwork/transformImage.ts:7-24`. `transformArtwork` uses the generic document transformer in `src/lib/transforms/artwork/transformArtwork.ts:18-27`; public artwork sensitive fields only remove `favourited` and `watcherlist` in `src/lib/constants/publicDocumentConstants.ts:49-52`, so `image.public_id` remains in public artwork payloads. The color-proximity list route injects `image.similarityScore` at `src/app/api/v2/public/artwork/route.ts:102-109`, but `rg "similarityScore"` found no schema or type for that field. `cloudinaryImageSchema` also accepts `hexColors` and predominant color arrays as `z.any()` in `src/lib/data/schemas/cloudinarySchema.ts:10-14` despite the Mongoose schema and types requiring `{ color, percentage }` objects. | Decide whether public artwork responses should include Cloudinary `public_id`. If not, wire `transformImage` into artwork transforms. Model route-specific `similarityScore` as a typed optional field or move it outside the persisted image shape. Tighten Cloudinary Zod schemas to match `ColourInfo`. |
| Medium | Shopify product-link schema alignment remains unresolved from A-001. | `shopifyProducts` is present in the artwork model and TypeScript type in `src/lib/data/models/artworkModel.ts:23-30` and `src/lib/data/models/artworkModel.ts:97-107`, but artwork create/update schemas in `src/lib/data/schemas/artworkSchema.ts:7-45` still omit it. A-001 already recorded the missing admin workflow and validation in `docs/audits/results/A-001-shopify-commerce.md` and the findings register has F-010. | Do not create a duplicate register item. When F-010 is implemented, include A-003 requirements: schema validation, duplicate prevention, route transform coverage, and tests for public artwork/shop contracts. |

## Findings Register Updates

- Reconciled on 2026-05-14 into
  [findings-register.md](../findings-register.md).
- New converted findings: F-038, F-039, F-040, and F-041.
- Existing findings updated with A-003 evidence: F-010, F-012, F-015, and F-016.

## Risks Updated

- Updated on 2026-05-14:
  [production-readiness risks](../../risks/production-readiness.md) R-005,
  R-006, R-008, R-014, and R-023.

## Workstream Updates

- Updated on 2026-05-14:
  [Data Models and API](../../workstreams/data-models-and-api.md),
  [Testing and quality](../../workstreams/testing-and-quality.md),
  [Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md),
  and [Shopify commerce](../../workstreams/shopify-commerce.md).

## Next Action

Create the authoritative model/schema/type field matrix for core persisted
entities, then implement route validation and transform contract fixes in small
tested slices.

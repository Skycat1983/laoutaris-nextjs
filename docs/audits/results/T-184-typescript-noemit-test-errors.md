# T-184 TypeScript noEmit Test Errors

Date: 2026-05-20

Command:

```bash
npx tsc --noEmit --pretty false --skipLibCheck
```

Result: failed with 46 top-level diagnostics across 18 files. Every diagnostic
originates from `__tests__/`; no `src/` runtime file appeared as a top-level
compiler error.

## Classification

The current failure set is test-only. The failures mostly point to stale or
over-narrow test fixtures and helper typings rather than runtime source
contract drift.

## Diagnostic Counts

| Code | Count | Main category |
| --- | ---: | --- |
| TS2698 | 10 | Test fixtures cast to `never` and then spread |
| TS2353 | 9 | Article navigation mocks include stale `linkTo` fields |
| TS2352 | 8 | Admin read-route test handler casts do not model detail context |
| TS2739 | 7 | Collection navigation mocks omit required `_id` and `artworks` |
| TS2345 | 4 | Mock/helper argument type mismatches |
| TS2339 | 3 | `never`-typed artwork fixtures accessed for `shopifyProducts` |
| TS2540 | 2 | Tests assign directly to readonly `process.env.NODE_ENV` |
| TS2322 | 2 | Public navigation route mocks do not match returned DTO types |
| TS2802 | 1 | Import-boundary test iterates a `Set` in a way rejected by the project target |

## Representative Files

| File | Count | Notes |
| --- | ---: | --- |
| `__tests__/unit/api/adminReadRouteGuard.test.ts` | 8 | Shared `Handler` type uses `never` request/context, so detail handlers with required route params fail casts. |
| `__tests__/unit/loaders/ArticleLoader.test.tsx` | 4 | Article navigation service mocks still include `linkTo`, while the typed DTO exposes `_id`, `title`, and `slug`. |
| `__tests__/unit/api/publicNavigationRoutes.test.ts` | 2 | Article and collection navigation mock return values are missing current DTO fields. |
| `__tests__/unit/loaders/CollectionsSubnavLoader.test.tsx` | 2 | Collection navigation mocks omit `_id` and `artworks`. |
| `__tests__/unit/loaders/MainNavLoader.test.tsx` | 3 | Mixed article `linkTo` staleness and collection DTO omissions. |
| `__tests__/unit/pages/CollectionsPage.test.tsx` | 3 | Collection page mocks omit `_id` and `artworks`. |
| `__tests__/unit/loaders/ArtworkLoader.test.tsx` | 3 | `as never` fixture typing causes `shopifyProducts` property/spread failures. |
| `__tests__/unit/loaders/CollectionArtworkLoader.test.tsx` | 2 | Same artwork fixture typing issue as `ArtworkLoader`. |
| `__tests__/unit/forms/adminArticleBlogForms.test.tsx` | 3 | A `never`-typed `blogInfo` fixture is spread in year-option assertions. |
| `__tests__/unit/auth/sessionTestHeaders.test.ts` | 2 | Direct `process.env.NODE_ENV` assignment is rejected by current Node typings. |
| `__tests__/unit/db/dbHelpers.test.ts` | 1 | Mocked `dbConnect` implementation returns `Promise<void>` where the imported helper type allows the real Mongoose return. |
| `__tests__/unit/uploadButton.test.tsx` | 1 | Cloudinary callback widget mock is too partial for `CldUploadEventCallbackWidget`. |
| `__tests__/unit/security/clientServerImportBoundary.test.ts` | 1 | `[...visited]` over `Set<string>` conflicts with the current compiler target. |

## Follow-Up Sequence

1. Fix navigation DTO test fixtures first. This is the largest coherent group:
   article mocks should drop stale `linkTo`, and collection mocks should include
   `_id` plus `artworks` or use local typed fixture builders.
2. Fix over-narrow `never` fixtures in loader/form tests by introducing small
   typed fixture builders for artwork/blog objects, then update the affected
   spread/property assertions.
3. Fix isolated test-helper typing issues: admin read-route `Handler`, readonly
   `NODE_ENV` mutation, `dbConnect` mock return typing, the Cloudinary widget
   partial, and the import-boundary `Set` iteration.

Recommended next task: start with the navigation DTO fixtures because they
account for about 20 diagnostics and are all stale test data, not behavior
changes.

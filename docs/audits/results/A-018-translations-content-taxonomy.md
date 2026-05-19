# A-018 Translations, Copy, And Content Taxonomy Result

Status: Completed

Audit goal: [A-018 Translations, copy, and content taxonomy](../goals.md#a-018-translations-copy-and-content-taxonomy)

Workstream: [Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md)

## Summary

The app does not currently have a production-ready translation system. Translation
JSON exists in two locations, the active translation helper has no rendered
consumer, and the visible language picker is local UI state that does not change
page copy or document locale. Content taxonomy is more mature than translations:
core artwork, article, collection, blog, search, and shop enums exist in
constants and schemas. The main production gaps are drift between canonical
taxonomy constants and visible filters, hidden blog/collection taxonomy fields in
admin forms, unvalidated public section parameters, and live copy that still
contains placeholders or claims already flagged by A-020.

## Scope Inspected

- Required docs:
  - `docs/README.md`
  - `docs/audits/goals.md#a-018-translations-copy-and-content-taxonomy`
  - `docs/audits/README.md`
  - `docs/audits/results/README.md`
  - `docs/workstreams/content-assets-and-admin-ops.md`
  - `docs/workstreams/frontend-routes-and-components.md`
- Prior related context:
  - `docs/audits/results/A-014-unused-code-dependency-pruning.md`
  - `docs/audits/results/A-020-privacy-consent-commerce-compliance.md`
  - `docs/audits/findings-register.md` entry F-033
- Translation and language sources:
  - `src/lib/translations/`
  - `src/lib/constants/translations.json`
  - `src/lib/constants/translations/`
  - `src/lib/utils/translationUtils.ts`
  - `src/hooks/useLanguage.ts`
  - `src/contexts/GlobalFeaturesContext.tsx`
  - `src/components/compositions/TranslatedContent.tsx`
  - `src/components/modules/navigation/accountNav/AccountNav.tsx`
  - `src/app/layout.tsx`
- Taxonomy constants, schemas, models, APIs, and services:
  - `src/lib/constants/artworkConstants.ts`
  - `src/lib/constants/articleConstants.ts`
  - `src/lib/constants/blogConstants.ts`
  - `src/lib/constants/collectionConstants.ts`
  - `src/lib/data/schemas/*`
  - `src/lib/data/models/*`
  - `src/lib/data/services/getArticleList.ts`
  - `src/lib/data/services/getCollectionList.ts`
  - `src/lib/data/services/getPublicSearchResults.ts`
  - `src/app/api/v2/public/article/route.ts`
  - `src/app/api/v2/public/collection/route.ts`
  - `src/app/api/v2/public/navigation/articles/[section]/route.ts`
  - `src/app/api/v2/public/shop/products/route.ts`
- Public and admin taxonomy/copy UI:
  - `src/components/artwork/filters/ArtworkSortAndFilter.tsx`
  - `src/components/modules/filters/ShopFilters.tsx`
  - `src/components/compositions/ShopProductGallery.tsx`
  - `src/components/features/adminDashboard/inputs/*FilterDropdowns.tsx`
  - `src/components/features/adminDashboard/crudForms/create/*`
  - `src/components/features/adminDashboard/crudForms/update/*`
  - `src/components/features/adminDashboard/crudForms/read/*`
  - `src/components/modules/footer/Footer.tsx`
  - `src/components/modules/banners/SecurityBanners.tsx`

## Commands Run

- `sed -n '1,260p' docs/audits/goals.md`: confirmed A-018 status and scope.
- `sed -n '1,260p' docs/workstreams/content-assets-and-admin-ops.md` and
  `sed -n '1,280p' docs/workstreams/frontend-routes-and-components.md`:
  confirmed linked workstream context and existing i18n/taxonomy backlog.
- `rg --files | rg '(^|/)(messages|translations|translation|i18n|locales|locale|copy|constants|taxonomy|category|categories|labels|language|dictionary)'`:
  found translation, constant, taxonomy, and language files.
- `rg -n "getTranslation|validateTranslationKey|translations|useGlobalFeatures\(|language|changeLanguage" src ...`:
  found the translation helper consumed only by `TranslatedContent`, with
  global language state otherwise unused by rendered copy.
- `node -e "...flatten translation JSON..."`: counted 83 active flattened
  translation keys, 74 legacy `translations.json` keys, 24 legacy
  `src/lib/constants/translations/*.json` keys, and 0 missing active
  `en`/`de`/`fr` values.
- `rg -n "section|BLOG_TAGS|tags|pinned|featured|ARTICLE_SECTION_OPTIONS|COLLECTION_SECTIONS|artstyle|medium|surface|decade|productType|showOriginals|showPrints|showBooks|SearchableContentType|SEARCH_CONTENT_TYPES|type:" src/app src/components src/lib/data src/lib/api src/lib/constants`:
  mapped taxonomy values across constants, schemas, services, APIs, and UI.
- Targeted `sed`/`nl -ba` reads of the files listed in Scope Inspected:
  captured line-level evidence for each finding.
- `rg -n "TODO|To do|Lorem|lorem|placeholder|coming soon|Coming Soon|donate|Donate|Expert Support|Safe Payments|Verified Artists|Secure Platform|safe delivery|checkout|cart|shipping|refund|payment|In Stock|Limited edition|Original artworks" src/components src/app src/lib/constants src/lib/translations docs/audits/results/A-020-privacy-consent-commerce-compliance.md docs/audits/results/A-001-shopify-commerce.md docs/audits/results/A-010-performance-seo-accessibility.md`:
  checked placeholder and commerce-related public copy.
- `git status --short`: confirmed a dirty worktree with many unrelated files;
  this audit edited only this result file.
- Tests were not run; this is a documentation-only audit with non-mutating
  source inspection.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| Medium | Visible language UI is not wired to rendered translations, while the app still carries unused translation assets. | `src/lib/translations/index.ts:3-39` flattens active category JSON, `src/lib/utils/translationUtils.ts:5-24` exposes lookup helpers, and `src/components/compositions/TranslatedContent.tsx:1-9` is the only rendered component that consumes them. Targeted search found no `TranslatedContent` usage. `src/hooks/useLanguage.ts:10-17` defaults global language state to `fr`, `src/contexts/GlobalFeaturesContext.tsx:9-17` defaults the context to `en`, and `src/app/layout.tsx:52-53` hard-codes `<html lang="en">`. Separately, `src/components/modules/navigation/accountNav/AccountNav.tsx:37` initializes a local `selectedLanguage` value of `"eng"` and only updates that local state through the DE/EN/FR radio group at `src/components/modules/navigation/accountNav/AccountNav.tsx:103-117`. `package.json:20-60` has no i18n framework dependency. `src/lib/constants/translations/index.ts` and `src/lib/constants/translations/navigation.json` are empty, while `src/lib/constants/translations.json:1-40` is a legacy flat translation source. | Reconcile F-033 with a product decision: either remove the visible language picker and unused translation pipeline for launch, or implement one canonical i18n path that owns locale routing/document `lang`, copy lookup, persistence, tests, and translation data. |
| Medium | Public shop filters drift from the canonical artwork taxonomy, so backed values cannot be selected from the UI. | Canonical artwork values include decade `"2020s"` at `src/lib/constants/artworkConstants.ts:1-10` and mediums `"paint"` and `"pastel"` at `src/lib/constants/artworkConstants.ts:16-26`. The shop API query schema accepts those constants through `DECADE_OPTIONS` and `MEDIUM_OPTIONS` in `src/lib/data/schemas/shopProductListQuerySchema.ts:1-7` and `src/lib/data/schemas/shopProductListQuerySchema.ts:60-75`. The visible shop filter omits `paint`, `pastel`, and `2020s` in `src/components/modules/filters/ShopFilters.tsx:52-61` and `src/components/modules/filters/ShopFilters.tsx:89-98`. Other artwork UI still repeats the arrays manually, for example admin create artwork in `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx:123-132` and `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx:192-202`, plus admin read filters in `src/components/features/adminDashboard/inputs/ArtworkFilterDropdowns.tsx:14-38`. | Create shared value+label option builders for artwork taxonomy and use them in public artwork filters, shop filters, admin forms, and read-list filters. Add focused tests that compare rendered/selectable options against the canonical constants. |
| Medium | Blog metadata taxonomy exists server-side, but admin operators cannot manage it and read filters are stale. | `BLOG_TAGS` defines `project`, `family`, `artwork`, `news`, `events`, `exhibitions`, and `artists` in `src/lib/constants/blogConstants.ts:1-9`. `src/lib/data/schemas/blogSchema.ts:48-50` validates tags, `src/lib/data/schemas/blogSchema.ts:88-90` includes `featured`, `pinned`, and `tags`, and route schemas accept `pinned`/`tags` at `src/lib/data/schemas/blogSchema.ts:118-140`. The visible create and update form schemas omit `pinned` and `tags` at `src/lib/data/schemas/blogSchema.ts:94-114`, the create form only renders `displayDate`, content fields, and `featured` at `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx:87-248`, and the update form keeps `// tags: blogInfo.tags` commented out at `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx:40-51`. The admin blog read filter hard-codes years only through 2024 in `src/components/features/adminDashboard/inputs/BlogFilterDropdowns.tsx:14-17`, while create/update year pickers dynamically allow 1900 through the current year in `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx:114-123` and `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx:118-127`. | Add visible admin controls for approved blog tags and pinned status or remove/defer those fields from the launch taxonomy. Replace fixed blog read-list year options with data-derived or current-year-bounded options and cover them with tests. |
| Medium | Collection section taxonomy is accepted by schemas/routes but hidden from admin workflows and weakly validated at public boundaries. | `COLLECTION_SECTIONS` allows `"artwork"`, `"biography"`, `"project"`, and `"collections"` in `src/lib/constants/collectionConstants.ts:1-6`. `createCollectionSchema` defaults `section` to `"collections"` in `src/lib/data/schemas/collectionSchema.ts:67-73`, and the update route schema accepts `section` in `src/lib/data/schemas/collectionSchema.ts:91-106`. The create collection form default values do not include a section field and render no section selector at `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx:44-52` and `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx:83-178`; the update collection form also omits section from defaults and rendered fields at `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx:56-64` and `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx:159-247`. Public collection and article list routes pass raw `section` query values into services at `src/app/api/v2/public/collection/route.ts:17-26` and `src/app/api/v2/public/article/route.ts:15-26`; the services type those params as `CollectionSection | string | null` and `ArticleSection | string | null` in `src/lib/data/services/getCollectionList.ts:17-35` and `src/lib/data/services/getArticleList.ts:10-30`. The article navigation route annotates `params.section` as `ArticleSection` but does not runtime-validate it before `getArticleNavigationList(section)` at `src/app/api/v2/public/navigation/articles/[section]/route.ts:13-25`. | Decide whether non-`collections` collection sections are a real content feature. If yes, expose/admin-document section management and add route-local section validation; if no, collapse the collection taxonomy to the currently supported `"collections"` value and reject other values consistently. |
| Low | Live copy still contains placeholder social links and stale/static footer text, while broader commerce assurance copy is already tracked elsewhere. | The footer renders Facebook/Twitter/Instagram anchors with `href="#"` at `src/components/modules/footer/Footer.tsx:29-39` and a fixed `© 2024` string at `src/components/modules/footer/Footer.tsx:42-45`. The same live footer imports `SecurityBannerGrey` at `src/components/modules/footer/Footer.tsx:1-7`; A-020 already tracks policy-page gaps, placeholder social links, and commerce assurance copy ahead of checkout/policy pages in `docs/audits/results/A-020-privacy-consent-commerce-compliance.md:144-150`. `SecurityBannerGrey` still renders claims such as "Secure Platform", "Safe Payments", and "Safe Delivery" at `src/components/modules/banners/SecurityBanners.tsx:116-157`. | Clean up footer copy in a frontend/content task: remove or replace placeholder social links, make copyright current or owner-approved, and avoid duplicating A-020 commerce/legal copy work except to consume the owner-approved outcome. |

## Findings Register Updates

Shared trackers are orchestrator-owned in concurrent audit mode, so this audit
does not edit `docs/audits/findings-register.md` directly.

Candidate findings for reconciliation:

| Source | Severity | Suggested finding | Evidence | Suggested routing |
| --- | --- | --- | --- | --- |
| A-018 | Medium | Visible language UI is not wired to rendered translations, while unused translation assets remain. | `src/lib/translations/index.ts:3-39`; `src/components/compositions/TranslatedContent.tsx:1-9`; `src/hooks/useLanguage.ts:10-17`; `src/contexts/GlobalFeaturesContext.tsx:9-17`; `src/components/modules/navigation/accountNav/AccountNav.tsx:37-117`; `src/app/layout.tsx:52-53`; `package.json:20-60`. | Existing F-033; content/admin and frontend workstreams. |
| A-018 | Medium | Public shop filter options drift from canonical artwork taxonomy. | `src/lib/constants/artworkConstants.ts:1-26`; `src/lib/data/schemas/shopProductListQuerySchema.ts:60-75`; `src/components/modules/filters/ShopFilters.tsx:52-61`; `src/components/modules/filters/ShopFilters.tsx:89-98`. | Content/admin, frontend, Shopify commerce, and testing workstreams. |
| A-018 | Medium | Blog tags/pinned taxonomy is server-side only and admin blog year filters are stale. | `src/lib/constants/blogConstants.ts:1-9`; `src/lib/data/schemas/blogSchema.ts:48-50`; `src/lib/data/schemas/blogSchema.ts:88-140`; `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx:87-248`; `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx:40-51`; `src/components/features/adminDashboard/inputs/BlogFilterDropdowns.tsx:14-17`. | Content/admin and frontend workstreams. |
| A-018 | Medium | Collection/article section parameters need a single taxonomy policy and runtime validation. | `src/lib/constants/collectionConstants.ts:1-6`; `src/lib/data/schemas/collectionSchema.ts:67-106`; `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx:44-178`; `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx:56-247`; `src/app/api/v2/public/collection/route.ts:17-26`; `src/app/api/v2/public/article/route.ts:15-26`; `src/app/api/v2/public/navigation/articles/[section]/route.ts:13-25`. | Content/admin, data/API, frontend, and testing workstreams. |
| A-018 | Low | Footer copy has placeholder social links and stale copyright text. | `src/components/modules/footer/Footer.tsx:29-45`; related A-020 copy/legal findings at `docs/audits/results/A-020-privacy-consent-commerce-compliance.md:144-150`. | Frontend and content/admin workstreams; coordinate with A-020/R-018 for legal/commerce copy. |

## Risks Updated

- None. This audit did not edit shared risk files.
- Existing risk context to use during reconciliation:
  - F-033 already tracks the mostly unused translation pipeline.
  - R-018/A-020 already track policy-page and commerce assurance-copy gaps.

## Workstream Updates

- None. This audit did not edit shared workstream files.
- Candidate workstream updates:
  - Content/admin backlog: reconcile translation launch scope, blog metadata
    controls, collection section ownership, and taxonomy option source of truth.
  - Frontend backlog: remove or implement language picker behavior, centralize
    taxonomy labels/options, and clean up footer copy.
  - Testing backlog: add option parity tests comparing rendered taxonomy controls
    against canonical constants.

## Next Action

Reconcile the A-018 candidate findings into the findings register. The first
implementation decision should be the language direction: remove the inactive
language UI/translation pipeline for launch, or make i18n real before any
taxonomy-label centralization depends on it.

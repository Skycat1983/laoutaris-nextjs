# A-016 Forms, Validation, And User Input Result

Status: Completed

Audit goal: [A-016 Forms, validation, and user input](../goals.md#a-016-forms-validation-and-user-input)

Workstream: [Data models and API](../../workstreams/data-models-and-api.md)

## Summary

Public, user, and admin input flows use a mixture of React Hook Form/Zod,
server actions, direct NextAuth calls, raw JSON routes, and Mongoose validation.
The main pattern is client-side validation without an equivalent server-side
validation boundary. Several write paths persist raw request bodies or route
params, validation failures are often returned as 500s or body-only status
fields, and the current sign-in/comment/subscription flows have user-visible
failure modes. Accessibility is strongest in the shadcn form controls and weakest
in legacy auth/search controls and icon-only actions.

## Scope Inspected

- Required docs: `AGENTS.md`, `docs/README.md`,
  `docs/audits/goals.md#a-016-forms-validation-and-user-input`,
  `docs/audits/README.md`, `docs/audits/results/README.md`,
  `docs/workstreams/data-models-and-api.md`,
  `docs/workstreams/auth-admin-and-permissions.md`, and
  `docs/architecture/routes-and-api.md`.
- Public input flows:
  - Contact/enquiry: `src/components/modules/forms/user/ContactForm.tsx`,
    `src/components/modules/forms/user/EnquiryForm.tsx`,
    `src/app/api/v2/public/enquiry/route.ts`, and
    `src/lib/data/models/enquiryModel.ts`.
  - Subscribe: `src/components/modules/forms/user/SubscribeForm.tsx`,
    `src/lib/actions/submitSubscription.ts`,
    `src/lib/data/schemas/subscriberSchema.ts`, and
    `src/lib/data/models/subscribersModel.ts`.
  - Search/filtering: `src/components/elements/inputs/Searchbar.tsx`,
    `src/components/modules/search/SearchDrawer.tsx`,
    `src/components/artwork/filters/ArtworkSortAndFilter.tsx`,
    `src/components/modules/filters/ShopFilters.tsx`,
    `src/app/api/v2/public/search/route.ts`,
    `src/app/api/v2/public/artwork/route.ts`, and
    `src/app/api/v2/public/shop/products/route.ts`.
- User input flows:
  - Auth forms/actions: `src/components/modules/forms/user/SignInForm.tsx`,
    `src/components/modules/forms/user/SignInFormBackup.tsx`,
    `src/components/modules/forms/user/SignUpForm.tsx`,
    `src/lib/actions/processLogin.ts`,
    `src/lib/actions/processRegistration.ts`,
    `src/lib/validation/validateLoginData.ts`,
    `src/lib/validation/validateRegistrationData.ts`, and
    `src/lib/data/schemas/userSchema.ts`.
  - Comments: `src/components/modules/forms/user/CommentForm.tsx`,
    `src/components/modules/cards/CommentCard.tsx`,
    `src/lib/data/schemas/commentSchema.ts`,
    `src/app/api/v2/user/comment/route.ts`, and
    `src/app/api/v2/user/comment/[commentId]/route.ts`.
  - Favourites/watchlist: `src/components/elements/buttons/FavouritesButton.tsx`,
    `src/components/elements/buttons/WatchlistButton.tsx`,
    `src/lib/actions/updateUserFavourites.ts`, and
    `src/lib/actions/updateUserWatchlist.ts`.
- Admin input flows:
  - Create/update forms for article, artwork, blog, and collection under
    `src/components/features/adminDashboard/crudForms/`.
  - Admin create/update/delete routes under `src/app/api/v2/admin/`.
  - Cloudinary upload signing: `src/components/elements/buttons/UploadButton.tsx`
    and `src/app/api/v2/admin/sign-cloudinary-params/route.ts`.
- Existing tests searched under `__tests__` and `src` for covered input flows.

## Commands Run

- `sed -n '1,220p' AGENTS.md`: read repo instructions.
- `sed -n '1,240p' docs/README.md`: read documentation index.
- `sed -n '252,266p' docs/audits/goals.md`: read A-016 assignment.
- `sed -n '1,220p' docs/audits/README.md`: read audit workflow.
- `sed -n '1,260p' docs/workstreams/data-models-and-api.md`: read primary
  workstream.
- `sed -n '1,280p' docs/workstreams/auth-admin-and-permissions.md`: read auth
  dependency workstream.
- `sed -n '1,260p' docs/architecture/routes-and-api.md`: read route/API map.
- `rg --files src/app src/components src/lib | sort`: inventory app, component,
  API, action, schema, and model files.
- `rg -n "<form|onSubmit|useForm|FormData|safeParse|zod|validator|sanitize|dangerouslySetInnerHTML|fetch\\(|axios|method: \\\"(POST|PUT|PATCH|DELETE)\\\"|method: '(POST|PUT|PATCH|DELETE)'" src/components src/app src/lib --glob '!*.json'`:
  locate form, validation, fetch, and sanitization hotspots.
- `rg -n "export async function (POST|PUT|PATCH|DELETE)|export const (POST|PUT|PATCH|DELETE)" src/app/api src/lib/actions`:
  locate write route handlers and server actions.
- `rg -n "required|minlength|maxlength|min=|max=|pattern=|aria-|htmlFor|id=|name=|type=\\\"(email|password|text|number|date|url|checkbox|radio|file|search)\\\"" src/components src/app --glob '!*.json'`:
  inspect form accessibility and HTML validation signals.
- `rg -n "runValidators|validateBeforeSave|required:|maxlength|minlength|match:|enum:|trim:|lowercase|unique" src/lib/data/schemas src/lib/data/models`:
  inspect persistence validation.
- `rg -n "CommentForm|createComment|EnquiryForm|ContactForm|SubscribeForm|SignInForm|SignUpForm|Searchbar|SearchDrawer|FavouritesButton|WatchlistButton" src/app src/components src/lib --glob '!*.json'`:
  map forms to consumers.
- `rg -n "clientApi\\.admin|clientAdminApi|admin\\.create|admin\\.update|admin\\.delete|delete[A-Z]|patch[A-Z]" src/components/features/adminDashboard src/lib/api --glob '!*.json'`:
  map admin forms to fetchers.
- `rg -n "dbConnect\\(|mongoose\\.connect|startSession\\(|findByIdAndUpdate\\(|Model\\.create|\\.save\\(\\)" src/app/api/v2 src/lib/actions`:
  inspect persistence ownership.
- `rg -n "ZodError|\\.parse\\(|safeParse\\(|runValidators|isValidObjectId|encodeURIComponent|new RegExp|request\\.json\\(\\)|formData\\.get" src/app/api/v2 src/lib/actions src/components/features/adminDashboard src/components/modules/forms src/components/elements/buttons src/components/elements/inputs src/components/modules/search`:
  inspect validation and request parsing.
- `rg -n "enquiry|subscribe|comment|CreateArticle|CreateArtwork|CreateBlog|CreateCollection|search" __tests__ src --glob '*test*' --glob '*spec*'`:
  searched test coverage for audited flows.
- Targeted `sed` and `nl -ba` reads on the files listed in Scope Inspected:
  gathered line-level evidence for findings.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Public contact/enquiry validation exists only in the client and the API persists raw request bodies. | `ContactForm` validates name/email/subject/message with a local Zod schema before calling `clientApi.public.enquiry.create` (`src/components/modules/forms/user/ContactForm.tsx:32-68`), and `EnquiryForm` has a similar local schema. The route reads arbitrary JSON and passes it directly to `EnquiryModel.create(body)` (`src/app/api/v2/public/enquiry/route.ts:8-10`), logs the body (`src/app/api/v2/public/enquiry/route.ts:19`), returns error payloads without real HTTP status options (`src/app/api/v2/public/enquiry/route.ts:12-31`), and the Mongoose model only marks fields required without email format, trim, length, or sanitization rules (`src/lib/data/models/enquiryModel.ts:15-20`). | Add a shared enquiry schema used by both forms and route, validate with `safeParse`, trim fields, return HTTP 400 with field errors, remove body logging, add `dbConnect()`, and persist only the validated DTO. Add route tests for invalid email, short fields, success, and duplicate/retry behavior if needed. |
| High | User comment creation is currently broken for normal submissions and does not enforce the existing comment schema at the route boundary. | `CommentForm` uses `createCommentSchema` with trim/max-length rules (`src/components/modules/forms/user/CommentForm.tsx:24-36`; schema at `src/lib/data/schemas/commentSchema.ts:3-15`). `POST /api/v2/user/comment` calls `req.json()` before `try` and then calls `req.json()` again inside `try` (`src/app/api/v2/user/comment/route.ts:93-109`), so a real request body is consumed twice. The route does not parse `createCommentSchema`, creates the comment from raw `text`/`blogSlug` (`src/app/api/v2/user/comment/route.ts:115-137`), returns body-only `statusCode` values instead of HTTP statuses (`src/app/api/v2/user/comment/route.ts:100-123`, `src/app/api/v2/user/comment/route.ts:165-171`), and returns a raw comment document (`src/app/api/v2/user/comment/route.ts:155-158`). | Fix the double body read, validate once with a shared API schema, return 401/400/404/500 as actual statuses, transform the created comment DTO, and add focused route tests for unauthenticated, malformed body, invalid/unknown blog slug, success, and transaction rollback. |
| High | Admin create/update routes do not have a consistent server-side validation policy, and invalid admin input often becomes a 500. | Article/artwork/blog create routes call Zod `.parse(...)` inside broad catch blocks that return HTTP 500 (`src/app/api/v2/admin/article/create/route.ts:25-55`, `src/app/api/v2/admin/artwork/create/route.ts:24-61`, `src/app/api/v2/admin/blog/create/route.ts:26-52`). Collection create accepts raw body data and saves it without parsing `createCollectionSchema` (`src/app/api/v2/admin/collection/create/route.ts:26-45`). Article/artwork update accept arbitrary JSON and pass it to `$set` without schema parsing or `runValidators` (`src/app/api/v2/admin/article/update/[id]/route.ts:24-61`, `src/app/api/v2/admin/artwork/update/[id]/route.ts:24-57`). Collection update assigns raw update fields and saves them (`src/app/api/v2/admin/collection/update/[id]/route.ts:24-57`). | Introduce shared admin route parsing helpers that use `safeParse`, return structured HTTP 400 field errors, validate ObjectId params, and pass only allowlisted update fields to persistence. Apply route tests by content type before changing all admin routes. |
| High | Legacy sign-in forms are wired around validation state but submit via `signIn()` without passing form values, so username/email/password input is not actually validated by the displayed form path. | Current account navigation opens `SignInForm` (`src/components/modules/navigation/accountNav/AccountNav.tsx:159-164`). `SignInForm` initializes `useFormState(() => signIn(), initialState)` but renders `<form action={() => signIn()}>` and does not pass `username` or `password` values to NextAuth (`src/components/modules/forms/user/SignInForm.tsx:19-40`). The validation/error display is commented out (`src/components/modules/forms/user/SignInForm.tsx:42-56`). `SignInFormBackup` initializes `useFormState(processLogin, initialState)` but also renders `<form action={() => signIn()}>`, bypassing `processLogin` (`src/components/modules/forms/user/SignInFormBackup.tsx:20-44`). `processLogin` validates `email/password` (`src/lib/actions/processLogin.ts:44-48`), while the current form labels the field `username` (`src/components/modules/forms/user/SignInForm.tsx:35-40`). | Choose one sign-in path: either a credentials form that calls `signIn("credentials", { username/email, password, redirect: false })` with field errors, or a server action that validates and authenticates consistently. Remove the stale backup after tests cover credentials success, bad credentials, validation errors, and OAuth/provider entry points. |
| Medium | Subscription client validation is not connected to the server action, and server persistence accepts any non-empty email string. | `SubscribeForm` creates a React Hook Form resolver from `subscriberSchema` (`src/components/modules/forms/user/SubscribeForm.tsx:32-39`), but the rendered form submits directly through `action={formAction}` rather than `form.handleSubmit`, and the file comments note errors are not reflected (`src/components/modules/forms/user/SubscribeForm.tsx:24-43`). `submitSubscription` only checks `if (!email)` before `SubscriberModel.findOne` and `SubscriberModel.create` (`src/lib/actions/submitSubscription.ts:17-39`), and the subscriber model only requires unique email without format/trim/lowercase rules. | Validate `FormData` with `subscriberSchema.safeParse` in the server action, normalize email to lowercase/trimmed, add `dbConnect()`, return stable duplicate/validation messages, and either wire RHF submission correctly or remove unused client resolver state. Add unit tests for invalid email, duplicate email, normalized success, and DB failure. |
| Medium | Search and filter endpoints trust query parameters enough to create regexes and Mongo filters without bounded validation. | `Searchbar` trims non-empty input before navigation (`src/components/elements/inputs/Searchbar.tsx:13-24`), but `GET /api/v2/public/search` reads raw `q`, `page`, and `limit` values, then builds `new RegExp(query, "i")` without escaping or length bounds (`src/app/api/v2/public/search/route.ts:17-35`). Artwork and shop product routes accept repeated `decade`, `artstyle`, `medium`, and `surface` params directly into `$in` conditions without enum validation (`src/app/api/v2/public/artwork/route.ts:17-48`, `src/app/api/v2/public/shop/products/route.ts:21-39`). Shop UI exposes controlled select values, but the API remains directly callable with arbitrary params (`src/components/modules/filters/ShopFilters.tsx:29-130`). | Add shared query schemas for search, artwork browse, and shop browse. Escape or replace regex search with a safe text-search strategy, cap query length and limit/page ranges, enum-check filters, and add tests for bad regex input, excessive limit, unknown filters, and valid multi-filter queries. |
| Medium | Comment edit uses the existing Zod schema in the client, but the route only checks non-empty text and persists the raw value. | `CommentCard` initializes `updateCommentSchema` with max length/trim (`src/components/modules/cards/CommentCard.tsx:45-52`; schema at `src/lib/data/schemas/commentSchema.ts:17-20`) but `handleEdit` reads `form.getValues()` and calls the API directly (`src/components/modules/cards/CommentCard.tsx:60-72`). The PATCH route only checks `!text?.trim()` (`src/app/api/v2/user/comment/[commentId]/route.ts:37-43`) and then writes `{ $set: { text } }` without trimming, max length, or transformed response (`src/app/api/v2/user/comment/[commentId]/route.ts:62-72`). | Submit edits through `form.handleSubmit`, parse `updateCommentSchema` on the route, persist the parsed trimmed text, return a transformed comment DTO, and test overlong text, whitespace-only text, forbidden edits, and success. |
| Medium | Several input controls are not fully keyboard or screen-reader accessible. | The desktop search icon is a clickable `<div>` with no button semantics or keyboard handler (`src/components/elements/inputs/Searchbar.tsx:40-45`). Mobile search uses `DrawerTrigger asChild` around a bare `Search` SVG without an accessible name (`src/components/modules/search/SearchDrawer.tsx:39-41`). Current sign-in inputs rely on placeholders and `id` attributes but have no labels (`src/components/modules/forms/user/SignInForm.tsx:33-54`). Comment edit/delete icon buttons render only icons without explicit labels (`src/components/modules/cards/CommentCard.tsx:116-131`). | Replace clickable non-buttons with `button` elements, add `aria-label` or visible labels for icon-only controls, pair legacy auth inputs with `<label htmlFor>`, and include keyboard/screen-reader checks when refactoring each form. |
| Medium | Input flow tests are missing for the audited validation and persistence boundaries. | The targeted test search found only Home subscribe-section rendering mocks, `urlUtils`, and `userUtils`; it found no route/action tests for enquiry, subscription, comment create/update, search query validation, or admin create/update forms/routes. Existing A-002/A-003 findings already identify adjacent contract and DTO gaps. | Before broad form refactors, add route/action tests for one public write flow, one user-owned write flow, and one admin create/update route. Use those patterns to cover the rest of the validation helpers. |

## Findings Register Updates

Reconciled by the orchestrator on 2026-05-14 into F-055 through F-062, with a
source update to existing F-016.

Candidate findings retained for audit trace:

| Source | Severity | Suggested finding | Evidence | Suggested routing |
| --- | --- | --- | --- | --- |
| A-016 | High | Public enquiry accepts and logs raw request bodies without route validation. | `src/app/api/v2/public/enquiry/route.ts:8-31`; `src/components/modules/forms/user/ContactForm.tsx:32-68`; `src/lib/data/models/enquiryModel.ts:15-20`. | Data/API workstream; production risk R-015. |
| A-016 | High | User comment create reads the request body twice and bypasses the existing schema. | `src/app/api/v2/user/comment/route.ts:93-171`; `src/lib/data/schemas/commentSchema.ts:3-15`. | Data/API and auth/admin workstreams; production risks R-006/R-015. |
| A-016 | High | Admin create/update route validation is inconsistent and invalid input often returns 500. | `src/app/api/v2/admin/article/create/route.ts:25-55`; `src/app/api/v2/admin/collection/create/route.ts:26-45`; `src/app/api/v2/admin/article/update/[id]/route.ts:24-61`; `src/app/api/v2/admin/artwork/update/[id]/route.ts:24-57`. | Data/API workstream; production risks R-006/R-015. |
| A-016 | High | Current sign-in UI bypasses the validation/auth action path and calls `signIn()` without field values. | `src/components/modules/navigation/accountNav/AccountNav.tsx:159-164`; `src/components/modules/forms/user/SignInForm.tsx:19-40`; `src/components/modules/forms/user/SignInFormBackup.tsx:20-44`; `src/lib/actions/processLogin.ts:44-48`. | Auth/admin workstream; production risk R-015. |
| A-016 | Medium | Subscription server action accepts any non-empty email string. | `src/components/modules/forms/user/SubscribeForm.tsx:24-43`; `src/lib/actions/submitSubscription.ts:17-39`; `src/lib/data/models/subscribersModel.ts`. | Data/API workstream; production risk R-015. |
| A-016 | Medium | Public search and browse APIs need query parsing and bounds. | `src/app/api/v2/public/search/route.ts:17-35`; `src/app/api/v2/public/artwork/route.ts:17-48`; `src/app/api/v2/public/shop/products/route.ts:21-39`. | Data/API and frontend workstreams; production risk R-015. |
| A-016 | Medium | Comment edit route bypasses the max-length/trim schema used by the UI. | `src/components/modules/cards/CommentCard.tsx:45-72`; `src/app/api/v2/user/comment/[commentId]/route.ts:37-72`. | Data/API and auth/admin workstreams; production risk R-015. |
| A-016 | Medium | Legacy auth/search/comment controls need accessible labels and button semantics. | `src/components/elements/inputs/Searchbar.tsx:40-45`; `src/components/modules/search/SearchDrawer.tsx:39-41`; `src/components/modules/forms/user/SignInForm.tsx:33-54`; `src/components/modules/cards/CommentCard.tsx:116-131`. | Frontend and auth/admin workstreams; production risk R-015. |
| A-016 | Medium | Validation/persistence tests are missing for audited input flows. | `rg -n "enquiry|subscribe|comment|CreateArticle|CreateArtwork|CreateBlog|CreateCollection|search" __tests__ src --glob '*test*' --glob '*spec*'` returned only Home subscribe-section rendering mocks and unrelated utility tests. | Testing/quality and Data/API workstreams; production risks R-005/R-015. |

## Risks Updated

- Reconciled by the orchestrator on 2026-05-14.
- Updated R-005 for input-flow test gaps.
- Updated R-006 for validation, public-safe errors, and route contract gaps.
- Updated R-015 from a pending audit risk to confirmed public, user, and admin
  input validation/accessibility gaps.

## Workstream Updates

- Reconciled by the orchestrator on 2026-05-14.
- Updated [Data/API](../../workstreams/data-models-and-api.md),
  [Auth/admin](../../workstreams/auth-admin-and-permissions.md),
  [Frontend](../../workstreams/frontend-routes-and-components.md),
  [Content/admin](../../workstreams/content-assets-and-admin-ops.md), and
  [Testing/quality](../../workstreams/testing-and-quality.md).
- Created [T-010](../../tasks/T-010-public-enquiry-validation.md) for the first
  public input validation implementation slice.

## Completion Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read canonical instructions and docs before audit. | Commands read `AGENTS.md`, `docs/README.md`, audit workflow docs, A-016 goal, Data/API workstream, Auth/Admin workstream, and Routes/API architecture. | Complete |
| Audit public input flows. | Contact/enquiry, subscribe, search, artwork filters, and shop filters inspected with form, route/action, model, and test evidence. | Complete |
| Audit user input flows. | Sign-in/sign-up, comments, favourites, watchlist, and profile surface inspected; findings cover auth and comments, while favourites/watchlist reuse already-reconciled DB/revalidation gaps from A-015/A-004. | Complete |
| Audit admin input flows. | Admin create/update/delete forms, fetchers, routes, schemas, and Cloudinary signing route inspected. | Complete |
| Cover validation consistency. | Findings identify client-only validation, parse-to-500 routes, raw route updates, and missing query schemas. | Complete |
| Cover error handling. | Findings identify body-only status fields, broad 500s, and missing structured validation errors. | Complete |
| Cover sanitization/normalization. | Findings identify raw persistence, missing trim/lowercase/email normalization, raw regex construction, and raw update payloads. | Complete |
| Cover accessibility. | Scope inspected ARIA/labels; findings note shadcn controls are generally stronger while legacy auth/search/icon actions need cleanup as part of accepted form rewrites. | Complete |
| Cover API persistence behavior. | Findings point to `Model.create`, `.save()`, `findByIdAndUpdate`, raw bodies, transactions, and missing DTO transforms in write paths. | Complete |
| Produce expected result file. | This file is the expected output: `docs/audits/results/A-016-forms-validation-inputs.md`. | Complete |
| Preserve shared-file ownership. | Shared findings/risk/workstream updates are listed as candidates only. | Complete |

## Next Action

Run [T-010](../../tasks/T-010-public-enquiry-validation.md), then use its
schema/error pattern for comment and admin write validation tasks.

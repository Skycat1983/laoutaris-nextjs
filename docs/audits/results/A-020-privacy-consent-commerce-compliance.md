# A-020 Privacy, Consent, And Commerce Compliance Result

Status: Completed

Audit goal: [A-020 Privacy, consent, and commerce compliance](../goals.md#a-020-privacy-consent-and-commerce-compliance)

Workstream: [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md)

## Summary

The app collects personal data through account registration, OAuth sign-in,
newsletter subscription, public contact/enquiry, user comments, saved artwork
lists, and admin-managed user/comment records. The highest-risk compliance gaps
are policy and consent gaps rather than raw validation bugs: there are no public
privacy, cookie, terms, sale, refund, shipping, or unsubscribe pages; forms do
not link to a privacy notice or record consent/source metadata; comments are
publicly displayed with usernames without a clear posting notice; and account
self-service privacy actions are not implemented.

Commerce remains intentionally limited to a Shopify-backed product browse plus
contact enquiry handoff, but the handoff does not carry product context into the
contact form payload. The UI also advertises payment, buyer-protection, and
shipping assurances without corresponding public policy pages or an implemented
checkout/cart. This report identifies items for owner/legal review only and does
not make legal conclusions.

## Scope Inspected

- Required docs: `AGENTS.md`, `docs/README.md`,
  `docs/audits/goals.md#a-020-privacy-consent-and-commerce-compliance`,
  `docs/audits/README.md`, `docs/audits/results/README.md`,
  `docs/workstreams/deployment-security-and-observability.md`,
  `docs/workstreams/auth-admin-and-permissions.md`,
  `docs/workstreams/shopify-commerce.md`,
  `docs/architecture/system-overview.md`,
  `docs/architecture/routes-and-api.md`,
  `docs/architecture/shopify-commerce.md`,
  `docs/runbooks/auth.md`, `docs/runbooks/environment.md`,
  `docs/runbooks/deployment.md`, `docs/runbooks/shopify-operations.md`, and
  `docs/risks/production-readiness.md`.
- Public policy/navigation surface: `src/app/project/layout.tsx`,
  `src/components/modules/footer/Footer.tsx`, `public/`, and route directories
  under `src/app`.
- Contact/enquiry: `src/app/project/contact/page.tsx`,
  `src/components/modules/forms/user/ContactForm.tsx`,
  `src/components/modules/forms/user/EnquiryForm.tsx`,
  `src/app/api/v2/public/enquiry/route.ts`,
  `src/lib/data/schemas/enquirySchema.ts`, and
  `src/lib/data/models/enquiryModel.ts`.
- Newsletter subscription: `src/components/sections/SubscribeSection.tsx`,
  `src/components/modules/forms/user/SubscribeForm.tsx`,
  `src/lib/actions/submitSubscription.ts`,
  `src/lib/data/schemas/subscriberSchema.ts`,
  `src/lib/data/models/subscribersModel.ts`,
  `src/lib/data/types/subscriberTypes.ts`, and
  `__tests__/unit/actions/submitSubscription.test.ts`.
- Account/auth/session data: `src/lib/data/models/userModel.ts`,
  `src/components/modules/forms/user/SignUpForm.tsx`,
  `src/components/modules/forms/user/SignInForm.tsx`,
  `src/components/modules/forms/user/LogoutForm.tsx`,
  `src/lib/actions/processRegistration.ts`,
  `src/lib/actions/registerUser.ts`,
  `src/lib/actions/authenticateUser.ts`,
  `src/lib/config/authOptions.ts`,
  `src/lib/config/authCallbacks.ts`, `src/lib/db/adapter.ts`,
  `src/app/layout.tsx`, `src/contexts/ClientContextBoundary.tsx`,
  `src/middleware.ts`, `src/lib/api/requireApiUser.ts`, and
  `src/lib/api/requireApiAdmin.ts`.
- Comments and user-generated content: `src/components/views/BlogDetail.tsx`,
  `src/components/modules/forms/user/CommentForm.tsx`,
  `src/components/modules/cards/CommentCard.tsx`,
  `src/components/sections/BlogCommentsList.tsx`,
  `src/app/api/v2/user/comment/route.ts`,
  `src/app/api/v2/user/comment/[commentId]/route.ts`,
  `src/app/api/v2/public/blog/[slug]/comments/route.ts`,
  `src/lib/data/models/commentModel.ts`,
  `src/lib/data/schemas/commentSchema.ts`,
  `src/lib/transforms/comment/transformComment.ts`, and
  `src/lib/constants/publicDocumentConstants.ts`.
- Shopify commerce and third-party handoff surfaces:
  `src/app/shop/page.tsx`, `src/app/shop/products/page.tsx`,
  `src/app/shop/products/[productHandle]/page.tsx`,
  `src/components/modules/cards/ProductCard.tsx`,
  `src/components/modules/cards/ArtworkShopSection.tsx`,
  `src/components/modules/banners/SecurityBanners.tsx`,
  `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx`,
  `src/lib/api/shopify/**`, `src/lib/config/shopifyConfig.ts`,
  `src/components/elements/misc/YoutubeEmbedding.tsx`, and `next.config.mjs`.
- Tests searched for privacy, consent, subscription, comments, contact,
  account, and commerce handoff coverage under `__tests__`.

## Commands Run

- `git status --short`: initial status showed pre-existing unrelated dirty files
  `docs/orchestration/state.md` and `docs/tasks/README.md`; final status also
  showed unrelated changes in A-009 and A-021 result files. This audit kept
  edits scoped to the A-020 result file.
- `sed -n` reads for the required docs listed above.
- `test -f docs/audits/results/A-020-privacy-consent-commerce-compliance.md &&
  sed -n '1,260p' ...`: confirmed the result file existed and was not started.
- `find src/app -maxdepth 5 -type f \( -name 'page.tsx' -o -name 'route.ts' -o
  -name 'layout.tsx' \) | sort`: inventoried route and API surfaces.
- `rg -n "privacy|terms|policy|cookie|consent|gdpr|ccpa|data protection|legal"
  -S src docs public package.json next.config.mjs`: searched policy and consent
  artifacts.
- `rg -n
  "subscribe|subscription|newsletter|enquiry|contact|comment|comments|signIn|signOut|register|credentials|oauth|GoogleProvider|GithubProvider|NextAuth|useSession|getServerSession|getToken|cookies|document\.cookie|localStorage|sessionStorage"
  -S src`: located personal-data and session surfaces.
- `rg -n
  "analytics|gtag|googletagmanager|google-analytics|pixel|facebook|hotjar|clarity|sentry|posthog|plausible|mixpanel|amplitude"
  -S src package.json next.config.mjs public`: checked for tracking and
  analytics SDKs.
- `rg -n
  "checkout|cart|Add to Cart|availableForSale|product=|descriptionHtml|dangerouslySetInnerHTML|sanitize|Shopify|shopify"
  -S src docs/architecture/shopify-commerce.md docs/runbooks/shopify-operations.md`:
  inspected Shopify handoff assumptions.
- `find src/app -maxdepth 3 -type d | sort | rg -n
  "privacy|terms|policy|legal|cookies|data|returns|shipping|refund|contact"`:
  checked public route directories for policy pages.
- `find public -maxdepth 3 -type f | sort | rg -n
  "privacy|terms|policy|legal|cookies|data|returns|shipping|refund"`:
  checked static public assets for policy pages.
- `rg -n
  "unsubscribe|unsubscribed|mailing list|newsletter|Subscribe|subscribers|SubscriberModel"
  -S src docs`: inspected subscription and unsubscribe surface.
- `rg -n
  "delete account|account deletion|export data|download data|data request|privacy request|erase|erasure|retention|unpublish|moderation|report comment"
  -S src docs`: searched for privacy request, retention, deletion, and
  moderation flows.
- `rg -n
  "terms|privacy|refund|return|shipping|cancellation|invoice|guarantee|buyer protection|money-back|secure payment|safe payments|insured shipping|global shipping|checkout|cart|orders"
  -S src docs`: inspected commerce policy and claim text.
- `rg -n "cookies\(|headers\(|NextResponse\.cookies|response\.cookies|request\.cookies|document\.cookie|localStorage|sessionStorage|indexedDB|navigator\.sendBeacon|fetch\("
  -S src`: checked explicit browser storage/cookie usage and external fetches.
- Targeted `nl -ba ... | sed -n ...` reads on the source files listed in
  Scope Inspected for line-level evidence.
- No runtime tests were run because this task only updates an audit report and
  does not change application behavior.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Public privacy, cookie, terms, and commerce policy pages are absent while the app collects personal data and presents commerce flows. | Route/static searches found only `src/app/project/contact` among policy-like route names and no matching files under `public`. `ProjectLayout` links only About, Film, disabled FAQ, and Contact (`src/app/project/layout.tsx:14-38`). `Footer` exposes contact details and placeholder social links but no privacy, cookie, terms, refund, return, shipping, or sale policy links (`src/components/modules/footer/Footer.tsx:16-45`). Data collection exists through enquiry, subscription, registration/OAuth, comments, saved artwork lists, and admin records. | Owner/legal should provide launch-ready policy content and decide routes/links for privacy, cookie, terms of use, sale terms, refunds/returns, shipping, contact-data retention, comment publication, and newsletter subscription. Add footer and relevant form links once approved. |
| High | Newsletter subscription records email addresses but does not capture consent/source metadata and has no unsubscribe flow. | `SubscribeSection` asks users to join the mailing list and renders `SubscribeForm` without policy or consent copy (`src/components/sections/SubscribeSection.tsx:41-47`). The form submits only `email` (`src/components/modules/forms/user/SubscribeForm.tsx:43-76`). `submitSubscription` validates, normalizes, duplicate-checks, and persists email only (`src/lib/actions/submitSubscription.ts:19-49`). The subscriber model stores `email` and `unsubscribed` plus timestamps, but no consent text version, source path, locale, IP/user-agent policy, or unsubscribe token (`src/lib/data/models/subscribersModel.ts:14-28`; `src/lib/data/types/subscriberTypes.ts:1-5`). Searches found no unsubscribe endpoint or UI beyond the stored flag. T-017 explicitly left consent/compliance to this audit. | Define newsletter consent requirements with owner/legal. Add approved consent copy or checkbox if needed, record consent/source fields, and implement an unsubscribe route/process before production email sending. |
| High | Account data is collected through credentials and OAuth, but there is no acceptance notice, privacy self-service, export, or working self-delete path. | `UserModel` stores email, username, optional password hash, role, comments, watchlist, and favourites (`src/lib/data/models/userModel.ts:17-27`). `SignUpForm` collects email, password, and username with no terms/privacy acknowledgement (`src/components/modules/forms/user/SignUpForm.tsx:30-80`), and `processRegistration` sends those values into registration (`src/lib/actions/processRegistration.ts:38-64`). NextAuth enables credentials, GitHub, and Google providers (`src/lib/config/authOptions.ts:33-69`), and `CustomMongoDBAdapter.createUser()` persists OAuth profile fields plus username, role, watchlist, favourites, and timestamps (`src/lib/db/adapter.ts:10-25`). `LogoutForm` renders a `Delete Account` button without an `onClick`, `type`, route call, confirmation, or status handling (`src/components/modules/forms/user/LogoutForm.tsx:34-46`); the implemented user deletion path is admin-only (`src/app/api/v2/admin/user/delete/[id]/route.ts:20-102`). | Decide the account privacy model: accepted terms/privacy at signup/OAuth entry, self-service profile/delete/export requests, admin/manual fulfilment path, retention rules for comments and saved artwork lists, and how OAuth-linked accounts are handled. Wire or remove the inert delete button until the approved flow exists. |
| Medium | Public comments expose user-generated content and usernames without a posting notice, moderation policy, or report workflow. | `BlogDetail` always renders the comment form under "Leave a Comment" and can load public comments (`src/components/views/BlogDetail.tsx:132-164`). `CommentForm` collects only comment text and does not tell users their username/comment may be public (`src/components/modules/forms/user/CommentForm.tsx:43-72`). Comment creation stores text, author, blog, and display date (`src/app/api/v2/user/comment/route.ts:121-175`; `src/lib/data/models/commentModel.ts:15-32`). Public comment display shows the author's username and text (`src/components/modules/cards/CommentCard.tsx:156-201`). Public user transforms remove password and email, but not username (`src/lib/constants/publicDocumentConstants.ts:159-166`; `src/lib/transforms/comment/transformComment.ts:28-38`). | Add owner/legal-approved comment posting notice, moderation/reporting expectations, retention/deletion behavior, and public display wording. Decide whether username display is acceptable or whether comments should support pseudonyms, moderation state, or removal requests. |
| Medium | Contact and product enquiry flows collect personal data without notice, and product enquiry context is dropped before persistence. | `ContactForm` collects name, email, subject, and message and submits them to the public enquiry API without a visible privacy/retention notice (`src/components/modules/forms/user/ContactForm.tsx:76-166`). The route validates and persists the DTO to `enquiries` with timestamps (`src/app/api/v2/public/enquiry/route.ts:55-77`; `src/lib/data/models/enquiryModel.ts:15-26`). Product detail pages link available products to `/project/contact?product=[handle]` (`src/app/shop/products/[productHandle]/page.tsx:116-128`), but the contact page does not accept or pass `searchParams` and simply renders `ContactForm` (`src/app/project/contact/page.tsx:6-13`); `ContactForm` defaults `subject` to an empty string (`src/components/modules/forms/user/ContactForm.tsx:32-40`). | Add privacy/retention copy and approved contact-data handling. Preserve product context in the enquiry payload or prefill subject/message from the `product` query param so commerce enquiries are auditable and actionable. |
| Medium | Cookie/session and third-party processing disclosure is incomplete. | No explicit `document.cookie`, `localStorage`, or analytics SDK usage was found in source searches, which lowers tracking risk. However, root layout reads a NextAuth session on every page and passes it to `SessionProvider` (`src/app/layout.tsx:28-47`; `src/contexts/ClientContextBoundary.tsx:18-20`), middleware reads the NextAuth token for protected/admin routes (`src/middleware.ts:17-39`), and OAuth providers are enabled (`src/lib/config/authOptions.ts:60-67`). The film page embeds YouTube from `www.youtube.com`, not the `youtube-nocookie.com` host that CSP also allows (`src/components/elements/misc/YoutubeEmbedding.tsx:16-22`; `next.config.mjs:5-7`). Cloudinary and Shopify are also active third-party services through image and API configuration (`next.config.mjs:51-70`; `src/lib/api/shopify/shopifyClient.ts:27-35`). | Owner/legal should decide cookie and third-party disclosure requirements. Consider a cookie/third-party services page, YouTube no-cookie embed or consent gate, and clear disclosure for NextAuth session cookies, OAuth providers, Cloudinary media delivery/upload, and Shopify product lookups. |
| Medium | Commerce UI makes payment, protection, and shipping claims before checkout/cart and policy pages are defined. | Shopify architecture says product detail pages use enquiry handoff and must not render cart/checkout controls until checkout ownership, variant IDs, line items, and availability behavior are decided (`docs/architecture/shopify-commerce.md:76-85`). Current product detail follows that handoff (`src/app/shop/products/[productHandle]/page.tsx:116-140`), and account cart/orders links are disabled (`src/components/loaders/componentLoaders/AccountSubnavLoader.tsx:65-82`). At the same time, `SecurityBannerGrey` advertises "Secure Platform", "Encrypted transactions", "Safe Payments", "Multiple methods", and "Safe Delivery" (`src/components/modules/banners/SecurityBanners.tsx:116-157`), and `SecurityBannerWhite` advertises "Secure Payment", "Buyer Protection", "100% money-back guarantee", and "Insured Shipping" (`src/components/modules/banners/SecurityBanners.tsx:22-52`). No matching refund/return/shipping/sale terms pages were found. | Owner/legal should approve or remove commerce assurance copy before launch. Publish sale, payment, shipping, cancellation, refund/return, and buyer-protection policies before enabling checkout or stronger purchase claims. |
| Low | A stale Shopify credentials TODO remains in the shop page even though the current config uses environment variables. | `src/app/shop/products/page.tsx:5-6` says "Move Shopify credentials to .env.local" and "Credentials are in: src/lib/config/shopifyConfig.ts". The current config reads `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` from `process.env` with value-free comments (`src/lib/config/shopifyConfig.ts:1-12`), and credential hygiene coverage guards against concrete Storefront token examples. | Remove or update the stale TODO so future agents do not misread the credential state. Keep credential values out of source and docs. |

## Findings Register Updates

Shared trackers are orchestrator-owned in concurrent audit mode, so this audit
does not edit `docs/audits/findings-register.md` directly.

Candidate findings for reconciliation:

| Source | Severity | Suggested finding | Evidence | Suggested routing |
| --- | --- | --- | --- | --- |
| A-020 | High | Public privacy, cookie, terms, and commerce policy pages are missing for active data collection and commerce surfaces. | `src/app/project/layout.tsx:14-38`; `src/components/modules/footer/Footer.tsx:16-45`; route/static searches found no policy pages. | Deployment/security workstream; frontend workstream; R-018. |
| A-020 | High | Newsletter subscription lacks consent/source metadata and unsubscribe flow. | `src/components/sections/SubscribeSection.tsx:41-47`; `src/components/modules/forms/user/SubscribeForm.tsx:43-76`; `src/lib/actions/submitSubscription.ts:19-49`; `src/lib/data/models/subscribersModel.ts:14-28`. | Deployment/security, Data/API, and frontend workstreams; R-018. |
| A-020 | High | Account signup/OAuth data collection lacks terms/privacy acknowledgement and self-service privacy actions. | `src/lib/data/models/userModel.ts:17-27`; `src/components/modules/forms/user/SignUpForm.tsx:30-80`; `src/lib/config/authOptions.ts:33-69`; `src/lib/db/adapter.ts:10-25`; `src/components/modules/forms/user/LogoutForm.tsx:34-46`. | Auth/admin and deployment/security workstreams; R-018. |
| A-020 | Medium | Public comments need posting notice, moderation/reporting policy, and deletion/retention expectations. | `src/components/views/BlogDetail.tsx:132-164`; `src/components/modules/forms/user/CommentForm.tsx:43-72`; `src/components/modules/cards/CommentCard.tsx:156-201`; `src/lib/constants/publicDocumentConstants.ts:159-166`. | Auth/admin, Data/API, frontend, and deployment/security workstreams; R-018. |
| A-020 | Medium | Product enquiry links drop product context before enquiry persistence. | `src/app/shop/products/[productHandle]/page.tsx:116-128`; `src/app/project/contact/page.tsx:6-13`; `src/components/modules/forms/user/ContactForm.tsx:32-40`; `src/app/api/v2/public/enquiry/route.ts:55-77`. | Shopify commerce and Data/API workstreams; R-001/R-018. |
| A-020 | Medium | Cookie/session and third-party service disclosures are incomplete. | `src/app/layout.tsx:28-47`; `src/contexts/ClientContextBoundary.tsx:18-20`; `src/middleware.ts:17-39`; `src/lib/config/authOptions.ts:60-67`; `src/components/elements/misc/YoutubeEmbedding.tsx:16-22`; `next.config.mjs:5-15`. | Deployment/security and frontend workstreams; R-018/R-004. |
| A-020 | Medium | Commerce assurance copy is ahead of implemented checkout/cart and policy pages. | `docs/architecture/shopify-commerce.md:76-85`; `src/app/shop/products/[productHandle]/page.tsx:116-140`; `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx:65-82`; `src/components/modules/banners/SecurityBanners.tsx:22-52`; `src/components/modules/banners/SecurityBanners.tsx:116-157`. | Shopify commerce, frontend, and deployment/security workstreams; R-001/R-018. |
| A-020 | Low | Stale Shopify credential TODO remains in product listing page comments. | `src/app/shop/products/page.tsx:5-6`; `src/lib/config/shopifyConfig.ts:1-12`. | Shopify commerce or code health workstream. |

## Risks Updated

None directly. Candidate risk updates for reconciliation:

- Update R-018 from "not yet inventoried" to confirmed policy, consent,
  unsubscribe, account privacy, comment publication, third-party disclosure, and
  commerce policy gaps based on this A-020 audit.
- Cross-link R-001 for the product enquiry handoff context gap and commerce
  assurance copy that is ahead of the implemented checkout/cart state.
- Cross-link R-004 if owner/legal chooses a cookie/third-party disclosure or
  consent-gating task that depends on stricter CSP/third-party allowlisting.

## Workstream Updates

None directly. Candidate workstream updates for reconciliation:

- Deployment/security backlog: add privacy/cookie/terms policy pages, consent
  recording decisions, third-party disclosure, and compliance owner/legal review.
- Auth/admin backlog: add account privacy acceptance, self-service delete/export
  or documented manual request workflow, and OAuth data handling decisions.
- Shopify commerce backlog: preserve product handle context in contact enquiries
  and align payment/shipping/buyer-protection copy with approved commerce
  policies before checkout launch.
- Frontend backlog: add footer/form links to approved policies and visible
  notices for newsletter, comments, contact, signup, and third-party embeds.
- Data/API backlog: add newsletter consent/source fields and unsubscribe route
  once owner/legal requirements are accepted.

## Completion Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read canonical instructions and docs before audit. | Read `AGENTS.md`, `docs/README.md`, audit workflow docs, A-020 goal, required workstreams, linked architecture/runbooks, and production risks. | Complete |
| Audit personal-data collection points. | Inspected enquiry, subscription, registration/OAuth, comments, saved account data, admin user/comment data, and third-party service touchpoints. | Complete |
| Audit account data. | Findings cover `UserModel`, credentials signup, OAuth adapter profile persistence, session/client exposure, inert delete account UI, and admin-only delete route. | Complete |
| Audit contact/subscription flows. | Findings cover contact/enquiry fields, persistence, missing notice, dropped product context, subscriber email persistence, missing consent metadata, and missing unsubscribe flow. | Complete |
| Audit comments. | Findings cover comment form, persistence, public comment load/display, username exposure, deletion ownership, and missing moderation/posting notice. | Complete |
| Audit cookies/session behavior. | Findings cover NextAuth session/token use, no explicit browser storage or analytics SDK evidence, OAuth providers, YouTube embed host, Cloudinary, and Shopify third-party services. | Complete |
| Audit policy-page gaps. | Route/static/doc searches found no public privacy, cookie, terms, sale, refund, return, or shipping policy pages; footer/project nav do not link them. | Complete |
| Audit Shopify commerce handoff assumptions. | Findings cover enquiry handoff, disabled cart/orders, missing product context in contact payload, and commerce assurance copy without policy pages or checkout/cart. | Complete |
| Avoid legal conclusions. | Report phrases findings as owner/legal review items and does not state jurisdiction-specific legal requirements. | Complete |
| Produce expected result file. | This file is the expected output: `docs/audits/results/A-020-privacy-consent-commerce-compliance.md`. | Complete |
| Preserve shared-file ownership. | Shared findings, risk, and workstream updates are listed as candidates only. | Complete |
| Note verification. | Audit used source/doc searches and targeted file reads; no runtime tests were run because no app behavior changed. | Complete |

## Next Action

Reconcile the candidate A-020 findings into the findings register and R-018,
then start with the owner/legal policy-page and newsletter consent/unsubscribe
decisions because they unblock the widest set of public data-collection flows.

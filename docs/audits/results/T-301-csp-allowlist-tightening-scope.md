# T-301 CSP Allowlist Tightening Scope

Status: Completed

Task: [T-301 Scope CSP Allowlist Tightening](../../tasks/T-301-scope-csp-allowlist-tightening.md)

Date: 2026-05-26

## Summary

The current runtime header posture is a baseline hardening policy, not a strict
production CSP. `next.config.mjs` applies CSP and security headers globally, but
the CSP still allows broad `https:`, `data:`, and `blob:` sources for
`default-src`, `img-src`, `connect-src`, and `media-src`, and keeps
`'unsafe-inline'` plus `'unsafe-eval'` for scripts.

Source evidence supports tightening image, connection, font, frame, and default
sources in a future implementation, but that task should stage the change in
`Content-Security-Policy-Report-Only` first because the Cloudinary upload widget
loads third-party scripts, frames, styles, fonts, and upload connections that are
not fully represented by local source. HSTS, dynamic per-origin CORS, CSP
reporting endpoints, and monitoring provider wiring should remain separate.

## Current Header Posture

`next.config.mjs:1-22` defines the CSP:

| Directive | Current value | Broad allowance |
| --- | --- | --- |
| `default-src` | `'self' https: data: blob:` | Allows any HTTPS, data, and blob source by default. |
| `script-src` | `'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com` | Allows inline scripts and eval. |
| `frame-src` | `'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com` | Source-specific, but keeps both YouTube hosts and both Cloudinary widget hosts. |
| `style-src` | `'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com` | Allows inline styles. |
| `img-src` | `'self' data: https: blob:` | Allows all HTTPS image hosts plus data/blob. |
| `font-src` | `'self' data: https://widget.cloudinary.com https://upload-widget.cloudinary.com` | Source-specific except `data:`. |
| `connect-src` | `'self' data: https: blob:` | Allows all HTTPS, data, and blob connections. |
| `media-src` | `'self' data: https: blob:` | Allows all HTTPS, data, and blob media. |
| `object-src` | `'none'` | Already tight. |
| `base-uri` | `'self'` | Already tight. |
| `form-action` | `'self'` | Already tight for current same-origin forms. |
| `frame-ancestors` | `'self'` | Already tighter than no directive; owner may later decide whether embedding should be fully denied. |

`next.config.mjs:24-41` also sets:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)`

`next.config.mjs:51-70` allows optimized remote images from:

- `https://res.cloudinary.com/dzncmfirr/**`
- `https://cdn-icons-png.flaticon.com/**`
- `https://cdn.shopify.com/**`

`__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts:91-129` locks the
current low-risk hardening directives and the broad external resource
allowances that a future CSP implementation test will need to update.

## Source Evidence

| Category | Required source or scheme | Evidence | Tightening note |
| --- | --- | --- | --- |
| Cloudinary delivery images | `https://res.cloudinary.com/dzncmfirr/**` | `next.config.mjs:51-58`; `src/lib/validation/contentImageUrl.ts:6-22`; `src/lib/images/cloudinaryDelivery.ts:1-36`; hard-coded public images in `src/lib/constants/heroSlideData.ts` and route/component source. | Replace `img-src https:` with `https://res.cloudinary.com`; path cannot be expressed in CSP, so keep path validation in app code and Next image config. |
| Flaticon content images | `https://cdn-icons-png.flaticon.com/**` | `next.config.mjs:59-64`; `src/lib/validation/contentImageUrl.ts:12-16`. | Include in `img-src` only if the content-image policy still accepts it. |
| Shopify CDN images | `https://cdn.shopify.com/**` | `next.config.mjs:65-70`; `src/lib/validation/contentImageUrl.ts:17-21`; product images are passed through product detail previews in `src/app/shop/products/[productHandle]/page.tsx:139-191`. | Include in `img-src`; browser product listing fetches are same-origin, not direct Storefront browser calls. |
| Cloudinary upload widget script/frame/style/font | `https://widget.cloudinary.com`, `https://upload-widget.cloudinary.com` | CSP currently allows these hosts; `UploadButton` renders `CldUploadWidget` with `uploadPreset`, `signatureEndpoint`, local/google_drive/dropbox sources, and success handling in `src/components/elements/buttons/UploadButton.tsx:24-56`. | Keep in `script-src`, `frame-src`, `style-src`, and `font-src` until report-only evidence proves a smaller set. |
| Cloudinary upload widget connections | Likely `https://api.cloudinary.com` plus widget hosts; exact runtime set needs browser/report-only evidence. | `UploadButton` uses `next-cloudinary`; the admin signing route exists only for same-origin signature generation at `src/app/api/v2/admin/sign-cloudinary-params/route.ts:113-157`. | Do not jump from `connect-src https:` straight to only `'self'`; stage with report-only and an admin upload smoke. |
| Cloudinary signing endpoint | `'self'` | `UploadButton` calls `signatureEndpoint="/api/v2/admin/sign-cloudinary-params"`; the route requires admin and signs constrained params in `src/app/api/v2/admin/sign-cloudinary-params/route.ts:25-157`. | Covered by `connect-src 'self'`; no cross-origin browser CORS need found. |
| Shopify Storefront API | Server-side `https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json` | `src/lib/config/shopifyConfig.ts:4-12`; server fetch in `src/lib/api/shopify/shopifyClient.ts:71-96`. | Browser CSP `connect-src` does not need the Storefront API unless a future client SDK is added. Server egress policy is separate from CSP. |
| Shopify hosted purchase handoff | Top-level navigation to `SimpleProduct.onlineStoreUrl` | URL normalization in `src/lib/api/shopify/shopifyClient.ts:37-61`; product detail external link in `src/components/shop/product-detail/ShopProductSaleGallery.tsx:563-576`; page passes `onlineStoreUrl` in `src/app/shop/products/[productHandle]/page.tsx:247-265`. | CSP `form-action` can remain `'self'`; external link navigation is not a form submission. Owner/platform decisions for Shopify policy URLs and checkout posture remain separate. |
| YouTube embeds | `https://www.youtube.com`; possible `https://www.youtube-nocookie.com` if migrated | `YoutubeEmbedding` iframes `https://www.youtube.com/embed/${videoId}?rel=0` in `src/components/elements/misc/YoutubeEmbedding.tsx:14-23`; used by the film page and prototype project section. | Keep `frame-src` for `www.youtube.com`; `youtube-nocookie.com` is not active source evidence but may be an owner/legal privacy decision. |
| Google/Next fonts | Build-time Google fetch; browser-served Next font assets from self | `src/lib/styles/fonts.ts:1-48` imports five families from `next/font/google`; `src/app/layout.tsx:51-55` attaches the generated variables. | Browser `font-src` can prefer `'self'`; do not add `fonts.googleapis.com` or `fonts.gstatic.com` for runtime CSP unless the font strategy changes away from `next/font`. Build network access remains separate. |
| Inline styles | `'unsafe-inline'` or a nonce/hash strategy | Inline style usage exists, for example `YoutubeEmbedding` aspect ratio style at `src/components/elements/misc/YoutubeEmbedding.tsx:14-15`, dynamic background images in `src/app/project/aims/page.tsx:40`, and other component style props found by source search. | Do not remove `style-src 'unsafe-inline'` without a separate inline-style audit/refactor or nonce/hash policy. |
| Inline/eval scripts | Current policy allows both; local source does not add `next/script` or obvious inline script tags in the inspected paths. | Current CSP in `next.config.mjs:5`; no `next/script` hits were part of the focused source evidence. | Removing production `'unsafe-eval'` is a good candidate after build/browser smoke. Removing `'unsafe-inline'` likely needs a Next nonce/hash strategy and report-only rollout. |
| Same-origin API/client fetches | `'self'` | Public shop filtering fetches `/api/v2/public/shop/products` in `src/components/compositions/ShopProductGallery.tsx:96-118`; shared fetcher resolves app endpoints in `src/lib/api/core/createFetcher.ts:22-72`. | `connect-src 'self'` should cover app-owned browser calls. |
| Forms | `'self'` | Same-origin React/server-action forms include sign-in, subscribe, enquiry/contact, favourites, search, and admin forms; examples: `src/components/modules/forms/user/SignInForm.tsx:37-59`, `src/components/modules/forms/user/SubscribeForm.tsx:36-50`, `src/components/modules/forms/user/EnquiryForm.tsx:83-88`, `src/components/elements/buttons/FavouritesButton.tsx:50-59`. | Existing `form-action 'self'` is appropriate for current source. |
| OAuth providers | GitHub and Google provider redirects through NextAuth | Providers are configured in `src/lib/config/authOptions.ts:41-70`; provider sign-in buttons call `signIn("github" | "google")` in `src/components/modules/forms/user/AuthProviderSignInButtons.tsx:22-58`. | CSP should not add OAuth hosts merely for redirect navigation. Callback/provider console configuration is an owner/platform decision, not a CSP allowlist change. |
| Data/blob schemes | Currently allowed in default, image, connect, media, and font directives | No `createObjectURL`, `FileReader`, `readAsDataURL`, audio, video, or source element usage was found in `src`; current tests assert broad `data:`/`blob:` allowances in `__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts:102-114`. | Keep `data:` for `img-src` and possibly `font-src` until report-only proves it is unused. Remove `data:`/`blob:` from `default-src`, `connect-src`, and likely `media-src` in report-only first. |
| Public smoke | External CLI fetch, not browser CSP | `scripts/smoke-public-routes.mjs:398-405`; `.github/workflows/public-smoke.yml:73-102`; deployment runbook `docs/runbooks/deployment.md:209-274`. | Public smoke can verify deployed headers and public pages, but it does not require runtime CSP source allowances. |

## Candidate Tighter Directives

These are candidates for a future implementation task, not changes made by
T-301.

```text
default-src 'self'
base-uri 'self'
object-src 'none'
form-action 'self'
frame-ancestors 'self'
frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com
img-src 'self' data: blob: https://res.cloudinary.com https://cdn-icons-png.flaticon.com https://cdn.shopify.com
font-src 'self' data: https://widget.cloudinary.com https://upload-widget.cloudinary.com
connect-src 'self' https://api.cloudinary.com https://widget.cloudinary.com https://upload-widget.cloudinary.com
style-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com
script-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://www.youtube.com https://www.youtube-nocookie.com
media-src 'self' blob: https://res.cloudinary.com
```

Implementation notes:

- Treat the above as a `Content-Security-Policy-Report-Only` candidate first,
  especially for admin upload routes.
- Consider removing production `script-src 'unsafe-eval'` before attempting to
  remove `script-src 'unsafe-inline'`.
- Do not add `fonts.googleapis.com` or `fonts.gstatic.com` to runtime CSP while
  fonts are served through `next/font/google`.
- Keep path-level controls in app validation and `images.remotePatterns`; CSP
  cannot restrict `res.cloudinary.com` to `/dzncmfirr/**`.
- Keep `youtube-nocookie.com` only if the owner wants a no-cookie embed
  migration or compatibility allowance. Current source uses `www.youtube.com`.
- Confirm whether `media-src` is needed at all; no first-party audio/video
  source elements were found.

## Risks, Unknowns, And Decisions

| Item | Status | Follow-up |
| --- | --- | --- |
| Cloudinary widget runtime internals | Unknown without report-only/browser evidence. | Capture targeted CSP report-only violations or a narrow admin upload smoke before enforcing. Avoid iframe DOM scraping or large traces. |
| Dropbox/Google Drive upload sources in Cloudinary widget | Enabled by `UploadButton` options. | Owner/admin should decide whether these sources are still required before tightening widget host assumptions. |
| YouTube privacy mode | Current source uses `www.youtube.com`; CSP also allows `youtube-nocookie.com`. | Owner/legal should decide whether to migrate embeds to `www.youtube-nocookie.com` or keep both hosts. |
| Inline script policy | Current policy allows inline script; local focused search did not prove it can be removed safely. | Use report-only plus Next nonce/hash research as a separate task if strict script CSP is desired. |
| Inline style policy | Inline `style` props and dynamic background images are active. | Keep `'unsafe-inline'` for styles until a dedicated refactor or nonce/hash approach exists. |
| OAuth provider domains | Providers are enabled, but CSP does not control top-level redirect destinations. | Keep OAuth callback/domain setup in auth/provider owner decisions and deployment runbooks, not this CSP allowlist. |
| HSTS | Not currently set in `next.config.mjs`. | Keep as a separate deployment-domain ownership task; verify canonical HTTPS domain, subdomain policy, and preload appetite before adding. |
| Dynamic per-origin CORS | T-096 removed global invalid API CORS; no browser cross-origin API requirement was found in this scope. | Keep separate and route-specific if a future external browser client is approved. |
| CSP reporting | No report endpoint/provider is implemented. | Keep separate from allowlist tightening; decide route-owned report collector vs monitoring provider integration. |
| Monitoring provider | No provider SDK or `instrumentation.ts` exists. | Keep separate and blocked on owner/platform monitoring posture. |

## Proposed Implementation/Test Split

1. Add a production/report-only CSP helper or config path that narrows
   `default-src`, `img-src`, `connect-src`, `font-src`, and `media-src` using
   the candidate host list above while preserving the current enforced CSP.
2. Update `__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts` to
   assert the report-only policy exists and that the enforced policy remains
   unchanged during the observation phase.
3. Run a local build and focused public route smoke that covers `/`,
   `/project/film`, `/shop/products`, and one Shopify product detail route when
   data/env allows.
4. Run a targeted admin upload smoke in a non-production environment with
   browser console/CSP violation collection limited to the upload action.
5. After report-only evidence is clean, switch the tightened policy to enforced
   in a separate task and update tests to remove the old broad `https:`,
   `data:`, `blob:`, and `'unsafe-eval'` expectations.

Recommended separate tasks:

- HSTS rollout after owner confirms canonical deployment domain, subdomain
  policy, and preload stance.
- CSP reporting endpoint/provider and alert routing after monitoring posture is
  approved.
- Dynamic per-origin CORS only if a real cross-origin browser API consumer is
  approved.
- Optional YouTube no-cookie migration or consent gate after owner/legal
  direction.

## Commands Run

- `pwd && sed -n '1,220p' AGENTS.md`
- `sed -n '1,240p' docs/README.md`
- `sed -n '1,260p' docs/tasks/T-301-scope-csp-allowlist-tightening.md`
- `sed -n '1,260p' docs/workstreams/deployment-security-and-observability.md`
- `sed -n '1,240p' docs/workstreams/README.md`
- `git status --short`
- `sed -n '1,260p' next.config.mjs`
- `rg -n "R-004|CSP|Content-Security-Policy|security header|CORS|HSTS|report-uri|report-to" docs next.config.mjs src __tests__`
- `rg -n "cloudinary|res.cloudinary|widget.cloudinary|upload-widget|cdn.shopify|shopify|youtube|youtube-nocookie|googleapis|gstatic|flaticon|iframe|frame|video|font|fetch\\(|axios|form action|POST|connect-src|img-src|next/font|@next/font|Image" src docs __tests__ next.config.mjs package.json`
- `rg --files src docs __tests__ | rg "(cloudinary|shopify|youtube|font|smoke|middleware|cors|security|headers|image|media|upload|auth|contact|newsletter|product|storefront|vercel|environment|deployment)"`
- `nl -ba next.config.mjs | sed -n '1,120p'`
- `rg -n "CldUpload|CloudinaryUpload|next-cloudinary|upload-widget|widget.cloudinary|sign-cloudinary|api.cloudinary|res.cloudinary|cloudinary\\.com" src __tests__ docs/runbooks docs/architecture docs/tasks/T-005-cloudinary-signing-api-guard.md docs/tasks/T-066-harden-cloudinary-signing-params.md docs/tasks/T-067-remove-cloudinary-upload-debug-logs.md docs/tasks/T-271-add-admin-artwork-image-replacement.md`
- `rg -n "SHOPIFY_|shopify|cdn.shopify|onlineStoreUrl|Storefront|storeDomain|myshopify|checkout|cart|purchase|buy" src docs/architecture/shopify-commerce.md docs/runbooks/shopify-operations.md docs/tasks/T-208-implement-shopify-hosted-purchase-handoff.md docs/tasks/T-296-define-shopify-book-metadata-readiness.md __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/shopifyClientTransform.test.ts`
- `rg -n "YoutubeEmbedding|youtube|youtube-nocookie|iframe|<video|videoId|src=\\{|src=\\\"https" src docs __tests__`
- `nl -ba src/components/elements/buttons/UploadButton.tsx | sed -n '1,90p'`
- `nl -ba src/app/api/v2/admin/sign-cloudinary-params/route.ts | sed -n '1,220p'`
- `nl -ba src/lib/validation/contentImageUrl.ts | sed -n '1,120p'`
- `nl -ba src/lib/images/cloudinaryDelivery.ts | sed -n '1,120p'`
- `nl -ba src/components/elements/misc/YoutubeEmbedding.tsx | sed -n '1,70p'`
- `nl -ba src/lib/config/shopifyConfig.ts | sed -n '1,80p'`
- `nl -ba src/lib/api/shopify/shopifyClient.ts | sed -n '1,130p'`
- `nl -ba src/components/shop/product-detail/ShopProductSaleGallery.tsx | sed -n '540,610p'`
- `nl -ba 'src/app/shop/products/[productHandle]/page.tsx' | sed -n '1,320p'`
- `nl -ba src/lib/api/public/shop/fetchers.ts | sed -n '1,160p'`
- `nl -ba src/lib/styles/fonts.ts | sed -n '1,120p'`
- `rg -n "next/font|googleapis|gstatic|font-family|@font-face|fonts\\.google" src docs __tests__ next.config.mjs`
- `rg -n "createObjectURL|revokeObjectURL|FileReader|readAsDataURL|<audio|<video|<source|blob:" src __tests__`
- `nl -ba src/lib/config/authOptions.ts | sed -n '1,100p'`
- `nl -ba src/contexts/ClientContextBoundary.tsx | sed -n '1,60p'`
- `nl -ba src/app/layout.tsx | sed -n '1,80p'`
- `nl -ba src/components/modules/forms/user/AuthProviderSignInButtons.tsx | sed -n '1,100p'`
- `nl -ba __tests__/unit/deployment/nextConfigSecurityHeaders.test.ts | sed -n '1,160p'`
- `rg -n "fetch\\(|axios|XMLHttpRequest|navigator\\.sendBeacon|EventSource|WebSocket|new WebSocket|formAction|action=|method=\\\"post|method='post|<form|form\\.action" src`
- `nl -ba src/components/compositions/ShopProductGallery.tsx | sed -n '80,130p'`
- `nl -ba src/lib/api/core/createFetcher.ts | sed -n '1,90p'`
- `nl -ba src/components/modules/forms/user/SignInForm.tsx | sed -n '1,65p'`
- `nl -ba src/components/modules/forms/user/SignInForm.tsx | sed -n '60,110p'`
- `nl -ba src/components/modules/forms/user/ContactForm.tsx | sed -n '80,130p'`
- `nl -ba src/components/modules/forms/user/SubscribeForm.tsx | sed -n '1,80p'`
- `nl -ba src/components/modules/forms/user/EnquiryForm.tsx | sed -n '70,120p'`
- `nl -ba src/components/elements/buttons/FavouritesButton.tsx | sed -n '35,70p'`
- `nl -ba src/components/modules/search/SearchDrawerBody.tsx | sed -n '40,70p'`
- `rg -n "blurDataURL|placeholder=\\\"blur\\\"|data:image|src=\\{.*data|backgroundImage|url\\(https|url\\('https|url\\(\\\"https" src`
- `rg -n "http://|https://" src --glob '!**/*.test.ts' --glob '!**/*.test.tsx'`
- `rg -n "smoke:public|public-smoke|BASE_URL|SMOKE_BASE_URL|fetch\\(" scripts src docs/runbooks/deployment.md docs/tasks/T-025-repeatable-vercel-smoke-checklist.md .github/workflows 2>/dev/null`

## Verification

- `git diff --check`: passed.
- `git diff --check --no-index /dev/null docs/tasks/T-301-scope-csp-allowlist-tightening.md`:
  no whitespace warnings; exit `1` is expected for a `/dev/null` comparison.
- `git diff --check --no-index /dev/null docs/audits/results/T-301-csp-allowlist-tightening-scope.md`:
  no whitespace warnings; exit `1` is expected for a `/dev/null` comparison.

## Candidate Handoff Updates

For the orchestrator to reconcile after the parallel run:

- `docs/tasks/README.md`: mark T-301 completed and summarize that the result
  artifact scopes a report-only CSP tightening plan without runtime changes.
- Deployment/security workstream: add a progress note that T-301 completed the
  current-source CSP allowlist inventory and recommends a report-only CSP
  implementation/test slice before enforcement.
- Findings register F-052 / risk R-004: update the partially mitigated note to
  point at this result as the source-backed plan for the next CSP slice; do not
  mark resolved.
- Orchestration state: remove T-301 from the active parallel scoping list and
  note that HSTS, dynamic CORS, CSP reporting, and monitoring remain separate
  owner/platform tasks.

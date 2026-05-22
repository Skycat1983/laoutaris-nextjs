# T-209 Align Commerce Assurance Copy

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove or neutralize unsupported commerce assurance claims from shared public
banner copy so the site does not advertise payment, shipping, refund, guarantee,
or buyer-protection behavior that is not backed by implemented flows and
approved public policies.

## Context

- A-020/F-078 found `SecurityBanners` advertise secure payment, buyer
  protection, money-back guarantees, insured/global shipping, and payment method
  claims without matching checkout/cart behavior or public sale/refund/shipping
  policies.
- T-208 added a real Shopify-hosted purchase handoff for available products
  with a valid Shopify `onlineStoreUrl`, but the app still does not own cart,
  checkout, orders, payment, shipping, refunds, fulfilment, or buyer-protection
  policy.
- `SecurityBannerGrey` is rendered from the public footer, so unsupported copy
  can appear outside the shop context.
- Translation/security string files also contain stale payment and delivery
  assurance phrases that should not be reintroduced later.

## Scope

In scope:

- Update `src/components/modules/banners/SecurityBanners.tsx` to replace
  unsupported assurance copy with factual archive/service copy.
- Update `src/lib/constants/translations.json` and
  `src/lib/translations/categories/security.json` if they contain matching stale
  payment, guarantee, or delivery assurance strings.
- Remove or neutralize phrases that imply:
  - secure/safe payment handling by this app,
  - buyer protection,
  - money-back or 100% guarantees,
  - insured shipping or global/worldwide delivery,
  - specific payment methods.
- Preserve the existing banner component exports and basic rendered structure
  unless a small label/content adjustment is necessary.
- Add focused coverage or a source invariant proving the unsupported commerce
  assurance phrases do not return in the banner component and security
  translation files.
- Update this task brief and relevant workstreams after completion.

Out of scope:

- Do not add privacy, cookie, terms, sale, refund, return, shipping, or buyer
  protection policy pages.
- Do not create owner/legal-approved commerce policy copy.
- Do not change Shopify product detail purchase behavior, cart/checkout,
  variant selection, line items, payment, tax, shipping, refund, fulfilment, or
  order behavior.
- Do not redesign the footer, navigation, project pages, or shop product pages.
- Do not change account cart/orders disabled navigation.
- Do not alter Cloudinary/Shopify configuration or third-party disclosure copy.

## Concurrency

Run this task alone with other work touching shared footer/security banners,
commerce assurance copy, or legal/compliance text.

Owned files:

- `src/components/modules/banners/SecurityBanners.tsx`
- `src/lib/constants/translations.json`
- `src/lib/translations/categories/security.json`
- focused banner/source-hygiene tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/modules/banners/SecurityBanners.tsx`
- `src/lib/constants/translations.json`
- `src/lib/translations/categories/security.json`
- `__tests__/unit/securityBannerCommerceCopy.test.tsx`
- `docs/tasks/T-209-align-commerce-assurance-copy.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- Shared security banners no longer render unsupported payment safety, buyer
  protection, money-back, insured-shipping, worldwide-delivery, payment-method,
  or guarantee claims.
- Security translation files no longer preserve equivalent stale assurance
  phrases that could be reused by future UI.
- Replacement copy is factual and aligned with the current public archive plus
  Shopify-hosted purchase handoff.
- Existing banner exports remain available for current imports.
- Focused coverage fails if the retired assurance claims return.
- No policy pages, cart/checkout behavior, product detail purchase behavior, or
  footer layout redesign is introduced.

## Verification

```bash
rg -n "Secure Payment|Secure Payments|Safe Payments|Buyer Protection|money-back|100% guaranteed|100% money-back|Insured Shipping|Insured shipping|Global Shipping|Worldwide delivery|Safe Delivery|Multiple methods|Encrypted transactions" src/components/modules/banners/SecurityBanners.tsx src/lib/constants/translations.json src/lib/translations/categories/security.json
npm test -- --runTestsByPath __tests__/unit/securityBannerCommerceCopy.test.tsx
npm run lint
git diff --check
```

The `rg` command should return no matches for the retired unsupported commerce
assurance phrases.

## Agent Prompt

You are working on T-209. Read `AGENTS.md`, `docs/README.md`, A-020's result,
F-078 in `docs/audits/findings-register.md`, R-018 in
`docs/risks/production-readiness.md`, and the Shopify/frontend/deployment/testing
workstreams. Remove or neutralize unsupported payment, buyer-protection,
money-back, insured/global-shipping, and payment-method claims from
`SecurityBanners` and matching security translation files. Keep the change to
copy and focused tests only. Do not add policy pages, legal terms, cart/checkout
behavior, product detail changes, footer redesign, or Shopify configuration.
Run the verification commands, then update this handoff with what changed and
list any candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-208 completed the
  Shopify-hosted purchase handoff.
- This is the recommended next owner-independent production slice because it
  removes visible unsupported commerce claims while owner/legal policy pages and
  app-owned checkout remain separate decisions.
- Completed on 2026-05-22. `SecurityBanners` now use factual archive, direct
  contact, enquiry-context, catalogue, and Shopify-hosted-link copy instead of
  payment, buyer-protection, guarantee, insured/global-shipping, or
  payment-method assurances.
- Updated both security translation files so stale security/payment/delivery
  assurance keys and strings are replaced with archive, contact, catalogue, and
  Shopify-link copy.
- Added `__tests__/unit/securityBannerCommerceCopy.test.tsx` to guard the
  banner component and security translation sources against the retired
  assurance phrases and to prove the rendered banners still expose the neutral
  replacement copy.
- Verification:
  - `rg -n "Secure Payment|Secure Payments|Safe Payments|Buyer Protection|money-back|100% guaranteed|100% money-back|Insured Shipping|Insured shipping|Global Shipping|Worldwide delivery|Safe Delivery|Multiple methods|Encrypted transactions" src/components/modules/banners/SecurityBanners.tsx src/lib/constants/translations.json src/lib/translations/categories/security.json`
    returned no matches.
  - `npm test -- --runTestsByPath __tests__/unit/securityBannerCommerceCopy.test.tsx`
    passed.
  - `npm run lint` passed.
  - `git diff --check` passed.
- Candidate shared-tracker updates for orchestrator reconciliation:
  - F-078 can be updated from prepared/converted to mitigated for the visible
    shared-banner commerce assurance copy slice.
  - R-018 can note that T-209 removed unsupported public banner claims while
    policy pages, consent records, third-party disclosure, and app-owned
    checkout/cart remain open.
  - Orchestration next action should stop assigning T-209 and choose the next
    owner/legal policy, consent/disclosure, or commerce hardening slice.
- Reconciled by the orchestrator on 2026-05-22: shared trackers now mark F-078
  resolved for the visible shared-banner commerce assurance copy scope, R-018
  notes the unsupported banner claims are removed, and T-210 is prepared as the
  next public-discovery implementation slice.

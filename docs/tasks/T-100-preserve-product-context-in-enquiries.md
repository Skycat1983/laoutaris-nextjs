# T-100 Preserve Product Context In Enquiries

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Persist the Shopify product context from product-detail enquiry links so
operators can tell which product a contact submission refers to while checkout
remains enquiry-based.

## Context

- T-008 made product detail purchase behavior safe by linking available products
  to `/project/contact?product=[handle]` instead of rendering a nonfunctional
  cart button.
- A-020 found the contact page does not consume that query parameter, the
  contact form defaults subject to an empty string, and the public enquiry API
  persists only name, email, subject, and message.
- A-020 also found a stale Shopify credential TODO in
  `src/app/shop/products/page.tsx` even though `shopifyConfig.ts` now reads
  credentials from environment variables.
- This task should preserve product context only. Privacy policy copy,
  owner/legal policy pages, newsletter consent, checkout/cart, and sale terms
  remain separate.

## Scope

- In scope:
  - Read the optional `product` query parameter on `/project/contact`.
  - Validate and normalize the product handle before passing it to the contact
    form or API payload.
  - Add an optional enquiry field such as `productHandle` or
    `productContext.productHandle` to the shared schema, model/type, and public
    route allowlist.
  - Prefill or preserve a useful subject/message context in `ContactForm`
    without hiding the core user-entered fields.
  - Persist the normalized product context for valid product enquiry
    submissions and ignore/reject invalid product context with a clear route
    validation behavior.
  - Add focused tests for route persistence/normalization and contact form/page
    wiring.
  - Remove or update the stale Shopify credential TODO in
    `src/app/shop/products/page.tsx` without touching credential values.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Legal/privacy notice copy or policy page creation.
  - Newsletter consent or unsubscribe behavior.
  - Checkout/cart, variant selection, orders, or payment processing.
  - Calling Shopify from the contact form or enquiry route.
  - Data migration for historical enquiries.
  - Broad contact form redesign.

## Files Likely Touched

- `src/app/project/contact/page.tsx`
- `src/components/modules/forms/user/ContactForm.tsx`
- `src/lib/data/schemas/enquirySchema.ts`
- `src/lib/data/models/enquiryModel.ts`
- `src/app/api/v2/public/enquiry/route.ts`
- `src/app/shop/products/page.tsx`
- `__tests__/unit/api/publicEnquiryRoute.test.ts`
- `__tests__/unit/forms/contactFormProductContext.test.tsx`
- `docs/tasks/T-100-preserve-product-context-in-enquiries.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- `/shop/products/[productHandle]` enquiry links still point at
  `/project/contact?product=[handle]`.
- `/project/contact?product=valid-handle` passes a normalized product handle to
  the contact form and public enquiry payload.
- The enquiry route persists the normalized product handle for valid enquiry
  payloads and continues to reject invalid name/email/subject/message input as
  before.
- Invalid or overlong product context cannot be persisted silently.
- Existing non-product contact submissions still work without a product field.
- The stale Shopify credential TODO is removed or updated without adding any
  secret value to source or docs.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicEnquiryRoute.test.ts __tests__/unit/forms/contactFormProductContext.test.tsx
npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx
npm run lint
npm run build
rg -n "Move Shopify credentials|Credentials are in" src/app/shop/products/page.tsx
git diff --check
```

The final `rg` command should return no stale credential TODO matches.

## Result

- Completed 2026-05-18.
- `/project/contact` now normalizes a valid `product` query handle before
  passing it to `ContactForm`; invalid query context is ignored before render.
- `ContactForm` pre-fills editable subject/message context for product
  enquiries and submits the normalized `productHandle` alongside the normal
  name, email, subject, and message fields.
- The shared enquiry schema/model now supports optional `productHandle`;
  malformed or overlong product context is rejected by the public enquiry route
  with the existing validation response shape.
- The stale Shopify credential TODO was removed from
  `src/app/shop/products/page.tsx` without adding credential values.

Verification run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicEnquiryRoute.test.ts __tests__/unit/forms/contactFormProductContext.test.tsx
npm test -- --runTestsByPath __tests__/unit/shopProductDetailPage.test.tsx
npm run lint
rg -n "Move Shopify credentials|Credentials are in" src/app/shop/products/page.tsx
git diff --check
```

`npm run build` initially failed during type checking on concurrent
observability logger work. After T-099 completed, the orchestrator reran
`npm run build` on 2026-05-18 and it passed.

## Handoff Notes

- Prepared after A-020 reconciliation as a concrete commerce/data follow-up
  that does not require owner/legal policy copy.
- Keep privacy notices, policy pages, consent records, unsubscribe, commerce
  assurance copy, checkout/cart, and sale terms separate.
- Build verification passed after the T-099 observability logger type error was
  resolved.

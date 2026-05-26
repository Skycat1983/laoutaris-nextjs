# Sale Gallery Owner Review Packet

Status: Ready for owner review

Review pages:

- Print: `/shop/products/joseph-laoutaris-fine-art-print-no-034`
- Original: `/shop/products/joseph-laoutaris-original-artwork-no-043`
- Book candidate: `/shop/products/the-complete-artwork-of-joseph-laoutaris`

How to open them:

- Local review: add the route above to the local site URL, for example
  `http://localhost:3000/shop/products/joseph-laoutaris-fine-art-print-no-034`
- Deployed preview review: add the same route to the preview site domain

This packet is for owner decisions only. It does not change product data,
Shopify metadata, product images, checkout behavior, frame selections, room
backgrounds, or live source code.

## Review Goal

Decide whether the current print and original sale-gallery direction is
approved for the next implementation step, and decide which commerce and visual
inputs must be provided before agents continue.

The print and original routes are ready for scoped visual review. The book
candidate is not ready for book-specific review until Shopify data identifies
it as a book/publication.

## Current Status

### Print Route

Route: `/shop/products/joseph-laoutaris-fine-art-print-no-034`

Status: ready for scoped owner review.

What is ready to inspect:

- The raw Shopify product image appears as the first gallery item.
- Four room previews are available from the gallery buttons.
- Frame and mat controls are visible for preview only.
- The page uses the current factual enquiry fallback because the reviewed
  product does not expose a hosted Shopify purchase URL.
- Desktop and mobile/narrow layouts were checked for the scoped review and did
  not show horizontal page overflow.

What this does not decide yet:

- Frame and mat choices do not change Shopify variants, price, checkout, saved
  cart lines, or enquiry submissions.
- The room previews use the current shared room backgrounds.
- The product page does not yet use the full rail renderer from
  `/prototype/frame` for the main product sale gallery.

### Original Route

Route: `/shop/products/joseph-laoutaris-original-artwork-no-043`

Status: ready for scoped owner review.

What is ready to inspect:

- The raw Shopify product image is visibly meaningful on desktop and
  mobile/narrow review sizes.
- Generated room previews can be selected from the gallery buttons.
- Print-only frame and mat controls are absent.
- The page uses the current factual enquiry fallback because the reviewed
  product does not expose a hosted Shopify purchase URL.
- Desktop and mobile/narrow layouts were checked for the scoped review and did
  not show horizontal page overflow.

What this does not decide yet:

- Original artwork room backgrounds are still generated preview contexts, not
  owner-approved final photography.
- The route still depends on live Shopify Storefront reads; intermittent local
  fetch failures were observed during probes and should stay a separate
  reliability concern if they continue.

### Book Candidate

Route: `/shop/products/the-complete-artwork-of-joseph-laoutaris`

Status: blocked for book-specific owner review.

Why it is blocked:

- The current Shopify Storefront data does not expose a durable book marker in
  `productType`, Shopify tags, or `custom.featured_artwork_ids`.
- Current code can render a book cover/page gallery from ordered Shopify images
  once the product is classified as a book.
- Another book visual review would not test real book behavior until Shopify
  metadata is updated and verified.

What must happen first:

- Update Shopify product data with a durable book/publication marker.
- Keep the Shopify product images ordered as the intended cover/page gallery.
- Add `custom.featured_artwork_ids` only if the book page should also show
  featured archive artworks.
- Verify Storefront reads for the handle before assigning a repeat book
  sale-gallery visual QA pass.

## What To Review Now

Please review the print and original routes as a product-detail sale-gallery
direction, not as final commerce behavior.

Focus on these areas:

- Overall layout: whether the gallery, product information, and CTA hierarchy
  feel right on desktop and mobile.
- Raw image: whether the first image is clear enough and large enough for
  product review.
- Room previews: whether the current room contexts are suitable for print and
  original artwork pages.
- Print controls: whether frame and mat controls are useful as preview-only
  controls, and whether their labels and options are understandable.
- Original previews: whether generated room contexts help or distract for
  original artwork products.
- CTA wording: whether `Enquire About This Product` and the supporting copy
  set the right expectation before hosted Shopify purchase URLs exist.
- Mobile fit: whether the route feels usable on a narrow phone viewport.

Do not use the book candidate to approve book behavior yet. Use it only to
confirm that book review is waiting on Shopify metadata.

## Decisions Needed

### 1. Print And Original Layout Approval

Decision question: Is the current print/original sale-gallery layout approved
as the direction for product detail pages?

Recommendation: Approve the current direction if the owner is comfortable with
the raw-image-first gallery, room previews, and enquiry-led CTA while commerce
details remain unfinished.

Project impact: approval lets agents scope the next implementation slice.
Rejection should identify whether the issue is layout, imagery, room context,
CTA hierarchy, mobile fit, or product copy.

### 2. Room Background Direction

Decision question: Should the current room backgrounds remain, be narrowed to a
smaller owner-approved set, or be replaced with real photographed/generated
assets?

Recommendation: Choose a small owner-approved set before broader product-page
adoption, because room context changes affect both print and original review
confidence.

Project impact: keeping the current set allows faster follow-up work. Replacing
or curating rooms should happen before agents tune final visual polish around
those backgrounds.

### 3. Product-Page Rail Renderer

Decision question: Should product pages adopt the more detailed rail renderer
from `/prototype/frame`, or should the current product-page renderer remain for
now?

Recommendation: Review `/prototype/frame` separately before approving rail
adoption on live product pages.

Project impact: adopting the rail renderer changes the product-page visual
standard for framed previews. Keeping the current renderer avoids a visual
migration until the frame/material direction is approved.

### 4. Frame Material Assets

Decision question: Are procedural frame materials acceptable for product-page
preview, or are real texture assets needed first?

Recommendation: Use procedural materials only for prototype or early preview
unless the owner accepts them as representative enough for product pages.

Project impact: procedural materials allow faster implementation. Real texture
assets require asset selection, preparation, loading rules, and another visual
review pass.

### 5. Frame And Mat Purchase Behavior

Decision question: Should frame and mat choices remain preview-only, or should
they map to Shopify variants/options before launch?

Recommendation: Keep them preview-only until Shopify option ownership, variant
IDs, pricing, availability, and checkout handoff are defined.

Project impact: preview-only is low risk and matches current behavior. Shopify
mapping is a commerce feature and must define line items, prices, availability,
and how selected choices reach Shopify or enquiries.

### 6. Physical Dimensions

Decision question: Which source owns physical print, frame, mat, and artwork
dimensions?

Recommendation: Pick a single owner before physical scaling affects product
pages: Shopify metadata, MongoDB artwork fields, or a future shared product
dimension contract.

Project impact: current previews are image-ratio based. Real dimensions are
needed before promising accurate wall scale, physical frame sizes, or
dimension-aware Shopify options.

### 7. Book Review Timing

Decision question: When should repeat book sale-gallery QA run?

Recommendation: Run it only after Shopify metadata is updated and a Storefront
read confirms a durable book/publication marker for
`the-complete-artwork-of-joseph-laoutaris`.

Project impact: waiting prevents agents from reviewing generic product behavior
as if it were book behavior. Once metadata is verified, a narrow repeat book QA
task can review the ordered cover/page gallery and book-specific labels.

## Current Boundaries

- No app-owned cart or checkout is implemented.
- Hosted Shopify purchase is used only when Shopify exposes a valid public
  product URL.
- Products without a hosted Shopify URL keep the enquiry fallback.
- Frame and mat selections are local preview controls only.
- Room backgrounds are visual previews only.
- Book behavior remains blocked until Shopify metadata is updated and verified.

## Recommended Next Step

Owner should answer the decision questions above before agents start product
page rail adoption, real material assets, Shopify option mapping, frame/mat
purchase behavior, physical dimension migration, or another book sale-gallery
QA pass.

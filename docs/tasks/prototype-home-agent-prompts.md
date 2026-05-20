# Homepage Prototype Agent Prompts

Use these prompts to commission the homepage prototype work. T-157 should run
first. T-158, T-159, and T-160 can run in parallel after T-157 creates the
prototype route/folder. T-161 can run at any time because it is read-only.

## T-157 Prompt

```text
/task docs/tasks/T-157-create-homepage-prototype-route.md details:
Create a safe /prototype/home route for full-width homepage redesign work. The
route is a workshop surface, not a replacement for the live homepage. Do not
change src/app/page.tsx, the live Home component, ContentLayout, global
header/footer behavior, global CSS, or public navigation. Add a prototype home
component folder with placeholder slots for hero, biography, blog, shop, and
other future landing-page sections. Mark the route noindex. Run npm run lint
and git diff --check. Update only the T-157 handoff; leave shared trackers for
the orchestrator.
```

## T-158 Prompt

```text
/task docs/tasks/T-158-build-biography-prototype-section.md details:
Build the full-width biography teaser section for /prototype/home using
to_prototype/biography.png as the visual guide. This is a homepage teaser
section, not the /biography landing page. Use real biography article data via
existing server-only services; do not hard-code article cards except for safe
fallback copy. Do not change the live homepage, BiographySection,
BiographySectionLoader, /biography, ContentLayout, global CSS, or shared
trackers. Keep writes to prototype biography files and route wiring needed to
display that section. Run npm run lint and git diff --check. Update only the
T-158 handoff.
```

## T-159 Prompt

```text
/task docs/tasks/T-159-build-blog-prototype-section.md details:
Build the full-width blog teaser section for /prototype/home using
to_prototype/blog.png as a layout guide only. Ignore the biography
wording/content shown in the image and render real blog entries from the
existing server-only blog list service. This is a homepage teaser section, not
the /blog landing page. Do not change the live homepage, BlogSection,
BlogSectionLoader, /blog, ContentLayout, global CSS, or shared trackers. Keep
writes to prototype blog files and route wiring needed to display that section.
Run npm run lint and git diff --check. Update only the T-159 handoff.
```

## T-160 Prompt

```text
/task docs/tasks/T-160-build-shop-prototype-section.md details:
Build the full-width shop teaser section for /prototype/home using
to_prototype/shop.png as the visual guide. This is a homepage teaser section,
not the shop landing page. Use real shop product data through existing
server-only services where available. Keep all copy enquiry-safe: no cart,
checkout, secure-payment, shipping, refund, buyer-protection, or guarantee
claims. Do not change the live homepage, live shop pages, ShopProductsLoader,
ShopProductGallery, Shopify DTO contracts, ContentLayout, global CSS, or shared
trackers. Keep writes to prototype shop files and route wiring needed to display
that section. Run npm run lint and git diff --check. Update only the T-160
handoff.
```

## T-161 Prompt

```text
/task docs/tasks/T-161-audit-style-system-point-of-truth.md details:
Perform a read-only style-system audit. Map where fonts, heading sizes, body
text, buttons, spacing, layouts, cards, Tailwind tokens, shadcn variables, and
repeated class patterns currently live. Do not change runtime CSS, Tailwind
config, component classes, or prototype sections. Create or update only the
audit/task docs needed for the handoff. Recommend a staged central style point
of truth in simple terms, including a safe pilot area and verification plan.
Run git diff --check. Update only the T-161 handoff; leave shared trackers for
the orchestrator.
```

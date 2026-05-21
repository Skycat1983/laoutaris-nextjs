# Homepage Prototype Owner Review Packet

Status: Ready for owner review

Review page: `/prototype/home`

How to open it:

- Local review: `http://localhost:3000/prototype/home`
- Deployed preview review: add `/prototype/home` to the preview site domain

This page is a workshop page only. It is not the live homepage, it is not in
the public navigation, and it is marked so search engines should not index it.

## What Changed

- The prototype uses a wider homepage canvas than the current live homepage.
- The biography, blog, collections, and shop sections were built from supplied
  visual guide images.
- The sections use real site data where possible: biography articles, blog
  posts, collections, and shop products.
- The wider version was rebalanced so desktop cards, images, rails, and text do
  not simply stretch across the screen.
- A focused desktop and mobile QA pass found no page-level horizontal scrolling.

## What To Review

Please review the page as a visual and content direction, not as final
production behavior.

Focus on these areas:

- Overall width: whether the homepage should feel this broad and full-screen.
- Collections: whether the first expanded room, narrow image panels, and
  collection order match the archive direction.
- Biography: whether the story order and featured first card are correct.
- Blog: whether the homepage should show latest blog posts or selected content.
- Shop: whether the wording, prices, and product-card labels set the right
  expectation.
- Mobile: whether the stacked sections feel clear or too long.
- Section links: whether jumping to sections should account for the fixed site
  header and breadcrumb area.

The hero, artwork, and project sections are still placeholders. The review
should focus mainly on the width direction plus the collections, biography,
blog, and shop sections.

## Recommendation

Use this prototype to approve or reject the wider homepage direction first.
Do not migrate it to the live homepage, and do not start the shared style-system
work, until the decisions below are answered.

## Decisions Needed

### 1. Width Direction

Decision question: Should the live homepage use this wider section style, keep
the current bounded page width, or use a mix?

Recommendation: Use the wider style for homepage teaser sections if it feels
more like a gallery landing page, while keeping long text blocks controlled so
they remain easy to read.

What this means:

- Wider: homepage sections can stretch across large screens and feel more
  immersive.
- Bounded: the homepage will continue to feel closer to the current archive
  pages.
- Mixed: selected sections, such as hero and shop, can be wide while text-heavy
  areas stay narrower.

Project impact: this decision controls the live homepage wrapper and future
section spacing rules.

### 2. Biography Order

Decision question: Should the biography cards use a fixed story order, or should
they continue to follow the current data order?

Suggested fixed order:

1. Early Years
2. Meeting Beryl
3. Later Years
4. Obituary
5. Ethos

Recommendation: Use a fixed story order if the homepage is meant to introduce
Joseph's life in a clear sequence.

What this means:

- Fixed order: the first card can always be `Early Years`, and the section reads
  as a life story.
- Current data order: the first card can change based on how biography articles
  are stored or sorted.

Project impact: this may require a small curated ordering rule before the
section moves to production.

### 3. Collection Order

Decision question: Should the collections section use the current data order, or
should the first expanded room and narrow panel order be curated?

Recommendation: Curate the order if the first expanded panel is meant to make a
specific owner-approved statement about the archive.

What this means:

- Current data order: the prototype follows the same collection list service as
  the live homepage section.
- Curated order: the owner can choose which room opens the section and how the
  supporting room panels are sequenced.

Project impact: this may require a small ordering field or route-local curation
rule before production migration.

### 4. Canonical Dates

Decision question: Which dates should the site use everywhere for Joseph
Laoutaris?

Options to confirm:

- `1935 - 2022`
- `1935 - 2023`

Recommendation: Confirm one date range before the prototype becomes the live
homepage.

What this means:

- If `1935 - 2022` is correct, the blog lead content using `1935 - 2023` should
  be corrected before launch.
- If `1935 - 2023` is correct, older biography or archive references should be
  updated to match.

Project impact: this affects visible copy, biography content, blog content,
metadata, and owner-approved archive facts.

### 5. Blog Strategy

Decision question: Should the homepage blog section show latest blog posts,
selected posts, or a biography-style editorial feature?

Recommendation: Use selected posts if the homepage needs a stable, curated
first impression. Use latest posts only if the owner wants the homepage to
change automatically whenever blog content changes.

What this means:

- Latest posts: the section stays current, but the lead story can change without
  a separate homepage review.
- Selected posts: the owner can choose exactly what appears on the homepage.
- Biography-style feature: the section becomes more like a story or memorial
  feature than a blog preview.

Project impact: this determines whether the production section needs simple
latest-post loading or an admin/curation rule.

### 6. Shop And Commerce Wording

Decision question: Is the shop ready to use sales-forward wording and visible
prices on the homepage?

Current prototype wording includes:

- `Available now`
- `Explore the shop`
- `View full shop`
- visible product prices
- `Details`

Recommendation: Keep the wording enquiry-led unless checkout, inventory,
shipping, refund, payment, and fulfilment expectations are approved.

What this means:

- Sales-ready wording tells visitors that products can be bought now.
- Enquiry-led wording tells visitors they can ask about availability before any
  purchase is implied.

Example enquiry-led alternatives:

- `Available works`
- `Explore available works`
- `View details`
- `Enquire about this work`

Project impact: this affects customer expectations and the future Shopify sales
path. The homepage should not imply a finished checkout or policy flow before
those operations are ready.

### 7. Shop Product Labels

Decision question: What should product cards show above the title?

Options:

- Product type, such as `Print` or `Book`
- Artwork medium and year, if available
- A short owner-approved label, such as `Archive product`

Recommendation: Prefer meaningful product type, medium, or year labels where
the data is available. Avoid generic labels if the product is ready for public
review.

What this means:

- Specific labels make the cards feel curated and complete.
- Generic labels are acceptable for a prototype, but feel unfinished for a live
  homepage.

Project impact: this may require product data cleanup or a mapping rule before
the section goes live.

### 8. Mobile Density

Decision question: On phones, should the homepage sections remain fully stacked,
or should some sections become more compact?

Recommendation: Keep the stacked mobile layout if the owner prefers clarity and
simple reading. Consider a more compact rail or carousel only if the page feels
too long.

What this means:

- Stacked: all content is visible in a straightforward scroll, but the page is
  taller.
- Compact: the page feels shorter, but some content may sit behind horizontal
  scrolling or controls.

Project impact: compact mobile behavior takes more design and accessibility
work than the current stacked approach.

### 9. Anchor And Header Behavior

Decision question: Should users be able to jump directly to homepage sections,
and if so, where should the section land under the fixed header?

Recommendation: If public section links or hash links are used, add spacing so
the section heading is not hidden under the header or breadcrumb area.

What this means:

- With anchor spacing: a link to the biography, blog, or shop section lands in a
  readable position.
- Without anchor spacing: a jumped-to heading can sit partly under the site
  chrome.

Project impact: this affects live homepage layout details, especially if the
homepage gets section navigation or campaign links.

## Owner Response Sheet

Please answer these before production migration:

- Width direction: wider, bounded, or mixed?
- Collection order: current data order or curated room order?
- Biography order: fixed story order or current data order?
- Canonical dates: `1935 - 2022` or `1935 - 2023`?
- Blog strategy: latest posts, selected posts, or biography-style feature?
- Shop wording: sales-ready or enquiry-led?
- Product labels: product type, medium/year, or owner-approved generic labels?
- Mobile density: stacked or more compact?
- Anchor behavior: should section links be supported, and should spacing be
  added under the header?

## Next Step After Approval

After these answers are confirmed, the team can plan the production homepage
migration and then start the shared style-system work from the accepted design
direction.

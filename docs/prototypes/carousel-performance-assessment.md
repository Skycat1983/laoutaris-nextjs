# Carousel Performance Assessment

Status: Ready for orchestrator review

Task: T-221 Assess Carousel Performance Foundation

Date: 2026-05-23

## Current Implementation Summary

The `/prototype/home` collections section now has two separate interaction
patterns in `src/components/prototypes/home/CollectionPrototypeSection.tsx`:

- Desktop/tablet renders `CollectionAccordion`, a custom flex accordion that
  changes active panel state, transitions `flex` and `min-height`, and uses a
  `ResizeObserver` to calculate expanded copy width.
- Mobile renders `MobileCollectionDeck`, a custom absolute-positioned staged
  card deck below the editorial intro. It keeps `activeIndex` in React state,
  stores touch start X in a ref, and changes active card only on `touchend`.
- Each mobile card remains mounted, uses `next/image` with `fill`, gradient
  overlays, rounded clipping, a large box shadow, vertical inactive titles,
  active overlay copy, a full-card button, and an active-card link.
- Mobile card positions are class-driven through
  `getMobileCardOffsetClass()`. The active and peeking cards change `opacity`,
  `transform`, `width`, and `height` over 500ms.
- The mobile deck is not using the existing Embla wrapper and does not provide
  drag-position feedback during a swipe. It waits for the gesture to end, then
  swaps classes and lets CSS animate the new staged card positions.

Existing carousel-like patterns:

- `src/components/modules/hero/carousel.tsx` wraps `embla-carousel-react` with
  context, keyboard handling, previous/next buttons, and Embla scroll state.
- `src/components/modules/hero/Hero.tsx` uses that wrapper with looping enabled
  for the live hero carousel.
- `src/components/sections/BiographySectionVariations.tsx` includes a simple
  native horizontal `overflow-x-auto snap-x` carousel variation with fixed-size
  cards and no custom gesture state.

## Evidence Gathered

Commands and checks:

- Read required docs and code: `AGENTS.md`, `docs/README.md`,
  `docs/orchestration/state.md`,
  `docs/workstreams/frontend-routes-and-components.md`,
  `docs/workstreams/testing-and-quality.md`,
  `docs/prototypes/homepage-owner-review-packet.md`,
  `docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md`,
  `src/components/prototypes/home/CollectionPrototypeSection.tsx`,
  `src/components/prototypes/home/HomePrototype.tsx`,
  `src/components/modules/hero/carousel.tsx`,
  `src/components/modules/hero/Hero.tsx`,
  `src/components/sections/BiographySectionVariations.tsx`, and
  `package.json`.
- Searched for carousel/prototype references with
  `rg -n "T-220|carousel|prototype/home|home prototype|collections deck|CollectionPrototype" docs/workstreams docs/prototypes docs/tasks src/components/prototypes/home src/components/modules/hero src/components/sections package.json`.
- Confirmed `embla-carousel-react` is already installed in `package.json`.
- Checked for installed browser automation with
  `rg --files node_modules/playwright node_modules/@playwright 2>/dev/null`;
  no Playwright package was found.
- Ran `npm run build`. It passed. Build output listed `/prototype/home` as a
  static route with `11.9 kB` route size and `113 kB` first-load JS.
- Attempted `npm run start` in the default sandbox. It failed with
  `listen EPERM: operation not permitted 0.0.0.0:3000`.
- Re-ran `npm run start` with approved escalation. Port `3000` was already in
  use, so it failed with `EADDRINUSE`.
- Ran `npm run start -- -p 3001` with approved escalation. The production
  server started successfully.
- Ran `curl -I http://localhost:3001/prototype/home`. It returned `HTTP/1.1
  200 OK`, `x-nextjs-cache: HIT`, `Content-Type: text/html; charset=utf-8`,
  and `Content-Length: 247365`.
- Ran `curl -s -o /dev/null -w "%{http_code} %{size_download}\n"
  http://localhost:3001/prototype/home`. It returned `200 247365`.
- Stopped the temporary production server with `kill 42117 42150` and confirmed
  port `3001` no longer responded.

Mode coverage:

- Static code review: run against the current workspace.
- Production mode: `npm run build` passed; built route status check passed on
  port `3001`.
- Dev mode: not run for this task. The owner-reported jank was already
  observed after T-220, and this assessment prioritized production-mode
  viability plus code-level causes.
- Phone-viewport browser interaction: not run. The repo does not have
  Playwright installed, and this assessment is not allowed to add dependencies.
  A curl status check cannot measure mobile swipe smoothness.

## Likely Bottlenecks, Ranked

1. The mobile deck animates `width` and `height` in addition to `transform` and
   `opacity`. Changing dimensions during every active-card swap can force
   layout work and image repaint/re-rasterization, especially with filled
   images, rounded clipping, shadows, and gradients.
2. Swipe handling is end-state only. The component does not track pointer
   movement or hand work to a native scroller/gesture engine, so the user sees
   no continuous drag response, then a class-swap animation after `touchend`.
   That can feel like low frame rate even when the CSS animation itself is not
   dropping every frame.
3. All visible cards rerender and all card classes churn on each active-index
   change. Six cards is not a huge React workload, but every interaction also
   changes the active `priority` image, active link/copy subtree, inactive
   vertical title subtree, z-index, dimensions, transforms, opacity, and
   accessibility attributes.
4. Image paint and decode costs are likely meaningful on phones. Mobile active
   images use `sizes` that resolves to `100vw`, and inactive cards are still
   mounted with filled images. When a new active card appears, the browser may
   need to decode or repaint a large image under clipping and gradient layers.
5. Large shadows, rounded overflow, gradients, and text overlays increase paint
   cost during movement. The shadow and clipped image stack is visually useful,
   but it is expensive when dimensions and stacking order are changing.
6. Dev mode can exaggerate the issue. Next dev mode has slower hydration and
   unoptimized development overhead, so production should be smoother. The
   production build size does not look alarming, but the CSS/layout pattern can
   still be janky on mobile hardware.
7. Desktop-only accordion measurement is probably not the mobile swipe
   bottleneck. The `ResizeObserver` and `getBoundingClientRect()` logic lives in
   the desktop `CollectionAccordion`, which is hidden behind the mobile-only
   deck at phone widths.

## Direction Comparison

### 1. Optimize The Custom Mobile Deck

Pros:

- Preserves the T-220 staged-card aesthetic most directly.
- Can keep side-card peeks, central featured card, vertical inactive labels,
  dots, and the current section composition.
- Does not require changing dependencies because the work stays local.

Cons:

- The current implementation is not actually transform-only because it
  transitions `width` and `height`.
- Smooth swipe would require a real pointer/drag model or a careful reduced
  interaction model. That is easy to get wrong across touch, mouse, keyboard,
  focus, reduced motion, and accessibility.
- A bespoke gesture engine is not a good reusable carousel foundation for
  future homepage, shop, and archive rails.

Best use:

- Keep this direction only if the owner requires the exact staged-card deck.
  The next implementation should convert it to fixed card dimensions,
  `transform`/`opacity`-only animation, predecoded active/adjacent images where
  practical, and button/dot navigation as the primary reliable path.

### 2. Migrate The Mobile Collections Deck To Embla

Pros:

- Embla is already installed and already wrapped in the app.
- It provides mature touch gesture handling, momentum, snap behavior, loop
  support, selected-index events, previous/next controls, and better reuse
  potential than a custom swipe handler.
- The app can build a reusable gallery carousel foundation without adding a new
  dependency.
- It separates gesture physics from visual styling; cards can still be styled
  with peeks, active states, dots, and controls.

Cons:

- The current hero wrapper has hero-specific dimensions in `CarouselItem`
  (`h-[600px] xl:h-[800px]`) and should not be reused directly for mobile
  collection cards without either a variant or a new foundation component.
- A pure Embla rail will not automatically match the staged overlapping mockup.
  If overlapping cards are mandatory, the implementation needs active-slide
  styling layered on top of Embla, or a simplified peeking rail.
- Care is needed to avoid refactoring the live hero carousel during the first
  implementation slice.

Best use:

- Recommended foundation direction. Build a small prototype-local Embla usage
  or a new reusable carousel primitive that is not tied to the hero item
  heights, then migrate the mobile collections deck to it.

### 3. Use Native Horizontal Scroll Snap

Pros:

- Lowest JavaScript and React overhead.
- Browser-native scrolling is usually smooth on mobile and works with touch,
  momentum, and accessibility defaults.
- The repo already has a simple example in `CarouselLayout` under
  `BiographySectionVariations.tsx`.
- Good fit for reusable mobile rails where each card can be independently
  inspected.

Cons:

- Harder to reproduce the centered staged-card deck with overlapping peeks and
  active-card overlays.
- Dots, active state, and "current slide" announcements need extra observer or
  scroll state if they are required.
- Scroll snap can feel less deliberate for a hero-like featured card unless
  paired with clear controls.

Best use:

- Strong default for straightforward shop/archive/blog rails. For this
  collections mockup, it is a fallback if the owner prefers smoothness and
  simplicity over the staged-card effect.

### 4. Use Button-Led Controls With Swipe Secondary

Pros:

- Most predictable and accessible interaction.
- Reduces dependence on swipe performance and makes low-end mobile behavior
  easier to verify.
- Works with either Embla, native scroll snap, or an optimized custom visual
  deck.
- Explicit previous/next buttons make the carousel discoverable, unlike hidden
  swipe-only behavior.

Cons:

- Does not solve the underlying animation cost by itself.
- The current mockup did not call for visible previous/next buttons, so owner
  review may be needed for button placement.

Best use:

- Recommended as the interaction model for the next slice: previous/next and
  dots should be primary, swipe should be a secondary enhancement.

## Recommendation

Use Embla as the durable carousel foundation, with explicit previous/next
buttons and dots as primary controls, and swipe as a secondary enhancement.

Do not reuse the current hero wrapper directly without adjusting its API,
because `CarouselItem` is currently sized for the live hero. The safest next
slice is to add a prototype-local Embla mobile collections implementation or a
small reusable carousel primitive that supports variable item sizing without
touching the live hero behavior. The first implementation should preserve the
mobile collections section content and links, but simplify the staged-card
animation enough to keep movement compositor-friendly.

Implementation direction for the next task:

1. Replace `MobileCollectionDeck` gesture handling with Embla-powered
   horizontal movement.
2. Keep collection data, href generation, heading copy, section CTA, empty
   state, and desktop accordion unchanged.
3. Render mobile cards with stable dimensions and avoid animating `width` or
   `height`.
4. Use `transform`/`opacity` and optional scale for active/adjacent styling.
5. Add visible previous/next icon buttons near the mobile deck and keep dots as
   selected-slide controls.
6. Keep keyboard navigation and `aria-live` current-slide announcement.
7. Only after the prototype proves smooth, decide whether to promote the new
   primitive to a shared non-hero carousel module.

## Files The Next Implementation Should Edit

- `src/components/prototypes/home/CollectionPrototypeSection.tsx`
- Focused tests in `__tests__/unit/pages/PrototypeHomePage.test.tsx`
- Optionally a new prototype-local helper under
  `src/components/prototypes/home/` if the Embla mobile deck needs a small
  internal component split.
- Optionally a new shared primitive under `src/components/modules/carousel/`
  only if the task explicitly scopes reusable carousel foundation work beyond
  the prototype.

## Files The Next Implementation Should Not Edit

- `src/components/modules/hero/carousel.tsx`
- `src/components/modules/hero/Hero.tsx`
- `src/components/views/Home.tsx`
- Live collection pages, collection loaders, and collection services.
- `package.json` and lockfiles.
- Global CSS, Tailwind config, root layout, header, footer, and public
  navigation.
- Shared trackers and workstream files unless the orchestrator explicitly
  assigns reconciliation.

## Verification Plan For The Next Implementation

Required narrow checks:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx
npm run lint
git diff --check
```

Production route check:

```bash
npm run build
npm run start -- -p 3001
curl -I http://localhost:3001/prototype/home
```

Browser check, if automation is available:

- Inspect only `/prototype/home` at a phone viewport such as `390x844`.
- Verify the mobile collections deck responds smoothly to one next-button
  click, one previous-button click, one dot selection, keyboard left/right, and
  one swipe.
- Confirm no page-level horizontal overflow.
- Confirm text and buttons do not overlap the card imagery, dots, section CTA,
  or viewport edges.
- Avoid traces, videos, full DOM dumps, broad console logs, and large
  screenshot sets.

Performance-specific checks:

- Prefer Chrome/Safari Performance panel or automation metrics only for the
  collections section, not a full-page trace.
- Confirm card movement does not animate `width`, `height`, `top`, `left`,
  margin, or layout-affecting flex values on mobile.
- Confirm active and adjacent image loading does not cause visible blanking
  during the first two interactions.
- Compare production mode, not only Next dev mode.

## Open Questions And Owner Decisions

- Is the exact overlapping staged-card look required, or can the mobile deck
  become a smoother peeking Embla rail that keeps the same editorial tone?
- Are visible previous/next controls acceptable in the mobile composition, or
  should they be visually subtle while still accessible?
- Should future homepage/shop/archive carousels share one foundation now, or
  should the next task prove the approach in `/prototype/home` first and
  promote it after owner approval?

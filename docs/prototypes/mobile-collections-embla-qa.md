# Mobile Collections Embla QA

Status: Ready for orchestrator review

Task: T-223 Review Mobile Collections Embla QA

Date: 2026-05-23

## Environment

- App mode: production build and production server.
- Route checked: `/prototype/home`.
- Local URL: `http://localhost:3001/prototype/home`.
- Browser/device: no real browser interaction session was available in this
  workspace. Repo-local Playwright, `@playwright/test`, and Puppeteer are not
  installed. Safari WebDriver was present, but `safaridriver --enable` required
  a local password and `safaridriver -p 4444` exited without creating a usable
  session.
- Target viewport for attempted QA: `390x844`.
- Code and test review covered the mobile carousel implementation in
  `src/components/prototypes/home/CollectionPrototypeSection.tsx` and the
  existing focused prototype page test.

## Commands Run

```bash
sed -n '1,220p' docs/README.md
sed -n '1,240p' docs/tasks/T-223-review-mobile-collections-embla-qa.md
sed -n '1,220p' docs/workstreams/README.md
git status --short
sed -n '1,260p' docs/orchestration/state.md
sed -n '1,260p' docs/prototypes/homepage-owner-review-packet.md
sed -n '1,260p' docs/prototypes/carousel-performance-assessment.md
sed -n '1,260p' docs/tasks/T-220-implement-mobile-collections-prototype-aesthetic.md
sed -n '1,300p' docs/tasks/T-221-assess-carousel-performance-foundation.md
sed -n '1,320p' docs/tasks/T-222-migrate-mobile-collections-carousel-to-embla.md
sed -n '1,360p' src/components/prototypes/home/CollectionPrototypeSection.tsx
sed -n '360,760p' src/components/prototypes/home/CollectionPrototypeSection.tsx
sed -n '1,240p' src/components/prototypes/home/HomePrototype.tsx
sed -n '1,260p' docs/workstreams/frontend-routes-and-components.md
sed -n '1,260p' docs/workstreams/testing-and-quality.md
node -e "for (const m of ['playwright','@playwright/test','puppeteer']) { try { console.log(m, require.resolve(m)); } catch (error) { console.log(m, 'unavailable'); } }"
sed -n '1,220p' package.json
which safaridriver
which osascript
which google-chrome
which chromium
npm run build
npm run start -- -p 3001
curl -I http://localhost:3001/prototype/home
/System/Cryptexes/App/usr/bin/safaridriver --enable
/System/Cryptexes/App/usr/bin/safaridriver -p 4444
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx
ps -ax
kill 48039 48073
curl -I --max-time 2 http://localhost:3001/prototype/home
git diff --check
```

## Interaction Assessment

- Swipe/drag: not directly verified in a browser. Code review confirms the
  mobile carousel is Embla-powered via `useEmblaCarousel`, with `loop` enabled
  when more than one collection is present and the old custom `touchStart` /
  `touchEnd` swipe state removed. This is the expected fix for the previous
  end-state-only swipe jank, but real touch feel remains unmeasured here.
- Next button: covered by the focused prototype test and source review. The
  visible next button calls `scrollNext()` and keeps `activeIndex` synchronized.
- Previous button: covered by the focused prototype test and source review. The
  visible previous button calls `scrollPrev()` and keeps `activeIndex`
  synchronized.
- Dots: covered by the focused prototype test and source review. Dot buttons
  call `scrollTo(index)` and update selected state.
- Keyboard left/right: covered by the focused prototype test and source review.
  The mobile carousel region is focusable and handles `ArrowLeft` /
  `ArrowRight`.

## Smoothness Assessment

Verdict: `borderline`.

The code-level indicators are good: the mobile cards use stable slide/card
dimensions, Embla handles dragging, and card state transitions are limited to
`opacity` and `transform`. The focused test also includes a source-level
guardrail for the Embla migration and transform-only card transitions.

The verdict is still `borderline` instead of `pass` because no actual
phone-viewport browser interaction was possible in this environment. The
previous owner complaint was specifically about perceived swipe smoothness, so
that needs either a manual phone check or a working browser automation session
before calling the interaction fully passed.

## Layout Assessment

- Page-level horizontal overflow: code review indicates low risk. The mobile
  carousel is inside a section frame with `overflow-hidden`, and the full-width
  carousel strip uses `mx-[calc(50%-50vw)]` so side-card peeks should stay
  clipped to the viewport instead of forcing page scroll.
- Side-card peeks: preserved through centered Embla slides with `basis-[76vw]`
  and scaled adjacent cards.
- Control overlap: acceptable by source review. Previous/next controls sit at
  the vertical center of the carousel with pointer events isolated to the
  buttons; active card text remains in the lower overlay. A live mobile check
  should still confirm the buttons do not obscure important artwork detail.
- Active-card text readability: likely acceptable. Active cards retain the dark
  bottom gradient and white text overlay from the prototype composition.
- Bottom `Explore the collections` CTA: source review confirms the CTA remains
  after the mobile carousel and is visible on mobile via the `lg:hidden` link.
- Hidden prototype dock: source review confirms
  `PrototypeHomeControlRail` remains `hidden ... lg:block`, so the fixed
  prototype control dock is absent on mobile.

## Regression Risks

- Real touch/momentum smoothness is unverified because no browser session could
  be launched. This is the main remaining risk.
- The selected state is updated both optimistically in button/dot handlers and
  again from Embla `select` / `reInit` events. Tests pass, but a real-browser
  pass should confirm no visible double-step when looping from the first to
  last slide or last to first.
- The carousel still uses image overlays, rounded clipping, box shadows, and
  `next/image` fills. These are now paired with transform-only card state
  changes, but lower-powered phones should still be checked manually.

## Recommendation

Accept the Embla implementation for owner review with one explicit caveat:
interaction smoothness has passed code/test review, but not a real phone or
browser-device-emulation check in this workspace.

Do not prepare another implementation slice from this QA pass alone. If the
owner or a manual phone check still reports jank, the next implementation task
should target only mobile carousel paint cost:

1. reduce or remove active-card shadow during drag,
2. audit image `sizes` for the mobile Embla slide width,
3. consider reducing inactive-slide overlay/text work,
4. verify on a real phone or installed browser automation at `390x844`.

## Verification Results

- `npm run build`: passed. Build output reported `/prototype/home` as static
  with `11.9 kB` route size and `121 kB` first-load JS.
- `npm run start -- -p 3001`: production server started successfully.
- `curl -I http://localhost:3001/prototype/home`: returned `HTTP/1.1 200 OK`
  with `x-nextjs-cache: HIT`.
- `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`:
  passed, 1 suite / 20 tests.
- `git diff --check`: passed.
- Temporary production server: stopped after QA. A follow-up
  `curl -I --max-time 2 http://localhost:3001/prototype/home` failed to
  connect, confirming the server was no longer listening.

# Style System Audit

Status: Completed audit for
[T-161](../tasks/T-161-audit-style-system-point-of-truth.md).

Workstreams:
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Testing and quality](../workstreams/testing-and-quality.md).

## Summary

The app has several useful style anchors, but no single semantic style point of
truth for common typography, spacing, buttons, cards, or section layouts.
Current styling is split across Tailwind theme tokens, global CSS utilities,
`next/font` variables, shadcn primitives, layout components, typography helpers,
and route-local Tailwind class strings. A central system should start as a
client-safe semantic class map and small wrappers around existing primitives,
then migrate one isolated surface at a time without changing emitted class
strings in the first pass.

No runtime CSS, Tailwind config, component classes, or prototype code was
changed for this audit.

## Scope Inspected

- `tailwind.config.ts`
- `src/app/globals.css`
- `src/lib/styles/fonts.ts`
- `src/app/layout.tsx`
- `src/components/shadcn/button.tsx`
- `src/components/shadcn/input.tsx`
- `src/components/shadcn/select.tsx`
- `src/components/shadcn/label.tsx`
- `src/components/shadcn/checkbox.tsx`
- `src/components/shadcn/skeleton.tsx`
- `src/components/elements/typography/*`
- `src/components/elements/buttons/*`
- `src/components/layouts/public/*`
- `src/components/layouts/admin/*`
- Representative public routes, views, cards, sections, filters, and prototype
  components under `src/app`, `src/components/views`,
  `src/components/modules`, `src/components/sections`, and
  `src/components/prototypes/home`.

## Current Style Decision Map

| Area | Current owners | Notes |
| --- | --- | --- |
| Font loading | `src/lib/styles/fonts.ts`, `src/app/layout.tsx` | The core Google font families are loaded through `next/font/google` and attached to `<html>` as CSS variables. The `/prototype/home` navbar font selector also exposes regular-weight local/system font stacks for review without adding more Google font downloads to the build. The core `next/font/google` usage remains part of the known environment-sensitive build surface. |
| Font family tokens | `tailwind.config.ts`, `src/app/globals.css` | Tailwind exposes `font-archivo`, `font-archivoBlack`, `font-cormorant`, `font-cinzelDecorative`, and `font-crimson` style classes. Global utilities also expose `fontface-*` classes. |
| Color and radius tokens | `tailwind.config.ts`, `src/app/globals.css` | shadcn variables define `background`, `foreground`, `primary`, `muted`, `accent`, `border`, `ring`, and radius tokens. App-specific `slate`, `whitish`, and `greyish` tokens sit beside many route-local `gray-*`, `black`, `white`, and hex colors. |
| Base CSS | `src/app/globals.css` | Global reset applies margin, padding, `box-border`, borders, body colors, scroll behavior, animation utilities, drop caps, scrollbar hiding, and color picker classes. |
| Typography helpers | `src/components/elements/typography/*` | `HomepageSectionHeading`, `BlogSectionHeading`, and `ModalMessage` exist, but they are narrow and do not define shared page title, section title, body, caption, metadata, or card title roles. |
| Buttons | `src/components/shadcn/button.tsx`, `src/components/elements/buttons/*`, route-local buttons | shadcn `Button` is the strongest existing primitive. `SubmitButton` wraps it. Subnav uses global `.subheading-button` classes through `NavItem`. Several public views still use raw `<button>` or `<Link>` class strings for CTA and pagination styles. |
| Forms and controls | `src/components/shadcn/*`, public/admin form components | shadcn `Input`, `Select`, `Label`, `Checkbox`, `Textarea`, and `Form` own many admin/public forms. Legacy auth and some route-local controls still carry raw input/button classes. |
| Page and section layout | `src/components/layouts/public/*`, `src/components/layouts/admin/*`, route files | `ContentLayout`, `BlogsViewLayout`, `SectionLayout`, `MasonryLayout`, and admin layouts provide partial structure, while routes still repeat `container mx-auto`, `max-w-7xl`, `grid grid-cols-*`, `px-4 py-*`, and large gap utilities. |
| Cards | `src/components/modules/cards/*` | Cards are mostly bespoke. Repeated patterns include image aspect containers, overlay gradients, `bg-white rounded-lg shadow-sm p-6`, `line-clamp-*`, metadata captions, and card titles. No shared card style role currently owns these. |
| Prototype home sections | `src/components/prototypes/home/*` | The prototype route uses a more coherent local pattern: `max-w-[1440px]`, responsive horizontal padding, Cormorant display headings, Archivo body text, and border/CTA classes. These are useful evidence, but the prototype files should not be used as global style owners. |

## Repeated Patterns Worth Centralizing

- Page titles: current examples include `text-5xl font-bold`,
  `text-5xl lg:text-6xl`, `text-4xl font-archivo font-semibold`,
  `font-cormorant text-5xl sm:text-6xl lg:text-7xl`, and
  `text-6xl fontface-crimson`.
- Section headings: current examples are split between
  `HomepageSectionHeading`, `BlogSectionHeading`, hero slide headings,
  prototype headings, and route-local section titles.
- Body text: article/blog body copy commonly uses `prose-xl`, `prose-lg`,
  `leading-8`, `py-2`, and the global `.drop-cap` utility. Product/shop copy
  uses `text-gray-700 leading-relaxed` or `text-sm text-gray-600`.
- Captions and metadata: repeated clusters include `text-sm text-gray-500`,
  `text-xs uppercase`, `uppercase tracking-wider`, and `font-archivo text-xs`.
- CTAs: repeated patterns include shadcn `Button`, black/white raw buttons
  such as `bg-black text-white p-4 w-full`, product CTAs such as
  `rounded-md bg-black px-8 py-4`, and prototype border CTAs.
- Layout frames: repeated frames include `container mx-auto p-4`,
  `max-w-7xl mx-auto px-4`, two-column `grid grid-cols-1 lg:grid-cols-2`, and
  centered prototype bands with `max-w-[1440px] px-4 sm:px-8 lg:px-14`.
- Cards: repeated surface classes include `bg-white`, `rounded-lg`,
  `rounded-xl`, `shadow-sm`, `hover:shadow-md`, `overflow-hidden`,
  `aspect-square`, `line-clamp-2`, and overlay `bg-gradient-to-t
  from-black/70 to-transparent`.

## Inconsistencies And Migration Risks

- Font naming is not fully consistent. Tailwind uses `font-*` family utilities,
  globals define `fontface-*`, and some call sites reference names that do not
  match the visible global utility naming. Any migration should first inventory
  actual rendered classes and avoid renaming utilities in place.
- `tailwind.config.ts` appears to define the Crimson CSS variable as
  `var(--font-crimson` without a closing parenthesis, while
  `src/app/globals.css` uses `var(--font-crimson)` in `.fontface-crimson`.
  Treat this as a candidate follow-up rather than changing it during the audit.
- shadcn `Button` already centralizes many button states, but raw CTA buttons
  remain in public route files, article views, filter controls, and shop cards.
  Broad replacement would affect public navigation, commerce enquiry paths,
  and admin workflows.
- Global CSS contains both shadcn tokens and app-specific utilities. Editing
  `src/app/globals.css` can affect every public and admin route, so it should
  not be the first migration surface.
- Hard-coded hex colors and brand-like accent colors are present in prototype
  sections and some live components. Moving them into tokens before the visual
  direction is accepted could freeze prototype choices too early.
- Class merging order matters. A future semantic class helper should use the
  existing `cn()` helper and preserve call-site override behavior.
- Any shared style module imported by client components must stay pure and
  client-safe. It should not import route data, models, server helpers, or broad
  mixed barrels.
- Tailwind content scanning should be considered before moving class strings.
  Keeping literal class strings in `src` modules is lower risk than generating
  dynamic Tailwind class names.

## Recommended Point Of Truth

Use a three-layer model instead of pushing everything into Tailwind or globals:

1. Raw tokens stay in `tailwind.config.ts` and `src/app/globals.css`.
   These should own colors, radii, font families, and shadcn variables only.
2. Semantic class names live in a pure, client-safe TypeScript module, for
   example `src/lib/styles/semanticStyles.ts`. This module should export class
   strings for roles such as page titles, body text, captions, section frames,
   card surfaces, and CTA links.
3. Components own structure and accessibility. Use shadcn `Button`, existing
   form primitives, and small typography/layout wrappers when a pattern needs
   markup, not just a class string.

Recommended naming for a first semantic class map:

| Role | Suggested name | First mapped patterns |
| --- | --- | --- |
| Page title | `text.pageTitle` | Large public route and admin page headings. |
| Display title | `text.displayTitle` | Hero/prototype display headings using Cormorant or archive display styles. |
| Section heading | `text.sectionHeading` | Homepage, blog, shop, and card-section headings. |
| Card title | `text.cardTitle` | Product, blog, biography, collection, and feed card titles. |
| Body text | `text.body` | Long-form paragraphs and route copy. |
| Muted body | `text.bodyMuted` | Product descriptions, subtitles, and secondary route copy. |
| Caption | `text.caption` | Dates, vendors, decades, media metadata, and small helper text. |
| Eyebrow | `text.eyebrow` | Uppercase prototype labels and metadata labels. |
| Primary CTA | `action.primary` | Black/white or primary shadcn CTA styles. |
| Secondary CTA | `action.secondary` | Outlined/border CTAs. |
| Text CTA | `action.textLink` | Border-bottom or underline style CTAs. |
| Page frame | `layout.pageFrame` | `max-w-7xl mx-auto px-4` style wrappers. |
| Section band | `layout.sectionBand` | Full-width section background and vertical padding. |
| Content rail | `layout.contentRail` | Centered readable article/product copy width. |
| Card surface | `surface.card` | White/rounded/shadow/border card surfaces. |
| Media frame | `surface.mediaFrame` | Image aspect/overflow/background containers. |

## Staged Migration Plan

1. Freeze the audit as the reference point.
   Do not edit Tailwind, globals, or component class names until an
   implementation task is accepted.
2. Add a pure semantic class map with exact copies of existing class strings.
   The first implementation task should introduce names only, with no visual
   behavior change.
3. Pilot on an isolated surface. The safest candidate is the
   `/prototype/home` route after T-157 through T-160 settle, because it is
   intentionally isolated from the live homepage. Use only exact class-string
   extraction in that pilot.
4. Pilot one live but narrow pattern after the prototype pilot passes. Good
   candidates are product/shop card titles and muted captions in
   `ProductCard`, or admin page heading classes in admin-only layout files.
5. Extend to buttons by wrapping shadcn `Button` variants and raw CTA links only
   after visual parity is confirmed. Avoid changing mobile article navigation,
   public filters, and product enquiry CTAs in the first live slice.
6. Move stable patterns into small components only when class maps are not
   enough. Examples: `PageTitle`, `SectionHeading`, `CardTitle`,
   `MutedCaption`, `SectionFrame`, and `CardSurface`.
7. Consider Tailwind/global token changes last. Token changes should happen
   only after the semantic layer proves which styles are genuinely shared.

## Verification Plan For Future Implementation

- Always run `git diff --check`.
- Run `npm run lint` for any source-code migration.
- Run focused component or route tests only when behavior, accessibility, data
  mapping, or fallbacks change.
- For visual parity implementation tasks, use tightly scoped screenshots for
  only touched routes or components. Suggested first screenshots:
  `/prototype/home`, `/shop/products`, one product detail page, one blog detail
  page, and one admin CRUD form if those surfaces are touched.
- Do not use broad traces, videos, full DOM dumps, or full-site screenshot sets
  for style migration verification unless separately assigned.

## Candidate Tracker Updates

These were not applied because T-161 ran under concurrent audit rules.

- Frontend workstream: add a follow-up task to create
  `src/lib/styles/semanticStyles.ts` with exact existing class strings and
  pilot it on `/prototype/home` after the homepage prototype tasks settle.
- Architecture workstream: add a follow-up task to define client-safe ownership
  for shared style modules and avoid server imports or mixed barrels.
- Testing workstream: add a style-migration verification note requiring
  `git diff --check`, lint for source changes, and only scoped screenshots for
  touched routes.
- Findings register candidate: current style decisions are split across
  Tailwind, globals, shadcn primitives, layout helpers, typography helpers, and
  route-local classes, making broad visual changes high risk without a semantic
  migration plan.

## Commands Run

- `sed -n '1,240p' docs/tasks/T-161-audit-style-system-point-of-truth.md`
- `sed -n '1,260p' docs/README.md`
- `git status --short`
- `rg --files docs/workstreams docs/audits docs/architecture docs/runbooks docs/decisions docs/risks docs/tasks`
- `sed -n '1,260p' docs/audits/README.md`
- `sed -n '1,260p' docs/audits/goals.md`
- `sed -n '1,280p' docs/workstreams/frontend-routes-and-components.md`
- `sed -n '1,280p' docs/workstreams/architecture-refactor-and-code-health.md`
- `sed -n '1,280p' docs/workstreams/testing-and-quality.md`
- `sed -n '1,260p' tailwind.config.ts`
- `sed -n '1,320p' src/app/globals.css`
- `sed -n '1,220p' src/lib/styles/fonts.ts`
- `rg --files src/components/elements/typography src/components/layouts src/components/sections src/components/modules/cards src/components/shadcn src/components/ui`
  reported that `src/components/ui` does not exist; the existing style
  directories were listed and inspected.
- `rg -n "font-|text-|tracking-|leading-|space-|gap-|px-|py-|mt-|mb-|rounded|shadow|border|bg-|Button|buttonVariants|cn\\(" src/components src/app -g '*.tsx' -g '*.ts'`
- Targeted `sed` reads of representative typography, shadcn, layout, card,
  section, form, filter, route, view, and prototype files listed above.
- Targeted `rg` searches for button, typography, layout, card, shadcn, and
  style-system references.

## Next Action

After the orchestrator accepts the audit, create a small implementation task to
add a pure semantic style class map and pilot exact class extraction on
`/prototype/home` after the active homepage prototype work has settled.

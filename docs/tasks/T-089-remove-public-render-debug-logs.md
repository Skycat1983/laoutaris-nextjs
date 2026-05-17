# T-089 Remove Public Render Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining high-noise public/account render debug logs that repeatedly
show up in build handoffs, while preserving layout, navigation, article, and
account comments behavior.

## Context

- F-020 tracks debug logs and expected output that make tests, builds, SSR, API,
  upload, and commerce paths noisy.
- T-088 removed direct MongoDB helper and auth adapter debug logs.
- Recent verification handoffs repeatedly mention branch-verification,
  navigation-link, and `ArticleView` debug output outside the completed slices.
- A current source check shows direct render `console.log()` calls in:
  - `src/app/layout.tsx`
  - `src/components/modules/navigation/subnav/Subnav.tsx`
  - `src/components/views/ArticleView.tsx`
  - `src/components/views/DesktopArticleView.tsx`
  - `src/components/views/UserCommentsView.tsx`

## Scope

In scope:

- Remove the root-layout branch verification `console.log()` from
  `src/app/layout.tsx`.
- Remove direct `console.log()` calls from `Subnav`, `ArticleView`,
  `DesktopArticleView`, and `UserCommentsView`.
- Preserve `RootLayout`'s current `dbConnect()`, `getServerSession()`,
  providers, header, footer, metadata, fonts, and DOM structure.
- Preserve `Subnav` link rendering, disabled-link behavior, scroll area, and
  skeleton behavior.
- Preserve `ArticleView`/`DesktopArticleView` props, mobile/desktop branching,
  title derivation, previous/next links, article content rendering, and optional
  form rendering.
- Preserve `UserCommentsView` grouping by blog slug, blog link construction,
  comment card rendering, placeholder username helper, and account comments UI.
- Add or update focused source hygiene coverage proving those touched files do
  not contain direct `console.log()` or the retired debug strings.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not move DB/session work out of `RootLayout`; F-025/root-layout ownership
  remains separate.
- Do not change route-level `console.error()` handling, API error logging, or
  public-safe response behavior.
- Do not change non-touched admin forms, galleries, utility components, or other
  debug logs elsewhere in the repo.
- Do not introduce a logging library, request correlation, monitoring, or global
  logging/redaction policy.
- Do not redesign navigation, article, or account comments UI.

## Files Likely Touched

- `src/app/layout.tsx`
- `src/components/modules/navigation/subnav/Subnav.tsx`
- `src/components/views/ArticleView.tsx`
- `src/components/views/DesktopArticleView.tsx`
- `src/components/views/UserCommentsView.tsx`
- `__tests__/unit/security/credentialSourceHygiene.test.ts` or a focused
  render source-hygiene test file
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The touched files contain no direct `console.log()` calls.
- Source no longer contains the retired debug strings:
  `Branch verification test`, `article in ArticleView`, and
  `console.log("links"` / `console.log("comments"` / `console.log("title"`.
- Root layout still awaits `dbConnect()`, reads the session, and renders the
  same top-level providers/header/main/footer structure.
- `Subnav`, `ArticleView`, `DesktopArticleView`, and `UserCommentsView` keep
  their existing public props and rendering behavior.
- Focused source hygiene coverage prevents the removed render debug logs from
  returning.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused render source-hygiene tests>
npm run lint
npm run build
rg -n "Branch verification test|article in ArticleView|console\\.log\\(\"links\"|console\\.log\\(\"comments\"|console\\.log\\(\"title\"|console\\.log\\(" src/app/layout.tsx src/components/modules/navigation/subnav/Subnav.tsx src/components/views/ArticleView.tsx src/components/views/DesktopArticleView.tsx src/components/views/UserCommentsView.tsx
git diff --check
```

Completed verification on 2026-05-17:

```bash
npm test -- --runTestsByPath __tests__/unit/security/renderSourceHygiene.test.ts
npm run lint
npm run build
rg -n "Branch verification test|article in ArticleView|console\\.log\\(\"links\"|console\\.log\\(\"comments\"|console\\.log\\(\"title\"|console\\.log\\(" src/app/layout.tsx src/components/modules/navigation/subnav/Subnav.tsx src/components/views/ArticleView.tsx src/components/views/DesktopArticleView.tsx src/components/views/UserCommentsView.tsx
git diff --check
```

The focused source search returned no matches.

## Handoff Notes

- Prepared on 2026-05-17 after T-088 completed the DB helper logging cleanup.
- Keep this task limited to the five touched render files and source hygiene.
  If implementation finds broader logging needs, record them as follow-up
  candidates instead of expanding this slice.
- Completed on 2026-05-17 by removing the scoped direct render
  `console.log()` calls and adding
  `__tests__/unit/security/renderSourceHygiene.test.ts`.

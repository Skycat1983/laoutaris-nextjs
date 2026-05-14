# Testing Runbook

## Commands

```bash
npm test
npm run build
npm run lint
```

## Browser And Playwright Discipline

Browser-style checks can be useful for layout, routing, accessibility, and smoke
tests, but they can also produce excessive output.

When using Playwright or similar tools:

- Define the exact route, interaction, selector, and expected observation before
  running the check.
- Capture only the screenshot, console line, network fact, or assertion needed.
- Avoid full traces, videos, full DOM dumps, or broad log ingestion unless the
  audit or task explicitly requires them.
- Record concise findings and file paths in the result doc; do not paste large
  raw outputs.

## Current Test Shape

- Jest is configured through `next/jest`.
- Test environment is `jsdom`.
- Existing tests cover utility helpers and a small home view integration test.
- No browser end-to-end script is currently defined in `package.json`.
- Project owner reports that testing has been attempted but is not yet
  successfully established as a reliable project practice.

## Baseline Snapshot

As of the [A-006 testing baseline](../audits/results/A-006-testing-quality-baseline.md)
on 2026-05-14:

- `npm test` passed with 9 suites and 95 tests.
- `npm run lint` passed with no ESLint warnings or errors.
- `npm run build` failed in the default sandbox when Google Fonts could not be
  fetched, then passed with approved network access.
- A coverage probe across `src/**/*.{ts,tsx}` reported 1.78% statements and
  1.76% lines. Coverage is not an enforced gate.

Treat the build as environment-sensitive until font and live-data dependencies
are isolated or explicitly documented for CI.

## When To Add Tests

Add or update tests when changing:

- Route utilities or auth protection behavior.
- Data transforms that map MongoDB models to frontend types.
- Shopify product link helpers or product transformation.
- API route response behavior.
- Shared component behavior that affects multiple public routes.
- SSR, data-fetching, or loader patterns once the preferred rendering strategy is
  documented.

## Handoff Requirement

Every workstream update should record:

- Commands run.
- Pass or fail result.
- Any environment limitation.
- Follow-up risk if a failure remains unresolved.

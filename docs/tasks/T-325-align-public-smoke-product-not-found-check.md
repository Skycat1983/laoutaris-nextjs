# T-325 Align Public Smoke Product Not Found Check

Status: Completed

Workstreams:

- [Deployment Security And Observability](../workstreams/deployment-security-and-observability.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Keep scheduled public smoke useful for the shop missing-product path when the
route-local not-found UI is returned with HTTP `200` instead of HTTP `404`.

## Context

After the owner configured `SMOKE_BASE_URL` and approved the optional public
smoke values, a live production smoke run on 2026-05-28 passed every check
except `Product not found`. The missing handle rendered the expected
`Product not found` page, but the HTTP status was `200`, so the old smoke check
failed even though the route did not render a normal product page.

## Scope

In scope:

- Let the product not-found smoke check accept HTTP `404`.
- Let it also accept HTTP `200` only when the body contains the route-local
  `Product not found` UI.
- Add focused tests proving:
  - HTTP `404` still passes.
  - HTTP `200` with product not-found UI passes.
  - HTTP `200` with a normal product page fails.

Out of scope:

- Do not change `/shop/products/[productHandle]` runtime behavior.
- Do not change Shopify product lookup behavior.
- Do not change smoke account, admin, Vercel, rollback, or credentialed smoke
  behavior.

## Files Touched

- `scripts/smoke-public-routes.mjs`
- `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`
- `docs/tasks/T-325-align-public-smoke-product-not-found-check.md`

## Acceptance Criteria

- The smoke script still fails if the configured missing product handle becomes
  a real product page.
- A route-local product not-found UI with HTTP `200` no longer blocks public
  smoke.
- The approved production smoke values produce a green live smoke run.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts
npm run smoke:public -- --base-url=https://laoutaris-nextjs.vercel.app --search-query=art --artwork-id=661fc617648efb163cffacee --collection-slug=xxl --collection-artwork-id=661fc617648efb163cffacee --blog-slug=progress-report --product-handle=joseph-laoutaris-fine-art-print-no-034 --missing-product-handle=codex-smoke-missing-product
git diff --check
```

Results on 2026-05-28:

- Focused public smoke discovery tests passed: 1 suite, 5 tests.
- Live production public smoke passed: 16 passed, 0 failed, 0 skipped.
- `git diff --check` passed.

## Handoff Notes

- `SMOKE_MISSING_PRODUCT_HANDLE=codex-smoke-missing-product` remains the
  approved non-secret value.
- Keep the handle nonexistent. If Shopify later creates that product handle,
  the smoke check should fail because the body will no longer be the
  route-local product not-found UI.

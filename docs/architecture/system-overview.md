# System Overview

The Laoutaris Art Gallery app is a Next.js 14 App Router application for
publishing the Joseph Laoutaris art archive and preparing selected works for
Shopify-backed sales.

## Runtime Shape

- Public pages live under `src/app/`.
- Public, user, and admin API routes live under `src/app/api/v2/`.
- Shared UI is split across views, layouts, modules, elements, compositions,
  loaders, and shadcn components under `src/components/`.
- Domain schemas, models, types, transforms, API clients, session helpers, and
  configuration live under `src/lib/`.

## Primary Services

| Service | Purpose | Main code area |
| --- | --- | --- |
| MongoDB | Archive, users, content, comments, and app data | `src/lib/db`, `src/lib/data` |
| NextAuth | Credentials and OAuth authentication | `src/lib/config/authOptions.ts`, `src/app/api/auth` |
| Cloudinary | Artwork and content image hosting | `src/app/api/v2/admin/sign-cloudinary-params/route.ts`, Cloudinary schemas |
| Shopify | Product listing and product detail data | `src/lib/api/shopify`, `src/app/api/v2/public/shop` |
| Vercel | Expected deployment target | `next.config.mjs` |

## Data Flow Pattern

Typical public route flow:

1. App Router page or layout receives params and search params.
2. Server loader or server API client fetches MongoDB, Shopify, or navigation
   data.
3. Transform functions convert database models into frontend-friendly types.
4. Client components handle interactive filtering, forms, modals, or pagination.
5. API route handlers perform writes or client-triggered reads.

## Important Boundaries

- MongoDB remains the archive source of truth.
- Shopify remains the commerce source of truth for price, availability, variants,
  checkout-related product data, and product handles.
- Artwork records should only keep minimal Shopify references.
- Admin operations should go through admin APIs and protected routes.
- Client components must avoid imports that pull server-only dependencies into
  the browser bundle.
- Server-side rendering and data-fetching patterns are not yet considered
  settled; track that work in
  [Rendering and data fetching](rendering-and-data-fetching.md).

## Active Workstreams

- [Shopify commerce](../workstreams/shopify-commerce.md)
- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)
- [Data models and API](../workstreams/data-models-and-api.md)
- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)
- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)
- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

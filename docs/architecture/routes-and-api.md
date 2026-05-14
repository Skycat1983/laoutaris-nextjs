# Routes And API

This document maps the high-level route and API surface. Use it to orient before
changing page behavior, loaders, API routes, auth checks, or public data
contracts.

## Public Pages

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/artwork` | Artwork browsing |
| `/artwork/[artworkId]` | Standalone artwork detail |
| `/collections` | Collection browsing |
| `/collections/[slug]` | Collection detail |
| `/collections/[slug]/[artworkId]` | Artwork detail in collection context |
| `/biography` and `/biography/[slug]` | Biography content |
| `/blog` and `/blog/[slug]` | Blog listing and detail |
| `/project/*` | About, aims, contact, and film pages |
| `/search` | Search UI |
| `/shop` | Shop landing or redirect surface |
| `/shop/products` | Product listing |
| `/shop/products/[productHandle]` | Product detail by Shopify handle |

## Account And Admin Pages

| Route | Purpose |
| --- | --- |
| `/account` | Account home |
| `/account/settings` | User settings |
| `/account/comments` | User comments |
| `/account/favourites` | Favourites list |
| `/account/favourites/[artworkId]` | Favourited artwork detail |
| `/account/watchlist` | Watchlist |
| `/account/watchlist/[artworkId]` | Watchlist artwork detail |
| `/admin` | Admin entry |
| `/admin/dashboard` | Admin dashboard |
| `/admin/dashboard/[segment]` | Admin CRUD segment |

## API Route Groups

| Group | Prefix | Notes |
| --- | --- | --- |
| Auth | `/api/auth` | NextAuth route handlers |
| Public | `/api/v2/public` | Public reads and public form submissions |
| User | `/api/v2/user` | Authenticated user features |
| Admin | `/api/v2/admin` | Admin CRUD and Cloudinary signing |

## API Surface

Public APIs include artwork, collection, blog, article, search, enquiry,
navigation, and shop products.

User APIs include comments, navigation, profile, favourites, and watchlist.

Admin APIs include create, read, update, and delete operations for articles,
artwork, blogs, collections, comments, users, plus Cloudinary upload signing.

## Route Protection

- Middleware uses route utility functions to determine protected and admin
  routes.
- Admin access depends on `token.role === "admin"`.
- `/api/auth` is excluded from middleware checks.

Before changing auth or route visibility, update:

- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Auth runbook](../runbooks/auth.md)
- [Production risks](../risks/production-readiness.md), if the change leaves a
  known gap.

## API Contract Defaults

The project still needs a full response-shape inventory. Until that exists:

- Prefer consistent JSON success and error envelopes within each route group.
- Return appropriate HTTP status codes for not found, validation, unauthorized,
  forbidden, and upstream service errors.
- Keep public APIs free of sensitive fields.
- Keep user APIs scoped to the authenticated user.
- Keep admin APIs protected by role checks.

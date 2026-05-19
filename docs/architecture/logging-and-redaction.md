# Logging And Redaction

This document defines the production logging and redaction policy for non-route
runtime code. API-v2 route handlers already use the T-099 request ID and
structured logger contract; lower-level services, loaders, server actions,
client components, utilities, and provider clients should migrate toward the
same redaction rules without reintroducing broad direct console output.

## Current State

- API-v2 route handlers are guarded by source hygiene against direct
  `console.error()` and `console.warn()` calls.
- `src/lib/observability/logger.ts` is the only approved structured console
  writer today. Its direct `console.error()` and `console.warn()` calls are the
  sink for redacted JSON log lines until a monitoring provider is approved.
- No monitoring or error-reporting provider is installed. Provider selection,
  SDK setup, `instrumentation.ts`, alert automation, and provider environment
  variables remain governed by
  [monitoring and error reporting](monitoring-and-error-reporting.md).
- A source inventory on 2026-05-19 after T-133 found 0 non-route direct
  `console.error()`/`console.warn()` calls after
  excluding `src/app/api/v2/**` and `src/lib/observability/logger.ts`.

Inventory command:

```bash
rg -n "console\.(error|warn)\(" src --glob '!src/app/api/v2/**' --glob '!src/lib/observability/logger.ts'
```

Inventory by migration surface:

| Surface | Current inventory | Examples | Migration direction |
| --- | ---: | --- | --- |
| Admin dashboard clients | 0 calls across 0 files | CRUD forms, read-list copy failures, operation tabs, admin feeds, document reader | T-133 removed the remaining direct admin client console output while preserving existing form errors, loading resets, modal failure UI, silent copy attempts, success/fallback state, and upload/document-reader behavior. Future admin client reporting still requires an approved provider/helper and must not log submitted field values or validation payloads. |
| Account/user form and navigation clients | 0 calls across 0 files in the scoped T-131 slice | contact form, comment form, logout form, account-nav dropdown | T-131 removed browser console failures while preserving contact failure modal/reset behavior, comment retry state, logout modal/loading/redirect behavior, and account-nav session-aware sign-in/sign-out behavior. |
| Comment card owner actions | 0 calls across 0 files in the scoped T-131 slice | owner edit/delete comment failures | T-131 removed owner-action browser console failures while preserving edit retry state, delete failure modals, callbacks, and loading reset behavior. |
| Client error boundary | 0 calls across 0 files in the scoped T-131 slice | `ErrorBoundary` recovery path | T-131 removed browser console output while preserving the current fallback behavior for `window` error events. |
| Server loaders | 0 calls across 0 files in the scoped account saved-artwork loader slice | account saved-artwork loader | T-129 migrated the remaining account saved-artwork server loader to summarized structured events and normalized generic errors. Future server loader discoveries should use the same requestless logger pattern. |
| Provider and data services | 0 calls across 0 files in the scoped Shopify slice | Shopify client, shop product list service, artwork-linked Shopify resolver | T-127 migrated the scoped Shopify provider/data service files to summarized structured events and safe provider metadata. Future provider/data service discoveries should follow that pattern. |
| App Router pages | 0 calls across 0 files in the scoped public page slice | biography/collections redirects, Shopify product page linked-artwork fetches | T-126 migrated the scoped recoverable App Router page paths to server logging. Future page discoveries should use server logging when the page can recover, or rely on route segment error handling when it cannot. |
| Public browsing clients | 0 calls across 0 files in the scoped T-130 slice | artwork gallery, blog continuous loading, blog detail comments, infinite scroll, shop product gallery | T-130 removed browser console failures while preserving existing loading, empty/current-result fallback, infinite-scroll error, comment modal, and shop sorting/filter behavior. |
| Utilities and helpers | 0 calls across 0 files in the scoped T-132 slice | copy helper/card, date formatting, translation lookup, color/sidebar warnings | T-132 removed low-value utility/helper console output while preserving fallback values, copy attempts, no-element color rendering, and blog sidebar state. Future utility discoveries should return fallback values without logging unless there is an actionable production signal. |
| Server actions | 0 calls across 0 files in the scoped action slice | subscription, favourites, watchlist | T-128 migrated scoped subscription and saved-item action failures to structured server logging. Future server action discoveries should keep public action return values generic. |
| Shared fetcher | 0 calls across 0 files in the scoped T-132 slice | `createFetcher()` failure path | T-132 removed shared fetcher console output while preserving success envelopes, API error envelopes, header merging, JSON parsing, and Next control-flow rethrows. Future client reporting remains a separate provider/client-reporting decision. |
| Session helper | 0 calls across 0 files in the scoped helper slice | development test-header lookup fallback | T-128 migrated the development test-header lookup fallback to structured server logging without user identifiers or raw lookup errors. |

## Allowed Console Use

Direct `console.error()` and `console.warn()` are allowed only in these cases:

- The central structured logger implementation writes already-redacted JSON log
  lines to the platform console.
- Short-lived development diagnostics are gated so they cannot run in
  production, contain no user data, request data, provider payloads, or secrets,
  and are removed before task handoff unless explicitly documented.
- Test code may spy on or assert logging behavior, but source under `src` should
  not add new direct console calls outside an approved logger sink.

Direct console use is disallowed for:

- API route handlers, server loaders, server actions, shared data services,
  provider clients, session/auth helpers, client components, admin UI, and
  utility modules.
- Raw caught errors, raw response bodies, raw request bodies, form payloads,
  provider error arrays, validation error objects that include submitted values,
  user/session records, cookies, headers, tokens, or connection strings.
- Expected recoverable states such as empty lists, missing translations, copy
  failures, optional missing data, invalid user input, and failed client fetches
  that are already reflected in UI state.

## Server Logging Contract

Server-side migration tasks should use a structured helper rather than direct
console calls.

- Prefer event names that identify the stable boundary, for example
  `loader.public.collection_redirect.failed` or
  `provider.shopify.product_list.failed`.
- Include `level`, `event`, `timestamp`, and safe surface metadata.
- When an API route already has a T-099 request context, pass that request ID
  into lower-level services that need to log. Lower-level code should not call
  `headers()`, `cookies()`, or Next request APIs just to create a request ID.
- When no request context exists, such as App Router pages, server loaders,
  metadata generation, or build-time data collection, log without `requestId`
  or with an internal operation ID that is not exposed to users unless a later
  UI policy approves that behavior.
- Do not attach stacks by default. Stack capture may be allowed in development
  or after provider approval, but production logs should start with normalized
  error name/message, redacted fields, status category, and safe identifiers.
- Keep public responses and UI copy generic. Logging context must not leak back
  into user-facing error messages except through an approved public request or
  event reference.

## Client Logging Contract

Until a monitoring provider is approved, browser/client code should not treat
the browser console as production observability.

- Client components should update local state, show existing user-visible
  failure UI, or silently ignore non-actionable optional failures.
- Admin UI may show field-level or operation-level errors, but should not log
  raw form values, validation objects, uploaded asset metadata, user records, or
  API response bodies.
- Client error boundaries may keep their current recovery behavior until a
  provider task is assigned, but future client reporting must redact route,
  component, browser, and error metadata before leaving the browser.
- Copy-to-clipboard, translation fallback, and optional progressive-loading
  failures should not produce production console noise unless the user action
  has no visible fallback and the event is routed through an approved client
  reporting helper.

## Redaction Rules

These rules apply to console logs, future provider events, incident evidence,
and task handoffs.

- Never log authorization headers, cookies, CSRF tokens, OAuth tokens, NextAuth
  session tokens, passwords, password hashes, Shopify Storefront tokens,
  Cloudinary API secrets, MongoDB URIs, private keys, webhook URLs, or raw
  environment values.
- Do not log raw request bodies, raw form submissions, raw validation payloads,
  raw provider responses, raw GraphQL error arrays, full Mongoose documents, or
  full user/session/comment records.
- Redact email addresses by default. Any exception requires an owner-approved
  use case and focused tests.
- Prefer stable status categories, entity classes, counts, booleans, and safe
  route names over raw values.
- Public slugs, public Shopify product handles, and public numeric Shopify
  product IDs may be logged when they identify public content and are needed for
  triage. User IDs, session IDs, comment IDs, admin IDs, and private MongoDB
  document IDs should be omitted unless a focused task documents why a hashed or
  otherwise safe form is necessary.
- Provider logs should record the provider name, operation, coarse status, and
  safe public identifiers only. Token scopes, customer data, headers, query
  bodies, and upstream response payloads stay out of logs.
- Error values should be normalized before logging. Record name/message only
  after redaction, and avoid stack traces until a provider policy permits them.

## Migration Order

Future implementation tasks should avoid one large logging rewrite. Recommended
slices:

1. Public server loaders and App Router pages: completed for the scoped public
   loader/page slice in T-126. Future server loader or page discoveries should
   route recoverable failures to a server logging helper or remove low-value
   recoverable noise.
2. Shopify and provider/data services: completed for the scoped Storefront
   client, shop product list service, and artwork-linked Shopify resolver in
   T-127. Future provider/data service discoveries should summarize provider
   failures with safe handles/IDs and status categories instead of raw provider
   errors.
3. Server actions and session helpers: completed for scoped subscription,
   saved-item, and development test-header lookup failures in T-128. Future
   action/helper discoveries should preserve generic public return values and
   avoid raw user/session/request data.
4. Public/account client components and shared fetcher: completed for the
   scoped public browsing client slice in T-130, the scoped account/user form,
   navigation, comment-card, and error-boundary slice in T-131, and the shared
   fetcher failure path in T-132. Future client reporting remains a separate
   provider/client-reporting decision.
5. Admin dashboard clients: completed for CRUD forms, read lists, operation
   tabs, feeds, upload handling, and the document reader in T-133. Future admin
   client reporting still requires an approved provider/client-reporting helper.
6. Low-value utilities and helper warnings: completed for the scoped T-132
   translation, color, date, blog-sidebar, artwork-card copy, and copy-helper
   files while preserving fallback behavior.

Each implementation slice should add targeted source-hygiene coverage for the
files it touches. A recursive full-source guard for all non-route
`console.error()`/`console.warn()` calls should wait until the migration
inventory is substantially cleared.

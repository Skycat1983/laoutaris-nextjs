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
- A source inventory on 2026-05-18 after T-126 and T-127 found 65 non-route
  direct `console.error()`/`console.warn()` calls across 51 files after
  excluding `src/app/api/v2/**` and `src/lib/observability/logger.ts`.

Inventory command:

```bash
rg -n "console\.(error|warn)\(" src --glob '!app/api/v2/**' --glob '!src/lib/observability/logger.ts'
```

Inventory by migration surface:

| Surface | Current inventory | Examples | Migration direction |
| --- | ---: | --- | --- |
| Admin dashboard clients | 37 calls across 28 files | CRUD forms, read-list copy failures, operation tabs, admin feeds, document reader | Replace with user-visible admin state, form errors, and later provider client capture. Do not log submitted field values or validation payloads. |
| Browser components and hooks | 18 calls across 17 files | artwork gallery fetches, blog comments, contact/comment forms, logout, error boundary, infinite scroll | Replace with local UI state or a future client reporting wrapper. Browser console output should not be the production reporting path. |
| Server loaders | 1 call across 1 file | account saved-artwork loader | Route through a server logging helper that accepts optional request context and emits redacted event names. |
| Provider and data services | 0 calls across 0 files in the scoped Shopify slice | Shopify client, shop product list service, artwork-linked Shopify resolver | T-127 migrated the scoped Shopify provider/data service files to summarized structured events and safe provider metadata. Future provider/data service discoveries should follow that pattern. |
| App Router pages | 0 calls across 0 files in the scoped public page slice | biography/collections redirects, Shopify product page linked-artwork fetches | T-126 migrated the scoped recoverable App Router page paths to server logging. Future page discoveries should use server logging when the page can recover, or rely on route segment error handling when it cannot. |
| Utilities and helpers | 4 calls across 3 files | copy helper, date formatting, translation lookup | Remove or gate low-value noise; return fallback values without logging unless there is an actionable production signal. |
| Server actions | 3 calls across 3 files | subscription, favourites, watchlist | Use structured server logging with optional request/action context; keep public action return values generic. |
| Shared fetcher | 1 call across 1 file | `createFetcher()` failure path | Convert to structured logging at the caller-owned boundary or remove if callers already surface the error. |
| Session helper | 1 call across 1 file | development test-header lookup fallback | Keep development/test-only behavior scoped; do not emit user identifiers or raw lookup errors in production. |

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
3. Server actions and session helpers: migrate subscription, saved-item, and
   test-header lookup failures to structured server logging while preserving
   generic public return values.
4. Public/account client components and shared fetcher: replace browser console
   output with UI state or a provider-neutral client reporting wrapper after
   the client reporting decision is made.
5. Admin dashboard clients: replace admin form/feed/read-list console output
   with operator-visible states and, later, approved client reporting. This is a
   larger UI slice because many files are touched.
6. Low-value utilities and helper warnings: remove or gate translation, color,
   date, and copy-helper noise once callers own user-visible fallback behavior.

Each implementation slice should add targeted source-hygiene coverage for the
files it touches. A recursive full-source guard for all non-route
`console.error()`/`console.warn()` calls should wait until the migration
inventory is substantially cleared.

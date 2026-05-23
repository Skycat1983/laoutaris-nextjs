# Compliance Owner Decision Packet

Status: Owner-approved for implementation scoping

Related risk: [R-018 Compliance](../risks/production-readiness.md)

This packet turns the A-020 privacy, consent, third-party disclosure, account,
comment, contact, and commerce-policy gaps into owner/legal questions. It does
not provide approved policy copy, legal conclusions, retention promises, sale
terms, consent text, or public notices.

## Review Goal

Decide what the site is allowed to say and collect before implementation work
adds policy pages, footer links, consent records, unsubscribe behavior, account
privacy actions, comment/contact notices, or commerce policy copy.

Implementation should wait until the owner/legal reviewer confirms:

- whose legal/publisher identity the policies use;
- launch jurisdiction and intended audience assumptions;
- legal/privacy contact recipient and response owner;
- approver, policy version, and effective date for approved decisions;
- who owns each public policy page;
- which routes and footer/form links should exist;
- which notices or acknowledgements should be visible;
- which data fields should be recorded for consent, requests, and retention;
- which commerce responsibilities remain on Shopify and which belong to this
  app.

## Current Implemented Behavior

- A-020 confirmed the site collects or stores personal data through account
  registration, OAuth sign-in, newsletter subscription, contact/enquiry forms,
  comments, saved artwork lists, and admin-managed user/comment records.
- T-213 added public `/privacy` and `/terms` pages plus footer legal links.
  The privacy page includes cookie/session and third-party disclosure for the
  current implemented surfaces.
- T-214 added explicit newsletter consent/source metadata and public
  unsubscribe behavior.
- T-215 added credentials signup acknowledgement, an app-owned OAuth/provider
  sign-in notice, acknowledgement metadata for new credentials and
  OAuth-created users, and a manual account delete/export/correction request
  handoff. Self-service account deletion/export/correction is not implemented.
- T-216 added public comment posting notice with `/privacy` and `/terms` links
  plus a manual moderation/removal/correction request handoff. Moderation
  workflows, report buttons, request persistence, and retention automation are
  not implemented.
- T-217 added contact/product and artwork enquiry privacy/retention notice
  copy with `/privacy` and `/terms` links plus a manual privacy/legal handoff.
  Enquiry schema changes, stored notice metadata, operator workflow changes,
  and retention automation are not implemented.
- T-218 removed footer social placeholders instead of inventing social URLs and
  replaced stale fixed 2024 copyright text with current-year text.
  Public sale, refund, return, shipping, and account privacy self-service pages
  or flows are not implemented.
- T-100 now preserves normalized Shopify product handles in contact enquiries
  sent from `/project/contact?product=...`.
- T-208 added a Shopify-hosted purchase handoff when Shopify exposes a valid
  public product URL. Checkout is completed on Shopify; this app still does not
  own cart, checkout, payment, shipping, refunds, orders, fulfilment, or buyer
  protection.
- T-209 removed unsupported shared-banner claims about payment, shipping,
  refunds, guarantees, and buyer protection.
- T-210 and T-211 expanded public search to artworks and Shopify products while
  keeping result copy discovery-focused and separate from commerce policy
  claims.

## Owner Approval Record

Recorded on 2026-05-22 from the owner response:

- Owner/legal approver: Heron Laoutaris.
- Role: developer and owner of the artwork/gallery content.
- Legal/privacy contact recipient: hlaoutaris@gmail.com.
- Decision: all recommendations in this packet are approved for
  implementation scoping.
- Effective/version date for initial implementation scoping: 2026-05-22,
  owner approval v1.

Do not infer the following values; they remain follow-up inputs where relevant:

- launch jurisdiction and intended audience assumptions;
- final legal policy copy beyond owner-approved factual implementation copy;
- Shopify-hosted policy target URLs;
- real owner-managed social account URLs.

## Decisions Needed

### 0. Baseline Legal Identity And Launch Scope

Owner question: Whose legal or publisher identity should appear on public
policies and notices, what launch jurisdiction and audience assumptions should
they cover, and who receives legal/privacy requests?

Implementation dependency: Approved legal/publisher name, contact recipient,
launch jurisdiction/audience scope, approver, policy version, and effective
date.

Cannot implement until approved: Any final policy page copy, footer legal
labels, form notices, privacy request routing, policy version display, or
acceptance metadata that references legal identity, contact ownership, launch
scope, or effective dates.

### 1. Privacy Policy

Owner question: Who will provide and approve the privacy policy content, and
what public route should host it? Confirm the legal/publisher identity,
privacy contact recipient, launch jurisdiction/audience scope, approver, and
effective/version date before implementation.

Implementation dependency: Approved content, route path, footer label, and form
link placement.

Cannot implement until approved: Runtime `/privacy` or equivalent page, footer
privacy link, form notice links, account signup/OAuth acknowledgement copy, and
privacy-request wording.

### 2. Cookie, Session, And Third-Party Disclosure

Owner question: What should the site disclose about NextAuth session cookies,
OAuth providers, Cloudinary media delivery/upload, Shopify product data and
hosted purchase links, and YouTube embeds?

Implementation dependency: Approved disclosure scope, route path or combined
policy location, and any decision to use YouTube no-cookie embeds or an embed
consent gate.

Cannot implement until approved: Cookie/third-party page copy, consent gate
copy, YouTube host changes made for policy reasons, and footer/form links to
third-party disclosure.

### 3. Terms Of Use

Owner question: Should the site have a public terms-of-use page before launch,
who owns its content, and which legal/publisher identity, launch audience,
approver, and effective/version date should govern it?

Implementation dependency: Approved route, title, footer label, and whether
terms acknowledgement should appear at signup/OAuth entry.

Cannot implement until approved: Runtime terms page, signup terms checkbox or
acknowledgement text, footer terms link, and account acceptance metadata.

### 4. Commerce Policy Boundaries

Owner question: Which sale, payment, shipping, delivery, returns, refunds,
cancellation, fulfilment, tax, and buyer-support responsibilities are handled
by Shopify, by the gallery owner, or by this app?

Implementation dependency: Approved commerce policy pages or Shopify-hosted
policy targets, product-detail wording, footer/legal links, and owner decision
on whether this app may ever own checkout/cart behavior.

Cannot implement until approved: Sale terms, shipping/returns/refund pages,
buyer-protection copy, payment assurance copy, app-owned checkout/cart UI,
variant/line-item construction, order-status UI, and stronger purchase claims.

### 5. Newsletter Consent And Unsubscribe

Owner question: What consent wording, source metadata, and unsubscribe process
should be required for newsletter subscriptions?

Implementation dependency: Approved consent copy or checkbox decision,
subscriber fields to store, unsubscribe route/process, and whether historical
subscriber records need a manual review path.

Cannot implement until approved: Consent checkbox/copy, consent-text version
storage, source path/locale fields, unsubscribe tokens, unsubscribe route, and
newsletter sender integration assumptions.

### 6. Contact And Product Enquiry Notice

Owner question: What should visitors be told about how contact and product
enquiry submissions are used, retained, and answered?

Implementation dependency: Approved contact/enquiry notice copy, retention
expectation, response ownership, and whether product-context fields should be
visible in admin/operator views.

Cannot implement until approved: Contact privacy/retention notice, enquiry
retention fields, product enquiry admin display changes based on policy, and
email/response-process promises.

### 7. Public Comments

Owner question: Are public comments allowed to display usernames, and what are
the moderation, reporting, deletion, and retention expectations?

Implementation dependency: Approved posting notice, username display decision,
moderation/reporting owner, deletion/removal request path, and any pseudonym or
moderation-state requirements.

Cannot implement until approved: Comment posting notice, moderation/reporting
UI, comment retention/deletion copy, username-display changes, pseudonym
fields, and comment privacy request behavior.

### 8. Account Signup, OAuth, And Privacy Requests

Owner question: What acknowledgement should users give at credentials signup
and OAuth sign-in, and should privacy requests be self-service or manually
handled first?

Implementation dependency: Approved acknowledgement copy, account request
categories, owner/admin fulfilment process, retention behavior for comments and
saved artwork lists, and OAuth-linked account handling.

Cannot implement until approved: Signup/OAuth acceptance fields, account
delete/export/correction UI, manual privacy request forms, account deletion
flow, data export behavior, and changes to the inert delete-account control.

### 9. Footer Legal Links And Placeholder Social Links

Owner question: Which legal links should appear in the footer, and who owns
cleanup of placeholder social-link targets and contact/legal labels?

Implementation dependency: Approved link list, route targets, social account
targets or removal decision, and launch ordering for links whose pages are not
ready.

Cannot implement until approved: Footer legal link changes, placeholder social
link cleanup, copyright/legal label changes, and route placeholders.

## Owner Response Sheet

Use this section to capture implementation-ready decisions before creating
follow-up tasks. For commerce rows, use the route or target URL column for
Shopify-hosted policy target URLs when Shopify owns the policy destination.
For account, newsletter, contact, and comment rows, use the required stored
fields column for any approved consent, source, request, retention, or
acknowledgement metadata.

| Area | Decision | Legal/content owner | Approved route path or target URL | Link placement | Visible notice or acknowledgement source | Required stored fields | Approver | Effective/version date | Implementation allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline legal identity and launch scope | Approved for owner identity/contact; launch jurisdiction/audience still not supplied | Heron Laoutaris, hlaoutaris@gmail.com | N/A | N/A | Use Heron Laoutaris and hlaoutaris@gmail.com where legal/privacy owner contact is needed | Policy version and acceptance metadata only where later acknowledgement flows are implemented | Heron Laoutaris | 2026-05-22 / owner approval v1 | Yes for jurisdiction-neutral implementation; do not add jurisdiction-specific claims |
| Privacy policy | Approved | Heron Laoutaris, hlaoutaris@gmail.com | `/privacy` | Footer plus signup, account, contact, newsletter, and comment surfaces where notices are later added | Owner-approved factual privacy content based on current implemented behavior | Privacy policy version, acceptedAt, acceptedBy, and source surface only when acknowledgement flows are implemented | Heron Laoutaris | 2026-05-22 / owner approval v1 | Yes |
| Cookie/session/third-party disclosure | Approved as part of privacy route unless split later | Heron Laoutaris, hlaoutaris@gmail.com | `/privacy#cookies-and-third-parties` | Footer privacy link and relevant form/embed notices | Owner-approved factual disclosure for NextAuth sessions, OAuth, Cloudinary, Shopify, and YouTube | Disclosure version only if a future consent gate or acknowledgement stores it | Heron Laoutaris | 2026-05-22 / owner approval v1 | Yes for disclosure; consent-gate behavior remains a separate task |
| Terms of use | Approved | Heron Laoutaris, hlaoutaris@gmail.com | `/terms` | Footer plus signup/OAuth acknowledgement surfaces when implemented | Owner-approved factual terms content; avoid jurisdiction-specific claims until launch scope is supplied | Terms version, acceptedAt, acceptedBy, and source surface when account acknowledgement is implemented | Heron Laoutaris | 2026-05-22 / owner approval v1 | Yes |
| Sale/payment/shipping/returns/refunds | Approved to keep checkout, payment, shipping, refunds, returns, taxes, fulfilment, and buyer support outside this app unless separately assigned | Heron Laoutaris, hlaoutaris@gmail.com; Shopify owns hosted checkout/policy surfaces when target URLs are provided | Shopify product `onlineStoreUrl` for purchase handoff; Shopify policy target URLs pending | Product detail, shop, footer, and terms/privacy surfaces only where factual boundary copy is needed | Owner-approved Shopify-hosted handoff boundary copy; no payment, refund, shipping, guarantee, or buyer-protection promises | None in this app until a future cart/checkout/order scope is approved | Heron Laoutaris | 2026-05-22 / owner approval v1 | Partial: boundary copy allowed; Shopify policy URL wiring waits for target URLs |
| Newsletter consent/source/unsubscribe | Implemented by T-214 for current app-owned subscription flow | Heron Laoutaris, hlaoutaris@gmail.com | `/newsletter/unsubscribe` | Newsletter form and public unsubscribe page | Owner-approved explicit consent wording source with `/privacy` and `/terms` links | Consent version, consent text/source path, acceptedAt, source path, unsubscribe identifier/status, and unsubscribedAt | Heron Laoutaris | 2026-05-22 / owner approval v1 | Complete for current app-owned newsletter flow; email sender integration remains separate |
| Contact/enquiry notice and retention | Implemented by T-217 for visible notice and manual privacy/legal handoff; stored notice metadata, operator workflow changes, and retention automation remain separate | Heron Laoutaris, hlaoutaris@gmail.com | `/privacy` and `/terms` links from contact/enquiry forms | Contact/product and artwork enquiry forms | Owner-approved factual use/retention/response notice | No new stored fields in T-217; existing product handle context remains preserved from T-100; notice version/source and retention fields only if a future workflow is implemented | Heron Laoutaris | 2026-05-22 / owner approval v1 | Complete for current contact/enquiry notice slice |
| Comments/moderation/deletion | Implemented by T-216 for posting notice and manual moderation/removal/correction handoff; future moderation/reporting workflow remains separate | Heron Laoutaris, hlaoutaris@gmail.com | `/privacy` and `/terms` links from comment surfaces | Comment posting surfaces | Owner-approved posting notice covering public username/comment display and manual moderation/removal/correction requests | No new stored fields in T-216; notice version/source or request fields only if a future workflow is implemented | Heron Laoutaris | 2026-05-22 / owner approval v1 | Complete for current manual comments notice slice |
| Account signup/OAuth/privacy requests | Implemented by T-215 for acknowledgement metadata and manual request handoff; future self-service delete/export/correction remains separate | Heron Laoutaris, hlaoutaris@gmail.com | `/privacy` and `/terms`; manual privacy requests to hlaoutaris@gmail.com | Signup, OAuth entry, account settings, and replaced delete-account control | Owner-approved privacy/terms acknowledgement and manual request copy | Privacy version, terms version, acceptedAt, acceptedBy, provider/source; request category/status only if a future workflow is implemented | Heron Laoutaris | 2026-05-22 / owner approval v1 | Complete for current manual account privacy request slice |
| Footer legal/social cleanup | Implemented by T-213 for legal links and T-218 for placeholder removal/current-year cleanup; social URLs still not supplied | Heron Laoutaris, hlaoutaris@gmail.com | `/privacy`, `/terms`; social target URLs pending | Footer | Owner-approved legal labels; placeholder social targets removed until real URLs are supplied | None | Heron Laoutaris | 2026-05-22 / owner approval v1 | Complete for current footer cleanup; social target wiring waits for URLs |

Before implementation starts, each approved row should also identify:

- any launch blocker if implementation is deferred;
- whether legal counsel must review final copy before merge;
- whether the approved copy or notice source lives in this repo, Shopify,
  another owner-managed document, or a future ticket;
- any route, footer, form, account, admin, or Shopify product-page surface that
  must not change under the approved scope.

## Follow-Up Task Candidates

- Add owner-approved commerce policy target links after Shopify policy URLs are
  supplied.
- Add future self-service account privacy workflows only after owner/legal
  approves deletion/export/correction scope, retention behavior, and fulfilment
  ownership.
- Add future contact/enquiry stored notice metadata, operator display changes,
  or retention automation only after owner/legal approves that scope.
- Add future comment moderation/reporting workflow, request persistence, or
  retention automation only after owner/legal approves that scope.
- Align product-detail, shop, search, footer, and banner commerce wording with
  approved Shopify-hosted handoff and sale-policy boundaries.
- Clean up footer legal targets and placeholder social links once route targets
  and owner-managed social accounts are confirmed.

## Remaining Owner Inputs

These items are not implementation-ready. Keep the current app behavior until
the owner supplies the missing values or explicitly opts into the future
workflow.

| Remaining input | Recommendation | Implementation implication |
| --- | --- | --- |
| Shopify policy target URLs | Keep Shopify policy links absent until real Shopify-hosted policy URLs exist. | The app can keep factual Shopify-hosted handoff copy, but must not link to placeholder sale, shipping, return, refund, tax, or cancellation policy pages. |
| Real social URLs | Keep footer social links hidden until owner-managed account URLs are supplied. | T-218's no-placeholder footer state remains correct. Adding social links later should be a small footer-only task once URLs are known. |
| Launch jurisdiction and audience assumptions | Keep policy copy jurisdiction-neutral until the owner or legal counsel supplies specific launch scope. | Do not add GDPR, CCPA, consumer-law labels, age-gated audience claims, tax/sale terms, or region-specific rights language yet. |
| Account self-service privacy workflows | Keep the current manual hlaoutaris@gmail.com request path until the owner explicitly approves self-service delete/export/correction scope, retention rules, identity verification, and fulfilment process. | Do not assign account deletion/export automation, request queue, or admin fulfilment workflow work yet. |
| Comment moderation/reporting workflows | Keep the current manual hlaoutaris@gmail.com moderation handoff until the owner explicitly approves report buttons, moderation states, admin queue ownership, retention behavior, and response process. | Do not assign report UI, moderation-state schema, admin workflow, or request-persistence work yet. |

## Implementation Guardrails

- Do not write public legal policy text without owner/legal approval.
- Do not create placeholder policy pages that look final.
- Do not add jurisdiction-specific legal claims until launch jurisdiction and
  intended audience assumptions are supplied.
- Do not add Shopify policy target URLs or social account URLs until the owner
  supplies the actual targets.
- Do not add consent fields, unsubscribe tokens, privacy request flows, account
  deletion/export behavior, moderation workflows, or commerce claims until the
  matching decision is approved.
- Do not record private customer data, subscriber records, enquiry records,
  user records, comment records, secrets, tokens, or credential values in docs.

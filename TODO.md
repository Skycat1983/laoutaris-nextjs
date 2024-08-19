CSS

- create custom colour palette (whitish doesn't exist)
- get and check fonts (transition group looks wrong)

---

<!-- ! done -->
<!-- Fetching artwork/biography links: we currently do this in the artwork/biography page.tsx, then re-route to the first link. A better solution would be to have a cached server action which runs for each main nav link. This would mean that clicking Artwork or Biography would take us straight to the first available link, instead of sending us to /artwork or biogrpahy and then rerouting from there. -->

## Perhaps, instead of forwarding to the default artwork collection, we might also want to get the default artworkId. this way we would forward to `artwork/[collection]/[artworkId]` instead of `artwork/[collection]`

<!-- ? decide if we want url for individual artworks -->
<!-- ! creates problems with the breadcrumbs -->

---

Layout vs template

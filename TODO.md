<!-- !  PRIORITY ! -->

QUERY PARAMS SECURITY ISSUES:

- Current structure unsafe. Potentially exposes sensitive data
- More robust, typical REST AIP endpoint structure would be beneficial.
- BUT our flexible query param based fetches can be used in admin routes.
- IDENTIFIER KEY AND VALUE WERE POINTLESS. could have just been key=value
<!-- * PLACEHOLDER SOLUTION -->
- Add whitelist for each route, ensuring we don't query fields that aren't permitted
<!-- ? Implementation: -->
- Throw new error and return code
- use_case, data-fetch, route, resolver.
  <!-- ? Where is best place for the whitelist from the steps above?  -->
  <!-- ? Hard to make sense of which combinations of permitted identifierKeys and fields should be permitted, because the context can affect this -->
  <!-- * getting a user's email is useful and necessary in the dashboard, but a security risk elsewhere potentially -->
  Alternative Solution?:
- Have every flexible, query param endpoint also receive a secret, as defined in our .env, for example?
  <!-- ? Is this a robust way to allow us to maintain the fleixbility of our query param fetches, but prevent malicious actors from exploiting this flexibility to gain access to things they shouldn't see? -->
  Solution:
- Middleware could check for custom header, which in turn is accessed at process.env.INTERNAL_API_SECRET. If not present, refuse the request
  <!-- ! Problem: This breaks client side requests -->
  Solution:
  A) Make all client requests with server actions
  B) PERHAPS our client fetches all come from admin/something, so maybe we can check the user.role from session. Problematic if fetches need to come from elsewhere

PEROJECT STRUCTURE:

- Flesh out the 'actions' folder of each server folder. The actions relate to direct database interactions and mutations.

SERVER:

- add 'size' property to all artworks. this is useful for pagination artworik display, so that the size of pagination items somewhat corresponds to the artworks actual size. pixel height and width isn't relevant

DATA-FETCHING / ROUTES:

- add some safety checks or mechanisms that prevent users from using query params to fetch data that they shouldn't have access to.

STATUS CODES:

- add them to the api responses.

---

DELETE ARTWORK / BLOG ENTRY / ARTICLE

<!-- * different outcomes required for each -->

ARTWORK:

- the cloudinary image should be deleted

ARTICLE:

- the cloudinary image should NOT be deleted

DELETE BLOG ENTRY

<!-- ! factors to consider ! -->

- the cloudinary image SOMETIMES should be deleted
(the artwork image might be used elsewhere OR we might have added the image just for the blog entry)
<!-- ? solution ? : use objectIds of artwork instead of url. this might require that artwork has a kv pair of isArtwork, to differentiate between assets that feature on app but not in collections/artwork searches -->

FRONTEND TYPES:

- should i Omit from the DBdocument type to create the frontend types?

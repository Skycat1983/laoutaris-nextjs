<!-- !  PRIORITY ! -->

QUERY PARAMS SECURITY ISSUES:

- Current structure unsafe. Potentially exposes sensitive data
- More robust, typical REST AIP endpoint structure would be beneficial.
- BUT our flexible query param based fetches can be used in admin routes.
- IDENTIFIER KEY AND VALUE WERE POINTLESS. could have just been key=value

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

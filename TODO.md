ARTICLE VIEW/MODEL:

add a quote to the article model which we can render differently.

see mobile view: the quote can float into view as we parallax scroll past it with image in background

PROJECT STRUCTURE:

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

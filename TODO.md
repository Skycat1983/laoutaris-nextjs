PEROJECT STRUCTURE:

- Flesh out the 'actions' folder of each server folder. The actions relate to direct database interactions and mutations.

SERVER:

- add 'size' property to all artworks. this is useful for pagination artworik display, so that the size of pagination items somewhat corresponds to the artworks actual size. pixel height and width isn't relevant

DATA-FETCHING / ROUTES:

- add some safety checks or mechanisms that prevent users from using query params to fetch data that they shouldn't have access to.

STATUS CODES:

- add them to the api responses.

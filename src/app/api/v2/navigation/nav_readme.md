The navigation API is used to fetch the navigation data for the website.

This is needed to ensure that the navigation defaults are always up to date and consistent across the website.

For example, when we click 'collection' from our navbar, we will navigate to /collecions/latest-collection-name/first-artwork-in-collection-id. When we click 'biogrpahy' from our navbar, we will navigate to /biography/latest-article-name.

It is not known in advance what the latest collection/article name is, nor what the first artwork in the collection is.

The data necessary to generate these URLs could also be fetched from one of our base routes (api/v2/collections, api/v2/articles, api/v2/biography). However, these endpoints return substantially larger payloads than is necessary for the navigation data.

Conversely, the /api/v2/navigation endpoints return only the data necessary for navigation and no more.

The fetchers that call these endpoints are located in the `src/lib/api/public/navigationApi.ts` file.

When fetching data for the

PATTERN:

A Loader function servers and controller function, and is typically called within Suspense boundary, allowing for a fallback UI to be displayed while the data is being fetched.

Within the controller function, we:

1. Invoke the fetcher function/api layer, which outlines the logic for fetching the data from the endpoint.
2. the GET route interacts with the database to retrieve the data.
   <!-- 3. The data is then transformed using the `transformMongooseDoc` function to remove any Mongoose-specific fields and convert ObjectId values to strings. -->
   <!-- 4. The transformed data is then returned to the component that called the loader function. -->
   <!-- 5. The data is then transformed to make it compatible with the component that will receive it. -->
3. The data is then transformed to make it compatible with the component that will receive it.

THOUGHTS & TODOS:

- shouldthe api/navigation endpoints be asset oriented? so instead of /api/v2/navigation/articles, it would be /api/v2/navigation/biography/:assetId or /api/v2/navigation/collection/pagination?
- at present, when i fetch 'articles', for example, the endpoint must be /api/v2/navigation/articles/[section], because we can potentially have articles belonging to /biograph or /project or /collection
<!-- ? is this what is known as declarative routing? or is that what i have already?-->

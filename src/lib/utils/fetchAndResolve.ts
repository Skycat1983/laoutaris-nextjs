/**
 * @fileoverview
 * Utility function for fetching and transforming data in a reusable and type-safe manner.
 *
 * - **Purpose:**
 *   `fetchAndResolve` simplifies the process of fetching raw data and transforming it into a desired format.
 *   It combines data fetching with a resolver function to map raw data to a specific structure.
 *
 * - **Key Features:**
 *   1. Accepts a generic fetcher function for retrieving raw data from an API or database.
 *   2. Transforms the fetched data using a resolver function into a specified type.
 *   3. Handles both single-item and array-based responses, normalizing the data into an array.
 *   4. Returns a function that resolves to the transformed data, enabling lazy or deferred execution.
 *
 * - **Type Parameters:**
 *   - `RawDataType`: The type of the raw data fetched by the fetcher.
 *   - `ResolvedType`: The type of the transformed data after applying the resolver.
 *
 * - **Parameters:**
 *   1. `fetcher`: A function to fetch raw data, typically tied to an API or database query.
 *      - Accepts an `identifierKey`, `identifierValue`, and optional `fields` to filter or scope the data.
 *      - Returns a `Promise<ApiResponse<T>>`.
 *   2. `identifierKey`: A string key used to identify the data scope (e.g., "section").
 *   3. `identifierValue`: A string value corresponding to the `identifierKey` (e.g., "biography").
 *   4. `fields`: An optional array of strings specifying the fields to fetch from the data source.
 *   5. `resolver`: A function to transform each raw data item into the desired `ResolvedType`.
 *      - Input: `RawDataType`.
 *      - Output: `ResolvedType`.
 *
 * - **Return Value:**
 *   - A function that, when invoked, returns a `Promise<ResolvedType[]>` containing the transformed data.
 *
 * - **Error Handling:**
 *   - If the fetcher fails or `response.success` is `false`, an error is thrown with a generic message.
 *   - The error message can be enhanced by including more details from the response if needed.
 *
 * - **Usage Example:**
 * ```ts
 * type Article = { title: string; slug: string };
 * type SubNavBarLink = { title: string; slug: string; url: string };
 *
 * const fetcher: Fetcher<Article> = async (key, value, fields) => {
 *   // Simulate fetching articles
 *   return { success: true, data: [{ title: "My Article", slug: "my-article" }] };
 * };
 *
 * const resolver: Resolver<Article, SubNavBarLink> = (item) => ({
 *   title: item.title,
 *   slug: item.slug,
 *   url: `/articles/${item.slug}`,
 * });
 *
 * const fetchLinks = fetchAndResolve(fetcher, "section", "articles", ["title", "slug"], resolver);
 *
 * const links = await fetchLinks();
 * console.log(links); // [{ title: "My Article", slug: "my-article", url: "/articles/my-article" }]
 * ```
 *
 * - **Dependencies:**
 *   - The function relies on the generic `Fetcher` and `Resolver` types, making it highly reusable and type-safe.
 */

type Fetcher<T> = (
  identifierKey: string,
  identifierValue: string,
  identifierFields?: string[],
  populatedFields?: string[]
) => Promise<ApiResponse<T>>;

type Resolver<RawDataType, ResolvedType> = (item: RawDataType) => ResolvedType;

export const fetchAndResolve = <RawDataType, ResolvedType>(
  fetcher: Fetcher<RawDataType>,
  identifierKey: string,
  identifierValue: string,
  identifierFields: string[],
  resolver: Resolver<RawDataType, ResolvedType>,
  populatedFields?: string[]
): (() => Promise<ResolvedType[]>) => {
  return async () => {
    const response = await fetcher(
      identifierKey,
      identifierValue,
      identifierFields,
      populatedFields
    );

    if (response.success) {
      const dataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      return dataArray.map(resolver);
    }
    throw new Error("Failed to fetch data");
  };
};

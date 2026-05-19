import SearchResultsSection from "@/components/modules/search/SearchResultsSection";
import {
  parsePublicSearchQuery,
  PublicSearchQueryFieldErrors,
  SearchQueryInput,
} from "@/lib/data/schemas/searchSchema";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";
import type { SearchableContentType, SearchResponse } from "@/lib/data/types/searchTypes";
import { isNextError } from "@/lib/helpers/isNextError";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: SearchQueryInput;
};

const SEARCH_TYPE_TITLES: Record<SearchableContentType, string> = {
  articles: "Articles",
  blogs: "Blogs",
  collections: "Collections",
};

const firstErrorMessage = (
  fieldErrors: PublicSearchQueryFieldErrors,
  formErrors: string[]
) => formErrors[0] ?? Object.values(fieldErrors).flat().filter(Boolean)[0];

const hasQueryValue = (searchParams: SearchQueryInput) => {
  const query = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q;

  return typeof query === "string" && query.trim().length > 0;
};

const SearchMessage = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <main className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>{message}</p>
  </main>
);

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const parsedQuery = parsePublicSearchQuery(searchParams);

  if (!parsedQuery.success) {
    const { fieldErrors, formErrors } = parsedQuery.error.flatten();
    const queryError = fieldErrors.q?.[0];

    if (queryError && !hasQueryValue(searchParams)) {
      return (
        <SearchMessage title="Search" message="Please enter a search term" />
      );
    }

    return (
      <SearchMessage
        title="Search Error"
        message={firstErrorMessage(fieldErrors, formErrors) || "Invalid search query"}
      />
    );
  }

  const { q: query, type } = parsedQuery.data;
  let searchData: SearchResponse;

  try {
    const results = await getPublicSearchResults(parsedQuery.data);
    searchData = results.data;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    return (
      <SearchMessage
        title="Search Error"
        message="Failed to perform search"
      />
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>

      <div className="grid gap-8">
        {type ? (
          <SearchResultsSection
            title={SEARCH_TYPE_TITLES[type]}
            items={searchData[type] || []}
            type={type}
          />
        ) : (
          <>
            {searchData.articles && searchData.articles.length > 0 && (
              <SearchResultsSection
                title="Articles"
                items={searchData.articles}
                type="articles"
              />
            )}
            {searchData.blogs && searchData.blogs.length > 0 && (
              <SearchResultsSection
                title="Blogs"
                items={searchData.blogs}
                type="blogs"
              />
            )}
            {searchData.collections && searchData.collections.length > 0 && (
              <SearchResultsSection
                title="Collections"
                items={searchData.collections}
                type="collections"
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

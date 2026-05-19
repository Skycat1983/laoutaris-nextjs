import SearchResultsSection from "@/components/modules/search/SearchResultsSection";
import Link from "next/link";
import {
  parsePublicSearchQuery,
  PublicSearchQueryFieldErrors,
  SearchQueryInput,
} from "@/lib/data/schemas/searchSchema";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";
import type {
  SearchableContentType,
  SearchResponse,
  SearchResultTypeMetadata,
} from "@/lib/data/types/searchTypes";
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

const SEARCH_TYPES = ["articles", "blogs", "collections"] as const;

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

const buildSelectedTypePageHref = ({
  query,
  type,
  page,
  limit,
}: {
  query: string;
  type: SearchableContentType;
  page: number;
  limit: number;
}) => {
  const params = new URLSearchParams({
    q: query,
    type,
    page: String(page),
    limit: String(limit),
  });

  return `/search?${params.toString()}`;
};

const SearchEmptyState = ({ message }: { message: string }) => (
  <p className="text-sm text-gray-600">{message}</p>
);

const SearchPagination = ({
  query,
  type,
  metadata,
}: {
  query: string;
  type: SearchableContentType;
  metadata: SearchResultTypeMetadata;
}) => {
  if (metadata.totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, metadata.page - 1);
  const nextPage = metadata.page + 1;
  const linkClassName =
    "inline-flex items-center border border-gray-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100";
  const disabledClassName =
    "inline-flex items-center border border-gray-200 px-3 py-2 text-sm font-medium text-gray-400";

  return (
    <nav
      className="mt-2 flex items-center gap-3"
      aria-label={`${SEARCH_TYPE_TITLES[type]} search pagination`}
    >
      {metadata.hasPreviousPage ? (
        <Link
          className={linkClassName}
          href={buildSelectedTypePageHref({
            query,
            type,
            page: previousPage,
            limit: metadata.limit,
          })}
        >
          Previous
        </Link>
      ) : (
        <span className={disabledClassName} aria-disabled="true">
          Previous
        </span>
      )}
      <span className="text-sm text-gray-600">
        Page {metadata.page} of {metadata.totalPages}
      </span>
      {metadata.hasMore ? (
        <Link
          className={linkClassName}
          href={buildSelectedTypePageHref({
            query,
            type,
            page: nextPage,
            limit: metadata.limit,
          })}
        >
          Next
        </Link>
      ) : (
        <span className={disabledClassName} aria-disabled="true">
          Next
        </span>
      )}
    </nav>
  );
};

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

  const selectedTypeMetadata = type ? searchData.metadata.types[type] : undefined;
  const hasRenderedItems = SEARCH_TYPES.some(
    (searchType) => (searchData[searchType]?.length ?? 0) > 0
  );
  const selectedEmptyMessage = type
    ? selectedTypeMetadata?.total === 0
      ? `No ${type} matched "${query}".`
      : "No results are available on this page for the selected search type."
    : undefined;
  const allTypesEmptyMessage =
    searchData.metadata.total === 0
      ? `No articles, blogs, or collections matched "${query}".`
      : "No results are available on this page for articles, blogs, or collections.";

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>

      <div className="grid gap-8">
        {type ? (
          <>
            <SearchResultsSection
              title={SEARCH_TYPE_TITLES[type]}
              items={searchData[type] || []}
              type={type}
              total={selectedTypeMetadata?.total}
              emptyMessage={
                (searchData[type]?.length ?? 0) === 0
                  ? selectedEmptyMessage
                  : undefined
              }
            />
            {selectedTypeMetadata && (
              <SearchPagination
                query={query}
                type={type}
                metadata={selectedTypeMetadata}
              />
            )}
          </>
        ) : (
          <>
            {!hasRenderedItems && (
              <SearchEmptyState message={allTypesEmptyMessage} />
            )}
            {searchData.articles && searchData.articles.length > 0 && (
              <SearchResultsSection
                title="Articles"
                items={searchData.articles}
                type="articles"
                total={searchData.metadata.types.articles?.total}
              />
            )}
            {searchData.blogs && searchData.blogs.length > 0 && (
              <SearchResultsSection
                title="Blogs"
                items={searchData.blogs}
                type="blogs"
                total={searchData.metadata.types.blogs?.total}
              />
            )}
            {searchData.collections && searchData.collections.length > 0 && (
              <SearchResultsSection
                title="Collections"
                items={searchData.collections}
                type="collections"
                total={searchData.metadata.types.collections?.total}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

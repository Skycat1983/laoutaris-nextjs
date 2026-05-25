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
  artworks: "Artworks",
  "shop-products": "Shop Products",
};

const SEARCH_TYPE_RESULT_LABELS: Record<SearchableContentType, string> = {
  articles: "articles",
  blogs: "blogs",
  collections: "collections",
  artworks: "artworks",
  "shop-products": "shop products",
};

const DEFAULT_SEARCH_TYPES = [
  "articles",
  "blogs",
  "collections",
  "artworks",
] as const satisfies readonly SearchableContentType[];

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

const buildShopProductSearchHref = ({
  query,
  limit,
}: {
  query: string;
  limit: number;
}) => {
  const params = new URLSearchParams({
    q: query,
    type: "shop-products",
    page: "1",
    limit: String(limit),
  });

  return `/search?${params.toString()}`;
};

const SearchEmptyState = ({ message }: { message: string }) => (
  <p className="text-sm text-gray-600">{message}</p>
);

const getUnavailableMessage = (type: SearchableContentType) =>
  type === "shop-products"
    ? "Shop product search is currently unavailable. Please try again later."
    : `${SEARCH_TYPE_TITLES[type]} search is currently unavailable. Please try again later.`;

const ShopProductSearchPrompt = ({
  query,
  limit,
}: {
  query: string;
  limit: number;
}) => (
  <p className="text-sm text-gray-600">
    Shop products are searched separately.{" "}
    <Link
      href={buildShopProductSearchHref({ query, limit })}
      className="font-medium underline underline-offset-4 hover:text-gray-900"
    >
      Search shop products for &quot;{query}&quot;
    </Link>
    .
  </p>
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
  const selectedTypeUnavailable = type
    ? searchData.metadata.unavailableTypes?.includes(type) ?? false
    : false;
  const hasRenderedItems = DEFAULT_SEARCH_TYPES.some(
    (searchType) => (searchData[searchType]?.length ?? 0) > 0
  );
  const selectedEmptyMessage = type
    ? selectedTypeUnavailable
      ? getUnavailableMessage(type)
      : selectedTypeMetadata?.total === 0
      ? `No ${SEARCH_TYPE_RESULT_LABELS[type]} matched "${query}".`
      : "No results are available on this page for the selected search type."
    : undefined;
  const allTypesEmptyMessage =
    searchData.metadata.total === 0
      ? `No articles, blogs, collections, or artworks matched "${query}".`
      : "No results are available on this page for articles, blogs, collections, or artworks.";

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
              resultLabel={SEARCH_TYPE_RESULT_LABELS[type]}
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
                resultLabel={SEARCH_TYPE_RESULT_LABELS.articles}
                total={searchData.metadata.types.articles?.total}
              />
            )}
            {searchData.blogs && searchData.blogs.length > 0 && (
              <SearchResultsSection
                title="Blogs"
                items={searchData.blogs}
                type="blogs"
                resultLabel={SEARCH_TYPE_RESULT_LABELS.blogs}
                total={searchData.metadata.types.blogs?.total}
              />
            )}
            {searchData.collections && searchData.collections.length > 0 && (
              <SearchResultsSection
                title="Collections"
                items={searchData.collections}
                type="collections"
                resultLabel={SEARCH_TYPE_RESULT_LABELS.collections}
                total={searchData.metadata.types.collections?.total}
              />
            )}
            {searchData.artworks && searchData.artworks.length > 0 && (
              <SearchResultsSection
                title="Artworks"
                items={searchData.artworks}
                type="artworks"
                resultLabel={SEARCH_TYPE_RESULT_LABELS.artworks}
                total={searchData.metadata.types.artworks?.total}
              />
            )}
            <ShopProductSearchPrompt
              query={query}
              limit={searchData.metadata.limit}
            />
          </>
        )}
      </div>
    </main>
  );
}

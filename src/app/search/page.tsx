import { serverApi } from "@/lib/api/serverApi";
import SearchResultsSection from "@/components/modules/search/SearchResultsSection";
import { SearchParams, SearchResponse } from "@/lib/data/types/searchTypes";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams.q;
  const page = parseInt(searchParams.page || "1");
  const type = searchParams.type;

  if (!query) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p>Please enter a search term</p>
      </div>
    );
  }

  const results = await serverApi.public.search.search({
    q: query,
    type,
    page: page.toString(),
  });

  if (!results.success) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Search Error</h1>
        <p>{results.error}</p>
      </div>
    );
  }

  const searchData = results.data as SearchResponse;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>

      <div className="grid gap-8">
        {type ? (
          <SearchResultsSection
            title={type.charAt(0).toUpperCase() + type.slice(1)}
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
    </div>
  );
}

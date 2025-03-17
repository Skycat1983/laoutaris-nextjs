import { SingleResult } from "@/lib/data/types";
import { Fetcher } from "../../core/createFetcher";
import { SearchParams, SearchResponse } from "@/lib/data/types/searchTypes";

type ApiSearchResult = SingleResult<SearchResponse>;

export const createSearchFetchers = (fetcher: Fetcher) => ({
  search: async ({ q, type, page = "1", limit = "10" }: SearchParams) => {
    const params = new URLSearchParams();
    params.append("q", q || "");
    if (type) params.append("type", type);
    params.append("page", page);
    params.append("limit", limit);

    return fetcher<ApiSearchResult>(`/api/v2/public/search?${params}`);
  },
});

export type SearchFetchers = ReturnType<typeof createSearchFetchers>;

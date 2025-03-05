import type {
  FrontendArticleWithArtworkAndAuthor,
  FrontendArticleWithArtwork,
  ArticleFilterParams,
} from "@/lib/data/types/articleTypes";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type {
  CollectionFilterParams,
  FrontendCollectionWithArtworks,
} from "@/lib/data/types/collectionTypes";
import type {
  BlogFilterParams,
  FrontendBlogEntry,
} from "@/lib/data/types/blogTypes";
import type { FrontendUser } from "@/lib/data/types/userTypes";
import type {
  FrontendComment,
  FrontendCommentWithAuthor,
} from "@/lib/data/types/commentTypes";
import type { Fetcher } from "../../core/createFetcher";
import { ListResponse, SingleResponse } from "@/lib/data/types/apiTypes";
import { SingleResult, ListResult } from "@/lib/data/types/apiTypes";
import { ApiResponse } from "@/lib/data/types/apiTypes";

// Filter types
type FilterParams =
  | ArticleFilterParams
  | CollectionFilterParams
  | BlogFilterParams
  | ArtworkFilterParams;

interface ReadListParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: FilterParams;
}

type ArtworkFilterKey = "decade" | "artstyle" | "medium" | "surface";

interface ArtworkFilterParams {
  key: ArtworkFilterKey | null;
  value: string | null;
}

// Result types (what we get back from the API)
export type ReadArtworkResult = SingleResult<FrontendArtwork>;
export type ReadArtworkListResult = ListResult<FrontendArtwork>;
export type ReadArticleResult =
  SingleResult<FrontendArticleWithArtworkAndAuthor>;
export type ReadArticleListResult = ListResult<FrontendArticleWithArtwork>;

export type ReadCollectionResult = SingleResult<FrontendCollectionWithArtworks>;
export type ReadCollectionListResult =
  ListResult<FrontendCollectionWithArtworks>;

export type ReadBlogResult = SingleResult<FrontendBlogEntry>;
export type ReadBlogListResult = ListResult<FrontendBlogEntry>;

export type ReadUserResult = SingleResult<FrontendUser>;
export type ReadUserListResult = ListResult<FrontendUser>;

export type ReadCommentResult = SingleResult<FrontendCommentWithAuthor>;
export type ReadCommentListResult = ListResult<FrontendCommentWithAuthor>;

export const createReadFetchers = (fetcher: Fetcher) => ({
  //! Single item fetchers
  // Artworks
  artwork: async (artworkId: string) => {
    const encodedId = encodeURIComponent(artworkId);
    return fetcher<ReadArtworkResult>(
      `/api/v2/admin/artwork/read/${encodedId}`
    );
  },

  // Articles
  article: async (articleId: string) => {
    const encodedId = encodeURIComponent(articleId);
    return fetcher<ReadArticleResult>(
      `/api/v2/admin/article/read/${encodedId}`
    );
  },

  // Collections
  collection: async (collectionId: string) => {
    const encodedId = encodeURIComponent(collectionId);
    return fetcher<ReadCollectionResult>(
      `/api/v2/admin/collection/read/${encodedId}`
    );
  },

  // Blogs
  blog: async (blogId: string) => {
    const encodedId = encodeURIComponent(blogId);
    return fetcher<ReadBlogResult>(`/api/v2/admin/blog/read/${encodedId}`);
  },

  // Users
  user: async (userId: string) => {
    const encodedId = encodeURIComponent(userId);
    return fetcher<ReadUserResult>(`/api/v2/admin/user/read/${encodedId}`);
  },

  // Comments
  comment: async (commentId: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<ReadCommentResult>(
      `/api/v2/admin/comment/read/${encodedId}`
    );
  },

  //! List fetchers
  // Artworks
  artworks: async ({ page = 1, limit = 50, filter }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filter?.key && filter?.value) {
      params.append("filterKey", filter.key);
      params.append("filterValue", filter.value);
    }

    return fetcher<ReadArtworkListResult>(
      `/api/v2/admin/artwork/read?${params}`
    );
  },

  // Articles
  articles: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<ReadArticleListResult>(
      `/api/v2/admin/article/read?${params}`
    );
  },

  // Collections
  collections: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<ReadCollectionListResult>(
      `/api/v2/admin/collection/read?${params}`
    );
  },

  // Blogs
  blogs: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<ReadBlogListResult>(`/api/v2/admin/blog/read?${params}`);
  },

  // Users
  users: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<ReadUserListResult>(`/api/v2/admin/user/read?${params}`);
  },

  // Comments
  comments: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<ReadCommentListResult>(
      `/api/v2/admin/comment/read?${params}`
    );
  },
});

export type ReadFetchers = ReturnType<typeof createReadFetchers>;

// export type ReadSingleResponse<T> = ApiSuccessResponse<T>;

// export type ReadListResponse<T> = ApiSuccessResponse<T[]> & {
//   metadata: Required<PaginationMetadata>;
// };

// export type ReadResponse<T> = ApiResponse<T>;

// Single item response types
// export type ReadArtworkResponse = ApiResponse<SingleResult<FrontendArtwork>>;
// export type ReadArtworkListResponse = ApiResponse<ListResult<FrontendArtwork>>;

// export type ReadArticleResponse =
//   SingleResponse<FrontendArticleWithArtworkAndAuthor>;
// export type ReadCollectionResponse =
//   SingleResponse<FrontendCollectionWithArtworks>;
// export type ReadBlogResponse = SingleResponse<FrontendBlogEntry>;
// export type ReadUserResponse = SingleResponse<FrontendUser>;
// export type ReadCommentResponse = SingleResponse<FrontendComment>;

// // List response types

// export type ReadArticleListResponse = ListResponse<FrontendArticleWithArtwork>;
// export type ReadCollectionListResponse =
//   ListResponse<FrontendCollectionWithArtworks>;
// export type ReadBlogListResponse = ListResponse<FrontendBlogEntry>;
// export type ReadUserListResponse = ListResponse<FrontendUser>;
// export type ReadCommentListResponse = ListResponse<FrontendCommentWithAuthor>;

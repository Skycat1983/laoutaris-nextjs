import type { ArticleFilterParams } from "@/lib/data/types/articleTypes";
import type { CollectionFilterParams } from "@/lib/data/types/collectionTypes";
import type { BlogFilterParams } from "@/lib/data/types/blogTypes";
import type { Fetcher } from "../../core/createFetcher";
import { SingleResult, ListResult } from "@/lib/data/types/apiTypes";
import {
  AdminArtwork,
  AdminArticle,
  AdminCollection,
  AdminBlog,
  AdminArticlePopulated,
  AdminCollectionPopulated,
  AdminUser,
  AdminBlogPopulated,
} from "@/lib/data/types/adminTypes";
import { CommentFrontendPopulated, UserFrontend } from "@/lib/data/types";
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

export type ReadArtworkResult = SingleResult<AdminArtwork>;
export type ReadArtworkListResult = ListResult<AdminArtwork>;

export type ReadArticleResult = SingleResult<AdminArticlePopulated>;
export type ReadArticleListResult = ListResult<AdminArticlePopulated>;

export type ReadCollectionResult = SingleResult<AdminCollectionPopulated>;
export type ReadCollectionListResult = ListResult<AdminCollectionPopulated>;

export type ReadBlogResult = SingleResult<AdminBlogPopulated>;
export type ReadBlogListResult = ListResult<AdminBlogPopulated>;

export type ReadUserResult = SingleResult<UserFrontend>;
export type ReadUserListResult = ListResult<UserFrontend>;

export type ReadCommentResult = SingleResult<CommentFrontendPopulated>;
export type ReadCommentListResult = ListResult<CommentFrontendPopulated>;

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

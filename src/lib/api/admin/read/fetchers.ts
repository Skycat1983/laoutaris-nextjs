import type {
  FrontendArticleWithArtworkAndAuthor,
  FrontendArticleWithArtwork,
  ArticleFilterParams,
} from "@/lib/data/types/articleTypes";
import type {
  ArtworkFilterParams,
  FrontendArtwork,
} from "@/lib/data/types/artworkTypes";
import type {
  CollectionFilterParams,
  FrontendCollection,
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

// Filter types
type FilterParams =
  | ArticleFilterParams
  | ArtworkFilterParams
  | CollectionFilterParams
  | BlogFilterParams;

interface ReadListParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: FilterParams;
}

/*
! Single Item Blueprint
model: async (modelId: string) => {
  const encodedId = encodeURIComponent(modelId);
  return fetcher<FrontendModel>(`/api/v2/admin/model/read/${encodedId}`);
};

! List Blueprint
models: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  return fetcher<FrontendModel[]>(`/api/v2/admin/model/read?${params}`);
};
*/

export const createReadFetchers = (fetcher: Fetcher) => ({
  //! Single item fetchers
  // Artworks
  artwork: async (artworkId: string) => {
    const encodedId = encodeURIComponent(artworkId);
    return fetcher<FrontendArtwork>(`/api/v2/admin/artwork/read/${encodedId}`);
  },

  // Articles
  article: async (articleId: string) => {
    const encodedId = encodeURIComponent(articleId);
    return fetcher<FrontendArticleWithArtworkAndAuthor>(
      `/api/v2/admin/article/read/${encodedId}`
    );
  },

  // Collections
  collection: async (collectionId: string) => {
    const encodedId = encodeURIComponent(collectionId);
    return fetcher<FrontendCollectionWithArtworks>(
      `/api/v2/admin/collection/read/${encodedId}`
    );
  },

  // Blogs
  blog: async (blogId: string) => {
    const encodedId = encodeURIComponent(blogId);
    return fetcher<FrontendBlogEntry>(`/api/v2/admin/blog/read/${encodedId}`);
  },

  // Users
  user: async (userId: string) => {
    const encodedId = encodeURIComponent(userId);
    return fetcher<FrontendUser>(`/api/v2/admin/user/read/${encodedId}`);
  },

  // Comments
  comment: async (commentId: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<FrontendComment>(`/api/v2/admin/comment/read/${encodedId}`);
  },

  //! List fetchers
  // Artworks
  artworks: async ({ page = 1, limit = 50 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendArtwork[]>(`/api/v2/admin/artwork/read?${params}`);
  },

  // Articles
  articles: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendArticleWithArtwork[]>(
      `/api/v2/admin/article/read?${params}`
    );
  },

  // Collections
  collections: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendCollectionWithArtworks[]>(
      `/api/v2/admin/collection/read?${params}`
    );
  },

  // Blogs
  blogs: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendBlogEntry[]>(`/api/v2/admin/blog/read?${params}`);
  },

  // Users
  users: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendUser[]>(`/api/v2/admin/user/read?${params}`);
  },

  // Comments
  comments: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendCommentWithAuthor[]>(
      `/api/v2/admin/comment/read?${params}`
    );
  },
});

export type ReadFetchers = ReturnType<typeof createReadFetchers>;

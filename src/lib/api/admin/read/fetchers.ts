import type {
  FrontendArticleWithArtworkAndAuthor,
  FrontendArticle,
  FrontendArticleWithArtwork,
} from "@/lib/data/types/articleTypes";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type {
  FrontendCollection,
  FrontendCollectionWithArtworks,
} from "@/lib/data/types/collectionTypes";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import type { FrontendUser } from "@/lib/data/types/userTypes";
import type { FrontendComment } from "@/lib/data/types/commentTypes";
import type { Fetcher } from "../../core/createFetcher";

// Filter types
interface FilterParams {
  key: "decade" | "artstyle" | "medium" | "surface" | null;
  value: string | null;
}

interface ReadListParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: FilterParams;
}

/*
! Single Item Blueprint
readModel: async (modelId: string) => {
  const encodedId = encodeURIComponent(modelId);
  return fetcher<FrontendModel>(`/api/v2/admin/model/read/${encodedId}`);
};

! List Blueprint
readModels: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
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
  readArtwork: async (artworkId: string) => {
    const encodedId = encodeURIComponent(artworkId);
    return fetcher<FrontendArtwork>(`/api/v2/admin/artwork/read/${encodedId}`);
  },

  // Articles
  readArticle: async (articleId: string) => {
    const encodedId = encodeURIComponent(articleId);
    return fetcher<FrontendArticleWithArtworkAndAuthor>(
      `/api/v2/admin/article/read/${encodedId}`
    );
  },

  // Collections
  readCollection: async (collectionId: string) => {
    const encodedId = encodeURIComponent(collectionId);
    return fetcher<FrontendCollectionWithArtworks>(
      `/api/v2/admin/collection/read/${encodedId}`
    );
  },

  // Blogs
  readBlog: async (blogId: string) => {
    const encodedId = encodeURIComponent(blogId);
    return fetcher<FrontendBlogEntry>(`/api/v2/admin/blog/read/${encodedId}`);
  },

  // Users
  readUser: async (userId: string) => {
    const encodedId = encodeURIComponent(userId);
    return fetcher<FrontendUser>(`/api/v2/admin/user/read/${encodedId}`);
  },

  // Comments
  readComment: async (commentId: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<FrontendComment>(`/api/v2/admin/comment/read/${encodedId}`);
  },

  //! List fetchers
  // Artworks
  readArtworks: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendArtwork[]>(`/api/v2/admin/artwork/read?${params}`);
  },

  // Articles
  readArticles: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendArticleWithArtwork[]>(
      `/api/v2/admin/article/read?${params}`
    );
  },

  // Collections
  readCollections: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendCollection[]>(
      `/api/v2/admin/collection/read?${params}`
    );
  },

  // Blogs
  readBlogs: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendBlogEntry[]>(`/api/v2/admin/blog/read?${params}`);
  },

  // Users
  readUsers: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendUser[]>(`/api/v2/admin/user/read?${params}`);
  },

  // Comments
  readComments: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return fetcher<FrontendComment[]>(`/api/v2/admin/comment/read?${params}`);
  },
});

export type ReadFetchers = ReturnType<typeof createReadFetchers>;

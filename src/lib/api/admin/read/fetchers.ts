import type { ArticleFilterParams } from "@/lib/data/types/articleTypes";
import type {
  CollectionFilterParams,
  CollectionFrontendPopulated,
} from "@/lib/data/types/collectionTypes";
import type {
  BlogEntryFrontend,
  BlogFilterParams,
} from "@/lib/data/types/blogTypes";
import type { Fetcher } from "../../core/createFetcher";
import type { SingleResult, ListResult } from "@/lib/data/types/apiTypes";
import type {
  ArtworkFrontend,
  CommentFrontendPopulated,
  UserFrontend,
  ArticleFrontendPopulated,
} from "@/lib/data/types";
import { adminReadDetailPath, adminReadListPath } from "./paths";
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

// export type ReadArtworkResult = SingleResult<AdminArtwork>;
// export type ReadArtworkListResult = ListResult<AdminArtwork>;

// export type ReadArticleResult = SingleResult<AdminArticlePopulated>;
// export type ReadArticleListResult = ListResult<AdminArticlePopulated>;

// export type ReadCollectionResult = SingleResult<AdminCollectionPopulated>;
// export type ReadCollectionListResult = ListResult<AdminCollectionPopulated>;

// export type ReadBlogResult = SingleResult<AdminBlogPopulated>;
// export type ReadBlogListResult = ListResult<AdminBlogPopulated>;

export type ReadArtworkResult = SingleResult<ArtworkFrontend>;
export type ReadArtworkListResult = ListResult<ArtworkFrontend>;

export type ReadArticleResult = SingleResult<ArticleFrontendPopulated>;
export type ReadArticleListResult = ListResult<ArticleFrontendPopulated>;

export type ReadCollectionResult = SingleResult<CollectionFrontendPopulated>;
export type ReadCollectionListResult = ListResult<CollectionFrontendPopulated>;

export type ReadBlogResult = SingleResult<BlogEntryFrontend>;
export type ReadBlogListResult = ListResult<BlogEntryFrontend>;

export type ReadUserResult = SingleResult<UserFrontend>;
export type ReadUserListResult = ListResult<UserFrontend>;

export type ReadCommentResult = SingleResult<CommentFrontendPopulated>;
export type ReadCommentListResult = ListResult<CommentFrontendPopulated>;

export const createReadFetchers = (fetcher: Fetcher) => ({
  //! Single item fetchers
  // Artworks
  artwork: async (artworkId: string) => {
    return fetcher<ReadArtworkResult>(
      adminReadDetailPath("artwork", artworkId)
    );
  },

  // Articles
  article: async (articleId: string) => {
    return fetcher<ReadArticleResult>(
      adminReadDetailPath("article", articleId)
    );
  },

  // Collections
  collection: async (collectionId: string) => {
    return fetcher<ReadCollectionResult>(
      adminReadDetailPath("collection", collectionId)
    );
  },

  // Blogs
  blog: async (blogId: string) => {
    return fetcher<ReadBlogResult>(adminReadDetailPath("blog", blogId));
  },

  // Users
  user: async (userId: string) => {
    return fetcher<ReadUserResult>(adminReadDetailPath("user", userId));
  },

  // Comments
  comment: async (commentId: string) => {
    return fetcher<ReadCommentResult>(
      adminReadDetailPath("comment", commentId)
    );
  },

  //! List fetchers
  // Artworks
  artworks: async ({
    page = 1,
    limit = 50,
    search,
    filter,
  }: ReadListParams = {}) => {
    return fetcher<ReadArtworkListResult>(
      adminReadListPath("artwork", { page, limit, search, filter })
    );
  },

  // Articles
  articles: async ({
    page = 1,
    limit = 10,
    search,
    filter,
  }: ReadListParams = {}) => {
    return fetcher<ReadArticleListResult>(
      adminReadListPath("article", { page, limit, search, filter })
    );
  },

  // Collections
  collections: async ({
    page = 1,
    limit = 10,
    search,
  }: ReadListParams = {}) => {
    return fetcher<ReadCollectionListResult>(
      adminReadListPath("collection", { page, limit, search })
    );
  },

  // Blogs
  blogs: async ({
    page = 1,
    limit = 10,
    search,
    filter,
  }: ReadListParams = {}) => {
    return fetcher<ReadBlogListResult>(
      adminReadListPath("blog", { page, limit, search, filter })
    );
  },

  // Users
  users: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    return fetcher<ReadUserListResult>(
      adminReadListPath("user", { page, limit })
    );
  },

  // Comments
  comments: async ({ page = 1, limit = 10 }: ReadListParams = {}) => {
    return fetcher<ReadCommentListResult>(
      adminReadListPath("comment", { page, limit })
    );
  },
});

export type ReadFetchers = ReturnType<typeof createReadFetchers>;

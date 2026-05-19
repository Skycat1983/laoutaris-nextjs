import "server-only";

import { ArticleModel } from "@/lib/data/models/articleModel";
import { BlogModel } from "@/lib/data/models/blogModel";
import { CollectionModel } from "@/lib/data/models/collectionModel";
import type {
  ArticleLean,
  BlogEntryLean,
  CollectionLean,
  SingleResult,
} from "@/lib/data/types";
import type {
  SearchableContentType,
  SearchResponse,
  SearchResultItem,
  SearchResultTypeMetadata,
} from "@/lib/data/types/searchTypes";
import type { PublicSearchQuery } from "@/lib/data/schemas/searchSchema";
import dbConnect from "@/lib/db/mongodb";

type SearchField = "title" | "subtitle" | "summary" | "text";
type SearchFilter = {
  $or: Partial<Record<SearchField, RegExp>>[];
};

export type PublicSearchServiceResult = SingleResult<SearchResponse>;

const SEARCH_FIELDS = ["title", "subtitle", "summary", "text"] as const;
const SEARCH_RESULT_FIELDS = [
  "title",
  "subtitle",
  "summary",
  "imageUrl",
  "slug",
] as const;

const escapeRegexLiteral = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchFilter = (query: string): SearchFilter => {
  const searchRegex = new RegExp(escapeRegexLiteral(query), "i");

  return {
    $or: SEARCH_FIELDS.map((field) => ({
      [field]: searchRegex,
    })),
  };
};

const toSearchResultItem = (
  item: ArticleLean | BlogEntryLean | CollectionLean,
  linkTo: SearchResultItem["linkTo"]
): SearchResultItem => ({
  ...SEARCH_RESULT_FIELDS.reduce(
    (acc, field) => ({
      ...acc,
      [field]: item[field],
    }),
    {} as Pick<
      ArticleLean | BlogEntryLean | CollectionLean,
      (typeof SEARCH_RESULT_FIELDS)[number]
    >
  ),
  linkTo,
});

const searchArticles = (
  filter: SearchFilter,
  skip: number,
  limit: number
): Promise<ArticleLean[]> =>
  ArticleModel.find(filter).skip(skip).limit(limit).lean<ArticleLean[]>();

const countArticles = async (filter: SearchFilter) =>
  ArticleModel.countDocuments(filter);

const searchBlogs = (
  filter: SearchFilter,
  skip: number,
  limit: number
): Promise<BlogEntryLean[]> =>
  BlogModel.find(filter).skip(skip).limit(limit).lean<BlogEntryLean[]>();

const countBlogs = async (filter: SearchFilter) =>
  BlogModel.countDocuments(filter);

const searchCollections = (
  filter: SearchFilter,
  skip: number,
  limit: number
): Promise<CollectionLean[]> =>
  CollectionModel.find(filter)
    .skip(skip)
    .limit(limit)
    .lean<CollectionLean[]>();

const countCollections = async (filter: SearchFilter) =>
  CollectionModel.countDocuments(filter);

const buildTypeMetadata = (
  total: number,
  page: number,
  limit: number
): SearchResultTypeMetadata => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const getPublicSearchResults = async ({
  q,
  type,
  page,
  limit,
}: PublicSearchQuery): Promise<PublicSearchServiceResult> => {
  await dbConnect();

  const filter = buildSearchFilter(q);
  const skip = (page - 1) * limit;
  const shouldSearch = (candidate: SearchableContentType) =>
    !type || type === candidate;
  const searchedTypes = (
    ["articles", "blogs", "collections"] as const
  ).filter(shouldSearch);

  const [articles, articleTotal, blogs, blogTotal, collections, collectionTotal] =
    await Promise.all([
      shouldSearch("articles")
        ? searchArticles(filter, skip, limit)
        : Promise.resolve([]),
      shouldSearch("articles") ? countArticles(filter) : Promise.resolve(0),
      shouldSearch("blogs")
        ? searchBlogs(filter, skip, limit)
        : Promise.resolve([]),
      shouldSearch("blogs") ? countBlogs(filter) : Promise.resolve(0),
      shouldSearch("collections")
        ? searchCollections(filter, skip, limit)
        : Promise.resolve([]),
      shouldSearch("collections")
        ? countCollections(filter)
        : Promise.resolve(0),
    ]);

  const metadata: SearchResponse["metadata"] = {
    page,
    limit,
    searchedTypes,
    total: 0,
    hasMore: false,
    types: {},
  };
  const data: SearchResponse = { metadata };

  if (shouldSearch("articles")) {
    data.articles = articles.map((item) =>
      toSearchResultItem(item, `/${item.section}/${item.slug}`)
    );
    metadata.types.articles = buildTypeMetadata(articleTotal, page, limit);
  }

  if (shouldSearch("blogs")) {
    data.blogs = blogs.map((item) =>
      toSearchResultItem(item, `/blog/${item.slug}`)
    );
    metadata.types.blogs = buildTypeMetadata(blogTotal, page, limit);
  }

  if (shouldSearch("collections")) {
    data.collections = collections.map((item) =>
      toSearchResultItem(item, `/collections/${item.slug}`)
    );
    metadata.types.collections = buildTypeMetadata(collectionTotal, page, limit);
  }

  metadata.total = searchedTypes.reduce(
    (total, searchType) => total + (metadata.types[searchType]?.total ?? 0),
    0
  );
  metadata.hasMore = searchedTypes.some(
    (searchType) => metadata.types[searchType]?.hasMore
  );

  return {
    success: true,
    data,
  };
};

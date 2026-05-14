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

const searchBlogs = (
  filter: SearchFilter,
  skip: number,
  limit: number
): Promise<BlogEntryLean[]> =>
  BlogModel.find(filter).skip(skip).limit(limit).lean<BlogEntryLean[]>();

const searchCollections = (
  filter: SearchFilter,
  skip: number,
  limit: number
): Promise<CollectionLean[]> =>
  CollectionModel.find(filter)
    .skip(skip)
    .limit(limit)
    .lean<CollectionLean[]>();

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

  const [articles, blogs, collections] = await Promise.all([
    shouldSearch("articles")
      ? searchArticles(filter, skip, limit)
      : Promise.resolve([]),
    shouldSearch("blogs") ? searchBlogs(filter, skip, limit) : Promise.resolve([]),
    shouldSearch("collections")
      ? searchCollections(filter, skip, limit)
      : Promise.resolve([]),
  ]);

  const data: SearchResponse = {};

  if (shouldSearch("articles")) {
    data.articles = articles.map((item) =>
      toSearchResultItem(item, `/${item.section}/${item.slug}`)
    );
  }

  if (shouldSearch("blogs")) {
    data.blogs = blogs.map((item) =>
      toSearchResultItem(item, `/blog/${item.slug}`)
    );
  }

  if (shouldSearch("collections")) {
    data.collections = collections.map((item) =>
      toSearchResultItem(item, `/collections/${item.slug}`)
    );
  }

  return {
    success: true,
    data,
  };
};

import "server-only";

import { ArticleModel } from "@/lib/data/models/articleModel";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { BlogModel } from "@/lib/data/models/blogModel";
import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  MEDIUM_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";
import type {
  ArticleLean,
  ArtworkLean,
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
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { PublicSearchQuery } from "@/lib/data/schemas/searchSchema";
import dbConnect from "@/lib/db/mongodb";
import { sanitizeCloudinaryImage } from "@/lib/transforms/artwork/transformImage";

type SearchField = "title" | "subtitle" | "summary" | "text";
type SearchFilter = {
  $or: Partial<Record<SearchField, RegExp>>[];
};
type ArtworkSearchFilter = {
  $or: Array<
    | { title: RegExp }
    | { decade: ArtworkLean["decade"] }
    | { artstyle: ArtworkLean["artstyle"] }
    | { medium: ArtworkLean["medium"] }
    | { surface: ArtworkLean["surface"] }
  >;
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
const SEARCH_TYPES = [
  "articles",
  "blogs",
  "collections",
  "artworks",
  "shop-products",
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

const findExactOption = <Option extends string>(
  options: readonly Option[],
  query: string
): Option | undefined => {
  const normalizedQuery = query.trim().toLowerCase();

  return options.find((option) => option.toLowerCase() === normalizedQuery);
};

const buildArtworkSearchFilter = (query: string): ArtworkSearchFilter => {
  const searchRegex = new RegExp(escapeRegexLiteral(query), "i");
  const exactDecade = findExactOption(DECADE_OPTIONS, query);
  const exactArtstyle = findExactOption(ARTSTYLE_OPTIONS, query);
  const exactMedium = findExactOption(MEDIUM_OPTIONS, query);
  const exactSurface = findExactOption(SURFACE_OPTIONS, query);

  return {
    $or: [
      { title: searchRegex },
      ...(exactDecade ? [{ decade: exactDecade }] : []),
      ...(exactArtstyle ? [{ artstyle: exactArtstyle }] : []),
      ...(exactMedium ? [{ medium: exactMedium }] : []),
      ...(exactSurface ? [{ surface: exactSurface }] : []),
    ],
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

const formatArtworkLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");

const toArtworkSearchResultItem = (item: ArtworkLean): SearchResultItem => {
  const metadata = [item.decade, item.artstyle].filter(Boolean);
  const material = [item.medium, item.surface].filter(Boolean);
  const imageUrl = item.image
    ? sanitizeCloudinaryImage(item.image).secure_url
    : undefined;

  return {
    title: item.title,
    subtitle: metadata.map(formatArtworkLabel).join(", "),
    summary:
      material.length > 0
        ? material.map(formatArtworkLabel).join(" on ")
        : undefined,
    imageUrl,
    linkTo: `/artwork/${String(item._id)}`,
  };
};

const normalizeSearchText = (value: string) => value.trim().toLowerCase();

const productMatchesQuery = (product: SimpleProduct, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  const searchableValues = [
    product.title,
    product.handle,
    product.description,
    product.productType,
    product.vendor,
    ...product.tags,
  ];

  return searchableValues.some((value) =>
    normalizeSearchText(value).includes(normalizedQuery)
  );
};

const formatProductMetadata = (value: string) =>
  value
    .trim()
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const toShopProductSearchResultItem = (
  product: SimpleProduct
): SearchResultItem => {
  const subtitle = [product.productType, product.vendor]
    .map((value) => value.trim())
    .filter(Boolean)
    .map(formatProductMetadata)
    .join(", ");
  const summary = product.tags.map(formatProductMetadata).join(", ");

  return {
    title: product.title,
    subtitle: subtitle || undefined,
    summary: summary || undefined,
    imageUrl: product.image?.url,
    linkTo: `/shop/products/${product.handle}`,
  };
};

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

const searchArtworks = (
  filter: ArtworkSearchFilter,
  skip: number,
  limit: number
): Promise<ArtworkLean[]> =>
  ArtworkModel.find(filter).skip(skip).limit(limit).lean<ArtworkLean[]>();

const countArtworks = async (filter: ArtworkSearchFilter) =>
  ArtworkModel.countDocuments(filter);

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
  const artworkFilter = buildArtworkSearchFilter(q);
  const skip = (page - 1) * limit;
  const shouldSearch = (candidate: SearchableContentType) =>
    !type || type === candidate;
  const searchedTypes = SEARCH_TYPES.filter(shouldSearch);

  const [
    articles,
    articleTotal,
    blogs,
    blogTotal,
    collections,
    collectionTotal,
    artworks,
    artworkTotal,
    shopProductsResult,
  ] = await Promise.all([
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
    shouldSearch("collections") ? countCollections(filter) : Promise.resolve(0),
    shouldSearch("artworks")
      ? searchArtworks(artworkFilter, skip, limit)
      : Promise.resolve([]),
    shouldSearch("artworks") ? countArtworks(artworkFilter) : Promise.resolve(0),
    shouldSearch("shop-products")
      ? getShopProductList()
      : Promise.resolve(null),
  ]);

  const matchingShopProducts =
    shopProductsResult?.data.filter((product) => productMatchesQuery(product, q)) ??
    [];
  const shopProducts = matchingShopProducts.slice(skip, skip + limit);
  const shopProductTotal = matchingShopProducts.length;

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

  if (shouldSearch("artworks")) {
    data.artworks = artworks.map(toArtworkSearchResultItem);
    metadata.types.artworks = buildTypeMetadata(artworkTotal, page, limit);
  }

  if (shouldSearch("shop-products")) {
    data["shop-products"] = shopProducts.map(toShopProductSearchResultItem);
    metadata.types["shop-products"] = buildTypeMetadata(
      shopProductTotal,
      page,
      limit
    );
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

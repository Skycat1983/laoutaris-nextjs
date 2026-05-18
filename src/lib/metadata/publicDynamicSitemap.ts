import "server-only";

import type { MetadataRoute } from "next";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import { ArticleModel } from "@/lib/data/models/articleModel";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { BlogModel } from "@/lib/data/models/blogModel";
import { CollectionModel } from "@/lib/data/models/collectionModel";
import dbConnect from "@/lib/db/mongodb";
import {
  articleDetailPath,
  artworkDetailPath,
  blogDetailPath,
  collectionArtworkPath,
  collectionDetailPath,
  productDetailPath,
} from "@/lib/metadata/publicDetailMetadata";

export type PublicSitemapEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: MetadataRoute.Sitemap[number]["lastModified"];
};

type SlugSitemapDocument = {
  slug?: unknown;
  updatedAt?: unknown;
};

type ArtworkSitemapDocument = {
  _id?: unknown;
  updatedAt?: unknown;
};

type CollectionSitemapDocument = SlugSitemapDocument & {
  artworks?: unknown[];
};

const PRIVATE_PATH_PREFIXES = ["/admin", "/account", "/api"] as const;

const toSafePathSegment = (value: unknown) => {
  const segment =
    typeof value === "string"
      ? value.trim()
      : value && typeof value === "object" && "toString" in value
      ? value.toString().trim()
      : "";

  if (!segment || /[/?#\\]/.test(segment)) {
    return null;
  }

  return segment;
};

const toLastModified = (
  value: unknown
): MetadataRoute.Sitemap[number]["lastModified"] | undefined => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const isPublicSitemapPath = (path: string) =>
  path.startsWith("/") &&
  !path.startsWith("//") &&
  !PRIVATE_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

const createEntry = (
  path: string,
  changeFrequency: PublicSitemapEntry["changeFrequency"],
  priority: number,
  updatedAt?: unknown
): PublicSitemapEntry[] => {
  if (!isPublicSitemapPath(path)) {
    return [];
  }

  return [
    {
      path,
      changeFrequency,
      priority,
      lastModified: toLastModified(updatedAt),
    },
  ];
};

const getBiographyArticleEntries = async (): Promise<PublicSitemapEntry[]> => {
  await dbConnect();

  const articles = await ArticleModel.find({ section: "biography" })
    .select("slug updatedAt")
    .lean<SlugSitemapDocument[]>();

  return articles.flatMap((article) => {
    const slug = toSafePathSegment(article.slug);
    return slug
      ? createEntry(articleDetailPath(slug), "monthly", 0.65, article.updatedAt)
      : [];
  });
};

const getBlogEntries = async (): Promise<PublicSitemapEntry[]> => {
  await dbConnect();

  const blogs = await BlogModel.find({})
    .select("slug updatedAt")
    .lean<SlugSitemapDocument[]>();

  return blogs.flatMap((blog) => {
    const slug = toSafePathSegment(blog.slug);
    return slug
      ? createEntry(blogDetailPath(slug), "weekly", 0.65, blog.updatedAt)
      : [];
  });
};

const getArtworkEntries = async (): Promise<PublicSitemapEntry[]> => {
  await dbConnect();

  const artworks = await ArtworkModel.find({})
    .select("_id updatedAt")
    .lean<ArtworkSitemapDocument[]>();

  return artworks.flatMap((artwork) => {
    const artworkId = toSafePathSegment(artwork._id);
    return artworkId
      ? createEntry(artworkDetailPath(artworkId), "monthly", 0.7, artwork.updatedAt)
      : [];
  });
};

const getCollectionEntries = async (): Promise<PublicSitemapEntry[]> => {
  await dbConnect();

  const collections = await CollectionModel.find({})
    .select("slug artworks updatedAt")
    .lean<CollectionSitemapDocument[]>();

  return collections.flatMap((collection) => {
    const slug = toSafePathSegment(collection.slug);

    if (!slug) {
      return [];
    }

    const collectionEntries = createEntry(
      collectionDetailPath(slug),
      "weekly",
      0.75,
      collection.updatedAt
    );
    const artworkEntries = (collection.artworks ?? []).flatMap((artworkId) => {
      const id = toSafePathSegment(artworkId);
      return id
        ? createEntry(
            collectionArtworkPath(slug, id),
            "monthly",
            0.65,
            collection.updatedAt
          )
        : [];
    });

    return [...collectionEntries, ...artworkEntries];
  });
};

const getShopProductEntries = async (): Promise<PublicSitemapEntry[]> => {
  const result = await getShopProductList();

  return result.data.flatMap((product) => {
    const handle = toSafePathSegment(product.handle);
    return handle
      ? createEntry(productDetailPath(handle), "weekly", 0.65)
      : [];
  });
};

export const getDynamicPublicSitemapEntries = async (): Promise<
  PublicSitemapEntry[]
> => {
  const sources = [
    getBiographyArticleEntries,
    getBlogEntries,
    getArtworkEntries,
    getCollectionEntries,
    getShopProductEntries,
  ];

  const settledSources = await Promise.allSettled(
    sources.map((source) => source())
  );

  return settledSources.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
};

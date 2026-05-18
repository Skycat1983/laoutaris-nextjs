import type { Metadata } from "next";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";

const siteName = "Joseph Laoutaris Art Archive";

type PublicDetailContent = {
  title: string;
  subtitle?: string;
  summary?: string;
  imageUrl?: string;
  slug: string;
};

type PublicBlogDetailContent = PublicDetailContent & {
  displayDate?: Date | string;
  tags?: string[];
};

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export type JsonLdObject = { [key: string]: JsonLdValue };

const normalizeText = (value: string | undefined) =>
  value?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";

const truncateDescription = (description: string) => {
  if (description.length <= 160) {
    return description;
  }

  return `${description.slice(0, 157).trimEnd()}...`;
};

const getDescription = (content: PublicDetailContent) =>
  truncateDescription(
    normalizeText(content.summary) ||
      normalizeText(content.subtitle) ||
      normalizeText(content.title)
  );

const detailPath = (basePath: "/biography" | "/blog", slug: string) =>
  `${basePath}/${encodeURIComponent(slug)}`;

export const buildMissingPublicDetailMetadata = (
  contentType: "Article" | "Blog post"
): Metadata => ({
  title: `${contentType} not found`,
  robots: {
    index: false,
    follow: false,
  },
});

export const buildUnavailablePublicDetailMetadata = (
  contentType: "Article" | "Blog post"
): Metadata => ({
  title: `${contentType} unavailable`,
  robots: {
    index: false,
    follow: false,
  },
});

export const buildArticleDetailMetadata = (
  article: PublicDetailContent
): Metadata => {
  const title = normalizeText(article.title);
  const description = getDescription(article);
  const canonicalUrl = getPublicSitePathUrl(detailPath("/biography", article.slug));
  const images = article.imageUrl
    ? [
        {
          url: article.imageUrl,
          alt: title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName,
      title,
      description,
      images,
    },
    twitter: {
      card: article.imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
};

export const buildBlogDetailMetadata = (
  blog: PublicBlogDetailContent
): Metadata => {
  const title = normalizeText(blog.title);
  const description = getDescription(blog);
  const canonicalUrl = getPublicSitePathUrl(detailPath("/blog", blog.slug));
  const publishedTime = toIsoDate(blog.displayDate);
  const images = blog.imageUrl
    ? [
        {
          url: blog.imageUrl,
          alt: title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName,
      title,
      description,
      publishedTime,
      tags: blog.tags,
      images,
    },
    twitter: {
      card: blog.imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: blog.imageUrl ? [blog.imageUrl] : undefined,
    },
  };
};

const articleJsonLdBase = (
  content: PublicDetailContent,
  type: "Article" | "BlogPosting",
  canonicalUrl: string
): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": type,
  headline: normalizeText(content.title),
  description: getDescription(content),
  image: content.imageUrl || null,
  url: canonicalUrl,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonicalUrl,
  },
});

export const buildArticleJsonLd = (
  article: PublicDetailContent
): JsonLdObject =>
  articleJsonLdBase(
    article,
    "Article",
    getPublicSitePathUrl(detailPath("/biography", article.slug))
  );

export const buildBlogJsonLd = (blog: PublicBlogDetailContent): JsonLdObject => {
  const canonicalUrl = getPublicSitePathUrl(detailPath("/blog", blog.slug));
  const jsonLd = articleJsonLdBase(blog, "BlogPosting", canonicalUrl);
  const publishedDate = toIsoDate(blog.displayDate);

  if (publishedDate) {
    jsonLd.datePublished = publishedDate;
  }

  if (blog.tags?.length) {
    jsonLd.keywords = blog.tags.join(", ");
  }

  return jsonLd;
};

export const serializeJsonLd = (jsonLd: JsonLdObject) =>
  JSON.stringify(jsonLd).replace(/</g, "\\u003c");

const toIsoDate = (date: Date | string | undefined) => {
  if (!date) {
    return undefined;
  }

  const parsedDate = date instanceof Date ? date : new Date(date);
  const timestamp = parsedDate.getTime();

  if (Number.isNaN(timestamp)) {
    return undefined;
  }

  return parsedDate.toISOString();
};

import type { Metadata } from "next";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import type { CollectionFrontendPopulated } from "@/lib/data/types/collectionTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";

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

type PublicDetailContentType =
  | "Article"
  | "Artwork"
  | "Blog post"
  | "Product";

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

const detailPath = (
  basePath: "/artwork" | "/biography" | "/blog" | "/shop/products",
  slug: string
) => `${basePath}/${encodeURIComponent(slug)}`;

const collectionArtworkPath = (collectionSlug: string, artworkId: string) =>
  `/collections/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(
    artworkId
  )}`;

const artworkImageUrl = (artwork: ArtworkFrontend) => artwork.image.secure_url;

const artworkDescription = (
  artwork: ArtworkFrontend,
  collectionTitle?: string
) => {
  const title = normalizeText(artwork.title);
  const medium = normalizeText(artwork.medium);
  const surface = normalizeText(artwork.surface);
  const artstyle = normalizeText(artwork.artstyle);
  const decade = normalizeText(artwork.decade);
  const collectionContext = collectionTitle
    ? ` in ${normalizeText(collectionTitle)}`
    : "";

  return truncateDescription(
    `${title}${collectionContext}, a Joseph Laoutaris ${artstyle} artwork from the ${decade}, made with ${medium} on ${surface}.`
  );
};

const buildArtworkTitle = (
  artwork: ArtworkFrontend,
  collectionTitle?: string
) => {
  const title = normalizeText(artwork.title);
  const collection = normalizeText(collectionTitle);

  return collection ? `${title} in ${collection}` : title;
};

const artworkMetadata = (
  artwork: ArtworkFrontend,
  canonicalUrl: string,
  collectionTitle?: string
): Metadata => {
  const title = buildArtworkTitle(artwork, collectionTitle);
  const description = artworkDescription(artwork, collectionTitle);
  const imageUrl = artworkImageUrl(artwork);
  const images = [
    {
      url: imageUrl,
      alt: normalizeText(artwork.title),
    },
  ];

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
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};

const productDescription = (product: SimpleProduct) =>
  truncateDescription(
    normalizeText(product.description) ||
      normalizeText(product.productType) ||
      normalizeText(product.vendor) ||
      normalizeText(product.title)
  );

export const buildMissingPublicDetailMetadata = (
  contentType: PublicDetailContentType
): Metadata => ({
  title: `${contentType} not found`,
  robots: {
    index: false,
    follow: false,
  },
});

export const buildUnavailablePublicDetailMetadata = (
  contentType: PublicDetailContentType
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

export const buildArtworkDetailMetadata = (
  artwork: ArtworkFrontend
): Metadata =>
  artworkMetadata(
    artwork,
    getPublicSitePathUrl(detailPath("/artwork", artwork._id))
  );

export const buildCollectionArtworkDetailMetadata = (
  collection: CollectionFrontendPopulated
): Metadata => {
  const artwork = collection.artworks[0];

  return artworkMetadata(
    artwork,
    getPublicSitePathUrl(collectionArtworkPath(collection.slug, artwork._id)),
    collection.title
  );
};

export const buildProductDetailMetadata = (
  product: SimpleProduct
): Metadata => {
  const title = normalizeText(product.title);
  const description = productDescription(product);
  const canonicalUrl = getPublicSitePathUrl(
    detailPath("/shop/products", product.handle)
  );
  const images = product.image
    ? [
        {
          url: product.image.url,
          alt: product.image.altText || title,
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
      type: "website",
      url: canonicalUrl,
      siteName,
      title,
      description,
      images,
    },
    twitter: {
      card: product.image ? "summary_large_image" : "summary",
      title,
      description,
      images: product.image ? [product.image.url] : undefined,
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

export const buildArtworkJsonLd = (
  artwork: ArtworkFrontend,
  canonicalUrl = getPublicSitePathUrl(detailPath("/artwork", artwork._id)),
  collectionTitle?: string
): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  name: normalizeText(artwork.title),
  description: artworkDescription(artwork, collectionTitle),
  image: artworkImageUrl(artwork),
  url: canonicalUrl,
  creator: {
    "@type": "Person",
    name: "Joseph Laoutaris",
  },
  artMedium: normalizeText(artwork.medium),
  artworkSurface: normalizeText(artwork.surface),
  genre: normalizeText(artwork.artstyle),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonicalUrl,
  },
});

export const buildCollectionArtworkJsonLd = (
  collection: CollectionFrontendPopulated
): JsonLdObject => {
  const artwork = collection.artworks[0];

  return buildArtworkJsonLd(
    artwork,
    getPublicSitePathUrl(collectionArtworkPath(collection.slug, artwork._id)),
    collection.title
  );
};

export const buildProductJsonLd = (product: SimpleProduct): JsonLdObject => {
  const canonicalUrl = getPublicSitePathUrl(
    detailPath("/shop/products", product.handle)
  );
  const jsonLd: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: normalizeText(product.title),
    description: productDescription(product),
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  if (product.image) {
    jsonLd.image = product.image.url;
  }

  if (normalizeText(product.vendor)) {
    jsonLd.brand = {
      "@type": "Brand",
      name: normalizeText(product.vendor),
    };
  }

  if (normalizeText(product.productType)) {
    jsonLd.category = normalizeText(product.productType);
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

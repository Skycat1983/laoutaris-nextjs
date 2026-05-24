import { getCachedBiographyArticleBySlug } from "@/lib/data/services/getCachedBiographyArticleData";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getCachedBlogBySlugWithAuthor } from "@/lib/data/services/getCachedBlogPrimaryData";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import {
  buildArticleBreadcrumbJsonLd,
  buildArticleJsonLd,
  buildArtworkBreadcrumbJsonLd,
  buildArtworkJsonLd,
  buildBlogBreadcrumbJsonLd,
  buildBlogJsonLd,
  buildCollectionArtworkBreadcrumbJsonLd,
  buildCollectionArtworkJsonLd,
  buildProductBreadcrumbJsonLd,
  buildProductJsonLd,
  serializeJsonLd,
  type JsonLdObject,
} from "@/lib/metadata/publicDetailMetadata";

type PublicJsonLdScriptProps = {
  id: string;
  jsonLd: JsonLdObject;
};

function PublicJsonLdScript({ id, jsonLd }: PublicJsonLdScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  );
}

type PublicStructuredDataScriptsProps = {
  entity: PublicJsonLdScriptProps;
  breadcrumb: PublicJsonLdScriptProps;
};

function PublicStructuredDataScripts({
  entity,
  breadcrumb,
}: PublicStructuredDataScriptsProps) {
  return (
    <>
      <PublicJsonLdScript {...entity} />
      <PublicJsonLdScript {...breadcrumb} />
    </>
  );
}

export async function BiographyArticleJsonLd({ slug }: { slug: string }) {
  try {
    const article = await getCachedBiographyArticleBySlug(slug);

    if (!article) {
      return null;
    }

    return (
      <PublicJsonLdScript
        id="biography-article-json-ld"
        jsonLd={buildArticleJsonLd(article)}
      />
    );
  } catch {
    return null;
  }
}

export async function BiographyArticleStructuredData({
  slug,
}: {
  slug: string;
}) {
  try {
    const article = await getCachedBiographyArticleBySlug(slug);

    if (!article) {
      return null;
    }

    return (
      <PublicStructuredDataScripts
        entity={{
          id: "biography-article-json-ld",
          jsonLd: buildArticleJsonLd(article),
        }}
        breadcrumb={{
          id: "biography-breadcrumb-json-ld",
          jsonLd: buildArticleBreadcrumbJsonLd(article),
        }}
      />
    );
  } catch {
    return null;
  }
}

export async function BlogPostJsonLd({ slug }: { slug: string }) {
  try {
    const blog = await getCachedBlogBySlugWithAuthor(slug);

    if (!blog) {
      return null;
    }

    return (
      <PublicJsonLdScript id="blog-post-json-ld" jsonLd={buildBlogJsonLd(blog)} />
    );
  } catch {
    return null;
  }
}

export async function BlogPostStructuredData({ slug }: { slug: string }) {
  try {
    const blog = await getCachedBlogBySlugWithAuthor(slug);

    if (!blog) {
      return null;
    }

    return (
      <PublicStructuredDataScripts
        entity={{
          id: "blog-post-json-ld",
          jsonLd: buildBlogJsonLd(blog),
        }}
        breadcrumb={{
          id: "blog-breadcrumb-json-ld",
          jsonLd: buildBlogBreadcrumbJsonLd(blog),
        }}
      />
    );
  } catch {
    return null;
  }
}

export async function ArtworkJsonLd({ artworkId }: { artworkId: string }) {
  try {
    const artwork = await getArtworkById(artworkId);

    if (!artwork) {
      return null;
    }

    return (
      <PublicJsonLdScript
        id="artwork-json-ld"
        jsonLd={buildArtworkJsonLd(artwork)}
      />
    );
  } catch {
    return null;
  }
}

export async function ArtworkStructuredData({
  artworkId,
}: {
  artworkId: string;
}) {
  try {
    const artwork = await getArtworkById(artworkId);

    if (!artwork) {
      return null;
    }

    return (
      <PublicStructuredDataScripts
        entity={{
          id: "artwork-json-ld",
          jsonLd: buildArtworkJsonLd(artwork),
        }}
        breadcrumb={{
          id: "artwork-breadcrumb-json-ld",
          jsonLd: buildArtworkBreadcrumbJsonLd(artwork),
        }}
      />
    );
  } catch {
    return null;
  }
}

export async function CollectionArtworkJsonLd({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  try {
    const result = await getCollectionArtwork(slug, artworkId);

    if (result.status !== "found") {
      return null;
    }

    return (
      <PublicJsonLdScript
        id="collection-artwork-json-ld"
        jsonLd={buildCollectionArtworkJsonLd(result.collection)}
      />
    );
  } catch {
    return null;
  }
}

export async function CollectionArtworkStructuredData({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  try {
    const result = await getCollectionArtwork(slug, artworkId);

    if (result.status !== "found") {
      return null;
    }

    return (
      <PublicStructuredDataScripts
        entity={{
          id: "collection-artwork-json-ld",
          jsonLd: buildCollectionArtworkJsonLd(result.collection),
        }}
        breadcrumb={{
          id: "collection-artwork-breadcrumb-json-ld",
          jsonLd: buildCollectionArtworkBreadcrumbJsonLd(result.collection),
        }}
      />
    );
  } catch {
    return null;
  }
}

export async function ProductJsonLd({
  productHandle,
}: {
  productHandle: string;
}) {
  try {
    const product = await getProductByHandle(productHandle);

    if (!product) {
      return null;
    }

    return (
      <PublicJsonLdScript
        id="product-json-ld"
        jsonLd={buildProductJsonLd(product)}
      />
    );
  } catch {
    return null;
  }
}

export async function ProductStructuredData({
  productHandle,
}: {
  productHandle: string;
}) {
  try {
    const product = await getProductByHandle(productHandle);

    if (!product) {
      return null;
    }

    return (
      <PublicStructuredDataScripts
        entity={{
          id: "product-json-ld",
          jsonLd: buildProductJsonLd(product),
        }}
        breadcrumb={{
          id: "product-breadcrumb-json-ld",
          jsonLd: buildProductBreadcrumbJsonLd(product),
        }}
      />
    );
  } catch {
    return null;
  }
}

import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import {
  buildArticleJsonLd,
  buildArtworkJsonLd,
  buildBlogJsonLd,
  buildCollectionArtworkJsonLd,
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

export async function BiographyArticleJsonLd({ slug }: { slug: string }) {
  try {
    const article = await getArticleBySlugPopulated(slug);

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

export async function BlogPostJsonLd({ slug }: { slug: string }) {
  try {
    const blog = await getBlogBySlugWithAuthor(slug);

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

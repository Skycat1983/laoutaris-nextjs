import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import {
  buildArticleJsonLd,
  buildBlogJsonLd,
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

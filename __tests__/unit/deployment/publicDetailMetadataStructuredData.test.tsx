import { readFileSync } from "fs";
import path from "path";
import type { ReactElement } from "react";
import { generateMetadata as generateBiographyMetadata } from "@/app/biography/[slug]/page";
import { generateMetadata as generateBlogMetadata } from "@/app/blog/[slug]/page";
import {
  BiographyArticleJsonLd,
  BlogPostJsonLd,
} from "@/components/metadata/PublicDetailJsonLd";
import { getCachedBiographyArticleBySlug } from "@/lib/data/services/getCachedBiographyArticleData";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";

jest.mock("@/lib/data/services/getCachedBiographyArticleData", () => ({
  getCachedBiographyArticleBySlug: jest.fn(),
}));

jest.mock("@/lib/data/services/getBlogBySlugWithAuthor", () => ({
  getBlogBySlugWithAuthor: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionArtwork", () => ({
  getCollectionArtwork: jest.fn(),
}));

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductByHandle: jest.fn(),
}));

jest.mock("@/components/loaders/viewLoaders/ArticleLoader", () => ({
  ArticleLoader: jest.fn(() => null),
}));

jest.mock("@/components/loaders/viewLoaders/BlogDetailLoader", () => ({
  BlogDetailLoader: jest.fn(() => null),
}));

jest.mock("@/components/views/BlogDetail", () => ({
  BlogDetailSkeleton: jest.fn(() => null),
}));

jest.mock("@/components/elements/skeletons/ArticleViewSkeleton", () =>
  jest.fn(() => null)
);

const mockGetCachedBiographyArticleBySlug =
  getCachedBiographyArticleBySlug as jest.MockedFunction<
    typeof getCachedBiographyArticleBySlug
  >;
const mockGetBlogBySlugWithAuthor =
  getBlogBySlugWithAuthor as jest.MockedFunction<
    typeof getBlogBySlugWithAuthor
  >;

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const renderJsonLdScript = (
  element: ReactElement<{ id: string; jsonLd: Record<string, unknown> }>
) =>
  (
    element.type as (props: {
      id: string;
      jsonLd: Record<string, unknown>;
    }) => ReactElement<{
      id: string;
      type: string;
      dangerouslySetInnerHTML: { __html: string };
    }>
  )(element.props);

const article = {
  title: "Studio Notes",
  subtitle: "A biography article subtitle",
  summary: "How Joseph Laoutaris worked across painting, drawing, and archive.",
  imageUrl: "https://res.cloudinary.com/demo/image/upload/studio-notes.jpg",
  slug: "studio-notes",
} as never;

const blog = {
  title: "Gallery News",
  subtitle: "A blog post subtitle",
  summary: "Updates from the Joseph Laoutaris archive and public gallery.",
  imageUrl: "https://res.cloudinary.com/demo/image/upload/gallery-news.jpg",
  slug: "gallery-news",
  displayDate: new Date("2024-04-05T10:30:00.000Z"),
  tags: ["exhibition", "archive"],
} as never;

describe("public article and blog detail metadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCachedBiographyArticleBySlug.mockResolvedValue(article);
    mockGetBlogBySlugWithAuthor.mockResolvedValue(blog);
  });

  it("builds biography article metadata from article data and the public site URL helper", async () => {
    const metadata = await generateBiographyMetadata({
      params: { slug: "studio-notes" },
    });
    const canonicalUrl = getPublicSitePathUrl("/biography/studio-notes");

    expect(mockGetCachedBiographyArticleBySlug).toHaveBeenCalledWith(
      "studio-notes"
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(metadata).toMatchObject({
      title: "Studio Notes",
      description:
        "How Joseph Laoutaris worked across painting, drawing, and archive.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        siteName: "Joseph Laoutaris Art Archive",
        title: "Studio Notes",
        description:
          "How Joseph Laoutaris worked across painting, drawing, and archive.",
        images: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/studio-notes.jpg",
            alt: "Studio Notes",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Studio Notes",
        description:
          "How Joseph Laoutaris worked across painting, drawing, and archive.",
        images: [
          "https://res.cloudinary.com/demo/image/upload/studio-notes.jpg",
        ],
      },
    });
  });

  it("builds blog detail metadata without carrying comments query strings into canonical URLs", async () => {
    const metadata = await generateBlogMetadata({
      params: { slug: "gallery-news" },
      searchParams: { comments: "true" },
    });
    const canonicalUrl = getPublicSitePathUrl("/blog/gallery-news");

    expect(mockGetBlogBySlugWithAuthor).toHaveBeenCalledWith("gallery-news");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(metadata).toMatchObject({
      title: "Gallery News",
      description: "Updates from the Joseph Laoutaris archive and public gallery.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        siteName: "Joseph Laoutaris Art Archive",
        title: "Gallery News",
        description:
          "Updates from the Joseph Laoutaris archive and public gallery.",
        publishedTime: "2024-04-05T10:30:00.000Z",
        tags: ["exhibition", "archive"],
        images: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/gallery-news.jpg",
            alt: "Gallery News",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Gallery News",
        description:
          "Updates from the Joseph Laoutaris archive and public gallery.",
        images: [
          "https://res.cloudinary.com/demo/image/upload/gallery-news.jpg",
        ],
      },
    });
    expect(JSON.stringify(metadata)).not.toContain("comments=true");
  });

  it("returns noindex missing-content metadata instead of detail-specific claims", async () => {
    mockGetCachedBiographyArticleBySlug.mockResolvedValue(null);
    mockGetBlogBySlugWithAuthor.mockResolvedValue(null);

    await expect(
      generateBiographyMetadata({ params: { slug: "missing-article" } })
    ).resolves.toEqual({
      title: "Article not found",
      robots: {
        index: false,
        follow: false,
      },
    });

    await expect(
      generateBlogMetadata({
        params: { slug: "missing-blog" },
        searchParams: {},
      })
    ).resolves.toEqual({
      title: "Blog post not found",
      robots: {
        index: false,
        follow: false,
      },
    });
  });

  it("keeps metadata service failures out of the visible loader error path", async () => {
    mockGetCachedBiographyArticleBySlug.mockRejectedValue(
      new Error("private article failure")
    );
    mockGetBlogBySlugWithAuthor.mockRejectedValue(
      new Error("private blog failure")
    );

    await expect(
      generateBiographyMetadata({ params: { slug: "studio-notes" } })
    ).resolves.toEqual({
      title: "Article unavailable",
      robots: {
        index: false,
        follow: false,
      },
    });

    await expect(
      generateBlogMetadata({
        params: { slug: "gallery-news" },
        searchParams: {},
      })
    ).resolves.toEqual({
      title: "Blog post unavailable",
      robots: {
        index: false,
        follow: false,
      },
    });
  });

  it("renders conservative biography article JSON-LD from existing public fields only", async () => {
    const element = (await BiographyArticleJsonLd({
      slug: "studio-notes",
    })) as ReactElement<{ id: string; jsonLd: Record<string, unknown> }>;
    const script = renderJsonLdScript(element);
    const jsonLd = JSON.parse(script.props.dangerouslySetInnerHTML.__html);

    expect(script.type).toBe("script");
    expect(script.props).toMatchObject({
      id: "biography-article-json-ld",
      type: "application/ld+json",
    });
    expect(jsonLd).toEqual({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Studio Notes",
      description:
        "How Joseph Laoutaris worked across painting, drawing, and archive.",
      image: "https://res.cloudinary.com/demo/image/upload/studio-notes.jpg",
      url: getPublicSitePathUrl("/biography/studio-notes"),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": getPublicSitePathUrl("/biography/studio-notes"),
      },
    });
    expect(jsonLd).not.toHaveProperty("author");
    expect(jsonLd).not.toHaveProperty("publisher");
    expect(jsonLd).not.toHaveProperty("offers");
  });

  it("renders conservative blog JSON-LD without author, publisher, or commerce claims", async () => {
    const element = (await BlogPostJsonLd({
      slug: "gallery-news",
    })) as ReactElement<{ id: string; jsonLd: Record<string, unknown> }>;
    const script = renderJsonLdScript(element);
    const jsonLd = JSON.parse(script.props.dangerouslySetInnerHTML.__html);

    expect(script.props).toMatchObject({
      id: "blog-post-json-ld",
      type: "application/ld+json",
    });
    expect(jsonLd).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Gallery News",
      description: "Updates from the Joseph Laoutaris archive and public gallery.",
      image: "https://res.cloudinary.com/demo/image/upload/gallery-news.jpg",
      url: getPublicSitePathUrl("/blog/gallery-news"),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": getPublicSitePathUrl("/blog/gallery-news"),
      },
      datePublished: "2024-04-05T10:30:00.000Z",
      keywords: "exhibition, archive",
    });
    expect(jsonLd).not.toHaveProperty("author");
    expect(jsonLd).not.toHaveProperty("publisher");
    expect(jsonLd).not.toHaveProperty("offers");
  });

  it("does not emit JSON-LD when the source content is missing or unavailable", async () => {
    mockGetCachedBiographyArticleBySlug.mockResolvedValueOnce(null);
    mockGetBlogBySlugWithAuthor.mockRejectedValueOnce(
      new Error("private blog failure")
    );

    await expect(
      BiographyArticleJsonLd({ slug: "missing-article" })
    ).resolves.toBeNull();
    await expect(BlogPostJsonLd({ slug: "gallery-news" })).resolves.toBeNull();
  });

  it("keeps scaffold text, same-app HTTP, and commerce/legal claims out of the detail metadata slice", () => {
    const combinedSource = [
      "src/app/biography/[slug]/page.tsx",
      "src/app/blog/[slug]/page.tsx",
      "src/components/metadata/PublicDetailJsonLd.tsx",
      "src/lib/metadata/publicDetailMetadata.ts",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(combinedSource).toContain("getPublicSitePathUrl");
    expect(combinedSource).not.toMatch(/Create Next App/);
    expect(combinedSource).not.toMatch(/Generated by create next app/);
    expect(combinedSource).not.toMatch(/fetch\s*\(/);
    expect(combinedSource).not.toMatch(
      /checkout|payments?|shipping|refunds?|guarantees?/i
    );
  });
});

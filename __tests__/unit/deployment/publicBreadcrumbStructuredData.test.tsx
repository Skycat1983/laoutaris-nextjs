import { Children, Fragment, type ReactElement } from "react";
import { readFileSync } from "fs";
import path from "path";
import {
  ArtworkStructuredData,
  BiographyArticleStructuredData,
  BlogPostStructuredData,
  CollectionArtworkStructuredData,
  ProductStructuredData,
} from "@/components/metadata/PublicDetailJsonLd";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";
import { getCachedBiographyArticleBySlug } from "@/lib/data/services/getCachedBiographyArticleData";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getCachedBlogBySlugWithAuthor } from "@/lib/data/services/getCachedBlogPrimaryData";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import {
  buildArticleBreadcrumbJsonLd,
  buildArtworkBreadcrumbJsonLd,
  buildBlogBreadcrumbJsonLd,
  buildCollectionArtworkBreadcrumbJsonLd,
  buildProductDetailMetadata,
  buildProductBreadcrumbJsonLd,
  buildProductJsonLd,
} from "@/lib/metadata/publicDetailMetadata";

jest.mock("@/lib/data/services/getCachedBiographyArticleData", () => ({
  getCachedBiographyArticleBySlug: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("@/lib/data/services/getCachedBlogPrimaryData", () => ({
  getCachedBlogBySlugWithAuthor: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionArtwork", () => ({
  getCollectionArtwork: jest.fn(),
}));

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductByHandle: jest.fn(),
}));

const mockGetCachedBiographyArticleBySlug =
  getCachedBiographyArticleBySlug as jest.MockedFunction<
    typeof getCachedBiographyArticleBySlug
  >;
const mockGetArtworkById = getArtworkById as jest.MockedFunction<
  typeof getArtworkById
>;
const mockGetCachedBlogBySlugWithAuthor =
  getCachedBlogBySlugWithAuthor as jest.MockedFunction<
    typeof getCachedBlogBySlugWithAuthor
  >;
const mockGetCollectionArtwork =
  getCollectionArtwork as jest.MockedFunction<typeof getCollectionArtwork>;
const mockGetProductByHandle =
  getProductByHandle as jest.MockedFunction<typeof getProductByHandle>;

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const renderComponentElement = (
  element: ReactElement<Record<string, unknown>>
) =>
  (element.type as (props: Record<string, unknown>) => ReactElement)(
    element.props
  );

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

const renderStructuredDataScripts = (
  element: ReactElement<Record<string, unknown>>
) => {
  const rendered = renderComponentElement(element);

  expect(rendered.type).toBe(Fragment);

  return Children.toArray(rendered.props.children).map((child) =>
    renderJsonLdScript(
      child as ReactElement<{ id: string; jsonLd: Record<string, unknown> }>
    )
  );
};

const parseJsonLd = (
  script: ReactElement<{
    id: string;
    type: string;
    dangerouslySetInnerHTML: { __html: string };
  }>
) => JSON.parse(script.props.dangerouslySetInnerHTML.__html);

const artworkId = "65f1d9f1093b3e3a7c123456";

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

const artwork = {
  _id: artworkId,
  title: "Blue Figure",
  decade: "1970s",
  artstyle: "figurative",
  medium: "oil",
  surface: "canvas",
  image: {
    secure_url: "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
    bytes: 1200,
    pixelHeight: 1200,
    pixelWidth: 900,
    format: "jpg",
    hexColors: [],
    predominantColors: { cloudinary: [], google: [] },
  },
} as never;

const collection = {
  title: "Studio Collection",
  slug: "studio-collection",
  artworks: [artwork],
} as never;

const product = {
  id: "gid://shopify/Product/10538938761480",
  handle: "blue-figure-print",
  title: "Blue Figure Print",
  description: "<p>Archive print based on Blue Figure.</p>",
  descriptionHtml: "<p>Archive print based on Blue Figure.</p>",
  vendor: "Joseph Laoutaris Archive",
  productType: "print",
  tags: ["archive"],
  price: "120.00",
  currencyCode: "EUR",
  compareAtPrice: null,
  image: {
    url: "https://cdn.shopify.com/s/files/blue-figure-print.jpg",
    altText: "Blue Figure Print",
  },
  availableForSale: true,
  variants: [],
} as never;

describe("public breadcrumb structured data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCachedBiographyArticleBySlug.mockResolvedValue(article);
    mockGetArtworkById.mockResolvedValue(artwork);
    mockGetCachedBlogBySlugWithAuthor.mockResolvedValue(blog);
    mockGetCollectionArtwork.mockResolvedValue({
      status: "found",
      collection,
    });
    mockGetProductByHandle.mockResolvedValue(product);
  });

  it("builds conservative breadcrumb lists with canonical public route URLs", () => {
    expect(buildArticleBreadcrumbJsonLd(article)).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getPublicSitePathUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Biography",
          item: getPublicSitePathUrl("/biography"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Studio Notes",
          item: getPublicSitePathUrl("/biography/studio-notes"),
        },
      ],
    });

    expect(buildBlogBreadcrumbJsonLd(blog)).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home", item: getPublicSitePathUrl("/") },
        { position: 2, name: "Blog", item: getPublicSitePathUrl("/blog") },
        {
          position: 3,
          name: "Gallery News",
          item: getPublicSitePathUrl("/blog/gallery-news"),
        },
      ],
    });

    expect(buildArtworkBreadcrumbJsonLd(artwork)).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home", item: getPublicSitePathUrl("/") },
        { position: 2, name: "Artwork", item: getPublicSitePathUrl("/artwork") },
        {
          position: 3,
          name: "Blue Figure",
          item: getPublicSitePathUrl(`/artwork/${artworkId}`),
        },
      ],
    });

    expect(buildCollectionArtworkBreadcrumbJsonLd(collection)).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home", item: getPublicSitePathUrl("/") },
        {
          position: 2,
          name: "Collections",
          item: getPublicSitePathUrl("/collections"),
        },
        {
          position: 3,
          name: "Studio Collection",
          item: getPublicSitePathUrl("/collections/studio-collection"),
        },
        {
          position: 4,
          name: "Blue Figure",
          item: getPublicSitePathUrl(
            `/collections/studio-collection/${artworkId}`
          ),
        },
      ],
    });

    expect(buildProductBreadcrumbJsonLd(product)).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { position: 1, name: "Home", item: getPublicSitePathUrl("/") },
        { position: 2, name: "Shop", item: getPublicSitePathUrl("/shop") },
        {
          position: 3,
          name: "Products",
          item: getPublicSitePathUrl("/shop/products"),
        },
        {
          position: 4,
          name: "Blue Figure Print",
          item: getPublicSitePathUrl("/shop/products/blue-figure-print"),
        },
      ],
    });
  });

  it("trims product metadata and structured data titles for print products", () => {
    const printProduct = {
      ...product,
      title: "No.034, Limited Edition Print",
      image: {
        url: "https://cdn.shopify.com/s/files/no-034.jpg",
        altText: "No.034, Limited Edition Print",
      },
    } as never;
    const metadata = buildProductDetailMetadata(printProduct);
    const productJsonLd = buildProductJsonLd(printProduct);
    const breadcrumbJsonLd = buildProductBreadcrumbJsonLd(printProduct);

    expect(metadata).toMatchObject({
      title: "No.034",
      openGraph: {
        title: "No.034",
        images: [
          {
            alt: "No.034",
          },
        ],
      },
      twitter: {
        title: "No.034",
      },
    });
    expect(productJsonLd.name).toBe("No.034");
    expect(breadcrumbJsonLd.itemListElement).toContainEqual(
      expect.objectContaining({
        name: "No.034",
        item: getPublicSitePathUrl("/shop/products/blue-figure-print"),
      })
    );
  });

  it("renders one entity JSON-LD script and one breadcrumb JSON-LD script per covered detail component", async () => {
    const cases = [
      {
        element: await BiographyArticleStructuredData({ slug: "studio-notes" }),
        ids: ["biography-article-json-ld", "biography-breadcrumb-json-ld"],
      },
      {
        element: await BlogPostStructuredData({ slug: "gallery-news" }),
        ids: ["blog-post-json-ld", "blog-breadcrumb-json-ld"],
      },
      {
        element: await ArtworkStructuredData({ artworkId }),
        ids: ["artwork-json-ld", "artwork-breadcrumb-json-ld"],
      },
      {
        element: await CollectionArtworkStructuredData({
          slug: "studio-collection",
          artworkId,
        }),
        ids: [
          "collection-artwork-json-ld",
          "collection-artwork-breadcrumb-json-ld",
        ],
      },
      {
        element: await ProductStructuredData({
          productHandle: "blue-figure-print",
        }),
        ids: ["product-json-ld", "product-breadcrumb-json-ld"],
      },
    ];

    cases.forEach(({ element, ids }) => {
      expect(element).not.toBeNull();

      const scripts = renderStructuredDataScripts(
        element as ReactElement<Record<string, unknown>>
      );
      const jsonLd = scripts.map(parseJsonLd);

      expect(scripts).toHaveLength(2);
      expect(scripts.map((script) => script.props.id)).toEqual(ids);
      scripts.forEach((script) => {
        expect(script.props.type).toBe("application/ld+json");
      });
      expect(jsonLd[0]["@type"]).not.toBe("BreadcrumbList");
      expect(jsonLd[1]["@type"]).toBe("BreadcrumbList");
    });
  });

  it("does not emit breadcrumb scripts when source lookups are missing or unavailable", async () => {
    mockGetCachedBiographyArticleBySlug.mockResolvedValueOnce(null);
    mockGetCachedBlogBySlugWithAuthor.mockRejectedValueOnce(
      new Error("private blog failure")
    );
    mockGetArtworkById.mockResolvedValueOnce(null);
    mockGetCollectionArtwork.mockResolvedValueOnce({
      status: "artwork-not-found",
      collection: null,
    });
    mockGetProductByHandle.mockRejectedValueOnce(
      new Error("private Shopify failure")
    );

    await expect(
      BiographyArticleStructuredData({ slug: "missing-article" })
    ).resolves.toBeNull();
    await expect(
      BlogPostStructuredData({ slug: "gallery-news" })
    ).resolves.toBeNull();
    await expect(ArtworkStructuredData({ artworkId })).resolves.toBeNull();
    await expect(
      CollectionArtworkStructuredData({ slug: "studio-collection", artworkId })
    ).resolves.toBeNull();
    await expect(
      ProductStructuredData({ productHandle: "blue-figure-print" })
    ).resolves.toBeNull();
  });

  it("keeps product structured data descriptive and free of commerce/legal claims", async () => {
    const element = (await ProductStructuredData({
      productHandle: "blue-figure-print",
    })) as ReactElement<Record<string, unknown>>;
    const scripts = renderStructuredDataScripts(element);
    const [productJsonLd, breadcrumbJsonLd] = scripts.map(parseJsonLd);

    expect(productJsonLd).not.toHaveProperty("offers");
    expect(productJsonLd).not.toHaveProperty("price");
    expect(productJsonLd).not.toHaveProperty("availability");
    expect(JSON.stringify(productJsonLd)).not.toMatch(
      /checkout|shipping|refund|payment|guarantee/i
    );
    expect(breadcrumbJsonLd["@type"]).toBe("BreadcrumbList");
  });

  it("wires breadcrumb structured data through public detail pages without same-app HTTP", () => {
    const pageSource = [
      "src/app/biography/[slug]/page.tsx",
      "src/app/blog/[slug]/page.tsx",
      "src/app/artwork/[artworkId]/page.tsx",
      "src/app/collections/[slug]/[artworkId]/page.tsx",
      "src/app/shop/products/[productHandle]/page.tsx",
    ]
      .map(readRepoFile)
      .join("\n");
    const structuredDataSource = [
      "src/components/metadata/PublicDetailJsonLd.tsx",
      "src/lib/metadata/publicDetailMetadata.ts",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(pageSource).toContain("BiographyArticleStructuredData");
    expect(pageSource).toContain("BlogPostStructuredData");
    expect(pageSource).toContain("ArtworkStructuredData");
    expect(pageSource).toContain("CollectionArtworkStructuredData");
    expect(pageSource).toContain("ProductStructuredData");
    expect(`${pageSource}\n${structuredDataSource}`).not.toMatch(/fetch\s*\(/);
  });
});

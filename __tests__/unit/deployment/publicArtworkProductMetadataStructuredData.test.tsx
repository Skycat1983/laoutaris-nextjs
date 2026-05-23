import { readFileSync } from "fs";
import path from "path";
import type { ReactElement, ReactNode } from "react";
import { generateMetadata as generateArtworkMetadata } from "@/app/artwork/[artworkId]/page";
import { generateMetadata as generateCollectionArtworkMetadata } from "@/app/collections/[slug]/[artworkId]/page";
import { generateMetadata as generateProductMetadata } from "@/app/shop/products/[productHandle]/page";
import {
  ArtworkJsonLd,
  CollectionArtworkJsonLd,
  ProductJsonLd,
} from "@/components/metadata/PublicDetailJsonLd";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("@/lib/data/services/getCachedBiographyArticleData", () => ({
  getCachedBiographyArticleBySlug: jest.fn(),
}));

jest.mock("@/lib/data/services/getBlogBySlugWithAuthor", () => ({
  getBlogBySlugWithAuthor: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionArtwork", () => ({
  getCollectionArtwork: jest.fn(),
}));

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductByHandle: jest.fn(),
}));

jest.mock("@/components/loaders/viewLoaders/ArtworkLoader", () =>
  jest.fn(() => null)
);

jest.mock("@/components/loaders/viewLoaders/CollectionArtworkLoader", () => ({
  CollectionArtworkLoader: jest.fn(() => null),
}));

jest.mock("@/components/elements/skeletons/ArtworkViewSkeleton", () =>
  jest.fn(() => null)
);

jest.mock("next/image", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => children,
}));

const mockGetArtworkById = getArtworkById as jest.MockedFunction<
  typeof getArtworkById
>;
const mockGetCollectionArtwork =
  getCollectionArtwork as jest.MockedFunction<typeof getCollectionArtwork>;
const mockGetProductByHandle =
  getProductByHandle as jest.MockedFunction<typeof getProductByHandle>;

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

const artworkId = "65f1d9f1093b3e3a7c123456";
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

describe("public artwork and product detail metadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetArtworkById.mockResolvedValue(artwork);
    mockGetCollectionArtwork.mockResolvedValue({
      status: "found",
      collection,
    });
    mockGetProductByHandle.mockResolvedValue(product);
  });

  it("builds standalone artwork metadata from public artwork fields", async () => {
    const metadata = await generateArtworkMetadata({
      params: { artworkId },
    });
    const canonicalUrl = getPublicSitePathUrl(`/artwork/${artworkId}`);

    expect(mockGetArtworkById).toHaveBeenCalledWith(artworkId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(metadata).toMatchObject({
      title: "Blue Figure",
      description:
        "Blue Figure, a Joseph Laoutaris figurative artwork from the 1970s, made with oil on canvas.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        siteName: "Joseph Laoutaris Art Archive",
        title: "Blue Figure",
        description:
          "Blue Figure, a Joseph Laoutaris figurative artwork from the 1970s, made with oil on canvas.",
        images: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
            alt: "Blue Figure",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blue Figure",
        description:
          "Blue Figure, a Joseph Laoutaris figurative artwork from the 1970s, made with oil on canvas.",
        images: [
          "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
        ],
      },
    });
  });

  it("builds collection-aware artwork metadata with the collection route as canonical", async () => {
    const metadata = await generateCollectionArtworkMetadata({
      params: { slug: "studio-collection", artworkId },
    });
    const canonicalUrl = getPublicSitePathUrl(
      `/collections/studio-collection/${artworkId}`
    );

    expect(mockGetCollectionArtwork).toHaveBeenCalledWith(
      "studio-collection",
      artworkId
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(metadata).toMatchObject({
      title: "Blue Figure in Studio Collection",
      description:
        "Blue Figure in Studio Collection, a Joseph Laoutaris figurative artwork from the 1970s, made with oil on canvas.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        url: canonicalUrl,
        title: "Blue Figure in Studio Collection",
      },
      twitter: {
        title: "Blue Figure in Studio Collection",
      },
    });
  });

  it("builds product metadata from Shopify product identity without policy claims", async () => {
    const metadata = await generateProductMetadata({
      params: { productHandle: "blue-figure-print" },
    });
    const canonicalUrl = getPublicSitePathUrl(
      "/shop/products/blue-figure-print"
    );

    expect(mockGetProductByHandle).toHaveBeenCalledWith("blue-figure-print");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(metadata).toMatchObject({
      title: "Blue Figure Print",
      description: "Archive print based on Blue Figure.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        siteName: "Joseph Laoutaris Art Archive",
        title: "Blue Figure Print",
        description: "Archive print based on Blue Figure.",
        images: [
          {
            url: "https://cdn.shopify.com/s/files/blue-figure-print.jpg",
            alt: "Blue Figure Print",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blue Figure Print",
        description: "Archive print based on Blue Figure.",
        images: ["https://cdn.shopify.com/s/files/blue-figure-print.jpg"],
      },
    });
    expect(JSON.stringify(metadata)).not.toMatch(
      /checkout|shipping|refund|payment|guarantee/i
    );
  });

  it("returns noindex metadata for missing or unavailable detail content", async () => {
    mockGetArtworkById.mockResolvedValueOnce(null);
    mockGetCollectionArtwork.mockResolvedValueOnce({
      status: "artwork-not-found",
      collection: null,
    });
    mockGetProductByHandle.mockResolvedValueOnce(null);

    await expect(
      generateArtworkMetadata({ params: { artworkId } })
    ).resolves.toEqual({
      title: "Artwork not found",
      robots: {
        index: false,
        follow: false,
      },
    });

    await expect(
      generateCollectionArtworkMetadata({
        params: { slug: "studio-collection", artworkId },
      })
    ).resolves.toEqual({
      title: "Artwork not found",
      robots: {
        index: false,
        follow: false,
      },
    });

    await expect(
      generateProductMetadata({
        params: { productHandle: "missing-product" },
      })
    ).resolves.toEqual({
      title: "Product not found",
      robots: {
        index: false,
        follow: false,
      },
    });

    mockGetArtworkById.mockRejectedValueOnce(new Error("private DB failure"));
    mockGetCollectionArtwork.mockRejectedValueOnce(
      new Error("private collection failure")
    );
    mockGetProductByHandle.mockRejectedValueOnce(
      new Error("private Shopify failure")
    );

    await expect(
      generateArtworkMetadata({ params: { artworkId } })
    ).resolves.toEqual({
      title: "Artwork unavailable",
      robots: {
        index: false,
        follow: false,
      },
    });

    await expect(
      generateCollectionArtworkMetadata({
        params: { slug: "studio-collection", artworkId },
      })
    ).resolves.toEqual({
      title: "Artwork unavailable",
      robots: {
        index: false,
        follow: false,
      },
    });

    await expect(
      generateProductMetadata({
        params: { productHandle: "blue-figure-print" },
      })
    ).resolves.toEqual({
      title: "Product unavailable",
      robots: {
        index: false,
        follow: false,
      },
    });
  });

  it("renders conservative artwork and collection artwork JSON-LD", async () => {
    const artworkElement = (await ArtworkJsonLd({
      artworkId,
    })) as ReactElement<{ id: string; jsonLd: Record<string, unknown> }>;
    const collectionElement = (await CollectionArtworkJsonLd({
      slug: "studio-collection",
      artworkId,
    })) as ReactElement<{ id: string; jsonLd: Record<string, unknown> }>;

    const artworkJsonLd = JSON.parse(
      renderJsonLdScript(artworkElement).props.dangerouslySetInnerHTML.__html
    );
    const collectionJsonLd = JSON.parse(
      renderJsonLdScript(collectionElement).props.dangerouslySetInnerHTML.__html
    );

    expect(artworkJsonLd).toEqual({
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      name: "Blue Figure",
      description:
        "Blue Figure, a Joseph Laoutaris figurative artwork from the 1970s, made with oil on canvas.",
      image: "https://res.cloudinary.com/demo/image/upload/blue-figure.jpg",
      url: getPublicSitePathUrl(`/artwork/${artworkId}`),
      creator: {
        "@type": "Person",
        name: "Joseph Laoutaris",
      },
      artMedium: "oil",
      artworkSurface: "canvas",
      genre: "figurative",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": getPublicSitePathUrl(`/artwork/${artworkId}`),
      },
    });
    expect(collectionJsonLd).toMatchObject({
      "@type": "VisualArtwork",
      name: "Blue Figure",
      url: getPublicSitePathUrl(`/collections/studio-collection/${artworkId}`),
      mainEntityOfPage: {
        "@id": getPublicSitePathUrl(
          `/collections/studio-collection/${artworkId}`
        ),
      },
    });
    expect(collectionJsonLd.description).toContain("Studio Collection");
  });

  it("renders product JSON-LD with identity fields only", async () => {
    const element = (await ProductJsonLd({
      productHandle: "blue-figure-print",
    })) as ReactElement<{ id: string; jsonLd: Record<string, unknown> }>;
    const script = renderJsonLdScript(element);
    const jsonLd = JSON.parse(script.props.dangerouslySetInnerHTML.__html);

    expect(script.props).toMatchObject({
      id: "product-json-ld",
      type: "application/ld+json",
    });
    expect(jsonLd).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Blue Figure Print",
      description: "Archive print based on Blue Figure.",
      url: getPublicSitePathUrl("/shop/products/blue-figure-print"),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": getPublicSitePathUrl("/shop/products/blue-figure-print"),
      },
      image: "https://cdn.shopify.com/s/files/blue-figure-print.jpg",
      brand: {
        "@type": "Brand",
        name: "Joseph Laoutaris Archive",
      },
      category: "print",
    });
    expect(jsonLd).not.toHaveProperty("offers");
    expect(jsonLd).not.toHaveProperty("price");
    expect(jsonLd).not.toHaveProperty("availability");
    expect(JSON.stringify(jsonLd)).not.toMatch(
      /checkout|shipping|refund|payment|guarantee/i
    );
  });

  it("does not emit detail JSON-LD when source content is missing or unavailable", async () => {
    mockGetArtworkById.mockResolvedValueOnce(null);
    mockGetCollectionArtwork.mockResolvedValueOnce({
      status: "collection-not-found",
      collection: null,
    });
    mockGetProductByHandle.mockRejectedValueOnce(
      new Error("private Shopify failure")
    );

    await expect(ArtworkJsonLd({ artworkId })).resolves.toBeNull();
    await expect(
      CollectionArtworkJsonLd({ slug: "missing-collection", artworkId })
    ).resolves.toBeNull();
    await expect(
      ProductJsonLd({ productHandle: "blue-figure-print" })
    ).resolves.toBeNull();
  });

  it("keeps same-app HTTP and scaffold text out of the artwork/product detail metadata slice", () => {
    const combinedSource = [
      "src/app/artwork/[artworkId]/page.tsx",
      "src/app/collections/[slug]/[artworkId]/page.tsx",
      "src/components/metadata/PublicDetailJsonLd.tsx",
      "src/lib/metadata/publicDetailMetadata.ts",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(combinedSource).toContain("getPublicSitePathUrl");
    expect(combinedSource).not.toMatch(/Create Next App/);
    expect(combinedSource).not.toMatch(/Generated by create next app/);
    expect(combinedSource).not.toMatch(/fetch\s*\(/);
  });
});

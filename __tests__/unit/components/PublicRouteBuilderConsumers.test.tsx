/* eslint-disable @next/next/no-img-element */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { BlogCard } from "@/components/modules/cards/BlogCard";
import { BlogsViewCard } from "@/components/modules/cards/BlogsViewCard";
import { BiographyCard } from "@/components/modules/cards/BiographyCard";
import { ProductCard } from "@/components/modules/cards/ProductCard";
import { CollectionCard } from "@/components/modules/cards/CollectionCard";
import ArtworkShopSection from "@/components/modules/cards/ArtworkShopSection";
import { MasonryLayout } from "@/components/layouts/public/MasonryLayout";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ArtworkFrontend, CollectionFrontend } from "@/lib/data/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

jest.mock("@/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: jest.fn(() => ({
    observerRef: { current: null },
    isLoading: false,
    error: null,
  })),
}));

jest.mock("@/lib/images/cloudinaryDelivery", () => ({
  getCloudinaryDeliveryUrl: (src?: string) => src ?? "",
}));

const blog = {
  _id: "blog-1",
  slug: "studio/news",
  title: "Studio News",
  subtitle: "Archive update",
  summary: "A studio archive update.",
  text: "A studio archive update.",
  imageUrl: "https://example.com/blog.jpg",
  displayDate: new Date("2024-03-01T00:00:00.000Z"),
  featured: false,
  pinned: false,
  tags: [],
  readTime: 1,
  commentCount: 0,
} satisfies BlogEntryFrontend;

const product = {
  id: "gid://shopify/Product/1",
  handle: "blue print/large",
  title: "Blue Print",
  description: "A print.",
  descriptionHtml: "<p>A print.</p>",
  vendor: "Joseph Laoutaris",
  productType: "Print",
  tags: [],
  price: "25.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
} satisfies SimpleProduct;

const artworkImage = {
  secure_url: "https://example.com/artwork.jpg",
  public_id: "artwork",
  bytes: 100,
  pixelHeight: 800,
  pixelWidth: 600,
  format: "jpg",
  hexColors: [{ color: "#111111", percentage: 50 }],
  predominantColors: {
    cloudinary: [],
    google: [],
  },
};

const artwork = {
  _id: "figure #1",
  title: "Figure",
  decade: "1970s",
  artstyle: "abstract",
  medium: "oil",
  surface: "canvas",
  featured: false,
  isWatchlisted: false,
  isFavourited: false,
  watchlistCount: 0,
  favouriteCount: 0,
  collectionCount: 0,
  shopifyProducts: ["gid://shopify/Product/1"],
  image: artworkImage,
} as unknown as ArtworkFrontend;

describe("public route builder consumers", () => {
  it("renders card detail links through the public route builders", () => {
    render(
      <>
        <BlogCard blog={blog} />
        <BlogsViewCard blog={blog} />
        <BiographyCard
          entry={{
            slug: "early years",
            title: "Early Years",
            subtitle: "Biography",
            imageUrl: "https://example.com/article.jpg",
          }}
        />
        <ProductCard product={product} />
        <CollectionCard
          collection={
            {
              slug: "works on paper",
              firstArtworkId: "figure #1",
              title: "Works on Paper",
              imageUrl: "https://example.com/collection.jpg",
            } as CollectionFrontend
          }
        />
      </>
    );

    expect(screen.getAllByRole("link", { name: /studio news/i })).toHaveLength(
      2
    );
    expect(screen.getAllByRole("link", { name: /studio news/i })[0]).toHaveAttribute(
      "href",
      "/blog/studio%2Fnews"
    );
    expect(screen.getByRole("link", { name: /early years/i })).toHaveAttribute(
      "href",
      "/biography/early%20years"
    );
    expect(screen.getByRole("link", { name: /blue print/i })).toHaveAttribute(
      "href",
      "/shop/products/blue%20print%2Flarge"
    );
    expect(
      screen.getByRole("link", { name: /works on paper/i })
    ).toHaveAttribute(
      "href",
      "/collections/works%20on%20paper/figure%20%231"
    );
  });

  it("renders artwork and artwork-shop links through the public route builders", () => {
    render(
      <>
        <MasonryLayout
          artworks={[artwork]}
          hasMore={false}
          onLoadMore={jest.fn()}
        />
        <ArtworkShopSection
          artwork={artwork}
          shopProducts={{
            original: product,
            prints: [{ ...product, id: "print", handle: "print/large" }],
            books: [
              {
                ...product,
                id: "book",
                handle: "book edition",
                title: "Book Edition",
              },
            ],
          }}
        />
      </>
    );

    expect(screen.getByRole("link", { name: /figure/i })).toHaveAttribute(
      "href",
      "/artwork/figure%20%231"
    );
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/shop/products/blue%20print%2Flarge"
    );
    expect(screen.getByRole("link", { name: /print - gbp/i })).toHaveAttribute(
      "href",
      "/shop/products/print%2Flarge"
    );
    expect(screen.getByRole("link", { name: /book edition/i })).toHaveAttribute(
      "href",
      "/shop/products/book%20edition"
    );
  });

  it("keeps migrated public UI consumers wired to the route module", () => {
    const migratedFiles = [
      "src/components/modules/cards/BlogCard.tsx",
      "src/components/modules/cards/BlogsViewCard.tsx",
      "src/components/modules/cards/BiographyCard.tsx",
      "src/components/modules/cards/ProductCard.tsx",
      "src/components/modules/cards/CollectionCard.tsx",
      "src/components/modules/cards/ArtworkShopSection.tsx",
      "src/components/layouts/public/MasonryLayout.tsx",
      "src/components/sections/BlogSectionContinuous.tsx",
      "src/components/sections/BlogSectionSplitScreen.tsx",
      "src/components/sections/BlogSectionTiles.tsx",
      "src/components/sections/BlogsSectionFeatured.tsx",
      "src/app/shop/products/[productHandle]/page.tsx",
      "src/components/shop/product-detail/ShopProductSaleGallery.tsx",
    ];

    for (const file of migratedFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");

      expect(source).toContain("@/lib/routes/publicAppRoutes");
      const activeSource = source
        .split("\n")
        .filter((line) => !line.trimStart().startsWith("//"))
        .join("\n");

      expect(activeSource).not.toMatch(
        /`\/(?:artwork|biography|blog|collections|shop\/products)\/\$\{/
      );
    }
  });
});

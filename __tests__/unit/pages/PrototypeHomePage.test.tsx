/* eslint-disable @next/next/no-img-element */
import { readFileSync } from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import PrototypeHomePage, { metadata } from "@/app/prototype/home/page";
import { HomePrototype } from "@/components/prototypes/home/HomePrototype";
import { BiographyPrototypeSection } from "@/components/prototypes/home/BiographyPrototypeSection";
import { getBiographyPrototypeArticles } from "@/components/prototypes/home/BiographyPrototypeLoader";
import { BlogPrototypeSection } from "@/components/prototypes/home/BlogPrototypeSection";
import { getBlogPrototypeEntries } from "@/components/prototypes/home/BlogPrototypeLoader";
import { ShopPrototypeSection } from "@/components/prototypes/home/ShopPrototypeSection";
import { getShopPrototypeProducts } from "@/components/prototypes/home/ShopPrototypeLoader";
import type { SimpleProduct } from "@/lib/data/types/shopify";

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

jest.mock("@/components/prototypes/home/BlogPrototypeLoader", () => ({
  getBlogPrototypeEntries: jest.fn(),
}));

jest.mock("@/components/prototypes/home/BiographyPrototypeLoader", () => ({
  getBiographyPrototypeArticles: jest.fn(),
}));

jest.mock("@/components/prototypes/home/ShopPrototypeLoader", () => ({
  getShopPrototypeProducts: jest.fn(),
}));

jest.mock("@/lib/images/cloudinaryDelivery", () => ({
  getCloudinaryDeliveryUrl: (src?: string) => src ?? "",
}));

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const mockGetBlogPrototypeEntries =
  getBlogPrototypeEntries as jest.MockedFunction<typeof getBlogPrototypeEntries>;
const mockGetBiographyPrototypeArticles =
  getBiographyPrototypeArticles as jest.MockedFunction<
    typeof getBiographyPrototypeArticles
  >;
const mockGetShopPrototypeProducts =
  getShopPrototypeProducts as jest.MockedFunction<
    typeof getShopPrototypeProducts
  >;

const createBlog = (slug: string, title: string, subtitle?: string) =>
  ({
    slug,
    title,
    subtitle: subtitle ?? "",
    summary: `${title} archive summary`,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
  }) as never;

const createBiographyArticle = (
  slug: string,
  title: string,
  subtitle: string
) =>
  ({
    slug,
    title,
    subtitle,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
  }) as never;

const createProduct = (
  handle: string,
  title: string,
  overrides: Partial<SimpleProduct> = {}
): SimpleProduct => ({
  id: `gid://shopify/Product/${handle}`,
  handle,
  title,
  description: `${title} product description`,
  descriptionHtml: `<p>${title} product description</p>`,
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["oil on canvas", "archive"],
  price: "18000.00",
  currencyCode: "EUR",
  compareAtPrice: null,
  image: {
    url: `https://res.cloudinary.com/dzncmfirr/image/upload/${handle}.jpg`,
    altText: `${title} artwork`,
  },
  availableForSale: true,
  variants: [],
  ...overrides,
});

describe("/prototype/home page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBiographyPrototypeArticles.mockResolvedValue([
      createBiographyArticle(
        "early-years",
        "Early Years",
        "First Encounters with Art"
      ),
    ]);
    mockGetBlogPrototypeEntries.mockResolvedValue([
      createBlog("lead-story", "Lead Story", "Lead blog subtitle"),
      createBlog("studio-note", "Studio Note"),
    ]);
    mockGetShopPrototypeProducts.mockResolvedValue({
      products: [createProduct("yellow-composition", "Yellow Composition")],
      hasLoadError: false,
    });
  });

  it("marks the prototype route noindex", () => {
    expect(metadata).toMatchObject({
      title: "Homepage Prototype",
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    });
  });

  it("renders an isolated page shell with a single route-owned main landmark", async () => {
    render(await PrototypeHomePage());

    expect(screen.getByRole("main")).toHaveAttribute(
      "data-testid",
      "prototype-home-page"
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Homepage Prototype",
      })
    ).toHaveClass("sr-only");
    expect(mockGetBiographyPrototypeArticles).toHaveBeenCalledTimes(1);
    expect(mockGetBlogPrototypeEntries).toHaveBeenCalledTimes(1);
    expect(mockGetShopPrototypeProducts).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("prototype-shop-section")).toBeInTheDocument();
  });

  it("renders full-width prototype sections for hero and public navbar categories", () => {
    render(<HomePrototype />);

    for (const section of [
      "hero",
      "artwork",
      "collections",
      "biography",
      "blog",
      "project",
      "shop",
    ]) {
      expect(
        screen.getByTestId(`prototype-${section}-section`)
      ).toBeInTheDocument();
    }
  });

  it("renders the prototype biography section with real article links", () => {
    render(
      <BiographyPrototypeSection
        articles={[
          createBiographyArticle(
            "early-years",
            "Early Years",
            "First Encounters with Art"
          ),
          createBiographyArticle(
            "meeting-beryl",
            "Meeting Beryl",
            "Legacy of Love and Loss"
          ),
          createBiographyArticle(
            "later-years",
            "Later Years",
            "Resignation and Disappointment"
          ),
        ]}
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Read my grandfather's story",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveAttribute(
      "href",
      "/biography"
    );
    expect(screen.getByRole("link", { name: /Early Years/i })).toHaveAttribute(
      "href",
      "/biography/early-years"
    );
    expect(
      screen.getByRole("link", { name: /Meeting Beryl/i })
    ).toHaveAttribute("href", "/biography/meeting-beryl");
    expect(screen.getAllByText("03").length).toBeGreaterThan(0);
  });

  it("keeps the prototype biography section present when article data is unavailable", () => {
    render(<BiographyPrototypeSection articles={[]} />);

    expect(
      screen.getByTestId("prototype-biography-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("prototype-biography-empty")).toHaveTextContent(
      "Biography articles are unavailable."
    );
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveAttribute(
      "href",
      "/biography"
    );
  });

  it("renders the prototype blog section with real blog links and guide text excluded", () => {
    render(
      <BlogPrototypeSection
        blogs={[
          createBlog("lead-story", "Lead Story", "Lead blog subtitle"),
          createBlog("studio-note", "Studio Note"),
          createBlog("archive-note", "Archive Note"),
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Lead Story" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(screen.getByRole("link", { name: /Lead Story/i })).toHaveAttribute(
      "href",
      "/blog/lead-story"
    );
    expect(screen.getByRole("link", { name: /Studio Note/i })).toHaveAttribute(
      "href",
      "/blog/studio-note"
    );
    expect(
      screen.queryByText(/grandfather's story/i)
    ).not.toBeInTheDocument();
  });

  it("keeps the prototype blog section present when blog data is unavailable", () => {
    render(<BlogPrototypeSection blogs={[]} />);

    expect(screen.getByTestId("prototype-blog-section")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Latest blog posts" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read more/i })).toHaveAttribute(
      "href",
      "/blog"
    );
  });

  it("renders the prototype shop section with product links and enquiry-safe copy", () => {
    render(
      <ShopPrototypeSection
        products={[
          createProduct("yellow-composition", "Yellow Composition"),
          createProduct("orange-form", "Orange Form", {
            productType: "print",
            price: "6500.00",
            image: null,
          }),
        ]}
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Available now" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View full shop/i })
    ).toHaveAttribute("href", "/shop/products");
    expect(
      screen.getByRole("link", { name: /Yellow Composition/i })
    ).toHaveAttribute("href", "/shop/products/yellow-composition");
    expect(screen.getByText("€18,000")).toBeInTheDocument();
    expect(screen.getByText("Image pending")).toBeInTheDocument();
    expect(
      screen.queryByText(/cart|checkout|shipping|refund|payment/i)
    ).not.toBeInTheDocument();
  });

  it("keeps the prototype shop section present when products are unavailable", () => {
    render(<ShopPrototypeSection products={[]} hasLoadError />);

    expect(screen.getByTestId("prototype-shop-section")).toBeInTheDocument();
    expect(screen.getByTestId("prototype-shop-empty-state")).toHaveTextContent(
      "Shop preview unavailable"
    );
    expect(
      screen.getByRole("link", { name: /View shop page/i })
    ).toHaveAttribute("href", "/shop/products");
  });

  it("keeps prototype files out of the live homepage layout path", () => {
    const combinedSource = [
      "src/app/prototype/home/page.tsx",
      "src/components/prototypes/home/HomePrototype.tsx",
      "src/components/prototypes/home/BiographyPrototypeSection.tsx",
      "src/components/prototypes/home/BiographyPrototypeLoader.tsx",
      "src/components/prototypes/home/BlogPrototypeSection.tsx",
      "src/components/prototypes/home/BlogPrototypeLoader.tsx",
      "src/components/prototypes/home/ShopPrototypeSection.tsx",
      "src/components/prototypes/home/ShopPrototypeLoader.tsx",
      "src/components/prototypes/home/PrototypeSectionPlaceholder.tsx",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(combinedSource).not.toContain("@/components/views/Home");
    expect(combinedSource).not.toContain("ContentLayout");
    expect(combinedSource).not.toContain("src/app/page.tsx");
  });
});

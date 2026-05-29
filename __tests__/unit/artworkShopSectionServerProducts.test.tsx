import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import ArtworkShopSection from "@/components/modules/cards/ArtworkShopSection";
import type { ArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";
import type { SimpleProduct } from "@/lib/data/types/shopify";

const createProduct = (
  title: string,
  handle: string,
  price: string
): SimpleProduct => ({
  id: `gid://shopify/Product/${handle}`,
  handle,
  title,
  description: "A product used by the artwork shop section test.",
  descriptionHtml: "<p>A product used by the artwork shop section test.</p>",
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: [],
  price,
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
});

const artwork = {
  title: "Linked Artwork",
  shopifyProducts: [
    { productId: "101", type: "original" },
    { productId: "102", type: "print" },
    { productId: "103", type: "print" },
    { productId: "104", type: "book" },
  ],
} as never;

const shopProducts: ArtworkShopProducts = {
  original: createProduct("Original Product", "original-product", "1200.00"),
  prints: [
    createProduct("Small Print", "small-print", "25.00"),
    createProduct("Large Print", "large-print", "60.00"),
  ],
  books: [createProduct("Archive Book", "archive-book", "35.00")],
};

describe("ArtworkShopSection server-provided products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders grouped product summaries without client-side product fetches", () => {
    render(
      <ArtworkShopSection artwork={artwork} shopProducts={shopProducts} />
    );

    expect(screen.getByText("Available for Purchase")).toBeInTheDocument();
    expect(screen.getByText("Original Artwork")).toBeInTheDocument();
    expect(screen.getByText("GBP 1200.00")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/shop/products/original-product"
    );

    expect(screen.getByText("Prints (2)")).toBeInTheDocument();
    expect(screen.getByText("From GBP 25")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Small Print - GBP 25.00" })
    ).toHaveAttribute("href", "/shop/products/small-print");
    expect(
      screen.getByRole("link", { name: "Large Print - GBP 60.00" })
    ).toHaveAttribute("href", "/shop/products/large-print");

    expect(screen.getByText("Featured in Books")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Archive Book/ })).toHaveAttribute(
      "href",
      "/shop/products/archive-book"
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("preserves the empty no-product behavior when the artwork has no Shopify links", () => {
    const { container } = render(
      <ArtworkShopSection
        artwork={{ title: "Unlinked Artwork", shopifyProducts: [] } as never}
        shopProducts={shopProducts}
      />
    );

    expect(container).toBeEmptyDOMElement();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not render purchase affordances when linked products were all skipped server-side", () => {
    const { container } = render(
      <ArtworkShopSection
        artwork={artwork}
        shopProducts={{ original: null, prints: [], books: [] }}
      />
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("Available for Purchase")).not.toBeInTheDocument();
    expect(screen.queryByText("Original Available")).not.toBeInTheDocument();
    expect(screen.queryByText("Prints Available")).not.toBeInTheDocument();
    expect(screen.queryByText("Featured in Books")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not contain the retired browser product fetch path", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/modules/cards/ArtworkShopSection.tsx"
      ),
      "utf8"
    );

    expect(source).not.toMatch(/useEffect|useState|fetch\(/);
    expect(source).not.toContain("/api/v2/public/shop/products");
  });
});

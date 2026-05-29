import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ShopProductGallery } from "@/components/compositions/ShopProductGallery";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopSortOption } from "@/lib/data/options/shopSortOptions";

jest.mock("@/components/modules/cards/ProductCard", () => ({
  ProductCard: ({ product }: { product: SimpleProduct }) => (
    <article data-testid="product-card">{product.title}</article>
  ),
  ProductCardSkeleton: () => <article data-testid="product-card-skeleton" />,
}));

jest.mock("@/components/modules/filters/ShopFilters", () => ({
  __esModule: true,
  default: ({
    onFilterChange,
  }: {
    onFilterChange: (filters: { showPrints: boolean }) => void;
  }) => (
    <button type="button" onClick={() => onFilterChange({ showPrints: false })}>
      filter prints
    </button>
  ),
}));

jest.mock("@/components/modules/filters/ShopResultsBar", () => ({
  __esModule: true,
  default: ({
    onSortChange,
  }: {
    onSortChange: (sortBy: ShopSortOption) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onSortChange("price-low")}>
        price-low
      </button>
      <button type="button" onClick={() => onSortChange("price-high")}>
        price-high
      </button>
      <button type="button" onClick={() => onSortChange("title-asc")}>
        title-asc
      </button>
      <button type="button" onClick={() => onSortChange("title-desc")}>
        title-desc
      </button>
    </div>
  ),
}));

const createProduct = (
  title: string,
  productType: string,
  price: string
): SimpleProduct => ({
  id: `gid://shopify/Product/${title}`,
  handle: title.toLowerCase().replace(/\s+/g, "-"),
  title,
  description: "A product used by gallery sorting tests.",
  descriptionHtml: "<p>A product used by gallery sorting tests.</p>",
  vendor: "Joseph Laoutaris",
  productType,
  tags: [],
  price,
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
});

const products: SimpleProduct[] = [
  createProduct("Bookish Unknown", "", "30.00"),
  createProduct("A Title Print", "Limited Edition Print", "10.00"),
  createProduct("C Title Original", "Original Artwork", "20.00"),
  createProduct("B Title Book", " BOOK ", "40.00"),
];

const typeSortedProducts: SimpleProduct[] = [
  products[3],
  products[2],
  products[1],
  products[0],
];

const priceLowProducts: SimpleProduct[] = [
  products[1],
  products[2],
  products[0],
  products[3],
];

const priceHighProducts: SimpleProduct[] = [
  products[3],
  products[0],
  products[2],
  products[1],
];

const titleAscProducts: SimpleProduct[] = [
  products[1],
  products[3],
  products[0],
  products[2],
];

const titleDescProducts: SimpleProduct[] = [
  products[2],
  products[0],
  products[3],
  products[1],
];

const manyProducts: SimpleProduct[] = Array.from({ length: 14 }, (_, index) =>
  createProduct(
    `Product ${String(index + 1).padStart(2, "0")}`,
    "Fine Art Print",
    String(index + 1)
  )
);

const renderedProductTitles = () =>
  screen.getAllByTestId("product-card").map((card) => card.textContent);

describe("ShopProductGallery sorting", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let intersectionCallback: IntersectionObserverCallback | null;

  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
    window.history.replaceState(null, "", "/shop/products");
    intersectionCallback = null;
    global.IntersectionObserver = jest.fn((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: jest.fn(() => []),
        root: null,
        rootMargin: "",
        thresholds: [],
      };
    }) as unknown as typeof IntersectionObserver;
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("renders the initial server-sorted type view without reordering by title text", () => {
    render(<ShopProductGallery initialProducts={typeSortedProducts} />);

    expect(renderedProductTitles()).toEqual([
      "B Title Book",
      "C Title Original",
      "A Title Print",
      "Bookish Unknown",
    ]);
  });

  it("preserves the initial server order for unknown product types", () => {
    render(<ShopProductGallery initialProducts={typeSortedProducts} />);

    const titles = renderedProductTitles();
    expect(titles[titles.length - 1]).toBe("Bookish Unknown");
  });

  it("fetches route-backed price sorting modes", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: priceLowProducts,
          metadata: { page: 1, limit: 12, total: 4, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: priceHighProducts,
          metadata: { page: 1, limit: 12, total: 4, totalPages: 1 },
        }),
      });

    render(<ShopProductGallery initialProducts={typeSortedProducts} />);

    fireEvent.click(screen.getByRole("button", { name: "price-low" }));
    expect(window.location.search).toBe("?sortBy=price-low");
    await waitFor(() =>
      expect(renderedProductTitles()).toEqual([
        "A Title Print",
        "C Title Original",
        "Bookish Unknown",
        "B Title Book",
      ])
    );

    fireEvent.click(screen.getByRole("button", { name: "price-high" }));
    expect(window.location.search).toBe("?sortBy=price-high");
    await waitFor(() =>
      expect(renderedProductTitles()).toEqual([
        "B Title Book",
        "Bookish Unknown",
        "C Title Original",
        "A Title Print",
      ])
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "/api/v2/public/shop/products?sortBy=price-low&page=1&limit=12"
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "/api/v2/public/shop/products?sortBy=price-high&page=1&limit=12"
    );
  });

  it("fetches route-backed title sorting modes", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: titleAscProducts,
          metadata: { page: 1, limit: 12, total: 4, totalPages: 1 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: titleDescProducts,
          metadata: { page: 1, limit: 12, total: 4, totalPages: 1 },
        }),
      });

    render(<ShopProductGallery initialProducts={typeSortedProducts} />);

    fireEvent.click(screen.getByRole("button", { name: "title-asc" }));
    expect(window.location.search).toBe("?sortBy=title-asc");
    await waitFor(() =>
      expect(renderedProductTitles()).toEqual([
        "A Title Print",
        "B Title Book",
        "Bookish Unknown",
        "C Title Original",
      ])
    );

    fireEvent.click(screen.getByRole("button", { name: "title-desc" }));
    expect(window.location.search).toBe("?sortBy=title-desc");
    await waitFor(() =>
      expect(renderedProductTitles()).toEqual([
        "C Title Original",
        "Bookish Unknown",
        "B Title Book",
        "A Title Print",
      ])
    );
  });

  it("honors an initial route sort option", () => {
    render(
      <ShopProductGallery
        initialProducts={priceLowProducts}
        initialFilters={{ sortBy: "price-low" }}
      />
    );

    expect(renderedProductTitles()).toEqual([
      "A Title Print",
      "C Title Original",
      "Bookish Unknown",
      "B Title Book",
    ]);
  });

  it("shows filter failures, preserves products, and clears after retry", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [createProduct("Recovered Print", "Print", "15.00")],
        }),
      });

    render(<ShopProductGallery initialProducts={typeSortedProducts} />);

    fireEvent.click(screen.getByRole("button", { name: "filter prints" }));

    expect(
      screen.getByRole("status", { name: "Updating product results" })
    ).toHaveTextContent("Updating products");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v2/public/shop/products?showPrints=false&page=1&limit=12"
    );
    expect(screen.getAllByTestId("product-card-skeleton")).toHaveLength(6);
    expect(window.location.search).toBe("?showPrints=false");

    await waitFor(() =>
      expect(
        screen.queryByRole("status", { name: "Updating product results" })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to update product filters"
    );
    expect(renderedProductTitles()).toEqual([
      "B Title Book",
      "C Title Original",
      "A Title Print",
      "Bookish Unknown",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Retry filters" }));

    await waitFor(() =>
      expect(screen.getByText("Recovered Print")).toBeInTheDocument()
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(renderedProductTitles()).toEqual(["Recovered Print"]);
  });

  it("includes the active route sort when fetching filtered products", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [createProduct("Filtered Original", "Original Artwork", "25.00")],
      }),
    });

    render(<ShopProductGallery initialProducts={typeSortedProducts} />);

    fireEvent.click(screen.getByRole("button", { name: "price-high" }));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v2/public/shop/products?sortBy=price-high&page=1&limit=12"
      )
    );
    fireEvent.click(screen.getByRole("button", { name: "filter prints" }));

    await waitFor(() =>
      expect(screen.getByText("Filtered Original")).toBeInTheDocument()
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v2/public/shop/products?sortBy=price-high&showPrints=false&page=1&limit=12"
    );
    expect(window.location.search).toBe("?sortBy=price-high&showPrints=false");
  });

  it("loads the next product page with infinite scroll", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: manyProducts.slice(12),
        metadata: { page: 2, limit: 12, total: 14, totalPages: 2 },
      }),
    });

    render(
      <ShopProductGallery
        initialProducts={manyProducts.slice(0, 12)}
        initialPaginationMetadata={{
          page: 1,
          limit: 12,
          total: 14,
          totalPages: 2,
        }}
      />
    );

    expect(screen.getAllByTestId("product-card")).toHaveLength(12);

    await act(async () => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    await waitFor(() =>
      expect(screen.getAllByTestId("product-card")).toHaveLength(14)
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v2/public/shop/products?page=2&limit=12"
    );
    expect(
      screen.queryByRole("button", { name: /Show more/ })
    ).not.toBeInTheDocument();
  });
});

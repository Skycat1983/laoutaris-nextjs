import ProductPage from "@/app/shop/products/[productHandle]/page";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { render, screen } from "@testing-library/react";

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductByHandle: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const mockGetProductByHandle = getProductByHandle as jest.MockedFunction<
  typeof getProductByHandle
>;
const mockGetArtworkById = getArtworkById as jest.MockedFunction<
  typeof getArtworkById
>;

const validArtworkId = "507f1f77bcf86cd799439011";
const secondArtworkId = "507f1f77bcf86cd799439012";

const createProduct = (overrides: Partial<SimpleProduct> = {}): SimpleProduct => ({
  id: "gid://shopify/Product/123456",
  handle: "test-product",
  title: "Test Product",
  description: "A product used by the page test.",
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  ...overrides,
});

const createArtwork = (id: string) =>
  ({
    _id: id,
    title: `Artwork ${id}`,
    decade: "1970s",
    image: {
      secure_url: "https://example.com/artwork.jpg",
    },
  } as never);

describe("/shop/products/[productHandle]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves a linked original artwork through the server data service without same-app artwork fetches", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({ mongodbArtworkId: validArtworkId })
    );
    mockGetArtworkById.mockResolvedValue(createArtwork(validArtworkId));

    await expect(
      ProductPage({ params: { productHandle: "test-product" } })
    ).resolves.toBeTruthy();

    expect(mockGetProductByHandle).toHaveBeenCalledWith("test-product");
    expect(mockGetArtworkById).toHaveBeenCalledWith(validArtworkId);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders a safe contact handoff for available products instead of Add to Cart", async () => {
    mockGetProductByHandle.mockResolvedValue(createProduct());

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Enquire About This Product" })
    ).toHaveAttribute("href", "/project/contact?product=test-product");
    expect(
      screen.getByText(
        "Contact the archive team to confirm availability and purchase details."
      )
    ).toBeInTheDocument();
  });

  it("renders unavailable product status without a purchase or contact CTA", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({ availableForSale: false })
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Enquire About This Product" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Currently Unavailable")).toBeInTheDocument();
    expect(
      screen.getByText("This product cannot currently be purchased.")
    ).toBeInTheDocument();
  });

  it("ignores missing or invalid book artwork IDs without using same-app artwork fetches", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        featuredArtworkIds: [validArtworkId, "not-an-object-id", secondArtworkId],
      })
    );
    mockGetArtworkById.mockImplementation(async (artworkId) => {
      return artworkId === validArtworkId ? createArtwork(validArtworkId) : null;
    });

    await expect(
      ProductPage({ params: { productHandle: "test-book" } })
    ).resolves.toBeTruthy();

    expect(mockGetArtworkById).toHaveBeenCalledTimes(3);
    expect(mockGetArtworkById).toHaveBeenCalledWith(validArtworkId);
    expect(mockGetArtworkById).toHaveBeenCalledWith("not-an-object-id");
    expect(mockGetArtworkById).toHaveBeenCalledWith(secondArtworkId);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

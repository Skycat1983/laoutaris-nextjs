/* eslint-disable @next/next/no-img-element */
import ProductPage from "@/app/shop/products/[productHandle]/page";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/components/metadata/PublicDetailJsonLd", () => ({
  ProductStructuredData: jest.fn(() => null),
}));

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductByHandle: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    ...props
  }: Record<string, unknown>) => (
    <img src={String(src)} alt={String(alt)} {...props} />
  ),
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
  descriptionHtml: "<p>A product used by the page test.</p>",
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
  ...overrides,
});

const createArtwork = (id: string) =>
  ({
    _id: id,
    title: `Artwork ${id}`,
    decade: "1970s",
    image: {
      secure_url: "https://example.com/artwork.jpg",
      pixelWidth: 1200,
      pixelHeight: 900,
    },
  } as never);

describe("/shop/products/[productHandle]", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
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

  it("logs linked artwork failures through structured server logging while rendering the product", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({ mongodbArtworkId: validArtworkId })
    );
    mockGetArtworkById.mockRejectedValue(new Error("private artwork failure"));

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view full artwork details/i })
    ).not.toBeInTheDocument();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "page.public.shop_product.linked_artwork_failed",
        route: "/shop/products/[productHandle]",
        operation: "public.shop_product.linked_artwork",
        productHandle: "test-product",
        error: {
          name: "Error",
          message: "private artwork failure",
        },
      })
    );
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

  it("renders the framed preview launcher for available print products with linked artwork metrics", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        productType: "print",
        mongodbArtworkId: validArtworkId,
      })
    );
    mockGetArtworkById.mockResolvedValue(createArtwork(validArtworkId));

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(
      screen.getByRole("link", { name: "Enquire About This Product" })
    ).toHaveAttribute("href", "/project/contact?product=test-product");

    fireEvent.click(
      screen.getByRole("button", { name: "Preview Frame Options" })
    );

    expect(
      screen.getByRole("dialog", { name: "Frame Preview" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("figure", {
        name: `Framed preview of Artwork ${validArtworkId}`,
      })
    ).toHaveAttribute("data-frame-profile-id", "black-wood-thin");
    expect(
      screen.getByRole("img", { name: `Artwork ${validArtworkId}` })
    ).toHaveAttribute("src", "https://example.com/artwork.jpg");
  });

  it.each([
    {
      name: "original products",
      product: createProduct({
        productType: "original",
        mongodbArtworkId: validArtworkId,
      }),
      artwork: createArtwork(validArtworkId),
    },
    {
      name: "unlinked print products",
      product: createProduct({
        productType: "print",
        mongodbArtworkId: undefined,
      }),
      artwork: null,
    },
    {
      name: "unavailable print products",
      product: createProduct({
        productType: "print",
        availableForSale: false,
        mongodbArtworkId: validArtworkId,
      }),
      artwork: createArtwork(validArtworkId),
    },
    {
      name: "print products with invalid linked artwork image metrics",
      product: createProduct({
        productType: "print",
        mongodbArtworkId: validArtworkId,
      }),
      artwork: {
        ...createArtwork(validArtworkId),
        image: {
          secure_url: "https://example.com/artwork.jpg",
          pixelWidth: 0,
          pixelHeight: 900,
        },
      },
    },
    {
      name: "book products",
      product: createProduct({
        productType: "book",
        featuredArtworkIds: [validArtworkId],
      }),
      artwork: createArtwork(validArtworkId),
    },
  ])("hides the framed preview launcher for $name", async ({ product, artwork }) => {
    mockGetProductByHandle.mockResolvedValue(product);
    mockGetArtworkById.mockResolvedValue(artwork as never);

    render(await ProductPage({ params: { productHandle: product.handle } }));

    expect(
      screen.queryByRole("button", { name: "Preview Frame Options" })
    ).not.toBeInTheDocument();
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

/* eslint-disable @next/next/no-img-element */
import ProductPage from "@/app/shop/products/[productHandle]/page";
import ShopProductNotFound from "@/app/shop/products/[productHandle]/not-found";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { SimpleProduct } from "@/lib/data/types/shopify";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import { notFound } from "next/navigation";
import { fireEvent, render, screen, within } from "@testing-library/react";

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
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

const validArtworkId = "507f1f77bcf86cd799439011";
const secondArtworkId = "507f1f77bcf86cd799439012";
type LinkedArtworkFixture = {
  _id: string;
  title: string;
  decade: ArtworkFrontend["decade"];
  medium: string;
  surface: string;
  image: {
    secure_url: string;
    pixelWidth: number;
    pixelHeight: number;
  };
};

const createProduct = (overrides: Partial<SimpleProduct> = {}): SimpleProduct => ({
  id: "gid://shopify/Product/123456",
  handle: "test-product",
  title: "Test Product",
  description: "A product used by the page test.",
  descriptionHtml: "<p>A product used by the page test.</p>",
  onlineStoreUrl: null,
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

const createArtwork = (id: string): LinkedArtworkFixture => ({
  _id: id,
  title: `Artwork ${id}`,
  decade: "1970s",
  medium: "paint",
  surface: "canvas",
  image: {
    secure_url: "https://example.com/artwork.jpg",
    pixelWidth: 1200,
    pixelHeight: 900,
  },
});

const asArtworkResult = (
  artwork: LinkedArtworkFixture | null
): ArtworkFrontend | null => artwork as ArtworkFrontend | null;

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

  it("calls notFound for missing primary Shopify products without same-app HTTP", async () => {
    mockGetProductByHandle.mockResolvedValue(null);

    await expect(
      ProductPage({ params: { productHandle: "missing-product" } })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockGetProductByHandle).toHaveBeenCalledWith("missing-product");
    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockGetArtworkById).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("uses shared public presentation for the route-local product not-found view", () => {
    render(<ShopProductNotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Product not found"
    );
    expect(screen.getByText("Not found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The product you are looking for is not available in the shop."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse shop" })).toHaveAttribute(
      "href",
      "/shop/products"
    );
  });

  it("resolves a linked original artwork through the server data service without same-app artwork fetches", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({ mongodbArtworkId: validArtworkId })
    );
    mockGetArtworkById.mockResolvedValue(
      asArtworkResult(createArtwork(validArtworkId))
    );

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

  it("renders an external Shopify purchase handoff for available products with a hosted URL", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        onlineStoreUrl:
          "https://laoutaris.myshopify.com/products/test-product",
      })
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    const purchaseLink = screen.getByRole("link", {
      name: "Purchase on Shopify",
    });

    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
    expect(purchaseLink).toHaveAttribute(
      "href",
      "https://laoutaris.myshopify.com/products/test-product"
    );
    expect(purchaseLink).toHaveAttribute("target", "_blank");
    expect(purchaseLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByText("Checkout is completed on Shopify.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Contact the archive team about this product",
      })
    ).toHaveAttribute("href", "/project/contact?product=test-product");
    expect(
      screen.queryByRole("link", { name: "Enquire About This Product" })
    ).not.toBeInTheDocument();
  });

  it("renders the contact enquiry fallback for available products without a hosted URL", async () => {
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
    expect(
      screen.queryByRole("link", { name: "Purchase on Shopify" })
    ).not.toBeInTheDocument();
  });

  it("renders the sale gallery with a raw artwork item before room previews for eligible print products", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        productType: "print",
        tags: ["limited-edition", "print"],
        mongodbArtworkId: validArtworkId,
      })
    );
    mockGetArtworkById.mockResolvedValue(
      asArtworkResult(createArtwork(validArtworkId))
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.getByTestId("shop-product-sale-gallery")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Enquire About This Product" })
    ).toHaveAttribute("href", "/project/contact?product=test-product");
    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Preview Frame Options" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Limited Edition Print")).toBeInTheDocument();
    expect(screen.getByText("Paint on canvas")).toBeInTheDocument();
    expect(screen.queryByText(/1200 x 900 cm/i)).not.toBeInTheDocument();

    const rawPreview = screen.getByTestId("shop-sale-main-raw-preview");

    expect(
      within(rawPreview).getByRole("img", { name: `Artwork ${validArtworkId}` })
    ).toHaveAttribute("src", "https://example.com/artwork.jpg");
    expect(
      within(rawPreview).queryByTestId("framed-preview-frame")
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: `Show raw artwork image for Artwork ${validArtworkId}`,
      })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", {
        name: `Show Modern Gallery room preview for Artwork ${validArtworkId}`,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Show Scandinavian White Wall room preview for Artwork ${validArtworkId}`,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Show Townhouse Study room preview for Artwork ${validArtworkId}`,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Show White Plaster Hallway room preview for Artwork ${validArtworkId}`,
      })
    ).toBeInTheDocument();
  });

  it("updates the selected room preview when frame and mat dropdowns change", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        productType: "print",
        mongodbArtworkId: validArtworkId,
      })
    );
    mockGetArtworkById.mockResolvedValue(
      asArtworkResult(createArtwork(validArtworkId))
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    fireEvent.click(
      screen.getByRole("button", {
        name: `Show Modern Gallery room preview for Artwork ${validArtworkId}`,
      })
    );

    const mainRoomPreview = screen.getByTestId("shop-sale-main-room-preview");

    expect(screen.getByTestId("shop-sale-main-viewport")).toHaveAttribute(
      "data-slide-direction",
      "forward"
    );
    expect(screen.getByTestId("shop-sale-main-viewport")).toHaveClass(
      "bg-transparent"
    );
    expect(screen.getByTestId("shop-sale-main-viewport")).not.toHaveClass(
      "bg-white"
    );
    expect(mainRoomPreview).toHaveClass("aspect-auto", "h-full", "w-full");
    expect(
      within(mainRoomPreview).getByRole("img", {
        name: "Modern white gallery-style living room wall background",
      })
    ).toBeInTheDocument();
    expect(
      within(mainRoomPreview).getByRole("figure", {
        name: `Framed preview of Artwork ${validArtworkId}`,
      })
    ).toHaveAttribute("data-frame-profile-id", "black-wood-thin");

    fireEvent.change(screen.getByLabelText("Frame"), {
      target: { value: "natural-oak-medium" },
    });
    fireEvent.change(screen.getByLabelText("Mat"), {
      target: { value: "gallery-white-wide" },
    });

    expect(
      within(mainRoomPreview).getByRole("figure", {
        name: `Framed preview of Artwork ${validArtworkId}`,
      })
    ).toHaveAttribute("data-frame-profile-id", "natural-oak-medium");
    expect(
      within(mainRoomPreview).getByRole("figure", {
        name: `Framed preview of Artwork ${validArtworkId}`,
      })
    ).toHaveAttribute("data-mat-profile-id", "gallery-white-wide");

    const thumbnail = screen.getByTestId(
      "shop-sale-room-thumbnail-modern-gallery"
    );

    expect(thumbnail).toHaveClass("aspect-auto", "h-full", "w-full");
    expect(
      within(thumbnail).getByRole("figure", {
        name: `Framed preview of Artwork ${validArtworkId}`,
      })
    ).toHaveAttribute("data-frame-profile-id", "natural-oak-medium");

    fireEvent.click(
      screen.getByRole("button", {
        name: `Show raw artwork image for Artwork ${validArtworkId}`,
      })
    );

    const rawPreview = screen.getByTestId("shop-sale-main-raw-preview");

    expect(screen.getByTestId("shop-sale-main-viewport")).toHaveAttribute(
      "data-slide-direction",
      "backward"
    );
    expect(
      within(rawPreview).getByRole("img", { name: `Artwork ${validArtworkId}` })
    ).toHaveAttribute("src", "https://example.com/artwork.jpg");
    expect(
      within(rawPreview).queryByTestId("framed-preview-frame")
    ).not.toBeInTheDocument();
  });

  it("preserves the hosted Shopify purchase boundary inside the sale gallery", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        productType: "print",
        mongodbArtworkId: validArtworkId,
        onlineStoreUrl:
          "https://laoutaris.myshopify.com/products/test-product",
      })
    );
    mockGetArtworkById.mockResolvedValue(
      asArtworkResult(createArtwork(validArtworkId))
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    const purchaseLink = screen.getByRole("link", {
      name: "Purchase on Shopify",
    });

    expect(screen.getByTestId("shop-product-sale-gallery")).toBeInTheDocument();
    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
    expect(purchaseLink).toHaveAttribute(
      "href",
      "https://laoutaris.myshopify.com/products/test-product"
    );
    expect(purchaseLink).toHaveAttribute("target", "_blank");
    expect(purchaseLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByText("Checkout is completed on Shopify.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Contact the archive team about this product",
      })
    ).toHaveAttribute("href", "/project/contact?product=test-product");
  });

  it("uses the sale gallery for unlinked print products with Shopify image metrics", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        handle: "joseph-laoutaris-fine-art-print-no-139",
        title: "No.034, Limited Edition Print",
        description: "Museum-grade giclee print on heavyweight paper.",
        productType: "",
        tags: [],
        mongodbArtworkId: undefined,
        image: {
          url: "https://example.com/shopify-print.jpg",
          altText: "Shopify print image",
          width: 1400,
          height: 1000,
        },
      })
    );

    render(
      await ProductPage({
        params: {
          productHandle: "joseph-laoutaris-fine-art-print-no-139",
        },
      })
    );

    expect(screen.getByTestId("shop-product-sale-gallery")).toBeInTheDocument();
    expect(mockGetArtworkById).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { level: 1, name: "No.034" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 1,
        name: "No.034, Limited Edition Print",
      })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Limited Edition Print")).toBeInTheDocument();
    expect(screen.getByText("Fine art print")).toBeInTheDocument();
    expect(screen.getByLabelText("Frame")).toBeInTheDocument();
    expect(screen.getByLabelText("Mat")).toBeInTheDocument();

    const rawPreview = screen.getByTestId("shop-sale-main-raw-preview");

    expect(
      within(rawPreview).getByRole("img", { name: "Shopify print image" })
    ).toHaveAttribute("src", "https://example.com/shopify-print.jpg");
    expect(
      screen.getByRole("button", {
        name: "Show Modern Gallery room preview for Shopify print image",
      })
    ).toBeInTheDocument();
  });

  it("uses the sale gallery for linked original products with room previews but no print frame controls", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        productType: "original",
        mongodbArtworkId: validArtworkId,
      })
    );
    mockGetArtworkById.mockResolvedValue(
      asArtworkResult(createArtwork(validArtworkId))
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.getByTestId("shop-product-sale-gallery")).toBeInTheDocument();
    expect(screen.getByText("Original Artwork")).toBeInTheDocument();
    expect(screen.getByText("Paint on canvas")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View archive record" })
    ).toHaveAttribute("href", `/artwork/${validArtworkId}`);
    expect(screen.queryByLabelText("Frame")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Show Modern Gallery room preview for Artwork ${validArtworkId}`,
      })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: `Show Modern Gallery room preview for Artwork ${validArtworkId}`,
      })
    );

    expect(screen.getByTestId("shop-sale-main-room-preview")).toBeInTheDocument();
  });

  it("uses the sale gallery for book products while keeping featured artworks below", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        productType: "book",
        title: "Archive Book",
        featuredArtworkIds: [validArtworkId],
        image: {
          url: "https://example.com/book.jpg",
          altText: "Book cover",
          width: 900,
          height: 1200,
        },
        images: [
          {
            url: "https://example.com/book.jpg",
            altText: "Book cover",
            width: 900,
            height: 1200,
          },
          {
            url: "https://example.com/book-page-2.jpg",
            altText: "Book page 2",
            width: 900,
            height: 1200,
          },
        ],
      })
    );
    mockGetArtworkById.mockResolvedValue(
      asArtworkResult({
        ...createArtwork(validArtworkId),
        title: "No.026, Limited Edition Print",
      })
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.getByTestId("shop-product-sale-gallery")).toBeInTheDocument();
    expect(screen.getByText("Publication")).toBeInTheDocument();
    expect(screen.queryByLabelText("Frame")).not.toBeInTheDocument();
    expect(screen.getByText("No.026")).toBeInTheDocument();
    expect(
      screen.queryByText("No.026, Limited Edition Print")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Show Modern Gallery room preview for Book cover",
      })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Features 1 Artworks")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("shop-sale-current-visual")).getByRole("img", {
        name: "Book cover",
      })
    ).toHaveAttribute("src", "https://example.com/book.jpg");

    fireEvent.click(screen.getByRole("button", { name: "Show Book page 2" }));

    expect(screen.getByTestId("shop-sale-main-viewport")).toHaveAttribute(
      "data-slide-direction",
      "forward"
    );
    expect(
      within(screen.getByTestId("shop-sale-current-visual")).getByRole("img", {
        name: "Book page 2",
      })
    ).toHaveAttribute("src", "https://example.com/book-page-2.jpg");
  });

  it("keeps the sale gallery graceful when no preview image has usable dimensions", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({
        productType: "print",
        mongodbArtworkId: validArtworkId,
      })
    );
    mockGetArtworkById.mockResolvedValue(
      asArtworkResult({
        ...createArtwork(validArtworkId),
        image: {
          secure_url: "https://example.com/artwork.jpg",
          pixelWidth: 0,
          pixelHeight: 900,
        },
      })
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.getByTestId("shop-product-sale-gallery")).toBeInTheDocument();
    expect(screen.getByTestId("shop-sale-main-empty-preview")).toHaveTextContent(
      "No image available"
    );
    expect(screen.queryByLabelText("Frame")).not.toBeInTheDocument();
  });

  it("renders unavailable product status without a purchase or contact CTA", async () => {
    mockGetProductByHandle.mockResolvedValue(
      createProduct({ availableForSale: false })
    );

    render(await ProductPage({ params: { productHandle: "test-product" } }));

    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Purchase on Shopify" })
    ).not.toBeInTheDocument();
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
      return artworkId === validArtworkId
        ? asArtworkResult(createArtwork(validArtworkId))
        : null;
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

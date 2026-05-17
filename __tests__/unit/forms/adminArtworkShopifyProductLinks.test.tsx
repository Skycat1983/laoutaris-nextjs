import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CreateArtworkForm } from "@/components/features/adminDashboard/crudForms/create/CreateArtworkForm";
import { UpdateArtworkForm } from "@/components/features/adminDashboard/crudForms/update/UpdateArtworkForm";
import { clientApi } from "@/lib/api/clientApi";
import { clientPublicApi } from "@/lib/api/public/clientPublicApi";
import {
  artworkFormSchema,
  updateArtworkSchema,
} from "@/lib/data/schemas/artworkSchema";
import type { SimpleProduct } from "@/lib/data/types/shopify";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    className?: string;
  }) {
    const React = require("react");
    return React.createElement("img", props);
  },
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    admin: {
      create: {
        artwork: jest.fn(),
      },
      update: {
        patchArtwork: jest.fn(),
      },
    },
  },
}));

jest.mock("@/lib/api/public/clientPublicApi", () => ({
  clientPublicApi: {
    shop: {
      productById: jest.fn(),
    },
  },
}));

const mockCreateArtwork = clientApi.admin.create.artwork as jest.Mock;
const mockPatchArtwork = clientApi.admin.update.patchArtwork as jest.Mock;
const mockProductById = clientPublicApi.shop.productById as jest.Mock;

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const validImage = {
  secure_url: "https://example.com/artwork.jpg",
  public_id: "artwork/public-id",
  bytes: 123456,
  pixelHeight: 1200,
  pixelWidth: 900,
  format: "jpg",
  hexColors: [{ color: "#111111", percentage: 42 }],
  predominantColors: {
    cloudinary: [{ color: "#111111", percentage: 42 }],
    google: [{ color: "#222222", percentage: 58 }],
  },
};

const baseArtworkFormValues = {
  title: "Archive Work",
  decade: "1980s",
  artstyle: "abstract",
  medium: "oil",
  surface: "canvas",
  featured: false,
};

const artworkId = "507f1f77bcf86cd799439012";

const existingArtwork = {
  _id: artworkId,
  ...baseArtworkFormValues,
  image: validImage,
  shopifyProducts: [
    { productId: "10538938761480", type: "original" },
    { productId: "10538937319688", type: "book" },
  ],
} as never;

const shopifyProduct: SimpleProduct = {
  id: "gid://shopify/Product/10538938761480",
  handle: "verified-original",
  title: "Verified Original",
  description: "Verified product description.",
  descriptionHtml: "<p>Verified product description.</p>",
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
};

describe("admin artwork Shopify product-link form schema", () => {
  it("defaults missing Shopify product links to an empty array", () => {
    const parsed = artworkFormSchema.parse(baseArtworkFormValues);

    expect(parsed.shopifyProducts).toEqual([]);
  });

  it("trims numeric Shopify product IDs and preserves allowed types", () => {
    const parsed = artworkFormSchema.parse({
      ...baseArtworkFormValues,
      shopifyProducts: [{ productId: " 10538938761480 ", type: "print" }],
    });

    expect(parsed.shopifyProducts).toEqual([
      { productId: "10538938761480", type: "print" },
    ]);
  });

  it("rejects malformed product IDs, unknown types, and duplicate IDs", () => {
    expect(
      artworkFormSchema.safeParse({
        ...baseArtworkFormValues,
        shopifyProducts: [{ productId: "gid://shopify/Product/123", type: "book" }],
      }).success
    ).toBe(false);
    expect(
      artworkFormSchema.safeParse({
        ...baseArtworkFormValues,
        shopifyProducts: [{ productId: "123", type: "poster" }],
      }).success
    ).toBe(false);
    expect(
      artworkFormSchema.safeParse({
        ...baseArtworkFormValues,
        shopifyProducts: [
          { productId: "123", type: "original" },
          { productId: " 123 ", type: "book" },
        ],
      }).success
    ).toBe(false);
  });

  it("allows update form values to carry an explicit empty product-link array", () => {
    const parsed = updateArtworkSchema.parse({
      ...baseArtworkFormValues,
      shopifyProducts: [],
    });

    expect(parsed.shopifyProducts).toEqual([]);
  });
});

describe("admin artwork Shopify product-link forms", () => {
  beforeAll(() => {
    global.ResizeObserver = ResizeObserverMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateArtwork.mockResolvedValue({ success: true, data: {} });
    mockPatchArtwork.mockResolvedValue({ success: true, data: {} });
    mockProductById.mockResolvedValue({
      success: true,
      data: shopifyProduct,
    });
  });

  it("submits a trimmed Shopify product link from the create artwork form", async () => {
    const onSuccess = jest.fn();

    render(<CreateArtworkForm uploadInfo={validImage} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Archive Work" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Add Shopify product link" })
    );
    fireEvent.change(screen.getByLabelText("Shopify product ID 1"), {
      target: { value: " 10538938761480 " },
    });
    fireEvent.change(screen.getByLabelText("Shopify product type 1"), {
      target: { value: "book" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockCreateArtwork).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Archive Work",
          image: validImage,
          shopifyProducts: [
            { productId: "10538938761480", type: "book" },
          ],
        })
      );
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("blocks duplicate Shopify product IDs before the create API request", async () => {
    render(<CreateArtworkForm uploadInfo={validImage} onSuccess={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Archive Work" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Add Shopify product link" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Add Shopify product link" })
    );
    fireEvent.change(screen.getByLabelText("Shopify product ID 1"), {
      target: { value: "10538938761480" },
    });
    fireEvent.change(screen.getByLabelText("Shopify product ID 2"), {
      target: { value: " 10538938761480 " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText(
        "Shopify product IDs must be unique within an artwork"
      )
    ).toBeInTheDocument();
    expect(mockCreateArtwork).not.toHaveBeenCalled();
  });

  it("verifies a product link and shows returned Shopify context", async () => {
    let resolveProduct!: (value: {
      success: true;
      data: SimpleProduct;
    }) => void;
    mockProductById.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveProduct = resolve;
      })
    );

    render(<CreateArtworkForm uploadInfo={validImage} onSuccess={jest.fn()} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Add Shopify product link" })
    );
    fireEvent.change(screen.getByLabelText("Shopify product ID 1"), {
      target: { value: " 10538938761480 " },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Verify Shopify product link 1" })
    );

    expect(mockProductById).toHaveBeenCalledWith("10538938761480");
    expect(await screen.findAllByText("Checking")).not.toHaveLength(0);

    resolveProduct({
      success: true,
      data: shopifyProduct,
    });

    expect(
      await screen.findByText("Verified: Shopify product found")
    ).toBeInTheDocument();
    expect(screen.getByText("Verified Original")).toBeInTheDocument();
    expect(screen.getByText("verified-original")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("original")).toBeInTheDocument();
    expect(screen.getByText("GBP 100.00")).toBeInTheDocument();
  });

  it.each([
    ["", "Shopify product ID is required"],
    ["abc123", "Shopify product ID must be numeric"],
  ])(
    "shows local invalid verification for product ID %p without a network request",
    async (productId, expectedMessage) => {
      render(
        <CreateArtworkForm uploadInfo={validImage} onSuccess={jest.fn()} />
      );

      fireEvent.click(
        screen.getByRole("button", { name: "Add Shopify product link" })
      );
      fireEvent.change(screen.getByLabelText("Shopify product ID 1"), {
        target: { value: productId },
      });
      fireEvent.click(
        screen.getByRole("button", { name: "Verify Shopify product link 1" })
      );

      expect(
        await screen.findByText(`Invalid local input: ${expectedMessage}`)
      ).toBeInTheDocument();
      expect(mockProductById).not.toHaveBeenCalled();
    }
  );

  it("shows missing and upstream verification failures without blocking save", async () => {
    const onSuccess = jest.fn();
    mockProductById
      .mockResolvedValueOnce({
        success: false,
        error: "Product not found",
      })
      .mockResolvedValueOnce({
        success: false,
        error: "Failed to fetch product",
      });

    render(<CreateArtworkForm uploadInfo={validImage} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Archive Work" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Add Shopify product link" })
    );
    fireEvent.change(screen.getByLabelText("Shopify product ID 1"), {
      target: { value: "10538938761480" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Verify Shopify product link 1" })
    );
    expect(
      await screen.findByText("Not found: Product not found in Shopify")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Verify Shopify product link 1" })
    );
    expect(
      await screen.findByText(
        "Upstream error: Shopify verification is unavailable"
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockCreateArtwork).toHaveBeenCalledWith(
        expect.objectContaining({
          shopifyProducts: [
            { productId: "10538938761480", type: "original" },
          ],
        })
      );
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("resets stale verification when a checked row changes", async () => {
    render(<CreateArtworkForm uploadInfo={validImage} onSuccess={jest.fn()} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Add Shopify product link" })
    );
    fireEvent.change(screen.getByLabelText("Shopify product ID 1"), {
      target: { value: "10538938761480" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Verify Shopify product link 1" })
    );

    expect(
      await screen.findByText("Verified: Shopify product found")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Shopify product ID 1"), {
      target: { value: "10538937319688" },
    });

    expect(screen.getByText("Unchecked")).toBeInTheDocument();
    expect(
      screen.queryByText("Verified: Shopify product found")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Verified Original")).not.toBeInTheDocument();
  });

  it("initializes existing update links and can submit an empty replacement array", async () => {
    const onSuccess = jest.fn();

    render(
      <UpdateArtworkForm artworkInfo={existingArtwork} onSuccess={onSuccess} />
    );

    expect(screen.getByDisplayValue("10538938761480")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10538937319688")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Remove Shopify product link 1" })
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Remove Shopify product link 1" })
    );
    fireEvent.click(screen.getByRole("button", { name: "Update Artwork" }));

    await waitFor(() => {
      expect(mockPatchArtwork).toHaveBeenCalledWith(
        artworkId,
        expect.objectContaining({
          shopifyProducts: [],
        })
      );
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

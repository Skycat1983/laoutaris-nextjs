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

jest.setTimeout(15000);

let mockUploadResult: unknown;

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

jest.mock("@/components/elements/buttons/UploadButton", () => ({
  UploadButton: ({
    onUploadSuccess,
    label = "Upload an Image",
  }: {
    onUploadSuccess: (result: never) => void;
    label?: string;
  }) => {
    const React = require("react");
    return React.createElement(
      "button",
      {
        type: "button",
        onClick: () => onUploadSuccess(mockUploadResult as never),
      },
      label
    );
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

const replacementUploadInfo = {
  secure_url: "https://example.com/replacement.jpg",
  public_id: "artwork/replacement-id",
  bytes: 654321,
  height: 1400,
  width: 1000,
  format: "jpg",
  resource_type: "image",
  colors: [["#333333", 51]],
  predominant: {
    cloudinary: [["#333333", 51]],
    google: [["#444444", 49]],
  },
};

const replacementImage = {
  secure_url: replacementUploadInfo.secure_url,
  public_id: replacementUploadInfo.public_id,
  bytes: replacementUploadInfo.bytes,
  pixelHeight: replacementUploadInfo.height,
  pixelWidth: replacementUploadInfo.width,
  format: replacementUploadInfo.format,
  hexColors: [{ color: "#333333", percentage: 51 }],
  predominantColors: {
    cloudinary: [{ color: "#333333", percentage: 51 }],
    google: [{ color: "#444444", percentage: 49 }],
  },
};

const replacementUploadResult = {
  event: "success",
  info: replacementUploadInfo,
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
    { productId: "10538938761480", type: "original", publicListing: false },
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
      { productId: "10538938761480", type: "print", publicListing: true },
    ]);
  });

  it("preserves explicit non-public Shopify product links", () => {
    const parsed = artworkFormSchema.parse({
      ...baseArtworkFormValues,
      shopifyProducts: [
        {
          productId: "10538938761480",
          type: "original",
          publicListing: false,
        },
      ],
    });

    expect(parsed.shopifyProducts).toEqual([
      {
        productId: "10538938761480",
        type: "original",
        publicListing: false,
      },
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
    mockUploadResult = replacementUploadResult;
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
            {
              productId: "10538938761480",
              type: "book",
              publicListing: true,
            },
          ],
        })
      );
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("surfaces artwork create field errors without calling success", async () => {
    const onSuccess = jest.fn();
    mockCreateArtwork.mockResolvedValueOnce({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {
        title: ["An artwork with this title already exists"],
      },
      formErrors: [],
    });

    render(<CreateArtworkForm uploadInfo={validImage} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Archive Work" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("An artwork with this title already exists")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("surfaces artwork create product-link errors near the link controls", async () => {
    const onSuccess = jest.fn();
    mockCreateArtwork.mockResolvedValueOnce({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {
        shopifyProducts: ["Shopify product ID is already linked"],
      },
      formErrors: [],
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
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Shopify product ID is already linked")
    ).toBeInTheDocument();
    expect(screen.getByText("Shopify product links")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
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
            {
              productId: "10538938761480",
              type: "original",
              publicListing: true,
            },
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

  it("preserves existing non-public listing links from the update artwork form", async () => {
    const onSuccess = jest.fn();

    render(
      <UpdateArtworkForm artworkInfo={existingArtwork} onSuccess={onSuccess} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Update Artwork" }));

    await waitFor(() => {
      expect(mockPatchArtwork).toHaveBeenCalledWith(
        artworkId,
        expect.objectContaining({
          shopifyProducts: [
            {
              productId: "10538938761480",
              type: "original",
              publicListing: false,
            },
            {
              productId: "10538937319688",
              type: "book",
              publicListing: true,
            },
          ],
        })
      );
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("surfaces artwork update product-link errors without calling success", async () => {
    const onSuccess = jest.fn();
    mockPatchArtwork.mockResolvedValueOnce({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {
        shopifyProducts: ["Shopify product links must be unique"],
      },
      formErrors: [],
    });

    render(
      <UpdateArtworkForm artworkInfo={existingArtwork} onSuccess={onSuccess} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Update Artwork" }));

    expect(
      await screen.findByText("Shopify product links must be unique")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("surfaces artwork update form errors without calling success", async () => {
    const onSuccess = jest.fn();
    mockPatchArtwork.mockResolvedValueOnce({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {},
      formErrors: ["Artwork update could not be saved"],
    });

    render(
      <UpdateArtworkForm artworkInfo={existingArtwork} onSuccess={onSuccess} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Update Artwork" }));

    expect(
      await screen.findByText("Artwork update could not be saved")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("submits a transformed replacement image from the update artwork form", async () => {
    const onSuccess = jest.fn();

    render(
      <UpdateArtworkForm artworkInfo={existingArtwork} onSuccess={onSuccess} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Upload replacement image" })
    );

    expect(
      await screen.findByText("Replacement image ready")
    ).toBeInTheDocument();
    expect(screen.getByAltText("Artwork image")).toHaveAttribute(
      "src",
      replacementImage.secure_url
    );

    fireEvent.click(screen.getByRole("button", { name: "Update Artwork" }));

    await waitFor(() => {
      expect(mockPatchArtwork).toHaveBeenCalledWith(
        artworkId,
        expect.objectContaining({
          image: replacementImage,
          shopifyProducts: [
            {
              productId: "10538938761480",
              type: "original",
              publicListing: false,
            },
            {
              productId: "10538937319688",
              type: "book",
              publicListing: true,
            },
          ],
        })
      );
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("shows upload processing errors and omits the replacement image payload", async () => {
    const onSuccess = jest.fn();
    mockUploadResult = {
      event: "success",
      info: {
        secure_url: "https://example.com/broken.jpg",
        public_id: "artwork/broken-id",
      },
    };

    render(
      <UpdateArtworkForm artworkInfo={existingArtwork} onSuccess={onSuccess} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Upload replacement image" })
    );

    expect(
      await screen.findByText(
        "Image upload finished, but the result could not be processed. Please try another upload."
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Replacement image ready")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Update Artwork" }));

    await waitFor(() => {
      expect(mockPatchArtwork).toHaveBeenCalledTimes(1);
    });
    expect(mockPatchArtwork.mock.calls[0][1]).not.toHaveProperty("image");
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

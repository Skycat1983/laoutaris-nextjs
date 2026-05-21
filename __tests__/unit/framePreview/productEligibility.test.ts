import {
  buildFramedPrintPreviewArtwork,
  isFramePreviewEligibleProduct,
} from "@/lib/framePreview/productEligibility";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";

const createProduct = (
  overrides: Partial<SimpleProduct> = {}
): SimpleProduct => ({
  id: "gid://shopify/Product/123456",
  handle: "test-print",
  title: "Test Print",
  description: "A test product.",
  descriptionHtml: "<p>A test product.</p>",
  vendor: "Joseph Laoutaris",
  productType: "print",
  tags: ["archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
  mongodbArtworkId: "507f1f77bcf86cd799439011",
  ...overrides,
});

const createArtwork = (
  overrides: Partial<ArtworkFrontend> = {}
): ArtworkFrontend =>
  ({
    _id: "507f1f77bcf86cd799439011",
    title: "Linked Artwork",
    image: {
      secure_url: "https://example.com/linked-artwork.jpg",
      pixelWidth: 1200,
      pixelHeight: 900,
    },
    ...overrides,
  } as ArtworkFrontend);

describe("frame preview product eligibility", () => {
  it("allows available print products linked to a single artwork", () => {
    expect(isFramePreviewEligibleProduct(createProduct())).toBe(true);
    expect(
      isFramePreviewEligibleProduct(
        createProduct({
          productType: "Limited Edition Print",
          tags: [],
        })
      )
    ).toBe(true);
    expect(
      isFramePreviewEligibleProduct(
        createProduct({
          productType: "",
          tags: ["archive", "prints"],
        })
      )
    ).toBe(true);
  });

  it("rejects unavailable, unlinked, original, and book products", () => {
    expect(
      isFramePreviewEligibleProduct(
        createProduct({ availableForSale: false })
      )
    ).toBe(false);
    expect(
      isFramePreviewEligibleProduct(
        createProduct({ mongodbArtworkId: undefined })
      )
    ).toBe(false);
    expect(
      isFramePreviewEligibleProduct(createProduct({ productType: "original" }))
    ).toBe(false);
    expect(
      isFramePreviewEligibleProduct(
        createProduct({
          productType: "book",
          featuredArtworkIds: ["507f1f77bcf86cd799439012"],
        })
      )
    ).toBe(false);
  });

  it("builds a modal-ready artwork payload from linked artwork image metrics", () => {
    expect(
      buildFramedPrintPreviewArtwork(createProduct(), createArtwork())
    ).toEqual({
      src: "https://example.com/linked-artwork.jpg",
      alt: "Linked Artwork",
      metrics: {
        pixelWidth: 1200,
        pixelHeight: 900,
      },
    });
  });

  it("rejects missing linked artwork and invalid linked artwork image metrics", () => {
    expect(buildFramedPrintPreviewArtwork(createProduct(), null)).toBeNull();
    expect(
      buildFramedPrintPreviewArtwork(
        createProduct(),
        createArtwork({
          image: {
            secure_url: "https://example.com/invalid.jpg",
            pixelWidth: 0,
            pixelHeight: 900,
          } as ArtworkFrontend["image"],
        })
      )
    ).toBeNull();
  });

  it("falls back to the product title when the linked artwork title is blank", () => {
    expect(
      buildFramedPrintPreviewArtwork(
        createProduct({ title: "Product Title" }),
        createArtwork({ title: " " })
      )
    ).toMatchObject({
      alt: "Product Title",
    });
  });
});

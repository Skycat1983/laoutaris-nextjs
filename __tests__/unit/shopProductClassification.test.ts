import { getShopProductKind } from "@/lib/shop/productClassification";
import type { SimpleProduct } from "@/lib/data/types/shopify";

const createProduct = (
  overrides: Partial<SimpleProduct> = {}
): Pick<
  SimpleProduct,
  | "description"
  | "featuredArtworkIds"
  | "handle"
  | "productType"
  | "tags"
  | "title"
> => ({
  handle: "test-product",
  title: "Test Product",
  description: "A product used by classifier tests.",
  productType: "",
  tags: [],
  featuredArtworkIds: undefined,
  ...overrides,
});

describe("getShopProductKind", () => {
  it("keeps the T-293 book-candidate shape generic when only fallback wording says artwork", () => {
    expect(
      getShopProductKind(
        createProduct({
          handle: "the-complete-artwork-of-joseph-laoutaris",
          title: "The Complete Artwork of Joseph Laoutaris",
          description: "The complete artwork of Joseph Laoutaris.",
          productType: "",
          tags: [],
          featuredArtworkIds: undefined,
        })
      )
    ).toBe("product");
  });

  it("keeps untyped original-artwork fallback handles classified as originals", () => {
    expect(
      getShopProductKind(
        createProduct({
          handle: "joseph-laoutaris-original-artwork-no-043",
          title: "Joseph Laoutaris Original Artwork No. 043",
          description: "Original artwork by Joseph Laoutaris.",
        })
      )
    ).toBe("original");
  });

  it("uses explicit Shopify metadata for book, print, and original products", () => {
    expect(
      getShopProductKind(
        createProduct({
          productType: "Book",
          title: "Archive Volume",
        })
      )
    ).toBe("book");
    expect(
      getShopProductKind(
        createProduct({
          productType: "Fine Art Print",
          title: "No.034",
        })
      )
    ).toBe("print");
    expect(
      getShopProductKind(
        createProduct({
          productType: "Artwork",
          title: "No.043",
        })
      )
    ).toBe("original");
  });

  it("uses featured artwork IDs and clear fallback publication tokens as book signals", () => {
    expect(
      getShopProductKind(
        createProduct({
          featuredArtworkIds: ["507f1f77bcf86cd799439011"],
        })
      )
    ).toBe("book");
    expect(
      getShopProductKind(
        createProduct({
          handle: "joseph-laoutaris-gallery-catalogue",
          title: "Joseph Laoutaris Gallery Catalogue",
          description: "A publication about the archive.",
        })
      )
    ).toBe("book");
  });
});

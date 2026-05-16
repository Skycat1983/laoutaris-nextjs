const {
  auditArtworkDocuments,
  classifyShopifyProductId,
  classifyShopifyProductType,
  formatAuditReport,
  hasBlockingFindings,
} = require("../../../scripts/audit-shopify-product-link-helpers.cjs");

describe("audit Shopify product link helpers", () => {
  it("classifies product IDs with the numeric-only rule used by public reads", () => {
    expect(classifyShopifyProductId("123456")).toEqual({
      valid: true,
      normalizedProductId: "123456",
      reason: null,
    });
    expect(classifyShopifyProductId(" 123456 ")).toEqual({
      valid: true,
      normalizedProductId: "123456",
      reason: null,
    });

    expect(classifyShopifyProductId("")).toMatchObject({
      valid: false,
      reason: "empty",
    });
    expect(classifyShopifyProductId("   ")).toMatchObject({
      valid: false,
      reason: "whitespace",
    });
    expect(classifyShopifyProductId("gid://shopify/Product/123456")).toMatchObject(
      {
        valid: false,
        reason: "shopify_gid",
      }
    );
    expect(classifyShopifyProductId("123abc")).toMatchObject({
      valid: false,
      reason: "non_numeric",
    });
    expect(classifyShopifyProductId(null)).toMatchObject({
      valid: false,
      reason: "non_string",
    });
  });

  it("classifies persisted product types", () => {
    expect(classifyShopifyProductType("original")).toEqual({
      valid: true,
      reason: null,
    });
    expect(classifyShopifyProductType("print")).toEqual({
      valid: true,
      reason: null,
    });
    expect(classifyShopifyProductType("book")).toEqual({
      valid: true,
      reason: null,
    });
    expect(classifyShopifyProductType("poster")).toEqual({
      valid: false,
      reason: "unknown",
    });
    expect(classifyShopifyProductType(undefined)).toEqual({
      valid: false,
      reason: "missing",
    });
  });

  it("reports invalid IDs, unknown types, and duplicate product IDs", () => {
    const report = auditArtworkDocuments([
      {
        _id: "artwork-1",
        title: "First Artwork",
        shopifyProducts: [
          { productId: " 101 ", type: "original" },
          { productId: "101", type: "print" },
          { productId: "", type: "book" },
          { productId: "gid://shopify/Product/102", type: "book" },
          { productId: "abc", type: "poster" },
          { productId: "103", type: "poster" },
        ],
      },
      {
        _id: "artwork-2",
        title: "Second Artwork",
        shopifyProducts: [
          { productId: "101", type: "original" },
          { productId: "301", type: "book" },
        ],
      },
      {
        _id: "artwork-3",
        title: "Third Artwork",
        shopifyProducts: [{ productId: "301", type: "book" }],
      },
      {
        _id: "artwork-4",
        title: "No Links",
        shopifyProducts: [],
      },
      {
        _id: "artwork-5",
        title: "Missing Links",
      },
    ]);

    expect(report.summary).toEqual({
      totalArtworksScanned: 5,
      artworksWithShopifyLinks: 3,
      totalLinks: 9,
      invalidProductIdCount: 3,
      unknownProductTypeCount: 2,
      withinArtworkDuplicateCount: 1,
      crossArtworkDuplicateCount: 2,
    });

    expect(report.invalidProductIds.map((finding) => finding.reason)).toEqual([
      "empty",
      "shopify_gid",
      "non_numeric",
    ]);
    expect(report.unknownProductTypes).toHaveLength(2);
    expect(report.withinArtworkDuplicates).toEqual([
      {
        artworkId: "artwork-1",
        title: "First Artwork",
        productId: "101",
        count: 2,
        linkIndexes: [0, 1],
        types: ["original", "print"],
      },
    ]);
    expect(report.crossArtworkDuplicates).toEqual([
      {
        type: "original",
        productId: "101",
        artworkCount: 2,
        linkCount: 2,
        artworks: [
          { artworkId: "artwork-1", title: "First Artwork", linkIndexes: [0] },
          { artworkId: "artwork-2", title: "Second Artwork", linkIndexes: [0] },
        ],
      },
      {
        type: "book",
        productId: "301",
        artworkCount: 2,
        linkCount: 2,
        artworks: [
          { artworkId: "artwork-2", title: "Second Artwork", linkIndexes: [1] },
          { artworkId: "artwork-3", title: "Third Artwork", linkIndexes: [0] },
        ],
      },
    ]);
    expect(hasBlockingFindings(report)).toBe(true);

    const formattedReport = formatAuditReport(report);
    expect(formattedReport).toContain("Invalid product IDs: 3");
    expect(formattedReport).toContain(
      "Exit status: 1 because invalid product IDs or unknown product types were found."
    );
  });

  it("does not make duplicate-only findings fail the audit", () => {
    const report = auditArtworkDocuments([
      {
        _id: "artwork-1",
        title: "First Artwork",
        shopifyProducts: [{ productId: "301", type: "book" }],
      },
      {
        _id: "artwork-2",
        title: "Second Artwork",
        shopifyProducts: [{ productId: "301", type: "book" }],
      },
    ]);

    expect(report.summary.invalidProductIdCount).toBe(0);
    expect(report.summary.unknownProductTypeCount).toBe(0);
    expect(report.summary.crossArtworkDuplicateCount).toBe(1);
    expect(hasBlockingFindings(report)).toBe(false);
  });
});

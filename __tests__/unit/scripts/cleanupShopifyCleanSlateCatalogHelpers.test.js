const {
  DELETE_CONFIRMATION,
  PRODUCT_DELETE_MUTATION,
  buildCleanSlateReport,
  classifyProductForCleanSlate,
  createDeleteMutationVariables,
  hasBlockingCleanSlateValidation,
  parseArgs,
  validateExecutionOptions,
} = require("../../../scripts/cleanup-shopify-clean-slate-catalog-helpers.cjs");

const createProduct = ({
  id,
  handle,
  title,
  status = "ACTIVE",
  productType = "",
  tags = [],
  featuredArtworkIds = [],
}) => ({
  id: id ? `gid://shopify/Product/${id}` : null,
  legacyResourceId: id ?? null,
  handle,
  title,
  productType,
  status,
  tags,
  totalInventory: 1,
  vendor: "Joseph Laoutaris",
  createdAt: "2026-05-28T00:00:00Z",
  updatedAt: "2026-05-28T00:00:00Z",
  customMongodbArtworkId: null,
  featuredArtworkIds,
  adminUrl: id ? `https://example.myshopify.com/admin/products/${id}` : null,
});

describe("cleanup Shopify clean-slate catalog helpers", () => {
  it("parses dry-run by default and gates delete mode on the exact owner confirmation", () => {
    expect(parseArgs([])).toEqual({ mode: "dry-run" });
    expect(
      validateExecutionOptions(
        parseArgs([
          "--output=reports/clean-slate.json",
          "--mode=delete",
          `--confirm=${DELETE_CONFIRMATION}`,
        ])
      )
    ).toEqual({
      mode: "delete",
      output: "reports/clean-slate.json",
      confirm: DELETE_CONFIRMATION,
    });
    expect(() =>
      validateExecutionOptions(parseArgs(["--mode=delete"]))
    ).toThrow(`--confirm=${DELETE_CONFIRMATION}`);
    expect(() =>
      validateExecutionOptions(
        parseArgs(["--mode=delete", "--confirm=DELETE_PRODUCTS"])
      )
    ).toThrow(`--confirm=${DELETE_CONFIRMATION}`);
  });

  it("classifies book and publication products as keep products from durable metadata", () => {
    const bookByType = createProduct({
      id: "10538938761480",
      handle: "the-complete-artwork-of-joseph-laoutaris",
      title: "The Complete Artwork of Joseph Laoutaris",
      productType: "Book",
    });
    const publicationByTag = createProduct({
      id: "10538938761481",
      handle: "archive-volume-one",
      title: "Archive Volume One",
      tags: ["Publication"],
    });
    const catalogByHandle = createProduct({
      id: "10538938761482",
      handle: "joseph-laoutaris-catalogue-2026",
      title: "Joseph Laoutaris",
    });
    const bookByFeaturedArtworkMetafield = createProduct({
      id: "10538938761483",
      handle: "featured-artworks",
      title: "Featured Artworks",
      featuredArtworkIds: ["661fc617648efb163cffacee"],
    });

    expect(classifyProductForCleanSlate(bookByType)).toMatchObject({
      classification: "keep_book_publication",
      inferredFamily: "book",
      evidence: ["productType_book_publication_marker"],
    });
    expect(classifyProductForCleanSlate(publicationByTag)).toMatchObject({
      classification: "keep_book_publication",
      evidence: ["tag_book_publication_marker"],
    });
    expect(classifyProductForCleanSlate(catalogByHandle)).toMatchObject({
      classification: "keep_book_publication",
      evidence: ["handle_book_publication_marker"],
    });
    expect(classifyProductForCleanSlate(bookByFeaturedArtworkMetafield)).toMatchObject({
      classification: "keep_book_publication",
      evidence: ["featured_artwork_ids_metafield_present"],
    });
  });

  it("makes all valid non-book products delete candidates, including manual and pilot originals and prints", () => {
    const manualOriginal = createProduct({
      id: "10548307624200",
      handle: "no-214-original-artwork",
      title: "No.104, Original Artwork",
      status: "DRAFT",
    });
    const manualPrint = createProduct({
      id: "10538862346504",
      handle: "joseph-laoutaris-fine-art-print-no-026",
      title: "No.026, Limited Edition Print",
    });
    const pilotOriginal = createProduct({
      id: "10600000000001",
      handle: "joseph-laoutaris-original-no002-3cffacee",
      title: "No.002, Original Artwork",
      status: "DRAFT",
    });
    const pilotPrint = createProduct({
      id: "10600000000002",
      handle: "joseph-laoutaris-print-no002-3cffacee",
      title: "No.002, Fine Art Print",
      status: "DRAFT",
    });
    const book = createProduct({
      id: "10538938761480",
      handle: "the-complete-artwork-of-joseph-laoutaris",
      title: "The Complete Artwork of Joseph Laoutaris",
      productType: "Book",
    });

    const report = buildCleanSlateReport({
      products: [manualOriginal, manualPrint, pilotOriginal, pilotPrint, book],
      outputPath: "reports/clean-slate.json",
      mode: "dry-run",
      source: {
        shopDomain: "example.myshopify.com",
        adminApiVersion: "2026-04",
        productPagesRead: 1,
      },
      generatedAt: "2026-05-28T01:00:00.000Z",
    });

    expect(report.safety).toMatchObject({
      dryRun: true,
      shopifyReadsAllowed: true,
      shopifyMutationsAllowed: false,
      deleteProductsAllowed: false,
      mongoWritesAllowed: false,
      cloudinaryWritesAllowed: false,
      bookProductsDeleted: false,
    });
    expect(report.summary).toMatchObject({
      productsScanned: 5,
      bookPublicationProductsKept: 1,
      nonBookDeleteCandidates: 4,
      productsRejected: 0,
      deleteAttempts: 0,
    });
    expect(
      report.products
        .filter((product) => product.action === "would_delete_product")
        .map((product) => product.handle)
        .sort()
    ).toEqual([
      "joseph-laoutaris-fine-art-print-no-026",
      "joseph-laoutaris-original-no002-3cffacee",
      "joseph-laoutaris-print-no002-3cffacee",
      "no-214-original-artwork",
    ]);
    expect(report.products).toContainEqual(
      expect.objectContaining({
        handle: "the-complete-artwork-of-joseph-laoutaris",
        action: "keep_book_publication",
        classification: "keep_book_publication",
      })
    );
    expect(hasBlockingCleanSlateValidation(report)).toBe(false);
  });

  it("rejects invalid products before delete mode can attempt mutation", () => {
    const report = buildCleanSlateReport({
      products: [
        createProduct({
          id: null,
          handle: "missing-id",
          title: "No.001, Original Artwork",
        }),
        createProduct({
          id: "10600000000002",
          handle: "",
          title: "No.002, Fine Art Print",
        }),
      ],
      outputPath: "reports/clean-slate.json",
      mode: "delete",
    });

    expect(report.summary).toMatchObject({
      productsScanned: 2,
      nonBookDeleteCandidates: 0,
      productsRejected: 2,
      deleteAttempts: 0,
    });
    expect(report.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: "rejected",
          error: expect.objectContaining({
            validationErrors: expect.arrayContaining([
              expect.objectContaining({ code: "invalid_shopify_product_id" }),
            ]),
          }),
        }),
        expect.objectContaining({
          action: "rejected",
          error: expect.objectContaining({
            validationErrors: expect.arrayContaining([
              expect.objectContaining({ code: "missing_handle" }),
            ]),
          }),
        }),
      ])
    );
    expect(hasBlockingCleanSlateValidation(report)).toBe(true);
  });

  it("uses Shopify productDelete variables only for a valid Product GID", () => {
    expect(PRODUCT_DELETE_MUTATION).toContain("productDelete");
    expect(createDeleteMutationVariables("gid://shopify/Product/123")).toEqual({
      input: {
        id: "gid://shopify/Product/123",
      },
    });
  });
});

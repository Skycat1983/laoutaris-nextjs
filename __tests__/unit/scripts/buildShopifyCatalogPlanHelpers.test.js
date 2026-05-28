const {
  DEFAULT_PRINT_QUANTITY,
  buildShopifyCatalogPlan,
  createProductHandle,
  parsePrintQuantity,
} = require("../../../scripts/build-shopify-catalog-plan-helpers.cjs");

describe("build Shopify catalog plan helpers", () => {
  it("generates stable original and print handles from title and artwork ID", () => {
    expect(
      createProductHandle({
        artworkId: "665544332211009988776655",
        productFamily: "original",
        title: "Blue Study #4",
      })
    ).toBe("joseph-laoutaris-original-blue-study-4-88776655");

    expect(
      createProductHandle({
        artworkId: "665544332211009988776655",
        productFamily: "print",
        title: "Blue Study #4",
      })
    ).toBe("joseph-laoutaris-print-blue-study-4-88776655");
  });

  it("uses original inventory 1 and default print inventory 50", () => {
    const report = buildShopifyCatalogPlan(
      [
        {
          _id: "665544332211009988776655",
          title: "Blue Study",
          image: { secure_url: "https://res.cloudinary.com/demo/image.jpg" },
        },
      ],
      { generatedAt: "2026-05-28T00:00:00.000Z" }
    );

    expect(report.options).toEqual({
      originalQuantity: 1,
      printQuantity: DEFAULT_PRINT_QUANTITY,
    });
    expect(report.artworks[0].products).toMatchObject([
      {
        productFamily: "original",
        productType: "Original Artwork",
        tags: ["original", "painting", "archive-artwork"],
        inventoryQuantity: 1,
      },
      {
        productFamily: "print",
        productType: "Fine Art Print",
        tags: ["print", "fine-art-print", "archive-artwork"],
        inventoryQuantity: 50,
      },
    ]);
  });

  it("supports configurable print quantity", () => {
    expect(
      parsePrintQuantity({
        cliValue: "25",
        envValue: "60",
      })
    ).toBe(25);
    expect(
      parsePrintQuantity({
        envValue: "75",
      })
    ).toBe(75);

    const report = buildShopifyCatalogPlan(
      [
        {
          _id: "665544332211009988776655",
          title: "Blue Study",
          image: { secure_url: "https://res.cloudinary.com/demo/image.jpg" },
        },
      ],
      { printQuantity: 25 }
    );

    expect(report.artworks[0].products[1].inventoryQuantity).toBe(25);
  });

  it("warns about duplicate generated handles", () => {
    const report = buildShopifyCatalogPlan([
      {
        _id: "665544332211009988776655",
        title: "Blue Study",
        image: { secure_url: "https://res.cloudinary.com/demo/image.jpg" },
      },
      {
        _id: "665544332211009988776655",
        title: "Blue Study",
        image: { secure_url: "https://res.cloudinary.com/demo/other.jpg" },
      },
    ]);

    expect(report.summary.duplicateGeneratedHandleCount).toBe(4);
    expect(report.artworks[0].warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "duplicate_generated_handle",
          productFamily: "original",
        }),
        expect.objectContaining({
          code: "duplicate_generated_handle",
          productFamily: "print",
        }),
      ])
    );
  });

  it("returns the report shape needed for owner review", () => {
    const report = buildShopifyCatalogPlan(
      [
        {
          _id: "665544332211009988776655",
          title: "",
          image: {},
        },
      ],
      { generatedAt: "2026-05-28T00:00:00.000Z" }
    );

    expect(report).toMatchObject({
      generatedAt: "2026-05-28T00:00:00.000Z",
      mode: "dry-run",
      source: "mongodb.artworks",
      safety: {
        callsShopify: false,
        mutatesShopify: false,
        mutatesMongoDB: false,
        mutatesCloudinary: false,
      },
      summary: {
        totalArtworksScanned: 1,
        originalProductsPlanned: 1,
        printProductsPlanned: 1,
        artworksMissingTitle: 1,
        artworksMissingImage: 1,
      },
      artworks: [
        {
          artworkId: "665544332211009988776655",
          title: null,
          imageUrlPresent: false,
          proposedOriginalHandle:
            "joseph-laoutaris-original-untitled-artwork-88776655",
          proposedPrintHandle:
            "joseph-laoutaris-print-untitled-artwork-88776655",
          customMongodbArtworkId: "665544332211009988776655",
          warnings: expect.arrayContaining([
            expect.objectContaining({ code: "missing_title" }),
            expect.objectContaining({ code: "missing_image" }),
          ]),
          products: [
            expect.objectContaining({
              productFamily: "original",
              metafields: [
                {
                  namespace: "custom",
                  key: "mongodb_artwork_id",
                  value: "665544332211009988776655",
                },
              ],
            }),
            expect.objectContaining({
              productFamily: "print",
              metafields: [
                {
                  namespace: "custom",
                  key: "mongodb_artwork_id",
                  value: "665544332211009988776655",
                },
              ],
            }),
          ],
        },
      ],
    });
  });
});

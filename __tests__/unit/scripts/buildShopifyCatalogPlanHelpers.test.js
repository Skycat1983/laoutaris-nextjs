const {
  DEFAULT_PRINT_QUANTITY,
  EXPLICIT_EXCLUSIONS,
  buildShopifyCatalogPlan,
  createCustomMetafields,
  createProductHandle,
  createTaxonomyTags,
  extractArtworkNumber,
  parsePrintQuantity,
} = require("../../../scripts/build-shopify-catalog-plan-helpers.cjs");

const completeArtwork = (overrides = {}) => ({
  _id: "665544332211009988776655",
  title: "No.002 Blue Study",
  decade: "1970s",
  artstyle: "Semi Abstract",
  medium: "Oil",
  surface: "Canvas",
  featured: false,
  image: {
    secure_url: "https://res.cloudinary.com/demo/image.jpg",
    public_id: "archive/no-002",
    pixelWidth: 1400,
    pixelHeight: 1800,
    format: "jpg",
  },
  ...overrides,
});

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
      [completeArtwork({ title: "Blue Study" })],
      { generatedAt: "2026-05-28T00:00:00.000Z" }
    );

    expect(report.options).toEqual({
      originalQuantity: 1,
      printQuantity: DEFAULT_PRINT_QUANTITY,
    });
    expect(report.artworks[0].imageUrl).toBe(
      "https://res.cloudinary.com/demo/image.jpg"
    );
    expect(report.artworks[0].products).toMatchObject([
      {
        productFamily: "original",
        title: "Blue Study - Original Artwork",
        vendor: "Joseph Laoutaris",
        productType: "Original Artwork",
        status: "DRAFT",
        tags: [
          "archive-artwork",
          "original",
          "painting",
          "decade-1970s",
          "artstyle-semi-abstract",
          "medium-oil",
          "surface-canvas",
        ],
        inventoryQuantity: 1,
        inventoryPolicy: "deny",
      },
      {
        productFamily: "print",
        title: "Blue Study - Fine Art Print",
        vendor: "Joseph Laoutaris",
        productType: "Fine Art Print",
        status: "DRAFT",
        tags: [
          "archive-artwork",
          "print",
          "fine-art-print",
          "decade-1970s",
          "artstyle-semi-abstract",
          "medium-oil",
          "surface-canvas",
        ],
        inventoryQuantity: 50,
        inventoryPolicy: "deny",
      },
    ]);
  });

  it("generates stable taxonomy tags with featured true only", () => {
    expect(
      createTaxonomyTags({
        taxonomy: {
          decade: "1980s",
          artstyle: "Semi Abstract",
          medium: "Oil Paint",
          surface: "Canvas Board",
        },
        featured: true,
      })
    ).toEqual([
      "decade-1980s",
      "artstyle-semi-abstract",
      "medium-oil-paint",
      "surface-canvas-board",
      "featured-artwork",
    ]);

    expect(
      createTaxonomyTags({
        taxonomy: {
          decade: "1980s",
          artstyle: "Semi Abstract",
          medium: "Oil Paint",
          surface: "Canvas Board",
        },
        featured: false,
      })
    ).not.toContain("featured-artwork");
  });

  it("creates typed custom metafields from the T-335 mapping", () => {
    const metafields = createCustomMetafields({
      artworkId: "665544332211009988776655",
      title: "No.214 Evening Figure",
      artworkNumber: "No.214",
      taxonomy: {
        decade: "1990s",
        artstyle: "Abstract",
        medium: "Acrylic",
        surface: "Paper",
      },
      featured: true,
      selectedArchiveImage: {
        secureUrl: "https://res.cloudinary.com/demo/no-214.jpg",
        publicId: "archive/no-214",
        pixelWidth: 1200,
        pixelHeight: 1600,
        format: "jpg",
      },
      productFamily: "print",
      printQuantity: 25,
    });

    expect(metafields).toEqual([
      {
        namespace: "custom",
        key: "mongodb_artwork_id",
        type: "single_line_text_field",
        value: "665544332211009988776655",
      },
      {
        namespace: "custom",
        key: "artwork_title",
        type: "single_line_text_field",
        value: "No.214 Evening Figure",
      },
      {
        namespace: "custom",
        key: "artwork_number",
        type: "single_line_text_field",
        value: "No.214",
      },
      {
        namespace: "custom",
        key: "artwork_decade",
        type: "single_line_text_field",
        value: "1990s",
      },
      {
        namespace: "custom",
        key: "artwork_artstyle",
        type: "single_line_text_field",
        value: "Abstract",
      },
      {
        namespace: "custom",
        key: "artwork_medium",
        type: "single_line_text_field",
        value: "Acrylic",
      },
      {
        namespace: "custom",
        key: "artwork_surface",
        type: "single_line_text_field",
        value: "Paper",
      },
      {
        namespace: "custom",
        key: "artwork_featured",
        type: "boolean",
        value: true,
      },
      {
        namespace: "custom",
        key: "archive_image_url",
        type: "url",
        value: "https://res.cloudinary.com/demo/no-214.jpg",
      },
      {
        namespace: "custom",
        key: "archive_image_public_id",
        type: "single_line_text_field",
        value: "archive/no-214",
      },
      {
        namespace: "custom",
        key: "archive_image_width",
        type: "number_integer",
        value: 1200,
      },
      {
        namespace: "custom",
        key: "archive_image_height",
        type: "number_integer",
        value: 1600,
      },
      {
        namespace: "custom",
        key: "archive_image_format",
        type: "single_line_text_field",
        value: "jpg",
      },
      {
        namespace: "custom",
        key: "print_edition_quantity",
        type: "number_integer",
        value: 25,
      },
    ]);
  });

  it("extracts optional artwork numbers from No-prefixed titles", () => {
    expect(extractArtworkNumber("No.002 Blue Study")).toBe("No.002");
    expect(extractArtworkNumber("no 214 original artwork")).toBe("No.214");
    expect(extractArtworkNumber("Blue Study")).toBeNull();
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
      [completeArtwork({ title: "Blue Study" })],
      { printQuantity: 25 }
    );

    expect(report.artworks[0].products[1].inventoryQuantity).toBe(25);
    expect(report.artworks[0].products[1].printEditionQuantity).toBe(25);
    expect(report.artworks[0].products[1].variants).toEqual([
      {
        optionName: "Frame package",
        optionValue: "Unframed",
        title: "Unframed",
        inventoryQuantity: 25,
        inventoryPolicy: "deny",
      },
    ]);
    expect(report.artworks[0].products[0]).not.toHaveProperty(
      "printEditionQuantity"
    );
  });

  it("carries selected archive image metadata without Cloudinary mutations", () => {
    const report = buildShopifyCatalogPlan([completeArtwork()]);
    const original = report.artworks[0].products[0];

    expect(report.safety.mutatesCloudinary).toBe(false);
    expect(report.artworks[0].selectedArchiveImage).toEqual({
      secureUrl: "https://res.cloudinary.com/demo/image.jpg",
      publicId: "archive/no-002",
      pixelWidth: 1400,
      pixelHeight: 1800,
      format: "jpg",
    });
    expect(original.media).toEqual([
      {
        sourceUrl: "https://res.cloudinary.com/demo/image.jpg",
        alt: "No.002 Blue Study - Original Artwork",
      },
    ]);
    expect(original.selectedArchiveImage.publicId).toBe("archive/no-002");
  });

  it("maps featured false and true without inventing tags", () => {
    const falseReport = buildShopifyCatalogPlan([
      completeArtwork({ featured: false }),
    ]);
    const trueReport = buildShopifyCatalogPlan([
      completeArtwork({ featured: true }),
    ]);

    expect(falseReport.artworks[0].featured).toBe(false);
    expect(falseReport.artworks[0].products[0].tags).not.toContain(
      "featured-artwork"
    );
    expect(
      falseReport.artworks[0].products[0].metafields.find(
        (metafield) => metafield.key === "artwork_featured"
      )
    ).toMatchObject({ type: "boolean", value: false });

    expect(trueReport.artworks[0].featured).toBe(true);
    expect(trueReport.artworks[0].products[0].tags).toContain(
      "featured-artwork"
    );
    expect(
      trueReport.artworks[0].products[0].metafields.find(
        (metafield) => metafield.key === "artwork_featured"
      )
    ).toMatchObject({ type: "boolean", value: true });
  });

  it("warns about unsupported required taxonomy metadata without inventing values", () => {
    const report = buildShopifyCatalogPlan([
      completeArtwork({
        decade: 1980,
      }),
    ]);
    const original = report.artworks[0].products[0];

    expect(report.summary.unsupportedRequiredMetadataCount).toBe(1);
    expect(report.summary).not.toHaveProperty("unsupportedRequiredDataCount");
    expect(report.artworks[0].taxonomy.decade).toBeNull();
    expect(report.artworks[0].warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "unsupported_required_metadata",
          field: "decade",
        }),
      ])
    );
    expect(original.tags).not.toContain("decade-1980");
    expect(
      original.metafields.find(
        (metafield) => metafield.key === "artwork_decade"
      )
    ).toMatchObject({ value: null });
  });

  it("records explicit exclusions for generated products", () => {
    const report = buildShopifyCatalogPlan([completeArtwork()]);

    expect(report.explicitExclusions).toEqual(EXPLICIT_EXCLUSIONS);
    expect(report.explicitExclusions).toEqual(
      expect.arrayContaining([
        "shopifyProducts",
        "user watchlist",
        "collection metadata",
        "image.hexColors",
        "framed purchasable options",
        "MongoDB shopifyProducts link writes",
      ])
    );
    expect(JSON.stringify(report.artworks[0].products)).not.toContain(
      "shopifyProducts"
    );
  });

  it("warns about duplicate generated handles", () => {
    const report = buildShopifyCatalogPlan([
      completeArtwork({
        _id: "665544332211009988776655",
        title: "Blue Study",
      }),
      completeArtwork({
        _id: "665544332211009988776655",
        title: "Blue Study",
        image: {
          secure_url: "https://res.cloudinary.com/demo/other.jpg",
          public_id: "archive/other",
          pixelWidth: 1400,
          pixelHeight: 1800,
          format: "jpg",
        },
      }),
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
          decade: "",
          artstyle: "",
          medium: "",
          surface: "",
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
        artworksMissingRequiredMetadata: 1,
      },
      artworks: [
        {
          artworkId: "665544332211009988776655",
          title: null,
          taxonomy: {
            decade: null,
            artstyle: null,
            medium: null,
            surface: null,
          },
          imageUrlPresent: false,
          imageUrl: null,
          selectedArchiveImage: {
            secureUrl: null,
            publicId: null,
            pixelWidth: null,
            pixelHeight: null,
            format: null,
          },
          proposedOriginalHandle:
            "joseph-laoutaris-original-untitled-artwork-88776655",
          proposedPrintHandle:
            "joseph-laoutaris-print-untitled-artwork-88776655",
          customMongodbArtworkId: "665544332211009988776655",
          warnings: expect.arrayContaining([
            expect.objectContaining({ code: "missing_title" }),
            expect.objectContaining({ code: "missing_image" }),
            expect.objectContaining({
              code: "missing_required_metadata",
              field: "decade",
            }),
          ]),
          products: [
            expect.objectContaining({
              productFamily: "original",
              title: null,
              vendor: "Joseph Laoutaris",
              status: "DRAFT",
              media: [],
              metafields: expect.arrayContaining([
                expect.objectContaining({
                  namespace: "custom",
                  key: "mongodb_artwork_id",
                  type: "single_line_text_field",
                  value: "665544332211009988776655",
                }),
              ]),
            }),
            expect.objectContaining({
              productFamily: "print",
              variants: [
                {
                  optionName: "Frame package",
                  optionValue: "Unframed",
                  title: "Unframed",
                  inventoryQuantity: 50,
                  inventoryPolicy: "deny",
                },
              ],
              metafields: expect.arrayContaining([
                expect.objectContaining({
                  namespace: "custom",
                  key: "mongodb_artwork_id",
                  type: "single_line_text_field",
                  value: "665544332211009988776655",
                }),
                expect.objectContaining({
                  key: "print_edition_quantity",
                  type: "number_integer",
                  value: 50,
                }),
              ]),
            }),
          ],
        },
      ],
    });
  });
});

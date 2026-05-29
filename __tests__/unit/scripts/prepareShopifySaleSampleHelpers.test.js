const {
  buildSaleSampleSelection,
  parseArgs,
} = require("../../../scripts/prepare-shopify-sale-sample-helpers.cjs");

const createArtwork = (index) => {
  const padded = String(index).padStart(3, "0");
  const artworkId = `661fc617648efb163cffa${String(index).padStart(3, "0")}`;

  return {
    artworkId,
    title: `No.${padded}`,
    artworkNumber: padded,
    products: [
      {
        productFamily: "original",
        matchStatus: "exact_match",
        recommendedAction: "preserve_existing_product",
        handleMatch: {
          id: `gid://shopify/Product/10${padded}`,
          legacyResourceId: `10${padded}`,
          handle: `original-${padded}`,
          title: `No.${padded} - Original Artwork`,
          status: "DRAFT",
          productType: "Original Artwork",
          adminUrl: `https://example.myshopify.com/admin/products/10${padded}`,
        },
      },
      {
        productFamily: "print",
        matchStatus: "exact_match",
        recommendedAction: "preserve_existing_product",
        handleMatch: {
          id: `gid://shopify/Product/20${padded}`,
          legacyResourceId: `20${padded}`,
          handle: `print-${padded}`,
          title: `No.${padded} - Fine Art Print`,
          status: "DRAFT",
          productType: "Fine Art Print",
          adminUrl: `https://example.myshopify.com/admin/products/20${padded}`,
        },
      },
    ],
  };
};

const createReconciliation = (count = 40) => ({
  artworks: Array.from({ length: count }, (_, index) =>
    createArtwork(index + 1)
  ),
});

describe("prepare Shopify sale sample helpers", () => {
  it("parses defaults and count overrides", () => {
    expect(
      parseArgs([
        "--input=reports/input.json",
        "--output=reports/output.json",
        "--seed=test-seed",
        "--original-count=10",
        "--print-count=25",
        "--overlap-count=7",
      ])
    ).toMatchObject({
      reconciliation: "reports/input.json",
      output: "reports/output.json",
      seed: "test-seed",
      originalCount: 10,
      printCount: 25,
      overlapCount: 7,
    });
  });

  it("builds a deterministic mixed selection with overlap", () => {
    const first = buildSaleSampleSelection({
      reconciliation: createReconciliation(),
      seed: "unit-seed",
      originalCount: 10,
      printCount: 25,
      overlapCount: 7,
      source: {},
      generatedAt: "2026-05-29T00:00:00.000Z",
    });
    const second = buildSaleSampleSelection({
      reconciliation: createReconciliation(),
      seed: "unit-seed",
      originalCount: 10,
      printCount: 25,
      overlapCount: 7,
      source: {},
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(first.summary).toMatchObject({
      selectedOriginals: 10,
      selectedPrints: 25,
      overlapArtworks: 7,
      originalOnlyArtworks: 3,
      printOnlyArtworks: 18,
      selectedProducts: 35,
    });
    expect(first.selectedProducts).toEqual(second.selectedProducts);
    expect(
      first.selectedArtworks.some(
        (artwork) => artwork.selectionGroup === "overlap"
      )
    ).toBe(true);
    expect(
      first.selectedArtworks.some(
        (artwork) => artwork.selectionGroup === "original_only"
      )
    ).toBe(true);
    expect(
      first.selectedArtworks.some(
        (artwork) => artwork.selectionGroup === "print_only"
      )
    ).toBe(true);
  });

  it("rejects a selection where every original overlaps", () => {
    expect(() =>
      buildSaleSampleSelection({
        reconciliation: createReconciliation(),
        seed: "unit-seed",
        originalCount: 10,
        printCount: 25,
        overlapCount: 10,
        source: {},
      })
    ).toThrow("lower than original-count");
  });

  it("does not place duplicate artwork numbers into different groups", () => {
    const reconciliation = createReconciliation(40);
    reconciliation.artworks[12] = {
      ...reconciliation.artworks[12],
      artworkId: "duplicate-artwork-id",
      artworkNumber: reconciliation.artworks[0].artworkNumber,
      title: reconciliation.artworks[0].title,
    };

    const selection = buildSaleSampleSelection({
      reconciliation,
      seed: "unit-seed",
      originalCount: 10,
      printCount: 25,
      overlapCount: 7,
      source: {},
    });
    const artworkNumbers = selection.selectedArtworks.map(
      (artwork) => artwork.artworkNumber
    );

    expect(new Set(artworkNumbers).size).toBe(artworkNumbers.length);
  });
});

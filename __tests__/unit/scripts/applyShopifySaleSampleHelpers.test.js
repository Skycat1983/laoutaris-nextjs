const {
  ACTIVATE_SALE_SAMPLE_CONFIRMATION,
  PRODUCT_ACTIVATE_MUTATION,
  PRODUCT_PUBLISH_MUTATION,
  buildActivationReport,
  createActivateMutationVariables,
  createPublishMutationVariables,
  parseArgs,
  resolvePublication,
} = require("../../../scripts/apply-shopify-sale-sample-helpers.cjs");

const createSelectedProduct = ({ family, index, group = "print_only" }) => {
  const padded = String(index).padStart(3, "0");

  return {
    artworkId: `661fc617648efb163cffa${padded}`,
    artworkTitle: `No.${padded}`,
    artworkNumber: padded,
    productFamily: family,
    selectionGroup: group,
    gid: `gid://shopify/Product/${family === "original" ? "10" : "20"}${padded}`,
    productId: `${family === "original" ? "10" : "20"}${padded}`,
    handle: `${family}-${padded}`,
    title: `No.${padded}`,
    currentStatusFromReconciliation: "DRAFT",
    productType: family === "original" ? "Original Artwork" : "Fine Art Print",
    adminUrl: null,
    desiredShopifyStatus: "ACTIVE",
    desiredPublicListing: true,
  };
};

const createSelection = () => {
  const overlap = Array.from({ length: 7 }, (_, index) => index + 1);
  const originalOnly = [8, 9, 10];
  const printOnly = Array.from({ length: 18 }, (_, index) => index + 11);

  return {
    selectedProducts: [
      ...overlap.flatMap((index) => [
        createSelectedProduct({ family: "original", index, group: "overlap" }),
        createSelectedProduct({ family: "print", index, group: "overlap" }),
      ]),
      ...originalOnly.map((index) =>
        createSelectedProduct({
          family: "original",
          index,
          group: "original_only",
        })
      ),
      ...printOnly.map((index) =>
        createSelectedProduct({ family: "print", index })
      ),
    ],
  };
};

describe("apply Shopify sale sample helpers", () => {
  it("requires exact confirmation for write mode", () => {
    expect(() => parseArgs(["--mode=write"])).toThrow(
      ACTIVATE_SALE_SAMPLE_CONFIRMATION
    );

    expect(
      parseArgs([
        "--mode=write",
        `--confirm=${ACTIVATE_SALE_SAMPLE_CONFIRMATION}`,
        "--publication-name=Online Store",
      ])
    ).toMatchObject({
      mode: "write",
      confirm: ACTIVATE_SALE_SAMPLE_CONFIRMATION,
      publicationName: "Online Store",
    });
  });

  it("builds a plan for exactly 10 originals and 25 prints", () => {
    const report = buildActivationReport({
      selection: createSelection(),
      options: { mode: "plan", publicationName: "Online Store" },
      source: {},
      generatedAt: "2026-05-29T00:00:00.000Z",
    });

    expect(report.summary).toMatchObject({
      selectedOriginals: 10,
      selectedPrints: 25,
      selectedProducts: 35,
    });
    expect(report.safety).toMatchObject({
      mongoWritesAllowed: false,
      shopifyMutationsAllowed: false,
    });
  });

  it("builds product update and publication mutation variables", () => {
    expect(
      createActivateMutationVariables("gid://shopify/Product/123")
    ).toEqual({
      product: {
        id: "gid://shopify/Product/123",
        status: "ACTIVE",
      },
    });
    expect(
      createPublishMutationVariables({
        shopifyProductGid: "gid://shopify/Product/123",
        publicationId: "gid://shopify/Publication/456",
      })
    ).toEqual({
      id: "gid://shopify/Product/123",
      input: [{ publicationId: "gid://shopify/Publication/456" }],
    });
    expect(PRODUCT_ACTIVATE_MUTATION).toContain("productUpdate");
    expect(PRODUCT_PUBLISH_MUTATION).toContain("publishablePublish");
  });

  it("resolves Online Store publication by name", () => {
    expect(
      resolvePublication({
        publications: [
          { id: "gid://shopify/Publication/1", name: "Point of Sale" },
          { id: "gid://shopify/Publication/2", name: "Online Store" },
        ],
        publicationName: "Online Store",
      })
    ).toEqual({ id: "gid://shopify/Publication/2", name: "Online Store" });
  });
});

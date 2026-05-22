import { createShopFetchers } from "@/lib/api/public/shop/fetchers";
import type { Fetcher } from "@/lib/api/core/createFetcher";
import type { SimpleProduct } from "@/lib/data/types/shopify";

const product: SimpleProduct = {
  id: "gid://shopify/Product/10538938761480",
  handle: "verified-original",
  title: "Verified Original",
  description: "Verified product description.",
  descriptionHtml: "<p>Verified product description.</p>",
  onlineStoreUrl: "https://laoutaris.myshopify.com/products/verified-original",
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

describe("public shop fetchers", () => {
  it("builds the single-product URL from a trimmed numeric product ID", async () => {
    const result = {
      success: true,
      data: product,
    };
    const fetcher = jest.fn(async () => result);
    const shopFetchers = createShopFetchers(fetcher as Fetcher);

    await expect(shopFetchers.productById(" 10538938761480 ")).resolves.toBe(
      result
    );

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v2/public/shop/products/10538938761480"
    );
  });

  it("returns route error envelopes from product lookups", async () => {
    const result = {
      success: false,
      error: "Product not found",
    };
    const fetcher = jest.fn(async () => result);
    const shopFetchers = createShopFetchers(fetcher as Fetcher);

    await expect(shopFetchers.productById("999")).resolves.toEqual(result);

    expect(fetcher).toHaveBeenCalledWith("/api/v2/public/shop/products/999");
  });
});

import { readFileSync } from "fs";
import path from "path";

const scopedShopifyProviderServiceFiles = [
  "src/lib/api/shopify/shopifyClient.ts",
  "src/lib/data/services/getArtworkShopProducts.ts",
  "src/lib/data/services/getShopProductList.ts",
];

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("Shopify provider and service logging source hygiene", () => {
  it("keeps the T-127 Shopify provider/service slice free of direct console error and warning calls", () => {
    const offenders = scopedShopifyProviderServiceFiles.flatMap((sourceFile) => {
      const source = readRepoFile(sourceFile);
      const matches = source.match(/console\.(error|warn)\s*\(/g) ?? [];

      return matches.map((match) => `${sourceFile}: ${match}`);
    });

    expect(offenders).toEqual([]);
  });

  it("routes retained server logging through the structured logger helper", () => {
    for (const sourceFile of scopedShopifyProviderServiceFiles) {
      const source = readRepoFile(sourceFile);

      expect(source).toContain("createServerLogger");
    }
  });
});

import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("credential source hygiene", () => {
  it("keeps registration free of direct console logging", () => {
    const source = readRepoFile("src/lib/actions/registerUser.ts");

    expect(source).not.toMatch(/console\.(?:debug|error|info|log|warn)\s*\(/);
  });

  it("does not keep concrete Shopify Storefront token examples in source comments", () => {
    const source = readRepoFile("src/lib/config/shopifyConfig.ts");
    const comments = source
      .split("\n")
      .filter((line) => line.trim().startsWith("//"))
      .join("\n");

    expect(comments).not.toMatch(
      /SHOPIFY_STOREFRONT_ACCESS_TOKEN\s*=\s*[A-Za-z0-9_-]{20,}/
    );
  });

  it("keeps the Cloudinary upload button free of direct console debugging", () => {
    const source = readRepoFile(
      "src/components/elements/buttons/UploadButton.tsx"
    );

    expect(source).not.toMatch(/console\.(?:debug|error|info|log|warn)\s*\(/);
    expect(source).not.toMatch(/\bsetInterval\s*\(/);
    expect(source).not.toMatch(/document\.querySelector/);
    expect(source).not.toMatch(/document\.querySelectorAll/);
  });

  it("keeps public shop browse files free of direct console.log debugging", () => {
    const sourceFiles = [
      "src/app/api/v2/public/shop/products/route.ts",
      "src/components/compositions/ShopProductGallery.tsx",
      "src/components/loaders/viewLoaders/ShopProductsLoader.tsx",
    ];

    for (const sourceFile of sourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(/console\.log\s*\(/);
    }
  });

  it("keeps public shop loader error copy free of console-directed guidance", () => {
    const source = readRepoFile(
      "src/components/loaders/viewLoaders/ShopProductsLoader.tsx"
    );

    expect(source).not.toMatch(/check the console/i);
  });

  it("keeps shared API fetcher files free of direct console.log debugging", () => {
    const sourceFiles = [
      "src/lib/api/core/createFetcher.ts",
      "src/lib/api/public/serverPublicApi.ts",
      "src/lib/api/user/serverUserApi.ts",
      "src/lib/api/admin/serverAdminApi.ts",
    ];

    for (const sourceFile of sourceFiles) {
      const source = readRepoFile(sourceFile);

      expect(source).not.toMatch(/console\.log\s*\(/);
      expect(source).not.toMatch(
        /URL Construction Debug|Fetcher called|Final URL|📥 Response/
      );
    }
  });
});

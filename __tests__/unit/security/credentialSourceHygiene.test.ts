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
});

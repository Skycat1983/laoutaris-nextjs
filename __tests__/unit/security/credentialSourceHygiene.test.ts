import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const listRepoFiles = (relativeDir: string): string[] => {
  const absoluteDir = path.join(process.cwd(), relativeDir);
  const entries = readdirSync(absoluteDir);

  return entries.flatMap((entry) => {
    const absolutePath = path.join(absoluteDir, entry);
    const relativePath = path.join(relativeDir, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return listRepoFiles(relativePath);
    }

    return /\.(?:cjs|js|jsx|mjs|ts|tsx)$/.test(entry) ? [relativePath] : [];
  });
};

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

  it("keeps retired server API wrapper entrypoints deleted", () => {
    const retiredPublicApiName = ["server", "PublicApi"].join("");
    const retiredUserApiName = ["server", "UserApi"].join("");
    const retiredAdminApiName = ["server", "AdminApi"].join("");
    const retiredWrapperFiles = [
      "src/lib/api/serverApi.ts",
      `src/lib/api/public/${retiredPublicApiName}.ts`,
      `src/lib/api/user/${retiredUserApiName}.ts`,
      `src/lib/api/admin/${retiredAdminApiName}.ts`,
    ];

    for (const sourceFile of retiredWrapperFiles) {
      expect(existsSync(path.join(process.cwd(), sourceFile))).toBe(false);
    }
  });

  it("keeps active source free of retired server API wrapper imports", () => {
    const activeSourceFiles = listRepoFiles("src");
    const retiredPublicApiName = ["server", "PublicApi"].join("");
    const retiredUserApiName = ["server", "UserApi"].join("");
    const retiredAdminApiName = ["server", "AdminApi"].join("");
    const retiredWrapperModules = [
      "serverApi",
      `public/${retiredPublicApiName}`,
      `user/${retiredUserApiName}`,
      `admin/${retiredAdminApiName}`,
    ].join("|");
    const retiredWrapperImportPattern = new RegExp(
      `(?:import\\s+[^;]*\\s+from\\s+["']@/lib/api/(?:${retiredWrapperModules})["']|import\\s*\\(\\s*["']@/lib/api/(?:${retiredWrapperModules})["']\\s*\\))`
    );

    for (const sourceFile of activeSourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(retiredWrapperImportPattern);
    }
  });

  it("keeps src/lib/api free of retired same-app server URL construction", () => {
    const apiSourceFiles = listRepoFiles("src/lib/api");

    for (const sourceFile of apiSourceFiles) {
      const source = readRepoFile(sourceFile);

      expect(source).not.toMatch(
        /process\.env\.VERCEL_ENV|process\.env\.VERCEL_URL|http:\/\/localhost:3000/
      );
    }
  });

  it("keeps MongoDB helper files free of direct debug logging", () => {
    const dbSourceFiles = [
      "src/lib/db/mongodb.ts",
      "src/lib/db/clientPromise.ts",
      "src/lib/db/connectWithRetry.ts",
      "src/lib/db/adapter.ts",
    ];

    for (const sourceFile of dbSourceFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(
        /console\.(?:debug|error|info|log|warn)\s*\(/
      );
    }
  });

  it("keeps MongoDB helper files free of retired debug strings and callback examples", () => {
    const dbHelperSource = [
      "src/lib/db/mongodb.ts",
      "src/lib/db/clientPromise.ts",
      "src/lib/db/connectWithRetry.ts",
      "src/lib/db/adapter.ts",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(dbHelperSource).not.toMatch(
      /MONGO_URI exists|Raw MongoDB|DB Connect called|Custom createUser|Custom user created/
    );
    expect(readRepoFile("src/lib/db/mongodb.ts")).not.toMatch(
      /api\/auth\/callback|http:\/\/localhost:3000|OLD CODE/
    );
  });
});

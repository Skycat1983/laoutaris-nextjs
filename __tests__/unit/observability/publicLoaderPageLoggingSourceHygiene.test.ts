import { readFileSync } from "fs";
import path from "path";

const scopedPublicLoaderPageFiles = [
  "src/app/biography/page.tsx",
  "src/app/collections/page.tsx",
  "src/app/collections/[slug]/page.tsx",
  "src/app/shop/products/[productHandle]/page.tsx",
  "src/components/loaders/viewLoaders/BlogDetailLoader.tsx",
  "src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx",
  "src/components/loaders/viewLoaders/ShopProductsLoader.tsx",
  "src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx",
  "src/components/loaders/componentLoaders/MainNavLoader.tsx",
  "src/components/loaders/sectionLoaders/BiographySectionLoader.tsx",
  "src/components/loaders/sectionLoaders/BlogSectionLoader.tsx",
  "src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx",
];

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("public loader and page logging source hygiene", () => {
  it("keeps the T-126 public loader/page slice free of direct console error and warning calls", () => {
    const offenders = scopedPublicLoaderPageFiles.flatMap((sourceFile) => {
      const source = readRepoFile(sourceFile);
      const matches = source.match(/console\.(error|warn)\s*\(/g) ?? [];

      return matches.map((match) => `${sourceFile}: ${match}`);
    });

    expect(offenders).toEqual([]);
  });

  it("routes retained server logging through the structured logger helper", () => {
    for (const sourceFile of scopedPublicLoaderPageFiles) {
      const source = readRepoFile(sourceFile);

      expect(source).toContain("createServerLogger");
    }
  });
});

import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const publicBrowsingClientFiles = [
  "src/hooks/useInfiniteScroll.ts",
  "src/components/artwork/ArtworkGallery.tsx",
  "src/components/sections/BlogSectionContinuous.tsx",
  "src/components/views/BlogDetail.tsx",
  "src/components/compositions/ShopProductGallery.tsx",
];

describe("public browsing client logging source hygiene", () => {
  it("keeps scoped public browsing clients free of direct console error and warn calls", () => {
    for (const sourceFile of publicBrowsingClientFiles) {
      expect(readRepoFile(sourceFile)).not.toMatch(
        /console\.(error|warn)\s*\(/
      );
    }
  });

  it("keeps retired raw client failure logging strings out of scoped source files", () => {
    const combinedSource = publicBrowsingClientFiles.map(readRepoFile).join("\n");

    expect(combinedSource).not.toMatch(
      /Error in infinite scroll|Error fetching filtered artworks|Error loading more artworks|Error loading more blogs|Error in BlogSectionContinuous|Failed to load comments:|Error posting comment|ShopProductGallery - Error fetching products/
    );
  });
});

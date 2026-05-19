import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const deliveryTransformUiFiles = [
  "src/components/features/adminDashboard/crudForms/read/ReadArticleList.tsx",
  "src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx",
  "src/components/features/adminDashboard/crudForms/read/ReadBlogList.tsx",
  "src/components/layouts/public/MasonryLayout.tsx",
  "src/components/modules/cards/ArticleFeedCard.tsx",
  "src/components/modules/cards/ArtworkFeedCard.tsx",
  "src/components/modules/cards/BlogCard.tsx",
  "src/components/modules/cards/BlogFeedCard.tsx",
  "src/components/modules/cards/BlogsViewCard.tsx",
  "src/components/modules/cards/CollectionFeedCard.tsx",
  "src/components/sections/BlogSectionContinuous.tsx",
  "src/components/sections/BlogSectionSplitScreen.tsx",
  "src/components/sections/BlogSectionTiles.tsx",
  "src/components/sections/BlogsSectionFeatured.tsx",
];

describe("Cloudinary delivery transform source hygiene", () => {
  it("keeps scoped UI files free of direct Cloudinary upload-path replacements", () => {
    for (const sourceFile of deliveryTransformUiFiles) {
      const source = readRepoFile(sourceFile);

      expect(source).not.toMatch(/\.replace\s*\([\s\S]{0,120}["']\/upload\//);
      expect(source).not.toMatch(/["']\/upload\/[a-zA-Z0-9_,:-]+\//);
    }
  });
});

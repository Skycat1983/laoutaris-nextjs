import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const stripComments = (source: string) =>
  source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

const countMatches = (source: string, pattern: RegExp) =>
  Array.from(source.matchAll(pattern)).length;

const findTsxFiles = (relativeDirectory: string): string[] => {
  const absoluteDirectory = path.join(process.cwd(), relativeDirectory);

  return readdirSync(absoluteDirectory).flatMap((entry) => {
    const absolutePath = path.join(absoluteDirectory, entry);
    const relativePath = path.join(relativeDirectory, entry);

    if (statSync(absolutePath).isDirectory()) {
      return findTsxFiles(relativePath);
    }

    return relativePath.endsWith(".tsx") ? [relativePath] : [];
  });
};

describe("public landmarks and headings", () => {
  it("keeps the root layout as a non-landmark spacing wrapper", () => {
    const rootLayout = stripComments(readRepoFile("src/app/layout.tsx"));

    expect(rootLayout).not.toMatch(/<main\b/);
    expect(rootLayout).not.toMatch(/<\/main>/);
    expect(rootLayout).toContain('className="mt-[140px]');
  });

  it("keeps public main ownership at route or route-view level", () => {
    const routeMainOwners = [
      "src/app/page.tsx",
      "src/app/artwork/page.tsx",
      "src/app/artwork/[artworkId]/page.tsx",
      "src/app/collections/[slug]/[artworkId]/page.tsx",
      "src/app/blog/page.tsx",
      "src/app/blog/[slug]/page.tsx",
      "src/app/shop/products/page.tsx",
      "src/app/shop/products/[productHandle]/page.tsx",
      "src/app/project/aims/page.tsx",
      "src/app/project/film/page.tsx",
      "src/app/search/page.tsx",
    ];

    for (const sourcePath of routeMainOwners) {
      expect(stripComments(readRepoFile(sourcePath))).toMatch(/<main\b/);
    }

    expect(
      countMatches(
        stripComments(readRepoFile("src/components/views/ArticleView.tsx")),
        /<main\b/g
      )
    ).toBe(1);

    const articleRoutePages = [
      "src/app/biography/[slug]/page.tsx",
      "src/app/project/about/page.tsx",
      "src/app/project/contact/page.tsx",
    ];

    for (const sourcePath of articleRoutePages) {
      expect(stripComments(readRepoFile(sourcePath))).not.toMatch(/<main\b/);
    }

    const nestedMainRiskViews = [
      "src/components/views/Home.tsx",
      "src/components/views/ArtworkView.tsx",
      "src/components/views/BlogDetail.tsx",
    ];

    for (const sourcePath of nestedMainRiskViews) {
      expect(stripComments(readRepoFile(sourcePath))).not.toMatch(/<main\b/);
    }
  });

  it("keeps repeated public visual modules from using h1 for styling", () => {
    const presentationalHeadingFiles = [
      ...findTsxFiles("src/components/modules/hero"),
      "src/components/animations/TransitionGroup.tsx",
      "src/components/views/DesktopArticleView.tsx",
      "src/components/views/ArtworkView.tsx",
      "src/components/elements/typography/BlogSectionHeading.tsx",
      "src/components/modules/sidebar/BlogSidebar.tsx",
      "src/components/modules/pagination/ScrollableArtworkPagination.tsx",
      "src/components/sections/BlogSectionContinuous.tsx",
      "src/components/sections/BlogSectionSplitScreen.tsx",
      "src/components/sections/BlogSectionTiles.tsx",
      "src/components/sections/BlogsSectionFeatured.tsx",
      "src/components/sections/ProjectSection.tsx",
      "src/components/modules/cards/ArtworkInfoCardVariations.tsx",
      "src/components/modules/cards/ArtworkMagazineCard.tsx",
      "src/components/modules/cards/BiographyCard.tsx",
      "src/components/modules/cards/BlogFeedCard.tsx",
      "src/components/modules/cards/CollectionFeedCard.tsx",
      "src/components/modules/cards/CollectionMagazineCards.tsx",
    ];

    for (const sourcePath of presentationalHeadingFiles) {
      expect(stripComments(readRepoFile(sourcePath))).not.toMatch(/<\/?h1\b/);
    }
  });
});

import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const listAppSourceFiles = (directory = "src/app"): string[] =>
  readdirSync(path.join(process.cwd(), directory)).flatMap((entry) => {
    const relativePath = path.join(directory, entry);
    const absolutePath = path.join(process.cwd(), relativePath);

    if (statSync(absolutePath).isDirectory()) {
      return listAppSourceFiles(relativePath);
    }

    return /\.(ts|tsx)$/.test(entry) ? [relativePath] : [];
  });

const explicitDynamicPublicRoutes = [
  "src/app/page.tsx",
  "src/app/artwork/page.tsx",
  "src/app/artwork/[artworkId]/page.tsx",
  "src/app/biography/[slug]/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/collections/[slug]/page.tsx",
  "src/app/collections/[slug]/[artworkId]/page.tsx",
  "src/app/project/contact/page.tsx",
  "src/app/search/page.tsx",
  "src/app/shop/products/page.tsx",
  "src/app/shop/products/[productHandle]/page.tsx",
];

const stableStaticShellRoutes = [
  "src/app/project/page.tsx",
  "src/app/project/about/page.tsx",
  "src/app/project/aims/page.tsx",
  "src/app/project/film/page.tsx",
  "src/app/shop/page.tsx",
];

const acceptedRevalidatedShellRoutes = [
  {
    sourcePath: "src/app/biography/page.tsx",
    revalidateSource: "BIOGRAPHY_CACHE_REVALIDATE_SECONDS",
    cachedService: "getCachedBiographyNavigationList",
    cacheConstant: "BIOGRAPHY_CACHE_REVALIDATE_SECONDS",
  },
  {
    sourcePath: "src/app/collections/page.tsx",
    revalidateSource: "COLLECTION_NAVIGATION_CACHE_REVALIDATE_SECONDS",
    cachedService: "getCachedCollectionNavigationList",
    cacheConstant: "COLLECTION_NAVIGATION_CACHE_REVALIDATE_SECONDS",
  },
];

const acceptedRevalidatedDiscoveryRoutes = [
  {
    sourcePath: "src/app/sitemap.ts",
    revalidateSource: "SITEMAP_REVALIDATE_SECONDS",
    revalidateSeconds: "3600",
  },
];

describe("public route cache policy", () => {
  it("keeps route-local dynamic public pages explicit without ISR promises", () => {
    for (const sourcePath of explicitDynamicPublicRoutes) {
      const source = readRepoFile(sourcePath);

      expect(source.trimStart()).not.toMatch(/^"use server";/);
      expect(source).toContain('export const dynamic = "force-dynamic";');
      expect(source).not.toMatch(/export const revalidate\b/);
      expect(source).not.toMatch(/generateStaticParams/);
    }
  });

  it("keeps stable public shell routes free of forced dynamic config", () => {
    for (const sourcePath of stableStaticShellRoutes) {
      const source = readRepoFile(sourcePath);

      expect(source).not.toMatch(/export const dynamic = "force-dynamic"/);
      expect(source).not.toMatch(/export const revalidate\b/);
      expect(source).not.toMatch(/generateStaticParams/);
    }
  });

  it("allows only default redirect proof shells to declare the accepted 10-minute revalidate", () => {
    for (const {
      sourcePath,
      revalidateSource,
      cachedService,
      cacheConstant,
    } of acceptedRevalidatedShellRoutes) {
      const source = readRepoFile(sourcePath);

      expect(source).not.toMatch(/export const dynamic = "force-dynamic"/);
      expect(source).toContain(
        `export const revalidate = ${revalidateSource};`
      );
      expect(source).toContain(cachedService);
      expect(source).toContain(cacheConstant);
      expect(source).not.toMatch(/generateStaticParams/);
    }
  });

  it("allows sitemap to declare the accepted one-hour discovery revalidate", () => {
    for (const {
      sourcePath,
      revalidateSource,
      revalidateSeconds,
    } of acceptedRevalidatedDiscoveryRoutes) {
      const source = readRepoFile(sourcePath);

      expect(source).not.toMatch(/export const dynamic = "force-dynamic"/);
      expect(source).toContain(
        `export const ${revalidateSource} = ${revalidateSeconds};`
      );
      expect(source).toContain(
        `export const revalidate = ${revalidateSource};`
      );
      expect(source).toContain("getDynamicPublicSitemapEntries");
      expect(source).not.toMatch(/generateStaticParams/);
    }
  });

  it("prevents route-level revalidate drift outside accepted public surfaces", () => {
    const acceptedRevalidateSources = new Set([
      ...acceptedRevalidatedShellRoutes.map(({ sourcePath }) => sourcePath),
      ...acceptedRevalidatedDiscoveryRoutes.map(({ sourcePath }) => sourcePath),
    ]);

    const sourcesWithRouteRevalidate = listAppSourceFiles().filter((sourcePath) =>
      /export const revalidate\b/.test(readRepoFile(sourcePath))
    );

    expect(sourcesWithRouteRevalidate.sort()).toEqual(
      [...acceptedRevalidateSources].sort()
    );
  });

  it("keeps the global main navigation out of route-family cache proofs", () => {
    const source = readRepoFile(
      "src/components/loaders/componentLoaders/MainNavLoader.tsx"
    );

    expect(source).toContain("getArticleNavigationList");
    expect(source).toContain("getCollectionNavigationList");
    expect(source).not.toContain("getCachedBiographyNavigationList");
    expect(source).not.toContain("getCachedCollectionNavigationList");
  });

  it("documents the route matrix and deferred ISR ownership", () => {
    const source = readRepoFile(
      "docs/architecture/rendering-and-data-fetching.md"
    );

    expect(source).toContain("## Public Route Rendering And Cache Policy");
    expect(source).toContain("## Accepted Public Freshness Matrix");
    expect(source).toContain("| Stable static shell |");
    expect(source).toContain("| Query-driven public browse/search |");
    expect(source).toContain("| DB-backed public detail/redirect |");
    expect(source).toContain("| Shopify-backed public commerce |");
    expect(source).toContain("| Session-aware public UI |");
    expect(source).toContain("Only `/biography`, `/collections`, and `/sitemap.xml`");
    expect(source).toContain("generateStaticParams()` is deferred");
  });

  it("documents the accepted freshness policy for the current runtime proofs", () => {
    const source = readRepoFile(
      "docs/architecture/rendering-and-data-fetching.md"
    );

    expect(source).toContain("| Sitemap |");
    expect(source).toContain("| Default biography redirect |");
    expect(source).toContain("| Default collections redirect |");
    expect(source).toContain("| Blog list/detail |");
    expect(source).toContain("| Biography article list/detail |");
    expect(source).toContain("| Artwork browse/detail |");
    expect(source).toContain("| Search |");
    expect(source).toContain("| Shop listing/detail |");
    expect(source).toContain("| Session-aware UI |");
    expect(source).toContain("T-233 first proof route: biography");
    expect(source).toContain("T-238 second proof route: collections");
    expect(source).toContain("T-239 makes sitemap one-hour ISR source-owned");
    expect(source).toContain("cached non-`fetch` service wrappers");
    expect(source).toContain(
      "Do not add `generateStaticParams()` in the first proof"
    );
    expect(source).toContain(
      "`/collections/[slug]` and `/collections/[slug]/[artworkId]` remain explicitly dynamic"
    );
  });
});

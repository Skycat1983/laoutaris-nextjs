import { readFileSync } from "fs";
import path from "path";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

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
  "src/app/biography/page.tsx",
  "src/app/collections/page.tsx",
  "src/app/project/page.tsx",
  "src/app/project/about/page.tsx",
  "src/app/project/aims/page.tsx",
  "src/app/project/film/page.tsx",
  "src/app/shop/page.tsx",
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

  it("documents the route matrix and deferred ISR ownership", () => {
    const source = readRepoFile("docs/architecture/rendering-and-data-fetching.md");

    expect(source).toContain("## Public Route Rendering And Cache Policy");
    expect(source).toContain("| Stable static shell |");
    expect(source).toContain("| Query-driven public browse/search |");
    expect(source).toContain("| DB-backed public detail/redirect |");
    expect(source).toContain("| Shopify-backed public commerce |");
    expect(source).toContain("| Session-aware public UI |");
    expect(source).toContain("No public route uses `revalidate`");
    expect(source).toContain("generateStaticParams()` is deferred");
  });
});

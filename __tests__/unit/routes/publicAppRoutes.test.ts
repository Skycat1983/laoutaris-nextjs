import { readFileSync } from "fs";
import path from "path";
import {
  articleDetailPath,
  artworkDetailPath,
  blogDetailPath,
  collectionArtworkPath,
  collectionDetailPath,
  productDetailPath,
  publicAppRoutes,
} from "@/lib/routes/publicAppRoutes";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("public app routes", () => {
  it("exports stable public root paths for the first route-builder slice", () => {
    expect(publicAppRoutes).toEqual({
      home: "/",
      artwork: "/artwork",
      biography: "/biography",
      collections: "/collections",
      blog: "/blog",
      project: "/project",
      shop: "/shop",
      shopProducts: "/shop/products",
      search: "/search",
      privacy: "/privacy",
      terms: "/terms",
      signIn: "/sign-in",
    });
  });

  it("builds encoded public detail paths", () => {
    expect(articleDetailPath("early life")).toBe("/biography/early%20life");
    expect(blogDetailPath("studio/news")).toBe("/blog/studio%2Fnews");
    expect(artworkDetailPath("figure #1")).toBe("/artwork/figure%20%231");
    expect(productDetailPath("blue print/large")).toBe(
      "/shop/products/blue%20print%2Flarge"
    );
    expect(collectionDetailPath("works on paper")).toBe(
      "/collections/works%20on%20paper"
    );
    expect(collectionArtworkPath("works/on-paper", "figure #1")).toBe(
      "/collections/works%2Fon-paper/figure%20%231"
    );
  });

  it("stays client-safe and value-only", () => {
    const source = readRepoFile("src/lib/routes/publicAppRoutes.ts");

    expect(source).not.toContain("server-only");
    expect(source).not.toMatch(/^\s*import\s/m);
  });
});

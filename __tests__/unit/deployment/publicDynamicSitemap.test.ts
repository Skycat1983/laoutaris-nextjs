jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("@/lib/db/mongodb", () => jest.fn());

jest.mock("@/lib/data/models/articleModel", () => ({
  ArticleModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/artworkModel", () => ({
  ArtworkModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/blogModel", () => ({
  BlogModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/collectionModel", () => ({
  CollectionModel: {
    find: jest.fn(),
  },
}));

jest.mock("@/lib/data/services/getShopProductList", () => ({
  getShopProductList: jest.fn(),
}));

import sitemap, { stablePublicSitemapRoutes } from "@/app/sitemap";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";
import { ArticleModel } from "@/lib/data/models/articleModel";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { BlogModel } from "@/lib/data/models/blogModel";
import { CollectionModel } from "@/lib/data/models/collectionModel";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import { getDynamicPublicSitemapEntries } from "@/lib/metadata/publicDynamicSitemap";

const queryWithLean = (rows: unknown[]) => ({
  select: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(rows),
});

const mockFind = (model: { find: unknown }, rows: unknown[]) => {
  (model.find as jest.Mock).mockReturnValue(queryWithLean(rows));
};

const mockShopProducts = (products: unknown[]) => {
  (getShopProductList as jest.Mock).mockResolvedValue({
    success: true,
    data: products,
    metadata: {
      totalArtworks: products.length,
      totalProducts: products.length,
    },
  });
};

describe("dynamic public sitemap", () => {
  const artworkId = "665f11111111111111111111";
  const updatedAt = new Date("2026-05-18T10:00:00.000Z");

  beforeEach(() => {
    jest.clearAllMocks();
    mockFind(ArticleModel, []);
    mockFind(BlogModel, []);
    mockFind(ArtworkModel, []);
    mockFind(CollectionModel, []);
    mockShopProducts([]);
  });

  it("includes stable and current dynamic public detail URLs once", async () => {
    mockFind(ArticleModel, [
      { slug: "studio-notes", updatedAt },
      { slug: "" },
      { slug: "admin/escape" },
    ]);
    mockFind(BlogModel, [
      { slug: "gallery-news", updatedAt },
      { slug: "bad?query" },
    ]);
    mockFind(ArtworkModel, [
      { _id: artworkId, updatedAt },
      { _id: "bad/id" },
    ]);
    mockFind(CollectionModel, [
      {
        slug: "studio-collection",
        artworks: [artworkId, artworkId, "bad/id"],
        updatedAt,
      },
      { slug: "", artworks: [artworkId] },
    ]);
    mockShopProducts([
      { handle: "blue-figure-print" },
      { handle: "blue-figure-print" },
      { handle: "bad/handle" },
    ]);

    const entries = await sitemap();
    const urls = entries.map(({ url }) => url);

    expect(urls.slice(0, stablePublicSitemapRoutes.length)).toEqual(
      stablePublicSitemapRoutes.map(({ path }) => getPublicSitePathUrl(path))
    );
    expect(urls).toEqual(
      expect.arrayContaining([
        getPublicSitePathUrl("/biography/studio-notes"),
        getPublicSitePathUrl("/blog/gallery-news"),
        getPublicSitePathUrl(`/artwork/${artworkId}`),
        getPublicSitePathUrl("/collections/studio-collection"),
        getPublicSitePathUrl(`/collections/studio-collection/${artworkId}`),
        getPublicSitePathUrl("/shop/products/blue-figure-print"),
      ])
    );
    expect(
      urls.filter(
        (url) => url === getPublicSitePathUrl("/shop/products/blue-figure-print")
      )
    ).toHaveLength(1);
    expect(
      urls.filter(
        (url) => url === getPublicSitePathUrl(`/collections/studio-collection/${artworkId}`)
      )
    ).toHaveLength(1);
    expect(urls.join("\n")).not.toMatch(
      /admin%2Fescape|bad%3Fquery|bad%2Fid|bad%2Fhandle/
    );
    expect(urls).not.toEqual(
      expect.arrayContaining([
        getPublicSitePathUrl("/admin"),
        getPublicSitePathUrl("/account"),
        getPublicSitePathUrl("/api"),
      ])
    );
  });

  it("keeps other dynamic entries when scoped sources fail", async () => {
    (BlogModel.find as jest.Mock).mockImplementation(() => {
      throw new Error("blog source failed");
    });
    (getShopProductList as jest.Mock).mockRejectedValue(
      new Error("shopify unavailable")
    );
    mockFind(ArticleModel, [{ slug: "studio-notes", updatedAt }]);
    mockFind(ArtworkModel, [{ _id: artworkId, updatedAt }]);

    const dynamicEntries = await getDynamicPublicSitemapEntries();
    const paths = dynamicEntries.map(({ path }) => path);

    expect(paths).toEqual(
      expect.arrayContaining([
        "/biography/studio-notes",
        `/artwork/${artworkId}`,
      ])
    );
    expect(paths).not.toContain("/blog/gallery-news");
    expect(paths).not.toContain("/shop/products/blue-figure-print");

    const entries = await sitemap();
    const urls = entries.map(({ url }) => url);

    expect(urls).toEqual(
      expect.arrayContaining([
        getPublicSitePathUrl("/"),
        getPublicSitePathUrl("/biography/studio-notes"),
        getPublicSitePathUrl(`/artwork/${artworkId}`),
      ])
    );
  });
});

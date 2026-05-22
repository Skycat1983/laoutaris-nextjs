import fs from "fs";
import path from "path";
import React from "react";
import type { ReactElement } from "react";
import { CollectionArtworkLoader } from "@/components/loaders/viewLoaders/CollectionArtworkLoader";
import { ArtworkView } from "@/components/views";
import { getArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import type {
  ArtworkFrontend,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/lib/data/services/getCollectionArtwork", () => ({
  getCollectionArtwork: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkShopProducts", () => ({
  getArtworkShopProducts: jest.fn(),
}));

jest.mock("@/components/views", () => ({
  ArtworkView: jest.fn(() => null),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const mockGetCollectionArtwork = getCollectionArtwork as jest.MockedFunction<
  typeof getCollectionArtwork
>;
const mockGetArtworkShopProducts = getArtworkShopProducts as jest.MockedFunction<
  typeof getArtworkShopProducts
>;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

type ArtworkFixture = ArtworkFrontend & {
  shopifyProducts: NonNullable<ArtworkFrontend["shopifyProducts"]>;
};
type CollectionFixture = CollectionFrontendPopulated & {
  slug: string;
  artworks: ArtworkFixture[];
};

const artwork = {
  _id: "64f1f77bcf86cd7994390111",
  title: "Blue Study",
  shopifyProducts: [{ productId: "101", type: "print" }],
} as ArtworkFixture;
const shopProducts = {
  original: null,
  prints: [],
  books: [],
};

describe("CollectionArtworkLoader", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsNextError.mockReturnValue(false);
    mockGetCollectionArtwork.mockResolvedValue({
      status: "found",
      collection: {
        slug: "paintings",
        artworks: [artwork],
      } as CollectionFixture,
    });
    mockGetArtworkShopProducts.mockResolvedValue(shopProducts);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders the selected collection artwork through the server service without same-app fetches", async () => {
    const element = (await CollectionArtworkLoader({
      slug: "paintings",
      artworkId: "64f1f77bcf86cd7994390111",
    })) as ReactElement<{ children: ReactElement }>;

    expect(mockGetCollectionArtwork).toHaveBeenCalledWith(
      "paintings",
      "64f1f77bcf86cd7994390111"
    );
    expect(mockGetArtworkShopProducts).toHaveBeenCalledWith(
      artwork.shopifyProducts
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(React.Fragment);
    expect(element.props.children.type).toBe(ArtworkView);
    expect(element.props.children.props).toEqual({
      ...artwork,
      shopProducts,
    });
  });

  it("calls notFound for missing collection artwork results", async () => {
    mockGetCollectionArtwork.mockResolvedValue({
      status: "artwork-not-found",
      collection: null,
    });

    await expect(
      CollectionArtworkLoader({
        slug: "paintings",
        artworkId: "missing-artwork",
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(mockGetArtworkShopProducts).not.toHaveBeenCalled();
  });

  it("throws an error-boundary failure for non-Next loading failures", async () => {
    const error = new Error("private collection artwork failure");
    mockGetCollectionArtwork.mockRejectedValue(error);

    await expect(
      CollectionArtworkLoader({
        slug: "paintings",
        artworkId: "64f1f77bcf86cd7994390111",
      })
    ).rejects.toThrow("Failed to fetch collection artwork");

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.collection_artwork.failed",
        component: "CollectionArtworkLoader",
        operation: "public.collection_artwork.loader",
        slug: "paintings",
        hasArtworkId: true,
        error: {
          name: "Error",
          message: "private collection artwork failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders the artwork with empty shop products when linked product loading fails", async () => {
    mockGetArtworkShopProducts.mockRejectedValue(
      new Error("private Shopify link failure")
    );

    const element = (await CollectionArtworkLoader({
      slug: "paintings",
      artworkId: "64f1f77bcf86cd7994390111",
    })) as ReactElement<{ children: ReactElement }>;

    expect(element.props.children.type).toBe(ArtworkView);
    expect(element.props.children.props.shopProducts).toEqual({
      original: null,
      prints: [],
      books: [],
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.collection_artwork.shop_products.failed",
        component: "CollectionArtworkLoader",
        operation: "public.collection_artwork.loader",
        slug: "paintings",
        hasArtworkId: true,
        error: {
          name: "Error",
          message: "private Shopify link failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_NOT_FOUND");
    mockGetCollectionArtwork.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(
      CollectionArtworkLoader({
        slug: "paintings",
        artworkId: "64f1f77bcf86cd7994390111",
      })
    ).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP dependencies", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx"
      ),
      "utf8"
    );

    const retiredPublicApiName = ["server", "PublicApi"].join("");

    expect(source).not.toMatch(
      new RegExp(
        `${retiredPublicApiName}|serverApi|singleCollectionSingleArtwork|fetch\\(`
      )
    );
  });
});

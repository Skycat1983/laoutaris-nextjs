import fs from "fs";
import path from "path";
import React, { type ReactElement } from "react";
import ArtworkLoader from "@/components/loaders/viewLoaders/ArtworkLoader";
import { SubscribeSection } from "@/components/sections/SubscribeSection";
import { ArtworkView } from "@/components/views/ArtworkView";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";
import type { ArtworkFrontend } from "@/lib/data/types";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkShopProducts", () => ({
  getArtworkShopProducts: jest.fn(),
}));

jest.mock("@/components/views/ArtworkView", () => ({
  ArtworkView: jest.fn(() => null),
}));

jest.mock("@/components/sections/SubscribeSection", () => ({
  SubscribeSection: jest.fn(() => null),
}));

const mockGetArtworkById = getArtworkById as jest.MockedFunction<
  typeof getArtworkById
>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;
const mockGetArtworkShopProducts = getArtworkShopProducts as jest.MockedFunction<
  typeof getArtworkShopProducts
>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

const artworkId = "507f1f77bcf86cd799439011";
type ArtworkFixture = ArtworkFrontend & {
  shopifyProducts: NonNullable<ArtworkFrontend["shopifyProducts"]>;
};
const artwork = {
  _id: artworkId,
  title: "Archive Artwork",
  slug: "archive-artwork",
  shopifyProducts: [{ productId: "101", type: "original" }],
} as unknown as ArtworkFixture;
const shopProducts = {
  original: null,
  prints: [],
  books: [],
};

const getOnlyChild = (element: ReactElement): ReactElement => {
  return React.Children.only(element.props.children) as ReactElement;
};

describe("ArtworkLoader", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue("user-123");
    mockGetArtworkById.mockResolvedValue(artwork);
    mockGetArtworkShopProducts.mockResolvedValue(shopProducts);
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    expect(consoleLogSpy).not.toHaveBeenCalled();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("renders artwork detail from the server service without same-app fetches or result logs", async () => {
    const element = (await ArtworkLoader({
      params: { id: artworkId },
    })) as ReactElement<{ children: React.ReactNode }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];
    const artworkWrapper = children[0] as ReactElement<{
      className: string;
      children: ReactElement;
    }>;
    const subscribeWrapper = children[1] as ReactElement<{
      className: string;
      children: ReactElement;
    }>;
    const artworkElement = getOnlyChild(artworkWrapper);
    const subscribeElement = getOnlyChild(subscribeWrapper);

    expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
    expect(mockGetArtworkById).toHaveBeenCalledWith(artworkId, "user-123");
    expect(mockGetArtworkShopProducts).toHaveBeenCalledWith(
      artwork.shopifyProducts
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(React.Fragment);
    expect(artworkWrapper.props.className).toBe("py-16");
    expect(artworkElement.type).toBe(ArtworkView);
    expect(artworkElement.props).toEqual({
      ...artwork,
      shopProducts,
    });
    expect(subscribeWrapper.props.className).toBe("pt-16");
    expect(subscribeElement.type).toBe(SubscribeSection);
    expect(subscribeElement.props).toEqual({ isLoggedIn: false });
  });

  it("passes anonymous user context through to the artwork service", async () => {
    mockGetUserIdFromSession.mockResolvedValue(null);

    await ArtworkLoader({ params: { id: artworkId } });

    expect(mockGetArtworkById).toHaveBeenCalledWith(artworkId, null);
    expect(mockGetArtworkShopProducts).toHaveBeenCalledWith(
      artwork.shopifyProducts
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls notFound when the artwork service returns null", async () => {
    mockGetArtworkById.mockResolvedValue(null);

    await expect(
      ArtworkLoader({ params: { id: "missing-artwork" } })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockGetArtworkById).toHaveBeenCalledWith(
      "missing-artwork",
      "user-123"
    );
    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockGetArtworkShopProducts).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("converts artwork service errors to the generic loader failure", async () => {
    mockGetArtworkById.mockRejectedValue(new Error("private database detail"));

    await expect(
      ArtworkLoader({ params: { id: artworkId } })
    ).rejects.toThrow("Failed to fetch artwork");

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders the artwork with empty shop products when linked product loading fails", async () => {
    mockGetArtworkShopProducts.mockRejectedValue(
      new Error("private Shopify link failure")
    );

    const element = (await ArtworkLoader({
      params: { id: artworkId },
    })) as ReactElement<{ children: React.ReactNode }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];
    const artworkElement = getOnlyChild(children[0] as ReactElement);

    expect(artworkElement.type).toBe(ArtworkView);
    expect(artworkElement.props.shopProducts).toEqual({
      original: null,
      prints: [],
      books: [],
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.artwork.shop_products.failed",
        component: "ArtworkLoader",
        operation: "public.artwork.loader",
        hasArtworkId: true,
        error: {
          name: "Error",
          message: "private Shopify link failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP or debug-only loader dependencies", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/viewLoaders/ArtworkLoader.tsx"
      ),
      "utf8"
    );

    const retiredPublicApiName = ["server", "PublicApi"].join("");

    expect(source).not.toMatch(
      new RegExp(
        `${retiredPublicApiName}|serverApi|\\.single\\(|fetch\\(|console\\.log|delay\\(`
      )
    );
  });
});

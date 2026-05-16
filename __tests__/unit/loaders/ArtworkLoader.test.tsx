import fs from "fs";
import path from "path";
import React, { type ReactElement } from "react";
import ArtworkLoader from "@/components/loaders/viewLoaders/ArtworkLoader";
import { SubscribeSection } from "@/components/sections";
import { ArtworkView } from "@/components/views";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/components/views", () => ({
  ArtworkView: jest.fn(() => null),
}));

jest.mock("@/components/sections", () => ({
  SubscribeSection: jest.fn(() => null),
}));

const mockGetArtworkById = getArtworkById as jest.MockedFunction<
  typeof getArtworkById
>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;

const artworkId = "507f1f77bcf86cd799439011";
const artwork = {
  _id: artworkId,
  title: "Archive Artwork",
  slug: "archive-artwork",
} as never;

const getOnlyChild = (element: ReactElement): ReactElement => {
  return React.Children.only(element.props.children) as ReactElement;
};

describe("ArtworkLoader", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue("user-123");
    mockGetArtworkById.mockResolvedValue(artwork);
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    expect(consoleLogSpy).not.toHaveBeenCalled();
    consoleLogSpy.mockRestore();
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
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(React.Fragment);
    expect(artworkWrapper.props.className).toBe("py-16");
    expect(artworkElement.type).toBe(ArtworkView);
    expect(artworkElement.props).toEqual(artwork);
    expect(subscribeWrapper.props.className).toBe("pt-16");
    expect(subscribeElement.type).toBe(SubscribeSection);
    expect(subscribeElement.props).toEqual({ isLoggedIn: false });
  });

  it("passes anonymous user context through to the artwork service", async () => {
    mockGetUserIdFromSession.mockResolvedValue(null);

    await ArtworkLoader({ params: { id: artworkId } });

    expect(mockGetArtworkById).toHaveBeenCalledWith(artworkId, null);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the generic loader failure when the artwork service returns null", async () => {
    mockGetArtworkById.mockResolvedValue(null);

    await expect(
      ArtworkLoader({ params: { id: "missing-artwork" } })
    ).rejects.toThrow("Failed to fetch artwork");

    expect(mockGetArtworkById).toHaveBeenCalledWith(
      "missing-artwork",
      "user-123"
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("converts artwork service errors to the generic loader failure", async () => {
    mockGetArtworkById.mockRejectedValue(new Error("private database detail"));

    await expect(
      ArtworkLoader({ params: { id: artworkId } })
    ).rejects.toThrow("Failed to fetch artwork");

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

    expect(source).not.toMatch(
      /serverPublicApi|serverApi|\.single\(|fetch\(|console\.log|delay\(/
    );
  });
});

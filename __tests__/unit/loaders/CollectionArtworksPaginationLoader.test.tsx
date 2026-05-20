import fs from "fs";
import path from "path";
import React, { type ReactElement } from "react";
import { CollectionArtworksPaginationLoader } from "@/components/loaders/componentLoaders/CollectionArtworksPaginationLoader";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { getCollectionWithArtworks } from "@/lib/data/services/getCollectionWithArtworks";
import type {
  ArtworkFrontend,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/data/services/getCollectionWithArtworks", () => ({
  getCollectionWithArtworks: jest.fn(),
}));

jest.mock("@/components/modules/pagination/ScrollableArtworkPagination", () => ({
  ScrollableArtworkPagination: jest.fn(() => null),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const mockGetCollectionWithArtworks =
  getCollectionWithArtworks as jest.MockedFunction<
    typeof getCollectionWithArtworks
  >;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;

type ArtworkFixture = ArtworkFrontend & {
  _id: string;
  title: string;
};
type CollectionWithArtworksFixture = CollectionFrontendPopulated & {
  slug: string;
  artworks: ArtworkFixture[];
};

const createArtwork = (id: string) =>
  ({
    _id: id,
    title: id,
  }) as ArtworkFixture;

describe("CollectionArtworksPaginationLoader", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsNextError.mockReturnValue(false);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders linked collection artworks through the server service without same-app fetches", async () => {
    const artworks = [
      createArtwork("64f1f77bcf86cd7994390111"),
      createArtwork("64f1f77bcf86cd7994390112"),
    ];
    mockGetCollectionWithArtworks.mockResolvedValue({
      slug: "paintings",
      artworks,
    } as CollectionWithArtworksFixture);

    const element = (await CollectionArtworksPaginationLoader({
      slug: "paintings",
    })) as ReactElement<{ children: React.ReactNode }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];

    expect(mockGetCollectionWithArtworks).toHaveBeenCalledWith("paintings");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(React.Fragment);
    expect(children[0].type).toBe(ScrollableArtworkPagination);
    expect(children[0].props).toEqual({
      heading: "More from this collection",
      items: [
        {
          ...artworks[0],
          link: "/collections/paintings/64f1f77bcf86cd7994390111",
        },
        {
          ...artworks[1],
          link: "/collections/paintings/64f1f77bcf86cd7994390112",
        },
      ],
    });
    expect(children[1].type).toBe("div");
    expect(children[1].props.className).toBe("h-16");
  });

  it("returns null for non-Next missing collection results", async () => {
    mockGetCollectionWithArtworks.mockResolvedValue(null);

    await expect(
      CollectionArtworksPaginationLoader({ slug: "missing" })
    ).resolves.toBeNull();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.collection_artworks_pagination.failed",
        component: "CollectionArtworksPaginationLoader",
        operation: "public.collection_artworks_pagination.loader",
        slug: "missing",
        error: {
          name: "Error",
          message: "Failed to fetch collection artworks navigation",
        },
      })
    );
  });

  it("returns null for non-Next loading failures", async () => {
    const error = new Error("private collection artworks failure");
    mockGetCollectionWithArtworks.mockRejectedValue(error);

    await expect(
      CollectionArtworksPaginationLoader({ slug: "paintings" })
    ).resolves.toBeNull();

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetCollectionWithArtworks.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(
      CollectionArtworksPaginationLoader({ slug: "paintings" })
    ).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP dependencies", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx"
      ),
      "utf8"
    );

    const retiredPublicApiName = ["server", "PublicApi"].join("");

    expect(source).not.toMatch(
      new RegExp(
        `${retiredPublicApiName}|serverApi|singleCollectionAllArtwork|fetch\\(`
      )
    );
  });
});

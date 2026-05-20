import type { ReactElement } from "react";
import { CollectionsSubnavLoader } from "@/components/loaders/componentLoaders/CollectionsSubnavLoader";
import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import type {
  CollectionNavDataFrontend,
  ListResult,
} from "@/lib/data/types";

jest.mock("@/lib/data/services/getCollectionNavigationList", () => ({
  getCollectionNavigationList: jest.fn(),
}));

jest.mock("@/components/modules/navigation/subnav/Subnav", () => ({
  Subnav: jest.fn(() => null),
}));

const mockGetCollectionNavigationList =
  getCollectionNavigationList as jest.MockedFunction<
    typeof getCollectionNavigationList
  >;

const createCollectionNavItem = ({
  slug,
  title,
  firstArtworkId = null,
  hasArtwork = firstArtworkId !== null,
}: {
  slug: string;
  title: string;
  firstArtworkId?: CollectionNavDataFrontend["firstArtworkId"];
  hasArtwork?: boolean;
}): CollectionNavDataFrontend => ({
  _id: `collection-${slug}`,
  title,
  slug,
  artworks: [],
  firstArtworkId,
  hasArtwork,
});

const createCollectionNavResult = (
  data: CollectionNavDataFrontend[]
): ListResult<CollectionNavDataFrontend> => ({
  success: true,
  data,
  metadata: {
    page: 1,
    limit: data.length,
    total: data.length,
    totalPages: data.length ? 1 : 0,
  },
});

describe("CollectionsSubnavLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCollectionNavigationList.mockResolvedValue(
      createCollectionNavResult([
        createCollectionNavItem({
          title: "Paintings",
          slug: "paintings",
          firstArtworkId: "artwork-1",
        }),
        createCollectionNavItem({
          title: "Drawings",
          slug: "drawings",
          hasArtwork: false,
        }),
      ])
    );
  });

  it("loads collection links through the server data service without same-app fetches", async () => {
    const element = (await CollectionsSubnavLoader({
      section: "collections",
    })) as ReactElement<{
      links: Array<{
        label: string;
        slug: string;
        link_to: string;
        disabled: false;
      }>;
    }>;

    expect(mockGetCollectionNavigationList).toHaveBeenCalledWith();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(Subnav);
    expect(element.props.links).toEqual([
      {
        label: "Paintings",
        slug: "paintings",
        link_to: "/collections/paintings/artwork-1",
        disabled: false,
      },
      {
        label: "Drawings",
        slug: "drawings",
        link_to: "/collections/drawings",
        disabled: false,
      },
    ]);
  });

  it("throws the existing no-results error when the service returns null", async () => {
    mockGetCollectionNavigationList.mockResolvedValue(null);

    await expect(
      CollectionsSubnavLoader({ section: "collections" })
    ).rejects.toThrow("No collections found");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(Subnav).not.toHaveBeenCalled();
  });
});

import type { ReactElement } from "react";
import ArtworkPage from "@/app/artwork/page";
import { ArtworkListLoader } from "@/components/loaders/viewLoaders/ArtworkListLoader";

jest.mock("@/components/loaders/viewLoaders/ArtworkListLoader", () => ({
  ArtworkListLoader: jest.fn(() => null),
}));

const getLoaderElement = async (
  searchParams: Parameters<typeof ArtworkPage>[0]["searchParams"]
) => {
  const element = (await ArtworkPage({ searchParams })) as ReactElement;
  const children = element.props.children as ReactElement[];

  return children[1];
};

describe("/artwork page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses shared artwork query defaults for the initial loader props", async () => {
    const loaderElement = await getLoaderElement({});

    expect(loaderElement.type).toBe(ArtworkListLoader);
    expect(loaderElement.props).toEqual({
      initialSort: {
        by: "mostRecent",
        color: undefined,
      },
      initialFilters: {
        decade: [],
        artstyle: [],
        medium: [],
        surface: [],
        filterMode: "ALL",
        page: 1,
        limit: 10,
      },
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("normalizes valid page search params through the shared artwork query schema", async () => {
    const loaderElement = await getLoaderElement({
      filterMode: "ANY",
      sortBy: "colorProximity",
      sortColor: "#111111",
      page: "2",
      limit: "50",
      decade: ["1970s", "1980s"],
      artstyle: "abstract",
      medium: ["oil", "acrylic"],
      surface: "canvas",
    });

    expect(loaderElement.props).toEqual({
      initialSort: {
        by: "colorProximity",
        color: "#111111",
      },
      initialFilters: {
        decade: ["1970s", "1980s"],
        artstyle: ["abstract"],
        medium: ["oil", "acrylic"],
        surface: ["canvas"],
        filterMode: "ANY",
        page: 2,
        limit: 50,
      },
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("falls back to safe defaults instead of passing invalid enum values to the loader", async () => {
    const loaderElement = await getLoaderElement({
      filterMode: "SOME",
      sortBy: "oldest",
      decade: "1970s",
      page: "2",
    });

    expect(loaderElement.props.initialSort).toEqual({
      by: "mostRecent",
      color: undefined,
    });
    expect(loaderElement.props.initialFilters).toEqual({
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
      filterMode: "ALL",
      page: 1,
      limit: 10,
    });
  });

  it("falls back to safe defaults instead of passing out-of-bounds pagination to the loader", async () => {
    const loaderElement = await getLoaderElement({
      page: "0",
      limit: "51",
    });

    expect(loaderElement.props.initialFilters).toEqual({
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
      filterMode: "ALL",
      page: 1,
      limit: 10,
    });
  });
});

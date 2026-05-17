import type { ReactElement } from "react";
import fs from "fs";
import path from "path";
import { CollectionsSectionLoader } from "@/components/loaders/sectionLoaders/CollectionSectionLoader";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/data/services/getCollectionList", () => ({
  getCollectionList: jest.fn(),
}));

jest.mock("@/components/sections/CollectionSection", () => ({
  CollectionSection: jest.fn(() => null),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const mockGetCollectionList = getCollectionList as jest.MockedFunction<
  typeof getCollectionList
>;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;

const createCollection = (slug: string) =>
  ({
    slug,
    title: slug,
    linkTo: `/collections/${slug}`,
  }) as never;

describe("CollectionsSectionLoader", () => {
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

  it("renders section collections through the server service without same-app fetches", async () => {
    const collections = [
      createCollection("paintings"),
      createCollection("drawings"),
    ];
    mockGetCollectionList.mockResolvedValue({
      success: true,
      data: collections,
      metadata: {
        page: 1,
        limit: 9,
        total: 2,
        totalPages: 1,
      },
    });

    const element = (await CollectionsSectionLoader()) as ReactElement<{
      collections: typeof collections;
    }>;

    expect(mockGetCollectionList).toHaveBeenCalledWith({
      section: "collections",
      limit: 9,
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(CollectionSection);
    expect(element.props).toEqual({ collections });
  });

  it("returns null when the section collection list is missing", async () => {
    mockGetCollectionList.mockResolvedValue(null);

    await expect(CollectionsSectionLoader()).resolves.toBeNull();

    expect(mockIsNextError).toHaveBeenCalledWith(expect.any(Error));
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Collections section loading failed:",
      expect.any(Error)
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(CollectionSection).not.toHaveBeenCalled();
  });

  it("returns null for non-Next loading failures", async () => {
    const error = new Error("private section failure");
    mockGetCollectionList.mockRejectedValue(error);

    await expect(CollectionsSectionLoader()).resolves.toBeNull();

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Collections section loading failed:",
      error
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(CollectionSection).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetCollectionList.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(CollectionsSectionLoader()).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP clients or direct fetches", () => {
    const loaderSource = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx"
      ),
      "utf8"
    );

    expect(loaderSource).not.toContain(["server", "PublicApi"].join(""));
    expect(loaderSource).not.toContain("serverApi");
    expect(loaderSource).not.toContain(".multiple(");
    expect(loaderSource).not.toContain("fetch(");
  });
});

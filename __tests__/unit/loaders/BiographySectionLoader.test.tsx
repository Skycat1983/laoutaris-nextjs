import type { ReactElement } from "react";
import fs from "fs";
import path from "path";
import { BiographySectionLoader } from "@/components/loaders/sectionLoaders/BiographySectionLoader";
import { BiographySection } from "@/components/sections/BiographySection";
import { getArticleList } from "@/lib/data/services/getArticleList";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/data/services/getArticleList", () => ({
  getArticleList: jest.fn(),
}));

jest.mock("@/components/sections/BiographySection", () => ({
  BiographySection: jest.fn(() => null),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const mockGetArticleList = getArticleList as jest.MockedFunction<
  typeof getArticleList
>;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;

const createArticle = (slug: string) =>
  ({
    slug,
    title: slug,
    linkTo: `/biography/${slug}`,
  }) as never;

describe("BiographySectionLoader", () => {
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

  it("renders biography articles through the server service without same-app fetches", async () => {
    const articles = [createArticle("early-life"), createArticle("studio")];
    mockGetArticleList.mockResolvedValue({
      success: true,
      data: articles,
      metadata: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    });

    const element = (await BiographySectionLoader()) as ReactElement<{
      articles: typeof articles;
    }>;

    expect(mockGetArticleList).toHaveBeenCalledWith({
      section: "biography",
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(BiographySection);
    expect(element.props).toEqual({ articles });
  });

  it("returns null when no biography articles exist", async () => {
    mockGetArticleList.mockResolvedValue(null);

    await expect(BiographySectionLoader()).resolves.toBeNull();

    expect(mockIsNextError).toHaveBeenCalledWith(expect.any(Error));
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Biography section loading failed:",
      expect.any(Error)
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BiographySection).not.toHaveBeenCalled();
  });

  it("returns null for non-Next loading failures", async () => {
    const error = new Error("private section failure");
    mockGetArticleList.mockRejectedValue(error);

    await expect(BiographySectionLoader()).resolves.toBeNull();

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Biography section loading failed:",
      error
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BiographySection).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetArticleList.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(BiographySectionLoader()).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP clients or direct fetches", () => {
    const loaderSource = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/sectionLoaders/BiographySectionLoader.tsx"
      ),
      "utf8"
    );

    expect(loaderSource).not.toContain(["server", "PublicApi"].join(""));
    expect(loaderSource).not.toContain("serverApi");
    expect(loaderSource).not.toContain(".multiple(");
    expect(loaderSource).not.toContain("fetch(");
  });
});

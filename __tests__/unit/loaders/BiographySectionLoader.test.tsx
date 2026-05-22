import type { ReactElement } from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
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

  it("renders an unavailable fallback when the biography article result is missing", async () => {
    mockGetArticleList.mockResolvedValue(null);

    render((await BiographySectionLoader()) as ReactElement);

    expect(mockIsNextError).toHaveBeenCalledWith(expect.any(Error));
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.biography_section.failed",
        component: "BiographySectionLoader",
        operation: "public.biography_section.loader",
        error: {
          name: "Error",
          message: "No articles found",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BiographySection).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("biography-section-unavailable")
    ).toHaveTextContent("Biography is temporarily unavailable");
    expect(screen.getByText("Biography:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read more/i })).toHaveAttribute(
      "href",
      "/biography"
    );
  });

  it("renders an empty fallback when no biography articles are available", async () => {
    mockGetArticleList.mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });

    render((await BiographySectionLoader()) as ReactElement);

    expect(mockIsNextError).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BiographySection).not.toHaveBeenCalled();
    expect(screen.getByTestId("biography-section-empty")).toHaveTextContent(
      "No biography entries are available yet"
    );
  });

  it("renders an unavailable fallback for non-Next loading failures", async () => {
    const error = new Error("private section failure");
    mockGetArticleList.mockRejectedValue(error);

    render((await BiographySectionLoader()) as ReactElement);

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.biography_section.failed",
        error: {
          name: "Error",
          message: "private section failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BiographySection).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("biography-section-unavailable")
    ).toHaveTextContent("Biography is temporarily unavailable");
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

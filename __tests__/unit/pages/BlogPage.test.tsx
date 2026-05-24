import type { ReactElement } from "react";
import BlogPage from "@/app/blog/page";
import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";

jest.mock("@/components/loaders/viewLoaders/BlogListLoader", () => ({
  BlogListLoader: jest.fn(() => null),
}));

const getLoaderElement = async (
  searchParams: Parameters<typeof BlogPage>[0]["searchParams"]
) => {
  const element = (await BlogPage({ searchParams })) as ReactElement;
  const children = element.props.children as ReactElement[];
  const suspenseElement = children[1] as ReactElement;

  return suspenseElement.props.children as ReactElement;
};

describe("/blog page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes valid sorted query values to the blog list loader", async () => {
    const loaderElement = await getLoaderElement({
      sortby: "popular",
      page: "3",
    });

    expect(loaderElement.type).toBe(BlogListLoader);
    expect(loaderElement.props).toEqual({
      sortby: "popular",
      page: 3,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("falls back to grouped blog behavior for unknown sort values", async () => {
    const loaderElement = await getLoaderElement({
      sortby: "pinned",
      page: "2",
    });

    expect(loaderElement.props).toEqual({
      sortby: undefined,
      page: 2,
    });
  });

  it.each([
    ["missing", {}, 1],
    ["blank", { page: "" }, 1],
    ["malformed", { page: "not-a-page" }, 1],
    ["fractional", { page: "2.5" }, 1],
    ["negative", { page: "-4" }, 1],
    ["zero", { page: "0" }, 1],
    ["oversized", { page: "1001" }, 1000],
  ])("normalizes %s page values before rendering the loader", async (
    _label,
    query,
    expectedPage
  ) => {
    const loaderElement = await getLoaderElement({
      sortby: "latest",
      ...query,
    });

    expect(loaderElement.props).toEqual({
      sortby: "latest",
      page: expectedPage,
    });
  });
});

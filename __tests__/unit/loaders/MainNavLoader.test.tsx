import { readFileSync } from "fs";
import path from "path";
import type { ReactElement } from "react";
import {
  getMainNavLinks,
  MainNavLoader,
} from "@/components/loaders/componentLoaders/MainNavLoader";
import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";

jest.mock("@/components/modules/navigation/mainNav/MainNav", () => ({
  MainNav: jest.fn(() => null),
}));

type MainNavElement = ReactElement<{
  navLinks: Array<{
    label: string;
    path: string;
  }>;
}>;

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const expectedStaticNavLinks = [
  { label: "Artwork", path: "/artwork" },
  { label: "Biography", path: "/biography" },
  { label: "Collections", path: "/collections" },
  { label: "Blog", path: "/blog" },
  { label: "Project", path: "/project/about" },
  { label: "Shop", path: "/shop" },
];

const renderMainNavLoader = () => MainNavLoader() as MainNavElement;

describe("MainNavLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders static route-root links for the global header navigation", () => {
    const element = renderMainNavLoader();

    expect(element.type).toBe(MainNav);
    expect(element.props.navLinks).toEqual(expectedStaticNavLinks);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns fresh link objects so callers cannot mutate the shared contract", () => {
    const firstCall = getMainNavLinks();
    const secondCall = getMainNavLinks();

    expect(firstCall).toEqual(expectedStaticNavLinks);
    expect(secondCall).toEqual(expectedStaticNavLinks);
    expect(firstCall).not.toBe(secondCall);
    expect(firstCall[0]).not.toBe(secondCall[0]);
  });

  it("keeps root header navigation free of live navigation service reads", () => {
    const source = readRepoFile(
      "src/components/loaders/componentLoaders/MainNavLoader.tsx"
    );

    expect(source).toContain("@/lib/routes/publicAppRoutes");
    expect(source).not.toContain("@/lib/utils/urlUtils");
    expect(source).not.toContain("getArticleNavigationList");
    expect(source).not.toContain("getCollectionNavigationList");
    expect(source).not.toMatch(/createServerLogger|dbConnect|mongoose|fetch\(/);
  });
});

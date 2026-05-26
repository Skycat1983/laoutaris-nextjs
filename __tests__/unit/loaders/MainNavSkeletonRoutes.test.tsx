import { render } from "@testing-library/react";
import { MainNavSkeleton } from "@/components/modules/navigation/mainNav/MainNav";
import { DesktopNavLayout } from "@/components/modules/navigation/mainNav/DesktopNavLayout";
import { MobileNavLayout } from "@/components/modules/navigation/mainNav/MobileNavLayout";
import { TabletNavLayout } from "@/components/modules/navigation/mainNav/TabletNavLayout";

jest.mock("@/components/modules/navigation/mainNav/MobileNavLayout", () => ({
  MobileNavLayout: jest.fn(() => null),
}));

jest.mock("@/components/modules/navigation/mainNav/TabletNavLayout", () => ({
  TabletNavLayout: jest.fn(() => null),
}));

jest.mock("@/components/modules/navigation/mainNav/DesktopNavLayout", () => ({
  DesktopNavLayout: jest.fn(() => null),
}));

const expectedDisabledSkeletonLinks = [
  { label: "Artwork", path: "/artwork", disabled: true },
  { label: "Biography", path: "/biography", disabled: true },
  { label: "Collections", path: "/collections", disabled: true },
  { label: "Blog", path: "/blog", disabled: true },
  { label: "Project", path: "/project", disabled: true },
  { label: "Shop", path: "/shop", disabled: true },
];

describe("MainNavSkeleton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the public app route constants for disabled skeleton links", () => {
    render(<MainNavSkeleton />);

    expect(MobileNavLayout).toHaveBeenCalledWith(
      { navLinks: expectedDisabledSkeletonLinks },
      {}
    );
    expect(TabletNavLayout).toHaveBeenCalledWith(
      { navLinks: expectedDisabledSkeletonLinks },
      {}
    );
    expect(DesktopNavLayout).toHaveBeenCalledWith(
      { navLinks: expectedDisabledSkeletonLinks },
      {}
    );
  });
});

import { render } from "@testing-library/react";
import { MainNavSkeleton } from "@/components/modules/navigation/mainNav/MainNav";
import { PrototypeMainNav } from "@/components/modules/navigation/prototypeMainNav/PrototypeMainNav";

jest.mock(
  "@/components/modules/navigation/prototypeMainNav/PrototypeMainNav",
  () => ({
    PrototypeMainNav: jest.fn(() => null),
  })
);

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

    expect(PrototypeMainNav).toHaveBeenCalledWith(
      { navLinks: expectedDisabledSkeletonLinks },
      {}
    );
  });
});

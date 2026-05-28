import { fireEvent, render, screen } from "@testing-library/react";
import { HomePrototype } from "@/components/prototypes/home/HomePrototype";

jest.mock("@/components/prototypes/home/BiographyPrototypeSection", () => ({
  BiographyPrototypeSection: () => <section data-testid="biography-section" />,
}));

jest.mock("@/components/prototypes/home/BlogPrototypeSection", () => ({
  BlogPrototypeSection: () => <section data-testid="blog-section" />,
}));

jest.mock("@/components/prototypes/home/CollectionPrototypeSection", () => ({
  CollectionPrototypeSection: () => (
    <section data-testid="collection-section" />
  ),
}));

jest.mock("@/components/prototypes/home/ProjectPrototypeSection", () => ({
  ProjectPrototypeSection: () => <section data-testid="project-section" />,
}));

jest.mock("@/components/prototypes/home/PrototypeSectionPlaceholder", () => ({
  PrototypeSectionPlaceholder: ({ id }: { id: string }) => (
    <section data-testid={`${id}-placeholder`} />
  ),
}));

jest.mock("@/components/prototypes/home/ShopPrototypeSection", () => ({
  shopProductSizePresets: {
    large: { label: "Large artwork" },
    larger: { label: "Larger artwork" },
    feature: { label: "Feature artwork" },
  },
  ShopPrototypeSection: () => <section data-testid="shop-section" />,
}));

describe("prototype home navbar controls", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty("--prototype-main-nav-height");
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-logo-height"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-logo-width"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-mobile-logo-height"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-mobile-logo-width"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-padding-y"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-padding-x"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-gap"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-gap-wide"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-font-size"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-font-size-wide"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-font-family"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-font-weight"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-font-style"
    );
    document.documentElement.style.removeProperty(
      "--prototype-main-nav-link-letter-spacing"
    );
    document.documentElement.style.removeProperty("--prototype-main-nav-bg");
    delete document.documentElement.dataset.prototypeMainNavLogo;
  });

  it("defaults to the first prototype logo and retained hidden prototype defaults", () => {
    render(<HomePrototype />);

    expect(screen.queryByLabelText("Frame")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Headings")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Shop items")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Alt bg")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Separators")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nav height")).toHaveValue("standard");
    expect(screen.getByLabelText("Logo")).toHaveValue("tight-crop");
    expect(screen.getByLabelText("Logo").querySelectorAll("option")).toHaveLength(
      4
    );
    expect(screen.getByLabelText("Logo size")).toHaveValue("standard");
    expect(screen.getByLabelText("Y pad")).toHaveValue("standard");
    expect(screen.getByLabelText("X pad")).toHaveValue("wide");
    expect(screen.getByLabelText("Link gap")).toHaveValue("open");
    expect(screen.getByLabelText("Link size")).toHaveValue("standard");
    expect(screen.getByLabelText("Link font")).toHaveValue("archivo-regular");
    expect(screen.getByLabelText("Nav tint")).toHaveValue("off");
    expect(screen.getByLabelText("Link font").querySelectorAll("option")).toHaveLength(
      34
    );
    expect(
      screen
        .getByLabelText("Link font")
        .querySelector('option[value="archivo-semibold"]')
    ).toBeNull();
    expect(
      screen
        .getByLabelText("Link font")
        .querySelector('option[value="baskerville"]')
    ).not.toBeNull();
    expect(
      screen
        .getByLabelText("Link font")
        .querySelector('option[value="system-sans"]')
    ).not.toBeNull();
    expect(
      screen.getByLabelText("Link gap").querySelector('option[value="maximum"]')
    ).not.toBeNull();
    expect(screen.getByTestId("prototype-home")).toHaveAttribute(
      "data-frame-preset",
      "wide"
    );
    expect(screen.getByTestId("prototype-home")).toHaveAttribute(
      "data-font-preset",
      "smaller"
    );
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-height"
      )
    ).toBe("96px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-height"
      )
    ).toBe("56px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-width"
      )
    ).toBe("260px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-height"
      )
    ).toBe("46px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-width"
      )
    ).toBe("220px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-y"
      )
    ).toBe("12px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-x"
      )
    ).toBe("24px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap"
      )
    ).toBe("48px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap-wide"
      )
    ).toBe("60px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size"
      )
    ).toBe("16px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size-wide"
      )
    ).toBe("18px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-family"
      )
    ).toBe("var(--font-archivo), sans-serif");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-weight"
      )
    ).toBe("400");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-letter-spacing"
      )
    ).toBe("0");
    expect(
      document.documentElement.style.getPropertyValue("--prototype-main-nav-bg")
    ).toBe("#f5f5f5");
    expect(document.documentElement.dataset.prototypeMainNavLogo).toBe(
      "tight-crop"
    );
  });

  it("updates and resets prototype navbar CSS controls from the bottom tray", () => {
    render(<HomePrototype />);

    fireEvent.change(screen.getByLabelText("Nav height"), {
      target: { value: "tall" },
    });
    fireEvent.change(screen.getByLabelText("Logo"), {
      target: { value: "new-logo" },
    });
    fireEvent.change(screen.getByLabelText("Logo size"), {
      target: { value: "oversized" },
    });
    fireEvent.change(screen.getByLabelText("Y pad"), {
      target: { value: "tight" },
    });
    fireEvent.change(screen.getByLabelText("X pad"), {
      target: { value: "gallery" },
    });
    fireEvent.change(screen.getByLabelText("Link gap"), {
      target: { value: "maximum" },
    });
    fireEvent.change(screen.getByLabelText("Link size"), {
      target: { value: "oversized" },
    });
    fireEvent.change(screen.getByLabelText("Link font"), {
      target: { value: "times" },
    });
    fireEvent.change(screen.getByLabelText("Nav tint"), {
      target: { value: "warm" },
    });

    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-height"
      )
    ).toBe("128px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-height"
      )
    ).toBe("88px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-width"
      )
    ).toBe("420px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-height"
      )
    ).toBe("56px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-width"
      )
    ).toBe("280px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-y"
      )
    ).toBe("6px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-x"
      )
    ).toBe("32px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap"
      )
    ).toBe("120px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap-wide"
      )
    ).toBe("120px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size"
      )
    ).toBe("22px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size-wide"
      )
    ).toBe("22px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-family"
      )
    ).toBe('"Times New Roman", Times, serif');
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-weight"
      )
    ).toBe("400");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-letter-spacing"
      )
    ).toBe("0");
    expect(
      document.documentElement.style.getPropertyValue("--prototype-main-nav-bg")
    ).toBe("#efe3d4");
    expect(document.documentElement.dataset.prototypeMainNavLogo).toBe(
      "new-logo"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reset prototype layout controls",
      })
    );

    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-height"
      )
    ).toBe("96px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-height"
      )
    ).toBe("56px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-width"
      )
    ).toBe("260px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-height"
      )
    ).toBe("46px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-width"
      )
    ).toBe("220px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-y"
      )
    ).toBe("12px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-x"
      )
    ).toBe("24px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap"
      )
    ).toBe("48px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap-wide"
      )
    ).toBe("60px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size"
      )
    ).toBe("16px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size-wide"
      )
    ).toBe("18px");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-family"
      )
    ).toBe("var(--font-archivo), sans-serif");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-weight"
      )
    ).toBe("400");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-letter-spacing"
      )
    ).toBe("0");
    expect(
      document.documentElement.style.getPropertyValue("--prototype-main-nav-bg")
    ).toBe("#f5f5f5");
    expect(document.documentElement.dataset.prototypeMainNavLogo).toBe(
      "tight-crop"
    );
  });

  it("removes route-local navbar controls when the prototype unmounts", () => {
    const { unmount } = render(<HomePrototype />);

    fireEvent.change(screen.getByLabelText("Nav height"), {
      target: { value: "gallery" },
    });
    fireEvent.change(screen.getByLabelText("Logo"), {
      target: { value: "variation-4" },
    });
    fireEvent.change(screen.getByLabelText("Logo size"), {
      target: { value: "oversized" },
    });
    fireEvent.change(screen.getByLabelText("X pad"), {
      target: { value: "edge" },
    });
    fireEvent.change(screen.getByLabelText("Link size"), {
      target: { value: "large" },
    });
    fireEvent.change(screen.getByLabelText("Link font"), {
      target: { value: "cinzel" },
    });

    unmount();

    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-height"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-height"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-logo-width"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-height"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-mobile-logo-width"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-y"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-padding-x"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-gap-wide"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-size-wide"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-family"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-weight"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-font-style"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue(
        "--prototype-main-nav-link-letter-spacing"
      )
    ).toBe("");
    expect(
      document.documentElement.style.getPropertyValue("--prototype-main-nav-bg")
    ).toBe("");
    expect(document.documentElement.dataset.prototypeMainNavLogo).toBeUndefined();
  });
});

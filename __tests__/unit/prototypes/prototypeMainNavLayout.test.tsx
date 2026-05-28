import fs from "fs";
import path from "path";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { MainNavRouteSwitch } from "@/components/modules/navigation/mainNav/MainNavRouteSwitch";
import {
  defaultPrototypeMainNavControlPresets,
  getPrototypeMainNavCssValues,
} from "@/components/modules/navigation/prototypeMainNav/prototypeMainNavControls";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.Mock;

const readSource = (sourcePath: string) =>
  fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8");

const renderSwitch = ({
  defaultNav = <div>Default nav</div>,
  prototypeHomeNav = <div>Prototype nav</div>,
}: {
  defaultNav?: ReactNode;
  prototypeHomeNav?: ReactNode;
} = {}) =>
  render(
    <MainNavRouteSwitch
      defaultNav={defaultNav}
      prototypeHomeNav={prototypeHomeNav}
    />
  );

describe("prototype home main navigation layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the prototype nav only for the prototype home route", () => {
    mockUsePathname.mockReturnValue("/");

    const { rerender } = renderSwitch();

    expect(screen.getByText("Default nav")).toBeInTheDocument();
    expect(screen.queryByText("Prototype nav")).not.toBeInTheDocument();

    mockUsePathname.mockReturnValue("/prototype/home");
    rerender(
      <MainNavRouteSwitch
        defaultNav={<div>Default nav</div>}
        prototypeHomeNav={<div>Prototype nav</div>}
      />
    );

    expect(screen.getByText("Prototype nav")).toBeInTheDocument();
    expect(screen.queryByText("Default nav")).not.toBeInTheDocument();
  });

  it("keeps the prototype desktop links truly centered between equal side columns", () => {
    const prototypeNavSource = readSource(
      "src/components/modules/navigation/prototypeMainNav/PrototypeMainNav.tsx"
    );
    const homePrototypeSource = readSource(
      "src/components/prototypes/home/HomePrototype.tsx"
    );
    const fontsSource = readSource("src/lib/styles/fonts.ts");
    const globalCssSource = readSource("src/app/globals.css");
    const logoOptionsSource = readSource(
      "src/components/modules/navigation/prototypeMainNav/prototypeNavLogoOptions.ts"
    );
    const controlsSource = readSource(
      "src/components/modules/navigation/prototypeMainNav/prototypeMainNavControls.ts"
    );
    const headerSource = readSource(
      "src/components/modules/navigation/header/Header.tsx"
    );

    expect(prototypeNavSource).toContain(
      "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
    );
    expect(prototypeNavSource).toContain('from "next/image"');
    expect(prototypeNavSource).toContain("prototype-main-nav-logo-image");
    expect(prototypeNavSource).not.toContain("<style>");
    expect(globalCssSource).toContain("html[data-prototype-main-nav-logo");
    expect(globalCssSource).toContain(
      '.prototype-main-nav-logo-image[data-logo-id="tight-crop"]'
    );
    expect(logoOptionsSource).toContain("jl_logo_tight_crop.png");
    expect(logoOptionsSource).toContain('id: "tight-crop"');
    expect(globalCssSource).toContain("prototype-main-nav-link-label");
    expect(globalCssSource).toContain(
      "--prototype-main-nav-effective-link-font-family"
    );
    expect(globalCssSource).toContain(
      "--prototype-main-nav-effective-link-font-size"
    );
    expect(globalCssSource).toContain("@media (min-width: 1920px)");
    expect(globalCssSource).toContain("--prototype-main-nav-link-gap-wide");
    expect(globalCssSource).toContain(
      "--prototype-main-nav-link-font-size-wide"
    );
    expect(globalCssSource).toContain("text-transform: uppercase");
    expect(globalCssSource).toContain("mix-blend-mode: multiply");
    expect(prototypeNavSource).not.toContain("prototype-main-nav-separator");
    expect(prototypeNavSource).toContain("justify-self-center");
    expect(prototypeNavSource).toContain("justify-self-end");
    expect(prototypeNavSource).toContain("AccountNav");
    expect(prototypeNavSource).toContain("--prototype-main-nav-height");
    expect(prototypeNavSource).toContain("--prototype-main-nav-logo-height");
    expect(prototypeNavSource).toContain("--prototype-main-nav-logo-width");
    expect(prototypeNavSource).toContain("--prototype-main-nav-padding-y");
    expect(prototypeNavSource).toContain("--prototype-main-nav-padding-x");
    expect(prototypeNavSource).not.toContain("px-4");
    expect(prototypeNavSource).not.toContain("px-6");
    expect(prototypeNavSource).not.toContain("md:px-6");
    expect(prototypeNavSource).not.toContain("xl:px-10");
    expect(prototypeNavSource).toContain(
      "--prototype-main-nav-default-link-gap"
    );
    expect(prototypeNavSource).toContain(
      "--prototype-main-nav-effective-link-gap"
    );
    expect(prototypeNavSource).toContain("getPrototypeMainNavCssValues");
    expect(prototypeNavSource).toContain("defaultMainNavCssValues.paddingX");
    expect(prototypeNavSource).toContain("--prototype-main-nav-bg");
    expect(prototypeNavSource).toContain("formatPrototypeNavLabel");
    expect(prototypeNavSource).toContain("toUpperCase");
    expect(prototypeNavSource).not.toContain("pb-6");
    expect(homePrototypeSource).toContain("X pad");
    expect(homePrototypeSource).toContain("max-h-[46vh]");
    expect(homePrototypeSource).toContain("overflow-y-auto");
    expect(controlsSource).toContain("baskerville");
    expect(controlsSource).toContain("system-sans");
    expect(controlsSource).not.toContain("archivo-semibold");
    expect(controlsSource).not.toContain("archivo-bold");
    expect(controlsSource).not.toContain("archivo-black");
    expect(fontsSource).toContain("Archivo_Black");
    expect(fontsSource).not.toContain("Bodoni_Moda");
    expect(fontsSource).not.toContain("Work_Sans");

    expect(headerSource).toContain("HeaderMainNavLoader");
    expect(headerSource).toContain("<Breadcrumbs />");
    expect(headerSource).toContain("<Searchbar />");
  });

  it("keeps first-render prototype nav values aligned with control defaults", () => {
    expect(defaultPrototypeMainNavControlPresets).toMatchObject({
      logoSizePreset: "standard",
      paddingXPreset: "wide",
      linkSpacingPreset: "open",
      linkSizePreset: "standard",
      linkFontPreset: "archivo-regular",
    });
    expect(getPrototypeMainNavCssValues()).toMatchObject({
      logoHeight: "56px",
      logoWidth: "260px",
      mobileLogoHeight: "46px",
      mobileLogoWidth: "220px",
      paddingX: "24px",
      linkGap: "48px",
      wideLinkGap: "60px",
      linkFontSize: "16px",
      wideLinkFontSize: "18px",
      linkFontFamily: "var(--font-archivo), sans-serif",
    });
  });

  it("keeps the live nav layouts unchanged and records a navbar reference", () => {
    const desktopSource = readSource(
      "src/components/modules/navigation/mainNav/DesktopNavLayout.tsx"
    );
    const tabletSource = readSource(
      "src/components/modules/navigation/mainNav/TabletNavLayout.tsx"
    );
    const mobileSource = readSource(
      "src/components/modules/navigation/mainNav/MobileNavLayout.tsx"
    );
    const referenceSource = readSource(
      "docs/prototypes/current-navbar-reference.md"
    );

    expect(desktopSource).toContain(
      "w-full flex flex-row justify-between space-x-6 px-4 py-6"
    );
    expect(tabletSource).toContain(
      "w-full flex flex-row justify-between space-x-6 px-4 sm:py-6"
    );
    expect(mobileSource).toContain("justify-between my-2 bg-whitish");
    expect(referenceSource).toContain("pre-prototype navbar");
  });
});

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

import { NavItem } from "@/components/elements/buttons/NavItem";
import { AccountNav } from "@/components/modules/navigation/accountNav/AccountNav";
import { MobileNavDrawer } from "@/components/modules/navigation/mobileNavDrawer/MobileNavDrawer";
import { SearchDrawer } from "@/components/modules/search/SearchDrawer";
import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";
import { NAV_LINK_BORDER_COLOURS } from "@/lib/constants/navigationLinks";
import {
  DEFAULT_PROTOTYPE_NAV_LOGO_ID,
  prototypeNavLogoOptions,
} from "@/components/modules/navigation/prototypeMainNav/prototypeNavLogoOptions";

const prototypeMainNavHeightStyle: CSSProperties = {
  minHeight: "var(--prototype-main-nav-height, 96px)",
  paddingTop: "var(--prototype-main-nav-padding-y, 12px)",
  paddingBottom: "var(--prototype-main-nav-padding-y, 12px)",
  paddingLeft: "var(--prototype-main-nav-padding-x, 0px)",
  paddingRight: "var(--prototype-main-nav-padding-x, 0px)",
  backgroundColor: "var(--prototype-main-nav-bg, #f5f5f5)",
};

const prototypeMainNavBackgroundStyle: CSSProperties = {
  backgroundColor: "var(--prototype-main-nav-bg, #f5f5f5)",
};

const prototypeMainNavPaddingYStyle: CSSProperties = {
  paddingTop: "var(--prototype-main-nav-padding-y, 12px)",
  paddingBottom: "var(--prototype-main-nav-padding-y, 12px)",
  paddingLeft: "var(--prototype-main-nav-padding-x, 0px)",
  paddingRight: "var(--prototype-main-nav-padding-x, 0px)",
  backgroundColor: "var(--prototype-main-nav-bg, #f5f5f5)",
};

const prototypeLogoMarkStyle: CSSProperties = {
  height: "var(--prototype-main-nav-logo-height, 74px)",
  width: "min(40vw, var(--prototype-main-nav-logo-width, 340px))",
};

const mobilePrototypeLogoMarkStyle: CSSProperties = {
  height: "var(--prototype-main-nav-mobile-logo-height, 50px)",
  width: "min(62vw, var(--prototype-main-nav-mobile-logo-width, 250px))",
};

const prototypeNavItemClassName =
  "prototype-main-nav-link-label font-face-default subheading border-transparent";

const getPrototypeNavItemActiveClassName = (index: number) =>
  `prototype-main-nav-link-label font-face-default subheading border-b-4 border-t-4 border-t-transparent pb-1 pt-1 ${NAV_LINK_BORDER_COLOURS[index]}`;

const formatPrototypeNavLabel = (label: string) => label.trim().toUpperCase();

function PrototypeLogoLink({
  className = "",
  style = prototypeLogoMarkStyle,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Link
      href="/"
      aria-label="Joseph Laoutaris home"
      className={`inline-flex min-w-0 items-center ${className}`}
    >
      <span
        className="prototype-main-nav-logo-mark relative block overflow-hidden"
        data-default-logo={DEFAULT_PROTOTYPE_NAV_LOGO_ID}
        style={style}
        aria-hidden="true"
      >
        {prototypeNavLogoOptions.map((option) => (
          <Image
            key={option.id}
            src={option.image}
            alt=""
            className="prototype-main-nav-logo-image h-full w-full object-contain object-left"
            data-logo-id={option.id}
            sizes="(max-width: 639px) 62vw, (max-width: 1279px) 50vw, 420px"
            priority={option.id === DEFAULT_PROTOTYPE_NAV_LOGO_ID}
          />
        ))}
      </span>
      <span className="sr-only">Joseph Laoutaris</span>
    </Link>
  );
}

function PrototypePrimaryLinks({ navLinks }: { navLinks: NavBarLink[] }) {
  return (
    <nav
      aria-label="Primary navigation"
      className="flex min-w-0 flex-row flex-wrap items-center justify-center gap-y-3"
      style={{ columnGap: "var(--prototype-main-nav-link-gap, 20px)" }}
    >
      {navLinks.map((link, index) => {
        const label = formatPrototypeNavLabel(link.label);

        return (
          <div key={link.label} className="flex min-w-0 flex-row items-center">
            {!link.disabled ? (
              <Link href={link.path}>
                <NavItem
                  label={label}
                  slug={link.path}
                  activeClassName={getPrototypeNavItemActiveClassName(index)}
                  className={prototypeNavItemClassName}
                />
              </Link>
            ) : (
              <NavItem
                label={label}
                slug={link.path}
                className={`${prototypeNavItemClassName} cursor-not-allowed text-gray-400`}
                activeClassName={getPrototypeNavItemActiveClassName(index)}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function PrototypeDesktopNav({ navLinks }: { navLinks: NavBarLink[] }) {
  return (
    <div
      className="hidden w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center bg-whitish xl:grid"
      style={prototypeMainNavHeightStyle}
      data-testid="prototype-main-nav-desktop"
    >
      <div className="min-w-0 justify-self-start">
        <PrototypeLogoLink />
      </div>
      <div className="min-w-0 justify-self-center">
        <PrototypePrimaryLinks navLinks={navLinks} />
      </div>
      <div className="min-w-0 justify-self-end">
        <AccountNav />
      </div>
    </div>
  );
}

function PrototypeTabletNav({ navLinks }: { navLinks: NavBarLink[] }) {
  return (
    <div
      className="hidden w-full flex-col bg-whitish sm:flex xl:hidden"
      style={prototypeMainNavBackgroundStyle}
      data-testid="prototype-main-nav-tablet"
    >
      <div
        className="flex w-full flex-row items-center justify-between"
        style={prototypeMainNavHeightStyle}
      >
        <PrototypeLogoLink className="max-w-[50vw]" />
        <AccountNav />
      </div>
      <div
        className="flex w-full items-center justify-center"
        style={prototypeMainNavPaddingYStyle}
      >
        <PrototypePrimaryLinks navLinks={navLinks} />
      </div>
    </div>
  );
}

function PrototypeMobileNav({ navLinks }: { navLinks: NavBarLink[] }) {
  return (
    <div
      className="flex w-full flex-row items-center justify-between bg-whitish sm:hidden"
      style={prototypeMainNavPaddingYStyle}
      data-testid="prototype-main-nav-mobile"
    >
      <PrototypeLogoLink
        className="max-w-[62vw]"
        style={mobilePrototypeLogoMarkStyle}
      />
      <div className="flex items-center gap-4">
        <SearchDrawer />
        <MobileNavDrawer navLinks={navLinks} />
      </div>
    </div>
  );
}

export function PrototypeMainNav({ navLinks }: { navLinks: NavBarLink[] }) {
  return (
    <nav
      className="bg-whitish"
      style={prototypeMainNavBackgroundStyle}
      data-testid="prototype-main-nav"
    >
      <PrototypeMobileNav navLinks={navLinks} />
      <PrototypeTabletNav navLinks={navLinks} />
      <PrototypeDesktopNav navLinks={navLinks} />
    </nav>
  );
}

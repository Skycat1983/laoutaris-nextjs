import React from "react";
import Logo from "../common/Logo";
import Link from "next/link";
import { AccountMenuBar } from "../accountMenuBar/AccountMenuBar";
import NavItem from "@/components/ui/common/buttons/NavItem";
import { navLinkBorderColours } from "@/utils/consts";
import { NavBarLink } from "./NavBar";

interface DesktopNavLayoutProps {
  navLinks: NavBarLink[];
}

const TabletNavLayout = ({ navLinks }: DesktopNavLayoutProps) => {
  if (navLinks.length > navLinkBorderColours.length) {
    console.error(
      `navLinks.length > navLinkBorderColours.length. navLinks.length = ${navLinks.length}, navLinkBorderColours.length = ${navLinkBorderColours.length}`
    );
  }

  // console.log("navLinks in tablet layout :>> ", navLinks);
  return (
    <>
      <div className="w-full flex flex-col h-auto bg-whitish">
        {/* top row */}
        <div className="w-full flex flex-row justify-between space-x-6 px-4 sm:py-6">
          <nav className="flex flex-row items-center my-auto">
            <Link href="/">
              <Logo />
            </Link>
          </nav>
          <div className="flex flex-row gap-5 items-center">
            <AccountMenuBar />
          </div>
        </div>
        {/* bottom row */}
        <div className="flex flex-row items-center space-x-4 mb-6 pl-8">
          <nav className="flex flex-row items-center h-auto space-x-6">
            {navLinks.map((link, index) => (
              <div key={index} className="hidden sm:flex flex-row items-center">
                {!link.disabled ? (
                  <Link href={link.path}>
                    <NavItem
                      label={link.label}
                      slug={link.path}
                      activeClassName={`font-face-default subheading border-b-4 border-t-4 border-t-transparent pb-1 pt-1 ${navLinkBorderColours[index]}`}
                      className="font-face-default subheading border-transparent"
                    />
                  </Link>
                ) : (
                  <NavItem
                    label={link.label}
                    slug={link.path}
                    className="font-face-default subheading border-transparent cursor-not-allowed text-gray-400"
                    activeClassName={`font-face-default subheading border-b-4 border-t-4 border-t-transparent pb-1 pt-1 ${navLinkBorderColours[index]}`}
                  />
                )}
                {index + 1 < navLinks.length && (
                  <div className="hidden sm:flex items-center">
                    <h2 className="px-2 pl-6 text-xl font-thin">|</h2>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default TabletNavLayout;

{
  /* <User />
            <Heart />
            <ShoppingBasket />

            <div className="flex flex-row">
              <h1>DE</h1>
              <ChevronDown />
            </div> */
}

{
  /* <nav className="flex flex-row items-center h-auto space-x-3 md:space-x-6 ">
            <Link href="/artwork">
              <NavItem
                label="Artwork"
                slug="artwork"
                className="font-face-default subheading-button"
                activeClassName="font-face-default subheading-button-active"
              />
            </Link>

            <Link href="/biography">
              <NavItem
                label="Biography"
                slug="biography"
                className="font-face-default subheading-button"
                activeClassName="font-face-default subheading-button-active"
              />
            </Link>

            <Link href="/project">
              <NavItem
                label="Project"
                slug="project"
                className="font-face-default subheading-button"
                activeClassName="font-face-default subheading-button-active"
              />
            </Link>

            <Link href="/blog">
              <NavItem
                label="Blog"
                slug="blog"
                className="font-face-default subheading-button"
                activeClassName="font-face-default subheading-button-active"
              />
            </Link>

            <Link href="/shop">
              <NavItem
                label="Shop"
                slug="shop"
                className="font-face-default subheading-button"
                activeClassName="font-face-default subheading-button-active"
              />
            </Link>
          </nav> */
}

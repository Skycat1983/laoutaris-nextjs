import React from "react";
import Logo from "../../../atoms/Logo";
import Link from "next/link";
import { AccountMenuBar } from "../../accountMenuBar/AccountMenuBar";
interface NavLink {
  label: string;
  path: string;
}

interface DesktopNavLayoutProps {
  navLinks: NavLink[];
}

const TabletNavLayout = ({ navLinks }: DesktopNavLayoutProps) => {
  return (
    <>
      <div className="w-full flex flex-col bg-blue-100 h-auto">
        {/* top row */}
        <div className="bg-blue-100 w-full flex flex-row justify-between space-x-6 px-4 sm:py-6">
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
        <div className="flex flex-row items-center space-x-4 m-4 pl-8 bg-red-100">
          <nav className="flex flex-row items-center h-auto space-x-6 ">
            {navLinks.map((link, index) => (
              <div key={index} className="hidden md:flex flex-row items-center">
                <Link href={link.path}>
                  <h2 className="font-face-default subheading">{link.label}</h2>
                </Link>
                {index < navLinks.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <h2 className="px-2 pl-6 text-xl font-thin">|</h2>
                  </div>
                )}
              </div>
            ))}
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
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

"use client";

import React from "react";
import Link from "next/link";
import MyBreadcrumbs from "../src/components/ui/breadcrumbs/Breadcrumbs";
import Searchbar from "../src/components/atoms/inputs/Searchbar";
import { CircleUser, Heart, ShoppingCart, Menu } from "lucide-react";
import Logo from "../src/components/atoms/Logo";

interface NavOption {
  to: string;
  label: string | React.ReactNode;
}

const centralNavigation: NavOption[] = [
  { to: "/artwork", label: "Artwork" },
  { to: "/biography", label: "Biography" },
  { to: "/project", label: "Project" },
  { to: "/blog", label: "Blog" },
];

const accountNavigation: NavOption[] = [
  { to: "/account", label: <CircleUser /> },
  { to: "/wishlist", label: <Heart /> },
  { to: "/cart", label: <ShoppingCart /> },
];

const Header = () => {
  return (
    <div className="max-w-screen mx-auto flex flex-col min-h-screen">
      <header className="fixed top-0 z-10 w-screen bg-whitish">
        {/* primary nav (home, primary routes, account/hamburger) */}
        <div className="bg-whitish w-full flex flex-row justify-between space-x-6 px-6 py-6">
          {/* app logo */}
          <nav className="flex flex-row items-center my-auto">
            <Link href="/">
              <Logo />
            </Link>
          </nav>
          {/* main nav options */}
          <div className="flex flex-row space-x-4">
            <nav className="flex flex-row items-center h-auto space-x-3 md:space-x-6">
              {centralNavigation.map((link, index) => (
                <React.Fragment key={index}>
                  <Link href={link.to} key={index}>
                    <div className="hidden md:flex flex-row items-center">
                      <h2 className="font-face-default subheading">
                        {link.label}
                      </h2>
                    </div>
                  </Link>
                  {index < centralNavigation.length && (
                    <div className="hidden md:flex items-center">
                      <h2 className="px-2 text-xl font-thin">|</h2>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {accountNavigation.map((link, index) => (
                <React.Fragment key={index}>
                  <Link href={link.to}>
                    <div className="flex flex-row items-center">
                      {link.label}
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </nav>

            {/* <div className="block flex my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
              <Menu />
            </div> */}
          </div>
        </div>

        {/* primary routes re-rendered below app logo at breakpoint */}
        <div className="bg-whitish block flex flex-row space-x-4 px-4 pb-4 md:hidden">
          <nav className="flex flex-row justify-start items-center  space-x-0 w-full">
            {centralNavigation.map((link, index) => (
              // <React.Fragment key={index}>
              <Link key={index} href={link.to}>
                <div className="flex flex-row justify-start items-center outline-thin py-1 px-2 text-center">
                  <h2 className="font-face-default subheading-button w-[120px]">
                    {link.label}
                  </h2>
                </div>
              </Link>
              // </React.Fragment>
            ))}
          </nav>
        </div>
        {/* Secondary Nav (breadcrumbs, search bar)*/}
        <div className="flex flex-col w-full bg-whitish px-4">
          <hr className="flex flex-row flex-grow" />
          <div className="flex items-center grow justify-between min-h-[50px] px-8">
            <MyBreadcrumbs />
            <Searchbar />
          </div>
          <hr className="flex flex-row flex-grow" />
        </div>
      </header>
    </div>
  );
};

export default Header;

"use client";

import React from "react";
import Footer from "./Footer";
import Link from "next/link";
import MyBreadcrumbs from "./ui/breadcrumbs/myBreadcrumbs";
import Searchbar from "./ui/inputs/Searchbar";

interface NavBarProps {
  children: React.ReactNode;
}

interface NavOption {
  to: string;
  label: string;
}

const centralNavigation: NavOption[] = [
  { to: "/artwork", label: "Artwork" },
  { to: "/biography", label: "Biography" },
  { to: "/project", label: "Project" },
  { to: "/blog", label: "Blog" },
];

const Navbar = () => {
  return (
    <div className="max-w-screen mx-auto flex flex-col min-h-screen">
      <header className="fixed top-0 z-10 w-screen bg-whitish">
        {/* primary nav (home, primary routes, account/hamburger) */}
        <div className="bg-whitish w-full flex flex-row justify-between space-x-6 px-6 py-6">
          {/* app logo */}
          <nav className="flex flex-row items-center my-auto">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div>
                  <h1 className="fontface-bold font-heading truncate my-auto text-3xl">
                    Joseph Laoutaris
                  </h1>
                </div>
              </div>
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
                  {index < centralNavigation.length - 1 && ( // Only add separators between items
                    <div className="hidden md:flex items-center">
                      <h2 className="px-2 text-xl font-thin">|</h2>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* account routes/hamburger */}
            <nav className="hidden sm:block md:hidden lg:block lg:space-x-6">
              {/* <AccountNav user={false} /> */}
            </nav>
            <div className="block flex my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
              {/* <HamburgerIcon /> */}
            </div>
          </div>
        </div>
        {/* primary routes re-rendered below app logo at breakpoint */}
        <div className="bg-whitish block flex flex-row space-x-4 px-4 pb-4 md:hidden">
          <nav className="flex items-center justify-center flex-row space-x-4 custom:space-x-6">
            {centralNavigation.map((link, index) => (
              <React.Fragment key={index}>
                <Link key={index} href={link.to}>
                  <div className=" flex flex-row justify-center items-center outline-thin py-1 px-8 ">
                    <h2 className="font-face-default bg-red-100">
                      {link.label}
                    </h2>
                  </div>
                </Link>
              </React.Fragment>
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
      <div></div>
      {/* {descendantRoutes.length > 0 && <Subnav items={descendantRoutes} />} */}

      {/* content */}
      <main className="flex flex-col flex-grow">
        {/* <Outlet /> */}
        {/* {children} */}
      </main>

      <Footer />
    </div>
  );
};

export default Navbar;

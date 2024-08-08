import React from "react";
import Logo from "./logo";
import Link from "next/link";

type Props = {};

const TabletNavLayout = (props: Props) => {
  return (
    <>
      <div className="bg-whitish w-full flex flex-row justify-between space-x-6 px-4 py-2 sm:py-8">
        {/* app logo */}
        <nav className="flex flex-row items-center my-auto">
          <Link href="/">
            <Logo />
          </Link>
        </nav>
        <NavAccount />
        {/* main nav options */}
        {/* <div className="flex flex-row space-x-4">
          <nav className="flex flex-row items-center h-auto space-x-3 md:space-x-6 bg-red-100">
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Artwork</h2>
            </div>
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Artist</h2>
            </div>
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Project</h2>
            </div>
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Blog</h2>
            </div>
          </nav>
        </div> */}
      </div>
    </>
  );
};

export default TabletNavLayout;

{
  /* {centralNavigation.map((link, index) => (
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
              ))} */
}
{
  /* {accountNavigation.map((link, index) => (
                <React.Fragment key={index}>
                  <Link href={link.to}>
                    <div className="flex flex-row items-center">
                      {link.label}
                    </div>
                  </Link>
                </React.Fragment>
              ))} */
}

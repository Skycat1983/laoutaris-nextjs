import Link from "next/link";
import React from "react";
import { NavOption } from "./headerTypes";

const NavMain = () => {
  return (
    <div className="flex flex-row space-x-4">
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
    </div>
    // <nav className="flex flex-row justify-start items-center  space-x-0 w-full">
    //   {navOptions.map((link, index) => (
    //     <Link key={index} href={link.to}>
    //       <div className="flex flex-row justify-start items-center outline-thin py-1 px-2 text-center">
    //         <h2 className="font-face-default subheading-button w-[120px]">
    //           {link.label}
    //         </h2>
    //       </div>
    //     </Link>
    //   ))}
    // </nav>
  );
};

export default NavMain;

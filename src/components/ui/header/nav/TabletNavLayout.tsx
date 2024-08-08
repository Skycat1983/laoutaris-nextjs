import React from "react";
import Logo from "../../../atoms/Logo";
import Link from "next/link";
import { ChevronDown, Euro, Heart, ShoppingBasket, User } from "lucide-react";

const TabletNavLayout = () => {
  return (
    <>
      <div className="w-full flex flex-col">
        {/* top row */}
        <div className="bg-whitish w-full flex flex-row justify-between space-x-6 px-4 py-2 sm:py-8">
          <nav className="flex flex-row items-center my-auto">
            <Link href="/">
              <Logo />
            </Link>
          </nav>
          <div className="flex flex-row gap-5 items-center">
            <User />
            <Heart />
            <ShoppingBasket />

            <div className="flex flex-row">
              <h1>DE</h1>
              <ChevronDown />
            </div>
          </div>
        </div>
        {/* bottom row */}
        <div className="flex flex-row space-x-4 px-4">
          <nav className="flex flex-row items-center h-auto space-x-3 md:space-x-6 ">
            <div className="flex flex-row items-center">
              <h2 className="font-face-default subheading-button">Artwork</h2>
            </div>
            <div className="flex flex-row items-center">
              <h2 className="font-face-default subheading-button">Artist</h2>
            </div>
            <div className="flex flex-row items-center">
              <h2 className="font-face-default subheading-button">Project</h2>
            </div>
            <div className="flex flex-row items-center">
              <h2 className="font-face-default subheading-button">Blog</h2>
            </div>
            <div className="flex flex-row items-center">
              <h2 className="font-face-default subheading-button">Shop</h2>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default TabletNavLayout;

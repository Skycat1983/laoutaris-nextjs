import React from "react";
import Logo from "../../../atoms/Logo";
import Link from "next/link";
import { ChevronDown, Euro, Heart, ShoppingBasket, User } from "lucide-react";
import NavItem from "@/components/atoms/buttons/NavItem";
import { AccountMenuBar } from "../../accountMenuBar/AccountMenuBar";

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
            <AccountMenuBar />

            {/* <User />
            <Heart />
            <ShoppingBasket />

            <div className="flex flex-row">
              <h1>DE</h1>
              <ChevronDown />
            </div> */}
          </div>
        </div>
        {/* bottom row */}
        <div className="flex flex-row space-x-4 px-4">
          <nav className="flex flex-row items-center h-auto space-x-3 md:space-x-6 ">
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
          </nav>
        </div>
      </div>
    </>
  );
};

export default TabletNavLayout;

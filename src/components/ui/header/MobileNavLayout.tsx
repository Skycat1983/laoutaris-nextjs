import Link from "next/link";
import React from "react";
import Logo from "./logo";
import { Menu, Search, ShoppingBasket, User } from "lucide-react";

const MobileNavLayout = () => {
  return (
    <>
      <div className="flex flex-row w-full justify-between my-2">
        <div className="block flex my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
          <Logo />
        </div>
        <div className="block flex gap-4 my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
          <Search />
          {/* <ShoppingBasket /> */}
          <User />
          <Menu />
        </div>
      </div>
      <div className="w-full bg-gray-100 h-[1px]"></div>
    </>
  );
};

export default MobileNavLayout;

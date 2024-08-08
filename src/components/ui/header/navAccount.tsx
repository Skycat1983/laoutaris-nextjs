import { Menu, Search, User } from "lucide-react";
import React from "react";

type Props = {};

const NavAccount = (props: Props) => {
  // sm:hidden md:block lg:hidden
  return (
    <div className="flex flex-row gap-4 my-auto bg-red-100 items-center px-4 pr-6 ">
      <Search />
      {/* <ShoppingBasket /> */}
      <User />
      <Menu />
    </div>
  );
};

export default NavAccount;

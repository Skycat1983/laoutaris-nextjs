import Link from "next/link";
import React from "react";
import { Menu, Search, ShoppingBasket, User } from "lucide-react";
import Logo from "../../atoms/Logo";
import { AccountMenuBar } from "../accountMenuBar/AccountMenuBar";
import NavMenu from "../accountMenuBar/navMenu/NavMenu";

interface NavLink {
  label: string;
  path: string;
}

interface MobileNavLayoutProps {
  navLinks: NavLink[];
}

const MobileNavLayout = ({ navLinks }: MobileNavLayoutProps) => {
  return (
    <>
      <div className="flex flex-row max-w-full justify-between my-2">
        <div className="block flex my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="block flex gap-4 my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
          <AccountMenuBar />

          <NavMenu navLinks={navLinks} />
        </div>
      </div>
    </>
  );
};

export default MobileNavLayout;

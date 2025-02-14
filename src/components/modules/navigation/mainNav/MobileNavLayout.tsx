import Link from "next/link";
import React from "react";
import Logo from "../../../elements/icons/Logo";
import { MobileNavDrawer } from "../mobileNavDrawer/MobileNavDrawer";
import { NavBarLink } from "@/components/loaders/componentLoaders/MainNavLoader";
import { AccountNav } from "../accountNav/AccountNav";

interface MobileNavLayoutProps {
  navLinks: NavBarLink[];
}

export function MobileNavLayout({ navLinks }: MobileNavLayoutProps) {
  return (
    <>
      <div className="flex flex-row max-w-full justify-between my-2 bg-whitish">
        <div className="block flex my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="block flex gap-4 my-auto items-center px-4 pr-6 sm:hidden md:block lg:hidden">
          <AccountNav />

          <MobileNavDrawer navLinks={navLinks} />
        </div>
      </div>
    </>
  );
}

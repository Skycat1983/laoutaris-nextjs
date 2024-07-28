import Link from "next/link";
import React from "react";
import { NavOption } from "./headerTypes";

interface Props {
  navOptions: NavOption[];
}

const NavMain = ({ navOptions }: Props) => {
  return (
    <nav className="flex flex-row justify-start items-center  space-x-0 w-full">
      {navOptions.map((link, index) => (
        <Link key={index} href={link.to}>
          <div className="flex flex-row justify-start items-center outline-thin py-1 px-2 text-center">
            <h2 className="font-face-default subheading-button w-[120px]">
              {link.label}
            </h2>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default NavMain;

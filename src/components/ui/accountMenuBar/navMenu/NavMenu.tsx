"use client";

import { Menu, X } from "lucide-react";
import React from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import Logo from "@/components/atoms/Logo";

interface NavLink {
  label: string;
  path: string;
}

interface NavMenuProps {
  navLinks: NavLink[];
}

export function NavMenu({ navLinks }: NavMenuProps) {
  console.log("navLinks", navLinks);

  const accountNavLinks = [
    { label: "Sign Up", path: "http://localhost:3000/api/auth/signin" },
    { label: "Log In", path: "http://localhost:3000/api/auth/signin" },
    { label: "Logout", path: "/sign-out" },
  ];
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Menu />
      </DrawerTrigger>

      <DrawerContent className="max-w-sm">
        <div className="mx-auto h-[98vh] w-full max-w-sm">
          <DrawerFooter className="w-full flex flex-row justify-between items-center bg-slate-800/10">
            <DrawerTitle className="">
              <Logo />
            </DrawerTitle>
            <DrawerClose asChild>
              <X />
            </DrawerClose>
          </DrawerFooter>
          <DrawerHeader>
            {/* <HorizontalDivider /> */}

            <DrawerDescription className="hidden">
              Site navigation.
            </DrawerDescription>
          </DrawerHeader>

          {navLinks.map((link, index) => (
            <div key={index} className="md:flex flex-row items-center px-4">
              <Link href={link.path}>
                <DrawerClose asChild>
                  <h2 className="font-face-default subheading text-primary">
                    {link.label}
                  </h2>
                </DrawerClose>
              </Link>
              {index < navLinks.length - 1 && (
                <div className="py-6">{/* <HorizontalDivider /> */}</div>
              )}
            </div>
          ))}

          <div className="py-8 px-2">
            <HorizontalDivider />
          </div>

          {accountNavLinks.map((link, index) => (
            <div key={index} className="md:flex flex-row items-center px-4">
              <Link href={link.path}>
                <DrawerClose asChild>
                  <h2 className="font-face-default subheading text-primary">
                    {link.label}
                  </h2>
                </DrawerClose>
              </Link>
              {index < accountNavLinks.length - 1 && (
                <div className="py-6">{/* <HorizontalDivider /> */}</div>
              )}
            </div>
          ))}

          {/* <HorizontalDivider /> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

{
  /* <div className="p-4 pb-0 bg-red-100">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  text
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  hello
                </div>
              </div>
            </div>
            <div className="mt-3 "></div>
          </div> */
}

// type Props = {};

// const NavMenu = (props: Props) => {
//   return (
//     <div>
//       {" "}
//       <Menu />
//     </div>
//   );
// };

export default NavMenu;

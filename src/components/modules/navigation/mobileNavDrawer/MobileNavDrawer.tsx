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
} from "@/components/shadcn/drawer";
import Link from "next/link";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { Logo } from "@/components/elements/icons";
import { NavBarLink } from "@/components/loaders/componentLoaders/MainNavLoader";
import { useSession } from "next-auth/react";

interface NavMenuProps {
  navLinks: NavBarLink[];
}

export function MobileNavDrawer({ navLinks }: NavMenuProps) {
  const session = useSession();

  const isLoggedIn = session.status === "authenticated";

  const accountNavLinks = [
    {
      label: "Account",
      path: "/account",
      disabled: !isLoggedIn,
    },
    {
      label: "Sign Up",
      path: "http://localhost:3000/api/auth/signin",
      disabled: isLoggedIn,
    },
    {
      label: "Log In",
      path: "http://localhost:3000/api/auth/signin",
      disabled: isLoggedIn,
    },
    { label: "Logout", path: "/sign-out", disabled: !isLoggedIn },
  ];

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Menu />
      </DrawerTrigger>

      <DrawerContent className="max-w-full">
        <div className="mx-auto h-[98vh] w-full max-w-full">
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
              {!link.disabled ? (
                <Link href={link.path}>
                  <DrawerClose asChild>
                    <h2 className="font-face-default subheading text-primary">
                      {link.label}
                    </h2>
                  </DrawerClose>
                </Link>
              ) : (
                <DrawerClose asChild>
                  <h2 className="font-face-default subheading text-gray-400">
                    {link.label}
                  </h2>
                </DrawerClose>
              )}
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
              {!link.disabled ? (
                <Link href={link.path}>
                  <DrawerClose asChild>
                    <h2 className="font-face-default subheading text-primary">
                      {link.label}
                    </h2>
                  </DrawerClose>
                </Link>
              ) : (
                <DrawerClose asChild>
                  <h2 className="font-face-default subheading text-gray-400">
                    {link.label}
                  </h2>
                </DrawerClose>
              )}
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

"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { Logo } from "@/components/elements/icons";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/shadcn/drawer";
import {
  accountRootPath,
  accountSignInPath,
  accountSignUpPath,
} from "@/lib/routes/accountRoutes";

interface MobileNavDrawerBodyProps {
  navLinks: NavBarLink[];
}

export function MobileNavDrawerBody({ navLinks }: MobileNavDrawerBodyProps) {
  const session = useSession();

  const isLoggedIn = session.status === "authenticated";

  const accountNavLinks = [
    {
      label: "Account",
      path: accountRootPath,
      disabled: !isLoggedIn,
    },
    {
      label: "Sign Up",
      path: accountSignUpPath,
      disabled: isLoggedIn,
    },
    {
      label: "Log In",
      path: accountSignInPath,
      disabled: isLoggedIn,
    },
    { label: "Logout", path: "/sign-out", disabled: !isLoggedIn },
  ];

  return (
    <DrawerContent className="max-w-full">
      <div className="mx-auto h-[98vh] w-full max-w-full">
        <DrawerFooter className="w-full flex flex-row justify-between items-center bg-slate-800/10">
          <DrawerTitle className="">
            <Logo />
          </DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="inline-flex cursor-pointer items-center justify-center"
            >
              <X aria-hidden="true" />
            </button>
          </DrawerClose>
        </DrawerFooter>
        <DrawerHeader>
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
            {index < navLinks.length - 1 && <div className="py-6" />}
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
            {index < accountNavLinks.length - 1 && <div className="py-6" />}
          </div>
        ))}
      </div>
    </DrawerContent>
  );
}

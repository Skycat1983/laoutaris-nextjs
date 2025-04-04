"use server";

import { Logo } from "@/components/elements/icons";
import Link from "next/link";

import { NavBarLink } from "@/components/loaders/componentLoaders/MainNavLoader";
import { AccountNav } from "../accountNav/AccountNav";
import { NavItem } from "@/components/elements/buttons";
import { NAV_LINK_BORDER_COLOURS } from "@/lib/constants";

interface DesktopNavLayoutProps {
  navLinks: NavBarLink[];
}

export async function DesktopNavLayout({ navLinks }: DesktopNavLayoutProps) {
  return (
    <>
      {/* top row */}
      <div className=" w-full flex flex-row justify-between space-x-6 px-4 py-6">
        <nav className="flex flex-row items-center my-auto">
          <Link href="/">
            <Logo />
          </Link>
        </nav>
        <div className="flex flex-row gap-5 items-center">
          <nav className="flex flex-row items-center h-auto space-x-6">
            {navLinks.map((link, index) => (
              <div key={index} className="hidden sm:flex flex-row items-center">
                {!link.disabled ? (
                  <Link href={link.path}>
                    <NavItem
                      label={link.label}
                      slug={link.path}
                      activeClassName={`font-face-default subheading border-b-4 border-t-4 border-t-transparent pb-1 pt-1 ${NAV_LINK_BORDER_COLOURS[index]}`}
                      className="font-face-default subheading border-transparent"
                    />
                  </Link>
                ) : (
                  <NavItem
                    label={link.label}
                    slug={link.path}
                    className="font-face-default subheading border-transparent cursor-not-allowed text-gray-400"
                    activeClassName={`font-face-default subheading border-b-4 border-t-4 border-t-transparent pb-1 pt-1 ${NAV_LINK_BORDER_COLOURS[index]}`}
                  />
                )}

                {index + 1 < navLinks.length && (
                  <div className="hidden sm:flex items-center">
                    <h2 className="px-2 pl-6 text-xl font-thin">|</h2>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <AccountNav />
        </div>
      </div>
    </>
  );
}

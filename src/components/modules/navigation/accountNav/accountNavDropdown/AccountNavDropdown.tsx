"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/shadcn/navigation-menu";
import { CircleUserIcon, LogIn, Mail, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { usePathname, useRouter } from "next/navigation";
import { UserIcon } from "@/components/elements/icons/UserIcon";
import { MenubarSeparator, MenubarShortcut } from "@/components/shadcn/menubar";

interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function AccountNavDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useGlobalFeatures();
  const [isLoading, setIsLoading] = React.useState(false);
  const { data, status, update } = useSession();
  const session: UserSession | null = data?.user ?? null;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      // Check if the current path starts with '/account'
      if (pathname.startsWith("/account")) {
        openModal(<ModalMessage message="Logout successful." />, () =>
          router.push("/")
        );
      } else {
        openModal(<ModalMessage message="Logout successful." />);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      openModal(<ModalMessage message="Logout failed." />);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !session || isLoading;
  return (
    <NavigationMenu className="p-0 m-0 items-center">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="p-1 -m-1 border-2 border-whitish hover:border-slate/50 rounded-full">
              <UserIcon />
            </div>
          </NavigationMenuTrigger>

          <NavigationMenuContent className="">
            <ul className="w-[150px] md:w-[200px] lg:w-[200px]">
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className={`flex w-full items-center select-none justify-end rounded-md p-2 no-underline outline-none focus:shadow-md ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed bg-whitish"
                        : "from-muted/50 to-muted hover:bg-whitish hover:text-accent-foreground bg-whitish"
                    }`}
                    href={isDisabled ? "#" : "/account/settings"}
                    onClick={(e) => {
                      if (isDisabled) {
                        e.preventDefault();
                      }
                    }}
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                  >
                    <h1 className="relative flex items-center rounded-sm px-2 py-1.5 text-md outline-none">
                      Profile
                    </h1>
                    <MenubarShortcut>
                      <CircleUserIcon className="w-4 h-4" />
                    </MenubarShortcut>
                  </a>
                </NavigationMenuLink>
              </li>
              <MenubarSeparator />

              {/* Sign in */}
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className={`flex w-full items-center select-none justify-end rounded-md p-2 no-underline outline-none focus:shadow-md ${
                      isDisabled
                        ? "from-muted/50 to-muted hover:bg-accent hover:text-accent-foreground"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    href={isDisabled ? "/api/auth/signin" : "#"}
                    onClick={(e) => {
                      if (!isDisabled) {
                        e.preventDefault();
                      }
                    }}
                    aria-disabled={!isDisabled}
                    tabIndex={!isDisabled ? -1 : 0}
                  >
                    <h1 className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground">
                      Sign in
                    </h1>
                    <MenubarShortcut>
                      <LogIn className="w-4 h-4" />
                    </MenubarShortcut>
                  </a>
                </NavigationMenuLink>
              </li>

              {/* Sign up */}
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className={`flex w-full items-center select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md ${
                      isDisabled
                        ? "hover:bg-accent hover:text-accent-foreground"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    href={isDisabled ? "/api/auth/signup" : "#"}
                    onClick={(e) => {
                      if (!isDisabled) {
                        e.preventDefault();
                      }
                    }}
                    aria-disabled={!isDisabled}
                    tabIndex={!isDisabled ? -1 : 0}
                  >
                    <h1 className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground">
                      Sign up
                    </h1>
                    <MenubarShortcut>
                      <Mail className="w-4 h-4" />
                    </MenubarShortcut>
                  </a>
                </NavigationMenuLink>
              </li>
              <MenubarSeparator />

              {/* Logout */}
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className={`flex w-full items-center select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    // href={isDisabled ? "#" : "/api/auth/logout"}
                    onClick={(e) => {
                      if (isDisabled) {
                        e.preventDefault();
                      }
                      if (!isDisabled) {
                        e.preventDefault();
                        handleLogout();
                        // signOut();
                        // await processLogout();
                      }
                    }}
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                  >
                    <h1 className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground">
                      Logout
                    </h1>
                    <MenubarShortcut>
                      <CircleUserIcon className="w-4 h-4" />
                    </MenubarShortcut>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

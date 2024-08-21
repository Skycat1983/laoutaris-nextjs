"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/shadcn/navigation-menu";
import {
  CircleUserIcon,
  Heart,
  LogIn,
  Mail,
  ShoppingBasket,
  User,
} from "lucide-react";
import { MenubarSeparator, MenubarShortcut } from "../../shadcn/menubar";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function AccountMenu() {
  return (
    <NavigationMenu className="p-0 m-0">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <User />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="w-[150px] md:w-[200px] lg:w-[200px]">
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="flex w-full items-center select-none justify-end rounded-md  from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md"
                    href="api/auth/signin"
                  >
                    <h1 className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      Profile
                    </h1>
                    <MenubarShortcut>
                      <CircleUserIcon className="w-4 h-4" />
                    </MenubarShortcut>
                  </a>
                </NavigationMenuLink>
              </li>
              <MenubarSeparator />

              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="flex w-full items-center select-none justify-end rounded-md  from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md"
                    href="http://localhost:3000/api/auth/signin"
                  >
                    <h1 className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      Sign in
                    </h1>
                    <MenubarShortcut>
                      <LogIn className="w-4 h-4" />
                    </MenubarShortcut>
                  </a>
                </NavigationMenuLink>
              </li>

              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="flex w-full items-center select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md"
                    href="http://localhost:3000/api/auth/signin"
                  >
                    <h1 className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      Sign up
                    </h1>
                    <MenubarShortcut>
                      <Mail className="w-4 h-4" />
                    </MenubarShortcut>
                  </a>
                </NavigationMenuLink>
              </li>
              <MenubarSeparator />

              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="flex w-full items-center select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md"
                    href="api/auth/signin"
                  >
                    <h1 className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
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

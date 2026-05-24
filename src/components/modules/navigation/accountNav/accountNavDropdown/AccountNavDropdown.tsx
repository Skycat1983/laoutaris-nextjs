"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/shadcn/navigation-menu";
import { CircleUserIcon, LogIn, Mail } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserIcon } from "@/components/elements/icons/UserIcon";
import { MenubarSeparator, MenubarShortcut } from "@/components/shadcn/menubar";

interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AccountNavDropdownProps {
  initialOpen?: boolean;
}

interface AccountMenuRouteItemProps {
  disabled: boolean;
  disabledClassName: string;
  enabledClassName: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}

function AccountMenuRouteItem({
  disabled,
  disabledClassName,
  enabledClassName,
  href,
  icon,
  label,
}: AccountMenuRouteItemProps) {
  const className = `flex w-full items-center select-none justify-end rounded-md p-2 no-underline outline-none focus:shadow-md ${
    disabled ? disabledClassName : enabledClassName
  }`;

  const content = (
    <>
      <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground">
        {label}
      </span>
      <MenubarShortcut>{icon}</MenubarShortcut>
    </>
  );

  if (disabled) {
    return (
      <button
        type="button"
        className={className}
        disabled
        aria-disabled="true"
        tabIndex={-1}
      >
        {content}
      </button>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <Link className={className} href={href}>
        {content}
      </Link>
    </NavigationMenuLink>
  );
}

export function AccountNavDropdown({
  initialOpen = false,
}: AccountNavDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useGlobalFeatures();
  const [isLoading, setIsLoading] = React.useState(false);
  const [menuValue, setMenuValue] = React.useState(() =>
    initialOpen ? "account" : ""
  );
  const { data } = useSession();
  const session: UserSession | null = data?.user ?? null;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      if (pathname.startsWith("/account")) {
        openModal(<ModalMessage message="Logout successful." />, () =>
          router.push("/")
        );
      } else {
        openModal(<ModalMessage message="Logout successful." />);
      }
    } catch {
      openModal(<ModalMessage message="Logout failed." />);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = Boolean(session);
  const isProfileDisabled = !isAuthenticated || isLoading;
  const areAuthLinksDisabled = isAuthenticated || isLoading;
  const isLogoutDisabled = !isAuthenticated || isLoading;

  return (
    <NavigationMenu
      className="p-0 m-0 items-center"
      value={menuValue}
      onValueChange={setMenuValue}
    >
      <NavigationMenuList>
        <NavigationMenuItem value="account">
          <NavigationMenuTrigger>
            <div className="p-1 -m-1 border-2 border-whitish hover:border-slate/50 rounded-full">
              <UserIcon />
            </div>
          </NavigationMenuTrigger>

          <NavigationMenuContent className="">
            <ul className="w-[150px] md:w-[200px] lg:w-[200px]">
              <li className="row-span-1">
                <AccountMenuRouteItem
                  disabled={isProfileDisabled}
                  disabledClassName="opacity-50 cursor-not-allowed bg-whitish"
                  enabledClassName="from-muted/50 to-muted hover:bg-whitish hover:text-accent-foreground bg-whitish"
                  href="/account/settings"
                  icon={<CircleUserIcon className="w-4 h-4" />}
                  label="Profile"
                />
              </li>
              <MenubarSeparator />

              {/* Sign in */}
              <li className="row-span-1">
                <AccountMenuRouteItem
                  disabled={areAuthLinksDisabled}
                  disabledClassName="opacity-50 cursor-not-allowed"
                  enabledClassName="from-muted/50 to-muted hover:bg-accent hover:text-accent-foreground"
                  href="/sign-in"
                  icon={<LogIn className="w-4 h-4" />}
                  label="Sign in"
                />
              </li>

              {/* Sign up */}
              <li className="row-span-1">
                <AccountMenuRouteItem
                  disabled={areAuthLinksDisabled}
                  disabledClassName="bg-gradient-to-b from-muted/50 to-muted opacity-50 cursor-not-allowed"
                  enabledClassName="bg-gradient-to-b from-muted/50 to-muted hover:bg-accent hover:text-accent-foreground"
                  href="/sign-in?mode=signup"
                  icon={<Mail className="w-4 h-4" />}
                  label="Sign up"
                />
              </li>
              <MenubarSeparator />

              {/* Logout */}
              <li className="row-span-1">
                <button
                  type="button"
                  className={`flex w-full items-center select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md ${
                    isLogoutDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  disabled={isLogoutDisabled}
                  onClick={handleLogout}
                  aria-disabled={isLogoutDisabled}
                  tabIndex={isLogoutDisabled ? -1 : 0}
                >
                  <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-md outline-none focus:bg-accent focus:text-accent-foreground">
                    Logout
                  </span>
                  <MenubarShortcut>
                    <CircleUserIcon className="w-4 h-4" />
                  </MenubarShortcut>
                </button>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

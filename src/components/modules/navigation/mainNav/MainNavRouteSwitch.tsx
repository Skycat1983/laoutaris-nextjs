"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type MainNavRouteSwitchProps = {
  defaultNav: ReactNode;
  prototypeHomeNav: ReactNode;
};

export function MainNavRouteSwitch({
  defaultNav,
  prototypeHomeNav,
}: MainNavRouteSwitchProps) {
  const pathname = usePathname();
  const isPrototypeHome =
    pathname === "/prototype/home" || pathname.startsWith("/prototype/home/");

  return <>{isPrototypeHome ? prototypeHomeNav : defaultNav}</>;
}

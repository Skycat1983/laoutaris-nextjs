"use client";

import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { useState } from "react";

import {
  Drawer,
  DrawerTrigger,
} from "@/components/shadcn/drawer";
import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";

const MobileNavDrawerBody = dynamic(
  () =>
    import(
      "@/components/modules/navigation/mobileNavDrawer/MobileNavDrawerBody"
    ).then((module) => module.MobileNavDrawerBody),
  { ssr: false }
);

interface NavMenuProps {
  navLinks: NavBarLink[];
}

export function MobileNavDrawer({ navLinks }: NavMenuProps) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setHasOpened(true);
    }

    setOpen(nextOpen);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="inline-flex cursor-pointer items-center justify-center"
        >
          <Menu aria-hidden="true" />
        </button>
      </DrawerTrigger>
      {hasOpened ? <MobileNavDrawerBody navLinks={navLinks} /> : null}
    </Drawer>
  );
}

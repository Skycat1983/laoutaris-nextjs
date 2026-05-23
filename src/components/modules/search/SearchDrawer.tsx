"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerTrigger } from "@/components/shadcn/drawer";

const SearchDrawerBody = dynamic(
  () =>
    import("@/components/modules/search/SearchDrawerBody").then(
      (module) => module.SearchDrawerBody
    ),
  { ssr: false }
);

export function SearchDrawer() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setHasOpened(true);
    }

    setOpen(nextOpen);
  };

  return (
    <Drawer
      direction="top"
      shouldScaleBackground={false}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Open search"
          className="inline-flex cursor-pointer items-center justify-center"
        >
          <Search className="h-6 w-6" aria-hidden="true" />
        </button>
      </DrawerTrigger>
      {hasOpened ? <SearchDrawerBody setOpen={setOpen} /> : null}
    </Drawer>
  );
}

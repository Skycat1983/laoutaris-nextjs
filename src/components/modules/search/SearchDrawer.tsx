"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/shadcn/drawer";
import { Input } from "@/components/shadcn/input";
import { useRouter } from "next/navigation";

export function SearchDrawer() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    const searchParams = new URLSearchParams({
      q: query.trim(),
    });

    setOpen(false);
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <Drawer
      direction="top"
      shouldScaleBackground={false}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Search className="h-6 w-6 cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent className="fixed top-0 bg-transparent">
        <div className="mx-auto w-full max-w-full px-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-between py-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Search..."
                className="border-none shadow-none focus-visible:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                aria-label="Search"
              />
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                className="ml-4"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </DrawerClose>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

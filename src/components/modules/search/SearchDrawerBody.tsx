"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import {
  DrawerClose,
  DrawerContent,
} from "@/components/shadcn/drawer";
import { Input } from "@/components/shadcn/input";

interface SearchDrawerBodyProps {
  setOpen: (open: boolean) => void;
}

export function SearchDrawerBody({ setOpen }: SearchDrawerBodyProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) return;

    const searchParams = new URLSearchParams({
      q: query.trim(),
    });

    setOpen(false);
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
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
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              aria-label="Search"
            />
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label="Close search"
              className="ml-4"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
            >
              <X className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </button>
          </DrawerClose>
        </form>
      </div>
    </DrawerContent>
  );
}

"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState, useTransition } from "react";

import {
  DrawerClose,
  DrawerContent,
} from "@/components/shadcn/drawer";
import { Input } from "@/components/shadcn/input";
import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";

interface SearchDrawerBodyProps {
  setOpen: (open: boolean) => void;
}

export function SearchDrawerBody({ setOpen }: SearchDrawerBodyProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [shouldCloseWhenReady, setShouldCloseWhenReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!shouldCloseWhenReady || isPending) return;

    setOpen(false);
    setShouldCloseWhenReady(false);
  }, [isPending, setOpen, shouldCloseWhenReady]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) return;

    const searchParams = new URLSearchParams({
      q: query.trim(),
    });

    setShouldCloseWhenReady(true);
    startTransition(() => {
      router.push(`/search?${searchParams.toString()}`);
    });
  };

  return (
    <DrawerContent className="fixed top-0 bg-transparent">
      <div className="mx-auto w-full max-w-full px-4">
        <form
          onSubmit={handleSearch}
          className="flex items-center justify-between py-3"
          aria-busy={isPending}
        >
          <div className="flex-1">
            <Input
              placeholder="Search..."
              className="border-none shadow-none focus-visible:ring-0"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={isPending}
              autoFocus
              aria-label="Search"
            />
          </div>
          <button
            type="submit"
            aria-label="Submit search"
            disabled={isPending}
            className="ml-4 inline-flex items-center justify-center disabled:cursor-wait disabled:opacity-70"
          >
            {isPending ? (
              <LoadingStatus
                label="Opening mobile search results"
                size="small"
                className="text-gray-500"
                iconClassName="text-gray-500"
              />
            ) : (
              <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
            )}
          </button>
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

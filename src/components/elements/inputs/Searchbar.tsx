"use client";

import React, { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";
import { useRouter } from "next/navigation";

const Searchbar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    // Build search URL with query parameter
    const searchParams = new URLSearchParams({
      q: query.trim(),
    });

    startTransition(() => {
      router.push(`/search?${searchParams.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full" aria-busy={isPending}>
      <div className="flex flex-row bg-gray-100/40 rounded-r-2xl overflow-hidden">
        <div className="flex-grow">
          <Input
            className="w-full h-full px-4 py-4 border-greyer rounded-r-full"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isPending}
            aria-label="Search"
            style={{ outline: "none", boxShadow: "none" }}
          />
        </div>
        <button
          type="submit"
          aria-label="Submit search"
          disabled={isPending}
          className="flex flex-row items-center justify-center p-4 cursor-pointer disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? (
            <LoadingStatus
              label="Opening search results"
              size="small"
              className="text-slate-600"
              iconClassName="text-slate-600"
            />
          ) : (
            <Search className="text-slate-600" aria-hidden="true" />
          )}
        </button>
      </div>
    </form>
  );
};

export default Searchbar;

// const SearchbarOld = () => {
//   return (
//     <div className="flex flex-row bg-gray-100/40 rounded-r-2xl overflow-hidden">
//       <div className="flex-grow">
//         <Input
//           className="w-full h-full px-4 py-2 border-greyer rounded-r-full"
//           placeholder="Search"
//           style={{ outline: "none", boxShadow: "none" }}
//         />
//       </div>
//       <div className="flex flex-row items-center justify-center p-4">
//         <Search className="text-slate-600" />
//       </div>
//     </div>
//   );
// };

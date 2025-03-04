"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useRouter } from "next/navigation";

const Searchbar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    // Build search URL with query parameter
    const searchParams = new URLSearchParams({
      q: query.trim(),
    });

    // Navigate to search page with query
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-row bg-gray-100/40 rounded-r-2xl overflow-hidden">
        <div className="flex-grow">
          <Input
            className="w-full h-full px-4 py-4 border-greyer rounded-r-full"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            style={{ outline: "none", boxShadow: "none" }}
          />
        </div>
        <div
          className="flex flex-row items-center justify-center p-4 cursor-pointer"
          onClick={handleSearch}
        >
          <Search className="text-slate-600" />
        </div>
        {/* <Button
          type="submit"
          className=""
          aria-label="Submit search"
        >
          <Search className="text-slate-600" />
        </Button> */}
      </div>
    </form>
  );
};

export default Searchbar;

const SearchbarOld = () => {
  return (
    <div className="flex flex-row bg-gray-100/40 rounded-r-2xl overflow-hidden">
      <div className="flex-grow">
        <Input
          className="w-full h-full px-4 py-2 border-greyer rounded-r-full"
          placeholder="Search"
          style={{ outline: "none", boxShadow: "none" }}
        />
      </div>
      <div className="flex flex-row items-center justify-center p-4">
        <Search className="text-slate-600" />
      </div>
    </div>
  );
};

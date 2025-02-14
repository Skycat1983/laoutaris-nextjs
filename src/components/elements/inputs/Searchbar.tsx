import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/shadcn/input";

const Searchbar = () => {
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

export default Searchbar;

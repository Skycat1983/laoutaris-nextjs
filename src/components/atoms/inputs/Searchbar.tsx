import React from "react";
import { HouseIcon, Search } from "lucide-react";

const Searchbar = () => {
  return (
    <div className="flex flex-row bg-gray-100/40">
      <div className="rounded-r-2xl  border-l-0 overflow-hidden">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-full px-4 py-2  border-greyer"
        />
      </div>
      <div className="flex flex-row items-center justify-center p-4">
        <Search className="text-slate-600" />
      </div>
    </div>
  );
};

export default Searchbar;

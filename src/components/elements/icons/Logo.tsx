import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-row items-center space-x-2">
      {/* mobile */}
      <div className="flex flex-row sm:hidden">
        <div className="h-[50px] w-[50px] bg-gradient-to-bl from-gray-400/10 to-gray-900/20 m-2 flex justify-center items-center">
          <div className="h-[25px] w-full m-auto flex justify-center items-center border-r-[3px] border-black pl-1">
            <h1 className="font-archivo text-2xl">JL</h1>
          </div>
        </div>
        <div className="text-left justify-start items-center my-auto">
          <h1 className="font-archivoBlack text-sm">Joseph </h1>
          <h1 className="font-archivoBlack text-sm">Laoutaris </h1>
        </div>
      </div>
      {/* not mobile */}
      <div className="hidden sm:block">
        <h1 className="fontface-bold font-heading truncate my-auto text-3xl">
          Joseph Laoutaris
        </h1>
      </div>
    </div>
  );
};

export { Logo };

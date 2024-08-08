import React from "react";
import MobileNavLayout from "./nav/MobileNavLayout";
import TabletNavLayout from "./nav/TabletNavLayout";
import DesktopNavLayout from "./nav/DesktopNavLayout";
import Breadcrumbs from "./breadcrumbs/Breadcrumbs";
import Searchbar from "../../atoms/inputs/Searchbar";

const Header = () => {
  return (
    <>
      <header className="fixed top-0 z-10 w-screen bg-whitish">
        <nav>
          <div className="block sm:hidden">
            <MobileNavLayout />
          </div>
          <div className="hidden sm:block lg:hidden">
            <TabletNavLayout />
          </div>
          <div className="hidden lg:block">
            <DesktopNavLayout />
          </div>
        </nav>
        <div className=" hidden md:block  flex flex-col w-full bg-whitish px-4 py-4 lg:py-0">
          <hr className="flex flex-row flex-grow" />
          <div className="flex items-center grow justify-between min-h-[50px] px-0">
            <Breadcrumbs />
            <Searchbar />
          </div>
          <hr className="flex flex-row flex-grow" />
        </div>
      </header>
    </>
  );
};

export default Header;

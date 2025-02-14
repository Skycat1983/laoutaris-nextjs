"use server";

import Breadcrumbs from "@/components/ui/navigation/breadcrumbs/Breadcrumbs";
import Searchbar from "@/components/ui/common/inputs/Searchbar";
import NavBar from "@/components/ui/navBar/NavBar";

const Header = ({ className }: { className?: string }) => {
  return (
    <>
      <header className={`fixed top-0 z-10 w-full bg-whitish ${className}`}>
        <NavBar />

        <div className="flex flex-col w-full bg-whitish px-4 py-0 lg:py-0">
          <hr className="flex flex-row flex-grow" />
          <div className="flex items-center grow justify-between min-h-[50px] px-0">
            <Breadcrumbs />
            <div className="hidden md:block">
              <Searchbar />
            </div>
          </div>
          <hr className="flex flex-row flex-grow" />
        </div>
      </header>
    </>
  );
};

export default Header;

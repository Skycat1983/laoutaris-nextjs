"use server";

import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Searchbar from "../../atoms/inputs/Searchbar";
import NavBar from "../navBar/NavBar";

const Header = () => {
  return (
    <>
      <header className="fixed top-0 z-10 w-full bg-white">
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

{
  /* <nav>
          <div className="block sm:hidden">
            <MobileNavLayout />
          </div>
          <div className="hidden sm:block lg:hidden">
            <TabletNavLayout />
          </div>
          <div className="hidden lg:block">
            <DesktopNavLayout />
          </div>
        </nav> */
}

{
  /* <div className=" hidden md:block  flex flex-col w-full bg-whitish px-4 py-4 lg:py-0">
          <hr className="flex flex-row flex-grow" />
          <div className="flex items-center grow justify-between min-h-[50px] px-0">
            <Breadcrumbs />
            <Searchbar />
          </div>
          <hr className="flex flex-row flex-grow" />
        </div> */
}

import React from "react";
import MobileNavLayout from "./MobileNavLayout";
import TabletNavLayout from "./TabletNavLayout";
import DesktopNavLayout from "./DesktopNavLayout";

const Header = () => {
  return (
    <div>
      {" "}
      <div className="block sm:hidden">
        <MobileNavLayout />
      </div>
      <div className="hidden sm:block lg:hidden">
        <TabletNavLayout />
      </div>
      <div className="hidden lg:block">
        <DesktopNavLayout />
      </div>
    </div>
  );
};

export default Header;

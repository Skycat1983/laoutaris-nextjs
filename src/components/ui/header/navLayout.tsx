import React from "react";
import { NavOption } from "./headerTypes";

const NavLayout = () => {
  const centralNavigation: NavOption[] = [
    { to: "/artwork", label: "Artwork" },
    { to: "/biography", label: "Biography" },
    { to: "/project", label: "Project" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <div className="max-w-screen mx-auto flex flex-col min-h-screen">
      <header className="fixed top-0 z-10 w-screen bg-whitish">
        <nav className="grid"></nav>
      </header>
    </div>
  );
};

export default NavLayout;

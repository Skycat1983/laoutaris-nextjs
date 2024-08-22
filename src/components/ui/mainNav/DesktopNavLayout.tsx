"use server";

import Logo from "../../atoms/Logo";
import Link from "next/link";
import { AccountMenuBar } from "../accountMenuBar/AccountMenuBar";
interface NavLink {
  label: string;
  path: string;
}

interface DesktopNavLayoutProps {
  navLinks: NavLink[];
}

const DesktopNavLayout = ({ navLinks }: DesktopNavLayoutProps) => {
  return (
    <>
      {/* top row */}
      <div className="bg-whitish w-full flex flex-row justify-between space-x-6 px-4 py-6">
        <nav className="flex flex-row items-center my-auto">
          <Link href="/">
            <Logo />
          </Link>
        </nav>
        <div className="flex flex-row gap-5 items-center">
          <nav className="flex flex-row items-center h-auto space-x-6 ">
            {navLinks.map((link, index) => (
              <div key={index} className="hidden md:flex flex-row items-center">
                <Link href={link.path}>
                  <h2 className="font-face-default subheading">{link.label}</h2>
                </Link>
                {index < navLinks.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <h2 className="px-2 pl-6 text-xl font-thin">|</h2>
                  </div>
                )}
              </div>
            ))}
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
          </nav>

          <AccountMenuBar />
        </div>
      </div>
    </>
  );
};

export default DesktopNavLayout;

{
  /* <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <Link href="/project">
                <h2 className="font-face-default subheading">Project</h2>
              </Link>
            </div>
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>

            <div className="hidden md:flex flex-row items-center">
              <Link href="/shop">
                <h2 className="font-face-default subheading">Shop</h2>
              </Link>
            </div> */
}

{
  /* <div className="hidden md:flex flex-row items-center">
              <Link href="/blog">
                <h2 className="font-face-default subheading">Blog</h2>
              </Link>
            </div> */
}
{
  /* <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div> */
}

{
  /* <div className="hidden md:flex flex-row items-center">
              <Link href="/artwork">
                <h2 className="font-face-default subheading">Artwork</h2>
              </Link>
            </div> */
}
{
  /* <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <Link href="/biography">
                <h2 className="font-face-default subheading">Biography</h2>
              </Link>
            </div> */
}

{
  /* <User />
          <Heart />
          <ShoppingBasket /> */
}

{
  /* <div className="flex flex-row pr-6">
            <h1>DE</h1>
            <ChevronDown />
          </div> */
}

{
  /* <div className="flex flex-row">
            <Euro />
            <ChevronDown />
          </div> */
}

{
  /* <div className="flex flex-row space-x-4">
          <nav className="flex flex-row items-center h-auto space-x-3 md:space-x-6 bg-red-100">
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Artwork</h2>
            </div>
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Artist</h2>
            </div>
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Project</h2>
            </div>
            <div className="hidden md:flex items-center">
              <h2 className="px-2 text-xl font-thin">|</h2>
            </div>
            <div className="hidden md:flex flex-row items-center">
              <h2 className="font-face-default subheading">Blog</h2>
            </div>
          </nav>
        </div> */
}

{
  /* {centralNavigation.map((link, index) => (
                <React.Fragment key={index}>
                  <Link href={link.to} key={index}>
                    <div className="hidden md:flex flex-row items-center">
                      <h2 className="font-face-default subheading">
                        {link.label}
                      </h2>
                    </div>
                  </Link>
                  {index < centralNavigation.length && (
                    <div className="hidden md:flex items-center">
                      <h2 className="px-2 text-xl font-thin">|</h2>
                    </div>
                  )}
                </React.Fragment>
              ))} */
}
{
  /* {accountNavigation.map((link, index) => (
                <React.Fragment key={index}>
                  <Link href={link.to}>
                    <div className="flex flex-row items-center">
                      {link.label}
                    </div>
                  </Link>
                </React.Fragment>
              ))} */
}

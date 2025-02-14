import { ReactNode } from "react";
import { Subnav } from "../ui/subnav/Subnav";
import { BLOG_NAV_LINKS } from "@/constants/navigationLinks";

interface BlogsViewLayoutProps {
  children: ReactNode;
}

export const BlogsViewLayout = ({ children }: BlogsViewLayoutProps) => {
  return (
    <>
      <Subnav links={BLOG_NAV_LINKS} />
      <div className="grid grid-cols-12 gap-4 py-0">
        <div className="col-span-1 xl:col-span-2" />
        <div className="col-span-10 xl:col-span-8 flex flex-col gap-24">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 m-5">
            {children}
          </section>
        </div>
        <div className="col-span-1 xl:col-span-2" />
      </div>
    </>
  );
};

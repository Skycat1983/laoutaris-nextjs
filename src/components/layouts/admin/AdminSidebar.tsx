"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { FileText, Image as ImageIcon, User } from "lucide-react";
import CollectionIcon from "@/components/elements/icons/CollectionIcon";
import BlogIcon from "@/components/elements/icons/BlogIcon";
import LogoutIcon from "@/components/elements/icons/LogoutIcon";

const adminSidebarItems = [
  { label: "Articles", icon: <FileText />, href: "/admin/articles" },
  { label: "Artwork", icon: <ImageIcon />, href: "/admin/artwork" },
  { label: "Blogs", icon: <BlogIcon />, href: "/admin/blogs" },

  {
    label: "Collections",
    icon: <CollectionIcon />,
    href: "/admin/collections",
  },
  { label: "Users", icon: <User />, href: "/admin/users" },
];

// sidebar items but with /dashboard segment instead of /admin
const sidebarItems = [
  { label: "Articles", icon: <FileText />, href: "/dashboard/articles" },
  { label: "Artwork", icon: <ImageIcon />, href: "/dashboard/artwork" },
  { label: "Blogs", icon: <BlogIcon />, href: "/dashboard/blogs" },
  {
    label: "Collections",
    icon: <CollectionIcon />,
    href: "/dashboard/collections",
  },
  { label: "Users", icon: <User />, href: "/dashboard/users" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  console.log("pathname", pathname);
  const myh2 =
    "text-xl font-archivo font-medium px-2 bg-whitish subheading text-neutral-700 hidden lg:block md:px-4 lg:px-6";

  const iterables = pathname.includes("/admin")
    ? adminSidebarItems
    : sidebarItems;

  return (
    <div className="col-span-1 shadow-xl">
      <div className="flex flex-col text-left m-8 gap-2">
        {iterables.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-row items-center outline-none cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-all duration-200">
                <div
                  className={`
                    p-2 rounded-full transition-all duration-200
                    ${
                      isActive
                        ? "ring-2 ring-slate-200 bg-slate-100 text-slate-700"
                        : "text-slate-500"
                    }
                  `}
                >
                  {item.icon}
                </div>
                <h2 className={myh2}>{item.label}</h2>
              </div>
            </Link>
          );
        })}
        <div className="flex flex-row">
          <HorizontalDivider />
        </div>
        <div className="flex flex-row bg-whitish items-center cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-all duration-200">
          <div className="p-2">
            <LogoutIcon />
          </div>
          <h2 className={myh2}>Logout</h2>
        </div>
      </div>
    </div>
  );
}

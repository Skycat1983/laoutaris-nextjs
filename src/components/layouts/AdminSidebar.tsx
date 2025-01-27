"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import { FileText, Image as ImageIcon, User } from "lucide-react";
import CollectionIcon from "@/components/ui/common/icons/CollectionIcon";
import BlogIcon from "@/components/ui/common/icons/BlogIcon";
import LogoutIcon from "@/components/ui/common/icons/LogoutIcon";

const sidebarItems = [
  { label: "Users", icon: <User />, href: "/admin/users" },
  { label: "Articles", icon: <FileText />, href: "/admin/articles" },
  { label: "Artwork", icon: <ImageIcon />, href: "/admin/artwork" },
  {
    label: "Collections",
    icon: <CollectionIcon />,
    href: "/admin/collections",
  },
  { label: "Blogs", icon: <BlogIcon />, href: "/admin/blogs" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const myh2 =
    "text-xl font-archivo font-medium px-6 bg-whitish subheading text-neutral-700";

  return (
    <div className="col-span-1 shadow-xl">
      <div className="flex flex-col text-left m-8 gap-2">
        {sidebarItems.map((item) => {
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
        <div className="flex flex-row bg-white">
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

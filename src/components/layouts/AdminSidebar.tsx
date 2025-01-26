import Link from "next/link";
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
  const myh2 = "text-xl font-archivo px-8 bg-whitish";

  return (
    <div className="col-span-1 shadow-xl">
      <div className="flex flex-col text-left m-8 gap-5">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="flex flex-row items-center outline-none cursor-pointer">
              {item.icon}
              <h2 className={myh2}>{item.label}</h2>
            </div>
          </Link>
        ))}
        <div className="flex flex-row bg-white">
          <HorizontalDivider />
        </div>
        <div className="flex flex-row bg-whitish items-center cursor-pointer">
          <LogoutIcon />
          <h2 className={myh2}>Logout</h2>
        </div>
      </div>
    </div>
  );
}

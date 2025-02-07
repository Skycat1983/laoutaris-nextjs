import dbConnect from "@/utils/mongodb";
import { buildUrl } from "@/utils/buildUrl";
import SubNavBar from "@/components/ui/subnav/SubNavBar";
import { SubNavBarLink } from "@/lib/resolvers/subnavResolvers";
import { delay } from "@/utils/debug";
import { Subnav } from "@/components/ui/subnav/Subnav";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col flex-grow">
      {/* <Subnav links={subNavLinks} /> */}
      {children}
    </section>
  );
}

// await dbConnect();

// const stem = "blog";
// const subNavLinks: SubNavBarLink[] = [
//   {
//     title: "Latest",
//     slug: "latest",
//     link_to: buildUrl([stem], { sortby: "latest" }),
//   },
//   {
//     title: "Oldest",
//     slug: "oldest",
//     link_to: buildUrl([stem], { sortby: "oldest" }),
//   },
//   {
//     title: "Featured",
//     slug: "featured",
//     link_to: buildUrl([stem], { sortby: "featured" }),
//   },
//   {
//     title: "Popular",
//     slug: "popular",
//     link_to: buildUrl([stem], { sortby: "popular" }),
//     disabled: true,
//   },
// ];

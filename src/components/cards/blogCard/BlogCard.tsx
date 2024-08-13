import { IFrontendBlogEntry } from "@/lib/types/blogTypes";
import Link from "next/link";

interface BlogCardProps {
  stem: string;
  blogEntry: IFrontendBlogEntry;
}

const BlogCard = ({
  stem,
  blogEntry: {
    title,
    subtitle,
    // summary,
    // author,
    imageUrl,
    slug,
    displayDate,
    featured,
  },
}: BlogCardProps) => {
  const formattedDate = new Date(displayDate).toLocaleDateString();
  console.log("title :>> ", title);
  const featuredText = featured ? "Featured" : "";
  return (
    <>
      <Link href={`/blog/${stem}/${slug}`}>
        <div className="grid grid-cols-3 py-8">
          <div className="col-span-1">
            <img src={imageUrl} />
          </div>

          <div className="col-span-2">
            <div className="flex flex-col h-full text-left justify-center gap-3 pl-10">
              <p className="font-archivo font-bold">Diary</p>
              <h1 className="font-archivoBlack text-2xl">{title}</h1>
              <p className="font-fancy text-xl">{subtitle}</p>
              <div className="flex flex-row gap-8">
                <p className="font-bold">By Heron Laoutaris</p>
                <p className="text-gray-500">{formattedDate}</p>
              </div>
              <p className="font-fancy text-lg">{featuredText}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default BlogCard;

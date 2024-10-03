import { IFrontendBlogEntry } from "@/lib/client/types/blogTypes";
import Image from "next/image";
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
        <div className="grid grid-cols-3 py-8 fade-in">
          <div className="col-span-1">
            {/* <img src={imageUrl} /> */}
            <Image
              src={imageUrl}
              alt="Blog post cover"
              height={500}
              width={500}
              className="w-full h-full object-cover object-center"
            />
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

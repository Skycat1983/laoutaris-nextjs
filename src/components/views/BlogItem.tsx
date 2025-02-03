import {
  FrontendBlogEntryFull,
  FrontendBlogEntryUnpopulated,
} from "@/lib/types/blogTypes";
import Image from "next/image";

const BlogItem = ({
  title,
  subtitle,
  text,
  imageUrl,
  displayDate,
}: FrontendBlogEntryUnpopulated) => {
  return (
    <div className="w-full mx-auto">
      <div className="bg-white shadow-lg w-full rounded overflow-hidden">
        <Image
          className="w-full h-[500px] object-cover object-center"
          src={imageUrl}
          alt="Blog post cover"
          height={500}
          width={1000}
        />

        <div className="p-4">
          <div className="flex justify-center items-center text-gray-500 text-sm">
            <h1 className="text-3xl font-special p-8">{title}</h1>
          </div>

          <div className="flex justify-center items-center text-gray-500 text-sm">
            <p>By Heron Laoutaris</p> <p className="mx-2">|</p>
            <p>{new Date(displayDate).toLocaleDateString()}</p>
          </div>

          {text.split("\r\n\r\n").map((paragraph, index) => (
            <p key={index} className="mx-12 my-4 leading-8 prose-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogItem;

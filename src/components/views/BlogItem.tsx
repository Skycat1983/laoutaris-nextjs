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
          className="w-full h-64 object-cover object-center"
          src={imageUrl}
          alt="Blog post cover"
        />
        {/* <Image
          src={imageUrl}
          alt="Blog post cover"
          className="w-full h-64 object-cover object-center"
        /> */}

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

          <div className="mt-4 flex flex-row justify-center gap-5">
            <button className="text-white font-bold bg-blue-500 px-5 py-2 rounded hover:bg-blue-600">
              Like
            </button>

            <button className="text-black bg-white border-2 border-black font-bold  px-5 py-2 rounded hover:bg-blue-600">
              Comment
            </button>
            <button className="text-white bg-black font-bold px-5 py-2 rounded hover:bg-blue-600">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;

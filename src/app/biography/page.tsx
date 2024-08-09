import dbConnect from "@/utils/mongodb";
import { ArticleModel } from "../model/article";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseModel } from "../model/base";
import Subnav from "@/components/ui/subnav/Subnav";
import { getSectionContent } from "@/utils/server/getSectionContent";

export default async function Biography() {
  // ! not needed as fetching from layout?
  // await dbConnect();
  // const sectionContent = await getSectionContent("biography");
  // const stem = "biography";

  // const subNavLinks = sectionContent?.map((article) => ({
  //   title: article.title,
  //   slug: article.slug,
  // }))
  //   ? sectionContent
  //   : [];

  // console.log("articles :>> ", sectionContent);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>biogrpahy</h1>
    </main>
  );
}

{
  /* <Subnav items={subNavLinks} stem={stem} /> */
}

//! this is getting all articles. this is placeholder. we will need to get articles by section
// async function getBiographies() {
//   const articles = await ArticleModel.find().sort({ createdAt: -1 }).limit(5);
//   return articles;
// }

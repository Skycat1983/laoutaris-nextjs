import { ArticleModel } from "@/app/model/article";
import dbConnect from "@/utils/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const articles = await ArticleModel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(404).json({ message: "Failed to fetch articles" });
  }
}

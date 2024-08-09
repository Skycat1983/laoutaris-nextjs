import { ArticleModel } from "@/app/model/article";
import { BaseModel } from "@/app/model/content";
import dbConnect from "@/utils/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  // const content = await BaseModel.find({ section: "" });
  const content = await BaseModel.find();

  console.log("content :>> ", content);

  if (!content) {
    return new NextResponse("content not found", { status: 404 });
  }

  const result = content.json();

  console.log("result in route:>> ", result);

  // console.log("content :>> ", content);

  return new NextResponse(result);
}

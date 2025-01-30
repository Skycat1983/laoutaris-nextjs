import { BlogModel } from "@/lib/server/models";
import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");

  if (!_id) {
    return NextResponse.json(
      {
        success: false,
        errorCode: 400,
        message: "Missing blog entry ID",
      },
      { status: 400 }
    );
  }

  try {
    const updatedData: Partial<FrontendBlogEntryUnpopulated> = await req.json();

    const updatedBlog = await BlogModel.findByIdAndUpdate(_id, updatedData, {
      new: true, // return the updated document
      runValidators: true, // run model validations to ensure schema conformity
    }).lean(); // return a plain JS object instead of a Mongoose document

    if (!updatedBlog) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Blog entry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog entry:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Failed to update blog entry",
      },
      { status: 500 }
    );
  }
};

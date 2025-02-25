import { BlogModel, UserModel } from "@/lib/data/models";
import { FrontendUserWithComments } from "@/lib/data/types/userTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession(req);

  console.log("userId", userId);

  const blogId = "67b46c5a31b3f845bc8019d8";

  const blog = await BlogModel.findById(blogId);
  console.log("blog", blog);

  try {
    // First, let's get the raw comments without population to verify the blog IDs
    const rawUserWithoutPopulation = await UserModel.findById(userId)
      .select("comments")
      .lean()
      .exec();

    console.log(
      "Raw user without population:",
      JSON.stringify(rawUserWithoutPopulation, null, 2)
    );

    // Now let's try to populate with the correct model name
    const rawUserComments = await UserModel.findById(userId)
      .select("comments")
      .populate({
        path: "comments",
        populate: {
          path: "blog",
          model: "Blog", // Make sure this matches your actual model name
          select: "slug title imageUrl subtitle",
        },
      })
      .lean()
      .exec();

    if (!rawUserComments) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    console.log(
      "Raw user comments data in route.ts:",
      JSON.stringify(rawUserComments, null, 2)
    );

    const userComments =
      transformMongooseDoc<FrontendUserWithComments>(rawUserComments);

    console.log(
      "Transformed userComments in route.ts:",
      JSON.stringify(userComments, null, 2)
    );

    return NextResponse.json({
      success: true,
      data: userComments,
    } satisfies ApiSuccessResponse<FrontendUserWithComments>);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user comments",
    } satisfies ApiErrorResponse);
  }
}

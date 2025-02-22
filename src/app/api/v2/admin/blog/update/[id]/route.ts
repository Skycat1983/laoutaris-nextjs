import { BlogModel } from "@/lib/data/models";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/config/authOptions";
import { updateBlogSchema } from "@/lib/data/types/blogTypes";
import { z } from "zod";

// Create a modified schema for the API that accepts string dates
const apiUpdateBlogSchema = updateBlogSchema.extend({
  displayDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Blog ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = apiUpdateBlogSchema.parse(body);

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      { ...validatedData },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update blog" },
      { status: 500 }
    );
  }
}

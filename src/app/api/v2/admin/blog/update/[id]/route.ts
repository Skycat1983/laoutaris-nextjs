import { BlogModel } from "@/lib/data/models";
import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/session/getAuthUser";
import { apiUpdateBlogSchema } from "@/lib/data/schemas";
import { FrontendBlogEntry } from "@/lib/data/types";
import slugify from "slugify";
import { getRoleFromSession } from "@/lib/session/getRoleFromSession";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<FrontendBlogEntry>>> {
  try {
    // console.log("request", request);
    const userId = await getUserIdFromSession();
    const userRole = await getRoleFromSession(request);

    console.log("userid in blog update route", userId);
    console.log("userrole in blog update route", userRole);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiErrorResponse,
        { status: 401 }
      );
    }

    if (userRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Admin access required",
        } satisfies ApiErrorResponse,
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog ID is required",
        } satisfies ApiErrorResponse,
        { status: 400 }
      );
    }

    // Get the existing blog to compare title changes
    const existingBlog = await BlogModel.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = apiUpdateBlogSchema.parse(body);

    // Create a properly typed update object
    const updateData: Record<string, any> = { ...validatedData };

    // Check if title is being updated
    if (validatedData.title && validatedData.title !== existingBlog.title) {
      // Generate new slug from title
      const newSlug = slugify(validatedData.title, { lower: true });

      // Check if the new slug already exists (excluding the current blog)
      const slugExists = await BlogModel.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (slugExists) {
        // Return an error if the slug already exists
        return NextResponse.json(
          {
            success: false,
            error: `A blog with a similar title already exists. The slug "${newSlug}" is already taken.`,
          } satisfies ApiErrorResponse,
          { status: 409 } // Conflict status code
        );
      } else {
        // Use the new slug if it's unique
        updateData.slug = newSlug;
        console.log(
          `Updating slug from "${existingBlog.slug}" to "${newSlug}"`
        );
      }
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    console.log("updatedBlog", updatedBlog);

    return NextResponse.json({
      success: true,
      data: updatedBlog,
    } satisfies ApiSuccessResponse<FrontendBlogEntry>);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update blog",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}

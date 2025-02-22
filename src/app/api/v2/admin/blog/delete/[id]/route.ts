import { BlogModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import type { DeleteResponse } from "@/lib/api/admin/delete/fetchers";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json<DeleteResponse>(
        {
          success: false,
          error: "Blog ID is required",
        },
        { status: 400 }
      );
    }

    const deletedBlog = await BlogModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json<DeleteResponse>(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<DeleteResponse>({
      success: true,
      data: null,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json<DeleteResponse>(
      {
        success: false,
        error: "Failed to delete blog",
      },
      { status: 500 }
    );
  }
}

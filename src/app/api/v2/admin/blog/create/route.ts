import { authOptions } from "@/lib/config/authOptions";
import { BlogModel } from "@/lib/data/models";
import { CreateBlogFormSchema } from "@/lib/data/schemas/formSchemas";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CreateBlogFormSchema.parse(body);

    // Create slug from title
    const slug = slugify(validatedData.title, { lower: true });

    // Combine the validated data with additional fields
    const blogData = {
      ...validatedData,
      slug,
      author: session.user.id,
    };

    const blog = new BlogModel(blogData);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error in blog create route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog entry" },
      { status: 500 }
    );
  }
}

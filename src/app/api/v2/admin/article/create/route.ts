import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import slugify from "slugify";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Create slug from title
    const slug = slugify(body.title, { lower: true });

    // Combine the request body with additional data
    const articleData = {
      ...body,
      slug,
      author: session.user.id,
    };

    const article = new ArticleModel(articleData);
    await article.save();

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create article" },
      { status: 500 }
    );
  }
}

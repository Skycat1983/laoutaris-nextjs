import { IFrontendBlogEntry } from "@/lib/client/types/blogTypes";
import { BlogAvailability } from "@/lib/server/blog/blogTypes";
import { BlogModel } from "@/lib/server/models";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  console.log("section in GET blog availability", section);

  if (!section) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 400,
        message: "section parameter is missing",
      },
      { status: 400 }
    );
  }

  let query = {};
  let sort = {};

  switch (section) {
    case "latest":
      sort = { displayDate: -1 };
      break;
    case "oldest":
      sort = { displayDate: 1 };
      break;
    case "featured":
      query = { featured: true };
      break;
    // case 'popular':
    //   sort = { likes: -1 };
    //   break;
    default:
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 400,
          message: "Invalid section parameter",
        },
        { status: 400 }
      );
  }

  console.log("query", query);

  try {
    const blogEntries = (await BlogModel.find(query)
      .populate("author")
      .lean()) as IFrontendBlogEntry[];

    if (!blogEntries) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccessResponse<IFrontendBlogEntry[]>>({
      success: true,
      data: blogEntries,
    });
  } catch (error) {
    console.error("Error fetching article", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

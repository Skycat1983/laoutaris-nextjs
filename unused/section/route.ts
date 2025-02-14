import { BlogModel } from "@/lib/data/models";
import { FrontendBlogEntryUnpopulated } from "@/lib/data/types/blogTypes";
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
  let sort: Record<string, 1 | -1> = {};

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

  try {
    const blogEntries = (await BlogModel.find(query)
      .sort(sort)
      .populate("author")
      .lean()) as FrontendBlogEntryUnpopulated[];

    if (!blogEntries || blogEntries.length === 0) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "No blog entries found",
        },
        { status: 404 }
      );
    }

    console.log("blogEntries", blogEntries);

    return NextResponse.json<
      ApiSuccessResponse<FrontendBlogEntryUnpopulated[]>
    >({
      success: true,
      data: blogEntries,
    });
  } catch (error) {
    console.error("Error fetching blog entries", error);
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

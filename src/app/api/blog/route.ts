import { BlogModel } from "@/lib/server/models";
import { parseFields } from "@/utils/parseFields";
import { NextRequest, NextResponse } from "next/server";

// sortRange
// sortBy

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const identifierKey = searchParams.get("identifierKey");
  const identifierValue = searchParams.get("identifierValue");
  const fieldsParam = searchParams.get("fields");

  // Validate presence of identifierKey and identifierValue
  if (!identifierKey || !identifierValue) {
    return NextResponse.json(
      {
        success: false,
        errorCode: 400,
        message: "Missing identifierKey or identifierValue",
      },
      { status: 400 }
    );
  }

  // Process fields parameter
  const fields = parseFields(fieldsParam);

  // Construct the query object dynamically
  const query: Record<string, string> = {
    [identifierKey]: identifierValue,
  };

  try {
    // Build the Mongoose query
    let mongooseQuery = BlogModel.find(query).sort({ updatedAt: 1 }).lean();

    if (fields) {
      mongooseQuery = mongooseQuery.select(fields);
    }

    // Execute the query
    const blogEntries = await mongooseQuery;

    if (!blogEntries.length) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Blog entries not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blogEntries,
    });
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

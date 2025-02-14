import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/lib/data/models";
import { parseFields } from "@/lib/utils/parseFields";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);

  try {
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

    // Build the Mongoose query
    let mongooseQuery = UserModel.findOne(query).lean();

    if (fields) {
      mongooseQuery = mongooseQuery.select(fields);
    }

    // Execute the query
    const user = await mongooseQuery;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
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

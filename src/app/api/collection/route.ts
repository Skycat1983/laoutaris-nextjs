import { CollectionModel } from "@/lib/server/models";
import { parseFields } from "@/utils/parseFields";
import { NextRequest, NextResponse } from "next/server";
import { isStaticGenBailoutError } from "next/dist/client/components/static-generation-bailout";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const identifierKey = searchParams.get("identifierKey");
  const identifierValue = searchParams.get("identifierValue");
  const fieldsParam = searchParams.get("fields");

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

  const fields = parseFields(fieldsParam);

  const query: Record<string, string> = {
    [identifierKey]: identifierValue,
  };

  try {
    let mongooseQuery = CollectionModel.find(query)
      .sort({ updatedAt: 1 })
      .lean();

    if (fields) {
      mongooseQuery = mongooseQuery.select(fields);
    }

    const collections = await mongooseQuery;

    if (!collections.length) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Collections not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    // unstable_rethrow(error)
    console.error("Error fetching collections:", error);
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

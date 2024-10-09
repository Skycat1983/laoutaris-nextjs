import { CollectionModel, ICollectionContent } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

const parseFields = (fieldsParam: string | null): string | undefined => {
  return fieldsParam && fieldsParam.trim() !== ""
    ? fieldsParam.replace(/,/g, " ")
    : undefined;
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
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

    // Build the Mongoose query
    let mongooseQuery = CollectionModel.find(query)
      .sort({ updatedAt: 1 })
      .lean();

    if (fields) {
      mongooseQuery = mongooseQuery.select(fields);
    }

    // Execute the query
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

//! working version?
// export const GET = async (req: NextRequest): Promise<NextResponse> => {
//   const { searchParams } = new URL(req.url);
//   const identifierKey = searchParams.get("identifierKey");
//   const identifierValue = searchParams.get("identifierValue");
//   const fieldsParam = searchParams.get("fields");

//   // Validate presence of identifierKey and identifierValue
//   if (!identifierKey || !identifierValue) {
//     return NextResponse.json(
//       {
//         success: false,
//         errorCode: 400,
//         message: "Missing identifierKey or identifierValue",
//       },
//       { status: 400 }
//     );
//   }

//   // Process fields parameter
//   const fields: string | null =
//     fieldsParam && fieldsParam.trim() !== ""
//       ? fieldsParam.replace(/,/g, " ")
//       : null;

//   // type-safe query object?
//   const query: Record<string, unknown> = {
//     [identifierKey]: identifierValue,
//   };

//   try {
//     let collections;
//     // Execute the query using find, which returns an array
//     if (fields) {
//       collections = await CollectionModel.find(query)
//         .select(fields)
//         .sort({ updatedAt: 1 })
//         .lean();
//     } else {
//       collections = await CollectionModel.find(query)
//         .sort({ updatedAt: 1 })
//         .lean();
//     }

//     if (!collections || collections.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           errorCode: 404,
//           message: "Collections not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: collections,
//     });
//   } catch (error) {
//     console.error("Error fetching collections:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         errorCode: 500,
//         message: "Internal Server Error",
//       },
//       { status: 500 }
//     );
//   }
// };

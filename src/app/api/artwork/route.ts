import { ArtworkModel } from "@/lib/server/models";
import { parseFields } from "@/utils/parseFields";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const identifierKey = searchParams.get("identifierKey");
    const identifierValue = searchParams.get("identifierValue");
    const fieldsParam = searchParams.get("fields");
    const single = searchParams.get("single"); // new parameter

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

    let mongooseQuery =
      single === "true"
        ? ArtworkModel.findOne(query) //`findOne` when expecting a single result
        : ArtworkModel.find(query); // `find` for multiple results

    mongooseQuery = mongooseQuery.sort({ updatedAt: 1 }).lean();

    if (fields) {
      mongooseQuery = mongooseQuery.select(fields);
    }

    const artwork = await mongooseQuery;

    console.log("artwork", artwork);

    // Handle results based on `single`
    if (single === "true") {
      if (!artwork) {
        // `findOne` returns `null` if no match is found
        return NextResponse.json(
          {
            success: false,
            errorCode: 404,
            message: "Artwork not found",
          },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: artwork, // Single object
      });
    }

    // Handle multiple results for `find`
    if (artwork.length === 0) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "No artworks found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: artwork, // Array of objects
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

// export const GET = async (req: NextRequest): Promise<NextResponse> => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const identifierKey = searchParams.get("identifierKey");
//     const identifierValue = searchParams.get("identifierValue");
//     const fieldsParam = searchParams.get("fields");

//     // Validate presence of identifierKey and identifierValue
//     if (!identifierKey || !identifierValue) {
//       return NextResponse.json(
//         {
//           success: false,
//           errorCode: 400,
//           message: "Missing identifierKey or identifierValue",
//         },
//         { status: 400 }
//       );
//     }

//     // Process fields parameter
//     const fields = parseFields(fieldsParam);

//     // Construct the query object dynamically
//     const query: Record<string, string> = {
//       [identifierKey]: identifierValue,
//     };

//     // Build the Mongoose query
//     let mongooseQuery = ArtworkModel.find(query).sort({ updatedAt: 1 }).lean();

//     if (fields) {
//       mongooseQuery = mongooseQuery.select(fields);
//     }

//     // Execute the query
//     const artwork = await mongooseQuery;

//     console.log("artwork in api/artwork", artwork);

//     if (!artwork.length) {
//       return NextResponse.json(
//         {
//           success: false,
//           errorCode: 404,
//           message: "Artwork not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: artwork,
//     });
//   } catch (error) {
//     console.error("Error fetching artwork:", error);
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

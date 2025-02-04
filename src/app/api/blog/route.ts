import { BlogModel } from "@/lib/server/models";
import { NextResponse } from "next/server";

export type SortByType = "latest" | "oldest" | "popular" | "featured";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const sortby = (searchParams.get("sortby") as SortByType) || "latest";

  const page = parseInt(searchParams.get("page") || "1", 10); // default to page 1
  const limit = parseInt(searchParams.get("limit") || "6", 10); // default to 5 entries per request
  const skip = (page - 1) * limit; // calc how many entries to skip

  // Base query
  let query = BlogModel.find({}).skip(skip).limit(limit);

  // Apply sorting
  switch (sortby) {
    case "latest":
      query = query.sort({ displayDate: -1 });
      break;
    case "oldest":
      query = query.sort({ displayDate: 1 });
      break;
    // case "popular":
    //   query = query.sort({ views: -1 });
    //   break;
    case "featured":
      query = query.where({ featured: true }).sort({ displayDate: -1 });
      break;
    default:
      return NextResponse.json(
        { error: "Invalid sortby value" },
        { status: 400 }
      );
  }

  const blogEntries = await query.exec();

  return NextResponse.json({
    page,
    limit,
    total: await BlogModel.countDocuments(),
    results: blogEntries,
  });
}

// export const GET = async (req: NextRequest): Promise<NextResponse> => {
//   const { searchParams } = new URL(req.url);
//   const identifierKey = searchParams.get("identifierKey");
//   const identifierValue = searchParams.get("identifierValue");
//   const fieldsParam = searchParams.get("fields");
//   const single = searchParams.get("single");

//   console.log("in GET /api/blog");

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
//   const fields = parseFields(fieldsParam);

//   // Construct the query object dynamically
//   const query: Record<string, string> = {
//     [identifierKey]: identifierValue,
//   };

//   try {
//     // let mongooseQuery = BlogModel.find(query).sort({ updatedAt: 1 }).lean();

//     let mongooseQuery =
//       single === "true"
//         ? BlogModel.findOne(query) //`findOne` when expecting a single result
//         : BlogModel.find(query); // `find` for multiple results

//     mongooseQuery = mongooseQuery.sort({ updatedAt: 1 }).lean();

//     if (fields) {
//       mongooseQuery = mongooseQuery.select(fields);
//     }

//     // Execute the query
//     const blogEntries = await mongooseQuery;

//     console.log("blogEntries :>> ", blogEntries);

//     if (!blogEntries) {
//       return NextResponse.json(
//         {
//           success: false,
//           errorCode: 404,
//           message: "Blog entries not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: blogEntries,
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

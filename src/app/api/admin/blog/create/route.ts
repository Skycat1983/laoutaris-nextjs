import { createBlogEntry } from "@/lib/server/admin/actions/createBlogEntry";
import { CreateBlogFormSchema } from "@/lib/server/schemas/formSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = CreateBlogFormSchema.parse(body);

    const result = await createBlogEntry(validatedData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in blog create route:", error);
    return NextResponse.json(
      { error: "Failed to create blog entry" },
      { status: 500 }
    );
  }
}

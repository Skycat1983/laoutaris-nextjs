import { createBlogEntry } from "@/lib/old_code/admin/actions/createBlogEntry";
import { CreateBlogFormSchema } from "@/lib/data/schemas/formSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("1. Blog create route called");
  try {
    const body = await request.json();

    const validatedData = CreateBlogFormSchema.parse(body);

    const result = await createBlogEntry(validatedData);
    console.log("result in create route", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in blog create route:", error);
    return NextResponse.json(
      { error: "Failed to create blog entry" },
      { status: 500 }
    );
  }
}

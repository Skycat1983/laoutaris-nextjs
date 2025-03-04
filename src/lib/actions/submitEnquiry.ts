"use server";

import { FrontendEnquiry } from "@/lib/data/types/enquiryTypes";
import { headers } from "next/headers";
import { EnquiryModel } from "../data/models";
import { replaceMongoId } from "@/lib/helpers/transformData";

export async function submitEnquiry(
  formData: FormData
): Promise<ApiResponse<FrontendEnquiry>> {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const enquiryType = formData.get("enquiryType");
    const message = formData.get("message");

    console.log("Field values", { name, email, enquiryType, message });

    if (!name || !email || !enquiryType || !message) {
      throw new Error("All fields are required.");
    }

    // ! Problems with POST request
    // const result = await fetch("http://localhost:3000/api/enquiry", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     ...headers(),
    //   },
    //   body: JSON.stringify({ name, email, enquiryType, message }),
    // }).then((res) => {
    //   console.log("Response received:", res);
    //   return res.json();
    // });
    // console.log("result in submitEnquiry", JSON.stringify(result, null, 2));

    // if (!result || !result.success) {
    //   return {
    //     success: false,
    //     message: result.message || "Failed to submit enquiry.",
    //   };
    // }

    const newEnquiry = await EnquiryModel.create({
      name,
      email,
      enquiryType,
      message,
    });

    const transformedEnquiry = replaceMongoId(newEnquiry.toObject());

    console.log("newEnquiry created:", newEnquiry);

    return { success: true, data: transformedEnquiry as FrontendEnquiry };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
}

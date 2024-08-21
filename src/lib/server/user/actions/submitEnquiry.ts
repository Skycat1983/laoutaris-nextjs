"use server";

import { z } from "zod";

// const formSchema = z.object({
//   name: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   enquiryType: z.enum(["print", "original", "both"]),
//   message: z.string().min(10, {
//     message: "Message must be at least 10 characters.",
//   }),
// });
//   const validatedFields = formSchema.safeParse({
//     name: formData.get("name") as string,
//     email: formData.get("email") as string,
//     enquiryType: formData.get("enquiryType") as string,
//     message: formData.get("message") as string,
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }
export async function submitEnquiry(formData: FormData) {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const enquiryType = formData.get("enquiryType");
    const message = formData.get("message");

    console.log(name, email, enquiryType, message);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    throw new Error(errorMessage);
  }
}

//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       console.log(formData); // placeholder for actual logic
//       resolve();
//     }, 1000);
//   });

import { IFrontendSubscriber } from "@/lib/types/subscriberTypes";
import { headers } from "next/headers";

export async function fetchSubscriber(
  email: string
): Promise<ApiResponse<IFrontendSubscriber>> {
  const result = await fetch(
    `http://localhost:3000/api/subscriber/email?email=${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  if (!result || !result.success) {
    return { success: false, message: "Subscriber not found" };
  }

  return { success: true, data: result.data };
}

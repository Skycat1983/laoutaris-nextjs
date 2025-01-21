"use server";

import { replaceMongoId } from "@/utils/transformData";
import { SubscriberModel } from "../../models";
import { FrontendSubscriber } from "@/lib/types/subscriberTypes";

export async function submitSubscription(
  formData: FormData
): Promise<ApiResponse<FrontendSubscriber>> {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    // Ensure both name and email are provided
    if (!email || !name) {
      throw new Error("Name and email are required.");
    }

    const existingSubscriber = await SubscriberModel.findOne({ email });

    if (existingSubscriber) {
      throw new Error("You are already subscribed.");
    }

    const newSubscriber = await SubscriberModel.create({ name, email });

    const subscriber = replaceMongoId(newSubscriber.toObject());

    console.log("subscriber :>> ", subscriber);

    // ! failed attempts to fetch using route handler. problem with POST request
    // const existingSubscriber = await fetchSubscriber(email);

    // if (existingSubscriber.success) {
    //   throw new Error("You are already subscribed.");
    // }

    // Create and save the new subscriber
    // const newSubscriber = await postSubscriber(name, email);

    // if (!newSubscriber.success) {
    //   return {
    //     success: false,
    //     message:
    //       newSubscriber.message ||
    //       "An error occurred while creating the subscriber.",
    //   };
    // }

    return { success: true, data: subscriber as FrontendSubscriber };
  } catch (error) {
    console.error("Error creating subscriber:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while subscribing.",
    };
  }
}

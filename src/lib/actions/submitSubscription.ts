"use server";

import { replaceMongoId } from "@/lib/shared/helpers/transformData";
import { SubscriberModel } from "../data/models";
import { FrontendSubscriber } from "@/lib/data/types/subscriberTypes";

export interface SubscribeFormState {
  success: boolean;
  message: string;
  data?: FrontendSubscriber;
}

export async function submitSubscription(
  prevState: SubscribeFormState,
  formData: FormData
): Promise<SubscribeFormState> {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return {
        success: false,
        message: "Email is required.",
      };
    }

    const existingSubscriber = await SubscriberModel.findOne({ email });

    if (existingSubscriber) {
      return {
        success: false,
        message: "You are already subscribed.",
      };
    }

    console.log("Attempting to create subscriber with data:", { email });

    const newSubscriber = await SubscriberModel.create({ email });
    const subscriber = replaceMongoId(newSubscriber.toObject());

    return {
      success: true,
      message: "Successfully subscribed!",
      data: subscriber as FrontendSubscriber,
    };
  } catch (error) {
    console.error("Error creating subscriber:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while subscribing.",
    };
  }
}

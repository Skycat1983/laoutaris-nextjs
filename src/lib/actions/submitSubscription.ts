"use server";

import { replaceMongoId } from "@/lib/helpers/transformData";
import { SubscriberModel } from "@/lib/data/models/subscribersModel";
import { subscriberSchema } from "@/lib/data/schemas/subscriberSchema";
import dbConnect from "@/lib/db/mongodb";
import { createServerLogger } from "@/lib/observability/logger";
import type { FrontendSubscriber } from "@/lib/data/types/subscriberTypes";

export interface SubscribeFormState {
  success: boolean;
  message: string;
  data?: FrontendSubscriber;
}

const logger = createServerLogger({
  operation: "subscription.submit",
  surface: "server_action",
});

const getErrorForLog = (error: unknown) => {
  const logError = new Error("Subscription action failed");
  logError.name = error instanceof Error ? error.name : "UnknownError";

  return logError;
};

export async function submitSubscription(
  prevState: SubscribeFormState,
  formData: FormData
): Promise<SubscribeFormState> {
  const validation = subscriberSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const { email } = validation.data;

  try {
    await dbConnect();
    const existingSubscriber = await SubscriberModel.findOne({ email });

    if (existingSubscriber) {
      return {
        success: false,
        message: "You are already subscribed.",
      };
    }

    const newSubscriber = await SubscriberModel.create({ email });
    const subscriber = replaceMongoId(newSubscriber.toObject());

    return {
      success: true,
      message: "Successfully subscribed!",
      data: subscriber as FrontendSubscriber,
    };
  } catch (error) {
    logger.error("action.subscription.submit.failed", {
      action: "submitSubscription",
      statusCategory: "persistence_failed",
      error: getErrorForLog(error),
    });

    return {
      success: false,
      message: "We could not complete your subscription. Please try again.",
    };
  }
}

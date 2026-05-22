"use server";

import { randomBytes } from "crypto";
import { replaceMongoId } from "@/lib/helpers/transformData";
import { SubscriberModel } from "@/lib/data/models/subscribersModel";
import {
  NEWSLETTER_CONSENT_TEXT,
  NEWSLETTER_CONSENT_TEXT_SOURCE,
  NEWSLETTER_CONSENT_VERSION,
  subscriptionFormSchema,
  unsubscribeTokenSchema,
} from "@/lib/data/schemas/subscriberSchema";
import dbConnect from "@/lib/db/mongodb";
import { createServerLogger } from "@/lib/observability/logger";
import type { FrontendSubscriber } from "@/lib/data/types/subscriberTypes";

export interface SubscribeFormState {
  success: boolean;
  message: string;
  data?: FrontendSubscriber;
}

export interface UnsubscribeFormState {
  success: boolean;
  message: string;
}

const logger = createServerLogger({
  operation: "subscription.submit",
  surface: "server_action",
});

const unsubscribeLogger = createServerLogger({
  operation: "subscription.unsubscribe",
  surface: "server_action",
});

const getErrorForLog = (error: unknown) => {
  const logError = new Error("Subscription action failed");
  logError.name = error instanceof Error ? error.name : "UnknownError";

  return logError;
};

const getUnsubscribeErrorForLog = (error: unknown) => {
  const logError = new Error("Subscription unsubscribe failed");
  logError.name = error instanceof Error ? error.name : "UnknownError";

  return logError;
};

const createUnsubscribeToken = () => randomBytes(32).toString("base64url");

const toFrontendSubscriber = (subscriberObject: {
  _id: unknown;
  email: string;
  unsubscribed: boolean;
}) => {
  const subscriber = replaceMongoId(subscriberObject);

  return {
    id: subscriber.id,
    email: subscriber.email,
    unsubscribed: subscriber.unsubscribed,
  };
};

export async function submitSubscription(
  prevState: SubscribeFormState,
  formData: FormData
): Promise<SubscribeFormState> {
  const validation = subscriptionFormSchema.safeParse({
    email: formData.get("email"),
    newsletterConsent: formData.get("newsletterConsent"),
    sourcePath: formData.get("sourcePath"),
  });

  if (!validation.success) {
    const invalidEmail = validation.error.issues.some(
      (issue) => issue.path[0] === "email"
    );
    const missingConsent = validation.error.issues.some(
      (issue) => issue.path[0] === "newsletterConsent"
    );

    return {
      success: false,
      message: invalidEmail
        ? "Please enter a valid email address."
        : missingConsent
        ? "Please confirm newsletter consent before subscribing."
        : "Please enter a valid email address.",
    };
  }

  const { email, sourcePath } = validation.data;

  try {
    await dbConnect();
    const existingSubscriber = await SubscriberModel.findOne({ email });

    if (existingSubscriber) {
      return {
        success: false,
        message: "You are already subscribed.",
      };
    }

    const newSubscriber = await SubscriberModel.create({
      email,
      unsubscribed: false,
      unsubscribedAt: null,
      consentVersion: NEWSLETTER_CONSENT_VERSION,
      consentText: NEWSLETTER_CONSENT_TEXT,
      consentTextSource: NEWSLETTER_CONSENT_TEXT_SOURCE,
      consentAcceptedAt: new Date(),
      sourcePath,
      unsubscribeToken: createUnsubscribeToken(),
    });
    const subscriber = toFrontendSubscriber(newSubscriber.toObject());

    return {
      success: true,
      message: "Successfully subscribed!",
      data: subscriber,
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

export async function unsubscribeNewsletter(
  prevState: UnsubscribeFormState,
  formData: FormData
): Promise<UnsubscribeFormState> {
  const validation = unsubscribeTokenSchema.safeParse(formData.get("token"));

  if (!validation.success) {
    return {
      success: false,
      message: "This unsubscribe link is invalid or has expired.",
    };
  }

  try {
    await dbConnect();
    const subscriber = await SubscriberModel.findOneAndUpdate(
      { unsubscribeToken: validation.data },
      {
        $set: {
          unsubscribed: true,
          unsubscribedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!subscriber) {
      return {
        success: false,
        message: "This unsubscribe link is invalid or has expired.",
      };
    }

    return {
      success: true,
      message: "You have been unsubscribed.",
    };
  } catch (error) {
    unsubscribeLogger.error("action.subscription.unsubscribe.failed", {
      action: "unsubscribeNewsletter",
      statusCategory: "persistence_failed",
      error: getUnsubscribeErrorForLog(error),
    });

    return {
      success: false,
      message: "We could not complete your unsubscribe request. Please try again.",
    };
  }
}

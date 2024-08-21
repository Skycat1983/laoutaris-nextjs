import { SubscriberModel } from "../../models";
import { getSubscribers } from "./getSubscribers";

export async function submitSubscription(formData: FormData): Promise<void> {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    // Ensure both name and email are provided
    if (!email || !name) {
      throw new Error("Name and email are required.");
    }

    const existingSubscribers = await getSubscribers();

    const isAlreadySubscribed = existingSubscribers.some(
      (subscriber) => subscriber.email === email
    );

    if (isAlreadySubscribed) {
      throw new Error("You are already subscribed.");
    }

    // Create and save the new subscriber
    const newSubscriber = await SubscriberModel.create({
      name,
      email,
    });

    // Optionally log the success or return a success message
    console.log(`Subscriber ${newSubscriber.email} successfully created.`);
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating subscriber:", error);

    // Optionally, rethrow the error or throw a new error with a user-friendly message
    throw new Error(
      error instanceof Error
        ? error.message
        : "An error occurred while subscribing."
    );
  }
}

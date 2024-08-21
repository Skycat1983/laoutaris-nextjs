import { replaceMongoIdInArray } from "@/utils/transformData";
import { SubscriberModel } from "../../models";

export async function getSubscribers() {
  try {
    const subscribers = await SubscriberModel.find().lean();
    return replaceMongoIdInArray(subscribers);
  } catch (error) {
    throw new Error("An error occurred while fetching subscribers.");
  }
}

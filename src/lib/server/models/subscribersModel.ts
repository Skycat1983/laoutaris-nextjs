import mongoose, { Document } from "mongoose";

export interface ISubscriberContent extends Document {
  name: string;
  email: string;
  unsubsribed: boolean;
}

const subscriberContentSchema = new mongoose.Schema<ISubscriberContent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    unsubsribed: { type: Boolean, default: false },
  },
  {
    collection: "subscribers",
    timestamps: true,
  }
);

const SubscriberModel =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriberContent>("Subscriber", subscriberContentSchema);

export { SubscriberModel };

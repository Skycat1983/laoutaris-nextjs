import mongoose, { Document } from "mongoose";

export interface DBSubscriber extends Document {
  email: string;
  unsubscribed: boolean;
}

export type LeanSubscriber = Omit<DBSubscriber, keyof Document> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

const subscriberContentSchema = new mongoose.Schema<DBSubscriber>(
  {
    email: { type: String, required: true, unique: true },
    unsubscribed: { type: Boolean, default: false },
  },
  {
    collection: "subscribers",
    timestamps: true,
  }
);

const SubscriberModel =
  mongoose.models.Subscriber ||
  mongoose.model<DBSubscriber>("Subscriber", subscriberContentSchema);

export { SubscriberModel };

import mongoose, { Document } from "mongoose";

export interface DBSubscriber extends Document {
  email: string;
  unsubscribed: boolean;
  unsubscribedAt?: Date | null;
  consentVersion: string;
  consentText: string;
  consentTextSource: string;
  consentAcceptedAt: Date;
  sourcePath: string;
  unsubscribeToken: string;
}

export type LeanSubscriber = Omit<DBSubscriber, keyof Document> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

const subscriberContentSchema = new mongoose.Schema<DBSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    unsubscribed: { type: Boolean, default: false },
    unsubscribedAt: { type: Date, default: null },
    consentVersion: { type: String, required: true },
    consentText: { type: String, required: true },
    consentTextSource: { type: String, required: true },
    consentAcceptedAt: { type: Date, required: true },
    sourcePath: { type: String, required: true },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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

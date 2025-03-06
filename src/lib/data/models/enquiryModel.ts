import mongoose, { Document } from "mongoose";

export interface DBEnquiry extends Document {
  name: string;
  email: string;
  enquiryType: "print" | "original" | "both";
  message: string;
}

export type LeanEnquiry = Omit<DBEnquiry, keyof Document> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

const enquiryContentSchema = new mongoose.Schema<DBEnquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    enquiryType: {
      type: String,
      required: true,
      enum: ["print", "original", "both"],
    },
    message: { type: String, required: true },
  },
  {
    collection: "enquiries",
    timestamps: true,
  }
);

const EnquiryModel =
  mongoose.models.Enquiry ||
  mongoose.model<DBEnquiry>("Enquiry", enquiryContentSchema);

export { EnquiryModel };

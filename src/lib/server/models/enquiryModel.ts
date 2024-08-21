import mongoose, { Document } from "mongoose";

export interface IEnquiryContent extends Document {
  name: string;
  email: string;
  enquiryType: "print" | "original" | "both";
  message: string;
}

const enquiryContentSchema = new mongoose.Schema<IEnquiryContent>(
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
  mongoose.model<IEnquiryContent>("Enquiry", enquiryContentSchema);

export { EnquiryModel };

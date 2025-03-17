import mongoose, { Document } from "mongoose";

export interface EnquiryBase {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EnquiryDB extends Document, EnquiryBase {
  createdAt: Date;
  updatedAt: Date;
}

const enquiryContentSchema = new mongoose.Schema<EnquiryDB>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    // artwork: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork" },
  },
  {
    collection: "enquiries",
    timestamps: true,
  }
);

const EnquiryModel =
  mongoose.models.Enquiry ||
  mongoose.model<EnquiryDB>("Enquiry", enquiryContentSchema);

export { EnquiryModel };

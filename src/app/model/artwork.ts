import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    //! submitted fields
    title: { type: String, default: "Untitled" },
    decade: {
      type: String,
      enum: [
        "1950s",
        "1960s",
        "1970s",
        "1980s",
        "1990s",
        "2000s",
        "2010s",
        "2020s",
      ],
      required: true,
    },
    image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
      bytes: { type: Number, required: true },
      pixelHeight: { type: Number, required: true },
      pixelWidth: { type: Number, required: true },
      format: { type: String, required: true },
      hexColors: [{ color: String, percentage: Number }],
      predominantColors: {
        cloudinary: [{ color: String, percentage: Number }],
        google: [{ color: String, percentage: Number }],
      },
    },
    artstyle: {
      type: String,
      enum: ["abstract", "semi-abstract", "figurative"],
      required: true,
    },
    medium: {
      type: String,
      enum: [
        "oil",
        "acrylic",
        "paint",
        "watercolour",
        "pastel",
        "pencil",
        "charcoal",
        "ink",
        "sand",
      ],
      required: true,
    },
    surface: {
      type: String,
      enum: ["paper", "canvas", "wood", "film"],
      required: true,
    },
    featured: { type: Boolean, default: false },
    watcherlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

export const ArtworkModel =
  mongoose.models.Artwork || mongoose.model("Artwork", artworkSchema);

// const BaseModel =
// mongoose.models.Content || mongoose.model("Content", baseSchema);

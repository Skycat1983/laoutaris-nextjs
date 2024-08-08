import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URI as string;

console.log("MONGO_URL :>> ", MONGO_URL);

if (!MONGO_URL) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

async function dbConnect() {
  if (mongoose.connection.readyState !== 1) {
    // return;

    try {
      await mongoose.connect(MONGO_URL);
      console.log("connected");
    } catch (error) {
      console.log("error connecting:>> ", error);
      //
    }
  } else {
    console.log("already connected");
  }
}

export default dbConnect;

import mongoose from "mongoose";

// Define what cached mongoose instance looks like
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global namespace
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize cache
let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) global.mongoose = cached;

async function dbConnect() {
  try {
    // Debug logging
    console.log("Environment:", process.env.NODE_ENV);
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    console.log(
      "Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("MONGO"))
    );

    // Check for MONGO_URI here instead of at module level
    if (!process.env.MONGO_URI) {
      throw new Error(
        "Please define the MONGO_URI environment variable inside .env"
      );
    }

    const MONGO_URL = process.env.MONGO_URI;

    if (cached.conn) {
      console.log("Using cached connection");
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: true, // Enable command buffering
        maxPoolSize: 20, // Increase pool size for parallel requests
        serverSelectionTimeoutMS: 5000, // Reduce timeout - fail fast if can't connect
        socketTimeoutMS: 30000, // Reduce socket timeout
        family: 4,
        connectTimeoutMS: 10000, // Reduce connect timeout
      };

      console.log(
        "Attempting MongoDB connection with URL:",
        MONGO_URL.replace(/:[^:/@]+@/, ":****@")
      );
      cached.promise = mongoose.connect(MONGO_URL, opts);
    }

    try {
      cached.conn = await cached.promise;
      console.log("MongoDB connected successfully");
    } catch (e) {
      cached.promise = null;
      console.error("MongoDB connection attempt failed:", e);
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Throw the original error for better debugging
  }
}

export default dbConnect;

// ! OLD CODE. DO NOT DELETE

// import mongoose from "mongoose";

// const MONGO_URL = process.env.MONGO_URI as string;

// if (!MONGO_URL) {
//   throw new Error(
//     "Please define the MONGO_URI environment variable inside .env.local"
//   );
// }

// async function dbConnect() {
//   if (mongoose.connection.readyState !== 1) {
//     // return;

//     try {
//       await mongoose.connect(MONGO_URL);
//       // console.log("connected");
//     } catch (error) {
//       console.log("error connecting:>> ", error);
//       //
//     }
//   } else {
//     // console.log("already connected");
//   }
// }

// export default dbConnect;

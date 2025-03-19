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

if (!process.env.MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env"
  );
}

const MONGO_URL = process.env.MONGO_URI as string;

// Initialize cache
let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) global.mongoose = cached;

async function dbConnect() {
  try {
    // If we have a connection, return it
    if (cached.conn) {
      console.log("Using cached MongoDB connection");
      return cached.conn;
    }

    // If we don't have a promise to connect, create one
    if (!cached.promise) {
      const opts = {
        bufferCommands: false, // Disable buffering for better error handling
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 60000, // Increase from 30s to 60s
        socketTimeoutMS: 60000, // Increase from 45s to 60s
        family: 4,
        connectTimeoutMS: 60000, // Increase from 30s to 60s
      };

      console.log("Creating new MongoDB connection...");
      cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      console.error("MongoDB connection failed:", e);
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
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

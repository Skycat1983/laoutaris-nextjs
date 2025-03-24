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

const dbConnect = async () => {
  console.log("DB Connect called");

  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing connection");
    return;
  }

  // Retry mechanism for mongoose connection
  const MAX_RETRIES = 3;
  let currentAttempt = 0;
  let lastError;

  while (currentAttempt < MAX_RETRIES) {
    try {
      currentAttempt++;
      console.log(
        `MongoDB mongoose connection attempt ${currentAttempt}/${MAX_RETRIES}`
      );

      return await mongoose.connect(process.env.MONGO_URI!, {
        // Connection settings optimized for serverless
        maxPoolSize: 5,
        minPoolSize: 1,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 60000,
        connectTimeoutMS: 30000,
        family: 4,
        retryWrites: true,
        w: "majority",
      });
    } catch (error) {
      console.error(
        `MongoDB mongoose connection attempt ${currentAttempt} failed:`,
        error
      );
      lastError = error;

      // Only retry if we haven't reached max attempts
      if (currentAttempt < MAX_RETRIES) {
        // Exponential backoff: 500ms, 1500ms, 4500ms
        const backoffTime = Math.min(Math.pow(3, currentAttempt) * 500, 10000);
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  // Log masked URI for debugging
  const maskedUri = process.env.MONGO_URI?.replace(
    /(mongodb\+srv:\/\/)([^:]+):([^@]+)@/,
    "$1****:****@"
  );
  console.error("Connection attempts exhausted with URI (masked):", maskedUri);

  // If all retries failed, throw the last error
  throw lastError;
};
//http://localhost:3000/api/auth/callback/github, http://laoutaris-nextjs-git-newest-main-skycat1983s-projects.vercel.app/api/auth/callback/github, https://laoutaris-nextjs.vercel.app/api/auth/callback/github
export default dbConnect;

// ! OLD CODE. DO NOT DELETE

// async function dbConnect() {
//   try {
//     // Debug logging
//     console.log("Environment:", process.env.NODE_ENV);
//     console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
//     console.log(
//       "Available env vars:",
//       Object.keys(process.env).filter((key) => key.includes("MONGO"))
//     );

//     // Check for MONGO_URI here instead of at module level
//     if (!process.env.MONGO_URI) {
//       throw new Error(
//         "Please define the MONGO_URI environment variable inside .env"
//       );
//     }

//     const MONGO_URL = process.env.MONGO_URI;

//     if (cached.conn) {
//       console.log("Using cached connection");
//       return cached.conn;
//     }

//     if (!cached.promise) {
//       const opts = {
//         bufferCommands: true, // Enable command buffering
//         maxPoolSize: 20, // Increase pool size for parallel requests
//         serverSelectionTimeoutMS: 5000, // Reduce timeout - fail fast if can't connect
//         socketTimeoutMS: 30000, // Reduce socket timeout
//         family: 4,
//         connectTimeoutMS: 10000, // Reduce connect timeout
//       };

//       console.log(
//         "Attempting MongoDB connection with URL:",
//         MONGO_URL.replace(/:[^:/@]+@/, ":****@")
//       );
//       cached.promise = mongoose.connect(MONGO_URL, opts);
//     }

//     try {
//       cached.conn = await cached.promise;
//       console.log("MongoDB connected successfully");
//     } catch (e) {
//       cached.promise = null;
//       console.error("MongoDB connection attempt failed:", e);
//       throw e;
//     }

//     return cached.conn;
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw error; // Throw the original error for better debugging
//   }
// }

// export default dbConnect;

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

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
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // Retry mechanism for mongoose connection
  const MAX_RETRIES = 3;
  let currentAttempt = 0;
  let lastError;

  while (currentAttempt < MAX_RETRIES) {
    try {
      currentAttempt++;

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
      lastError = error;

      // Only retry if we haven't reached max attempts
      if (currentAttempt < MAX_RETRIES) {
        // Exponential backoff: 500ms, 1500ms, 4500ms
        const backoffTime = Math.min(Math.pow(3, currentAttempt) * 500, 10000);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  // If all retries failed, throw the last error
  throw lastError;
};
export default dbConnect;

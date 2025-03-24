import { MongoClient, ServerApiVersion } from "mongodb";
// import dbConnect from "./mongodb";

console.log("Raw MongoDB Driver - Environment:", process.env.NODE_ENV);
console.log("Raw MongoDB Driver - MONGO_URI exists:", !!process.env.MONGO_URI);

const uri = process.env.MONGO_URI as string;

if (!uri) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env"
  );
}

//  specifically for Auth.js/NextAuth, using the raw MongoDB driver
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add timeout settings optimized for serverless
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 60000, // Increase from default 30s to 60s
};

let client;
let clientPromise: Promise<MongoClient>;

// Wrap connection in a retry function
const connectWithRetry = async (client: MongoClient): Promise<MongoClient> => {
  console.log("Attempting MongoDB connection with retry logic");

  // Maximum retry attempts
  const MAX_RETRIES = 3;
  let currentAttempt = 0;
  let lastError;

  while (currentAttempt < MAX_RETRIES) {
    try {
      currentAttempt++;
      console.log(
        `MongoDB connection attempt ${currentAttempt}/${MAX_RETRIES}`
      );
      return await client.connect();
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${currentAttempt} failed:`,
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

  // If all retries failed, throw the last error
  throw lastError;
};

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    console.log("Development: Creating new MongoDB client connection");
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = connectWithRetry(client);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.log("Production: Creating new MongoDB client connection");
  client = new MongoClient(uri, options);
  clientPromise = connectWithRetry(client);
}

export { clientPromise };

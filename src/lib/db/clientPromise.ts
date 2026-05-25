import { MongoClient, ServerApiVersion } from "mongodb";

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
} as const;

let clientPromise: Promise<MongoClient> | undefined;

// Wrap connection in a retry function
const connectWithRetry = async (client: MongoClient): Promise<MongoClient> => {
  // Maximum retry attempts
  const MAX_RETRIES = 3;
  let currentAttempt = 0;
  let lastError;

  while (currentAttempt < MAX_RETRIES) {
    try {
      currentAttempt++;
      return await client.connect();
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

const createClientPromise = () => {
  const uri = process.env.MONGO_URI as string | undefined;

  if (!uri) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env"
    );
  }

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = connectWithRetry(client);
    }

    return globalWithMongo._mongoClientPromise;
  }

  const client = new MongoClient(uri, options);
  return connectWithRetry(client);
};

const getClientPromise = () => {
  if (!clientPromise) {
    clientPromise = createClientPromise();
  }

  return clientPromise;
};

const lazyClientPromise = {
  then: (...args: Parameters<Promise<MongoClient>["then"]>) =>
    getClientPromise().then(...args),
  catch: (...args: Parameters<Promise<MongoClient>["catch"]>) =>
    getClientPromise().catch(...args),
  finally: (...args: Parameters<Promise<MongoClient>["finally"]>) =>
    getClientPromise().finally(...args),
  [Symbol.toStringTag]: "Promise",
} as Promise<MongoClient>;

export { lazyClientPromise as clientPromise };

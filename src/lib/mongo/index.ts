import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI as string;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;
// let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client as MongoClient;

//! old version before mongodb adapter added
// const URI = process.env.MONGO_URI;
// const options = {};

// if (!URI) {
//   throw new Error(
//     "Please define the MONGO_URI environment variable inside .env.local"
//   );
// }

// let client = new MongoClient(URI, options);
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV !== "production") {
//   if (!global.mongoClientPromise) {
//     global.mongoClientPromise = client.connect();
//   }

//   clientPromise = global._mongoClientPromise;
// } else {
//   clientPromise = client.connect();
// }

// export default clientPromise;

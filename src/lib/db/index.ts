import { MongoClient, ServerApiVersion } from "mongodb";

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
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    console.log("Development: Creating new MongoDB client connection");
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.log("Production: Creating new MongoDB client connection");
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

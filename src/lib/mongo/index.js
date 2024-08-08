import { MongoClient } from "mongodb";

const URI = process.env.MONGO_URI;
const options = {};

if (!URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let client = new MongoClient(URI, options);
let clientPromise;

if (process.env.NODE_ENV !== "production") {
  if (!global.mongoClientPromise) {
    global.mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;

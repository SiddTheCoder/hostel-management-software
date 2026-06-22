import mongoose from "mongoose";

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: CachedConnection;
};

const cached = globalForMongoose.mongooseConnection ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseConnection = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required to connect to MongoDB.");
  }

  cached.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
  });

  cached.conn = await cached.promise;
  return cached.conn;
}

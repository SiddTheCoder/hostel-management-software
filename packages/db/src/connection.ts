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

/**
 * Cached Mongoose connection (one per process). Environment loading is the
 * caller's responsibility — apps/web loads the repo-root .env via @next/env,
 * standalone scripts load it themselves before importing this module.
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI ?? process.env.DATABASE_URL;

  if (!uri) {
    throw new Error("MONGODB_URI (or DATABASE_URL) is required to connect to MongoDB.");
  }

  cached.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
  });

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function disconnectFromDatabase() {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

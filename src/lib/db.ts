import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const isProd = process.env.NODE_ENV === "production";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (process.env.NODE_ENV !== "production") {
  global.mongooseCache = cache;
}

export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

export function requireDbInProduction(): void {
  if (isProd && !MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in production");
  }
}

export async function connectDB(): Promise<typeof mongoose> {
  requireDbInProduction();
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

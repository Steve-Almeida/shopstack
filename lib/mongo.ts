import mongoose from "mongoose";

// Cache the connection across hot reloads / serverless invocations
const cached = (globalThis as unknown as { _mongoose?: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> } });
cached._mongoose ??= {};

export async function connectMongo() {
  const store = cached._mongoose!;
  if (store.conn) return store.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  store.promise ??= mongoose.connect(uri);
  store.conn = await store.promise;
  return store.conn;
}

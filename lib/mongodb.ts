import { MongoClient, type Db, type MongoClientOptions } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cinema"

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
  } as MongoClientOptions)

  await client.connect()
  cachedClient = client
  cachedDb = client.db("cinema")

  return { client: cachedClient, db: cachedDb }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}

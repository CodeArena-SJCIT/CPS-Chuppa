import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || ""
const MONGODB_DB = process.env.MONGODB_DB || ""

// Check if we have a cached connection
let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // Validate environment variables
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }
  if (!MONGODB_DB) {
    throw new Error("Please define the MONGODB_DB environment variable")
  }

  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    // If no cached connection, create a new one
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(MONGODB_DB)

    // Test the connection
    await db.command({ ping: 1 })
    console.log("MongoDB connection established successfully")

    // Cache the connection
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error(`Unable to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`)
  }
}

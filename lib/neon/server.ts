import "server-only"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let cachedDb: NeonQueryFunction | null = null

function getDb(): NeonQueryFunction {
  if (cachedDb) return cachedDb

  if (!process.env.NEON_DATABASE_URL) {
    throw new Error("NEON_DATABASE_URL environment variable is not set")
  }

  cachedDb = neon(process.env.NEON_DATABASE_URL)
  return cachedDb
}

export async function executeQuery(sql: string, params?: any[]): Promise<any[]> {
  const db = getDb()
  try {
    return await db(sql, params)
  } catch (error) {
    console.error("[Neon] Query execution failed:", error)
    throw error
  }
}

export function getConnection() {
  return getDb()
}

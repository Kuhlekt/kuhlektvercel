import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let neonClient: NeonQueryFunction | null = null

try {
  if (process.env.NEON_DATABASE_URL) {
    neonClient = neon(process.env.NEON_DATABASE_URL)
  } else {
    console.warn("Neon database URL not configured")
  }
} catch (error) {
  console.error("Failed to initialize Neon client:", error)
}

export function getDb() {
  if (!neonClient) {
    throw new Error("Neon database client is not configured")
  }
  return neonClient
}

export const isNeonConfigured = !!neonClient

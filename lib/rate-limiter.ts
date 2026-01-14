"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

interface RateLimitConfig {
  maxAttempts: number
  windowMinutes: number
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  "admin-login": { maxAttempts: 3, windowMinutes: 15 },
  "verification-code": { maxAttempts: 5, windowMinutes: 15 },
  "contact-form": { maxAttempts: 3, windowMinutes: 60 },
}

export async function checkRateLimit(
  endpoint: string,
  identifier: string,
): Promise<{ allowed: boolean; remainingAttempts?: number; resetAt?: Date }> {
  const config = RATE_LIMIT_CONFIGS[endpoint]

  if (!config) {
    console.error(`No rate limit config for endpoint: ${endpoint}`)
    return { allowed: true }
  }

  const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000)

  try {
    const existingRecords = await sql(
      `SELECT * FROM rate_limits 
       WHERE endpoint = $1 AND identifier = $2 AND window_start >= $3`,
      [endpoint, identifier, windowStart.toISOString()],
    )

    const currentCount = existingRecords?.length || 0

    if (currentCount >= config.maxAttempts) {
      const oldestRecord = existingRecords?.[0]
      const resetAt = oldestRecord
        ? new Date(new Date(oldestRecord.window_start).getTime() + config.windowMinutes * 60 * 1000)
        : new Date(Date.now() + config.windowMinutes * 60 * 1000)

      return {
        allowed: false,
        remainingAttempts: 0,
        resetAt,
      }
    }

    await sql(
      `INSERT INTO rate_limits (endpoint, identifier, window_start, request_count)
       VALUES ($1, $2, $3, $4)`,
      [endpoint, identifier, new Date().toISOString(), 1],
    )

    await sql(
      `DELETE FROM rate_limits 
       WHERE endpoint = $1 AND identifier = $2 AND window_start < $3`,
      [endpoint, identifier, windowStart.toISOString()],
    )

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - currentCount - 1,
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // Fail open on unexpected errors
    return { allowed: true }
  }
}

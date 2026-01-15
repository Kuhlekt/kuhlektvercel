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
  const now = new Date()

  try {
    const existingRecords = await sql<{ id: bigint; window_start: string; request_count: number }[]>`
      SELECT id, window_start, request_count FROM rate_limits 
      WHERE endpoint = ${endpoint} 
      AND identifier = ${identifier} 
      AND window_start >= ${windowStart.toISOString()}
    `

    const currentCount = existingRecords?.length || 0

    if (currentCount >= config.maxAttempts) {
      const oldestRecord = existingRecords?.[0]
      const resetAt = oldestRecord
        ? new Date(new Date(oldestRecord.window_start).getTime() + config.windowMinutes * 60 * 1000)
        : new Date(now.getTime() + config.windowMinutes * 60 * 1000)

      return {
        allowed: false,
        remainingAttempts: 0,
        resetAt,
      }
    }

    await sql`
      INSERT INTO rate_limits (endpoint, identifier, window_start, request_count, created_at)
      VALUES (${endpoint}, ${identifier}, ${now.toISOString()}, 1, ${now.toISOString()})
    `

    await sql`
      DELETE FROM rate_limits 
      WHERE endpoint = ${endpoint} 
      AND identifier = ${identifier} 
      AND window_start < ${windowStart.toISOString()}
    `

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - currentCount - 1,
    }
  } catch (error) {
    console.error("[v0] Rate limit error:", error)
    console.warn("[v0] Rate limiting disabled due to error - allowing request")
    return { allowed: true }
  }
}

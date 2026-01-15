"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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
    // Get current count within window
    const { data: existingRecords, error: fetchError } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("endpoint", endpoint)
      .eq("identifier", identifier)
      .gte("window_start", windowStart.toISOString())

    if (fetchError) {
      console.error("Rate limit fetch error:", fetchError)
      // Fail open on database errors to avoid blocking legitimate users
      return { allowed: true }
    }

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

    // Record this attempt
    const { error: insertError } = await supabase.from("rate_limits").insert({
      endpoint,
      identifier,
      window_start: new Date().toISOString(),
      request_count: 1,
    })

    if (insertError) {
      console.error("Rate limit insert error:", insertError)
    }

    // Clean up old records
    await supabase
      .from("rate_limits")
      .delete()
      .eq("endpoint", endpoint)
      .eq("identifier", identifier)
      .lt("window_start", windowStart.toISOString())

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

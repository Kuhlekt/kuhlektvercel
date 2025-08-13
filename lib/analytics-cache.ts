interface CachedAnalytics {
  data: any
  timestamp: number
  ttl: number
}

const analyticsCache = new Map<string, CachedAnalytics>()

export function getCachedAnalytics(key: string): any | null {
  const cached = analyticsCache.get(key)
  if (!cached) return null

  const now = Date.now()
  if (now > cached.timestamp + cached.ttl) {
    analyticsCache.delete(key)
    return null
  }

  return cached.data
}

export function setCachedAnalytics(key: string, data: any, ttlMinutes = 5): void {
  analyticsCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000,
  })
}

export function clearAnalyticsCache(): void {
  analyticsCache.clear()
}

// Clean up expired cache entries periodically
setInterval(
  () => {
    const now = Date.now()
    for (const [key, cached] of analyticsCache.entries()) {
      if (now > cached.timestamp + cached.ttl) {
        analyticsCache.delete(key)
      }
    }
  },
  5 * 60 * 1000,
) // Clean every 5 minutes

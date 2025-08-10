"use server"

import { headers } from "next/headers"

export interface VisitorData {
  id: string
  timestamp: string
  ip: string
  userAgent: string
  country?: string
  city?: string
  referrer?: string
  page: string
  sessionId: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
}

export interface PageView {
  page: string
  timestamp: string
  sessionId: string
  timeOnPage?: number
}

// In-memory storage for demo purposes (in production, use a database)
const visitors: VisitorData[] = []
const pageViews: PageView[] = []
const sessions = new Map<string, { startTime: string; lastActivity: string; pages: string[] }>()

export async function trackVisitor(page: string, sessionId?: string): Promise<VisitorData> {
  const headersList = headers()
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
  const userAgent = headersList.get("user-agent") || "unknown"
  const referrer = headersList.get("referer") || undefined

  // Generate session ID if not provided
  const currentSessionId = sessionId || generateSessionId()

  // Parse user agent for device info
  const deviceInfo = parseUserAgent(userAgent)

  // Get geolocation (simplified - in production use a proper service)
  const geoData = await getGeolocation(ip)

  const visitorData: VisitorData = {
    id: generateVisitorId(),
    timestamp: new Date().toISOString(),
    ip: ip.split(",")[0].trim(), // Take first IP if multiple
    userAgent,
    country: geoData.country,
    city: geoData.city,
    referrer,
    page,
    sessionId: currentSessionId,
    deviceType: deviceInfo.deviceType,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
  }

  // Store visitor data
  visitors.push(visitorData)

  // Track page view
  const pageView: PageView = {
    page,
    timestamp: new Date().toISOString(),
    sessionId: currentSessionId,
  }
  pageViews.push(pageView)

  // Update session data
  const now = new Date().toISOString()
  if (sessions.has(currentSessionId)) {
    const session = sessions.get(currentSessionId)!
    session.lastActivity = now
    if (!session.pages.includes(page)) {
      session.pages.push(page)
    }
  } else {
    sessions.set(currentSessionId, {
      startTime: now,
      lastActivity: now,
      pages: [page],
    })
  }

  console.log("Visitor tracked:", {
    page,
    sessionId: currentSessionId,
    ip: visitorData.ip,
    country: visitorData.country,
    deviceType: visitorData.deviceType,
    browser: visitorData.browser,
  })

  return visitorData
}

export async function getVisitorStats() {
  const now = new Date()
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Filter recent visitors
  const recent24h = visitors.filter((v) => new Date(v.timestamp) > last24Hours)
  const recent7d = visitors.filter((v) => new Date(v.timestamp) > last7Days)

  // Calculate unique visitors (by IP)
  const uniqueIPs24h = new Set(recent24h.map((v) => v.ip)).size
  const uniqueIPs7d = new Set(recent7d.map((v) => v.ip)).size

  // Calculate page views
  const pageViews24h = pageViews.filter((pv) => new Date(pv.timestamp) > last24Hours)
  const pageViews7d = pageViews.filter((pv) => new Date(pv.timestamp) > last7Days)

  // Top pages
  const pageViewCounts = pageViews7d.reduce(
    (acc, pv) => {
      acc[pv.page] = (acc[pv.page] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topPages = Object.entries(pageViewCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }))

  // Device breakdown
  const deviceCounts = recent7d.reduce(
    (acc, v) => {
      acc[v.deviceType] = (acc[v.deviceType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Browser breakdown
  const browserCounts = recent7d.reduce(
    (acc, v) => {
      acc[v.browser] = (acc[v.browser] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Country breakdown
  const countryCounts = recent7d.reduce(
    (acc, v) => {
      if (v.country) {
        acc[v.country] = (acc[v.country] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Referrer breakdown
  const referrerCounts = recent7d.reduce(
    (acc, v) => {
      if (v.referrer) {
        const domain = extractDomain(v.referrer)
        acc[domain] = (acc[domain] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalVisitors: visitors.length,
    uniqueVisitors24h: uniqueIPs24h,
    uniqueVisitors7d: uniqueIPs7d,
    pageViews24h: pageViews24h.length,
    pageViews7d: pageViews7d.length,
    totalPageViews: pageViews.length,
    activeSessions: sessions.size,
    topPages,
    deviceBreakdown: deviceCounts,
    browserBreakdown: browserCounts,
    countryBreakdown: countryCounts,
    referrerBreakdown: referrerCounts,
    recentVisitors: recent24h.slice(-10).reverse(), // Last 10 visitors
  }
}

export async function getRealtimeVisitors() {
  const now = new Date()
  const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000)

  // Get active sessions (activity in last 5 minutes)
  const activeSessions = Array.from(sessions.entries())
    .filter(([_, session]) => new Date(session.lastActivity) > last5Minutes)
    .map(([sessionId, session]) => ({
      sessionId,
      startTime: session.startTime,
      lastActivity: session.lastActivity,
      pagesVisited: session.pages.length,
      currentPage: session.pages[session.pages.length - 1],
    }))

  // Get recent page views
  const recentPageViews = pageViews
    .filter((pv) => new Date(pv.timestamp) > last5Minutes)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return {
    activeVisitors: activeSessions.length,
    activeSessions,
    recentPageViews: recentPageViews.slice(0, 20),
  }
}

// Helper functions
function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()

  // Device type detection
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop"
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    deviceType = "mobile"
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = "tablet"
  }

  // Browser detection
  let browser = "Unknown"
  if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome"
  else if (ua.includes("firefox")) browser = "Firefox"
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari"
  else if (ua.includes("edg")) browser = "Edge"
  else if (ua.includes("opera")) browser = "Opera"

  // OS detection
  let os = "Unknown"
  if (ua.includes("windows")) os = "Windows"
  else if (ua.includes("mac")) os = "macOS"
  else if (ua.includes("linux")) os = "Linux"
  else if (ua.includes("android")) os = "Android"
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) os = "iOS"

  return { deviceType, browser, os }
}

async function getGeolocation(ip: string) {
  // Simplified geolocation - in production, use a service like MaxMind or ipapi
  if (ip === "unknown" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip === "127.0.0.1") {
    return { country: "Unknown", city: "Unknown" }
  }

  try {
    // This is a mock implementation - replace with actual geolocation service
    const mockLocations = [
      { country: "United States", city: "New York" },
      { country: "United Kingdom", city: "London" },
      { country: "Australia", city: "Sydney" },
      { country: "Canada", city: "Toronto" },
      { country: "Germany", city: "Berlin" },
    ]

    // Use IP hash to consistently return same location for same IP
    const hash = ip.split(".").reduce((acc, part) => acc + Number.parseInt(part), 0)
    return mockLocations[hash % mockLocations.length]
  } catch (error) {
    console.error("Geolocation error:", error)
    return { country: "Unknown", city: "Unknown" }
  }
}

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace("www.", "")
  } catch {
    return "Direct"
  }
}

// Clean up old data (call this periodically)
export async function cleanupOldData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Remove old visitors
  const oldVisitorCount = visitors.length
  for (let i = visitors.length - 1; i >= 0; i--) {
    if (new Date(visitors[i].timestamp) < thirtyDaysAgo) {
      visitors.splice(i, 1)
    }
  }

  // Remove old page views
  const oldPageViewCount = pageViews.length
  for (let i = pageViews.length - 1; i >= 0; i--) {
    if (new Date(pageViews[i].timestamp) < thirtyDaysAgo) {
      pageViews.splice(i, 1)
    }
  }

  // Remove inactive sessions (no activity in last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  for (const [sessionId, session] of sessions.entries()) {
    if (new Date(session.lastActivity) < oneHourAgo) {
      sessions.delete(sessionId)
    }
  }

  console.log(
    `Cleanup completed: Removed ${oldVisitorCount - visitors.length} old visitors, ${oldPageViewCount - pageViews.length} old page views`,
  )
}

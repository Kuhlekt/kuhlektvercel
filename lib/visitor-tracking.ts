export interface VisitorData {
  id: string
  ipAddress: string
  userAgent: string
  referrer: string
  currentPage: string
  timestamp: Date
  sessionId: string
  country?: string
  city?: string
  device?: string
  browser?: string
  os?: string
}

export interface PageView {
  id: string
  visitorId: string
  page: string
  timestamp: Date
  timeSpent?: number
}

// Use Map for better performance and memory management
const visitors = new Map<string, VisitorData>()
const pageViews = new Map<string, PageView>()

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function generateVisitorId(): string {
  return "visitor_" + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function trackVisitor(data: Omit<VisitorData, "id" | "timestamp">): VisitorData {
  const visitor: VisitorData = {
    ...data,
    id: generateVisitorId(),
    timestamp: new Date(),
  }

  visitors.set(visitor.id, visitor)

  // Keep only last 1000 visitors to prevent memory issues
  if (visitors.size > 1000) {
    const firstKey = visitors.keys().next().value
    visitors.delete(firstKey)
  }

  return visitor
}

export function trackPageView(visitorId: string, page: string): PageView {
  const pageView: PageView = {
    id: "pageview_" + Math.random().toString(36).substring(2),
    visitorId,
    page,
    timestamp: new Date(),
  }

  pageViews.set(pageView.id, pageView)

  // Keep only last 1000 page views to prevent memory issues
  if (pageViews.size > 1000) {
    const firstKey = pageViews.keys().next().value
    pageViews.delete(firstKey)
  }

  return pageView
}

export function getVisitors(): VisitorData[] {
  return Array.from(visitors.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getPageViews(): PageView[] {
  return Array.from(pageViews.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getVisitorStats() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const allVisitors = Array.from(visitors.values())
  const allPageViews = Array.from(pageViews.values())

  const todayVisitors = allVisitors.filter((v) => v.timestamp >= today).length
  const weekVisitors = allVisitors.filter((v) => v.timestamp >= thisWeek).length
  const monthVisitors = allVisitors.filter((v) => v.timestamp >= thisMonth).length
  const totalVisitors = allVisitors.length

  const todayPageViews = allPageViews.filter((pv) => pv.timestamp >= today).length
  const weekPageViews = allPageViews.filter((pv) => pv.timestamp >= thisWeek).length
  const monthPageViews = allPageViews.filter((pv) => pv.timestamp >= thisMonth).length
  const totalPageViews = allPageViews.length

  return {
    visitors: {
      today: todayVisitors,
      week: weekVisitors,
      month: monthVisitors,
      total: totalVisitors,
    },
    pageViews: {
      today: todayPageViews,
      week: weekPageViews,
      month: monthPageViews,
      total: totalPageViews,
    },
  }
}

export function parseUserAgent(userAgent: string) {
  // Simple user agent parsing
  const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? "Mobile" : "Desktop"

  let browser = "Unknown"
  if (userAgent.includes("Chrome")) browser = "Chrome"
  else if (userAgent.includes("Firefox")) browser = "Firefox"
  else if (userAgent.includes("Safari")) browser = "Safari"
  else if (userAgent.includes("Edge")) browser = "Edge"

  let os = "Unknown"
  if (userAgent.includes("Windows")) os = "Windows"
  else if (userAgent.includes("Mac")) os = "macOS"
  else if (userAgent.includes("Linux")) os = "Linux"
  else if (userAgent.includes("Android")) os = "Android"
  else if (userAgent.includes("iOS")) os = "iOS"

  return { device, browser, os }
}

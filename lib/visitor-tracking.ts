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

// In-memory storage (in production, use a database)
const visitors: VisitorData[] = []
const pageViews: PageView[] = []

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

  visitors.push(visitor)
  return visitor
}

export function trackPageView(visitorId: string, page: string): PageView {
  const pageView: PageView = {
    id: "pageview_" + Math.random().toString(36).substring(2),
    visitorId,
    page,
    timestamp: new Date(),
  }

  pageViews.push(pageView)
  return pageView
}

export function getVisitors(): VisitorData[] {
  return visitors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getPageViews(): PageView[] {
  return pageViews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getVisitorStats() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const todayVisitors = visitors.filter((v) => v.timestamp >= today).length
  const weekVisitors = visitors.filter((v) => v.timestamp >= thisWeek).length
  const monthVisitors = visitors.filter((v) => v.timestamp >= thisMonth).length
  const totalVisitors = visitors.length

  const todayPageViews = pageViews.filter((pv) => pv.timestamp >= today).length
  const weekPageViews = pageViews.filter((pv) => pv.timestamp >= thisWeek).length
  const monthPageViews = pageViews.filter((pv) => pv.timestamp >= thisMonth).length
  const totalPageViews = pageViews.length

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

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
  affiliate?: string
  affiliateSource?: "demo" | "contact"
  affiliateTimestamp?: Date
}

export interface PageView {
  id: string
  visitorId: string
  page: string
  timestamp: Date
  timeSpent?: number
}

export interface FormSubmission {
  id: string
  visitorId: string
  sessionId: string
  formType: "demo" | "contact"
  timestamp: Date
  data: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    role?: string
    companySize?: string
    message?: string
    challenges?: string
    affiliate?: string
  }
  ipAddress?: string
  userAgent?: string
}

// Use Map for better performance and memory management
const visitors = new Map<string, VisitorData>()
const pageViews = new Map<string, PageView>()
const formSubmissions = new Map<string, FormSubmission>()

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

export function updateVisitorAffiliate(sessionId: string, affiliate: string, source: "demo" | "contact"): void {
  // Find visitor by session ID
  for (const [id, visitor] of visitors.entries()) {
    if (visitor.sessionId === sessionId) {
      visitor.affiliate = affiliate
      visitor.affiliateSource = source
      visitor.affiliateTimestamp = new Date()
      visitors.set(id, visitor)
      break
    }
  }
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

export function trackFormSubmission(data: Omit<FormSubmission, "id" | "timestamp">): FormSubmission {
  const submission: FormSubmission = {
    ...data,
    id: "form_" + Math.random().toString(36).substring(2),
    timestamp: new Date(),
  }

  formSubmissions.set(submission.id, submission)

  // Keep only last 1000 form submissions to prevent memory issues
  if (formSubmissions.size > 1000) {
    const firstKey = formSubmissions.keys().next().value
    formSubmissions.delete(firstKey)
  }

  return submission
}

export function getVisitors(): VisitorData[] {
  return Array.from(visitors.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getPageViews(): PageView[] {
  return Array.from(pageViews.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getFormSubmissions(): FormSubmission[] {
  return Array.from(formSubmissions.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getVisitorStats() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const allVisitors = Array.from(visitors.values())
  const allPageViews = Array.from(pageViews.values())
  const allFormSubmissions = Array.from(formSubmissions.values())

  const todayVisitors = allVisitors.filter((v) => v.timestamp >= today).length
  const weekVisitors = allVisitors.filter((v) => v.timestamp >= thisWeek).length
  const monthVisitors = allVisitors.filter((v) => v.timestamp >= thisMonth).length
  const totalVisitors = allVisitors.length

  const todayPageViews = allPageViews.filter((pv) => pv.timestamp >= today).length
  const weekPageViews = allPageViews.filter((pv) => pv.timestamp >= thisWeek).length
  const monthPageViews = allPageViews.filter((pv) => pv.timestamp >= thisMonth).length
  const totalPageViews = allPageViews.length

  const todayForms = allFormSubmissions.filter((fs) => fs.timestamp >= today).length
  const weekForms = allFormSubmissions.filter((fs) => fs.timestamp >= thisWeek).length
  const monthForms = allFormSubmissions.filter((fs) => fs.timestamp >= thisMonth).length
  const totalForms = allFormSubmissions.length

  // Affiliate stats
  const affiliateVisitors = allVisitors.filter((v) => v.affiliate && v.affiliate.trim() !== "")
  const affiliateStats = affiliateVisitors.reduce(
    (acc, visitor) => {
      const affiliate = visitor.affiliate!
      if (!acc[affiliate]) {
        acc[affiliate] = { count: 0, demo: 0, contact: 0 }
      }
      acc[affiliate].count++
      if (visitor.affiliateSource === "demo") acc[affiliate].demo++
      if (visitor.affiliateSource === "contact") acc[affiliate].contact++
      return acc
    },
    {} as Record<string, { count: number; demo: number; contact: number }>,
  )

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
    forms: {
      today: todayForms,
      week: weekForms,
      month: monthForms,
      total: totalForms,
    },
    affiliates: {
      total: affiliateVisitors.length,
      breakdown: affiliateStats,
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

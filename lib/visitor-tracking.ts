interface Visitor {
  id: string
  ip: string
  userAgent: string
  firstVisit: Date
  lastVisit: Date
  pageViews: number
  pages: string[]
  referrer?: string
  formSubmissions: FormSubmission[]
  affiliate?: string
}

interface FormSubmission {
  id: string
  type: "contact" | "demo"
  timestamp: Date
  data: Record<string, any>
  status: "pending" | "completed" | "failed"
  affiliate?: string
}

interface VisitorData {
  ip: string
  userAgent: string
  page: string
  referrer?: string
  timestamp: Date
  affiliate?: string
}

// In-memory storage for demo purposes
// In production, this would be replaced with a database
const visitors: Visitor[] = []

export async function trackVisitor(data: VisitorData): Promise<void> {
  const existingVisitor = visitors.find((v) => v.ip === data.ip && v.userAgent === data.userAgent)

  if (existingVisitor) {
    // Update existing visitor
    existingVisitor.lastVisit = data.timestamp
    existingVisitor.pageViews += 1
    if (!existingVisitor.pages.includes(data.page)) {
      existingVisitor.pages.push(data.page)
    }
    // Update affiliate if provided
    if (data.affiliate && !existingVisitor.affiliate) {
      existingVisitor.affiliate = data.affiliate
    }
  } else {
    // Create new visitor
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      ip: data.ip,
      userAgent: data.userAgent,
      firstVisit: data.timestamp,
      lastVisit: data.timestamp,
      pageViews: 1,
      pages: [data.page],
      referrer: data.referrer,
      formSubmissions: [],
      affiliate: data.affiliate,
    }
    visitors.push(newVisitor)
  }
}

export async function trackFormSubmission(
  ip: string,
  userAgent: string,
  type: "contact" | "demo",
  data: Record<string, any>,
): Promise<string> {
  const visitor = visitors.find((v) => v.ip === ip && v.userAgent === userAgent)

  const submissionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  const submission: FormSubmission = {
    id: submissionId,
    type,
    timestamp: new Date(),
    data,
    status: "pending",
    affiliate: data.affiliate,
  }

  if (visitor) {
    visitor.formSubmissions.push(submission)
    // Update visitor affiliate if provided in form
    if (data.affiliate && !visitor.affiliate) {
      visitor.affiliate = data.affiliate
    }
  } else {
    // Create new visitor if not found
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      ip,
      userAgent,
      firstVisit: new Date(),
      lastVisit: new Date(),
      pageViews: 1,
      pages: [type === "contact" ? "/contact" : "/demo"],
      formSubmissions: [submission],
      affiliate: data.affiliate,
    }
    visitors.push(newVisitor)
  }

  return submissionId
}

export async function updateFormSubmissionStatus(submissionId: string, status: "completed" | "failed"): Promise<void> {
  for (const visitor of visitors) {
    const submission = visitor.formSubmissions.find((s) => s.id === submissionId)
    if (submission) {
      submission.status = status
      break
    }
  }
}

export function getAllVisitors(): Visitor[] {
  return visitors.sort((a, b) => b.lastVisit.getTime() - a.lastVisit.getTime())
}

export function getVisitorStats() {
  const totalVisitors = visitors.length
  const totalPageViews = visitors.reduce((sum, v) => sum + v.pageViews, 0)
  const totalFormSubmissions = visitors.reduce((sum, v) => sum + v.formSubmissions.length, 0)
  const totalDemoForms = visitors.reduce((sum, v) => sum + v.formSubmissions.filter((s) => s.type === "demo").length, 0)
  const totalContactForms = visitors.reduce(
    (sum, v) => sum + v.formSubmissions.filter((s) => s.type === "contact").length,
    0,
  )

  // Calculate unique visitors in last 24 hours
  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
  const recentVisitors = visitors.filter((v) => v.lastVisit >= twentyFourHoursAgo).length

  // Calculate affiliate stats
  const visitorsWithAffiliates = visitors.filter((v) => v.affiliate).length
  const affiliateFormSubmissions = visitors.reduce(
    (sum, v) => sum + v.formSubmissions.filter((s) => s.affiliate).length,
    0,
  )

  return {
    totalVisitors,
    recentVisitors,
    totalPageViews,
    totalFormSubmissions,
    totalDemoForms,
    totalContactForms,
    visitorsWithAffiliates,
    affiliateFormSubmissions,
  }
}

export function getFormSubmissions(): FormSubmission[] {
  const allSubmissions: FormSubmission[] = []
  for (const visitor of visitors) {
    for (const submission of visitor.formSubmissions) {
      allSubmissions.push({
        ...submission,
        data: {
          ...submission.data,
          visitorId: visitor.id,
          ip: visitor.ip,
        },
      })
    }
  }
  return allSubmissions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export interface Visitor {
  visitorId: string
  firstVisit: string
  lastVisit: string
  pageViews: number
  referrer: string
  userAgent: string
  timestamp: string
}

export interface PageView {
  id: string
  visitorId: string
  path: string
  timestamp: string
  referrer: string
}

export interface FormSubmission {
  id: string
  visitorId: string
  formType: "contact" | "demo"
  data: Record<string, any>
  timestamp: string
}

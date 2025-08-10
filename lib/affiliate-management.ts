interface Affiliate {
  id: string
  name: string
  email: string
  code: string
  commissionRate: number
  totalEarnings: number
  status: "active" | "inactive" | "pending"
  createdAt: Date
  lastActivity?: Date
  totalVisitors: number
  totalDemoForms: number
  totalContactForms: number
  conversionRate: number
}

interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  totalCommissions: number
  monthlyCommissions: number
  totalVisitors: number
  totalConversions: number
}

// In-memory storage for demo purposes
// In production, this would be replaced with a database
const affiliates: Affiliate[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    code: "JOHN2024",
    commissionRate: 0.15,
    totalEarnings: 2450.0,
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastActivity: new Date("2024-12-01"),
    totalVisitors: 45,
    totalDemoForms: 12,
    totalContactForms: 8,
    conversionRate: 0.44,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@marketing.com",
    code: "SARAH15",
    commissionRate: 0.12,
    totalEarnings: 1890.5,
    status: "active",
    createdAt: new Date("2024-02-20"),
    lastActivity: new Date("2024-11-28"),
    totalVisitors: 32,
    totalDemoForms: 9,
    totalContactForms: 5,
    conversionRate: 0.44,
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@consulting.co",
    code: "MIKE10",
    commissionRate: 0.1,
    totalEarnings: 750.25,
    status: "active",
    createdAt: new Date("2024-11-15"),
    totalVisitors: 18,
    totalDemoForms: 4,
    totalContactForms: 2,
    conversionRate: 0.33,
  },
  {
    id: "4",
    name: "Test Affiliate",
    email: "test@test.com",
    code: "TEST123",
    commissionRate: 0.1,
    totalEarnings: 0,
    status: "active",
    createdAt: new Date("2024-12-01"),
    totalVisitors: 0,
    totalDemoForms: 0,
    totalContactForms: 0,
    conversionRate: 0,
  },
]

export function getAllAffiliates(): Affiliate[] {
  return affiliates.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getAffiliateStats(): AffiliateStats {
  const totalAffiliates = affiliates.length
  const activeAffiliates = affiliates.filter((a) => a.status === "active").length
  const totalCommissions = affiliates.reduce((sum, a) => sum + a.totalEarnings, 0)
  const totalVisitors = affiliates.reduce((sum, a) => sum + a.totalVisitors, 0)
  const totalConversions = affiliates.reduce((sum, a) => sum + a.totalDemoForms + a.totalContactForms, 0)

  // Calculate monthly commissions (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthlyCommissions = affiliates
    .filter((a) => a.lastActivity && a.lastActivity >= thirtyDaysAgo)
    .reduce((sum, a) => sum + a.totalEarnings * 0.1, 0) // Assume 10% of total earnings are from last month

  return {
    totalAffiliates,
    activeAffiliates,
    totalCommissions,
    monthlyCommissions,
    totalVisitors,
    totalConversions,
  }
}

export function validateAffiliateCode(code: string): Affiliate | null {
  const affiliate = affiliates.find((a) => a.code.toUpperCase() === code.toUpperCase() && a.status === "active")
  return affiliate || null
}

export function updateAffiliate(id: string, updates: Partial<Affiliate>): boolean {
  const index = affiliates.findIndex((a) => a.id === id)
  if (index === -1) return false

  affiliates[index] = { ...affiliates[index], ...updates }
  return true
}

export function createAffiliate(
  data: Omit<
    Affiliate,
    "id" | "createdAt" | "totalEarnings" | "totalVisitors" | "totalDemoForms" | "totalContactForms" | "conversionRate"
  >,
): Affiliate {
  const newAffiliate: Affiliate = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    totalEarnings: 0,
    totalVisitors: 0,
    totalDemoForms: 0,
    totalContactForms: 0,
    conversionRate: 0,
  }

  affiliates.push(newAffiliate)
  return newAffiliate
}

export function deleteAffiliate(id: string): boolean {
  const index = affiliates.findIndex((a) => a.id === id)
  if (index === -1) return false

  affiliates.splice(index, 1)
  return true
}

export function trackAffiliateActivity(code: string, type: "visitor" | "demo" | "contact"): void {
  const affiliate = affiliates.find((a) => a.code.toUpperCase() === code.toUpperCase())
  if (!affiliate) return

  affiliate.lastActivity = new Date()

  switch (type) {
    case "visitor":
      affiliate.totalVisitors += 1
      break
    case "demo":
      affiliate.totalDemoForms += 1
      break
    case "contact":
      affiliate.totalContactForms += 1
      break
  }

  // Update conversion rate
  const totalConversions = affiliate.totalDemoForms + affiliate.totalContactForms
  affiliate.conversionRate = affiliate.totalVisitors > 0 ? totalConversions / affiliate.totalVisitors : 0
}

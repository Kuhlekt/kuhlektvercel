export interface AffiliateCode {
  code: string
  name: string
  category: "partner" | "influencer" | "employee" | "beta"
  discount: number
  commission: number
  description: string
  isActive: boolean
  expiresAt?: Date
}

const affiliateCodes: AffiliateCode[] = [
  // Partner Codes
  {
    code: "PARTNER2024",
    name: "Strategic Partner Program",
    category: "partner",
    discount: 25,
    commission: 15,
    description: "Exclusive partner discount for strategic alliances",
    isActive: true,
  },
  {
    code: "CONSULTING50",
    name: "Consulting Firm Partnership",
    category: "partner",
    discount: 20,
    commission: 12,
    description: "Special rate for consulting firm clients",
    isActive: true,
  },
  {
    code: "INTEGRATION15",
    name: "Integration Partner",
    category: "partner",
    discount: 15,
    commission: 10,
    description: "Discount for integration partner referrals",
    isActive: true,
  },

  // Influencer Codes
  {
    code: "FINTECH2024",
    name: "FinTech Influencer",
    category: "influencer",
    discount: 30,
    commission: 20,
    description: "Premium influencer rate for fintech thought leaders",
    isActive: true,
  },
  {
    code: "AREXPERT",
    name: "AR Industry Expert",
    category: "influencer",
    discount: 25,
    commission: 18,
    description: "Accounts receivable industry expert endorsement",
    isActive: true,
  },
  {
    code: "CFOLEADER",
    name: "CFO Network Leader",
    category: "influencer",
    discount: 20,
    commission: 15,
    description: "CFO network and community leader discount",
    isActive: true,
  },

  // Employee Codes
  {
    code: "TEAM2024",
    name: "Employee Referral",
    category: "employee",
    discount: 35,
    commission: 25,
    description: "Internal employee referral program",
    isActive: true,
  },
  {
    code: "SALES2024",
    name: "Sales Team Special",
    category: "employee",
    discount: 30,
    commission: 20,
    description: "Sales team networking referral",
    isActive: true,
  },

  // Beta Program Codes
  {
    code: "BETA2024",
    name: "Beta Program Participant",
    category: "beta",
    discount: 40,
    commission: 0,
    description: "Exclusive beta program participant discount",
    isActive: true,
    expiresAt: new Date("2024-12-31"),
  },
  {
    code: "EARLYBIRD",
    name: "Early Adopter Program",
    category: "beta",
    discount: 35,
    commission: 0,
    description: "Early adopter program special pricing",
    isActive: true,
    expiresAt: new Date("2024-06-30"),
  },

  // Industry-Specific Codes
  {
    code: "HEALTHCARE20",
    name: "Healthcare Industry",
    category: "partner",
    discount: 20,
    commission: 12,
    description: "Healthcare industry specialized discount",
    isActive: true,
  },
  {
    code: "MANUFACTURING",
    name: "Manufacturing Sector",
    category: "partner",
    discount: 18,
    commission: 10,
    description: "Manufacturing sector partnership discount",
    isActive: true,
  },
  {
    code: "RETAIL2024",
    name: "Retail Partnership",
    category: "partner",
    discount: 22,
    commission: 13,
    description: "Retail industry partnership program",
    isActive: true,
  },
  {
    code: "SAAS2024",
    name: "SaaS Company Discount",
    category: "partner",
    discount: 25,
    commission: 15,
    description: "SaaS company cross-promotion discount",
    isActive: true,
  },

  // Event and Conference Codes
  {
    code: "CONFERENCE2024",
    name: "Industry Conference",
    category: "influencer",
    discount: 15,
    commission: 8,
    description: "Industry conference attendee discount",
    isActive: true,
    expiresAt: new Date("2024-12-31"),
  },
  {
    code: "WEBINAR2024",
    name: "Webinar Participant",
    category: "influencer",
    discount: 12,
    commission: 6,
    description: "Webinar series participant discount",
    isActive: true,
  },

  // Regional Codes
  {
    code: "EUROPE2024",
    name: "European Market",
    category: "partner",
    discount: 18,
    commission: 10,
    description: "European market expansion discount",
    isActive: true,
  },
  {
    code: "APAC2024",
    name: "Asia-Pacific Region",
    category: "partner",
    discount: 20,
    commission: 12,
    description: "Asia-Pacific regional partnership",
    isActive: true,
  },

  // Volume-Based Codes
  {
    code: "ENTERPRISE50",
    name: "Enterprise Volume",
    category: "partner",
    discount: 30,
    commission: 18,
    description: "Enterprise volume commitment discount",
    isActive: true,
  },
  {
    code: "STARTUP2024",
    name: "Startup Program",
    category: "beta",
    discount: 45,
    commission: 0,
    description: "Startup accelerator program discount",
    isActive: true,
    expiresAt: new Date("2024-12-31"),
  },

  // Special Promotion Codes
  {
    code: "LAUNCH2024",
    name: "Product Launch Special",
    category: "beta",
    discount: 50,
    commission: 0,
    description: "Limited-time product launch promotion",
    isActive: true,
    expiresAt: new Date("2024-03-31"),
  },
  {
    code: "HOLIDAY2024",
    name: "Holiday Promotion",
    category: "influencer",
    discount: 25,
    commission: 15,
    description: "Holiday season special promotion",
    isActive: true,
    expiresAt: new Date("2024-12-31"),
  },

  // Referral Network Codes
  {
    code: "NETWORK2024",
    name: "Professional Network",
    category: "influencer",
    discount: 20,
    commission: 12,
    description: "Professional network referral discount",
    isActive: true,
  },
  {
    code: "COMMUNITY",
    name: "Community Member",
    category: "influencer",
    discount: 15,
    commission: 8,
    description: "Community member exclusive discount",
    isActive: true,
  },
]

export function validateAffiliateCode(code: string): AffiliateCode | null {
  const affiliate = affiliateCodes.find(
    (affiliate) => affiliate.code.toLowerCase() === code.toLowerCase() && affiliate.isActive,
  )

  if (!affiliate) {
    return null
  }

  // Check if code has expired
  if (affiliate.expiresAt && new Date() > affiliate.expiresAt) {
    return null
  }

  return affiliate
}

export function getAllAffiliateCodes(): AffiliateCode[] {
  return affiliateCodes.filter((code) => code.isActive)
}

export function getAffiliateCodesByCategory(category: AffiliateCode["category"]): AffiliateCode[] {
  return affiliateCodes.filter((code) => code.category === category && code.isActive)
}

interface AffiliateCode {
  code: string
  discount: number
  type: string
  description: string
  isActive: boolean
}

const affiliateCodes: AffiliateCode[] = [
  // Startup and Growth Codes
  { code: "STARTUP50", discount: 50, type: "Startup", description: "50% off for startups", isActive: true },
  { code: "GROWTH25", discount: 25, type: "Growth", description: "25% off for growing businesses", isActive: true },
  { code: "SMB40", discount: 40, type: "SMB", description: "40% off for small-medium businesses", isActive: true },

  // Industry-Specific Codes
  { code: "HEALTHCARE", discount: 15, type: "Industry", description: "Healthcare industry discount", isActive: true },
  {
    code: "MANUFACTURING",
    discount: 20,
    type: "Industry",
    description: "Manufacturing industry discount",
    isActive: true,
  },
  {
    code: "NONPROFIT",
    discount: 30,
    type: "Industry",
    description: "Non-profit organization discount",
    isActive: true,
  },
  {
    code: "EDUCATION",
    discount: 35,
    type: "Industry",
    description: "Educational institution discount",
    isActive: true,
  },
  { code: "GOVERNMENT", discount: 25, type: "Industry", description: "Government agency discount", isActive: true },

  // Partner and Channel Codes
  { code: "PARTNER001", discount: 20, type: "Partner", description: "Strategic partner discount", isActive: true },
  { code: "PARTNER002", discount: 25, type: "Partner", description: "Premium partner discount", isActive: true },
  { code: "RESELLER01", discount: 30, type: "Reseller", description: "Authorized reseller discount", isActive: true },
  { code: "CHANNEL01", discount: 22, type: "Channel", description: "Channel partner discount", isActive: true },
  { code: "AFFILIATE01", discount: 18, type: "Affiliate", description: "Affiliate partner discount", isActive: true },

  // Promotional Codes
  { code: "DISCOUNT20", discount: 20, type: "Promo", description: "General 20% discount", isActive: true },
  { code: "PROMO2024", discount: 15, type: "Promo", description: "2024 promotional discount", isActive: true },
  { code: "SPECIAL01", discount: 25, type: "Special", description: "Special offer discount", isActive: true },
  { code: "WELCOME15", discount: 15, type: "Welcome", description: "Welcome new customer discount", isActive: true },

  // VIP and Premium Codes
  { code: "VIP30", discount: 30, type: "VIP", description: "VIP customer discount", isActive: true },
  { code: "PREMIUM15", discount: 15, type: "Premium", description: "Premium service discount", isActive: true },
  { code: "ENTERPRISE", discount: 10, type: "Enterprise", description: "Enterprise customer discount", isActive: true },

  // Referral and Loyalty Codes
  { code: "REFERRAL10", discount: 10, type: "Referral", description: "Customer referral discount", isActive: true },
  { code: "LOYALTY25", discount: 25, type: "Loyalty", description: "Loyalty program discount", isActive: true },

  // Beta and Early Access Codes
  { code: "BETA35", discount: 35, type: "Beta", description: "Beta tester discount", isActive: true },
  { code: "EARLY45", discount: 45, type: "Early", description: "Early adopter discount", isActive: true },
]

export function validateAffiliate(code: string): {
  isValid: boolean
  code?: string
  discount?: number
  type?: string
  description?: string
} {
  if (!code || typeof code !== "string") {
    return { isValid: false }
  }

  const normalizedCode = code.trim().toUpperCase()
  const affiliate = affiliateCodes.find((item) => item.code === normalizedCode && item.isActive)

  if (affiliate) {
    return {
      isValid: true,
      code: affiliate.code,
      discount: affiliate.discount,
      type: affiliate.type,
      description: affiliate.description,
    }
  }

  return { isValid: false }
}

export function getAllAffiliateCodes(): AffiliateCode[] {
  return affiliateCodes.filter((code) => code.isActive)
}

export function getAffiliatesByType(type: string): AffiliateCode[] {
  return affiliateCodes.filter((code) => code.type === type && code.isActive)
}

export function getAffiliateDiscount(code: string): number {
  const affiliate = validateAffiliate(code)
  return affiliate.isValid ? affiliate.discount || 0 : 0
}

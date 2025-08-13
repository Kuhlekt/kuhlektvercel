"use server"

export interface AffiliateInfo {
  code: string
  name: string
  commission: number
  isActive: boolean
  isValid: boolean
  category?: string
  discount?: number
  description?: string
}

// Predefined list of valid affiliate codes
export const VALID_AFFILIATE_CODES = [
  "PARTNER2024",
  "GROWTH2024",
  "STARTUP2024",
  "ENTERPRISE2024",
  "REFERRAL2024",
  "DEMO2024",
  "TRIAL2024",
  "PREMIUM2024",
  "BUSINESS2024",
  "FINANCE2024",
]

// Predefined affiliate codes and their information
const AFFILIATE_CODES = {
  PARTNER001: {
    name: "TechPartner Solutions",
    commission: 15,
    isActive: true,
  },
  PARTNER002: {
    name: "FinanceExperts Inc",
    commission: 20,
    isActive: true,
  },
  PARTNER003: {
    name: "BusinessGrowth LLC",
    commission: 12,
    isActive: false,
  },
  DEMO2024: {
    name: "Demo Campaign 2024",
    commission: 10,
    isActive: true,
  },
  EARLY2024: {
    name: "Early Adopter Program",
    commission: 25,
    isActive: true,
  },
}

const affiliatePartners: Record<string, AffiliateInfo> = {
  // Accounting Firms
  ACCT2024: {
    code: "ACCT2024",
    name: "Premier Accounting Solutions",
    category: "accounting",
    discount: 15,
    commission: 10,
    description: "Accounting firm partnership program",
    isValid: true,
    isActive: true,
  },
  "CPA-GOLD": {
    code: "CPA-GOLD",
    name: "Gold Standard CPAs",
    category: "accounting",
    discount: 20,
    commission: 12,
    description: "Premium CPA firm partnership",
    isValid: true,
    isActive: true,
  },
  BOOKKEEP: {
    code: "BOOKKEEP",
    name: "Professional Bookkeepers Network",
    category: "accounting",
    discount: 12,
    commission: 8,
    description: "Bookkeeping services partnership",
    isValid: true,
    isActive: true,
  },

  // Technology Partners
  "TECH-INTG": {
    code: "TECH-INTG",
    name: "TechIntegrate Solutions",
    category: "technology",
    discount: 18,
    commission: 15,
    description: "Technology integration partnership",
    isValid: true,
    isActive: true,
  },
  "SAAS-ALLY": {
    code: "SAAS-ALLY",
    name: "SaaS Alliance Partners",
    category: "technology",
    discount: 25,
    commission: 20,
    description: "SaaS ecosystem partnership",
    isValid: true,
    isActive: true,
  },
  "CLOUD-PRO": {
    code: "CLOUD-PRO",
    name: "CloudPro Consultants",
    category: "technology",
    discount: 16,
    commission: 12,
    description: "Cloud consulting partnership",
    isValid: true,
    isActive: true,
  },

  // Consultants
  CONSULT1: {
    code: "CONSULT1",
    name: "Business Process Consultants",
    category: "consulting",
    discount: 22,
    commission: 18,
    description: "Business process consulting partnership",
    isValid: true,
    isActive: true,
  },
  "FINANCE-EXP": {
    code: "FINANCE-EXP",
    name: "Finance Experts Group",
    category: "consulting",
    discount: 20,
    commission: 15,
    description: "Financial consulting partnership",
    isValid: true,
    isActive: true,
  },
  "AR-SPECIALIST": {
    code: "AR-SPECIALIST",
    name: "AR Specialists Network",
    category: "consulting",
    discount: 24,
    commission: 20,
    description: "AR specialization partnership",
    isValid: true,
    isActive: true,
  },

  // Resellers
  "RESELL-PRO": {
    code: "RESELL-PRO",
    name: "Professional Resellers Inc",
    category: "reseller",
    discount: 30,
    commission: 25,
    description: "Authorized reseller program",
    isValid: true,
    isActive: true,
  },
  "CHANNEL-1": {
    code: "CHANNEL-1",
    name: "Channel One Partners",
    category: "reseller",
    discount: 28,
    commission: 22,
    description: "Channel partner program",
    isValid: true,
    isActive: true,
  },
  "DIST-NETWORK": {
    code: "DIST-NETWORK",
    name: "Distribution Network LLC",
    category: "reseller",
    discount: 26,
    commission: 20,
    description: "Distribution partnership",
    isValid: true,
    isActive: true,
  },

  // Industry Specific
  "MFG-FOCUS": {
    code: "MFG-FOCUS",
    name: "Manufacturing Focus Group",
    category: "industry",
    discount: 18,
    commission: 14,
    description: "Manufacturing industry specialization",
    isValid: true,
    isActive: true,
  },
  "HEALTHCARE-AR": {
    code: "HEALTHCARE-AR",
    name: "Healthcare AR Solutions",
    category: "industry",
    discount: 20,
    commission: 16,
    description: "Healthcare industry partnership",
    isValid: true,
    isActive: true,
  },
  "RETAIL-PLUS": {
    code: "RETAIL-PLUS",
    name: "Retail Plus Consultants",
    category: "industry",
    discount: 15,
    commission: 12,
    description: "Retail industry specialization",
    isValid: true,
    isActive: true,
  },

  // Special Programs
  "STARTUP-50": {
    code: "STARTUP-50",
    name: "Startup Accelerator Program",
    category: "special",
    discount: 50,
    commission: 5,
    description: "Special startup program",
    isValid: true,
    isActive: true,
  },
  NONPROFIT: {
    code: "NONPROFIT",
    name: "Nonprofit Organizations",
    category: "special",
    discount: 35,
    commission: 0,
    description: "Nonprofit discount program",
    isValid: true,
    isActive: true,
  },
  EDUCATION: {
    code: "EDUCATION",
    name: "Educational Institutions",
    category: "special",
    discount: 40,
    commission: 0,
    description: "Educational discount program",
    isValid: true,
    isActive: true,
  },

  // Regional Partners
  "WEST-COAST": {
    code: "WEST-COAST",
    name: "West Coast Partners",
    category: "regional",
    discount: 17,
    commission: 13,
    description: "West Coast regional partnership",
    isValid: true,
    isActive: true,
  },
  "MIDWEST-PRO": {
    code: "MIDWEST-PRO",
    name: "Midwest Professionals",
    category: "regional",
    discount: 16,
    commission: 12,
    description: "Midwest regional partnership",
    isValid: true,
    isActive: true,
  },
  SOUTHEAST: {
    code: "SOUTHEAST",
    name: "Southeast Business Network",
    category: "regional",
    discount: 18,
    commission: 14,
    description: "Southeast regional partnership",
    isValid: true,
    isActive: true,
  },

  // VIP Partners
  "VIP-PLATINUM": {
    code: "VIP-PLATINUM",
    name: "Platinum VIP Partners",
    category: "vip",
    discount: 35,
    commission: 30,
    description: "Platinum tier VIP partnership",
    isValid: true,
    isActive: true,
  },
  "VIP-GOLD": {
    code: "VIP-GOLD",
    name: "Gold VIP Partners",
    category: "vip",
    discount: 30,
    commission: 25,
    description: "Gold tier VIP partnership",
    isValid: true,
    isActive: true,
  },
  ENTERPRISE: {
    code: "ENTERPRISE",
    name: "Enterprise Partners",
    category: "vip",
    discount: 25,
    commission: 20,
    description: "Enterprise partnership program",
    isValid: true,
    isActive: true,
  },
}

/**
 * Validates if an affiliate code is in the approved list
 * @param code - The affiliate code to validate
 * @returns true if valid, false otherwise
 */
export function validateAffiliate(code: string): AffiliateInfo {
  const upperCode = code.toUpperCase().trim()
  const affiliate = AFFILIATE_CODES[upperCode as keyof typeof AFFILIATE_CODES]

  if (!affiliate) {
    return {
      code: upperCode,
      name: "",
      commission: 0,
      isActive: false,
      isValid: false,
    }
  }

  return {
    code: upperCode,
    name: affiliate.name,
    commission: affiliate.commission,
    isActive: affiliate.isActive,
    isValid: affiliate.isActive, // Only valid if active
  }
}

/**
 * Validates an affiliate code and returns it in uppercase if valid
 * @param code - The affiliate code to validate
 * @returns The validated code in uppercase or null if invalid
 */
export async function validateAffiliateCode(code: string): Promise<boolean> {
  try {
    if (!code || typeof code !== "string") {
      return false
    }

    const normalizedCode = code.trim().toUpperCase()

    // Check against predefined valid codes
    const isValid = VALID_AFFILIATE_CODES.includes(normalizedCode)

    // Log for tracking purposes
    if (isValid) {
      console.log(`Valid affiliate code used: ${normalizedCode}`)
    } else {
      console.log(`Invalid affiliate code attempted: ${normalizedCode}`)
    }

    return isValid
  } catch (error) {
    console.error("Error validating affiliate code:", error)
    return false
  }
}

/**
 * Gets the list of all valid affiliate codes (for admin use)
 * @returns Array of valid affiliate codes
 */
export function getValidAffiliateCodes(): string[] {
  return [...VALID_AFFILIATE_CODES]
}

/**
 * Normalizes an affiliate code to uppercase
 * @param code - The affiliate code to normalize
 * @returns Normalized code
 */
export function normalizeAffiliateCode(code: string): string {
  return code.trim().toUpperCase()
}

/**
 * Formats an affiliate code for display
 * @param code - The affiliate code to format
 * @returns Formatted affiliate code
 */
export function formatAffiliateCode(code: string): string {
  return normalizeAffiliateCode(code)
}

/**
 * Validates if an affiliate code is in the approved list and returns partner type
 * @param code - The affiliate code to validate
 * @returns Object with isValid boolean and partner string if valid, null otherwise
 */
export function getAffiliateInfo(code: string): AffiliateInfo | null {
  const upperCode = code.trim().toUpperCase()
  const affiliate = affiliatePartners[upperCode as keyof typeof affiliatePartners]

  if (!affiliate) {
    return null
  }

  return {
    code: upperCode,
    name: affiliate.name,
    commission: affiliate.commission,
    isActive: affiliate.isActive,
    isValid: affiliate.isValid,
    category: affiliate.category,
    discount: affiliate.discount,
    description: affiliate.description,
  }
}

export function getAllAffiliatePartners(): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isValid)
}

export function getAffiliatesByCategory(category: string): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isValid && partner.category === category)
}

export function getAllAffiliates(): AffiliateInfo[] {
  return Object.entries(AFFILIATE_CODES).map(([code, info]) => ({
    code,
    name: info.name,
    commission: info.commission,
    isActive: info.isActive,
    isValid: info.isActive,
  }))
}

export function getActiveAffiliates(): AffiliateInfo[] {
  return getAllAffiliates().filter((affiliate) => affiliate.isActive)
}

export function isAffiliateCodeRequired(): boolean {
  return false // Affiliate codes are optional
}

export function getAffiliateDiscount(code: string): number {
  const normalizedCode = code.trim().toUpperCase()

  // Define discount percentages for different codes
  const discounts: Record<string, number> = {
    PARTNER2024: 25,
    GROWTH2024: 20,
    STARTUP2024: 30,
    ENTERPRISE2024: 15,
    REFERRAL2024: 20,
    DEMO2024: 10,
    TRIAL2024: 15,
    PREMIUM2024: 20,
    BUSINESS2024: 15,
    FINANCE2024: 25,
  }

  return discounts[normalizedCode] || 0
}

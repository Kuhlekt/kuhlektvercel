"use server"

export interface AffiliateInfo {
  isValid: boolean
  code?: string
  name?: string
  commission?: number
  tier?: string
}

// Predefined list of valid affiliate codes
const VALID_AFFILIATE_CODES = [
  "PARTNER2024",
  "REFERRAL123",
  "CONSULTANT",
  "ADVISOR",
  "INTEGRATION",
  "RESELLER",
  "CHANNEL",
  "DEMO2024",
]

// Predefined affiliate codes for validation
const AFFILIATE_CODES: Record<string, Omit<AffiliateInfo, "isValid">> = {
  PARTNER001: {
    code: "PARTNER001",
    name: "Strategic Partner Alpha",
    commission: 15,
    tier: "gold",
  },
  PARTNER002: {
    code: "PARTNER002",
    name: "Strategic Partner Beta",
    commission: 12,
    tier: "silver",
  },
  REFERRAL001: {
    code: "REFERRAL001",
    name: "Customer Referral Program",
    commission: 10,
    tier: "bronze",
  },
  CONSULTANT001: {
    code: "CONSULTANT001",
    name: "Consulting Partner",
    commission: 20,
    tier: "platinum",
  },
  DEMO2024: {
    code: "DEMO2024",
    name: "Demo Campaign 2024",
    commission: 5,
    tier: "standard",
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
  },
  "CPA-GOLD": {
    code: "CPA-GOLD",
    name: "Gold Standard CPAs",
    category: "accounting",
    discount: 20,
    commission: 12,
    description: "Premium CPA firm partnership",
    isValid: true,
  },
  BOOKKEEP: {
    code: "BOOKKEEP",
    name: "Professional Bookkeepers Network",
    category: "accounting",
    discount: 12,
    commission: 8,
    description: "Bookkeeping services partnership",
    isValid: true,
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
  },
  "SAAS-ALLY": {
    code: "SAAS-ALLY",
    name: "SaaS Alliance Partners",
    category: "technology",
    discount: 25,
    commission: 20,
    description: "SaaS ecosystem partnership",
    isValid: true,
  },
  "CLOUD-PRO": {
    code: "CLOUD-PRO",
    name: "CloudPro Consultants",
    category: "technology",
    discount: 16,
    commission: 12,
    description: "Cloud consulting partnership",
    isValid: true,
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
  },
  "FINANCE-EXP": {
    code: "FINANCE-EXP",
    name: "Finance Experts Group",
    category: "consulting",
    discount: 20,
    commission: 15,
    description: "Financial consulting partnership",
    isValid: true,
  },
  "AR-SPECIALIST": {
    code: "AR-SPECIALIST",
    name: "AR Specialists Network",
    category: "consulting",
    discount: 24,
    commission: 20,
    description: "AR specialization partnership",
    isValid: true,
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
  },
  "CHANNEL-1": {
    code: "CHANNEL-1",
    name: "Channel One Partners",
    category: "reseller",
    discount: 28,
    commission: 22,
    description: "Channel partner program",
    isValid: true,
  },
  "DIST-NETWORK": {
    code: "DIST-NETWORK",
    name: "Distribution Network LLC",
    category: "reseller",
    discount: 26,
    commission: 20,
    description: "Distribution partnership",
    isValid: true,
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
  },
  "HEALTHCARE-AR": {
    code: "HEALTHCARE-AR",
    name: "Healthcare AR Solutions",
    category: "industry",
    discount: 20,
    commission: 16,
    description: "Healthcare industry partnership",
    isValid: true,
  },
  "RETAIL-PLUS": {
    code: "RETAIL-PLUS",
    name: "Retail Plus Consultants",
    category: "industry",
    discount: 15,
    commission: 12,
    description: "Retail industry specialization",
    isValid: true,
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
  },
  NONPROFIT: {
    code: "NONPROFIT",
    name: "Nonprofit Organizations",
    category: "special",
    discount: 35,
    commission: 0,
    description: "Nonprofit discount program",
    isValid: true,
  },
  EDUCATION: {
    code: "EDUCATION",
    name: "Educational Institutions",
    category: "special",
    discount: 40,
    commission: 0,
    description: "Educational discount program",
    isValid: true,
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
  },
  "MIDWEST-PRO": {
    code: "MIDWEST-PRO",
    name: "Midwest Professionals",
    category: "regional",
    discount: 16,
    commission: 12,
    description: "Midwest regional partnership",
    isValid: true,
  },
  SOUTHEAST: {
    code: "SOUTHEAST",
    name: "Southeast Business Network",
    category: "regional",
    discount: 18,
    commission: 14,
    description: "Southeast regional partnership",
    isValid: true,
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
  },
  "VIP-GOLD": {
    code: "VIP-GOLD",
    name: "Gold VIP Partners",
    category: "vip",
    discount: 30,
    commission: 25,
    description: "Gold tier VIP partnership",
    isValid: true,
  },
  ENTERPRISE: {
    code: "ENTERPRISE",
    name: "Enterprise Partners",
    category: "vip",
    discount: 25,
    commission: 20,
    description: "Enterprise partnership program",
    isValid: true,
  },
}

/**
 * Validates if an affiliate code is in the approved list
 * @param code - The affiliate code to validate
 * @returns true if valid, false otherwise
 */
export function validateAffiliate(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false
  }

  const normalizedCode = code.trim().toUpperCase()
  return VALID_AFFILIATE_CODES.includes(normalizedCode)
}

/**
 * Validates an affiliate code and returns it in uppercase if valid
 * @param code - The affiliate code to validate
 * @returns The validated code in uppercase or null if invalid
 */
export async function validateAffiliateCode(code: string): Promise<AffiliateInfo> {
  try {
    if (!code || typeof code !== "string") {
      return { isValid: false }
    }

    const normalizedCode = code.trim().toUpperCase()

    if (AFFILIATE_CODES[normalizedCode]) {
      return {
        isValid: true,
        ...AFFILIATE_CODES[normalizedCode],
      }
    }

    return { isValid: false }
  } catch (error) {
    console.error("Error validating affiliate code:", error)
    return { isValid: false }
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
  const normalizedCode = code.trim().toUpperCase()
  if (AFFILIATE_CODES[normalizedCode]) {
    return {
      isValid: true,
      ...AFFILIATE_CODES[normalizedCode],
    }
  }
  return null
}

export function getAllAffiliatePartners(): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isValid)
}

export function getAffiliatesByCategory(category: string): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isValid && partner.category === category)
}

export function getAllAffiliateCodes(): string[] {
  return Object.keys(AFFILIATE_CODES)
}

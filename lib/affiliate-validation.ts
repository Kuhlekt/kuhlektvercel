interface AffiliateInfo {
  code: string
  name: string
  category: string
  discount: number
  commission: number
  description: string
  isActive: boolean
}

// Predefined list of valid affiliate codes
const VALID_AFFILIATE_CODES = [
  "PARTNER001",
  "PARTNER002",
  "PARTNER003",
  "REFERRAL001",
  "REFERRAL002",
  "AGENCY001",
  "AGENCY002",
  "CONSULTANT001",
  "CONSULTANT002",
  "RESELLER001",
]

const affiliatePartners: Record<string, AffiliateInfo> = {
  // Accounting Firms
  ACCT2024: {
    code: "ACCT2024",
    name: "Premier Accounting Solutions",
    category: "accounting",
    discount: 15,
    commission: 10,
    description: "Accounting firm partnership program",
    isActive: true,
  },
  "CPA-GOLD": {
    code: "CPA-GOLD",
    name: "Gold Standard CPAs",
    category: "accounting",
    discount: 20,
    commission: 12,
    description: "Premium CPA firm partnership",
    isActive: true,
  },
  BOOKKEEP: {
    code: "BOOKKEEP",
    name: "Professional Bookkeepers Network",
    category: "accounting",
    discount: 12,
    commission: 8,
    description: "Bookkeeping services partnership",
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
    isActive: true,
  },
  "SAAS-ALLY": {
    code: "SAAS-ALLY",
    name: "SaaS Alliance Partners",
    category: "technology",
    discount: 25,
    commission: 20,
    description: "SaaS ecosystem partnership",
    isActive: true,
  },
  "CLOUD-PRO": {
    code: "CLOUD-PRO",
    name: "CloudPro Consultants",
    category: "technology",
    discount: 16,
    commission: 12,
    description: "Cloud consulting partnership",
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
    isActive: true,
  },
  "FINANCE-EXP": {
    code: "FINANCE-EXP",
    name: "Finance Experts Group",
    category: "consulting",
    discount: 20,
    commission: 15,
    description: "Financial consulting partnership",
    isActive: true,
  },
  "AR-SPECIALIST": {
    code: "AR-SPECIALIST",
    name: "AR Specialists Network",
    category: "consulting",
    discount: 24,
    commission: 20,
    description: "AR specialization partnership",
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
    isActive: true,
  },
  "CHANNEL-1": {
    code: "CHANNEL-1",
    name: "Channel One Partners",
    category: "reseller",
    discount: 28,
    commission: 22,
    description: "Channel partner program",
    isActive: true,
  },
  "DIST-NETWORK": {
    code: "DIST-NETWORK",
    name: "Distribution Network LLC",
    category: "reseller",
    discount: 26,
    commission: 20,
    description: "Distribution partnership",
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
    isActive: true,
  },
  "HEALTHCARE-AR": {
    code: "HEALTHCARE-AR",
    name: "Healthcare AR Solutions",
    category: "industry",
    discount: 20,
    commission: 16,
    description: "Healthcare industry partnership",
    isActive: true,
  },
  "RETAIL-PLUS": {
    code: "RETAIL-PLUS",
    name: "Retail Plus Consultants",
    category: "industry",
    discount: 15,
    commission: 12,
    description: "Retail industry specialization",
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
    isActive: true,
  },
  NONPROFIT: {
    code: "NONPROFIT",
    name: "Nonprofit Organizations",
    category: "special",
    discount: 35,
    commission: 0,
    description: "Nonprofit discount program",
    isActive: true,
  },
  EDUCATION: {
    code: "EDUCATION",
    name: "Educational Institutions",
    category: "special",
    discount: 40,
    commission: 0,
    description: "Educational discount program",
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
    isActive: true,
  },
  "MIDWEST-PRO": {
    code: "MIDWEST-PRO",
    name: "Midwest Professionals",
    category: "regional",
    discount: 16,
    commission: 12,
    description: "Midwest regional partnership",
    isActive: true,
  },
  SOUTHEAST: {
    code: "SOUTHEAST",
    name: "Southeast Business Network",
    category: "regional",
    discount: 18,
    commission: 14,
    description: "Southeast regional partnership",
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
    isActive: true,
  },
  "VIP-GOLD": {
    code: "VIP-GOLD",
    name: "Gold VIP Partners",
    category: "vip",
    discount: 30,
    commission: 25,
    description: "Gold tier VIP partnership",
    isActive: true,
  },
  ENTERPRISE: {
    code: "ENTERPRISE",
    name: "Enterprise Partners",
    category: "vip",
    discount: 25,
    commission: 20,
    description: "Enterprise partnership program",
    isActive: true,
  },
}

export async function validateAffiliateCode(code: string): Promise<string | null> {
  if (!code || typeof code !== "string") {
    return null
  }

  const upperCode = code.toUpperCase().trim()

  if (VALID_AFFILIATE_CODES.includes(upperCode)) {
    return upperCode
  }

  return null
}

export function getAllAffiliatePartners(): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isActive)
}

export function getAffiliatesByCategory(category: string): AffiliateInfo[] {
  return Object.values(affiliatePartners).filter((partner) => partner.isActive && partner.category === category)
}

/**
 * Validates if an affiliate code is in the approved list
 * @param affiliate - The affiliate code to validate
 * @returns The validated affiliate code in uppercase, or undefined if invalid
 */
export function validateAffiliate(affiliate: string | undefined): string | undefined {
  if (!affiliate) return undefined

  const upperAffiliate = affiliate.toUpperCase().trim()
  return VALID_AFFILIATE_CODES.includes(upperAffiliate) ? upperAffiliate : undefined
}

/**
 * Gets the list of all valid affiliate codes
 * @returns Array of valid affiliate codes
 */
export function getValidAffiliates(): string[] {
  return [...VALID_AFFILIATE_CODES]
}

/**
 * Checks if a given code is a valid affiliate code
 * @param code - The code to check
 * @returns True if the code is valid, false otherwise
 */
export function isValidAffiliateCode(code: string): boolean {
  return VALID_AFFILIATE_CODES.includes(code.toUpperCase().trim())
}

/**
 * Formats an affiliate code for display
 * @param affiliate - The affiliate code to format
 * @returns Formatted affiliate code or 'Direct' if invalid
 */
export function formatAffiliateCode(affiliate: string | undefined): string {
  if (!affiliate) return "Direct"

  const validated = validateAffiliate(affiliate)
  return validated || "Unknown"
}
